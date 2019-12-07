import logging
from datetime import datetime
from src.models import Player
from src.constants import PlayerStatus

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
        return {"statusCode": 200, "body": "Disconnect successful"}
    except Exception as e:
        logger.error(e)
        return {"statusCode": 500, "body": "Disconnect failed"}
