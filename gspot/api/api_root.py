#!/usr/bin/3
from flask import jsonify, Blueprint, render_template, request, session
from os import getenv


root_api = Blueprint('root_api', __name__)


@root_api.route(
    "/",
    methods=['GET']
)
@root_api.route(
    "/free",
    methods=['GET']
)
def api_root():
    return render_template("index.html")

@root_api.route(
    "/sismo",
    methods=['GET']
)
def api_sismo():
    return render_template("index.html")

@root_api.route(
    "/admin",
    methods=['GET']
)
def api_admin():
    return render_template("index.html")