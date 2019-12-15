import os
import chess
import uuid
import json
import logging

import boto3
from random import sample
from datetime import datetime
from src.auth import auth0
from src.constants import DEFAULT_AWS_RESPONSE_HEADERS, GameColor, GameResult, GameMode, GameStatus
from src.models import Player, Game, Message

logger = logging.getLogger(__name__)
dynamodb = boto3.resource("dynamodb")


def send_to_connection(connection_id, data):
    endpoint_url = os.environ["WEBSOCKET_API_ENDPOINT"]
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


def check_player_permissions(game, player_id):
    if player_id not in [game.whitePlayerId, game.blackPlayerId]:
        return "Player is not part of the game"


def check_player_turn(game, player_id):
    player_color = (
        GameColor.WHITE if player_id == game.whitePlayerId else GameColor.BLACK
    )
    if player_color != game.playerTurn:
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


def create_game(challenger_id, challengee_id, mode, color):
    try:
        white_player_id, black_player_id = assign_player_color(
            color, challenger_id, challengee_id
        )
        game = Game(
            id=str(uuid.uuid4()),
            mode=GameMode[mode.upper()],
            whitePlayerId=white_player_id,
            blackPlayerId=black_player_id,
        )
        game.save()
        return game, ""
    except Exception as e:
        print(e)
        logger.error(e)
        return {}, "Failed to create game"


def update_game_state(game, attributes):
    try:
        actions = [getattr(Game, k).set(v) for k, v in attributes.items()]
        game.update(actions=actions)
    except Exception as e:
        logger.error(e)
        return "Failed to update game"


def generate_board_from_moves(moves):
    # replay all moves to catch all edge cases concerning repetitions
    board = chess.Board()
    for move in moves:
        board.push(chess.Move.from_uci(move))
    return board


def is_game_ended(board, player_color):
    status, result = None, None
    if board.is_stalemate():
        status = GameStatus.STALEMATE
        result = GameResult.DRAW
    elif board.is_insufficient_material():
        status = GameStatus.INSUFFICIENT_MATERIAL
        result = GameResult.DRAW
    elif board.is_fivefold_repetition():
        status = GameStatus.FIVE_FOLD_REPETITION
        result = GameResult.DRAW
    elif board.is_seventyfive_moves():
        status = GameStatus.SEVENTY_FIVE_MOVES
        result = GameResult.DRAW
    elif board.is_checkmate():
        status = GameStatus.CHECKMATE
        result = (
            GameResult.WHITE_WINS
            if player_color == GameColor.WHITE
            else GameResult.BLACK_WINS
        )
    return status, result


def get_opponent_id(player_id, game):
    if player_id == game.whitePlayerId:
        return game.blackPlayerId
    return game.whitePlayerId


def get_opponent_color(game):
    return GameColor.BLACK if game.playerTurn == GameColor.WHITE else GameColor.WHITE


def get_result(game, player_id):
    player_color = (
        GameColor.WHITE if player_id == game.whitePlayerId else GameColor.BLACK
    )
    result = (
        GameResult.BLACK_WINS
        if player_color == GameColor.WHITE
        else GameResult.WHITE_WINS
    )
    return result


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
        "author": {
            "id": player.id,
            "name": player.name,
            "picture": player.picture,
        },
        "text": text,
        "created_at": datetime.now().isoformat()
    }
