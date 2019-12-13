import os
import json
import logging

import boto3
from src.auth import auth0
from src.constants import DEFAULT_AWS_RESPONSE_HEADERS, GameColor
from src.models import Player, Game

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


def update_game_state(game, attributes):
    try:
        actions = [getattr(Game, k).set(v) for k, v in attributes.items()]
        game.update(actions=actions)
    except Exception as e:
        logger.error(e)
        return "Failed to update game"


def get_opponent_id(player_id, game):
    if player_id == game.whitePlayerId:
        return game.blackPlayerId
    return game.whitePlayerId


def get_opponent_color(game):
    return GameColor.BLACK if game.playerTurn == GameColor.WHITE else GameColor.WHITE


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
