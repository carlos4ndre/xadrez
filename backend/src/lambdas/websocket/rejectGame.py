import json
import logging

from src.helpers.aws import create_aws_lambda_response, get_authorizer_principal_id
from src.bussiness_logic.player import notify_player
from src.bussiness_logic.game import reject_game
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
    if not game.is_player_in_game(challengee_id):
        return create_aws_lambda_response(403, "Player is not part of the game")

    logger.info("Reject game")
    err = reject_game(game, challengee_id)
    if err:
        return create_aws_lambda_response(500, err)

    logger.info("Notify player")
    challenger_id = game.get_opponent_id(challengee_id)
    err = notify_player(challenger_id, "endGame", {"game": game.to_dict()})
    if err:
        return create_aws_lambda_response(500, err)
    return create_aws_lambda_response(200, "Reject game successful")


def parse_event(event):
    try:
        content = json.loads(event["body"])["content"]
        data = {
            "game_id": content["game_id"],
            "challengee_id": get_authorizer_principal_id(event),
        }
        return data, ""
    except KeyError as e:
        logger.error(e)
        return {}, "Faield to parse event"
