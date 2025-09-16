import json

# Mở file JSON ở chế độ đọc
with open(r'src\models\school_2_route.json', 'r') as file:
    # Đọc dữ liệu từ file và chuyển thành đối tượng Python (list hoặc dict)
    json_data = json.load(file)

# sorted_data = sorted(json_data, key=lambda x: (x['text']))
output_file = r'src\models\school_2_route.json'

for pls in json_data['routes']:
    for ls in pls:
        for p in ls:
            p[0] = - p[0]
            # p[1] -= 100
            # p[0] -= 3600

for p in json_data['stair']:
    p[0] = - p[0]

# for p in json_data['stair']:
#         # p[0] += 40
#         p[1] += 100
#         # p[0] = 0 - p[0]
#     # item['points'] = [p1[0] + 1000,p1[1]]
    # item['max_point'] = [p2[0] + 1000,p2[1]]

with open(output_file, 'w') as file:
    json.dump(json_data, file, indent=4)

