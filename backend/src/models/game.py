import os
from pynamodb.attributes import UnicodeAttribute, UnicodeSetAttribute, NumberAttribute
from src.models.attributes import EnumAttribute
from src.models.base import BaseModel
from src.constants import GameMode, GameColor, GameStatus, GameResult


class Game(BaseModel):
    class Meta:
        table_name = os.environ["GAMES_TABLE"]

    id = UnicodeAttribute(hash_key=True)
    mode = EnumAttribute(enum_cls=GameMode)
    time = NumberAttribute(default=0)
    white_player_id = UnicodeAttribute()
    black_player_id = UnicodeAttribute()
    moves = UnicodeSetAttribute(default=[])
    player_turn = EnumAttribute(default=GameColor.WHITE, enum_cls=GameColor)
    status = EnumAttribute(default=GameStatus.NOT_STARTED, enum_cls=GameStatus)
    result = EnumAttribute(default=GameResult.NOT_AVAILABLE, enum_cls=GameResult)
