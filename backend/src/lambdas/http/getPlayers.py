import logging
import json
from src.models.player import Player
from src.helpers import create_aws_lambda_response

logger = logging.getLogger(__name__)


def handler(event, context):
    try:
        players = []
        for player in Player.scan():
            data = player.to_dict()
            players.append({
                "id": data["id"],
                "name": data["name"],
                "nickname": data["nickname"],
                "email": data["email"],
                "picture": data["picture"],
                "status": data["status"]
            })
    except Exception as e:
        logger.error(e)
        return create_aws_lambda_response(500, "Failed to get players")

    return create_aws_lambda_response(200, {"players": players})
