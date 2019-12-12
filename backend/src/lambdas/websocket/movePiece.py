import logging
import json
import chess
from datetime import datetime
from src.models import Game, Player
from src.constants import GameColor, GameStatus, GameResult
from src.helpers import create_aws_lambda_response, send_to_connection

logger = logging.getLogger(__name__)


def handler(event, context):
    connection_id = event["requestContext"].get("connectionId")
    logger.info("Move piece request from connectionId {})".format(connection_id))

    try:
        content = json.loads(event["body"])["content"]
        game_id = content["game"]["id"]
        player_id = event["requestContext"]["authorizer"]["principalId"]
        move_from = content["move"]["from"]
        move_to = content["move"]["to"]
    except KeyError as e:
        logger.error(e)
        return create_aws_lambda_response(500, "Failed to parse event")

    logger.info("Check move is valid")
    try:
        game = Game.get(game_id)
        if player_id not in [game.whitePlayerId, game.blackPlayerId]:
            return create_aws_lambda_response(500, "Player is not part of the game")

        player_color = (GameColor.WHITE if player_id == game.whitePlayerId else GameColor.BLACK)
        if player_color != game.playerTurn:
            return create_aws_lambda_response(500, "It is not the player's turn")

        # replay all moves to catch all edge cases concerning repetitions
        board = chess.Board()
        current_uci = f"{move_from}{move_to}"
        game.moves.append(current_uci)
        for move in game.moves:
            board.push(chess.Move.from_uci(move))

        # check move is legal
        if not board.is_valid():
            logger.info("Notify player with invalid move")
            try:
                data = {
                    "action": "movePieceFailure",
                    "content": {"error": str(board.status())}
                }
                send_to_connection(connection_id, data, event)
                return create_aws_lambda_response(500, "Move is invalid")
            except Exception as e:
                logger.error(e)
                return create_aws_lambda_response(500, "Failed to notify player")
    except Exception as e:
        logger.error(e)
        return create_aws_lambda_response(500, "Failed to validate move")

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
        status = GameStatus.SEVENTY_FIVE_MOVES
        result = GameResult.DRAW
    elif board.is_checkmate():
        status = GameStatus.CHECKMATE
        result = (GameResult.WHITE_WINS if player_color == GameColor.WHITE else GameResult.BLACK_WINS)

    if status:
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
            return create_aws_lambda_response(500, "Failed to update game")

        try:
            logger.info("Notify players the game has ended")
            data = {
                "action": "endGame",
                "content": {"game": game.to_dict()}
            }
            player_ids = [game.whitePlayerId, game.blackPlayerId]
            for player in Player.batch_get(player_ids, attributes_to_get=["connectionId"]):
                send_to_connection(player.connectionId, data, event)
            return create_aws_lambda_response(200, "End Game successful")
        except Exception as e:
            logger.error(e)
            return create_aws_lambda_response(500, "Failed to notify players")

    try:
        logger.info("Change player's turn")
        opponent_color = (GameColor.BLACK if player_color == GameColor.WHITE else GameColor.WHITE)
        game.update(
            actions=[
                Game.moves.set(game.moves),
                Game.fen.set(board.fen()),
                Game.playerTurn.set(opponent_color),
                Game.updatedAt.set(datetime.now())
            ]
        )
    except Exception as e:
        logger.error(e)
        return create_aws_lambda_response(500, "Failed to update game")

    logger.info("Notify users the move is valid")
    try:
        data = {
            "action": "movePieceSuccess",
            "content": {"game": game.to_dict()}
        }
        player_ids = [game.whitePlayerId, game.blackPlayerId]
        for player in Player.batch_get(player_ids, attributes_to_get=["connectionId"]):
            send_to_connection(player.connectionId, data, event)
    except Exception as e:
        logger.error(e)
        return create_aws_lambda_response(500, "Failed to notify players")

    return create_aws_lambda_response(200, "Move piece successful")
