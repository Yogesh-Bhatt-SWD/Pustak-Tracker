#!/usr/bin/env python3
"""
Pustak Tracker — Library Management System
Application entry point.
"""

import os
from app import create_app
from app.extensions import db
from app.models import User, Book, Transaction, Category, Reservation, Fine, Notification

app = create_app()


@app.shell_context_processor
def make_shell_context():
    """Make database models available in Flask shell."""
    return {
        'db': db,
        'User': User,
        'Book': Book,
        'Transaction': Transaction,
        'Category': Category,
        'Reservation': Reservation,
        'Fine': Fine,
        'Notification': Notification,
    }


def _get_local_ip():
    """Get local IP address."""
    try:
        import socket
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(('8.8.8.8', 80))
        ip = s.getsockname()[0]
        s.close()
        return ip
    except Exception:
        return 'localhost'


if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    is_dev = os.getenv('FLASK_ENV') != 'production'
    local_ip = _get_local_ip()

    if is_dev:
        print("\n" + "=" * 70)
        print("  Pustak Tracker - Library Management System")
        print("=" * 70)
        print(f"\n  [*] Backend Server Running")
        print(f"     Local:   http://localhost:{port}")
        print(f"     Network: http://{local_ip}:{port}")
        print("\n  [!] For login credentials, check your environment or documentation")
        print("\n" + "=" * 70 + "\n")
    
    ssl_context = None
    if is_dev and os.path.exists('cert.pem') and os.path.exists('key.pem'):
        ssl_context = ('cert.pem', 'key.pem')

    app.run(
        host='0.0.0.0',
        port=port,
        debug=is_dev,
        ssl_context=ssl_context,
    )
