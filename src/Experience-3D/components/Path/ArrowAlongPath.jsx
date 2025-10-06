import React, { useState, useEffect, useRef, useMemo } from "react";
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

export function ArrowAlongPath({ points, speed = 0.2 }) {
  const sc = 0.04;
  const count = Math.floor(totalLength(points) * sc);
  const tRef = useRef(new Array(count).fill(0).map((_, i) => i * sc));
  const meshRef = useRef();

  const curve = React.useMemo(() => {
    return new THREE.CatmullRomCurve3(points.map(p => p.length === 3 
        ? new THREE.Vector3(-p[0]/100, p[1] + 0.05, p[2]/100) 
        : new THREE.Vector3(-p[0]/100, 0.05, p[1]/100)));
  }, [points]);

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    const v = speed * delta;
    
    const tempObject = new THREE.Object3D();

    for (let i = 0; i < count; i++) {
      if (isNaN(tRef.current[i]))
        tRef.current[i] = i * sc;

      tRef.current[i] += v;

      if (tRef.current[i] > 1) tRef.current[i] -= 1;

      const p = curve.getPoint(tRef.current[i]);
      const tangentVec = curve.getTangent(tRef.current[i]).normalize();

      // Vector "up" mặc định của đối tượng (ví dụ trục Y)
      const up = new THREE.Vector3(0, 1, 0);

      // Quaternion để quay từ up vector sang tangent vector
      const quaternion = new THREE.Quaternion().setFromUnitVectors(up, tangentVec);

      // Áp quaternion cho tempObject để đối tượng xoay theo tangent vector
      tempObject.position.copy(new THREE.Vector3(p.x,p.y,p.z));
      tempObject.quaternion.copy(quaternion);

      tempObject.scale.set(0.005, 0.01, 0.005);

      tempObject.updateMatrix();
      meshRef.current.setMatrixAt(i, tempObject.matrix);
    }

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[new THREE.ConeGeometry(6, 12, 8), null, count]}>
      <meshStandardMaterial color="red" />
    </instancedMesh>
  );
}
