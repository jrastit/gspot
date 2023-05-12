from os import getenv
from brownie import network, accounts, Contract as ContractBrownie
from web3.middleware import construct_sign_and_send_raw_middleware
from web3 import Web3
import logging
import json
from threading import Thread
from time import sleep

network_env = getenv('BLOCKCHAIN_NETWORK')
if not network_env:  # pragma: no cover
    network_env = 'development'
network.connect(network_env)

acct = accounts.load('testac', 'test')


def get_gas_price():
    return 0


def watch_gspot(gspot_contract):
    while 1:
        logging.info('gspot watch ' + str(gspot_contract.running()))
        sleep(1)


def get_contract_from_address(contract_address):
    try:
        abi = open("build/contracts/GSpot.json", "r")
        contract = ContractBrownie.from_abi(
            'GSpot',
            str(contract_address),
            json.load(abi)["abi"]
        )
        abi.close()
    except Exception:
        raise Exception('contract not found in brownie')
    return contract


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
    print(tx_receipt['contractAddress'])
    gspot.address = tx_receipt['contractAddress']
    return gspot


def main():
    logging.basicConfig(level=logging.INFO)
    gspot = deploy()
    logging.debug('gspot address' + gspot.address)
    gspot_contract = get_contract_from_address(gspot.address)
    Thread(target=watch_gspot, args=(gspot_contract,)).start()
    while 1:
        logging.debug('main')
        gspot_contract.setRunning({'from': acct})
        sleep(5)


if __name__ == '__main__':
    main()
    