// Utils cho PathFinderHelper

export const roundPoint = (p, digits = 2) => {
  const factor = 10 ** digits;
  return [Math.round(p[0] * factor) / factor, Math.round(p[1] * factor) / factor];
};

export const generateLabel = (index) => {
  let label = "";
  let n = index;
  do {
    label = String.fromCharCode(65 + (n % 26)) + label;
    n = Math.floor(n / 26) - 1;
  } while (n >= 0);
  return label;
};

export const findClosestNodeLabel = (pt, nodes, nodeToLabel) => {
  let minDist = Infinity;
  let closestNode = null;

  nodes.forEach((nodeKey) => {
    const [x, y] = nodeKey.split(",").map(Number);
    const dist = Math.hypot(pt[0] - x, pt[1] - y);
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
};

export const buildGraph = (routes) => {
  const graph = {};
  routes.forEach((path) => {
    for (let i = 0; i < path.length - 1; i++) {
      const from = path[i].join(",");
      const to = path[i + 1].join(",");
      const weight = Math.hypot(path[i][0] - path[i + 1][0], path[i][1] - path[i + 1][1]);
      if (!graph[from]) graph[from] = {};
      if (!graph[to]) graph[to] = {};
      graph[from][to] = weight;
      graph[to][from] = weight;
    }
  });
  return graph;
};

export const dijkstra = (graph, startNode, endNode) => {
  const distances = {};
  const prev = {};
  const pq = new Set(Object.keys(graph));

  Object.keys(graph).forEach((node) => {
    distances[node] = Infinity;
    prev[node] = null;
  });

  distances[startNode] = 0;

  while (pq.size) {
    let currentNode = null;
    let minDist = Infinity;
    for (const node of pq) {
      if (distances[node] < minDist) {
        minDist = distances[node];
        currentNode = node;
      }
    }
    if (currentNode === endNode || currentNode === null) break;
    pq.delete(currentNode);

    for (const neighbor in graph[currentNode]) {
      if (!pq.has(neighbor)) continue;
      const alt = distances[currentNode] + graph[currentNode][neighbor];
      if (alt < distances[neighbor]) {
        distances[neighbor] = alt;
        prev[neighbor] = currentNode;
      }
    }
  }

  const path = [];
  let u = endNode;
  while (u) {
    path.unshift(u);
    u = prev[u];
  }
  return path.length > 1 ? path : null;
};

export const findShortestPath = (routes, startLabel, endLabel) => {
  // console.log('findShortestPath', routes, startLabel, endLabel);
  if (!routes || !startLabel || !endLabel) return null;

  const graph = buildGraph(routes);
  const nodes = Object.keys(graph).sort();

  const labels = nodes.map((_, i) => generateLabel(i));
  const labelToNode = Object.fromEntries(labels.map((label, idx) => [label, nodes[idx]]));
  // const nodeToLabel = Object.fromEntries(nodes.map((node, idx) => [node, labels[idx]]));

  const startNode = labelToNode[startLabel];
  const endNode = labelToNode[endLabel];
  // console.log('findShortestPath_1', routes, startNode, endNode);
  if (!startNode || !endNode) return null;

  const shortestPath = dijkstra(graph, startNode, endNode);
  // console.log('findShortestPath_2', shortestPath);
  // if (!shortestPath) return null;

  // const shortestPathLabels = shortestPath.map((node) => nodeToLabel[node] || "?");
  // const shortestPathScaled = shortestPath.map((p) => {
  //   const [x, y] = p.split(",").map(Number);
  //   return [-x / 100, z, y / 100];
  // });

  return shortestPath ? shortestPath.map(s => 
    [-parseFloat(s.split(',')[0]), parseFloat(s.split(',')[1]) ]) : null;
};
