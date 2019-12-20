import json
import logging

from src.helpers.aws import create_aws_lambda_response, get_authorizer_principal_id
from src.bussiness_logic.player import notify_players
from src.bussiness_logic.game import timeout_game
from src.models import Game

logger = logging.getLogger(__name__)


def handler(event, context):
    connection_id = event["requestContext"].get("connectionId")
    logger.info("Timeout game request from connectionId {})".format(connection_id))

    logger.info("Parse event")
    data, err = parse_event(event)
    if err:
        return create_aws_lambda_response(500, err)
    game_id, player_id = data["game_id"], data["player_id"]
    game = Game.get(game_id)

    logger.info("Check player permissions")
    if not game.is_player_in_game(player_id):
        return create_aws_lambda_response(403, "Player is not part of the game")

    logger.info("Timeout game")
    err = timeout_game(game, player_id)
    if err:
        return create_aws_lambda_response(500, err)

    logger.info("Notify players the game has ended")
    player_ids = [game.whitePlayerId, game.blackPlayerId]
    err = notify_players(player_ids, "endGame", {"game": game.to_dict()})
    if err:
        return create_aws_lambda_response(500, err)
    return create_aws_lambda_response(200, "Timeout game successful")


def parse_event(event):
    try:
        content = json.loads(event["body"])["content"]
        data = {
            "game_id": content["game"]["id"],
            "player_id": get_authorizer_principal_id(event),
        }
        return data, ""
    except KeyError as e:
        logger.error(e)
        return {}, "Faield to parse event"
