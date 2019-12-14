import os
from datetime import datetime
from src.models.base import BaseModel
from pynamodb.attributes import UnicodeAttribute, UTCDateTimeAttribute


class Message(BaseModel):
    class Meta(BaseModel.Meta):
        table_name = os.environ["CHAT_ROOM_MESSAGES_TABLE"]

    roomId = UnicodeAttribute(hash_key=True)
    playerId = UnicodeAttribute()
    content = UnicodeAttribute()
    createdAt = UTCDateTimeAttribute(range_key=True, default=datetime.utcnow)
