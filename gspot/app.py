from os import getenv

from brownie import network
from flask import Flask
from flask_cors import CORS

from gspot.api.api_data import data_api
from gspot.api.api_root import root_api
from gspot.api.api_worldcoin import worldcoin_api
from gspot.api.api_sismo import sismo_api
from gspot.backend.data import thread_sync, thread_watch, init_spot
from gspot.blockchain.contract import get_contract_from_address
from gspot.blockchain.deploy import deploy
from gspot.blockchain.faucet import faucet

import logging

antenna = 'Small Cell 1'



network_env = getenv('BLOCKCHAIN_NETWORK')
if not network_env:  # pragma: no cover
    network_env = 'development'
network.connect(network_env)


def create_app():

    # faucet()
    contract = deploy()
    gspot_contract = get_contract_from_address(contract.address)
    init_spot(gspot_contract)
    thread_sync(gspot_contract, antenna)
    thread_watch(gspot_contract, antenna)
    app = Flask(
        __name__,
        static_url_path='',
        static_folder='../front/build',
        template_folder='../front/build'
    )
    # ok for demo, remove from git later
    app.config['SECRET_KEY'] = \
        '57pvLSMsL6GqGnruELHk9jFpr8Zfpxhy8XXT68UUVJuzKjeQS9n55Hdvecem4q' \
        'Z9KvKz2meHB9hwpRq93gHQy9WBeuHz3RZ4YNuXcZMkWLXqrdQqZ4QNY4mR4qDcUykd'
    app.config["SESSION_COOKIE_SAMESITE"] = "None"
    app.config["SESSION_COOKIE_SECURE"] = True
    app.config['MAX_CONTENT_LENGTH'] = 50 * 1024 * 1024
    # Added for allow origin issue
    CORS(app)

    app.app_context().push()

    # Register app services per section
    app.register_blueprint(root_api)
    app.register_blueprint(data_api)
    app.register_blueprint(worldcoin_api)
    app.register_blueprint(sismo_api)

    return app
