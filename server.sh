#!/bin/bash
set -e

source venv/bin/activate
. ./env.sh
export WEB3_ALCHEMY_PROJECT_ID='_FqJQ0hyZZuXmlsiu6vOB369tl6ZCDPM'
#export WEB3_URL='http://localhost:8545'
brownie networks modify polygon-test host="https://polygon-mumbai.g.alchemy.com/v2/\$WEB3_ALCHEMY_PROJECT_ID"
gunicorn --bind 0.0.0.0:9444 server:app