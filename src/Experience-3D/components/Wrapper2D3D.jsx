import React, { useState, useRef } from "react";
import SVGImport from "../../components/konva/SVGImport";  // component load SVG, parse paths
import ZoomPanStage from "../../components/konva/ZoomPanStage";  // component load SVG, parse paths
import { Path, Text, Group, Transformer } from "react-konva";
import Experience from "../../Experience-3D/Experience";
import cameraPositions from "../../pages/three/cameras/Camera_Amazon.json";
import { useGlobal } from "../../components/konva/GlobalProvider";
import SpinnerClock from "../../components/SpinnerClock.jsx";

export default function Wrapper2D3D({paths, ...props}) {
    

    const [depth, setDepth] = useState(8);
    const [spaceX, setSpaceX] = useState(4);
    const [spaceY, setSpaceY] = useState(10);
    const [showLed, setShowLed] = useState(false);
    const [angle, setangle] = useState(0);
    const [material, setMaterial] = useState("red");
    
    //   const [paths, setPaths] = useState([]);         // Mảng paths lấy từ SVGImport
    const [selected, setSelected] = React.useState(false);
    const pathRefs = useRef([]);                     // nếu cần để tương tác với paths còn giữ
    const groupRef = useRef();
    const trRef = useRef();

    const handleMaterialChange = (e) => {
        console.log(e.target.value);
        setMaterial(e.target.value);
    };


    // Hàm cập nhật input
    function updateInput(name, value) {
        if (name === "ShowLed") {
            setShowLed(value);
        }
        else if(name === "Depth") {
            setDepth(value);
            setShowLed(false);
        }else if(name === "SpaceX") {
            setSpaceX(value);
            setShowLed(true);
        }else if(name === "SpaceY") {
            setSpaceY(value);
            setShowLed(true);
        }else if(name === "Angle") {
            setangle(value);
            setShowLed(true);
        }  
    }

    React.useEffect(() => {
        if (selected && trRef.current && groupRef.current) {
            trRef.current.nodes([groupRef.current]);
            trRef.current.getLayer().batchDraw();
        } else if (trRef.current) {
            trRef.current.nodes([]);
            trRef.current.getLayer().batchDraw();
        }
    }, [selected]);
        
    const [isRoomSwitched, setIsRoomSwitched] = useState(false);
  
  
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        
        <ZoomPanStage width={window.innerWidth - 100} height={window.innerHeight/3 - 50}>
            <Group
                x={50}
                y={50}
                ref={groupRef}
                draggable
                onClick={() => setSelected(true)}
                onTap={() => setSelected(true)}
                >
                {paths.map((d, i) => (
                    <Path
                    key={i}
                    data={d}
                    stroke="black"
                    strokeWidth={2}
                    fill="transparent"
                    ref={(el) => (pathRefs.current[i] = el)}
                    onClick={e => {
                        e.cancelBubble = true;
                        setSelected(true);
                    }}
                />
            ))}
        </Group>

        <Transformer ref={trRef} />
        </ZoomPanStage>
            

        <div style={{display:'flex'}}>
            <div style={{
                padding: 20,
                marginTop:200,
                display:'grid',
                gap:5,
                gridTemplateColumns:'repeat(2,1fr)',
                minWidth:'20vw', 
                height:window.innerHeight * 2/3 - 300, borderRadius:10,
                backgroundColor:'#fff'}}>
                
                <label>Setting</label>
                <label>
                    Depth (cm)
                    <input id="depth"
                        type="number"
                        value={depth}
                        min={1}
                        onChange={(e) => updateInput("Depth", parseFloat(e.target.value))}
                        style={{marginLeft:5, textAlign:'center', width:'50%', borderRadius:5}}
                    />
                </label>

                <label>
                    Space X
                    <input
                        type="number"
                        value={spaceX}
                        min={1}
                        onChange={(e) => updateInput("SpaceX", parseFloat(e.target.value))}
                        style={{marginLeft:5, textAlign:'center', width:'50%', borderRadius:5}}
                    />
                </label>

                <label>
                    Space Y
                    <input
                        type="number"
                        value={spaceY}
                        min={1}
                        onChange={(e) => updateInput("SpaceY", parseFloat(e.target.value))}
                        style={{marginLeft:5, textAlign:'center', width:'50%', borderRadius:5}}
                    />
                </label>

                <label>
                    Led Panels
                    <input
                        type="checkbox"
                        value=""
                        
                        onChange={(e) => updateInput("ShowLed", e.target.checked)}
                        style={{marginLeft:5, textAlign:'center', width:'50%', borderRadius:5}}
                    />
                </label>

                <label>
                    Led Angle
                    <SpinnerClock size={100} onChange={(a) => updateInput("Angle", a)}/>
                </label>

                

                <label>
                    Bevel
                    <input
                        type="number"
                        value={0}
                        onChange={(e) => updateInput("bevel", e.target.value)}
                        style={{marginLeft:5, textAlign:'center', width:'50%', borderRadius:5}}
                    />
                </label>

                <label>
                    Material
                    <select value={material} onChange={handleMaterialChange}>
                        <option value="red">Mica</option>
                        <option value="inox">Inox</option>
                        <option value="grey">Alumium</option>
                        <option value="wood">Wood</option>
                        <option value="white">Glass</option>
                    </select>
                </label>

                <button style={{padding:0, fontSize: 12}}>
                    Load SVG
                </button>

                
                <button style={{padding:0, fontSize: 12}}>
                    Save SVG
                </button>

                <button style={{padding:0, fontSize: 12}}>
                    Save DEA
                </button>

                <button style={{padding:0, fontSize: 12}}>
                    Export PDF
                </button>
            </div>

            <Experience
                cameraPositions={cameraPositions}
                isRoomSwitched={isRoomSwitched}
                width={window.innerWidth * 0.755}
                height={window.innerHeight * 2/3 - 50}
                top={window.innerHeight / 2 - 100}
                position="relative"
                paths={paths}    
                depth={depth}
                showLed={showLed}
                angle={angle}
                material={material}
                spaceX={spaceX}
                spaceY = {spaceY}
                {...props}
                >
                {props.children}
            </Experience>
            
        </div>
      
    </div>
  );
}


