import React, { useState, useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";
import "./Experience-3D/index.scss";
import App from "./Experience-3D/App.jsx";
import { BrowserRouter } from "react-router-dom";
import { useNavigate } from 'react-router-dom';

import cameraPositions from "./cameras/Camera_School.json";
import school_1_data from './models/school_1_room.json';
import school_2_data from './models/school_2_room.json';

import SchoolRoutesHelper from "./three/SchoolRoutesHelper.jsx";
import DropdownWithLabel from "./three/DropdownWithLabel.jsx";
import SearchInput from './three/SearchInput.jsx';
import school_1_routes from './models/school_1_route.json';
import school_2_routes from './models/school_2_route.json';

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box, Stack,
  Typography,
  Grid
} from '@mui/material';

function changeFavicon(src) {
  let link = document.querySelector("link[rel*='icon']");
  if (!link) {
    link = document.createElement("link");
    link.rel = "icon";
    document.head.appendChild(link);
  }
  link.href = src;
}

function RootApp() {
  

  const [curZ, setCurZ] = useState(-1);
  const isSEDSchool = window.location.href.includes('sed');
  const default_school_routes = isSEDSchool ? school_1_routes: school_2_routes;
  const default_school_data = isSEDSchool ? school_1_data: school_2_data;
  const [regions, setRegions] = useState(default_school_data);
  const [allRoutes, setAllRoutes] = useState(default_school_routes);
  const [IsActiveDialog, setIsActiveDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const suggestValue = window.location.href.split("&")[0].split("-").pop().toUpperCase();
  const [sourceSuggestion, setSourceSuggestion] = useState(suggestValue);
  const [destinationSuggestion, setDestinationSuggestion] = useState('');
  const [schoolIndex, setSchoolIndex] = useState( isSEDSchool ? 0 : 1);
  const [clr, setClr] = useState('');





  document.title = isSEDSchool ? 'SED':'CIS';
  changeFavicon(isSEDSchool ? "/images/LogoSedberghVietnam.png" : "/images/LogoCIS.png");

  const navigate = useNavigate();

  const isMB = () => {
    return window.innerWidth < 768;
  }

  const handleRoomSwitchChange = (newState) => {
    console.log("Room switch state changed:", newState);
    
    if (schoolIndex === 0) {
      setRegions(school_2_data);
      setAllRoutes(school_2_routes);
      navigate('/cis');
      setSchoolIndex(1);
    } else {
      setRegions(school_1_data);
      setAllRoutes(school_1_routes);
      navigate('/sed');
      setSchoolIndex(0);
    }
  };

  const handleChangeDestination = (value) => {
    setDestinationSuggestion(value);

    if(value != '---')
    {

    }
  }

  useEffect(() => {
    const match = regions.find(item => item.text.includes(searchTerm));
    if (match) {
      setDestinationSuggestion(match.text);
    } else {
      setDestinationSuggestion('no-match');
    }
  }, [searchTerm, regions]);


  useEffect(() => {
    setClr(schoolIndex === 0 ? '#ab9572':'#7c1819');
  }, [schoolIndex]);

  return (
    <>
      <App onRoomSwitchChange={handleRoomSwitchChange}
        title="School 3D"
        cameraPositions={cameraPositions}
        controlLeft={window.innerWidth - 100}
        height={window.innerHeight}
        scale={1}
        controlTop ={200}
        handleHome = {() => setCurZ(-1)}
        isDisableInterractive = {IsActiveDialog}
      >
        <SchoolRoutesHelper
          regions={regions}
          allRoutes={allRoutes}
          schoolIndex = {schoolIndex}
          
          onPinNoteClick={(text, position) => {
            // console.log(text, position, '<Disable>');
            setCurZ(position[1]);
            setIsActiveDialog(true);
          }}

          sourceLocation = {sourceSuggestion}
          destLocation = {destinationSuggestion}
          
          onCloseDialog = {() => setIsActiveDialog(false)}
        />
    </App>

    <Stack direction={isMB() ? "column":"row"} spacing={isMB() ? 1 : 5} 
      sx={{ position: "fixed",padding: '10px 20px',
        overflowY: 'auto',width: "100%",
        justifyContent: "center", scale: isMB() ? 0.75 : 1,
        alignItems: "center", top: isMB() ? 0 : 20, left: 10}}
    >
      <a href={schoolIndex === 1 ? "https://www.cis.edu.vn" : "https://www.sedbergh.edu.vn"} target="_blank" rel="noopener noreferrer">
        <img src={ schoolIndex === 0
              ? "/images/LogoSedberghVietnam.png"
              : "/images/LogoCIS.png"}
          width={isMB() ? 50 : 150} alt="Logo"
        />
      </a>

        <DropdownWithLabel onChange={(value) => setSourceSuggestion(value)} 
          suggestion={sourceSuggestion} schoolIndex = {schoolIndex}
          data={regions.map(item => item.text)} clr={clr} title="Vị trí hiện tại" />
        <DropdownWithLabel  onChange={(value) => handleChangeDestination(value)} 
          suggestion={destinationSuggestion} schoolIndex = {schoolIndex}
          data={regions.map(item => item.text)} clr={clr} title="Điểm đến" />
      
      <div style={{marginTop: isMB() ? 10 : 35}}>
        <SearchInput clr={clr}
          schoolIndex ={schoolIndex}
         placeholder="Tìm kiếm phòng học" 
          onSearchChange={(value) => setSearchTerm(value)}/>
      </div>
    </Stack>

    <div style={{ position: "fixed",top: '90vh',left: 50}}>
        <a href={schoolIndex === 0 ? 'https://sedbergh.edu.vn/virtualtour/':'https://360.cis.edu.vn/#cis_foyer' } target="_blank">
          <img src={`/images/${schoolIndex === 0 ? '360_seq':'360'}.png`} width={120}/>
        </a>
    </div>

    </>
  );
}

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
        <RootApp />
    </BrowserRouter>
  </React.StrictMode>
);
