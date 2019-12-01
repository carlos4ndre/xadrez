import logging
from src.models import Connection

logger = logging.getLogger(__name__)


def handler(event, context):
    connectionID = event["requestContext"].get("connectionId")
    logger.info("Disconnect request from connectionID {})".format(connectionID))

    try:
        logger.info("Remove connectID from the database")
        Connection(id=connectionID).delete()
        return {"statusCode": 200, "body": "Disconnect successful"}
    except Exception as e:
        logger.error(e)
        return {"statusCode": 500, "body": "Disconnect failed"}
