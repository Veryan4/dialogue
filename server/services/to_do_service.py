# -*- coding: utf-8 -*-
"""The To Do Service.

This module is a naive service which allows for a single user to store, retrive,
and update To Do documents.

Attributes:
    DB_COLLECTION_NAME (str): The database collection used commonly accross
    all methods in this module.

Todo:
    * Implement a To Do list collection for multiple users to have their own
    to do lists

"""

from pymongo import UpdateOne, ASCENDING
from bson.objectid import ObjectId
from typing import List

from models import to_do_model
from services import mongo_service

DB_COLLECTION_NAME = "ToDo"


def clear_completed_to_dos() -> int:
  """Removes the completed To Dos from the database.

    Returns:
        The number of stories deleted.

    """

  collection = mongo_service.get_database_collection(DB_COLLECTION_NAME)
  result = collection.delete_many({'completed': True})
  return result.deleted_count


def clear_a_to_do(to_do_id: str) -> None:
  """Removes a single To Do from the database.

    Args:
        to_do_id: The id of the To Do to be removed
            from the database.

    Returns:
        The number of stories deleted.

    """

  collection = mongo_service.get_database_collection(DB_COLLECTION_NAME)
  collection.delete_one({"_id": ObjectId(to_do_id)})


def fetch_all_to_dos() -> List[to_do_model.ToDo]:
  """Fetches the to dos from the database.

    Returns:
        A list of to dos that were stored in the mongo database.

    """

  collection = mongo_service.get_database_collection(DB_COLLECTION_NAME)
  results = collection.find({})
  results = results.sort("order", ASCENDING)
  return [to_do_model.ToDo(**to_do) for to_do in results]


def add_to_do(to_do: to_do_model.ToDo) -> to_do_model.ToDo:
  """Adds or updates to dos in the mongo database.

    Args:
        to_do: The new to dos to store.

    Returns:
        The to dos that was stored in the mongo database
        after the inserting operation. This way the generated id
        of the new entry can be returned to the front-end.

    """

  collection = mongo_service.get_database_collection(DB_COLLECTION_NAME)
  results = collection.find({})
  results = results.sort("order", ASCENDING)
  to_dos = tuple(to_do_model.ToDo(**to_do) for to_do in results)
  if to_dos:
    to_do.order = to_dos[-1].order + 1
  to_do.id = None
  collection.insert_one(to_do.dict())
  result = collection.find_one({"order": to_do.order})
  return to_do_model.ToDo(**result)


def update_to_dos(to_dos: List[to_do_model.ToDo]) -> List[to_do_model.ToDo]:
  """Updates to dos in the mongo database.

    Args:
        to_dos: The to dos to update and store.

    Returns:
        A tuple of to dos that were stored in the mongo database
        after the updating operation.

    """

  operations = []
  to_dos_as_dicts = tuple(to_do.dict() for to_do in to_dos)
  for to_do_as_dict in to_dos_as_dicts:
    to_do_id = to_do_as_dict["id"]
    del to_do_as_dict["id"]
    operations.append(
        UpdateOne({"_id": ObjectId(to_do_id)}, {"$set": to_do_as_dict},
                  upsert=True))
  collection = mongo_service.get_database_collection(DB_COLLECTION_NAME)
  collection.bulk_write(operations)
  return to_dos
