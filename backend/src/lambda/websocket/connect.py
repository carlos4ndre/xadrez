import logging
from src.models import Player, Connection
from src.auth.auth0 import decode_jwt_token

logger = logging.getLogger(__name__)


def handler(event, context):
    connectionID = event["requestContext"].get("connectionId")
    logger.info("Connect request from connectionID {})".format(connectionID))

    logger.info("Validate connectionID")
    if not connectionID:
        return {"statusCode": 500, "body": "ConnectionId is missing"}

    logger.info("Validate token")
    token = event.get("queryStringParameters", {}).get("token")
    if not token:
        return {"statusCode": 400, "body": "Token query parameter is missing"}

    logger.info("Verify the jwt token")
    try:
        payload = decode_jwt_token(token)
    except Exception as e:
        logger.error(e)
        return {"statusCode": 400, "body": "Failed to validate token"}

    try:
        logger.info("Add connectID to the database")
        Connection(
            id=connectionID,
            userId=payload["sub"]
        ).save()
    except Exception as e:
        logger.error(e)
        return {"statusCode": 500, "body": "Connect failed"}

    try:
        Player(
            id=payload["sub"],
            name=payload["name"],
            nickname=payload["nickname"],
            email=payload["email"],
            picture=payload["picture"]
        ).save()
    except Exception as e:
        logger.error(e)
        return {"statusCode": 500, "body": "Failed to update profile"}

    return {"statusCode": 200, "body": "Connect successful"}
