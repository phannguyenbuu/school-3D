import React, { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import Scene from "./Scene";
import { Canvas, useThree, useFrame  } from "@react-three/fiber";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter";
import { OrthographicCamera, OrbitControls  } from "@react-three/drei";
import { useResponsiveStore } from "./stores/useResponsiveStore";
import { useExperienceStore } from "./stores/experienceStore";
import { SceneStatsCollector, SceneStatistics } from  "./components/SceneStatistics";
import View3DControl from "./components/View3DControl";
import ThinButton from "./components/Buttons/ThinButton";
import * as THREE from 'three';

function CameraInfo({ controlsRef, setCameraInfo }) {
  const { camera } = useThree();

  useFrame(() => {
    if (!controlsRef.current) return;
    setCameraInfo({
      position: camera.position.toArray().map(v => v.toFixed(2)),
      target: controlsRef.current.target.toArray().map(v => v.toFixed(2)),
      near: 0.0001,      // mặt phẳng gần (giảm nếu cảm thấy vật thể mất hình lúc zoom in)
      far: 3000,      // mặt phẳng xa (tăng nếu vật thể mất hình lúc zoom out)
      fov: 75         // góc nhìn mặc định
    });
  });

  return null;
}

function CameraSetup({ cameraRef }) {
  const { camera } = useThree();
  useEffect(() => {
    cameraRef.current = camera;
  }, [camera]);
  return null;
}

const Experience = ({ regions, paths, cameraPositions, isRoomSwitched, ...props }) => {
  const [localRoomState, setLocalRoomState] = useState(false);
  
  const [stats, setStats] = useState({
    totalObjects: 0,
    meshCount: 0,
    lightCount: 0,
    cameraCount: 0,
    groupCount: 0,
  });

  useEffect(() => {
    // Mỗi khi isRoomSwitched thay đổi, cập nhật state local hoặc chạy tác vụ nào đó
    setLocalRoomState(isRoomSwitched);
    // console.log('****');


    // Hoặc chạy các side-effect khác bạn cần (ví dụ đổi texture, bật tắt room mode)
  }, [isRoomSwitched]);
  
  const [cameraInfo, setCameraInfo] = useState({position: [0, 0, 0],
      target: [0, 0, 0],
    
    near: 0.0001,      // mặt phẳng gần (giảm nếu cảm thấy vật thể mất hình lúc zoom in)
      far: 3000,      // mặt phẳng xa (tăng nếu vật thể mất hình lúc zoom out)
      fov: 75         // góc nhìn mặc định
      });

  const isMB = () => {
    return window.innerWidth < 768;
  }

  const cameraRef = useRef();
  
  const pointerRef = useRef({ x: 0, y: 0 });
  const controlsRef = useRef();
  const { isExperienceReady } = useExperienceStore();
  const [cameraIndex, setCameraIndex] = useState(0);

  const { isMobile } = useResponsiveStore();

  const zoomValues = {
    default: isMobile ? 74 : 135,
    animation: isMobile ? 65 : 110,
  };

  useEffect(() => {
    if (!cameraRef.current) return;

    cameraRef.current.zoom = zoomValues.default;
    cameraRef.current.updateProjectionMatrix();
  }, [isMobile]);

  useEffect(() => {
    // console.log('isDisableInterractive', props.isDisableInterractive);
  }, [props.isDisableInterractive]);
  

  const animateCameraToIndex = (index) => {
    if (!cameraRef.current || !controlsRef.current) return;

    const pos = cameraPositions[cameraIndex].position;
    const target = cameraPositions[cameraIndex].target;

    // console.log('Animating to pos:', pos, 'target:', target);

    if (!pos || !target) return; // tránh lỗi undefined

    gsap.to(cameraRef.current.position, {
      x: pos[0],
      y: pos[1],
      z: pos[2],
      duration: 1.5,
      ease: "power3.out",
      onUpdate: () => {
        cameraRef.current.updateMatrixWorld();
      },
    });

    gsap.to(controlsRef.current.target, {
      x: target[0],
      y: target[1],
      z: target[2],
      duration: 1.5,
      ease: "power3.out",
      onUpdate: () => {
        controlsRef.current.update();
      },
    });
    
  }
  
  
  useEffect(() => {
    animateCameraToIndex(cameraIndex);
  }, [cameraIndex]);

  useEffect(() => {
    if (!cameraRef.current || !controlsRef.current) return;

    const initialPos = cameraPositions[0].position;
    const initialTarget = cameraPositions[0].target;

    gsap.set(cameraRef.current.position, {
      x: initialPos[0],
      y: initialPos[1],
      z: initialPos[2],
    });

    controlsRef.current.target.set(...initialTarget);
    controlsRef.current.update();

    setCameraIndex(0);
  }, [cameraRef.current, controlsRef.current]);

  useEffect(() => {
    const onTouchMove = (e) => {
      if (e.touches.length === 1) {
        pointerRef.current.x =
          (e.touches[0].clientX / window.innerWidth) * 2 - 10;
        pointerRef.current.y =
          -(e.touches[0].clientY / window.innerHeight) * 2 + 10;
      }
    };

    

    // window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("touchmove", onTouchMove);

    return () => {
      // window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("touchmove", onTouchMove);
    };
  });

  const buttonStyle = {
    margin: "20px 10px",
    fontSize: 10,
    border: "1px solid #000",
    borderLeft: "none",
    borderRight: "none",
    background: "none",
    borderRadius: "5px",
    padding: "6px 20px",
    cursor: "pointer",
  };

  return (
    <>
 
      <Canvas
        style={{
          position: props.position,
          width: props.width,
          height: props.height,
          zIndex: 1,
          top: 0,
          left: 0,
          background: '#efefef',
          borderRadius: 10,
        }}
        
        shadows
      >
        
        <OrbitControls ref={controlsRef}
          enableZoom={true}
          enableRotate={true}
          enablePan={true}
          enableDamping={true}
          dampingFactor={0.1}
          maxPolarAngle={Math.PI / 2} // Giới hạn góc nhìn xuống dưới
          minPolarAngle={-Math.PI / 2}          // Giới hạn góc nhìn lên trên
          mouseButtons={{
            LEFT: THREE.MOUSE.ROTATE,
            MIDDLE: THREE.MOUSE.DOLLY,
            RIGHT: THREE.MOUSE.PAN,
          }}
        />

        <CameraSetup cameraRef={cameraRef} />
        <CameraInfo controlsRef={controlsRef} setCameraInfo={setCameraInfo} />
        

        <Scene
          camera={cameraRef}
          pointerRef={pointerRef}
          isExperienceReady={isExperienceReady}
          paths={paths}
          isRoomSwitched  = {localRoomState}
          
          {...props}/>
      </Canvas>

      {/* <SceneStatistics stats={stats} /> */}
      
      <div style={{ position: 'fixed', top: props.controlTop + (isMB() ? 50 : 0),  scale: isMB() ? 0.6 : 1,
           left: props.controlLeft + (isMB() ? 20 : 0), color: 'black', zIndex:99 }}>
        
          <div style={{width:60}}>
            <View3DControl controlsRef={controlsRef} onCameraDefaultPosition={() => animateCameraToIndex(0)}/>
          </div>
      </div>

      {/* Disable khi bật dialog */}
      {props.isDisableInterractive && (
        <div
          style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 1000,
            // cursor: 'not-allowed',
            pointerEvents: 'auto',
          }}
        />
      )}
     
  
  </>
);
}

export default Experience;
