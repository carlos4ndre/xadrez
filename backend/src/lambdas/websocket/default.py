import logging

logger = logging.getLogger(__name__)


def handler(event, context):
    connectionID = event["requestContext"].get("connectionId")
    logger.info("default request (CID: {})".format(connectionID))

    return {
        "statusCode": 400,
        "body": "Unrecognized WebSocket action."
    }
