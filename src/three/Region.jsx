import React, { useRef,  useState,useEffect  } from "react";
import { Canvas, useLoader } from '@react-three/fiber';
import { useVideoTexture, Text, Billboard, Environment   } from "@react-three/drei";
import { useGLTFWithKTX2 } from "../../../Experience-3D/utils/useGLTFWithKTX2";
import { convertMaterialsToBasic } from "../../../Experience-3D/utils/convertToBasic";
import regions from '../models/region.json';
import { TextureLoader } from 'three';
import { RoundedPlaneGeometry } from 'maath/geometry';
import { extend } from '@react-three/fiber';
import Dialog from "../../../Experience-3D/components/Dialog/Dialog"; 

extend({ RoundedPlaneGeometry })
const div = 100;

function getColorByHatchname(hatchname) {
  const map = {
    ANSI37: '#ff6867',
    ANGLE: "orange",
    ANSI35: "#79b9eb",
    SOLID: "#dddddd",
    'AR-B88': '#4975a2',
    ANSI31: '#dddddd',
    'AR-B816': '#ff9800',
    'AR-BRSTD': '#9fcaf6',
    'AR-CONC': '#298c86'
  };
  return map[hatchname.toUpperCase()] || "#dddddd";
}

function getBillboardHatchname(hatchname) {
  const map = {
    ANSI37: 'class.png',
    ANGLE: "learn.png",
    ANSI35: "room.png",
    SOLID: "custom-custom-water-machine.png",
    'AR-B88': 'room.png',
    ANSI31: 'custom-custom-photocopy.png',
    'AR-B816': 'room.png',
    'AR-BRSTD': 'study.png',
    'AR-CONC': 'toilet.png'
  };
  return map[hatchname.toUpperCase()] || undefined;
}

function RegionCube({ region }) {
  let { level, min_point, max_point, hatchname, text } = region;

  const width = (max_point[0] - min_point[0])/div;
  const depth = (max_point[1] - min_point[1])/div;
  const height = 0.03;

  let position = [
    min_point[0] / div + width / 2,
    level * .4,
    min_point[1] / div + depth / 2,
  ];

  const yardTexture = useLoader(TextureLoader, '/models/yard.png');

  const materialProps =
    text === 'YARD'
      ? { map: yardTexture }
      : { color: getColorByHatchname(hatchname) };

  if(text === 'YARD')
  {
    hatchname = '';
  }

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

      <PinNote position={position} hatchname={hatchname} txt={text || ''} />
    </group>
  );
}


export default function Model(props) {
  return (
    <group {...props} dispose={null}>
      
      <Environment preset="city" background={false} />

       {regions.map((region, i) => (
        <RegionCube key={i} region={region} />
      ))}
    </group>
  );
}

export function PinNote({ position, hatchname, txt }) {
  if(txt === '') return null;

  const url = getBillboardHatchname(hatchname);
  if (!url) return null;

  
  const textureUrl = url?.startsWith("http") ? url : `/images/${url || ""}`;
  const texture = useLoader(TextureLoader, textureUrl);

  const [hovered, setHovered] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  // Thay đổi cursor toàn cục khi hovered thay đổi
  useEffect(() => {
    if (hovered) {
      document.body.style.cursor = "pointer";
    } else {
      document.body.style.cursor = "auto";
    }
    // Cleanup khi component unmount hoặc hovered thay đổi
    return () => {
      document.body.style.cursor = "auto";
    };
  }, [hovered]);

  return (
    <Billboard
      position={[position[0], position[1] + 0.08, position[2]]}
      follow={true}
      lockX={false}
      lockY={false}
      lockZ={false}
    >
      {/* Nền trắng bo tròn */}
      <mesh position={[0, -0.001, 0]}>
        <roundedPlaneGeometry args={[0.1, 0.1, 0.02]} />
        <meshBasicMaterial color="white" />
      </mesh>

      {/* Mặt billboard chính */}
      <mesh
        userData={{ tag: txt }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          setHovered(false);
        }}
        onClick={(e) => {
          e.stopPropagation();
          console.log(txt);
          setDialogOpen(true);
        }}
      >
        <planeGeometry args={[0.1, 0.1]} />
        <meshBasicMaterial map={texture} transparent />
      </mesh>

      {dialogOpen && (
        <Dialog text={txt} onClose={() => setDialogOpen(false)} />
      )}
    </Billboard>



  );
}

