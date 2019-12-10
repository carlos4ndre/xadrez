import logging
import json
import uuid
from random import sample
from src.models import Game, Player
from src.constants import GameMode
from src.lambdas.websocket.utils import send_to_connection
from src.helpers import create_aws_lambda_response

logger = logging.getLogger(__name__)


def handler(event, context):
    connection_id = event["requestContext"].get("connectionId")
    logger.info("Create game request from connectionId {})".format(connection_id))

    try:
        content = json.loads(event["body"])["content"]
        challenger_id = event["requestContext"]["authorizer"]["principalId"]
        challengee_id = content["challengeeId"]
        mode = content["gameOptions"]["mode"]
        color = content["gameOptions"]["color"]
    except KeyError as e:
        logger.error(e)
        return create_aws_lambda_response(500, "Failed to parse event")

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
                    whitePlayerId=white_player_id,
                    blackPlayerId=black_player_id)
        game.save()
    except Exception as e:
        return create_aws_lambda_response(500, "Failed to create game")

    logger.info("Notify player")
    try:
        challengee = Player.get(challengee_id)
        challenger = Player.get(challenger_id)
        connection_id = challengee.connectionId
        data = {
            "action": "createGame",
            "content": {
                "challenger": {
                    "id": challenger.id,
                    "name": challenger.name,
                    "nickname": challenger.nickname,
                    "picture": challenger.picture
                },
                "game": game.to_dict()
            }
        }
        send_to_connection(connection_id, data, event)
    except Exception as e:
        logger.error(e)
        return create_aws_lambda_response(500, "Failed to notify player")

    return create_aws_lambda_response(200, "Create game successful")
