from flask import Blueprint

from gspot.blockchain.deploy import get_contract_address

data_api = Blueprint('data_api', __name__)
from gspot.backend.data import get_ip_list, get_owner_stack, get_user_stack

@data_api.route(
    "/api/ip/",
    methods=['GET']
)
def api_get_ip_list():
    return {
        'owner_stake': get_owner_stack(),
        'user_stake': get_user_stack(),
        'ip_list': get_ip_list()
    }

@data_api.route(
    "/api/contract/",
    methods=['GET']
)
def api_get_contract():
    return {
        'address': get_contract_address()
    }
