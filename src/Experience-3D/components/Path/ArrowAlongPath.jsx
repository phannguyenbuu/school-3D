import React, { useState, useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import Arrow from "./Arrow";

function distance(point1, point2) {
  const dx = point2[0] - point1[0];
  const dy = (point2[1] || 0) - (point1[1] || 0);
  const dz = (point2[2] || 0) - (point1[2] || 0);  // nếu không có z thì mặc định 0
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}


function totalLength(points) {
  let length = 0;
  for (let i = 0; i < points.length - 1; i++) 
  {
    length += distance(points[i], points[i + 1]);
  }
  return length;
}


export default function ArrowAlongPath({ points, speed = 0.2 }) {
  // console.log('Arrow_Length', points, totalLength(points));
  const count = totalLength(points) / 25;
  const cones = [];

  for (let i = 0; i < count; i++) {
    cones.push(
      <MemoSingleMovingCone
        key={i}
        points={points}
        speed={speed}
        initialT={i / count}
        scale={0.01}
      />
    );
  }
  return <>{cones}</>;
}


const MemoSingleMovingCone = React.memo(SingleMovingCone);

// Component single arrow có tRef bắt đầu từ initialT
export function SingleMovingCone({ points, speed, initialT = 0, scale = 0.01 }) {
  const ref = useRef();
  const tRef = useRef(initialT);

  // console.log(points.length);

  const curve = React.useMemo(() => {

    return new THREE.CatmullRomCurve3(points.map(p => p.length === 3 
        ? new THREE.Vector3(-p[0]/100, p[1] + 0.05, p[2]/100) 
        : new THREE.Vector3(-p[0]/100, 0.05, p[1]/100)));
  }, [points]);

  const vec3 = React.useMemo(() => new THREE.Vector3(), []);
  const tangentVec = React.useMemo(() => new THREE.Vector3(), []);

  useEffect(() => {
    tRef.current = initialT;
  }, [points, initialT]);

  useFrame(() => {
    if (!ref.current) return;
    tRef.current += speed;
    if (tRef.current > 1) tRef.current = 0;

    try {
      curve.getPoint(tRef.current, vec3);
      ref.current.position.copy(vec3);

      curve.getTangent(tRef.current, tangentVec).normalize();
      const angle = Math.atan2(tangentVec.x, tangentVec.z);
      ref.current.rotation.set(0, angle, 0);
    } catch (error) {
      console.error("Error in curve.getPoint or getTangent:", error);
      // Xử lý lỗi, ví dụ giữ nguyên vị trí hiện tại hoặc reset tRef
      tRef.current = 0;
    }
  });


  return (
    <Arrow
      ref={ref}
      args={[0.05, 0.2, 8]}
      rotation={[0, Math.PI / 2, 0]}
      scale={scale}
    >
      <meshStandardMaterial color="orange" emissive={"white"} emissiveIntensity={10} />
    </Arrow>
  );
}

