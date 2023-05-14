#!/bin/bash
set -e

source venv/bin/activate

brownie networks add Scroll scrollnet host=https://alpha-rpc.scroll.io/l2 chainid=534353