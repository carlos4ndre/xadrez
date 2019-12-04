import logging
import json
import uuid
from random import sample
from src.models import Game, Player
from src.constants import GameMode
from src.lambdas.websocket.utils import send_to_connection

logger = logging.getLogger(__name__)


def handler(event, context):
    connection_id = event["requestContext"].get("connectionId")
    logger.info("Create game request from connectionId {})".format(connection_id))

    try:
        content = json.loads(event["body"])["content"]
        challenger_id = event["requestContext"]["authorizer"]["principalId"]
        challengee_id = content["challengee_id"]
        mode = content["gameOptions"]["mode"]
        color = content["gameOptions"]["color"]
    except KeyError as e:
        logger.error("Failed to parse event: {}".format(e))

    logger.info("Save new game")
    try:
        if color == "white":
            white_player_id = challenger_id
            black_player_id = challengee_id
        elif color == "black":
            white_player_id = challengee_id
            black_player_id = challenger_id
        else:
            white_player_id, black_player_id = sample([challenger_id, challengee_id], 2)

        game = Game(id=str(uuid.uuid4()),
                    mode=GameMode[mode.upper()],
                    white_player_id=white_player_id,
                    black_player_id=black_player_id)
        game.save()
    except Exception as e:
        logger.error(e)
        return {"statusCode": 500, "body": "Game create failed"}

    logger.info("Send invite to player")
    try:
        player = Player.get(challengee_id)
        connection_id = player.connection_id
        data = {'challenger_id': challenger_id, 'content': 'this is a test!'}
        send_to_connection(connection_id, data, event)
    except Exception as e:
        logger.error(e)
        return {"statusCode": 500, "body": "Failed to send new game invitation to player"}

    return {"statusCode": 200, "body": "Game create successful"}
