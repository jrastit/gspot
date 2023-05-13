#!/bin/bash
set -e

virtualenv -p python3 venv

source venv/bin/activate
. ./env.sh

flask --app server.py:app run