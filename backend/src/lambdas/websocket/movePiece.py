import json
import logging

from src.lambdas.helpers import (
    create_aws_lambda_response,
    notify_player,
    notify_players,
    generate_board_from_moves,
    move_piece,
    is_game_ended,
    end_game,
)
from src.models import Game

logger = logging.getLogger(__name__)


def handler(event, context):
    connection_id = event["requestContext"].get("connectionId")
    logger.info("Move piece request from connectionId {})".format(connection_id))

    logger.info("Parse event")
    data, err = parse_event(event)
    if err:
        return create_aws_lambda_response(500, err)
    game_id, player_id, move_uci = data["game_id"], data["player_id"], data["move_uci"]
    game = Game.get(game_id)

    logger.info("Check player permissions")
    if not game.is_player_in_game(player_id):
        return create_aws_lambda_response(403, "Player is not part of the game")
    if not game.is_player_turn(player_id):
        return create_aws_lambda_response(403, "It is not player turn to play")

    logger.info("Check move is valid")
    game.moves.append(move_uci)
    board = generate_board_from_moves(game.moves)
    if not board.is_valid():
        notify_player(player_id, "movePieceFailure", {"error": str(board.status())})
        return create_aws_lambda_response(400, "Invalid move")

    logger.info("Check game has ended")
    status, result = is_game_ended(game, board)
    if status:
        logger.info("Update game with the final result")
        err = end_game(game, status, result)
        if err:
            return create_aws_lambda_response(500, err)

        logger.info("Notify players the game has ended")
        player_ids = [game.whitePlayerId, game.blackPlayerId]
        err = notify_players(player_ids, "endGame", {"game": game.to_dict()})
        if err:
            return create_aws_lambda_response(500, err)
        return create_aws_lambda_response(200, "End game successful")

    logger.info("Move piece")
    err = move_piece(game, board.fen())
    if err:
        return create_aws_lambda_response(500, err)

    logger.info("Notify users the move is valid")
    player_ids = [game.whitePlayerId, game.blackPlayerId]
    err = notify_players(player_ids, "movePieceSuccess", {"game": game.to_dict()})
    if err:
        return create_aws_lambda_response(500, "Failed to notify players")

    return create_aws_lambda_response(200, "Move piece successful")


def parse_event(event):
    try:
        content = json.loads(event["body"])["content"]
        data = {
            "game_id": content["game"]["id"],
            "player_id": event["requestContext"]["authorizer"]["principalId"],
            "move_uci": content["move"]["from"] + content["move"]["to"],
        }
        return data, ""
    except KeyError as e:
        logger.error(e)
        return {}, "Failed to parse event"
