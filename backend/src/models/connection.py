import os
from pynamodb.attributes import UnicodeAttribute
from src.models.base import BaseModel


class Connection(BaseModel):
    class Meta:
        table_name = os.environ["CONNECTIONS_TABLE"]

    id = UnicodeAttribute(hash_key=True)
    userId = UnicodeAttribute()
