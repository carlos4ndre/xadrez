import os
import boto3
import json
import logging
from src.models import Player

logger = logging.getLogger(__name__)

DEFAULT_AWS_RESPONSE_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Credentials": True,
}


def send_to_connection(connection_id, data):
    endpoint_url = os.environ["WEBSOCKET_API_ENDPOINT"]
    if os.environ.get("IS_OFFLINE") == "true":
        endpoint_url = "http://localhost:3001"
    gatewayapi = boto3.client("apigatewaymanagementapi", endpoint_url=endpoint_url)
    return gatewayapi.post_to_connection(
        ConnectionId=connection_id, Data=json.dumps(data).encode("utf-8")
    )


def generate_policy(principal_id, effect, resource):
    return {
        "principalId": principal_id,
        "policyDocument": {
            "Version": "2012-10-17",
            "Statement": [
                {"Action": "execute-api:Invoke", "Effect": effect, "Resource": resource}
            ],
        },
    }


def create_aws_lambda_response(status_code, body, headers=DEFAULT_AWS_RESPONSE_HEADERS):
    if not isinstance(body, str):
        body = json.dumps(body, indent=4, sort_keys=True)
    response = {"statusCode": status_code, "headers": headers, "body": body}
    logger.debug(response)
    return response


def get_authorizer_principal_id(event):
    if os.environ.get("IS_OFFLINE") == "true":
        connection_id = event["requestContext"].get("connectionId")
        for player in Player.scan():
            if player.connectionId == connection_id:
                return player.id
    return event["requestContext"]["authorizer"]["principalId"]
