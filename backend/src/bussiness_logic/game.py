import logging
import chess
import uuid
from random import sample
from src.models import Game
from datetime import datetime, timezone
from src.constants import (
    GameMode,
    GameResult,
    GameColor,
    GameStatus,
)

logger = logging.getLogger(__name__)

GAME_MIN_TIME_SECONDS = 60
GAME_MAX_TIME_SECONDS = 60 * 5


def check_player_permissions(game, player_id):
    if not game.is_valid_player(player_id):
        return "Player is not part of the game"


def check_player_turn(game, player_id):
    if not game.is_player_turn(player_id):
        return "It is not the player's turn"


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
            playerTurn=white_player_id,
        )
        game.save()
        return game, ""
    except Exception as e:
        logger.error(e)
        return {}, "Failed to create game"


def start_game(game, player_id):
    attributes = {"status": GameStatus.STARTED, "updatedAt": datetime.now(timezone.utc)}
    return update_game_state(game, attributes)


def reject_game(game, player_id):
    attributes = {
        "status": GameStatus.REJECTED,
        "updatedAt": datetime.now(timezone.utc),
    }
    return update_game_state(game, attributes)


def timeout_game(game, timeout_player_id):
    logger.info("Check player has timed out")
    if game.player_has_time_left(timeout_player_id):
        return "Player has not timed out yet"

    logger.info("Update game")
    attributes = {
        "status": GameStatus.OUT_OF_TIME,
        "updatedAt": datetime.now(timezone.utc),
    }

    if game.get_current_player_color() == GameColor.WHITE:
        attributes.update({
            "whitePlayerTimeLeft": 0,
            "result": GameResult.BLACK_WINS,
        })
    else:
        attributes.update({
            "blackPlayerTimeLeft": 0,
            "result": GameResult.WHITE_WINS,
        })

    return update_game_state(game, attributes)


def resign_player(game, player_id):
    player_color = game.get_player_color(player_id)
    status = GameStatus.REJECTED
    result = GameResult.WHITE_WINS
    if player_color == GameColor.WHITE:
        result = GameResult.BLACK_WINS

    attributes = {
        "status": status,
        "result": result,
        "updatedAt": datetime.now(timezone.utc),
    }
    return update_game_state(game, attributes)


def move_piece(game, fen):
    now = datetime.now(timezone.utc)
    attributes = {
        "moves": game.moves,
        "fen": fen,
        "playerTurn": game.get_waiting_player_id(),
        "lastMoveTime": now,
        "updatedAt": now,
    }

    # start decreasing time after first move
    if game.is_time_enabled() and len(game.moves) > 1:
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
    attributes = {
        "status": status,
        "result": result,
        "updatedAt": datetime.now(timezone.utc),
    }
    return update_game_state(game, attributes)


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
        board.push_san(move)
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
        return GameStatus.OUT_OF_TIME, result
    return None, None


def assign_player_color(color, challenger_id, challengee_id):
    if color == "white":
        return challenger_id, challengee_id
    elif color == "black":
        return challengee_id, challenger_id
    else:
        return sample([challenger_id, challengee_id], 2)
