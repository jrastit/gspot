from flask import Blueprint, request

from gspot.blockchain.contract import get_contract_from_address
from gspot.blockchain.deploy import get_contract_address
from gspot.contract.modify import bill_ip

data_api = Blueprint('data_api', __name__)
from gspot.backend.data import get_ip_list, get_owner_stack, get_user_stack

ip_sizes = {}
ip_billing = {}
ip_billed = {}

@data_api.route(
    "/api/ip/",
    methods=['GET']
)
def api_get_ip_list():
    ret = []
    for ip_info in get_ip_list():
        totalSize = 0
        if ip_info['ip'] in ip_sizes:
            totalSize = ip_sizes[ip_info['ip']]
        totalBilled = 0
        if ip_info['ip'] in ip_billed:
            totalBilled = ip_billed[ip_info['ip']]
        ret.insert(len(ret), {
            'ip': ip_info['ip'],
            'enable': ip_info['enable'],
            'stake': ip_info['stake'],
            'owner': ip_info['owner'],
            'totalSize': totalSize,
            'totalBilled': totalBilled,
        })
    return {
        'owner_stake': str(get_owner_stack()),
        'user_stake': str(get_user_stack()),
        'ip_list': ret
    }


@data_api.route(
    "/api/contract/",
    methods=['GET']
)
def api_get_contract():
    return {
        'address': get_contract_address()
    }




@data_api.route(
    "/api/show/",
    methods=['POST'],
)
def api_show():
    data = request.data.decode('ascii')
    lines = data.split('\n')
    for line in lines:
        parts = line.split()
        if len(parts) > 0:
            size = int(parts[0])
            ip = parts[1]
            if ip in ip_sizes:
                currentSize = ip_sizes[ip]
                ip_sizes[ip] = size
                delta = size - currentSize
                ip_billing[ip] = ip_billing[ip] + delta
                billunit = 100000
                tobill = ip_billing[ip] // billunit
                if tobill > 0:
                    bill_ip(get_contract_from_address(get_contract_address()), ip, tobill)
                    ip_billing[ip] = ip_billing[ip] - (billunit * tobill)
                    if ip in ip_billed:
                        ip_billed[ip] = ip_billed[ip] + tobill
                    else:
                        ip_billed[ip] = tobill
            else:
                ip_sizes[ip] = size
                ip_billing[ip] = 0
    return {
        'success': True
    }
