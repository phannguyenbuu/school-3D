import React, { useState, useEffect, useRef, useMemo  } from "react";
import { useVideoTexture, Text, Billboard, Environment   } from "@react-three/drei";
import RegionPointList, {polygonCentroid, distance} from "./RegionPointList.jsx";
import SampleStair from "../models/SampleStair.jsx";
import RegionCube from "./RegionCube.jsx";

import { computePathHelper, findNearestPointToPath, findNearestPoint } from "../Experience-3D/components/Path/PathFinderHelper.jsx";
import {ArrowAlongPath} from "../Experience-3D/components/Path/ArrowAlongPath.jsx";

export default function SchoolRoutesHelper({ 
  regions,  allRoutes, schoolIndex,
  sourceLocation, destLocation,
  onPinNoteClick, activePinNote, onCloseDialog,
  children }) {

  const [shortestPath, setShortestPath]  = useState(null);
  const [levels, setLevels] = useState(new Set([0, 1, 2, 3])); // True = hiện tất cả
  
  // const MemoArrowAlongPath = React.memo(ArrowAlongPath);
   

  // const pathFinderRef = useRef(null);
  const [sourceItem,setSourceItem] = useState(null);
  const [destItem,setDestItem] = useState(null);
  

 const handlePineNoteClick = (text, position) => {
  if(onPinNoteClick)
    onPinNoteClick(text, position);
 }

  const handlePinNoteDialogClose = () => {
    onCloseDialog();
  };


  

 useEffect(() => {
  let val = regions.find(item => item.text.startsWith(sourceLocation));
  if(val) 
    setSourceItem({level:val.level, point:val.points ? polygonCentroid(val.points) 
      : [(val.min_point[0] + val.max_point[0])/2,(val.min_point[1] + val.max_point[1])/2]});
  
  val = regions.find(item => item.text.startsWith(destLocation));
  if(val)
    setDestItem({level:val.level, point:val.points ? polygonCentroid(val.points) 
      : [(val.min_point[0] + val.max_point[0])/2,(val.min_point[1] + val.max_point[1])/2]});
}, [regions, destLocation, sourceLocation]);





const computedPath = useMemo(() => {
    if (!sourceItem || !destItem) return [];

    const p1 = [sourceItem.point[0], sourceItem.point[1]];
    const p2 = [destItem.point[0], destItem.point[1]];

    const result = computePathHelper(allRoutes, p1, p2);
    let ls = [];

    if (result && result.shortestPath) {
      if (sourceItem.level === destItem.level) {
        ls = result.shortestPath.map(p => [p[0], sourceItem.level * 0.4, p[1]]);
        // console.log('Result=', ls, sourceItem.level, destItem.level);
      } else {
        const nearestPoint = findNearestPoint(allRoutes.stair, p1);

        if (nearestPoint) {
          const res_s = computePathHelper(allRoutes, p1, nearestPoint);
          const res_d = computePathHelper(allRoutes, nearestPoint, p2);

          if (res_s && res_s.shortestPath) {
            ls = [...res_s.shortestPath.map(p => [p[0], sourceItem.level * 0.4, p[1]])];
          }
          if (res_d && res_d.shortestPath) {
            ls = [...ls, ...res_d.shortestPath.map(p => [p[0], destItem.level * 0.4, p[1]])];
          }
        }
      }
    }

    return ls;
  }, [sourceItem, destItem, schoolIndex, allRoutes]);

  useEffect(() => {
    setShortestPath(schoolIndex === 0 ? computedPath : computedPath.map(p => [-p[0], p[1],p[2]]));
  }, [computedPath, schoolIndex]);

















useEffect(() => {
  let ar = new Set([0, 1, 2, 3]);

  if(sourceItem && sourceItem.level != -1)
    ar = new Set([sourceItem.level]);

  if (destItem && destItem.level != -1)
    ar.add(destItem.level);

  setLevels(ar);
}, [sourceItem, destItem]);










 const newModels = regions.map((region, i) => levels.has(region.level) &&
   <group>
    
    <Environment preset="city"environmentIntensity={1} backgroundBlurriness={0.8} />
      
    {sourceItem && destItem && sourceItem.level != -1
     && destItem.level != -1 && shortestPath &&
    <ArrowAlongPath
      key="moving-cone"
      points={shortestPath}
      speed={0.2}
    />}

    {region.points && region.points.length > 2 ? 
    <RegionPointList
      id={`PinNotePoints_L${region.level}_${i}`}
      region={region}
      onPinNoteClick={handlePineNoteClick}
      onPinNoteDialogClose={handlePinNoteDialogClose}
      activePinNote={activePinNote}
      sourceLocation = {sourceLocation}
      destLocation = {destLocation}
    />:
    <RegionCube
      id={`PinNoteCube_L${region.level}_${i}`}
      region={region}
      onPinNoteClick={handlePineNoteClick}
      onPinNoteDialogClose={handlePinNoteDialogClose}
      activePinNote={activePinNote}
      sourceLocation={sourceLocation}
      destLocation = {destLocation}
    />}

    {children}
   </group>
  );

  const [stairs, setStairs] = useState([]);

  useEffect(() => {
    if(!levels) return;
    
    let res = [];

    let indexes = [0, 1, 2];

    if (levels.size === 2) {
      const levelArray = [...levels];
      indexes = [];
      for (let i = levelArray[0]; i < levelArray[1]; i++) {
        indexes.push(i);
      }
    } else if (levels.size === 1)
    {
      indexes = [];
    }

    
    indexes.forEach((level, idx) => {

      
      // flatMap cho từng phần tử p trong allRoutes.stair, tạo các phần tử React.Fragment
      const stairElements = allRoutes.stair.flatMap((p, i) => {
        const stairZ = p[1] / 100;
        return (
          <React.Fragment key={`sample-stair-fragment-${i}-${level}`}>
            <SampleStair
              position={[
                (schoolIndex === 0 ? p[0] : -p[0]) / 100,
                level * 0.4,
                stairZ,
              ]}
              scale={0.01}
              rotation={[0, ((allRoutes.stair_rotation?.[i] || 0) * Math.PI) / 180, 0]}
            />
          </React.Fragment>
        );
      });

      res = [...res, ...stairElements];
    });

    setStairs(res);
  }, [levels]);

 return [...newModels, ...stairs]; //, ...newPathsMemo
}
