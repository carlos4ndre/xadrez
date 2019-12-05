import logging
import json
from datetime import datetime
from src.models import Game, Player
from src.constants import GameStatus
from src.lambdas.websocket.utils import send_to_connection

logger = logging.getLogger(__name__)


def handler(event, context):
    connection_id = event["requestContext"].get("connectionId")
    logger.info("Accept game request from connectionId {})".format(connection_id))

    try:
        content = json.loads(event["body"])["content"]
        game_id = content["game"]["id"]
        challengee_id = event["requestContext"]["authorizer"]["principalId"]
        white_player_id = content["game"]["white_player_id"]
        black_player_id = content["game"]["black_player_id"]
        if white_player_id == challengee_id:
            challenger_id = black_player_id
        else:
            challenger_id = white_player_id
    except KeyError as e:
        logger.error("Failed to parse event: {}".format(e))

    logger.info("Update game status")
    try:
        game = Game.get(game_id)
        if (game.white_player_id != white_player_id and
            game.black_player_id != black_player_id):
            logger.error("White/Black player ids do not match with those in game")
            return {"statusCode": 500, "body": "Game update failed"}

        game.update(
            actions=[
                Game.status.set(GameStatus.STARTED),
                Game.updated_at.set(datetime.now())
            ]
        )
    except Exception as e:
        logger.error(e)
        return {"statusCode": 500, "body": "Game update failed"}

    logger.info("Notify users")
    try:
        data = {
            "action": "startGame",
            "content": {"game": game.to_dict()}
        }
        player_ids = list(set([challenger_id, challengee_id]))
        for player in Player.batch_get(player_ids, attributes_to_get=["connection_id"]):
            send_to_connection(player.connection_id, data, event)
    except Exception as e:
        logger.error(e)
        return {"statusCode": 500, "body": "Failed to send start game to players"}

    return {"statusCode": 200, "body": "Game accept successful"}
