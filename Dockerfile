ARG MAINTAINER="Dustin J. Mitchell <dustin@mozilla.com>"
ARG COMMIT="local-build"
ARG TAG=""

FROM node:14 AS frontend

COPY frontend/ /frontend/
RUN mkdir /static && \
    cd /frontend && \
    yarn install --frozen-lockfile && \
    yarn build

FROM python:3.9

LABEL commit=${COMMIT}
LABEL tag=$TAG
LABEL maintainer=${MAINTAINER}

MAINTAINER ${MAINTAINER}

COPY mentoring/ /app/mentoring
COPY static/ /app/static
COPY manage.py setup.cfg requirements.txt run-prod.sh /app/
COPY --from=frontend /static/frontend /app/static/frontend

WORKDIR /app

RUN pip install -U pip && \
    pip install -r requirements.txt && \
    python -m compileall ./mentoring/

EXPOSE 8000
ENV DJANGO_CONFIGURATION=Production

CMD /app/run-prod.sh
