import logging
import json
from datetime import datetime
from src.models import Game, Player
from src.helpers import create_aws_lambda_response, send_to_connection

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
        logger.error(e)
        return create_aws_lambda_response(500, "Failed to parse event")

    logger.info("Check player can send message")
    try:
        game = Game.get(game_id)
        if player_id not in [game.whitePlayerId, game.blackPlayerId]:
            return create_aws_lambda_response(500, "Player is not part of the game")
    except Exception as e:
        logger.error(e)
        return create_aws_lambda_response(500, "Send message failed")

    try:
        logger.info("Generate message")
        sender = Player.get(player_id)
        data = generate_message(game.id, sender, text)

        logger.info("Send message to players")
        for player in Player.batch_get([game.whitePlayerId, game.blackPlayerId]):
            send_to_connection(player.connectionId, data, event)
        return create_aws_lambda_response(200, "Send message successful")
    except Exception as e:
        logger.error(e)
        return create_aws_lambda_response(500, "Failed to notify player")

    return create_aws_lambda_response(200, "Send message successful")


def generate_message(room_id, player, text):
    return {
        "action": "sendMessage",
        "content": {
            "message": {
                "room_id": room_id,
                "author": {
                    "id": player.id,
                    "name": player.name,
                    "picture": player.picture
                },
                "text": text,
                "created_at": datetime.now().isoformat()
            }
        }
    }
