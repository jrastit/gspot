from flask import jsonify, Blueprint

data_api = Blueprint('data_api', __name__)
from gspot.backend.data import ip_list


@data_api.route(
    "/api/ip/",
    methods=['GET']
)
def api_get_ip_list():
    return {
        'ip_list': ip_list()
    }


