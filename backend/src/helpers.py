import json
import logging
from src.constants import DEFAULT_AWS_RESPONSE_HEADERS

logger = logging.getLogger(__name__)


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


def create_aws_lambda_response(status_code, body, headers=DEFAULT_AWS_RESPONSE_HEADERS):
    if not isinstance(body, str):
        body = json.dumps(body, indent=4, sort_keys=True)
    response = {
        "statusCode": status_code,
        "headers": headers,
        "body": body
    }
    logger.debug(response)
    return response
