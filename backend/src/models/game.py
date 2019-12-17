import os

import chess
from datetime import datetime, timezone
from src.constants import GameColor, GameMode, GameResult, GameStatus
from src.models.attributes import EnumAttribute
from src.models.base import BaseModel

from pynamodb.attributes import (
    ListAttribute,
    NumberAttribute,
    UnicodeAttribute,
    UTCDateTimeAttribute,
)


class Game(BaseModel):
    class Meta(BaseModel.Meta):
        table_name = os.environ["GAMES_TABLE"]

    id = UnicodeAttribute(hash_key=True)
    mode = EnumAttribute(enum_cls=GameMode)
    time = NumberAttribute(default=0)
    whitePlayerTimeLeft = NumberAttribute(null=True)
    blackPlayerTimeLeft = NumberAttribute(null=True)
    lastMoveTime = UTCDateTimeAttribute(null=True)
    whitePlayerId = UnicodeAttribute()
    blackPlayerId = UnicodeAttribute()
    playerTurn = UnicodeAttribute()
    moves = ListAttribute(default=list)
    fen = UnicodeAttribute(default=chess.STARTING_FEN)
    status = EnumAttribute(default=GameStatus.NOT_STARTED, enum_cls=GameStatus)
    result = EnumAttribute(default=GameResult.UNDETERMINED, enum_cls=GameResult)

    def is_time_enabled(self):
        return self.time > 0

    def is_player_in_game(self, player_id):
        return player_id in [self.whitePlayerId, self.blackPlayerId]

    def is_player_turn(self, player_id):
        return player_id == self.playerTurn

    def get_player_color(self, player_id):
        return GameColor.WHITE if player_id == self.whitePlayerId else GameColor.BLACK

    def get_current_player_id(self):
        return self.playerTurn

    def get_current_player_color(self):
        return self.get_player_color(self.playerTurn)

    def get_waiting_player_id(self):
        current_player_id = self.get_current_player_id()
        if current_player_id == self.whitePlayerId:
            return self.blackPlayerId
        return self.whitePlayerId

    def get_waiting_player_color(self):
        current_player_id = self.get_current_player_id()
        if current_player_id == self.whitePlayerId:
            return GameColor.BLACK
        return GameColor.WHITE

    def get_opponent_id(self, player_id):
        if player_id == self.whitePlayerId:
            return self.blackPlayerId
        return self.whitePlayerId

    def get_player_time_left(self, player_id):
        player_color = self.get_player_color(player_id)
        time_left = self.whitePlayerTimeLeft
        if player_color == self.blackPlayerId:
            time_left = self.blackPlayerTimeLeft
        return time_left

    def calculate_move_delta(self, current_move_time):
        return (current_move_time - self.lastMoveTime).total_seconds() * 1000

    def player_has_time_left(self, player_id):
        if not self.lastMoveTime:
            return True

        now = datetime.now(timezone.utc)
        time_left = self.get_player_time_left(player_id)
        move_delta = self.calculate_move_delta(now)
        return time_left - move_delta > 0
