import os
import chess
from pynamodb.attributes import UnicodeAttribute, ListAttribute, NumberAttribute
from src.models.attributes import EnumAttribute
from src.models.base import BaseModel
from src.constants import GameMode, GameColor, GameStatus, GameResult


class Game(BaseModel):
    class Meta:
        table_name = os.environ["GAMES_TABLE"]

    id = UnicodeAttribute(hash_key=True)
    mode = EnumAttribute(enum_cls=GameMode)
    time = NumberAttribute(default=0)
    whitePlayerId = UnicodeAttribute()
    blackPlayerId = UnicodeAttribute()
    moves = ListAttribute(default=list)
    fen = UnicodeAttribute(default=chess.STARTING_FEN)
    playerTurn = EnumAttribute(default=GameColor.WHITE, enum_cls=GameColor)
    status = EnumAttribute(default=GameStatus.NOT_STARTED, enum_cls=GameStatus)
    result = EnumAttribute(default=GameResult.UNDETERMINED, enum_cls=GameResult)
