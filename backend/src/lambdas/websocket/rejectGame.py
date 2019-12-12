import json
import logging
from datetime import datetime

from src.constants import GameStatus
from src.helpers import create_aws_lambda_response, send_to_connection
from src.models import Game, Player

logger = logging.getLogger(__name__)


def handler(event, context):
    connection_id = event["requestContext"].get("connectionId")
    logger.info("Reject game request from connectionId {})".format(connection_id))

    try:
        content = json.loads(event["body"])["content"]
        game_id = content["game"]["id"]
        challengee_id = event["requestContext"]["authorizer"]["principalId"]
    except KeyError as e:
        logger.error(e)
        return create_aws_lambda_response(500, "Faield to parse event")

    logger.info("Update game status")
    try:
        game = Game.get(game_id)
        if challengee_id not in [game.whitePlayerId, game.blackPlayerId]:
            return create_aws_lambda_response(500, "Player is not part of the game")

        game.update(
            actions=[
                Game.status.set(GameStatus.REJECTED),
                Game.updatedAt.set(datetime.now()),
            ]
        )
    except Exception as e:
        logger.error(e)
        return create_aws_lambda_response(500, "Game update failed")

    logger.info("Notify player")
    try:
        challenger_id = (
            game.whitePlayerId
            if challengee_id == game.blackPlayerId
            else game.black_player_id
        )
        player = Player.get(challenger_id)
        data = {"action": "endGame", "content": {"game": game.to_dict()}}
        send_to_connection(player.connectionId, data, event)
    except Exception as e:
        logger.error(e)
        return create_aws_lambda_response(500, "Failed to notify player")

    return create_aws_lambda_response(200, "Rejecet game successful")
