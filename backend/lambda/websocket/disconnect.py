import logging
import os
import boto3

logger = logging.getLogger(__name__)

dynamodb = boto3.resource("dynamodb")


def handler(event, context):
    connectionID = event["requestContext"].get("connectionId")
    logger.info("Disconnect request from connectionID {})".format(connectionID))

    try:
        logger.info("Remove connectID from the database")
        table = dynamodb.Table(os.environ["CONNECTIONS_TABLE"])
        table.delete_item(Key={"id": connectionID})
        return {"statusCode": 200, "body": "Disconnect successful"}
    except Exception as e:
        logger.error(e)
        return {"statusCode": 500, "body": "Disconnect failed"}
