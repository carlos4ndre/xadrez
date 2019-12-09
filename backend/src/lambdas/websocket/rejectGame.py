import logging
import json
from datetime import datetime
from src.models import Game, Player
from src.constants import GameStatus
from src.lambdas.websocket.utils import send_to_connection

logger = logging.getLogger(__name__)


def handler(event, context):
    connection_id = event["requestContext"].get("connectionId")
    logger.info("Reject game request from connectionId {})".format(connection_id))

    try:
        content = json.loads(event["body"])["content"]
        game_id = content["game"]["id"]
        challengee_id = event["requestContext"]["authorizer"]["principalId"]
        white_player_id = content["game"]["whitePlayerId"]
        black_player_id = content["game"]["blackPlayerId"]
        if white_player_id == challengee_id:
            challenger_id = black_player_id
        else:
            challenger_id = white_player_id
    except KeyError as e:
        logger.error("Failed to parse event: {}".format(e))

    logger.info("Update game status")
    try:
        game = Game.get(game_id)
        if (game.whitePlayerId != white_player_id and
            game.blackPlayerId != black_player_id):
            logger.error("White/Black player ids do not match with those in game")
            return {"statusCode": 500, "body": "Game update failed"}

        game.update(
            actions=[
                Game.status.set(GameStatus.REJECTED),
                Game.updatedAt.set(datetime.now())
            ]
        )
    except Exception as e:
        logger.error(e)
        return {"statusCode": 500, "body": "Game update failed"}

    logger.info("Notify player")
    try:
        player = Player.get(challenger_id)
        data = {
            "action": "endGame",
            "content": {"game": game.to_dict()}
        }
        send_to_connection(player.connectionId, data, event)
    except Exception as e:
        logger.error(e)
        return {"statusCode": 500, "body": "Failed to notify player"}

    return {"statusCode": 200, "body": "Rejecet game successful"}
