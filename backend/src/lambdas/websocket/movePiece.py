import json
import logging
from datetime import datetime

from src.lambdas.helpers import (
    create_aws_lambda_response,
    check_player_permissions,
    check_player_turn,
    notify_player,
    notify_players,
    update_game_state,
    get_opponent_color,
    generate_board_from_moves,
    is_game_ended
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
    err = check_player_permissions(game, player_id) or check_player_turn(
        game, player_id
    )
    if err:
        logger.info(err)
        return create_aws_lambda_response(500, err)

    logger.info("Check move is valid")
    game.moves.append(move_uci)
    board = generate_board_from_moves(game.moves)
    if not board.is_valid():
        notify_player(player_id, "movePieceFailure", {"error": str(board.status())})
        return create_aws_lambda_response(400, "Invalid move")

    logger.info("Check game has ended")
    status, result = is_game_ended(board, game.playerTurn)
    if status:
        logger.info("Update game with the final result")
        attributes = {"status": status, "result": result, "updatedAt": datetime.now()}
        err = update_game_state(game, attributes)
        if err:
            return create_aws_lambda_response(500, err)

        logger.info("Notify players the game has ended")
        player_ids = [game.whitePlayerId, game.blackPlayerId]
        err = notify_players(player_ids, "endGame", {"game": game.to_dict()})
        if err:
            return create_aws_lambda_response(500, err)
        return create_aws_lambda_response(200, "End game successful")

    logger.info("Change player's turn")
    attributes = {
        "moves": game.moves,
        "fen": board.fen(),
        "playerTurn": get_opponent_color(game),
        "updatedAt": datetime.now(),
    }
    err = update_game_state(game, attributes)
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
