import logging

from src.lambdas.helpers import create_aws_lambda_response
from src.models.player import Player

logger = logging.getLogger(__name__)

GET_PLAYER_FIELDS = ["id", "name", "nickname", "email", "picture", "status"]
MAX_RECORD_LIMIT = 50


def handler(event, context):
    logger.info("Get players")
    try:
        players = []
        for player in Player.scan(
            attributes_to_get=GET_PLAYER_FIELDS,
            limit=MAX_RECORD_LIMIT
        ):
            players.append(player.to_dict())
    except Exception as e:
        logger.error(e)
        return create_aws_lambda_response(500, "Failed to get players")

    return create_aws_lambda_response(200, {"players": players})
