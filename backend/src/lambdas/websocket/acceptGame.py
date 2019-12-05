import logging

logger = logging.getLogger(__name__)


def handler(event, context):
    connection_id = event["requestContext"].get("connectionId")
    logger.info("Accept game request from connectionId {})".format(connection_id))
    return {"statusCode": 200, "body": "Accept game successful"}
