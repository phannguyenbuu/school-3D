import React from "react";
import * as THREE from 'three';
import gsap from "gsap";

const imgStyle = { width: 20, height: 20, padding: 0, cursor:'pointer' };

function handleCameraUp(controlsRef) {
  if (!controlsRef.current) return;
  const target = controlsRef.current.target.clone();
  const camera = controlsRef.current.object;

  const newCameraPosY = camera.position.y + 1;
  const newTargetY = target.y + 1;

  gsap.to(camera.position, {
    y: newCameraPosY,
    duration: 0.8,
    ease: "power3.out",
    onUpdate: () => camera.updateMatrixWorld(),
  });

  gsap.to(target, {
    y: newTargetY,
    duration: 0.8,
    ease: "power3.out",
    onUpdate: () => {
      controlsRef.current.target.copy(target);
      controlsRef.current.update();
    },
  });
}

function handleCameraDown(controlsRef) {
  if (!controlsRef.current) return;
  const target = controlsRef.current.target.clone();
  const camera = controlsRef.current.object;

  const newCameraPosY = camera.position.y - 1;
  const newTargetY = target.y - 1;

  gsap.to(camera.position, {
    y: newCameraPosY,
    duration: 0.8,
    ease: "power3.out",
    onUpdate: () => camera.updateMatrixWorld(),
  });

  gsap.to(target, {
    y: newTargetY,
    duration: 0.8,
    ease: "power3.out",
    onUpdate: () => {
      controlsRef.current.target.copy(target);
      controlsRef.current.update();
    },
  });
}

function handleRotateRight(controlsRef) {
  if (!controlsRef.current) return;
  const angle = 0.1; // radian
  const camera = controlsRef.current.object;
  const target = controlsRef.current.target.clone();

  const dir = new THREE.Vector3().subVectors(camera.position, target);
  const matrix = new THREE.Matrix4().makeRotationY(-angle);
  dir.applyMatrix4(matrix);
  const newCameraPos = target.clone().add(dir);

  gsap.to(camera.position, {
    x: newCameraPos.x,
    y: newCameraPos.y,
    z: newCameraPos.z,
    duration: 0.8,
    ease: "power3.out",
    onUpdate: () => camera.updateMatrixWorld(),
  });

  gsap.to(target, {
    x: target.x,
    y: target.y,
    z: target.z,
    duration: 0.8,
    ease: "power3.out",
    onUpdate: () => controlsRef.current.update(),
  });
}

function handleRotateLeft(controlsRef) {
  if (!controlsRef.current) return;
  const angle = 0.1; // radian
  const camera = controlsRef.current.object;
  const target = controlsRef.current.target.clone();

  const dir = new THREE.Vector3().subVectors(camera.position, target);
  const matrix = new THREE.Matrix4().makeRotationY(angle);
  dir.applyMatrix4(matrix);
  const newCameraPos = target.clone().add(dir);

  gsap.to(camera.position, {
    x: newCameraPos.x,
    y: newCameraPos.y,
    z: newCameraPos.z,
    duration: 0.8,
    ease: "power3.out",
    onUpdate: () => camera.updateMatrixWorld(),
  });

  gsap.to(target, {
    x: target.x,
    y: target.y,
    z: target.z,
    duration: 0.8,
    ease: "power3.out",
    onUpdate: () => controlsRef.current.update(),
  });
}

function handleZoomIn(controlsRef) {
  if (!controlsRef.current) return;
  const camera = controlsRef.current.object;

  if (camera.isPerspectiveCamera) {
    // Lerp vị trí camera tới target (zoom in)
    const newPos = camera.position.clone().lerp(controlsRef.current.target, 0.1);
    gsap.to(camera.position, {
      x: newPos.x,
      y: newPos.y,
      z: newPos.z,
      duration: 0.8,
      ease: "power3.out",
      onUpdate: () => camera.updateMatrixWorld(),
    });
  } else if (camera.isOrthographicCamera) {
    const newZoom = Math.min(camera.zoom + 0.1, 5);
    gsap.to(camera, {
      zoom: newZoom,
      duration: 0.8,
      ease: "power3.out",
      onUpdate: () => camera.updateProjectionMatrix(),
    });
  }

  gsap.to({}, {
    duration: 0.8,
    onUpdate: () => controlsRef.current.update(),
  });
}

function handleZoomOut(controlsRef) {
  if (!controlsRef.current) return;
  const camera = controlsRef.current.object;

  if (camera.isPerspectiveCamera) {
    // Lerp vị trí camera ra xa target (zoom out)
    const direction = camera.position.clone().sub(controlsRef.current.target).normalize();
    const newPos = camera.position.clone().add(direction.multiplyScalar(1)); // tăng khoảng cách

    gsap.to(camera.position, {
      x: newPos.x,
      y: newPos.y,
      z: newPos.z,
      duration: 0.8,
      ease: "power3.out",
      onUpdate: () => camera.updateMatrixWorld(),
    });
  } else if (camera.isOrthographicCamera) {
    const newZoom = Math.max(camera.zoom - 0.1, 0.1);
    gsap.to(camera, {
      zoom: newZoom,
      duration: 0.8,
      ease: "power3.out",
      onUpdate: () => camera.updateProjectionMatrix(),
    });
  }

  gsap.to({}, {
    duration: 0.8,
    onUpdate: () => controlsRef.current.update(),
  });
}

export default function View3DControl({controlsRef, onCameraDefaultPosition, 
  onCameraUp, onCameraDown, onRotateRight, onRotateLeft, onZoomIn, onZoomOut }) 

  {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <button style={{width:60,height:60, padding: 0}} id="cameraUp" className="cameraUp" onClick={() => handleCameraUp(controlsRef)}>
        <img src='https://www.svgrepo.com/show/510303/up-chevron.svg' style={imgStyle} alt="Camera Up" />
      </button>
      <button style={{width:60,height:60, padding: 0}} onClick={() => handleCameraDown(controlsRef)}>
        <img src='https://www.svgrepo.com/show/509899/down-chevron.svg' style={imgStyle} alt="Camera Down" />
      </button>
      <button style={{width:60,height:60, padding: 0}} onClick={() => handleRotateLeft(controlsRef)}>
        <img src='https://www.svgrepo.com/show/533711/rotate-cw.svg' style={imgStyle} alt="Rotation Right" />
      </button>
      <button style={{width:60,height:60, padding: 0}} onClick={() => handleRotateRight(controlsRef)}>
        <img src='https://www.svgrepo.com/show/533710/rotate-ccw.svg' style={imgStyle} alt="Rotation Left" />
      </button>
      <button style={{width:60,height:60, padding: 0}} onClick={() => handleZoomIn(controlsRef)}>
        <img src='https://www.svgrepo.com/show/522719/zoom-plus.svg' style={imgStyle} alt="Zoom In" />
      </button>
      <button style={{width:60,height:60, padding: 0}} onClick={() => handleZoomOut(controlsRef)}>
        <img src='https://www.svgrepo.com/show/522717/zoom-minus.svg' style={imgStyle} alt="Zoom Out" />
      </button>
      <button style={{width:60,height:60, padding: 0}} onClick={() => onCameraDefaultPosition()}>
        <img src="https://www.svgrepo.com/show/526560/home.svg" style={imgStyle} alt="Home" />
      </button>
    </div>
  );
}
