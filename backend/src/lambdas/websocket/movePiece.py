import logging
import json
import chess
from datetime import datetime
from src.models import Game, Player
from src.constants import GameStatus, GameResult, GameColor
from src.lambdas.websocket.utils import send_to_connection

logger = logging.getLogger(__name__)


def handler(event, context):
    connection_id = event["requestContext"].get("connectionId")
    logger.info("Move piece request from connectionId {})".format(connection_id))

    try:
        content = json.loads(event["body"])["content"]
        game_id = content["game"]["id"]
        player_id = event["requestContext"]["authorizer"]["principalId"]
        white_player_id = content["game"]["whitePlayerId"]
        black_player_id = content["game"]["blackPlayerId"]
        player_color = (GameColor.WHITE if player_id == white_player_id else GameColor.BLACK)
        opponent_color = (GameColor.BLACK if player_color == GameColor.WHITE else GameColor.WHITE)
        current_move = content["move"]
    except KeyError as e:
        logger.error("Failed to parse event: {}".format(e))

    logger.info("Check move is valid")
    try:
        if player_id not in [white_player_id, black_player_id]:
            logger.error("Player is not part of the game")
            return {"statusCode": 500, "body": "Move failed"}

        game = Game.get(game_id)
        if (game.whitePlayerId != white_player_id and
            game.blackPlayerId != black_player_id):
            logger.error("White/Black player ids do not match with those in game")
            return {"statusCode": 500, "body": "Move failed"}

        if player_color != game.playerTurn:
            logger.error("It is not the player's turn")
            return {"statusCode": 500, "body": "Move failed"}

        # replay all moves to catch all edge cases concerning repetitions
        board = chess.Board()
        for m in game.moves:
            board.push(chess.Move.from_uci(m))

        # check move is legal
        if chess.Move.from_uci(current_move) not in board.legal_moves:
            logger.info("Notify player with invalid move")
            try:
                data = {
                    "action": "movePieceFailure",
                    "content": {"game": game.to_dict()}
                }
                send_to_connection(connection_id, data, event)
                return {"statusCode": 200, "body": "Move is invalid"}
            except Exception as e:
                logger.error(e)
                return {"statusCode": 500, "body": "Failed to notify user"}
    except Exception as e:
        logger.error(e)
        return {"statusCode": 500, "body": "Failed to validate move"}


    logger.info("Check game has ended")
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
        status = GameStatus.FIFTY_FIVE_REPETITION
        result = GameResult.DRAW
    elif board.is_checkmate():
        status = GameStatus.WINNER
        result = player_color

    if result:
        try:
            logger.info("Update game with the final result")
            game.update(
                actions=[
                    Game.status.set(status),
                    Game.result.set(result),
                    Game.updatedAt.set(datetime.now())
                ]
            )
        except Exception as e:
            logger.error(e)
            return {"statusCode": 500, "body": "Failed to update game"}

        try:
            logger.info("Notify players the game has ended")
            data = {
                "action": "endGame",
                "content": {"game": game.to_dict()}
            }
            player_ids = list(set([white_player_id, black_player_id]))
            for player in Player.batch_get(player_ids, attributes_to_get=["connectionId"]):
                send_to_connection(player.connectionId, data, event)
            return {"statusCode": 200, "body": "Game ended successful"}
        except Exception as e:
            logger.error(e)
            return {"statusCode": 500, "body": "Failed to notify players"}

    try:
        logger.info("Change player's turn")
        game.moves.append(current_move)
        game.update(
            actions=[
                Game.moves.set(game.moves),
                Game.playerTurn.set(opponent_color),
                Game.updatedAt.set(datetime.now())
            ]
        )
    except Exception as e:
        logger.error(e)
        return {"statusCode": 500, "body": "Failed to update game"}

    logger.info("Notify users the move is valid")
    try:
        data = {
            "action": "movePieceSuccess",
            "content": {"game": game.to_dict()}
        }
        player_ids = list(set([white_player_id, black_player_id]))
        for player in Player.batch_get(player_ids, attributes_to_get=["connectionId"]):
            send_to_connection(player.connectionId, data, event)
    except Exception as e:
        logger.error(e)
        return {"statusCode": 500, "body": "Failed to notify players"}

    return {"statusCode": 200, "body": "Move is valid"}
