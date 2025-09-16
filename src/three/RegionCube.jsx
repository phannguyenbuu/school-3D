import React, { useRef,  useState,useEffect  } from "react";
import { Canvas, useLoader } from '@react-three/fiber';
import { useVideoTexture, Text, Billboard, Environment   } from "@react-three/drei";
import { useGLTFWithKTX2 } from "../Experience-3D/utils/useGLTFWithKTX2";
import { convertMaterialsToBasic } from "../Experience-3D/utils/convertToBasic";
// import regions from './models/region.json';
import { TextureLoader } from 'three';
import { RoundedPlaneGeometry } from 'maath/geometry';
import { extend } from '@react-three/fiber';
import Dialog from "../Experience-3D/components/Dialog/Dialog"; 
import PinNote from "./PinNote";

extend({ RoundedPlaneGeometry })
const div = 100;

export function getColorByHatchname(hatchname) {
  const map = {
    ANSI37: '#ff6867',
    ANGLE: "orange",
    ANSI35: "#79b9eb",
    SOLID: "#dddddd",
    'AR-B88': '#4975a2',
    ANSI31: '#ffffff',
    'AR-B816': '#ff9800',
    'AR-BRSTD': '#9fcaf6',
    'AR-CONC': '#298c86'
  };
  return map[hatchname.toUpperCase()] || "#dddddd";
}

export function getBillboardHatchname(hatchname) {
  const map = {
    ANSI37: 'class.png',
    ANGLE: "learn.png",
    ANSI35: "room.png",
    SOLID: "custom-custom-water-machine.png",
    'AR-B88': 'room.png',
    ANSI31: 'custom-custom-photocopy.png',
    'AR-B816': 'room.png',
    'AR-BRSTD': 'study.png',
    'AR-CONC': 'toilet.png',
    'STAIR':'escalator.png',
  };
  return map[hatchname.toUpperCase()] || undefined;
}

export default function RegionCube({ id, region, onPinNoteClick, 
  activePinNote, onPinNoteDialogClose, 
  sourceLocation, destLocation }) {
  let { level, min_point, max_point, hatchname, text, color } = region;

  const width = (max_point[0] - min_point[0])/div;
  const depth = (max_point[1] - min_point[1])/div;
  const height = 0.03;

  let position = [
    min_point[0] / div + width / 2,
    level * .4,
    min_point[1] / div + depth / 2,
  ];

  // const yardTexture = useLoader(TextureLoader, '/models/yard.png');
  // const gymTexture = useLoader(TextureLoader, '/models/yard.png');
  const materialProps = text.includes('YARD') ? 
  
  { map: useLoader(TextureLoader, '/models/yard.png') } 
  
  : (text.includes('GYM') ? {map: useLoader(TextureLoader, '/textures/gym.png')}
    : { color: color });

  // if(text === 'YARD' || text.includes('GYM'))
  // {
  //   hatchname = '';
  // }
// console.log('Dialog CUBE',onPinNoteDialogClose);
  return (
    <group>
      <mesh castShadow position={position}>
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial
          {...materialProps}
          transparent
          opacity={0.95}
        />
      </mesh>

      {!text.includes('YARD') && 
      <PinNote id={id} position={position} hatchname={hatchname} txt={text || ''} 
        onClick={(text, position) => onPinNoteClick(text, position)} 
        description = {region.description}
        onPinNoteDialogClose={onPinNoteDialogClose}
        isActive={activePinNote === text}
        isPinLocation = { text.startsWith(sourceLocation)}
        isDestLocation = { text.startsWith(destLocation)}
      />}
    </group>
  );
}
