import React, { Suspense, useRef, useEffect, useState } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { useVideoTexture, Text, Billboard, Environment   } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useToggleRoomStore } from "./stores/toggleRoomStore";
import ExtrudeSVGs from "./components/ExtrudeMesh";
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js';
import { ShapeUtils } from 'three';

const Scene = ({ pointerRef, models, paths, isRoomSwitched, ...props }) => {
  const [localRoomState, setLocalRoomState] = useState(false);
  
    useEffect(() => {
      // Mỗi khi isRoomSwitched thay đổi, cập nhật state local hoặc chạy tác vụ nào đó
      setLocalRoomState(isRoomSwitched);
      console.log('****Scene');
      // Hoặc chạy các side-effect khác bạn cần (ví dụ đổi texture, bật tắt room mode)
    }, [isRoomSwitched]);

  const darkGroupRef = useRef();
  const lightGroupRef = useRef();
  const gridPlanesRef = useRef();

  const darkRoomGroupPosition = new THREE.Vector3(0, 0, 0);
  const lightRoomGroupPosition = new THREE.Vector3(24.79, 0, 0.173);
  
  const groupRotationRef = useRef(0);
  const { isDarkRoom } = useToggleRoomStore();

  useEffect(() => {
    if (!gridPlanesRef.current) return;
    
    const targetPosition = isDarkRoom ? darkRoomGroupPosition : lightRoomGroupPosition;

    gsap.to(gridPlanesRef.current.position, {
      x: targetPosition.x,
      y: targetPosition.y,
      z: targetPosition.z,
      delay: 1,
    });
  }, [isDarkRoom]);

  useFrame(() => {
    if (!darkGroupRef.current || !lightGroupRef.current || !gridPlanesRef.current) return;

    const targetRotation = pointerRef.current.x * Math.PI * 0.032;

    groupRotationRef.current = THREE.MathUtils.lerp(
      groupRotationRef.current,
      targetRotation,
      0.1
    );

    darkGroupRef.current.rotation.y = groupRotationRef.current;
    lightGroupRef.current.rotation.y = groupRotationRef.current;
    gridPlanesRef.current.rotation.y = groupRotationRef.current;

    if (pivotRef.current) {
      pivotRef.current.rotation.y += 0.01;  // xoay pivot => xoay toàn bộ mesh con quanh gốc cúa pivot
    }
  });

  return (
    <>
      <Suspense fallback={null}>
        {props.children}
        
        {paths && Array.isArray(paths) ? 
          <ExtrudeSVGs pathSvg={paths} {...props} /> 
          : null
        }
      </Suspense>
    </>
  );
};

export default Scene;
