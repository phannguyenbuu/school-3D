import {  roundPoint,  generateLabel,  findClosestNodeLabel,  findShortestPath, } from "./utils/pathUtils";



export function findNearestPoint(points, target) {
  let minDistance = Infinity;
  let nearestPoint = null;

  for (const p of points) {
    const dx = p[0] - target[0];
    const dy = p[1] - target[1];
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < minDistance) {
      minDistance = dist;
      nearestPoint = p;
    }
  }

  return nearestPoint;
}


function distancePointToSegment(px, py, ax, ay, bx, by) {
  const ABx = bx - ax;
  const ABy = by - ay;
  const APx = px - ax;
  const APy = py - ay;
  const ab2 = ABx * ABx + ABy * ABy;
  const ap_ab = APx * ABx + APy * ABy;
  let t = ap_ab / ab2;

  // Nếu điểm chiếu không nằm trên đoạn AB (t ngoài [0,1])
  if (t < 0 || t > 1) {
    // Tính trung điểm đoạn thẳng AB
    const midX = (ax + bx) / 2;
    const midY = (ay + by) / 2;
    const dx = px - midX;
    const dy = py - midY;
    return Math.sqrt(dx * dx + dy * dy);
  }

  // Nếu điểm chiếu nằm trên đoạn AB thì tính khoảng cách vuông góc bình thường
  t = Math.max(0, Math.min(1, t));
  const closestX = ax + ABx * t;
  const closestY = ay + ABy * t;
  const dx = px - closestX;
  const dy = py - closestY;
  return Math.sqrt(dx * dx + dy * dy);
}


// Hàm tìm điểm gần nhất trong pointList tới path
// pointList: [{x, y}, ...]
// path: [{x, y}, ...] (đường nối các điểm theo thứ tự)
export function findNearestPointToPath(pointList, path) {
  let minDistance = Infinity;
  let nearestPoint = null;

  for (const p of pointList) {
    for (let i = 0; i < path.length - 1; i++) {
      const dist = distancePointToSegment(
        p[0], p[1],
        path[i][0], path[i][1],
        path[i + 1][0], path[i + 1][1]
      );

      console.log("Stair", i, dist);

      if (dist < minDistance) {
        minDistance = dist;
        nearestPoint = p;
      }
    }
  }
  return nearestPoint;
}




// Hàm chính thay cho PathFinderHelper
export function computePathHelper(allRoutes, startPoint, endPoint) {
  if (!allRoutes) return null;

  const routeIndex = 0; // Giữ mặc định hoặc bạn có thể truyền tham số
  const rawRoutes = allRoutes.routes[routeIndex] || [];

  const roundedPaths = rawRoutes.map((path) => path.map(roundPoint));
  const nodesArr = Array.from(new Set(roundedPaths.flat().map((p) => p.join(",")))).sort();
  const nodeToLabelMap = Object.fromEntries(nodesArr.map((node, i) => [node, generateLabel(i)]));

  const stairPoints = Array.isArray(allRoutes.stair)
    ? allRoutes.stair
        .map((pt) => findClosestNodeLabel(pt, nodesArr, nodeToLabelMap))
        .filter(Boolean)
        .map(({ closestNode }) => closestNode)
    : [];

  const entryPts = Array.isArray(allRoutes.entry)
    ? allRoutes.entry
        .map((pt) => findClosestNodeLabel(pt, nodesArr, nodeToLabelMap))
        .filter(Boolean)
        .map(({ closestNode }) => closestNode)
    : allRoutes.entry && typeof allRoutes.entry === 'object'
    ? (() => {
        const closest = findClosestNodeLabel(allRoutes.entry, nodesArr, nodeToLabelMap);
        return closest ? [closest.closestNode] : [];
      })()
    : [];

  const allEntryPoints = Array.from(new Set([...stairPoints, ...entryPts]));

  // Tìm node gần nhất với điểm start và end
  const startClosest = findClosestNodeLabel(startPoint, nodesArr, nodeToLabelMap);
  const endClosest = findClosestNodeLabel(endPoint, nodesArr, nodeToLabelMap);

      console.log('allEntryPoints_1', startPoint,startClosest );
      console.log('allEntryPoints_2', endPoint,endClosest );


  if (!startClosest || !endClosest) {
    console.warn("Không tìm được node gần nhất");
    return null;
  }

  // Tính đường đi ngắn nhất
  const shortestPath = findShortestPath(rawRoutes, startClosest.label, endClosest.label);

  // Trả về kết quả gồm các dữ liệu cần thiết
  return {
    nodes: nodesArr,
    roundedPaths,
    nodeToLabel: nodeToLabelMap,
    entryPoints: allEntryPoints,
    shortestPath: shortestPath,
  };
}