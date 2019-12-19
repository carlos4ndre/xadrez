from enum import Enum


class PlayerStatus:
    ONLINE = 1
    OFFLINE = 2


class GameMode(Enum):
    STANDARD = 1


class GameColor(Enum):
    WHITE = 1
    BLACK = 2


class GameStatus(Enum):
    NOT_STARTED = 1
    STARTED = 3
    REJECTED = 4
    RESIGNED = 5
    CHECKMATE = 6
    INSUFFICIENT_MATERIAL = 7
    SEVENTY_FIVE_MOVES = 8
    FIVE_FOLD_REPETITION = 9
    OUT_OF_TIME = 10


class GameResult(Enum):
    WHITE_WINS = 1
    BLACK_WINS = 2
    DRAW = 3
    UNDETERMINED = 4
