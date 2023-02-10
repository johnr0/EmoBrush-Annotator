from flask import Flask, _app_ctx_stack, jsonify
from flask_cors import CORS
import os
import sqlite3
import datetime
import random
import petname


api = Flask(__name__)
CORS(api, resources={r"/*": {"origins": "*"}})
api.config['CORS_HEADERS'] = 'Content-Type'
api.config['JSONIFY_PRETTYPRINT_REGULAR'] = False

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATABASE=os.path.join(BASE_DIR, './database.db')

def get_db():
    top = _app_ctx_stack.top
    print(hasattr(top, 'sqlite_db'), DATABASE)
    if not hasattr(top, 'sqlite_db'):
        top.sqlite_db = sqlite3.connect(DATABASE)
    return top.sqlite_db

emotion_set = ['happy', 'sad', 'disgusted', 'angry', 'fearful', 'surprised']
time_set = [5]

@api.route('/profile')
def my_profile():
    response_body = {
        "name": "Nagato",
        "about" :"Hello! I'm a full stack developer that loves python and javascript"
    }

    return jsonify(response_body)

@api.route('/NewWorker', methods=['POST'])
def NewWorker():
    print('New worker!')
    conn = get_db()
    cursor = get_db().cursor()
    # create a new worker
    while True:
        _id = petname.Generate(2)
        cursor.execute('SELECT * From Annotator WHERE User = ?', (_id,))
        fetched = cursor.fetchall()
        if len(fetched)==0:
            break
    t = datetime.datetime.now()
    cursor.execute('INSERT INTO Annotator (User, UserCreatedAt, TaskCount) values (?,?,?);', (_id, t,0))

    # create a new worker tasks based on the emotion dictionary
    emo_ids = list(range(len(emotion_set)))
    random.shuffle(emo_ids)
    for meta_idx, idx in enumerate(emo_ids):

        emotion = emotion_set[idx]
        print(_id, t, emotion, meta_idx)
        cursor.execute('INSERT INTO Annotation (User, TaskOrder, TaskCreatedAt, Emotion) values (?,?,?,?);', (_id, meta_idx, t, emotion))

    conn.commit()
    response_body = {
        'worker_id':_id, 
    }
    return jsonify(response_body)