from gspot.blockchain.account import acct
import logging

def update_running(gspot_contract, antenna, running):
    gspot_contract.setRunning(antenna, running, {'from': acct})


def update_ip_enable(gspot_contract, ip, enable):
    gspot_contract.setIp(ip, enable, {'from': acct})


def add_ip_stake(gspot_contract, ip, stake):
    logging.info('stake %s %i', ip, stake)
    gspot_contract.stake(ip, {'from': acct, 'value': stake})

