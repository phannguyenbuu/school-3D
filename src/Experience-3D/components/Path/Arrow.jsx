import React, { useEffect, forwardRef , useMemo, useRef, useState } from "react";
import { useLoader, useFrame } from '@react-three/fiber';
import { Environment } from "@react-three/drei";
import { useGLTFWithKTX2 } from "../../utils/useGLTFWithKTX2";
import { TextureLoader, MeshStandardMaterial, Color } from "three";
import * as THREE from "three";

const Model = forwardRef(function Model({ isRoomSwitched, ...props }, ref) {
  const { nodes } = useGLTFWithKTX2("/models/arrow.glb");

  const milkWhiteMaterial = useMemo(() => new MeshStandardMaterial({
    color: 'red',
    roughness: 0.2,
    metalness: 0.1,
  }), []);

  return (
    <group ref={ref} {...props} dispose={null}>
      <mesh
        geometry={nodes.Box001.geometry}
        material={milkWhiteMaterial}
        rotation={[0, 0, 0]}
        scale={[props.scale, props.scale, props.scale]}
        position={nodes.Box001.position}
      />
    </group>
  );
});

export default Model;
