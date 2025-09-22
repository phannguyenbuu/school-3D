import json

def save_json(data, json_file_path):
    with open(json_file_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=4)

def load_json_school(json_file_path):
    with open(json_file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
        data = [el for el in data if el["text"] != '' 
                and el["text"] != '---' and not el["text"].startswith('L-')]

    return data or []

json_file_path=r"src\models\school_2_room.json"
json_data =load_json_school(json_file_path)
# Sắp xếp theo trường 'level'
sorted_data = sorted(json_data, key=lambda x: x['level'])

save_json(sorted_data, json_file_path)
