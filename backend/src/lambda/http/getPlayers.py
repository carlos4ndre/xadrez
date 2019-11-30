import logging
import json

logger = logging.getLogger(__name__)


def handler(event, context):
    logger.info("Get players")
    data = {
        "players": [
            {'id': '1', 'name': 'toze', 'email': 'toze@test.com', 'nickname': 'tomatos', 'picture': ''},
            {'id': '2', 'name': 'batman', 'email': 'batman@test.com', 'nickname': 'bruce', 'picture': ''},
            {'id': '3', 'name': 'luffy', 'email': 'luffy@test.com', 'nickname': 'muggywara', 'picture': ''}
        ]
    }

    return {
        "statusCode": 200,
        "headers": {
            "Access-Control-Allow-Origin": "*"
        },
        "body": json.dumps(data)
    }
