import logging

from src.helpers.aws import create_aws_lambda_response
from src.bussiness_logic.player import get_player

logger = logging.getLogger(__name__)


def handler(event, context):
    logger.info("Parse event")
    data, err = parse_event(event)
    if err:
        return create_aws_lambda_response(500, err)
    player_id = data["id"]

    logger.info("Get player")
    player, err = get_player(player_id)
    if err:
        return create_aws_lambda_response(500, err)

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
