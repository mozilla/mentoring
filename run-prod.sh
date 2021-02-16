#!/bin/sh -xe

python manage.py migrate
gunicorn mentoring.wsgi:application -b 0.0.0.0:${PORT:-8000} --log-file -
