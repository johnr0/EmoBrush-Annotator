import requests
from flask import Flask, _app_ctx_stack, jsonify, request
from flask_cors import CORS
import os
import sqlite3
import datetime
import random
import petname
import json 


from model.model import EmoSketchModel
import torch

device = torch.device("cuda") if torch.cuda.is_available() else torch.device("cpu")

model = torch.load('./model/emosketch_lstm4.pt', map_location=device)
labels = ['happy', 'sad', 'fearful', 'surprised', 'disgusted', 'angry']

api = Flask(__name__)
CORS(api, resources={r"/*": {"origins": "*"}})
api.config['CORS_HEADERS'] = 'Content-Type'
api.config['JSONIFY_PRETTYPRINT_REGULAR'] = False

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATABASE=os.path.join(BASE_DIR, './database/database.db')

def get_db():
    top = _app_ctx_stack.top
    print(hasattr(top, 'sqlite_db'), DATABASE)
    if not hasattr(top, 'sqlite_db'):
        top.sqlite_db = sqlite3.connect(DATABASE)
    return top.sqlite_db

emotion_set = ['happy', 'sad', 'disgusted', 'angry', 'fearful', 'surprised']
time_set = [5000, 3000, 1000]
repeat = 10


@api.route('/ExistingAnnotator', methods=['POST'])
def ExistingAnnotator():
    print('Existing annotator!')
    conn = get_db()
    cursor = get_db().cursor()
    d = json.loads(request.get_data())
    _id = d['annotator_id']
    cursor.execute('SELECT * From Annotator WHERE User = ?', (_id,))
    annotator_fetched = cursor.fetchall()
    if len(annotator_fetched)==0:
        return jsonify({'response': 'no_annotator'})
    
    cursor.execute('SELECT * From Annotation WHERE User = ? AND TaskEndedAt IS NULL ORDER BY TaskOrder', (_id,))
    task_fetched = cursor.fetchall()
    if len(task_fetched)==0:
        return jsonify({'response': 'task_done'})

    return jsonify({'order': task_fetched[0][2]})

@api.route('/NewAnnotator', methods=['POST'])
def NewAnnotator():
    print('New annotator!')
    conn = get_db()
    cursor = get_db().cursor()
    # create a new annotator
    while True:
        _id = petname.Generate(2)
        cursor.execute('SELECT * From Annotator WHERE User = ?', (_id,))
        fetched = cursor.fetchall()
        if len(fetched)==0:
            break
    t = datetime.datetime.now()
    cursor.execute('INSERT INTO Annotator (User, UserCreatedAt, TaskCount) values (?,?,?);', (_id, t,0))

    # create a new annotator tasks based on the emotion dictionary
    emo_ids = list(range(len(emotion_set)))
    random.shuffle(emo_ids)
    for emo_idx, idx in enumerate(emo_ids):

        emotion = emotion_set[idx]
        print(_id, t, emotion, emo_idx)
        for time_idx, time in enumerate(time_set):
            for repeat_idx in range(repeat):
                cursor.execute('INSERT INTO Annotation (User, TaskOrder, TaskLength, TaskCreatedAt, Emotion) values (?,?,?,?,?);', (_id, repeat_idx+time_idx*repeat+emo_idx*len(time_set)*repeat, time, t, emotion))

    conn.commit()
    conn.close()
    response_body = {
        'annotator_id':_id, 
    }
    return jsonify(response_body)

@api.route('/initiateTask', methods=['POST'])
def initiateTask():
    print('initate task!')
    cursor = get_db().cursor()

    d = json.loads(request.get_data())
    _id = d['annotator_id']
    taskorder = d['order']
    cursor.execute('SELECT * From Annotation WHERE User = ? AND TaskOrder = ?', (_id, taskorder))
    fetched = cursor.fetchall()
    if len(fetched)==0:
        return jsonify({'response': 'no_task'})
    print(fetched)
    
    return jsonify({'emotion': fetched[0][4], 'tasktime': fetched[0][3]})

@api.route('/startTask', methods=['POST'])
def startTask():
    print('start task!')
    conn = get_db()
    cursor = get_db().cursor()
    d = json.loads(request.get_data())
    _id = d['annotator_id']
    taskorder = d['order']
    t = datetime.datetime.now()
    cursor.execute('UPDATE Annotation SET TaskStartedAt = ? WHERE User=? AND TaskOrder=?;', (t, _id, taskorder,))
    conn.commit()
    conn.close()
    return jsonify({})

@api.route('/submitTask', methods=['POST'])
def submitTask():
    print('submit task!')
    conn = get_db()
    cursor = get_db().cursor()
    d = json.loads(request.get_data())
    _id = d['annotator_id']
    taskorder = d['order']
    data = json.dumps(d['data'])
    t = datetime.datetime.now()
    cursor.execute('UPDATE Annotation SET Data = ?, TaskEndedAt = ? WHERE User=? AND TaskOrder=?;', (data, t, _id, taskorder,))
    conn.commit()
    conn.close()
    return jsonify({})

@api.route('/Recognition', methods=['POST'])
def Recognition():
    d = json.loads(request.get_data())
    data = d['data']
    print(data)
    input = torch.Tensor([data]).to(device)
    with torch.no_grad():
        output = model.forward(input)
    print(output)
    result = {}
    for idx, label in enumerate(labels):
        result[label] = float(output[0][idx])
    print(result)

    return jsonify({'result':result})

@api.route('/ImgGen', methods=['POST'])
def ImgGen():
    d = json.loads(request.get_data())
    data = d['data']
    prompt = d['prompt']
    negative_prompt = d['negative_prompt']
    input = torch.Tensor([data]).to(device)
    with torch.no_grad():
        output = model.forward(input)
    result = {}
    for idx, label in enumerate(labels):
        result[label] = float(output[0][idx])

    url = 'http://4832-34-87-3-8.ngrok.io/imgGen'
    myobj = {'emotions': result, 'prompt':prompt, 'negative_prompt': negative_prompt}
    print('sending...', result, prompt, negative_prompt)
    x = requests.post(url, json = myobj)

    return jsonify({'result':x.json()['img']})

if __name__ == "__main__":
    api.run(host='0.0.0.0', debug=True)