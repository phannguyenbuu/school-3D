import React, { useState, useMemo, useEffect } from "react";

// Tính khoảng cách Euclidean 2D
function distance(p1, p2) {
  return Math.hypot(p1[0] - p2[0], p1[1] - p2[1]);
}

export function pathLength(path) {
  let length = 0;
  for(let i = 0; i < path.length - 1; i++) {
    length += distance(path[i], path[i+1]);
  }
  return length;
}

// Hàm check các node không kết nối trong graph không trọng hướng
function checkDisconnectedNodes(graph) {
  // Lấy danh sách các node trong graph
  const nodes = Object.keys(graph);
  if (nodes.length === 0) return [];

  // Dùng BFS hoặc DFS để duyệt từ node đầu tiên
  const start = nodes[0];
  const visited = new Set();
  const stack = [start];

  while (stack.length > 0) {
    const node = stack.pop();
    if (!visited.has(node)) {
      visited.add(node);
      // Lấy các đỉnh kề (target) của node
      const neighbors = graph[node] ? graph[node].map(e => e.target) : [];
      neighbors.forEach(n => {
        if (!visited.has(n)) stack.push(n);
      });
    }
  }

  // Những node không thuộc visited là node không liên thông
  const disconnected = nodes.filter(n => !visited.has(n));
  return disconnected; // trả về mảng node không kết nối
}



// Xây dựng graph (danh sách kề) từ các paths
function buildGraph(paths) {
  const graph = {};

  function addEdge(a, b, w) {
    if (!graph[a]) graph[a] = [];
    graph[a].push({ target: b, weight: w });
  }

  for (const path of paths) {
    for (let i = 0; i < path.length - 1; i++) {
      const a = path[i];
      const b = path[i + 1];
      const keyA = a.join(",");
      const keyB = b.join(",");
      const w = distance(a, b);

      addEdge(keyA, keyB, w);
      addEdge(keyB, keyA, w);
    }
  }

  
  // Ví dụ gọi test trong component hoặc nơi bạn build graph
  const disconnectedNodes = checkDisconnectedNodes(graph);
  if (disconnectedNodes.length > 0) {
    console.warn("Các node không kết nối:", disconnectedNodes);
  } else {
    console.log("Mạng lưới liên thông, không có node bị tách rời.");
  }

  return graph;
}

// Thuật toán Dijkstra tìm đường ngắn nhất trong graph từ start tới end
function dijkstra(graph, start, end) {
  const distances = {};
  const previous = {};
  const visited = new Set();

  Object.keys(graph).forEach(node => {
    distances[node] = Infinity;
  });
  distances[start] = 0;

  while (true) {
    let closestNode = null;
    let closestDist = Infinity;
    for (const node in distances) {
      if (!visited.has(node) && distances[node] < closestDist) {
        closestDist = distances[node];
        closestNode = node;
      }
    }
    if (closestNode === null) break;
    if (closestNode === end) break;

    visited.add(closestNode);

    for (const edge of graph[closestNode] || []) {
      if (visited.has(edge.target)) continue;
      const newDist = distances[closestNode] + edge.weight;
      if (newDist < distances[edge.target]) {
        distances[edge.target] = newDist;
        previous[edge.target] = closestNode;
      }
    }
  }

  const path = [];
  let current = end;
  while (current) {
    path.unshift(current);
    current = previous[current];
  }

  if (path[0] !== start) return null;
  return path;
}

// Hàm tính centroid của mảng điểm [[x1,y1],[x2,y2],...]
export function getCentroid(points) {
  if (!points.length) return null;
  const sum = points.reduce((acc, p) => [acc[0] + p[0], acc[1] + p[1]], [0, 0]);
  return [sum[0] / points.length, sum[1] / points.length];
}

export function findClosestNodeLabel(pt, nodes, nodeToLabel) {
  let minDist = Infinity;
  let closestNode = null;

  nodes.forEach(nodeKey => {
    const [x, y] = nodeKey.split(",").map(Number);
    const dist = distance(pt, [x, y]);
    if (dist < minDist) {
      minDist = dist;
      closestNode = nodeKey;
    }
  });

  if (closestNode) {
    return {
      closestNode,
      label: nodeToLabel[closestNode] || null,
      distance: minDist,
    };
  }

  return null;
}

export function FindShortestPath(routes, startLabel, endLabel) {
  if (!routes || !startLabel || !endLabel) return null;

  // Step 1: build graph từ routes
  const graph = buildGraph(routes);

  // Step 2: lấy danh sách nodes (keys) đã sort
  const nodes = Object.keys(graph).sort();

  // Step 3: tạo label cho nodes (A,B,...,Z,AA,AB,...)
  const labels = [];
  for (let i = 0; i < nodes.length; i++) {
    let label = "";
    let n = i;
    do {
      label = String.fromCharCode(65 + (n % 26)) + label;
      n = Math.floor(n / 26) - 1;
    } while (n >= 0);
    labels.push(label);
  }

  // Step 4: tạo map label -> node, node -> label
  const labelToNode = {};
  const nodeToLabel = {};
  for (let i = 0; i < labels.length; i++) {
    labelToNode[labels[i]] = nodes[i];
    nodeToLabel[nodes[i]] = labels[i];
  }

  // Step 5: lấy node bắt đầu và kết thúc theo nhãn
  const startNode = labelToNode[startLabel];
  const endNode = labelToNode[endLabel];

  if (!startNode || !endNode) {
    console.warn("Start hoặc End label không hợp lệ");
    return null;
  }

  // Step 6: gọi dijkstra tìm đường đi ngắn nhất
  const shortestPath = dijkstra(graph, startNode, endNode);

  if (!shortestPath) {
    console.warn("Không tìm thấy đường đi từ", startLabel, "đến", endLabel);
    return null;
  }

  // Nếu muốn, có thể trả thêm thông tin label của đường đi
  const shortestPathLabels = shortestPath.map(node => nodeToLabel[node] || "?");
  
  const shortestPathScaled = shortestPath.map(p => {
    const [x,y] = p.split(',').map(Number);
    return [- x / 100, 0, y / 100] 
  });

  return { shortestPath, shortestPathScaled, shortestPathLabels, nodeToLabel, labelToNode, labels, graph };
}

export function PathFinder({routes, ...props}) {
  // Build graph, lấy node
  const graph = useMemo(() => buildGraph(routes), [routes]);
  const nodes = useMemo(() => Object.keys(graph).sort(), [graph]);

  // Sinh label, mapping
  const labels = useMemo(() => {
    const arr = [];
    for(let i=0; i < nodes.length; i++) {
      let label = "";
      let n = i;
      do {
        label = String.fromCharCode(65 + (n % 26)) + label;
        n = Math.floor(n/26) - 1;
      } while(n>=0);
      arr.push(label);
    }
    return arr;
  }, [nodes]);

  const labelToNode = useMemo(() => {
    const map = {};
    labels.forEach((label, i) => map[label] = nodes[i]);
    return map;
  }, [labels, nodes]);
  const nodeToLabel = useMemo(() => {
    const map = {};
    labels.forEach((label, i) => map[nodes[i]] = label);
    return map;
  }, [labels, nodes]);

  // State điểm đầu/cuối
  const [startLabel, setStartLabel] = useState("");
  const [endLabel, setEndLabel] = useState("");
  const [path, setPath] = useState(null);

  // Khởi tạo label mặc định khi labels đổi (như lần đầu hoặc đổi route)
  useEffect(() => {
    if(labels.length) {
      setStartLabel(labels[0]);
      setEndLabel(labels.length>1 ? labels[1] : labels[0]);
    }
  }, [labels]);

  function handleFindPathToStair() {
    const allPathPoints = [];
    // console.log('stair', props.stairs);
    props.stairs.forEach((pt,i) => {
      const closest = findClosestNodeLabel(pt, nodes, nodeToLabel);
      // const entryLabel = findClosestNodeLabel(allRoutes.entry, nodes, nodeToLabel);
      const pts = FindShortestPath(routes, closest.label, startLabel);
      if(pathLength(pts.shortestPathScaled) > 0)
        allPathPoints.push(pts);

    });

    let shortestIndex = -1;
    let shortestLength = Infinity;

    allPathPoints.forEach((itm, i) => {
      // tính tổng chiều dài 2 đoạn
      const len = pathLength(itm.shortestPathScaled);
      if (len < shortestLength) {
        shortestLength = len;
        shortestIndex = i;
      }
    });

    console.log(allPathPoints[shortestIndex].shortestPathLabels);
    setPath(allPathPoints[shortestIndex].shortestPath);
    if (props.onPathFound) props.onPathFound(allPathPoints[shortestIndex].shortestPath);
  }

  function handleFindPath() {
    if(!startLabel || !endLabel) {
      alert("Vui lòng chọn điểm đầu và điểm cuối!");
      return;
    }
    // Tìm đường đi ngắn nhất
    const result = FindShortestPath(routes, startLabel, endLabel);
    if (!result || !result.shortestPath) {
      alert("Không tìm thấy đường đi giữa hai điểm!");
      setPath(null);
      if (props.onPathFound) props.onPathFound(null);
    } else {
      setPath(result.shortestPath);
      console.log('pt',result.shortestPath);
      if (props.onPathFound) props.onPathFound(result.shortestPath);
    }
  }

  return props.useUI ? 
    <div style={{ padding: 20, fontFamily: "Arial, sans-serif" }}>
      <h2>Tìm đường đi ngắn nhất trên mạng lưới hành lang</h2>
      <div style={{ marginBottom: 12 }}>
        <label>
          Điểm bắt đầu:{" "}
          <select value={startLabel} onChange={e => setStartLabel(e.target.value)}>
            {labels.map(label => (
              <option key={label} value={label}>
                {label}: {labelToNode[label]}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div style={{ marginBottom: 12 }}>
        <label>
          Điểm kết thúc:{" "}
          <select value={endLabel} onChange={e => setEndLabel(e.target.value)}>
            {labels.map(label => (
              <option key={label} value={label}>
                {label}: {labelToNode[label]}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div style={{ display: "flex", flexDirection: "row", gap: 10 }}>
        <button onClick={handleFindPath} style={{ padding: "8px 16px", cursor: "pointer" }}>
          Tìm đường
        </button>
        <button onClick={handleFindPathToStair} style={{ padding: "8px 16px", cursor: "pointer" }}>
          Nearest Stair
        </button>
        <button onClick={props.onNextRoute} style={{ padding: "8px 16px", cursor: "pointer" }}>
          Next
        </button>
        <button onClick={props.onPrevRoute} style={{ padding: "8px 16px", cursor: "pointer" }}>
          Prev
        </button>
      </div>
      {path && (
        <div style={{ marginTop: 20 }}>
          <h3>Đường đi ngắn nhất:</h3>
          <ol>
            {path.map((nodeKey, i) => (
              <li key={i}>
                <strong>{nodeToLabel[nodeKey] || "?"}</strong>: ({nodeKey})
              </li>
            ))}
          </ol>
          <p><em>Tổng số đoạn: {path.length - 1}</em></p>
        </div>
      )}
    </div>:null;
  
}

export default PathFinder;