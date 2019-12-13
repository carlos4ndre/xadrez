import json
import logging
from datetime import datetime

from src.constants import GameStatus
from src.lambdas.helpers import (
    create_aws_lambda_response,
    check_player_permissions,
    notify_player,
    get_opponent_id,
    update_game_state,
)
from src.models import Game

logger = logging.getLogger(__name__)


def handler(event, context):
    connection_id = event["requestContext"].get("connectionId")
    logger.info("Reject game request from connectionId {})".format(connection_id))

    logger.info("Parse event")
    data, err = parse_event(event)
    if err:
        return create_aws_lambda_response(500, err)
    game_id, challengee_id = data["game_id"], data["challengee_id"]
    game = Game.get(game_id)

    logger.info("Check player permissions")
    err = check_player_permissions(game, challengee_id)
    if err:
        return create_aws_lambda_response(500, err)

    logger.info("Update game state")
    attributes = {"status": GameStatus.REJECTED, "updatedAt": datetime.now()}
    err = update_game_state(game, attributes)
    if err:
        return create_aws_lambda_response(500, err)

    logger.info("Notify player")
    challenger_id = get_opponent_id(challengee_id, game)
    err = notify_player(challenger_id, "endGame", {"game": game.to_dict()})
    if err:
        return create_aws_lambda_response(500, err)
    return create_aws_lambda_response(200, "Reject game successful")


def parse_event(event):
    try:
        content = json.loads(event["body"])["content"]
        data = {
            "game_id": content["game"]["id"],
            "challengee_id": event["requestContext"]["authorizer"]["principalId"],
        }
        return data, ""
    except KeyError as e:
        logger.error(e)
        return {}, "Faield to parse event"
