import logging


def get_ip(gspot_contract, ip):
    ret = gspot_contract.getIp(ip)
    logging.info(ret)
    return ret
