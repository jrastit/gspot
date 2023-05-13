import logging
from threading import Lock, Thread
from time import sleep
from random import randrange

from gspot.contract.get import \
    get_ip, user_stake, owner_stake
from gspot.contract.modify import \
    update_ip_enable, \
    update_running, \
    add_ip_stake, \
    bill_ip

data_lock = Lock()
ip_list = []


def get_ip_list():
    ret = []
    with data_lock:
        for ip_info in ip_list:
            ret.insert(len(ret), {
                'ip': ip_info['ip'],
                'enable': ip_info['enable'],
                'stake': ip_info['stake'],
                'owner': ip_info['owner'],
            })
    return ret


def thread_watch(gspot_contract, antenna):
    thread = Thread(target=watch_gspot, args=(gspot_contract, antenna,))
    thread.start()
    return thread


def thread_sync(gspot_contract, antenna):
    thread = Thread(target=sync_sport, args=(gspot_contract, antenna,))
    thread.start()
    return thread


def watch_gspot(gspot_contract, antenna):
    while 1:
        running = gspot_contract.getRunning(antenna)
        logging.info('gspot watch ' + str(running))

        user_stake(gspot_contract)
        owner_stake(gspot_contract)
        with data_lock:
            for ip in ip_list:
                ip_info = get_ip(gspot_contract, ip['ip'])
                logging.info('%s %s', str(ip), str(ip_info))
                ip['enable'] = ip_info[0]
                ip['stake'] = str(ip_info[1])
                ip['owner'] = str(ip_info[2])
                logging.info('%s %s %s %s',
                             ip['ip'],
                             ip['enable'],
                             ip['stake'],
                             ip['owner']
                             )
        sleep(1)


def sync_sport(gspot_contract, antenna):
    running = False
    i = 0
    while 1:
        logging.debug('main')
        running = not running
        update_running(gspot_contract, antenna, running)
        i += 1
        ip = '10.10.10.' + str(i)
        update_ip_enable(gspot_contract, ip, True)
        with data_lock:
            ip_list.insert(len(ip_list) + 1, {
                'ip': ip,
                'enable': False,
                'stake': 0,
                'owner': '',
            })
            for ip in ip_list:
                a = randrange(4)
                if a == 1:
                    add_ip_stake(gspot_contract, ip['ip'], 1)
                if a == 2:
                    bill_ip(gspot_contract, ip['ip'], 1)
        sleep(5)
