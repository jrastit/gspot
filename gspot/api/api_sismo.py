from flask import Blueprint

from gspot.backend.data import \
    get_unique_wallet

import logging

sismo_api = Blueprint('sismo_api', __name__)


@sismo_api.route(
    "/api/sismo/",
    methods=['GET']
)
def api_sismo():
    ret = get_unique_wallet()
    return ret, 200

