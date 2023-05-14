import requests
from threading import Lock
from time import time
import warnings
from typing import Dict
from brownie.network.gas.bases import BlockGasStrategy
from brownie import network
from os import getenv

_gasnow_update = 0
_gasnow_data: Dict[str, int] = {}
_gasnow_lock = Lock()


def _fetch_gasnow(key: str) -> int:
    if network.chain.id == 1337:
        return 0
    if network.chain.id == 5:
        url = getenv('WEB3_URL')
    elif network.chain.id == 80001:
        url = getenv('WEB3_URL')
    else:
        raise Exception(
            'Unsupported network for gas :' + str(network.chain.id))
    global _gasnow_update
    with _gasnow_lock:
        time_since_update = int(time() - _gasnow_update)
        if time_since_update > 15:
            try:
                payload = {
                    "id": 1,
                    "jsonrpc": "2.0",
                    "method": "eth_gasPrice"
                }
                headers = {
                    "accept": "application/json",
                    "content-type": "application/json"
                }
                response = requests.post(url, json=payload, headers=headers)
                response.raise_for_status()
                ex_int = int(response.json()['result'], 16)
                # print(ex_int)
                data = {
                    'standard': ex_int,
                    'timestamp': time(),
                }
                _gasnow_update = data.pop("timestamp") // 1000
                _gasnow_data.update(data)
            except requests.exceptions.RequestException as exc:
                if time_since_update > 120:
                    raise
                warnings.warn(
                    f"{type(exc).__name__} while querying GasNow API. "
                    f"Last successful update was {time_since_update}s ago.",
                    RuntimeWarning,
                )

    return _gasnow_data[key]


def get_gas_price():
    gas_start = 100
    return int(_fetch_gasnow('standard') * gas_start / 100)


class CustomGasPrice(BlockGasStrategy):
    duration = 2

    gas_max = gas_start = 100

    def __init__(self, duration=2):
        BlockGasStrategy.__init__(self, block_duration=duration)
        self.duration = duration

    def get_gas_price(self):
        loop = 0
        while loop < 100:
            gas_price2 = get_gas_price()
            gas_step = 10
            gas_price2 = int(gas_price2 * (100 + (loop * gas_step)) / 100)
            if gas_price2 > self.gas_max:
                gas_price2 = self.gas_max
            print('get gas price', loop, gas_price2)
            yield gas_price2
            loop = loop + 1
