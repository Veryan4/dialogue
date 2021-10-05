# -*- coding: utf-8 -*-
"""The Mongo Tests.

This module is used to test the Mongo Service before runtime.

"""

from pytest_mock import MockerFixture

from services import mongo_service


def test_get_database_collection(mocker: MockerFixture) -> None:
  class MockDBConnection():
    def get_collection(self, name):
      return "collection was returned"

  mockedDbClient = {"dialogue": MockDBConnection()}

  mocker.patch('os.getenv', side_effect=['u', 'p', 'db', '8080'])
  spy = mocker.patch('services.mongo_service.MongoClient',
                     return_value=mockedDbClient)

  assert mongo_service.get_database_collection(
      "ToDo") == "collection was returned"

  spy.assert_called_once_with(
      "mongodb://u:p@db:8080/dialogue?authSource=admin",
      uuidRepresentation="standard")
