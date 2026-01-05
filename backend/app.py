from flask import Flask, jsonify, request
from flask_pymongo import PyMongo
from bson.objectid import ObjectId
from flask_cors import CORS
from flask_socketio import SocketIO, emit, join_room, leave_room
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
import os
import datetime

app = Flask(__name__)
CORS(app)

# Configuration
app.config['MONGO_URI'] = os.environ.get('MONGO_URI', 'mongodb://localhost:27017/todo_db')
app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY', 'enterprise-super-secret-key')
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'enterprise-socket-secret')

mongo = PyMongo(app)
jwt = JWTManager(app)
socketio = SocketIO(app, cors_allowed_origins="*", async_mode='eventlet')

# Collections
users_collection = mongo.db.users
tasks_collection = mongo.db.tasks
scans_collection = mongo.db.scans

# --- Auth Routes ---
@app.route('/register', methods=['POST'])
def register():
    data = request.json
    if users_collection.find_one({'username': data['username']}):
        return jsonify({'message': 'User already exists'}), 400
    
    hashed_pw = generate_password_hash(data['password'])
    user_id = users_collection.insert_one({
        'username': data['username'],
        'password': hashed_pw,
        'role': data.get('role', 'worker'), # 'admin' or 'worker'
        'created_at': datetime.datetime.utcnow()
    }).inserted_id
    
    return jsonify({'message': 'User created', 'id': str(user_id)}), 201

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    user = users_collection.find_one({'username': data['username']})
    
    if user and check_password_hash(user['password'], data['password']):
        access_token = create_access_token(identity={'username': user['username'], 'role': user['role']})
        return jsonify({
            'access_token': access_token,
            'role': user['role'],
            'username': user['username']
        }), 200
    
    return jsonify({'message': 'Invalid credentials'}), 401

# --- Scan Routes (Admin) ---
@app.route('/scans', methods=['POST'])
@jwt_required()
def create_scan():
    current_user = get_jwt_identity()
    if current_user['role'] != 'admin':
        return jsonify({'message': 'Admin only'}), 403
    
    scan_id = scans_collection.insert_one({
        'name': request.json.get('name', 'Quick Scan'),
        'created_by': current_user['username'],
        'status': 'active',
        'created_at': datetime.datetime.utcnow()
    }).inserted_id
    
    return jsonify({'scan_id': str(scan_id), 'message': 'Scan created'}), 201

@app.route('/scans', methods=['GET'])
@jwt_required()
def get_scans():
    scans = list(scans_collection.find())
    for s in scans:
        s['_id'] = str(s['_id'])
    return jsonify(scans)

# --- Real-Time Events ---
@socketio.on('join_scan')
def handle_join(data):
    scan_id = data.get('scan_id')
    username = data.get('username')
    join_room(scan_id)
    print(f"User {username} joined scan {scan_id}")
    emit('user_joined', {'username': username}, room=scan_id)

@socketio.on('submit_task')
def handle_task_submission(data):
    # data: { scan_id, content, author }
    task = {
        'scan_id': data['scan_id'],
        'content': data['content'],
        'author': data['author'],
        'status': 'pending', # pending, validated, refused
        'timestamp': datetime.datetime.utcnow().isoformat()
    }
    task_id = tasks_collection.insert_one(task).inserted_id
    task['_id'] = str(task_id)
    
    # Broadcast to everyone in the scan room (Admin & other workers)
    emit('task_received', task, room=data['scan_id'])

@socketio.on('update_task_status')
def handle_status_update(data):
    # data: { task_id, status, scan_id }
    tasks_collection.update_one(
        {'_id': ObjectId(data['task_id'])},
        {'$set': {'status': data['status']}}
    )
    emit('task_status_updated', data, room=data['scan_id'])

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=5000)
