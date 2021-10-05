# -*- coding: utf-8 -*-
"""The To Do Tests.

This module is used to test the To Do Service before runtime.

"""

from pydantic.main import BaseModel
from pytest_mock import MockerFixture

from models import to_do_model
from services import to_do_service


def mock_to_do() -> to_do_model.ToDo:
    return to_do_model.ToDo(id="6134e21f2fe633f2b049b748",
                            description="write  unit tests",
                            order=1,
                            completed=False)


def test_clear_completed_to_dos(mocker: MockerFixture) -> None:
    class Foo(BaseModel):
        deleted_count = 1

    class MockedDBCollection():
        def delete_many(self, filter):
            return Foo()

    spy = mocker.patch('services.mongo_service.get_database_collection',
                       return_value=MockedDBCollection())

    assert to_do_service.clear_completed_to_dos() == 1

    spy.assert_called_once_with("ToDo")


def test_clear_a_to_do(mocker: MockerFixture) -> None:
    class Foo(BaseModel):
        deleted_count = 1

    class MockedDBCollection():
        def delete_one(self, filter):
            return Foo()

    spy = mocker.patch('services.mongo_service.get_database_collection',
                       return_value=MockedDBCollection())

    assert to_do_service.clear_a_to_do('6134e21f2fe633f2b049b748') == None

    spy.assert_called_once_with("ToDo")


def test_fetch_all_to_dos(mocker: MockerFixture) -> None:
    class MockDBCursor():
        def sort(self, property, order):
            return (mock_to_do().dict(), )

    class MockedDBCollection():
        def find(self, filter):
            return MockDBCursor()

    spy = mocker.patch('services.mongo_service.get_database_collection',
                       return_value=MockedDBCollection())

    assert to_do_service.fetch_all_to_dos() == [mock_to_do()]

    spy.assert_called_once_with("ToDo")


def test_add_to_do(mocker: MockerFixture) -> None:
    class MockDBCursor():
        def sort(self, key, direction):
            return tuple()

    class MockedDBCollection():
        def insert_one(self, operations):
            return (mock_to_do().dict(), )

        def find(self, filter):
            return MockDBCursor()

        def find_one(self, filter):
            return mock_to_do().dict()

    spy = mocker.patch('services.mongo_service.get_database_collection',
                       return_value=MockedDBCollection())

    assert to_do_service.add_to_do(mock_to_do()) == mock_to_do()

    spy.assert_called_once_with("ToDo")


def test_update_to_dos(mocker: MockerFixture) -> None:
    class MockedDBCollection():
        def bulk_write(self, operations):
            return tuple()

    spy = mocker.patch('services.mongo_service.get_database_collection',
                       return_value=MockedDBCollection())

    assert to_do_service.update_to_dos([mock_to_do()]) == [mock_to_do()]

    spy.assert_called_once_with("ToDo")
