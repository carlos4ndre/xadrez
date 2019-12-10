import logging
import json
from src.models import Game, Player
from src.lambdas.websocket.utils import send_to_connection

logger = logging.getLogger(__name__)


def handler(event, context):
    connection_id = event["requestContext"].get("connectionId")
    logger.info("Send message request from connectionId {})".format(connection_id))

    try:
        content = json.loads(event["body"])["content"]
        text = content["text"]
        game_id = content["game"]["id"]
        player_id = event["requestContext"]["authorizer"]["principalId"]
    except KeyError as e:
        logger.error("Failed to parse event: {}".format(e))

    logger.info("Check player can send message")
    try:
        game = Game.get(game_id)
        if player_id not in [game.whitePlayerId, game.blackPlayerId]:
            logger.error("Player is not part of the game")
            return {"statusCode": 500, "body": "Send message failed"}
    except Exception as e:
        logger.error(e)
        return {"statusCode": 500, "body": "Send message failed"}

    try:
        logger.info("Send message to player")
        target_player_id = game.whitePlayerId if player_id != game.whitePlayerId else game.blackPlayerId
        target_player = Player.get(target_player_id)
        data = {
            "action": "sendMessage",
            "content": {"text": text, "game": game.to_dict()}
        }
        send_to_connection(target_player.connectionId, data, event)
        return {"statusCode": 200, "body": "Send message successful"}
    except Exception as e:
        logger.error(e)
        return {"statusCode": 500, "body": "Failed to notify player"}

    return {"statusCode": 200, "body": "Send message successful"}
