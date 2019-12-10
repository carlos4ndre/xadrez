import os
from pynamodb.attributes import UnicodeAttribute, NumberAttribute
from pynamodb.indexes import GlobalSecondaryIndex, AllProjection
from src.models.base import BaseModel
from src.constants import PlayerStatus


class ConnectionIdIndex(GlobalSecondaryIndex):
    class Meta:
        index_name = os.environ["CONNECTION_ID_INDEX"]
        read_capacity_units = 2
        write_capacity_units = 1
        projection = AllProjection()

    connectionId = UnicodeAttribute(hash_key=True)


class Player(BaseModel):
    class Meta(BaseModel.Meta):
        table_name = os.environ["PLAYERS_TABLE"]

    id = UnicodeAttribute(hash_key=True)
    name = UnicodeAttribute()
    nickname = UnicodeAttribute()
    email = UnicodeAttribute()
    picture = UnicodeAttribute()
    connectionId = UnicodeAttribute()
    connectionIdIndex = ConnectionIdIndex()
    status = NumberAttribute(default=PlayerStatus.OFFLINE)
