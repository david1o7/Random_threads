from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from dotenv import load_dotenv
import os

load_dotenv() 

from flask import Flask, send_from_directory

app = Flask(__name__, static_folder='../frontend/build', static_url_path='')

# This route serves the React app's index.html for all non-API routes
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    return send_from_directory(app.static_folder, 'index.html')

CORS(app)


app.config['SQLALCHEMY_DATABASE_URI'] =  os.getenv("DATABASE_URL")
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)


class Thread(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.Text, nullable=False)
    username = db.Column(db.String(50), default='Anonymous')
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    likes = db.Column(db.Integer, default=0)
    replies = db.relationship('Reply', backref='thread', lazy=True, cascade="all, delete-orphan")

class Reply(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.Text, nullable=False)
    username = db.Column(db.String(50), default='Anonymous')
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    thread_id = db.Column(db.Integer, db.ForeignKey('thread.id'))

with app.app_context():
    db.create_all()


def thread_to_dict(thread):
    return {
        'id': thread.id,
        'content': thread.content,
        'username': thread.username,
        'timestamp': thread.timestamp.strftime('%Y-%m-%d %H:%M:%S'),
        'likes': thread.likes,
        'replies': [
            {
                'id': r.id,
                'content': r.content,
                'username': r.username,
                'timestamp': r.timestamp.strftime('%Y-%m-%d %H:%M:%S')
            } for r in thread.replies
        ]
    }

@app.route('/api/threads', methods=['POST'])
def create_thread():
    data = request.get_json(silent=True)
    if not data:
        return jsonify({'error': 'Invalid JSON or no data provided'}), 400
    content = data.get('content', '').strip()
    username = data.get('username', 'Anonymous').strip() or 'Anonymous'
    if not content:
        return jsonify({'error': 'Content cannot be empty'}), 400
    thread = Thread(content=content, username=username)
    db.session.add(thread)
    db.session.commit()
    return jsonify(thread_to_dict(thread)), 201

@app.route('/api/threads', methods=['GET'])
def get_threads():
    page = request.args.get('page', 1, type=int)
    per_page = 10
    pagination = Thread.query.order_by(Thread.timestamp.desc()).paginate(
        page=page, per_page=per_page, error_out=False
    )
    threads = pagination.items
    result = [thread_to_dict(t) for t in threads]
    return jsonify({
        'threads': result,
        'has_more': pagination.has_next
    })

@app.route('/api/threads/<int:thread_id>/reply', methods=['POST'])
def add_reply(thread_id):
    thread = Thread.query.get_or_404(thread_id)
    data = request.get_json(silent=True)
    if not data:
        return jsonify({'error': 'Invalid JSON or no data provided'}), 400
    content = data.get('content', '').strip()
    username = data.get('username', 'Anonymous').strip() or 'Anonymous'
    if not content:
        return jsonify({'error': 'Reply cannot be empty'}), 400
    reply = Reply(content=content, username=username, thread=thread)
    db.session.add(reply)
    db.session.commit()
    return jsonify({
        'id': reply.id,
        'content': reply.content,
        'username': reply.username,
        'timestamp': reply.timestamp.strftime('%Y-%m-%d %H:%M:%S')
    }), 201

@app.route('/api/threads/<int:thread_id>/like', methods=['POST'])
def like_thread(thread_id):
    thread = Thread.query.get_or_404(thread_id)
    thread.likes += 1
    db.session.commit()
    return jsonify({'likes': thread.likes})

@app.errorhandler(404)
def not_found(e):
    return jsonify({'error': 'Not found'}), 404

if __name__ == '__main__':
    app.run(debug=True)