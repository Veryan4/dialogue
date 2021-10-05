FROM python:3.9.2-slim AS compile-image

RUN python -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

COPY ./server/ .

RUN pip install -r requirements.txt

#Run tests
RUN pip install -r requirements-for-tests.txt
RUN pytest -vv tests
#Remove tests after pass for smaller image
RUN cd .. && pip uninstall -y -r requirements-for-tests.txt

FROM python:3.9.2-slim-buster AS build-image
COPY --from=compile-image /opt/venv /opt/venv

ENV PATH="/opt/venv/bin:$PATH"

COPY ./server/ .
RUN rm -r ./tests

CMD gunicorn --workers=4 --worker-class=uvicorn.workers.UvicornH11Worker --bind=0.0.0.0:5057 main:app
