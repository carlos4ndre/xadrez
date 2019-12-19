import logging
from src.models import Player
from src.helpers.aws import send_to_connection

logger = logging.getLogger(__name__)

GET_PLAYER_FIELDS = ["id", "name", "nickname", "email", "picture", "status"]
MAX_RECORD_LIMIT = 50


def create_player(player_id):
    try:
        player = Player.get(player_id)
    except Player.DoesNotExist:
        logger.info("New player connecting, using defaults")
        player = Player(id=player_id)
    finally:
        return player


def get_player(player_id):
    try:
        player = Player.get(player_id)
        return player, ""
    except Exception as e:
        logger.error(e)
        return {}, "Failed to get player"


def get_players():
    try:
        players = []
        for player in Player.scan(
            attributes_to_get=GET_PLAYER_FIELDS,
            limit=MAX_RECORD_LIMIT
        ):
            players.append(player.to_dict())
        return players, ""
    except Exception as e:
        logger.error(e)
        return {}, "Failed to get players"


def update_player(player, attributes):
    actions = [getattr(Player, k).set(v) for k, v in attributes.items()]
    try:
        player.update(actions=actions)
    except Exception as e:
        logger.error(e)
        return "Failed to update player"


def notify_player(player_id, action, content):
    player_ids = [player_id]
    return notify_players(player_ids, action, content)


def notify_players(player_ids, action, content):
    try:
        data = {"action": action, "content": content}
        for player in Player.batch_get(player_ids, attributes_to_get=["connectionId"]):
            send_to_connection(player.connectionId, data)
    except Exception as e:
        logger.error(e)
        return "Failed to notify players"
