import os

import chess
from src.constants import GameColor, GameMode, GameResult, GameStatus
from src.models.attributes import EnumAttribute
from src.models.base import BaseModel

from pynamodb.attributes import (
    ListAttribute,
    NumberAttribute,
    UnicodeAttribute,
)


class Game(BaseModel):
    class Meta(BaseModel.Meta):
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

    def is_player_in_game(self, player_id):
        return player_id in [self.whitePlayerId, self.blackPlayerId]

    def is_player_turn(self, player_id):
        player_color = self.get_player_color(player_id)
        return player_color != self.playerTurn

    def get_player_color(self, player_id):
        return GameColor.WHITE if player_id == self.whitePlayerId else GameColor.BLACK

    def get_current_player_id(self):
        player_color = self.get_player_color(self.whitePlayerId)
        if player_color == GameColor.WHITE:
            return self.whitePlayerId
        return self.blackPlayerId

    def get_current_player_color(self):
        return self.playerTurn

    def get_waiting_player_id(self):
        current_player_id = self.get_current_player_id()
        if current_player_id == self.whitePlayerId:
            return self.blackPlayerId
        return self.whitePlayerId

    def get_waiting_player_color(self):
        return GameColor.BLACK if self.playerTurn == GameColor.WHITE else GameColor.WHITE

    def get_opponent_id(self, player_id):
        player_color = self.get_player_color(player_id)
        if player_color == GameColor.WHITE:
            return self.blackPlayerId
        return self.whitePlayerId
