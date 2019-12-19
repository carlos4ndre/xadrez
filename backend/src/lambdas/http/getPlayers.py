import logging

from src.helpers.aws import create_aws_lambda_response
from src.bussiness_logic.player import get_players

logger = logging.getLogger(__name__)


def handler(event, context):
    logger.info("Get players")
    players, err = get_players()
    if err:
        return create_aws_lambda_response(500, err)
    return create_aws_lambda_response(200, {"players": players})
