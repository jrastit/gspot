from brownie import accounts
from gspot.blockchain.account import acct


def faucet():
    acct2 = accounts.add(
        '0xbbfbee4961061d506ffbb11dfea'
        '64eba16355cbf1d9c29613126ba7fec0aed5d')
    acct2.transfer(acct, amount=10000)
