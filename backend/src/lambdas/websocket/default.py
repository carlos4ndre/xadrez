import logging

from src.helpers.aws import create_aws_lambda_response

logger = logging.getLogger(__name__)


def handler(event, context):
    connectionID = event["requestContext"].get("connectionId")
    logger.info("default request (CID: {})".format(connectionID))

    return create_aws_lambda_response(400, "Unrecognized WebSocket action")
