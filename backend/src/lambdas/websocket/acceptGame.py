import logging
import json
from datetime import datetime
from src.models import Game, Player
from src.constants import GameStatus
from src.helpers import create_aws_lambda_response, send_to_connection

logger = logging.getLogger(__name__)


def handler(event, context):
    connection_id = event["requestContext"].get("connectionId")
    logger.info("Accept game request from connectionId {})".format(connection_id))

    try:
        content = json.loads(event["body"])["content"]
        game_id = content["game"]["id"]
        player_id = event["requestContext"]["authorizer"]["principalId"]
    except KeyError as e:
        logger.error(e)
        return create_aws_lambda_response(500, "Failed to parse event")

    logger.info("Update game status")
    try:
        game = Game.get(game_id)
        if player_id not in [game.whitePlayerId, game.blackPlayerId]:
            return create_aws_lambda_response(500, "Player is not part of the game")

        game.update(
            actions=[
                Game.status.set(GameStatus.STARTED),
                Game.updatedAt.set(datetime.now())
            ]
        )
    except Exception as e:
        logger.error(e)
        return create_aws_lambda_response(500, "Game update failed")

    logger.info("Notify players")
    try:
        data = {
            "action": "startGame",
            "content": {"game": game.to_dict()}
        }
        player_ids = [game.whitePlayerId, game.blackPlayerId]
        for player in Player.batch_get(player_ids, attributes_to_get=["connectionId"]):
            send_to_connection(player.connectionId, data, event)
    except Exception as e:
        logger.error(e)
        return create_aws_lambda_response(500, "Failed to notify players")

    return create_aws_lambda_response(200, "Accept game successful")
