import json
import logging
import requests
from src.auth.auth0 import decode_jwt_token

logger = logging.getLogger(__name__)


def handler(event, context):
    logger.info("Authenticate user")
    if event["type"] == "TOKEN":
        auth_token = get_jwt_auth_token_from_http_headers(event)
    elif event["type"] == "REQUEST":
        auth_token = get_jwt_auth_token_from_query_string(event)
    else:
        raise Exception("Unsupported event: must be either TOKEN or REQUEST")

    logger.info(f"Client token: {auth_token}")
    logger.info(f"Method ARN: {event['methodArn']}")

    try:
        principal_id = decode_jwt_token(auth_token)["sub"]
        return generate_policy(principal_id, "Allow", event["methodArn"])
    except Exception as e:
        logger.error(f"Exception encountered: {e}")
        raise Exception("Unauthorized")


def get_jwt_auth_token_from_http_headers(event):
    raw_auth_token = event.get("authorizationToken")
    token_parts = raw_auth_token.split(" ")
    auth_token = token_parts[1]
    token_method = token_parts[0]
    if not (token_method.lower() == "bearer" and auth_token):
        logger.error("Failing due to invalid token_method or missing auth_token")
        raise Exception("Unauthorized")
    return auth_token


def get_jwt_auth_token_from_query_string(event):
    auth_token = event.get("queryStringParameters", {}).get("token")
    if not auth_token:
        logger.error("Failing due to missing auth_token")
        raise Exception("Unauthorized")
    return auth_token


def generate_policy(principal_id, effect, resource):
    return {
        "principalId": principal_id,
        "policyDocument": {
            "Version": "2012-10-17",
            "Statement": [
                {
                    "Action": "execute-api:Invoke",
                    "Effect": effect,
                    "Resource": resource

                }
            ]
        }
    }


def create_200_response(message):
    headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": True,
    }
    return create_aws_lambda_response(200, {"message": message}, headers)


def create_aws_lambda_response(status_code, message, headers):
    return {
        "statusCode": status_code,
        "headers": headers,
        "body": json.dumps(message)
    }
