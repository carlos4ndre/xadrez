import logging
from datetime import datetime
from src.models import Message

logger = logging.getLogger(__name__)


def create_message(room_id, player_id, content):
    try:
        message = Message(roomId=room_id, playerId=player_id, content=content)
        message.save()
        return message, ""
    except Exception as e:
        logger.error(e)
        return {}, "Failed to create message"


def generate_message(room_id, player, text):
    return {
        "room_id": room_id,
        "author": {"id": player.id, "name": player.name, "picture": player.picture},
        "text": text,
        "created_at": datetime.now().isoformat(),
    }
