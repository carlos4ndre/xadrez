import os
from datetime import datetime
from pynamodb.attributes import UnicodeAttribute, UTCDateTimeAttribute
from src.models.base import BaseModel


class Player(BaseModel):
    class Meta:
        table_name = os.environ["PLAYERS_TABLE"]

    id = UnicodeAttribute(hash_key=True)
    name = UnicodeAttribute()
    nickname = UnicodeAttribute()
    email = UnicodeAttribute()
    picture = UnicodeAttribute()
    updated_at = UTCDateTimeAttribute(default=datetime.utcnow)
