from os import getenv
from web3.middleware import construct_sign_and_send_raw_middleware
from web3 import Web3
import json

from gspot.blockchain.gas import get_gas_price
from gspot.blockchain.account import acct

import logging


def deploy():
    w3 = Web3(Web3.HTTPProvider(getenv('WEB3_URL')))
    with open("build/contracts/GSpot.json") as f:
        info_json = json.load(f)
    abi = info_json["abi"]
    bytecode = info_json["bytecode"]
    gspot = w3.eth.contract(abi=abi, bytecode=bytecode)
    account = w3.eth.account.privateKeyToAccount(acct.private_key)
    '''
    account = w3.eth.account.from_mnemonic(
        'unit vanish midnight outside dumb width'
        ' sock mansion wire doctor horse escape'
    )
    '''
    w3.middleware_onion.add(construct_sign_and_send_raw_middleware(account))
    tx_hash = gspot.constructor().transact({
        'from': account.address,
        'gasPrice': get_gas_price()
    })
    tx_receipt = w3.eth.wait_for_transaction_receipt(tx_hash)
    logging.info('Contract address', tx_receipt['contractAddress'])
    gspot.address = tx_receipt['contractAddress']
    return gspot