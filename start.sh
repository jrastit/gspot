#!/bin/bash
set -e

virtualenv -p python3 venv

source venv/bin/activate
. ./env.sh

#export WEB3_URL='http://localhost:8545'
export WEB3_URL='https://alpha-rpc.scroll.io/l2'
flask --app server.py:app run