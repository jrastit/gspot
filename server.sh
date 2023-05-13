#!/bin/bash
set -e

virtualenv -p python3 venv

source venv/bin/activate
. ./env.sh

export WEB3_URL='http://localhost:8545'
gunicorn --bind 0.0.0.0:9444 server:app