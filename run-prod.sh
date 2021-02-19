#!/bin/sh -xe

export DJANGO_SETTINGS_MODULE="mentoring.settings"

python manage.py migrate
gunicorn mentoring.wsgi:application -b 0.0.0.0:"${PORT:-8000}" --log-file -
