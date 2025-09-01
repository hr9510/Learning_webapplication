from app import createApp, db
from flask_cors import CORS

app = createApp()
CORS(app, supports_credentials=True, origins=["http://localhost:3000"])

with app.app_context():
    db.create_all()

if __name__ == "__main__":
    app.run(debug=True)
