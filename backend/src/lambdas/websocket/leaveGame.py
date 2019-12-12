import json
import logging
from datetime import datetime

from src.constants import GameColor, GameResult, GameStatus
from src.helpers import create_aws_lambda_response, send_to_connection
from src.models import Game, Player

logger = logging.getLogger(__name__)


def handler(event, context):
    connection_id = event["requestContext"].get("connectionId")
    logger.info("Leave game request from connectionId {})".format(connection_id))

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

        player_color = (
            GameColor.WHITE if player_id == game.whitePlayerId else GameColor.BLACK
        )
        result = (
            GameResult.BLACK_WINS
            if player_color == GameColor.WHITE
            else GameResult.WHITE_WINS
        )
        game.update(
            actions=[
                Game.status.set(GameStatus.RESIGNED),
                Game.result.set(result),
                Game.updatedAt.set(datetime.now()),
            ]
        )
    except Exception as e:
        logger.error(e)
        return create_aws_lambda_response(500, "Game update failed")

    logger.info("Notify players")
    try:
        data = {"action": "endGame", "content": {"game": game.to_dict()}}
        player_ids = [game.whitePlayerId, game.blackPlayerId]
        for player in Player.batch_get(player_ids, attributes_to_get=["connectionId"]):
            send_to_connection(player.connectionId, data, event)
    except Exception as e:
        logger.error(e)
        return create_aws_lambda_response(500, "Failed to notify players")

    return create_aws_lambda_response(200, "Leave game successful")
