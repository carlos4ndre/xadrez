import logging

logger = logging.getLogger(__name__)


def handler(event, context):
    connectionID = event["requestContext"].get("connectionId")
    logger.info("Disconnect request (CID: {})".format(connectionID))

    return {
        "statusCode": 200,
        "body": ""
    }
