import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame, useLoader } from '@react-three/fiber';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader';

import CubesFill from './CubesFill';

export default function ExtrudeSVGs({ pathSvg, depth, ...props }) {
  
    const pivotRef = useRef();

    function isPointInPolygon(point, polygon) {
      let x = point.x, y = point.y;
      let inside = false;
      for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        const xi = polygon[i].x, yi = polygon[i].y;
        const xj = polygon[j].x, yj = polygon[j].y;
    
        const intersect = ((yi > y) !== (yj > y)) &&
                          (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
      }
      return inside;
    }
    
    
    function shapeContainsShape(smallShape, largeShape) {
      if (!smallShape || !largeShape) return false;
      if (typeof smallShape.getPoints !== "function") return false;
    
      const samplePoints = smallShape.getPoints(10); // Lấy điểm trên path nhỏ
      for (let pt of samplePoints) {
        const polygon = largeShape.getPoints(); // Lấy toàn bộ điểm biên của shape lớn
        if (!isPointInPolygon(pt, polygon)) {
          return false; // Nếu có 1 điểm nhỏ nằm ngoài shape lớn => false
        }
      }
      return true; // Tất cả điểm nhỏ nằm trong shape lớn
    }
    
    function parseDSvgPaths(paths) {
      const loader = new SVGLoader();
      const shapes = [];
    
      paths.forEach((dStr) => {
        
        // SVGLoader.parse expects full SVG markup, nhưng bạn có thể tạo "fake" svg string
        const svgString = `<svg xmlns="http://www.w3.org/2000/svg"><path d="${dStr}" /></svg>`;
        
        const data = loader.parse(svgString);
    
        // data.paths là mảng Path, mỗi Path có method toShapes()
        data.paths.forEach(path => {
          const s = path.toShapes(true); // true để tạo shapes với holes nếu có
          shapes.push(...s);
        });
      });
      
      return shapes; // mảng THREE.Shape
    }
    
    function groupPathsAsShapesWithHoles(allShapes) {
      const shapesWithHoles = [];
          
      const isHole = new Array(allShapes.length).fill(false);
    
      for (let i = 0; i < allShapes.length; i++) {
        const outerShape = allShapes[i];
        if (!outerShape) continue;
        if (isHole[i]) continue;
    
        const holes = [];
    
        for (let j = 0; j < allShapes.length; j++) {
          if (i === j || isHole[j]) continue;
    
          const innerShape = allShapes[j];
          if (!innerShape) continue;
    
          if (shapeContainsShape(innerShape, outerShape)) {
            holes.push(innerShape);
            isHole[j] = true;
          }
        }
    
        holes.forEach(h => outerShape.holes.push(h));
        shapesWithHoles.push(outerShape);
      }
    
      return shapesWithHoles;
    }
    
    const resultPaths = groupPathsAsShapesWithHoles(parseDSvgPaths(pathSvg));
  // console.log(depth, props.rotation);
    return (
        <group ref={pivotRef} rotation={[Math.PI, 0, 0]}>
            {resultPaths && resultPaths.map((d, i) => (
            <ExtrudeMesh
                key={i}
                shape={d}
                depth={props.showLed ? 1 : depth}
                scale={[1, 1, 1]}

                material={props.material}
            />
            ))}


            {resultPaths && props.showLed ? (
                <CubesFill shapes={resultPaths} {...props} cubeSize={1} cubeDepth={6} />
                ) : null
            }
        </group>
    );

}


function ExtrudeMesh({ shape, depth = 1, material }) {
  const geometry = useMemo(() => {
    if (shape.length === 0) return null;

    const extrudeSettings = {
      depth: depth,
      bevelEnabled: false,
    };

    const geom = new THREE.ExtrudeGeometry(shape, extrudeSettings);

    return geom;
  }, [shape, depth]);

  if (!geometry) return null;

  return (
    <MyMeshMaterial geometry={geometry} material={material}/>
  );
}

function MyMeshMaterial({ geometry, material }) {
  // Load textures không điều kiện từ folder public (đường dẫn ví dụ)
  const woodTexture = useLoader(THREE.TextureLoader, "/images/wood.jpg");
  const inoxTexture = useLoader(THREE.TextureLoader, "/images/inox.jpg");
  const glassTexture = useLoader(THREE.TextureLoader, "/images/glass.jpg");

  // Chọn texture tương ứng theo 'material'
  let selectedTexture = null;
  let selectedColor = "white"; // màu mặc định nếu không có texture

  if (material === "wood") {
    selectedTexture = woodTexture;
  } else if (material === "inox") {
    selectedTexture = inoxTexture;
  } else if (material === "glass") {
    selectedTexture = glassTexture;
  } else {
    selectedColor = material; // nếu là màu chuỗi
  }

  // Tạo vật liệu dùng useMemo, chỉ tạo lại khi texture thay đổi
  const meshMaterial = useMemo(() => {
    const mat = new THREE.MeshStandardMaterial({
      map: selectedTexture,
      color: selectedTexture ? undefined : selectedColor,
      roughness: 0.2,
      metalness: 0.9,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 1,
    });
    mat.needsUpdate = true;
    return mat;
  }, [selectedTexture, selectedColor]);

  return <mesh geometry={geometry} material={meshMaterial} />;
}
