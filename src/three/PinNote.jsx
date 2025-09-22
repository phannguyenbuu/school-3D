import React, { useRef,  useState,useEffect  } from "react";
import { Canvas, useLoader } from '@react-three/fiber';
import { Text, Billboard   } from "@react-three/drei";
import { TextureLoader } from 'three';
import Dialog from "../Experience-3D/components/Dialog/Dialog"; 
import * as THREE from 'three';

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
    "CURRENT": 'checkPoint.png',
  };
  return map[hatchname.toUpperCase()] || undefined;
}

export const specialTexts = ['L-1', 'L-2', 'L-3', 'L-4'];
export const PinNoteContext = React.createContext();

export default function PinNote({ id, position, hatchname, txt,
  isPinLocation, isDestLocation,
  description, onClick, isActive, onPinNoteDialogClose 
}) {

  const meshRef = React.useRef();
  if (txt === '') return null;
  const url = getBillboardHatchname(hatchname);

  if (!url) return null;

  const textureUrl = isPinLocation ? '/images/checkPoint.png'
  : isDestLocation ? "/images/goPoint.png"
  : specialTexts.includes(txt) ? `/images/${txt}.png`
  : url?.startsWith("http") ? url : `/images/${url || ""}`;

  const texture = useLoader(TextureLoader, textureUrl);

  const [hovered, setHovered] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  useEffect(() => {
    if (hovered) {
      document.body.style.cursor = "pointer";
    } else {
      document.body.style.cursor = "auto";
    }
    return () => {
      document.body.style.cursor = "auto";
    };
  }, [hovered]);

  const is_pin_note = isPinLocation || isDestLocation;

  return (
    <Billboard
      position={[position[0], position[1] + (is_pin_note ? 0.2: 0.16), position[2]]}
      follow={true}
      lockX={false}
      lockY={false}
      lockZ={false}
    >
      {!is_pin_note &&
      <mesh ref={meshRef} position={[0, -0.001, 0]}>
        <roundedPlaneGeometry args={is_pin_note ?  [0.2, 0.3, 0.02] : [0.15, 0.15, 0.02]} />
        <meshBasicMaterial color="white" />
      </mesh>}

      <mesh  
        userData={{ tag: txt }}
        onPointerOver={(e) => {
          e.stopPropagation();
          // setDialogOpen(true);
          setHovered(true);
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          setHovered(false);
        }}
        onClick={(e) => {
          e.stopPropagation();
          setDialogOpen(true);

          if (onClick) {
            onClick(txt, position);
          }
        }}
      >
        <planeGeometry args={is_pin_note ?  [0.2, 0.3]  : [0.15, 0.15]} />
        <meshBasicMaterial map={texture} transparent={true} />
      </mesh>

        {dialogOpen && 
          <Dialog text={txt} description={description} onClose={() => 
            {
              setDialogOpen(false);
              if(onPinNoteDialogClose)
                onPinNoteDialogClose();
            }} />
           
        }

      {/* <Text
        position={[0, 0.1, 0]} // điều chỉnh vị trí text cho phù hợp
        fontSize={0.03}
        color="black"
        anchorX="center"
        anchorY="middle"
      >
        {txt} {/* Nội dung text cần hiển thị */}
      {/* </Text> */} 
    </Billboard>
  );
}
