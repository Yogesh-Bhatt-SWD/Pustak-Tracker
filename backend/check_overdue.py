from app import create_app, db
from app.models import Transaction

app = create_app()
with app.app_context():
    overdue = Transaction.query.filter_by(status='overdue').all()
    print(f'Found {len(overdue)} overdue transactions:\n')
    for t in overdue:
        user_name = t.user.name if t.user else 'MISSING'
        book_title = t.book.title if t.book else 'MISSING'
        print(f'ID: {t.id}')
        print(f'  User: {user_name}')
        print(f'  Book: {book_title}')
        print(f'  Status: {t.status}')
        print(f'  Fine: {t.fine_amount}')
        print()
