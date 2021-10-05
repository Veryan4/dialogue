# -*- coding: utf-8 -*-
"""The Main Module

This module initializes the application by booting the FastAPI library and
loading the controller routes.

Todo:
    * Implement tracing for easier debugging.

"""
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from controllers import to_do_controller

load_dotenv()

app = FastAPI()

origins = [
    "http://localhost", "http://localhost:3000", "http://localhost:4000",
    "http://localhost:80"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(to_do_controller.router)
