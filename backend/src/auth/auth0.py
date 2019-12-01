import os
import logging
import json
import jwt
import requests

logger = logging.getLogger(__name__)


def decode_jwt_token(token):
    payload = jwt.decode(token,
                         key=get_jwt_public_key(token),
                         audience=os.environ["AUTH0_CLIENT_ID"],
                         algorithms=['RS256'])
    logger.info("JWT token is valid")
    logger.debug(payload)
    return payload


def get_jwt_public_key(token):
    jwks_url = os.environ["AUTH0_JWKS_URL"]
    jwks = requests.get(jwks_url).json()
    public_keys = {}
    for jwk_key in jwks['keys']:
        kid = jwk_key['kid']
        public_keys[kid] = jwt.algorithms.RSAAlgorithm.from_jwk(json.dumps(jwk_key))
    kid = jwt.get_unverified_header(token)['kid']
    return public_keys[kid]
