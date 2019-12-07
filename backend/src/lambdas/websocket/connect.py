import logging
from datetime import datetime
from src.models import Player
from src.constants import PlayerStatus
from src.auth.auth0 import decode_jwt_token

logger = logging.getLogger(__name__)


def handler(event, context):
    connection_id = event["requestContext"].get("connectionId")
    logger.info("Connect request from connectionId {})".format(connection_id))

    logger.info("Validate connectionId")
    if not connection_id:
        return {"statusCode": 500, "body": "connectionId is missing"}

    logger.info("Validate jwt token")
    token = event.get("queryStringParameters", {}).get("token")
    if not token:
        return {"statusCode": 400, "body": "token is missing from query string parameters"}

    logger.info("Decode jwt token")
    try:
        payload = decode_jwt_token(token)
    except Exception as e:
        logger.error(e)
        return {"statusCode": 400, "body": "Failed to decode token"}

    player_id = payload["sub"]
    try:
        logger.info("Get player info")
        player = Player.get(player_id)
    except Player.DoesNotExist as e:
        logger.info("New player connecting, using defaults")
        player = Player(id=player_id)

    try:
        logger.info("Update player profile and connection info")
        player.update(actions=[
            # user profile from auth0
            Player.name.set(payload["name"]),
            Player.nickname.set(payload["nickname"]),
            Player.email.set(payload["email"]),
            Player.picture.set(payload["picture"]),

            # user status
            Player.status.set(PlayerStatus.ONLINE),

            # user websocket connection
            Player.connectionId.set(connection_id),

            # record updated time
            Player.updatedAt.set(datetime.now())
        ])
    except Exception as e:
        logger.error(e)
        return {"statusCode": 500, "body": "Failed to update profile"}

    return {"statusCode": 200, "body": "Connect successful"}
