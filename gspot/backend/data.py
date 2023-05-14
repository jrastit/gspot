import logging
from random import randrange
from threading import Lock, Thread
from time import sleep

from gspot.contract.get import \
    get_ip, user_stake, owner_stake
from gspot.contract.modify import \
    update_ip_enable, \
    update_running, \
    add_ip_stake, \
    bill_ip

data_lock = Lock()
ip_list = []
owner_stack = ''
user_stack = ''

thread_ok = False

def get_owner_stack():
    return owner_stack


def get_user_stack():
    return user_stack


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


def init_spot(gspot_contract):
    with data_lock:
        for i in range(8):
            ip = '192.168.1.' + str(i + 130)
            update_ip_enable(gspot_contract, ip, False)
            ip_list.insert(len(ip_list) + 1, {
                'ip': ip,
                'enable': False,
                'stake': 0,
                'owner': '',
            })


def watch_gspot(gspot_contract, antenna):
    global user_stack
    global owner_stack
    global thread_ok
    while thread_ok:
        running = gspot_contract.getRunning(antenna)
        logging.info('gspot watch ' + str(running))

        user_stack = user_stake(gspot_contract)
        owner_stack = owner_stake(gspot_contract)
        with data_lock:
            for ip in ip_list:
                ip_info = get_ip(gspot_contract, ip['ip'])
                logging.debug('%s %s', str(ip), str(ip_info))
                ip['enable'] = ip_info[0]
                ip['stake'] = str(ip_info[1])
                ip['owner'] = str(ip_info[2])
                logging.debug('%s %s %s %s',
                              ip['ip'],
                              ip['enable'],
                              ip['stake'],
                              ip['owner']
                              )
        sleep(1)


def sync_sport(gspot_contract, antenna):
    running = False
    i = 0
    while thread_ok:
        logging.debug('main')
        running = not running
        update_running(gspot_contract, antenna, running)
        i += 1
        ip = '10.10.10.' + str(i)
        with data_lock:
            if len(ip_list) < 15:
                update_ip_enable(gspot_contract, ip, False)
                ip_list.insert(len(ip_list) + 1, {
                    'ip': ip,
                    'enable': False,
                    'stake': 0,
                    'owner': '',
                })
            for ip in ip_list:
                if ip['ip'].startswith('10.'):
                    a = randrange(100)
                    if a <= 10:
                        add_ip_stake(gspot_contract, ip['ip'], 1 + randrange(2))
                    if a >= 85:
                        bill_ip(gspot_contract, ip['ip'], 1)
        sleep(5)
