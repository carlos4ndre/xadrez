import os
import datetime
import pytz
import logging
import boto3
import jwt
import json
import requests

logger = logging.getLogger(__name__)

dynamodb = boto3.resource("dynamodb")


def handler(event, context):
    connectionID = event["requestContext"].get("connectionId")
    logger.info("Connect request from connectionID {})".format(connectionID))

    logger.info("Validate connectionID")
    if not connectionID:
        return {"statusCode": 500, "body": "ConnectionId is missing"}

    logger.info("Validate token")
    token = event.get("queryStringParameters", {}).get("token")
    if not token:
        return {"statusCode": 400, "body": "Token query parameter is missing"}

    logger.info("Verify the jwt token")
    try:
        payload = jwt.decode(token,
                             key=get_jwt_public_key(token),
                             audience=os.environ["AUTH0_CLIENT_ID"],
                             algorithms=['RS256'])
        logger.info("JWT token is valid")
        logger.debug(payload)
    except Exception as e:
        logger.error(e)
        return {"statusCode": 400, "body": "Failed to validate token"}

    try:
        logger.info("Add connectID to the database")
        item = {
            "id": connectionID,
            "userId": payload["sub"]
        }
        table = dynamodb.Table(os.environ["CONNECTIONS_TABLE"])
        table.put_item(Item=item)
    except Exception as e:
        logger.error(e)
        return {"statusCode": 500, "body": "Connect failed"}

    try:
        logger.info("Update player profile")
        profile_attribute_names = {
            "#name": "name",
            "#nickname": "nickname",
            "#email": "email",
            "#picture": "picture",
            "#updated_at": "updated_at"
        }
        profile_attribute_values = {
            ":name": payload["name"],
            ":nickname": payload["nickname"],
            ":email": payload["email"],
            ":picture": payload["picture"],
            ":updated_at": pytz.utc.localize(datetime.datetime.utcnow()).strftime('%Y-%m-%d %H:%M:%S %Z%z')
        }
        table = dynamodb.Table(os.environ["PLAYERS_TABLE"])
        table.update_item(
            Key={"id": payload["sub"]},
            UpdateExpression="set #name=:name, #nickname=:nickname, #picture=:picture, #email=:email, #updated_at=:updated_at",
            ExpressionAttributeNames=profile_attribute_names,
            ExpressionAttributeValues=profile_attribute_values
        )
    except Exception as e:
        logger.error(e)
        return {"statusCode": 500, "body": "Failed to update profile"}

    return {"statusCode": 200, "body": "Connect successful"}


def get_jwt_public_key(token):
    jwks_url = os.environ["AUTH0_JWKS_URL"]
    jwks = requests.get(jwks_url).json()
    public_keys = {}
    for jwk_key in jwks['keys']:
        kid = jwk_key['kid']
        public_keys[kid] = jwt.algorithms.RSAAlgorithm.from_jwk(json.dumps(jwk_key))
    kid = jwt.get_unverified_header(token)['kid']
    return public_keys[kid]
