import os
# os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = '1'
from flask import Flask
from dotenv import load_dotenv
from datetime import timedelta
from .extensions import db, jwt, migrate

load_dotenv()


def createApp():
    app = Flask(__name__)
    app.secret_key = "super-secret-key"
    app.config.update({
        "SQLALCHEMY_DATABASE_URI": os.getenv("DATABASE"),
        "SQLALCHEMY_TRACK_MODIFICATIONS": False,
        "JWT_SECRET_KEY": os.getenv("JWT_SECRET_KEY"),
        "JWT_ACCESS_TOKEN_EXPIRES": timedelta(minutes=15),
        "JWT_REFRESH_TOKEN_EXPIRES": timedelta(days=30),
        "JWT_TOKEN_LOCATION" : ["cookies"],
        "JWT_COOKIE_SECURE" : False, # local test ke liye, deploy pe True karna,
        "JWT_COOKIE_SAMESITE" : "LAX",
        "JWT_COOKIE_CSRF_PROTECT" : False,

    })

    db.init_app(app)
    jwt.init_app(app)
    migrate.init_app(app, db)

    from .routes import main_bp
    app.register_blueprint(main_bp)   # ✅ added
    # app.register_blueprint(google_bp, url_prefix="/login")

    return app
