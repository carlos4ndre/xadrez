import logging
from src.auth import auth0

logger = logging.getLogger(__name__)


def decode_jwt_token(token):
    try:
        payload = auth0.decode_jwt_token(token)
        return payload, ""
    except Exception as e:
        logger.error(e)
        return "", "Failed to decode token"
