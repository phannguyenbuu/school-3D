import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLoader, useFrame } from '@react-three/fiber';
import { Environment } from "@react-three/drei";
import { useGLTFWithKTX2 } from "../../Experience-3D/utils/useGLTFWithKTX2";
import { TextureLoader, MeshStandardMaterial, Color } from "three";
import * as THREE from "three";

export default function Model({ isRoomSwitched, ...props }) {
  const gltf = useGLTFWithKTX2("/models/Cauthangsat_AQuyen_Rectangle001.glb");
  const scale = 0.1;

  const materials = useMemo(() => ({
    green: new MeshStandardMaterial({ color: new Color("green") }),
    grey: new MeshStandardMaterial({ color: new Color("grey") }),
    lightGrey: new MeshStandardMaterial({ color: new Color("#AFAFAF") }),
  }), []);

  // Duyệt qua gltf.scene và gán vật liệu theo điều kiện tên mesh
  useMemo(() => {
    gltf.scene.traverse((child) => {
      if (child.isMesh) {
        const name = child.name || "";

        if (name.startsWith("Text")) {
          child.material = materials.green;
        }
      }
    });
  }, [gltf.scene, materials]);

  return (
    <group position={[0, 0, 0]} scale={[scale, scale, scale]} {...props} >
      <Environment preset="city" background environmentIntensity={0.1} backgroundBlurriness={0.8} />
      <ambientLight intensity={8} />
      <directionalLight position={[-100, 100, -100]} intensity={2} />
      <primitive object={gltf.scene} />
    </group>
  );
}
