import logging

from src.auth.auth0 import decode_jwt_token
from src.helpers.aws import create_aws_lambda_response, generate_policy

logger = logging.getLogger(__name__)


def handler(event, context):
    logger.info("Authenticate user")
    logger.info(f"Method ARN: {event['methodArn']}")

    try:
        auth_token = get_auth_token(event)
        logger.info(f"Client token: {auth_token}")

        principal_id = decode_jwt_token(auth_token)["sub"]
        return generate_policy(principal_id, "Allow", event["methodArn"])
    except Exception as e:
        return create_aws_lambda_response(400, {"error": str(e)})


def get_auth_token(event):
    if event["type"] == "TOKEN":
        return get_jwt_auth_token_from_http_headers(event)
    elif event["type"] == "REQUEST":
        return get_jwt_auth_token_from_query_string(event)
    else:
        raise Exception("Unsupported event: must be either TOKEN or REQUEST")


def get_jwt_auth_token_from_http_headers(event):
    raw_auth_token = event.get("authorizationToken", "")
    token_parts = raw_auth_token.split(" ")
    if len(token_parts) != 2:
        raise Exception("The authorizationToken must be of format: Bearer <jwtToken>")

    auth_token = token_parts[1]
    token_method = token_parts[0]
    if not (token_method.lower() == "bearer" and auth_token):
        raise Exception("Failing due to invalid token_method or missing auth_token")
    return auth_token


def get_jwt_auth_token_from_query_string(event):
    auth_token = event.get("queryStringParameters", {}).get("token")
    if not auth_token:
        raise Exception("Failing due to missing auth_token")
    return auth_token
