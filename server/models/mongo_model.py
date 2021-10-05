# -*- coding: utf-8 -*-
"""The Mongo Models.

This module is to enforce custom typing surrounding the use of
the Mongo database.

"""


class ObjectIdStr(str):
  """Adapts the Mongo specific BsonId type to a string.

    """
  @classmethod
  def __get_validators__(cls):
    yield cls.validate

  @classmethod
  def validate(cls, v):
    return str(v)
