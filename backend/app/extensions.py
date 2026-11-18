"""
Centralised Flask extension instances.

Importing extensions from here (instead of __init__.py) avoids circular imports.
"""

from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from flask_wtf.csrf import CSRFProtect
<<<<<<< HEAD
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
=======
>>>>>>> 261b26f0d344442055b6ed9b7693aa0c4580cc30

db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()
csrf = CSRFProtect()
<<<<<<< HEAD
limiter = Limiter(key_func=get_remote_address)
=======
>>>>>>> 261b26f0d344442055b6ed9b7693aa0c4580cc30
