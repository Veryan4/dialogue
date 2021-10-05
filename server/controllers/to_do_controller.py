# -*- coding: utf-8 -*-
"""The To Do Controller

This module is used to expose and control interactions with the To Do service
to external applications.

"""

from fastapi import APIRouter, HTTPException
from typing import List
from pymongo.errors import PyMongoError

from models import to_do_model
from services import to_do_service

router = APIRouter(prefix="/todo")


@router.get('/', response_model=List[to_do_model.ToDo])
def get_to_dos():
  try:
    result = to_do_service.fetch_all_to_dos()
  except PyMongoError:
    raise HTTPException(status_code=500,
                        detail="There was retrieving from the database")
  return result


@router.post('/', response_model=to_do_model.ToDo)
def add_to_do(to_do: to_do_model.ToDo):
  try:
    result = to_do_service.add_to_do(to_do)
  except PyMongoError:
    raise HTTPException(status_code=500,
                        detail="There was a problem updating the database")
  return result


@router.patch('/', response_model=List[to_do_model.ToDo])
def update_to_dos(to_dos: List[to_do_model.ToDo]):
  try:
    result = to_do_service.update_to_dos(to_dos)
  except PyMongoError:
    raise HTTPException(status_code=500,
                        detail="There was a problem updating the database")
  return result


@router.delete('/{to_do_id}')
def delete_a_to_dos(to_do_id: str):
  try:
    to_do_service.clear_a_to_do(to_do_id)
  except PyMongoError:
    raise HTTPException(status_code=500,
                        detail="There was a problem updating the database")
  return {'deleted': to_do_id}


@router.delete('/')
def delete_completed_to_dos():
  try:
    delete_count = to_do_service.clear_completed_to_dos()
  except PyMongoError:
    raise HTTPException(status_code=500,
                        detail="There was a problem updating the database")
  return {'deletedCount': delete_count}
