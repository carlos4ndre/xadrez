import json
import logging
from datetime import datetime

from src.constants import GameStatus
from src.lambdas.helpers import (
    create_aws_lambda_response,
    check_player_permissions,
    notify_players,
    update_game_state,
)
from src.models import Game

logger = logging.getLogger(__name__)


def handler(event, context):
    connection_id = event["requestContext"].get("connectionId")
    logger.info("Accept game request from connectionId {})".format(connection_id))

    logger.info("Parse event")
    data, err = parse_event(event)
    if err:
        return create_aws_lambda_response(500, err)

    logger.info("Check player permissions")
    game_id, player_id = data["game_id"], data["player_id"]
    game = Game.get(game_id)
    err = check_player_permissions(game, player_id)
    if err:
        return create_aws_lambda_response(403, err)

    logger.info("Update game state")
    attributes = {"status": GameStatus.STARTED, "updatedAt": datetime.now()}
    err = update_game_state(game, attributes)
    if err:
        return create_aws_lambda_response(500, err)

    logger.info("Notify players")
    player_ids = [game.whitePlayerId, game.blackPlayerId]
    err = notify_players(player_ids, "startGame", {"game": game.to_dict()})
    if err:
        return create_aws_lambda_response(500, err)

    return create_aws_lambda_response(200, "Accept game successful")


def parse_event(event):
    try:
        content = json.loads(event["body"])["content"]
        return (
            {
                "game_id": content["game"]["id"],
                "player_id": event["requestContext"]["authorizer"]["principalId"],
            },
            "",
        )
    except KeyError as e:
        logger.error(e)
        return {}, "Failed to parse event"
