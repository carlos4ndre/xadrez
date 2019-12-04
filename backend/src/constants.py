from enum import Enum


class PlayerStatus:
    ONLINE = 1
    OFFLINE = 2


class GameStatus(Enum):
    NOT_STARTED = 1
    STARTED = 2
    ABORTED = 3
    STALEMATE = 4
    RESIGN = 5
    DRAW = 6
    WINNER = 7


class GameMode(Enum):
    STANDARD = 1


class GameColor(Enum):
    WHITE = 1
    BLACK = 2


class GameResult(Enum):
    WHITE = 1
    BLACK = 2
    DRAW = 3
    NOT_AVAILABLE = 4
