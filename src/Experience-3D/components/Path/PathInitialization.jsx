import React, { useState, useMemo, useEffect } from "react";
import { findClosestNodeLabel } from "./PathFinder";


function PathInitialization({ onDataReady, allRoutes }) {
  const [routeIndex, setRouteIndex] = useState(0);
  const [shortestPath, setShortestPath] = useState(null);

  // Hàm làm tròn đồng bộ
  const roundPoint = (p, digits = 2) => {
    const factor = 10 ** digits;
    return [Math.round(p[0] * factor) / factor, Math.round(p[1] * factor) / factor];
  };

  // Lấy raw routes tương ứng routeIndex
  const rawRoutes = allRoutes.routes[routeIndex] || [];
  const stairs = allRoutes.stair;
  console.log('raw', stairs);
  const entry =  rawRoutes.entry;
  // Chuẩn hóa và round điểm của các routes
  const roundedPaths = useMemo(() => {
    return rawRoutes.map(path => path.map(p => roundPoint(p, 2)));
  }, [rawRoutes]);

  // Tập unique nodes dưới dạng chuỗi "x,y"
  const nodes = useMemo(() => {
    const set = new Set();
    roundedPaths.forEach(path => {
      path.forEach(p => set.add(p.join(",")));
    });
    return Array.from(set).sort();
  }, [roundedPaths]);

  // Hàm tạo nhãn A, B, C, ... AA, AB ...
  const generateLabel = (index) => {
    let label = "";
    let number = index;
    do {
      label = String.fromCharCode(65 + (number % 26)) + label;
      number = Math.floor(number / 26) - 1;
    } while (number >= 0);
    return label;
  };

  // Map node key "x,y" -> label "A", "B", ...
  const nodeToLabel = useMemo(() => {
    const map = {};
    nodes.forEach((node, i) => {
      map[node] = generateLabel(i);
    });
    return map;
  }, [nodes]);

  // Tính entryPoints dựa trên allRoutes.stair và allRoutes.entry
  const entryPoints = useMemo(() => {
    if (!nodes.length || !nodeToLabel) return [];

    const stairPoints = allRoutes.stair.map(pt => {
      const closest = findClosestNodeLabel(pt, nodes, nodeToLabel);
      return closest ? closest.closestNode : null;
    }).filter(Boolean);

    let entryPointsEntry = [];
    if (Array.isArray(allRoutes.entry)) {
      entryPointsEntry = allRoutes.entry.map(pt => {
        const closest = findClosestNodeLabel(pt, nodes, nodeToLabel);
        return closest ? closest.closestNode : null;
      }).filter(Boolean);
    } else if (allRoutes.entry) {
      const closest = findClosestNodeLabel(allRoutes.entry, nodes, nodeToLabel);
      if (closest) entryPointsEntry = [closest.closestNode];
    }

    return Array.from(new Set([...stairPoints, ...entryPointsEntry]));
  }, [nodes, nodeToLabel]);

  // Hàm xử lý chuyển route index
  const handleRouteIndex = (step) => {
    setRouteIndex(prev => {
      let next = prev + step;
      if (next < 0) next = allRoutes.routes.length - 1;
      else if (next >= allRoutes.routes.length) next = 0;
      return next;
    });
  };

  // Sử dụng useEffect để thông báo dữ liệu cập nhật mỗi khi có thay đổi quan trọng
  useEffect(() => {
    if (onDataReady) {
      onDataReady({
        routeIndex,
        setRouteIndex,
        shortestPath,
        setShortestPath,
        roundedPaths,
        stairs,
        entry,
        nodes,
        nodeToLabel,
        entryPoints,
        handleRouteIndex
      });
    }
  }, [routeIndex, shortestPath, roundedPaths, nodes, nodeToLabel, entryPoints, onDataReady]);

  return null; // Không render UI
}

export default PathInitialization;
