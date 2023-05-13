from brownie import network, accounts, Contract as ContractBrownie
import json


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