from datetime import datetime
from enum import Enum
import json

from pynamodb.models import Model
from pynamodb.attributes import MapAttribute, UTCDateTimeAttribute


class BaseModel(Model):
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
            for l in attr:
                _list.append(self._attr2obj(l))
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

    created_at = UTCDateTimeAttribute(default=datetime.utcnow)
    updated_at = UTCDateTimeAttribute(default=datetime.utcnow)
