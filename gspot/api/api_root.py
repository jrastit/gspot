#!/usr/bin/3
from flask import jsonify, Blueprint, render_template, request, session
from os import getenv


root_api = Blueprint('root_api', __name__)


@root_api.route(
    "/",
    methods=['GET']
)
def api_root():
    return render_template("index.html")

