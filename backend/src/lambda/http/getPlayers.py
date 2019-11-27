import logging
import json

logger = logging.getLogger(__name__)


def handler(event, context):
    logger.info("Get players")
    data = {
        "players": [
            {'id': '1', 'name': 'toze', 'nickname': 'tomatos', 'picture': ''},
            {'id': '2', 'name': 'batman', 'nickname': 'bruce', 'picture': ''},
            {'id': '3', 'name': 'luffy', 'nickname': 'muggywara', 'picture': ''}
        ]
    }

    return {
        "statusCode": 200,
        "headers": {
            "Access-Control-Allow-Origin": "*"
        },
        "body": json.dumps(data)
    }
