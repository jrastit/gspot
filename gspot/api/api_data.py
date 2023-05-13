from flask import jsonify, Blueprint

data_api = Blueprint('data_api', __name__)
from gspot.backend.data import get_ip_list


@data_api.route(
    "/api/ip/",
    methods=['GET']
)
def api_get_ip_list():
    return {
        'ip_list': get_ip_list()
    }
