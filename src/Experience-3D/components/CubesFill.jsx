import React, { Suspense, useRef, useEffect, useState } from "react";
import * as THREE from 'three';
import { useMemo } from 'react';

function isPointInPolygon(point, polygon) {
      let x = point.x, y = point.y;
      let inside = false;
      for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        const xi = polygon[i].x, yi = polygon[i].y;
        const xj = polygon[j].x, yj = polygon[j].y;
    
        const intersect = ((yi > y) !== (yj > y)) &&
                          (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
      }
      return inside;
    }

function getShapeBoundingBox(shape) {
  // Lấy các điểm biên xung quanh shape (mặc định hoặc tăng points nếu bạn muốn chính xác hơn)
  const points = shape.getPoints(50); // lấy 50 điểm ví dụ

  const box2 = new THREE.Box2();

  points.forEach(p => {
    box2.expandByPoint(p);
  });

  return box2; // Box2 có min và max vector2
}

function fillShapeWithCubes(shape, spaceX, spaceY, cubeSize = 1, cubeDepth = 1) {
  // Lấy bounding box shape
  const bbox = getShapeBoundingBox(shape);
  if (!bbox) return [];

  const cubes = [];

  // Tạo lưới điểm rải đều trong bbox
  for (let x = bbox.min.x; x <= bbox.max.x; x += spaceX) {
    for (let y = bbox.min.y; y <= bbox.max.y; y += spaceY) {
      const point = new THREE.Vector2(x, y);
      // Kiểm tra point có nằm trong shape không
      const polygon = shape.getPoints();
      if (isPointInPolygon(point, polygon)) {
        // Thêm cube ở vị trí (x, y, z)
        cubes.push({ position: [x, y, cubeDepth / 2 - 4] }); // đặt cube trên mặt XY, z là nửa chiều cao cube
      }
    }
  }

  return cubes;
}

export default function CubesFill({ shapes, spaceX = 10, spaceY = 10, angle=0, cubeSize = 1, cubeDepth = 6 }) {
  console.log('rotation', angle);
  
  const allCubes = useMemo(() => {
    let arr = [];
    shapes.forEach((shape, i) => {
      const shapeCubes = fillShapeWithCubes(shape, spaceX, spaceY, cubeSize, cubeDepth);
      shapeCubes.forEach(cube => {
        arr.push(
          <mesh key={`${i}-${cube.position[0]}-${cube.position[1]}`}
            position={cube.position}
            rotation={[0, 0, angle * Math.PI/180]}
            scale={[cubeSize, cubeDepth, cubeSize ]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="white" emissive={1} />
          </mesh>
        );
      });
    });

    GB.setInput1(`${arr.length} leds`);

    return arr;
  }, [shapes, spaceX, spaceY, cubeSize, cubeDepth]);

  return <group>{allCubes}</group>;
}