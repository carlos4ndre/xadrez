import logging
from datetime import datetime
from src.models import Player
from src.constants import PlayerStatus
from src.helpers import create_aws_lambda_response

logger = logging.getLogger(__name__)


def handler(event, context):
    connection_id = event["requestContext"].get("connectionId")
    logger.info("Disconnect request from connectionId {})".format(connection_id))

    try:
        logger.info("Update player status")
        for player in Player.connectionIdIndex.query(connection_id):
            player.update(actions=[
                Player.status.set(PlayerStatus.OFFLINE),
                Player.updatedAt.set(datetime.now())
            ])
        return create_aws_lambda_response(200, "Disconnect successful")
    except Exception as e:
        logger.error(e)
        return create_aws_lambda_response(500, "Disconnect failed")
