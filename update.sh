#!/bin/bash
set -e

source venv/bin/activate
brownie compile
cd front
yarn install
yarn build
cd ..
./server.sh