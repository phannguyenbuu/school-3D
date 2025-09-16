import React, { useRef,  useState,useEffect  } from "react";
import { Canvas, useLoader } from '@react-three/fiber';
import { useVideoTexture, Text, Billboard, Environment   } from "@react-three/drei";
import { TextureLoader } from 'three';
import * as THREE from 'three';
import PinNote, {specialTexts} from "./PinNote";

const squareShape = new THREE.Shape();
squareShape.moveTo(0, 0);
squareShape.lineTo(0.01, 0);
squareShape.lineTo(0.010, 0.010);
squareShape.lineTo(0, 0.010);
squareShape.lineTo(0, 0);

export function distance(point1, point2) {
  const dx = point2[0] - point1[0];
  const dy = point2[1] - point1[1];
  return Math.sqrt(dx * dx + dy * dy);
}

export function polygonCentroid(points) {
  let signedArea = 0;
  let cx = 0;
  let cy = 0;

  const count = points.length;
  for (let i = 0; i < count; i++) {
    const x0 = points[i][0];
    const y0 = points[i][1];
    const x1 = points[(i + 1) % count][0];
    const y1 = points[(i + 1) % count][1];

    const a = x0 * y1 - x1 * y0;
    signedArea += a;
    cx += (x0 + x1) * a;
    cy += (y0 + y1) * a;
  }

  signedArea *= 0.5;
  cx /= (6 * signedArea);
  cy /= (6 * signedArea);

  return [cx, cy];
}

export default function RegionPointList({ id, region,
   closed = true, zOffset = 0,
   sourceLocation, destLocation,
   
   onPinNoteClick, activePinNote, onPinNoteDialogClose }) {

  const { points, hatchname, text, color, level, description } = region;
  const yardTexture = useLoader(TextureLoader, '/models/yard.png');
  const height = 0.03;

  if (!points || points.length < 3) {
    // Không đủ điểm để tạo shape, return null
    return null;
  }

  // const materialProps =  text === 'YARD' ? { map: yardTexture } : { color: color };
  const materialProps =
    text === 'YARD'
      ? { map: yardTexture }
      : { color: color};

  // Nếu là yard thì clear hatchname
  const usedHatchname = text === 'YARD' ? '' : hatchname;

  const sc = 0.01;
  let geometry;
  let cubes = [];
  // Tạo shape từ points
  if(closed)
  {
    const shape = new THREE.Shape();
    points.forEach((pt, idx) => {
      const [x, y] = pt;
      if (idx === 0) shape.moveTo(x * sc,  y * sc);
      else shape.lineTo(x * sc,  y * sc);
    });

    shape.lineTo(points[0][0] * sc,  points[0][1] * sc); // đóng polygon
    geometry = new THREE.ExtrudeGeometry(shape, { depth: height, bevelEnabled: false });
    
  } else {
    // Giả sử points là mảng các điểm 2D dưới dạng [x, y]
    const path = new THREE.CatmullRomCurve3(
      points.map(p => new THREE.Vector3(-p[0] * sc, p[1] * sc,)) // chuyển sang Vector3 với y=0 (nếu z là chiều cao)
    );

    geometry = new THREE.ExtrudeGeometry(squareShape, {
      steps: 10,
      extrudePath: path,
      bevelEnabled: false
    });
    

    // color = 0xff0000;

    cubes = points.map(p => {
      // Tạo hình hộp
      const geometry = new THREE.BoxGeometry(0.02, 0.02, 0.02);
      
      // Vật liệu màu xanh lá
      const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
      
      // Tạo mesh
      const cube = new THREE.Mesh(geometry, material);
      
      // Đặt vị trí cube theo p và scale sc
      cube.position.set(p[0] * sc, level * 0.4 + zOffset, p[1] * sc);
      return cube;
    });
  }

  const material = new THREE.MeshStandardMaterial({
      transparent: true,
      opacity: 0.95,
      ...materialProps,
    });
  // Tính centroid cho position mesh và note
  const centroid = polygonCentroid(points);

  // console.log(centroid, usedHatchname, text);
  // console.log('Dialog PLS',onPinNoteDialogClose);

  return (
    <group>
      {cubes.map((cube, index) => (
        <primitive object={cube} key={index} />
      ))}
      { !specialTexts.includes(text) && geometry &&
      <mesh
        castShadow
        receiveShadow
        geometry={geometry}
        material={material}
        rotation={[Math.PI/2,Math.PI,0]}
        position={[0, level * 0.4 + zOffset, 0]} // đặt z=0 làm mặt phẳng
      />}
      <PinNote id={id} 
        onClick={(text, position) => onPinNoteClick(text, position)} 
        onPinNoteDialogClose={onPinNoteDialogClose}
        position={[-centroid[0] * sc, region.level * 0.4,  centroid[1] * sc]} 
        hatchname={usedHatchname} txt={text || ''} 
        description = {description}
        isActive={activePinNote === text}
        isPinLocation = { text.startsWith(sourceLocation)}
        isDestLocation = { text.startsWith(destLocation)}
      />
    </group>
  );
}

