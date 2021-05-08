import json
import os
from datetime import datetime
from enum import Enum

from pynamodb.attributes import MapAttribute, UTCDateTimeAttribute
from pynamodb.models import Model


class BaseModel(Model):
    class Meta:
        if os.environ.get("IS_OFFLINE") == "true":
            host = "http://localhost:8000"

    def to_json(self, indent=2):
        return json.dumps(self.to_dict(), indent=indent)

    def to_dict(self):
        ret_dict = {}
        for name, attr in self.attribute_values.items():
            ret_dict[name] = self._attr2obj(attr)
        return ret_dict

    def _attr2obj(self, attr):
        if isinstance(attr, list):
            _list = []
            for _attr in attr:
                _list.append(self._attr2obj(_attr))
            return _list
        elif isinstance(attr, MapAttribute):
            _dict = {}
            for k, v in attr.attribute_values.items():
                _dict[k] = self._attr2obj(v)
            return _dict
        elif isinstance(attr, Enum):
            return attr.name.lower()
        elif isinstance(attr, datetime):
            return attr.isoformat()
        else:
            return attr

    createdAt = UTCDateTimeAttribute(default=datetime.utcnow)
    updatedAt = UTCDateTimeAttribute(default=datetime.utcnow)
