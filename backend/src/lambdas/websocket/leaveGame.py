import logging
import json
from datetime import datetime
from src.models import Game, Player
from src.constants import GameStatus, GameResult, GameColor
from src.lambdas.websocket.utils import send_to_connection

logger = logging.getLogger(__name__)


def handler(event, context):
    connection_id = event["requestContext"].get("connectionId")
    logger.info("Leave game request from connectionId {})".format(connection_id))

    try:
        content = json.loads(event["body"])["content"]
        game_id = content["game"]["id"]
        player_id = event["requestContext"]["authorizer"]["principalId"]
        white_player_id = content["game"]["whitePlayerId"]
        black_player_id = content["game"]["blackPlayerId"]
        player_color = (GameColor.WHITE if player_id == white_player_id else GameColor.BLACK)
    except KeyError as e:
        logger.error("Failed to parse event: {}".format(e))

    logger.info("Update game status")
    try:
        if player_id not in [white_player_id, black_player_id]:
            logger.error("Player is not part of the game")
            return {"statusCode": 500, "body": "Move failed"}

        game = Game.get(game_id)
        if (game.whitePlayerId != white_player_id and
            game.blackPlayerId != black_player_id):
            logger.error("White/Black player ids do not match with those in game")
            return {"statusCode": 500, "body": "Game update failed"}

        result = (GameResult.BLACK_WINS if player_color == GameColor.WHITE else GameResult.WHITE_WINS)
        game.update(
            actions=[
                Game.status.set(GameStatus.RESIGNED),
                Game.result.set(result),
                Game.updatedAt.set(datetime.now())
            ]
        )
    except Exception as e:
        logger.error(e)
        return {"statusCode": 500, "body": "Game update failed"}

    logger.info("Notify players")
    try:
        data = {
            "action": "endGame",
            "content": {"game": game.to_dict()}
        }
        player_ids = [white_player_id, black_player_id]
        for player in Player.batch_get(player_ids, attributes_to_get=["connectionId"]):
            send_to_connection(player.connectionId, data, event)
    except Exception as e:
        logger.error(e)
        return {"statusCode": 500, "body": "Failed to notify players"}

    return {"statusCode": 200, "body": "Leave game successful"}
