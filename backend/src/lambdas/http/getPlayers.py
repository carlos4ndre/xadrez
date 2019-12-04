import logging
import json
from src.models.player import Player

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
        return {"statusCode": 500, "body": "Failed to get players"}

    return {
        "statusCode": 200,
        "headers": {
            "Access-Control-Allow-Origin": "*"
        },
        "body": json.dumps({
            "players": players
        })
    }
