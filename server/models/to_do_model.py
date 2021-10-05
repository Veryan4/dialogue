# -*- coding: utf-8 -*-
"""The To Do Models.

This module is to enforce typing surrounding the use of
the To Do objects.

"""

from pydantic import BaseModel, Field

from models import mongo_model


class ToDo(BaseModel):
  """ A pydantic class that's used for controlling the type of the
  To Do objects.

    """

  id: mongo_model.ObjectIdStr = Field(None, alias='_id')
  description: str
  order: int = 0
  completed: bool = False
