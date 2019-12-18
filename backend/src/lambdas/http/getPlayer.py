import logging

from src.lambdas.helpers import create_aws_lambda_response
from src.models.player import Player

logger = logging.getLogger(__name__)


def handler(event, context):
    logger.info("Parse event")
    data, err = parse_event(event)
    if err:
        return create_aws_lambda_response(500, err)
    player_id = data["id"]

    logger.info("Get player")
    try:
        player = Player.get(player_id)
        return player.to_dict()
    except Exception as e:
        logger.error(e)
        return create_aws_lambda_response(500, "Failed to get player")

    return create_aws_lambda_response(200, {"player": player})


def parse_event(event):
    try:
        data = {
            "id": event["pathParameters"]["id"]
        }
        return data, ""
    except KeyError as e:
        logger.error(e)
        return {}, "Failed to parse event"
