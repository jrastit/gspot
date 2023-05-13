from flask import Flask
from flask_cors import CORS

from gspot.api.api_root import root_api


def create_app():
    app = Flask(
        __name__,
        static_url_path='',
        static_folder='../front/build',
        template_folder='../front/build'
    )
    #ok for demo, remove from git later
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

    return app
