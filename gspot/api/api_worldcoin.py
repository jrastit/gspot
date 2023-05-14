from flask import Blueprint, request
import requests

from gspot.blockchain.deploy import get_contract_address

from gspot.backend.data import get_ip_list, get_owner_stack, get_user_stack

import logging

worldcoin_api = Blueprint('worldcoin_api', __name__)

api_url = "https://developer.worldcoin.org/api/v1"


def _request(method, url, params=None, data=None):
    response_data = None
    error = None
    status_code = None
    try:
        response = requests.request(
            method=method,
            url=api_url + url,
            json=data,
            params=params,
        )
        status_code = response.status_code
        if status_code == 200:
            response_data = response.json()
        else:
            try:
                error = response.json()['error']
            except Exception as e:
                error = response.text
    except Exception as e:
        error = 'API call exception: ' + str(e)
    return status_code, response_data, error


@worldcoin_api.route(
    "/api/worldcoin/",
    methods=['POST']
)
def api_worldcoin():
    content = request.json
    logging.info(content)
    content['action'] = "free-credit"
    content["signal"] = "random_signal"
    logging.info(content)
    answer = _request(
        'POST',
        '/verify/app_13ab310215a3903f8d78039d17ce46a6',
        data=content,
    )
    logging.info(answer)
    if answer[1]['success'] is True:
        return {'success': True}, 200
    return {'error'}, 400

'''
{
    "action": "vote_1",
    "signal": "user_value",
    "credential_type": "orb",
    "merkle_root": "0x1f38b57f3bdf96f05ea62fa68814871bf0ca8ce4dbe073d8497d5a6b0a53e5e0",
    "nullifier_hash": "0x0339861e70a9bdb6b01a88c7534a3332db915d3d06511b79a5724221a6958fbe",
    "proof": "0x063942fd7ea1616f17787d2e3374c1826ebcd2d41d2394d915098c73482fa59516145cee11d59158b4012a463f487725cb3331bf90a0472e17385832eeaec7a713164055fc43cc0f873d76752de0e35cc653346ec42232649d40f5b8ded28f202793c4e8d096493dc34b02ce4252785df207c2b76673924502ab56b7e844baf621025148173fc74682213753493e8c90e5c224fc43786fcd09b624115bee824618e57bd28caa301f6b21606e7dce789090de053e641bce2ce0999b64cdfdfb0a0734413914c21e4e858bf38085310d47cd4cc6570ed634faa2246728ad64c49f1f720a39530d82e1fae1532bd7ad389978b6f337fcd6fa6381869637596e63a1"
}

{
'nullifier_hash': '0x2bd8f533e2326235b1eb1934039050c8db75642043a5faf410dbbaabf01a08fd', 
'proof': '0x2b5ef1c0ee48e284d9f51ef2f80b21e0ff48e94a8031f24bb1a3fc9bb894521414537592d87fad03a0d5f4d3417d101da98123f0896cab0d2ada7f0a712baac6026a4d188ab7714d7ad951f6909407cb9939c7d0bcfcd62ac28f68fb17d9222119c080626f0e0895261ff2e7e11204dab6ed7a88b01f1609f68755ea629c29e702d55359fd19f4286e31298e95c386669fbdf028be99b986a1efe460c254b22e1903d9873bf536ab25a58d97ece947d927075eca2393a70efb875aae5676987f27592bd3177f8340329224de721ad406bf8a163d482da4178f42a2879025d3e61af302a62c08464297624594813e8438cbab8d4d79cd069ddaedff8dd02eac44', 
'merkle_root': '0x2787b06a4e207265f70d6073ac68da99d78033b284d653802434207152dd8b90', 
'credential_type': 'orb'}
'''
