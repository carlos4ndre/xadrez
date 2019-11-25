import os
import logging
import jwt
import json
import requests

logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)


def handler(event, context):
    # check connectionID and token are set
    logger.info("Validate connectionID")
    connectionID = event["requestContext"].get("connectionId")
    if not connectionID:
        return {"statusCode": 500, "body": "ConnectionId is missing"}

    logger.info("Validate token")
    token = event.get("queryStringParameters", {}).get("token")
    if not token:
        return {"statusCode": 400, "body": "Token query parameter is missing"}

    # Verify the jwt token
    try:
        logger.info("Verify the jwt token")
        payload = jwt.decode(token,
                             key=get_jwt_public_key(token),
                             audience=os.environ["AUTH0_CLIENT_ID"],
                             algorithms=['RS256'])
        logger.info("JWT token is valid")
        logger.debug(payload)
    except Exception as e:
        logger.error(e)
        return {"statusCode": 400, "body": "Failed to validate token"}
    return {"statusCode": 200, "body": ""}


def get_jwt_public_key(token):
    jwks_url = os.environ["AUTH0_JWKS_URL"]
    jwks = requests.get(jwks_url).json()
    public_keys = {}
    for jwk_key in jwks['keys']:
        kid = jwk_key['kid']
        public_keys[kid] = jwt.algorithms.RSAAlgorithm.from_jwk(json.dumps(jwk_key))
    kid = jwt.get_unverified_header(token)['kid']
    return public_keys[kid]
