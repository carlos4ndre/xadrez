import logging

from src.lambdas.helpers import create_aws_lambda_response, get_authorizer_principal_id
from src.models.player import Player

logger = logging.getLogger(__name__)

GET_PLAYER_FIELDS = ["id", "name", "nickname", "email", "picture", "status"]


def handler(event, context):
    logger.info("Parse event")
    data, err = parse_event(event)
    if err:
        return create_aws_lambda_response(500, err)
    player_id = data["player_id"]

    logger.info("Get players")
    try:
        players = []
        filter_condition = Player.id != player_id
        for player in Player.scan(
            attributes_to_get=GET_PLAYER_FIELDS, filter_condition=filter_condition
        ):
            players.append(player.to_dict())
    except Exception as e:
        logger.error(e)
        return create_aws_lambda_response(500, "Failed to get players")

    return create_aws_lambda_response(200, {"players": players})


def parse_event(event):
    try:
        return (
            {"player_id": get_authorizer_principal_id(event)},
            "",
        )
    except KeyError as e:
        logger.error(e)
        return {}, "Failed to parse event"
