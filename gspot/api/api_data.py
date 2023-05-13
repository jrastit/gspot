from flask import Blueprint

data_api = Blueprint('data_api', __name__)
from gspot.backend.data import get_ip_list, stakes


@data_api.route(
    "/api/ip/",
    methods=['GET']
)
def api_get_ip_list():
    return {
        'owner_stake': stakes['owner'],
        'user_stake': stakes['user'],
        'ip_list': get_ip_list()
    }
