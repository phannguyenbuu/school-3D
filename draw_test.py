import json
import matplotlib.pyplot as plt
from matplotlib.patches import Polygon, Rectangle

# Đọc dữ liệu từ file example.json
with open(r'src/models/school_2_room.json', 'r') as f:
    data = json.load(f)

with open(r'src/models/school_2_route.json', 'r') as f:
    routes = json.load(f)

fig, ax = plt.subplots()

# Dữ liệu points của bạn:
points = [
    [
                508.57,
                266.83
            ],
            [
                508.57,
                266.83
            ],
            [
                531.26,
                289.69
            ],
            [
                493.97,
                326.68
            ],
            [
                568.9,
                403.29
            ],
            [
                568.9,
                403.29
            ],
            [
                560.1,
                408.69
            ],
            [
                551.08,
                413.76
            ],
            [
                541.91,
                418.49
            ],
            [
                532.55,
                422.86
            ],
            [
                523.03,
                426.89
            ],
            [
                513.37,
                430.54
            ],
            [
                503.57,
                433.84
            ],
            [
                493.67,
                436.77
            ],
            [
                483.66,
                439.32
            ],
            [
                473.55,
                441.5
            ],
            [
                463.39,
                443.28
            ],
            [
                453.15,
                444.70
            ],
            [
                442.87,
                445.72
            ],
            [
                432.55,
                446.35
            ],
            [
                422.23,
                446.6
            ],
            [
                422.23,
                314.97
            ],
            [
                422.23,
                314.97
            ],
            [
                429,
                314.28
            ],
            [
                435.72,
                313.2
            ],
            [
                442.36,
                311.73
            ],
            [
                448.91,
                309.88
            ],
            [
                455.33,
                307.65
            ],
            [
                461.62,
                305.05
            ],
            [
                467.75,
                302.09
            ],
            [
                473.69,
                298.78
            ],
            [
                479.43,
                295.12
            ],
            [
                484.95,
                291.14
            ],
            [
                490.23,
                286.85
            ],
            [
                495.24,
                282.25
            ],
            [
                499.99,
                277.37
            ],
            [
                504.44,
                272.23
            ],
            [
                508.57,
                266.83
            ]
]

polygon = Polygon(points, closed=True, facecolor='none', edgecolor='black', alpha=0.6)
ax.add_patch(polygon)

for i, (x, y) in enumerate(points):
    ax.text(x + i * 0.5, y, str(i), fontsize=10, color='red')


# for item in data:
#     color = item.get('color', '#cccccc')
#     text = item.get('text', '')
    
#     if 'points' in item:
#         points = item['points']
#         polygon = Polygon(points, closed=True, facecolor=color, edgecolor='black', alpha=0.6)
#         ax.add_patch(polygon)
#         # Vẽ chữ giữa đa giác
#         xs, ys = zip(*points)
#         centroid_x = sum(xs) / len(xs)
#         centroid_y = sum(ys) / len(ys)
#         ax.text(centroid_x, centroid_y, text, ha='center', va='center', fontsize=1)
    
#     elif 'min_point' in item and 'max_point' in item:
#         min_x, min_y = item['min_point']
#         max_x, max_y = item['max_point']

#         print(min_x,min_y,max_x,max_y)

#         width = abs(max_x - min_x)
#         height = abs(max_y - min_y)
#         # Đảm bảo width và height không bằng 0 để vẽ hình chữ nhật rõ ràng
#         if width == 0:
#             width = 1
#         if height == 0:
#             height = 1
#         rect = Rectangle((min_x, min_y), width, height, facecolor=color, edgecolor='black', alpha=0.6)
#         ax.add_patch(rect)
#         # Vẽ chữ ở giữa hình chữ nhật
#         centroid_x = min_x + width / 2
#         centroid_y = min_y + height / 2
#         ax.text(centroid_x, centroid_y, text, ha='center', va='center', fontsize=1)








# ax.plot(routes["entry"][0], routes["entry"][1], 'ro', label='Entry')

# # Vẽ polyline stair
# stair = routes["stair"]
# stair_x, stair_y = zip(*stair)
# ax.plot(stair_x, stair_y, 'g--', label='Stair')

# # Vẽ từng route (dạng polyline nối các điểm)
# for route_group in routes["routes"]:
#     for route in route_group:
#         x, y = zip(*route)
#         ax.plot(x, y, marker='o', linestyle='-', linewidth=2, color='red')










# Tính min max tạo vùng trục tự động từ dữ liệu
# all_x = []
# all_y = []
# for item in data:
#     if 'points' in item:
#         xs, ys = zip(*item['points'])
#         all_x.extend(xs)
#         all_y.extend(ys)
#     elif 'min_point' in item and 'max_point' in item:
#         all_x.append(item['min_point'][0])
#         all_x.append(item['max_point'][0])
#         all_y.append(item['min_point'][1])
#         all_y.append(item['max_point'][1])

# margin = 10  # khoảng cách để trống xung quanh
# ax.set_xlim(min(all_x) - margin, max(all_x) + margin)
# ax.set_ylim(min(all_y) - margin, max(all_y) + margin)


# Thiết lập tỉ lệ đều, lưới và tiêu đề
# ax.set_aspect('equal')
# ax.grid(True)
ax.set_title('Visualization from example.json')

ax.autoscale_view()
plt.show()
