from flask import Flask, jsonify, request
from flask_pymongo import PyMongo
from bson.objectid import ObjectId
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)

app.config['MONGO_URI'] = os.environ.get('MONGO_URI', 'mongodb://localhost:27017/todo_db')
mongo = PyMongo(app)
tasks_collection = mongo.db.tasks

@app.route('/tasks', methods=['GET'])
def get_tasks():
    tasks = list(tasks_collection.find())
    for task in tasks:
        task['_id'] = str(task['_id'])
    return jsonify(tasks)

@app.route('/tasks', methods=['POST'])
def add_task():
    data = request.json
    task_id = tasks_collection.insert_one(data).inserted_id
    return jsonify({'_id': str(task_id)})

@app.route('/tasks/<id>', methods=['PUT'])
def update_task(id):
    data = request.json
    tasks_collection.update_one({'_id': ObjectId(id)}, {'$set': data})
    return jsonify({'status': 'updated'})

@app.route('/tasks/<id>', methods=['DELETE'])
def delete_task(id):
    tasks_collection.delete_one({'_id': ObjectId(id)})
    return jsonify({'status': 'deleted'})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
