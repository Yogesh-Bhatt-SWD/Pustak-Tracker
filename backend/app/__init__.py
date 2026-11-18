"""
Flask application factory.

Imports extension instances from ``extensions.py`` (avoiding circular imports)
and registers all refactored blueprints.
"""

import os
from flask import Flask, request
from datetime import datetime, timezone

from .extensions import db, migrate, jwt, csrf, limiter


def create_app():
    base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
    app = Flask(__name__)
    # Jinja2 settings
    app.jinja_env.auto_reload = True
    app.jinja_env.cache = {}
    app.jinja_env.globals['now'] = lambda: datetime.now(timezone.utc)

    # Load configuration
    config_name = os.getenv('FLASK_ENV', 'development')
    if config_name == 'production':
        from .config import ProductionConfig
        app.config.from_object(ProductionConfig)
    else:
        from .config import DevelopmentConfig
        app.config.from_object(DevelopmentConfig)

    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    csrf.init_app(app)
    limiter.init_app(app)

    # JWT error handlers
    from flask import jsonify as _jsonify

    @jwt.expired_token_loader
    def expired_token_callback(jwt_header, jwt_payload):
        app.logger.warning(f"Expired token: {jwt_payload}")
        return _jsonify({'error': 'Token has expired'}), 401

    @jwt.invalid_token_loader
    def invalid_token_callback(error):
        app.logger.warning(f"Invalid token: {error}")
        return _jsonify({'error': 'Invalid token'}), 401

    @jwt.unauthorized_loader
    def missing_token_callback(error):
        app.logger.warning(f"Missing token: {error}")
        return _jsonify({'error': 'Authorization token is missing'}), 401

    @jwt.revoked_token_loader
    def revoked_token_callback(jwt_header, jwt_payload):
        app.logger.warning(f"Revoked token: {jwt_payload}")
        return _jsonify({'error': 'Token has been revoked'}), 401

    # -----------------------------------------------------------------------
    # CORS configuration for frontend and mobile app
    # Set CORS_ORIGINS environment variable to specify allowed origins
    # (e.g., 'https://example.com,https://app.example.com')
    # -----------------------------------------------------------------------
    allowed_origins = os.getenv('CORS_ORIGINS', '').split(',') if os.getenv('CORS_ORIGINS') else []
    allowed_origins = [origin.strip() for origin in allowed_origins if origin.strip()]
    
    @app.before_request
    def _handle_api_preflight():
        if request.method == 'OPTIONS' and request.path.startswith('/api/'):
            from flask import Response
            resp = Response(status=200)
            origin = request.headers.get('Origin')
            if not allowed_origins:
                # If no origins configured, require explicit configuration in production
                if app.config.get('DEBUG'):
                    resp.headers['Access-Control-Allow-Origin'] = origin or 'http://localhost:5173'
                else:
                    resp.status_code = 403
                    return resp
            elif origin in allowed_origins:
                resp.headers['Access-Control-Allow-Origin'] = origin
            else:
                resp.status_code = 403
                return resp
            resp.headers['Access-Control-Allow-Headers'] = 'Authorization, Content-Type'
            resp.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'
            resp.headers['Access-Control-Allow-Credentials'] = 'true'
            return resp

    @app.after_request
    def _add_api_cors_headers(response):
        if request.path.startswith('/api/'):
            origin = request.headers.get('Origin')
            if not allowed_origins:
                if app.config.get('DEBUG'):
                    response.headers['Access-Control-Allow-Origin'] = origin or 'http://localhost:5173'
                else:
                    # Don't add CORS headers if no allowed origins configured in production
                    return response
            elif origin in allowed_origins:
                response.headers['Access-Control-Allow-Origin'] = origin
            else:
                # Don't add CORS headers for disallowed origins
                return response
            response.headers['Access-Control-Allow-Headers'] = 'Authorization, Content-Type'
            response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'
            response.headers['Access-Control-Allow-Credentials'] = 'true'
        return response

    from flask import send_from_directory
    @app.route('/mobile_scanner.html')
    def mobile_scanner():
        return send_from_directory(base_dir, 'mobile_scanner.html')

    # API routes
    from .routes.api import api_bp
    app.register_blueprint(api_bp, url_prefix='/api')
    csrf.exempt(api_bp)  # API uses JWT auth, not CSRF tokens

    # Register CLI commands from seed.py
    from .seed import register_cli_commands
    register_cli_commands(app)

    return app
