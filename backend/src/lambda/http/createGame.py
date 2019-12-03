import logging
import json

logger = logging.getLogger(__name__)


def handler(event, context):
    game = {}

    return {
        "statusCode": 201,
        "headers": {
            "Access-Control-Allow-Origin": "*"
        },
        "body": json.dumps({
            "game": game
        })
    }
