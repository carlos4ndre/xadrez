import logging
import json
import chess
from datetime import datetime
from src.models import Game, Player
from src.constants import GameColor, GameStatus
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
        move_from = content["move"]["from"]
        move_to = content["move"]["to"]
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
    status = None
    if (board.is_stalemate() and
        board.is_insufficient_material() and
        board.is_fivefold_repetition() and
            board.is_seventyfive_moves()):
        status = GameStatus.DRAW
    elif board.is_checkmate():
        status = (GameStatus.WHITE_WINS if player_color == GameColor.WHITE else GameStatus.BLACK_WINS)

    if status:
        try:
            logger.info("Update game with the final result")
            game.update(
                actions=[
                    Game.status.set(status),
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
            player_ids = [white_player_id, black_player_id]
            for player in Player.batch_get(player_ids, attributes_to_get=["connectionId"]):
                send_to_connection(player.connectionId, data, event)
            return {"statusCode": 200, "body": "Game ended successful"}
        except Exception as e:
            logger.error(e)
            return {"statusCode": 500, "body": "Failed to notify players"}

    try:
        logger.info("Change player's turn")
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
        return {"statusCode": 500, "body": "Failed to update game"}

    logger.info("Notify users the move is valid")
    try:
        data = {
            "action": "movePieceSuccess",
            "content": {"game": game.to_dict()}
        }
        player_ids = [white_player_id, black_player_id]
        for player in Player.batch_get(player_ids, attributes_to_get=["connectionId"]):
            send_to_connection(player.connectionId, data, event)
    except Exception as e:
        logger.error(e)
        return {"statusCode": 500, "body": "Failed to notify players"}

    return {"statusCode": 200, "body": "Move is valid"}
