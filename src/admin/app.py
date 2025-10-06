from flask import Flask, request, render_template, jsonify
from flask import Flask
import threading
import threading
from datetime import datetime
import sys, os
import json

base_path = os.path.abspath(".")

app = Flask(__name__,
            template_folder=os.path.join(base_path, "templates"),
            static_folder=os.path.join(base_path, "static"))

@app.route('/data_ready')
def data_ready():
    return {"ready": True}

@app.route('/update-room-color', methods=['POST'])
def update_room_color():
    data = request.get_json()
    school_id = data.get('school')
    room_id = data.get('id')
    color = data.get('color')
   
    parent_dir = os.path.dirname(base_path)
    json_file_path = os.path.join(parent_dir,'models',
                            'school_1_room.json' if school_id == 'seq' else 'school_2_room.json')
    

    # print(school_id, room_id, color, json_file_path)
    data = load_json_school(json_file_path, exclude_empty = False)

    for i,room in enumerate(data):
        if str(i) == room_id:
            data[i]["color"] = color

    save_json(data, json_file_path)

    return jsonify({"status": "success"})

@app.route('/update-room-name', methods=['POST'])
def update_room_name():
    data = request.get_json()
    school_id = data.get('school')
    room_id = data.get('id')
    new_name = data.get('new_name')

   
    parent_dir = os.path.dirname(base_path)
    json_file_path = os.path.join(parent_dir,'models',
                            'school_1_room.json' if school_id == 'seq' else 'school_2_room.json')
    data = load_json_school(json_file_path, exclude_empty = False)

    for i,room in enumerate(data):
        if str(i) == room_id:
            data[i]["text"] = new_name

    save_json(data, json_file_path)

    return jsonify({"status": "success"})

def save_json(data, json_file_path):
    with open(json_file_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=4)

def load_json_school(json_file_path, exclude_empty = True):
    with open(json_file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)

        if exclude_empty:
            data = [el for el in data if el["text"] != '' 
                and el["text"] != '---' and not el["text"].startswith('L-')]

    return data or []

@app.after_request
def add_header(response):
    response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate, public, max-age=0"
    response.headers["Pragma"] = "no-cache"
    response.headers["Expires"] = "0"
    return response

@app.route('/')
@app.route('/<path:path>')
def index(path=None):
    current_path = request.url  # Lấy đường dẫn URL hiện 
    print('path', current_path)

    if 'cis' in current_path:
        html = 'index_cis.html'
    else:
        html = 'index_sed.html'

    parent_dir = os.path.dirname(base_path)
    school_1_path = os.path.join(parent_dir, 'models', 'school_1_room.json')
    school_2_path = os.path.join(parent_dir, 'models', 'school_2_room.json')

    data_1 = load_json_school(school_1_path)
    data_2 = load_json_school(school_2_path)

    return render_template(html,
                           data_1=data_1, data_1_json=json.dumps(data_1),
                           data_2=data_2, data_2_json=json.dumps(data_2))

if __name__ == "__main__":
    app.run(debug=True, port=5006, host='0.0.0.0')
