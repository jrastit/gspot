import logging


def get_ip(gspot_contract, ip):
    ret = gspot_contract.getIp(ip)
    logging.info(ret)
    return ret


def user_stake(gspot_contract):
    ret = gspot_contract.userStake()
    logging.info('User stake %i', ret)
    return ret


def owner_stake(gspot_contract):
    ret = gspot_contract.ownerStake()
    logging.info('Owner stake %i', ret)
    return ret
