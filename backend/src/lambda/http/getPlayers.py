import os
import logging
import boto3
import json

logger = logging.getLogger(__name__)

dynamodb = boto3.resource("dynamodb")


def handler(event, context):
    try:
        logger.info("Get Players")
        table = dynamodb.Table(os.environ["PLAYERS_TABLE"])
        response = table.scan()
        players = response['Items']
        while 'LastEvaluatedKey' in response:
            response = table.scan(ExclusiveStartKey=response['LastEvaluatedKey'])
            players.extend(response['Items'])
    except Exception as e:
        logger.error(e)
        return {"statusCode": 500, "body": "Connect failed"}

    return {
        "statusCode": 200,
        "headers": {
            "Access-Control-Allow-Origin": "*"
        },
        "body": json.dumps({
            "players": players
        })
    }
