import logging
from datetime import datetime

from src.constants import PlayerStatus
from src.lambdas.helpers import create_aws_lambda_response, update_player
from src.models import Player

logger = logging.getLogger(__name__)


def handler(event, context):
    connection_id = event["requestContext"].get("connectionId")
    logger.info("Disconnect request from connectionId {})".format(connection_id))

    for player in Player.connectionIdIndex.query(connection_id):
        attributes = {"status": PlayerStatus.OFFLINE, "updatedAt": datetime.now()}
        err = update_player(player, attributes)
        if err:
            return create_aws_lambda_response(500, err)
    return create_aws_lambda_response(200, "Disconnect successful")
