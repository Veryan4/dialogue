# -*- coding: utf-8 -*-
"""The Mongo Service.

This module allows for a commonly shared logic for retrieving collections from
the Mongo database. This way if functionality was to be added, methods from this
module can be re-used.

"""

from pymongo import MongoClient
from pymongo.collection import Collection
import os


def get_database_collection(collection_name: str) -> Collection:
  """Forms a connection with the database to retrieve the desired collection.

    Args:
        The name of the collection to return.

    Returns:
        The requested mongo DB collection.

    """

  database_name = "dialogue"
  mongo_uri = "mongodb://" + os.getenv("MONGO_USERNAME") + ":" + os.getenv(
      "MONGO_PASSWORD") + "@" + os.getenv("DB_HOSTNAME") + ":" + os.getenv(
          "DB_PORT") + "/" + database_name + "?authSource=admin"
  client = MongoClient(mongo_uri, uuidRepresentation="standard")
  database = client[database_name]
  return database.get_collection(collection_name)
