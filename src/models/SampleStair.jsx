import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLoader, useFrame } from '@react-three/fiber';
import { Environment } from "@react-three/drei";
import { useGLTFWithKTX2 } from "../Experience-3D/utils/useGLTFWithKTX2";
import { TextureLoader, MeshStandardMaterial, Color } from "three";
import * as THREE from "three";

export default function Model({ isRoomSwitched, ...props }) {
  const { nodes } = useGLTFWithKTX2("/models/sample_stair.glb");

  const milkWhiteMaterial = useMemo(() => new MeshStandardMaterial({
    color: 'orange',
    roughness: 1,
    metalness: 0.2,
  }), []);

  return (
    <group {...props} dispose={null}>
      <color attach="background" args={['#808080']} />
      
      <mesh
        geometry={nodes.UTypeStair001.geometry}
        material={milkWhiteMaterial}
        rotation={[0, 0, 0]}
        scale={[props.scale, props.scale, props.scale]}
        position={nodes.UTypeStair001.position}
      />

    </group>
  );
}
