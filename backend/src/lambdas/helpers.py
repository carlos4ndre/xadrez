import os
import chess
import uuid
import json
import logging

import boto3
from random import sample
from datetime import datetime
from src.auth import auth0
from src.constants import (
    DEFAULT_AWS_RESPONSE_HEADERS,
    GameColor,
    GameResult,
    GameMode,
    GameStatus,
    GAME_MIN_TIME_SECONDS,
    GAME_MAX_TIME_SECONDS,
)
from src.models import Player, Game, Message

logger = logging.getLogger(__name__)
dynamodb = boto3.resource("dynamodb")


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


def check_player_permissions(game, player_id):
    if not game.is_valid_player(player_id):
        return "Player is not part of the game"


def check_player_turn(game, player_id):
    if not game.is_player_turn(player_id):
        return "It is not the player's turn"


def notify_player(player_id, action, content):
    player_ids = [player_id]
    return notify_players(player_ids, action, content)


def notify_players(player_ids, action, content):
    try:
        data = {"action": action, "content": content}
        for player in Player.batch_get(player_ids, attributes_to_get=["connectionId"]):
            send_to_connection(player.connectionId, data)
    except Exception as e:
        logger.error(e)
        return "Failed to notify players"


def create_game(challenger_id, challengee_id, options):
    mode, color, time = options["mode"], options["color"], int(options["time"])

    logger.info("Check time is valid")
    is_time_enabled = time != 0
    if is_time_enabled and GAME_MIN_TIME_SECONDS > time > GAME_MAX_TIME_SECONDS:
        return (
            {},
            "Time must be between {} and {}".format(
                GAME_MIN_TIME_SECONDS, GAME_MAX_TIME_SECONDS
            ),
        )

    logger.info("Assign color to players")
    white_player_id, black_player_id = assign_player_color(
        color, challenger_id, challengee_id
    )

    try:
        time_in_milleseconds = time * 1000
        game = Game(
            id=str(uuid.uuid4()),
            mode=GameMode[mode.upper()],
            time=time_in_milleseconds,
            whitePlayerTimeLeft=time_in_milleseconds,
            blackPlayerTimeLeft=time_in_milleseconds,
            whitePlayerId=white_player_id,
            blackPlayerId=black_player_id,
            playerTurn=white_player_id
        )
        game.save()
        return game, ""
    except Exception as e:
        logger.error(e)
        return {}, "Failed to create game"


def move_piece(game, fen):
    now = datetime.now()
    attributes = {
        "moves": game.moves,
        "fen": fen,
        "playerTurn": game.get_waiting_player_id(),
        "lastMoveTime": now,
        "updatedAt": now,
    }

    if game.is_time_enabled():
        logger.info("Calculate player time left")
        if game.get_current_player_color() == GameColor.WHITE:
            time_left = game.whitePlayerTimeLeft - game.calculate_move_delta(now)
            attributes.update({"whitePlayerTimeLeft": time_left})
        else:
            time_left = game.blackPlayerTimeLeft - game.calculate_move_delta(now)
            attributes.update({"blackPlayerTimeLeft": time_left})

    logger.info("Update game")
    return update_game_state(game, attributes)


def end_game(game, status, result):
    attributes = {"status": status, "result": result, "updatedAt": datetime.now()}
    return update_game_state(game, attributes)


def update_game_state(game, attributes):
    try:
        actions = [getattr(Game, k).set(v) for k, v in attributes.items()]
        game.update(actions=actions)
    except Exception as e:
        logger.error(e)
        return "Failed to update game"


def resign_player(game, player_id):
    player_color = game.get_player_color(player_id)
    status = GameStatus.REJECTED
    result = GameResult.WHITE_WINS
    if player_color == GameColor.WHITE:
        result = GameResult.BLACK_WINS

    attributes = {
        "status": status,
        "result": result,
        "updatedAt": datetime.now(),
    }
    return update_game_state(game, attributes)


def start_game(game, player_id):
    attributes = {"status": GameStatus.STARTED, "updatedAt": datetime.now()}
    return update_game_state(game, attributes)


def reject_game(game, player_id):
    attributes = {"status": GameStatus.REJECTED, "updatedAt": datetime.now()}
    return update_game_state(game, attributes)


def generate_board_from_moves(moves):
    # replay all moves to catch all edge cases concerning repetitions
    board = chess.Board()
    for move in moves:
        board.push(chess.Move.from_uci(move))
    return board


def is_game_ended(game, board):
    player_id = game.get_current_player_id()
    player_color = game.get_current_player_color()
    if board.is_stalemate():
        return GameStatus.STALEMATE, GameResult.DRAW
    elif board.is_insufficient_material():
        return GameStatus.INSUFFICIENT_MATERIAL, GameResult.DRAW
    elif board.is_fivefold_repetition():
        return GameStatus.FIVE_FOLD_REPETITION, GameResult.DRAW
    elif board.is_seventyfive_moves():
        return GameStatus.SEVENTY_FIVE_MOVES, GameResult.DRAW
    elif board.is_checkmate():
        result = (
            GameResult.WHITE_WINS
            if player_color == GameColor.WHITE
            else GameResult.BLACK_WINS
        )
        return GameStatus.CHECKMATE, result
    elif game.is_time_enabled() and not game.player_has_time_left(player_id):
        result = (
            GameResult.BLACK_WINS
            if player_color == GameColor.WHITE
            else GameResult.WHITE_WINS
        )
        return GameResult.OUT_OF_TIME, result
    return None, None


def decode_jwt_token(token):
    try:
        payload = auth0.decode_jwt_token(token)
        return payload, ""
    except Exception as e:
        logger.error(e)
        return "", "Failed to decode token"


def create_player(player_id):
    try:
        player = Player.get(player_id)
    except Player.DoesNotExist:
        logger.info("New player connecting, using defaults")
        player = Player(id=player_id)
    finally:
        return player


def update_player(player, attributes):
    actions = [getattr(Player, k).set(v) for k, v in attributes.items()]
    try:
        player.update(actions=actions)
    except Exception as e:
        logger.error(e)
        return "Failed to update player"


def assign_player_color(color, challenger_id, challengee_id):
    if color == "white":
        return challenger_id, challengee_id
    elif color == "black":
        return challengee_id, challenger_id
    else:
        return sample([challenger_id, challengee_id], 2)


def create_message(room_id, player_id, content):
    try:
        message = Message(roomId=room_id, playerId=player_id, content=content)
        message.save()
        return message, ""
    except Exception as e:
        logger.error(e)
        return {}, "Failed to create message"


def generate_message(room_id, player, text):
    return {
        "room_id": room_id,
        "author": {"id": player.id, "name": player.name, "picture": player.picture},
        "text": text,
        "created_at": datetime.now().isoformat(),
    }
