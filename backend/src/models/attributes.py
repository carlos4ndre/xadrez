from pynamodb.attributes import Attribute
from pynamodb.constants import STRING


class EnumAttribute(Attribute):
    attr_type = STRING

    def __init__(self, enum_cls, *args, **kwargs):
        self.enum = enum_cls
        self.enum_values = list([e.value for e in enum_cls])
        super().__init__(*args, **kwargs)

    def serialize(self, value):
        if value not in self.enum:
            raise AttributeError(
                f"Invalid value in EnumAttribute: {value}. Allowed values: {self.enum_values}"
            )
        return str(value.value)

    def deserialize(self, value):
        value = int(value)
        if value not in self.enum_values:
            raise AttributeError(
                f"Invalid value for enum: {value}. Expected: {self.enum_values}"
            )
        return self.enum(value)
