import logging

from datetime import datetime
from src.constants import PlayerStatus
from src.helpers.aws import create_aws_lambda_response
from src.bussiness_logic.auth import decode_jwt_token
from src.bussiness_logic.player import create_player, update_player

logger = logging.getLogger(__name__)


def handler(event, context):
    connection_id = event["requestContext"]["connectionId"]
    logger.info("Connect request from connectionId {})".format(connection_id))

    logger.info("Parse event")
    token, err = parse_event(event)
    if err:
        return create_aws_lambda_response(500, err)

    logger.info("Decode jwt token")
    payload, err = decode_jwt_token(token)
    if err:
        return create_aws_lambda_response(500, err)

    logger.info("Create player if not existent")
    player_id = payload["sub"]
    player = create_player(player_id)

    logger.info("Update player profile and connection info")
    new_data = {
        # user profile from auth0
        "name": payload["name"],
        "nickname": payload["nickname"],
        "email": payload["email"],
        "picture": payload["picture"],
        # user status
        "status": PlayerStatus.ONLINE,
        # user websocket connection
        "connectionId": connection_id,
        # record updated time
        "updatedAt": datetime.now(),
    }
    err = update_player(player, new_data)
    if err:
        return create_aws_lambda_response(500, err)
    return create_aws_lambda_response(200, "Connect successful")


def parse_event(event):
    try:
        token = event["queryStringParameters"]["token"]
        return token, ""
    except KeyError:
        return "", "Token is missing from query string parameters"
