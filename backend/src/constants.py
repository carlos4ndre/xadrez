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
    STARTED = 2
    REJECTED = 3
    DRAW = 4
    WHITE_WINS = 5
    BLACK_WINS = 6
