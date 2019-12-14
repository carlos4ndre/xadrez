import json
import logging
from datetime import datetime

from src.lambdas.helpers import (
    create_aws_lambda_response,
    check_player_permissions,
    notify_players,
    create_message
)
from src.models import Game, Player

logger = logging.getLogger(__name__)


def handler(event, context):
    connection_id = event["requestContext"].get("connectionId")
    logger.info("Send message request from connectionId {})".format(connection_id))

    logger.info("Parse event")
    data, err = parse_event(event)
    if err:
        return create_aws_lambda_response(500, err)
    game_id, player_id, text = data["game_id"], data["player_id"], data["text"]
    game = Game.get(game_id)

    logger.info("Check player permissions")
    err = check_player_permissions(game, player_id)
    if err:
        return create_aws_lambda_response(500, err)

    logger.info("Generate message")
    sender = Player.get(player_id)
    message = generate_message(game.id, sender, text)

    logger.info("Save message")
    _, err = create_message(game_id, player_id, message["text"])
    if err:
        return create_aws_lambda_response(500, err)

    logger.info("Send message to players")
    player_ids = [game.whitePlayerId, game.blackPlayerId]
    err = notify_players(player_ids, "sendMessage", {"message": message})
    if err:
        return create_aws_lambda_response(500, err)
    return create_aws_lambda_response(200, "Send message successful")


def parse_event(event):
    try:
        content = json.loads(event["body"])["content"]
        data = {
            "game_id": content["game"]["id"],
            "player_id": event["requestContext"]["authorizer"]["principalId"],
            "text": content["text"],
        }
        return data, ""
    except KeyError as e:
        logger.error(e)
        return {}, "Failed to parse event"


def generate_message(room_id, player, text):
    return {
        "room_id": room_id,
        "author": {
            "id": player.id,
            "name": player.name,
            "picture": player.picture,
        },
        "text": text,
        "created_at": datetime.now().isoformat()
    }
