import json
import logging

from src.lambdas.helpers import create_aws_lambda_response, notify_player, create_game
from src.models import Player

logger = logging.getLogger(__name__)


def handler(event, context):
    connection_id = event["requestContext"].get("connectionId")
    logger.info("Create game request from connectionId {})".format(connection_id))

    logger.info("Parse event")
    data, err = parse_event(event)
    if err:
        return create_aws_lambda_response(500, err)
    challenger_id, challengee_id = data["challenger_id"], data["challengee_id"]
    game_options = data["game_options"]

    logger.info("Create game")
    game, err = create_game(challenger_id, challengee_id, game_options)
    if err:
        return create_aws_lambda_response(500, err)

    logger.info("Notify player")
    challenger = Player.get(challenger_id)
    content = {
        "challenger": {
            "id": challenger.id,
            "name": challenger.name,
            "nickname": challenger.nickname,
            "picture": challenger.picture,
        },
        "game": game.to_dict(),
    }
    err = notify_player(challengee_id, "createGame", content)
    if err:
        return create_aws_lambda_response(500, "Failed to notify player")
    return create_aws_lambda_response(200, "Create game successful")


def parse_event(event):
    try:
        content = json.loads(event["body"])["content"]
        data = {
            "challenger_id": event["requestContext"]["authorizer"]["principalId"],
            "challengee_id": content["challengeeId"],
            "game_options": content["gameOptions"],
        }
        return data, ""
    except KeyError as e:
        logger.error(e)
        return {}, "Failed to parse event"
