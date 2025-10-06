import "./App.scss";
import React, { useRef, useState, useEffect } from "react";
// import RoomToggleButton from "./components/Buttons/RoomToggleButton/RoomToggleButton";
import Experience from "./Experience";

import { useResponsiveStore } from "./stores/useResponsiveStore";
// import LoadingPage from "./pages/LoadingPage/LoadingPage";
// import Menu from "./components/Menu/Menu";
import Router from "./routes/Router";
import Overlay from "./components/Overlay/Overlay";
// import Logo from "./components/Logo/Logo";

function App({ cameraPositions, title='React App', handleHome, onRoomSwitchChange, ...props }) {
  const { updateDimensions } = useResponsiveStore();
  const [isRoomSwitched, setIsRoomSwitched] = useState(false);


  const handleRoomToggleClick = () => {
    setIsRoomSwitched(prev => {
      const newState = !prev;
      if (typeof onRoomSwitchChange === "function") {
        onRoomSwitchChange(newState);
      }
      return newState;
    });
  };

  useEffect(() => {
    document.title = title;
    window.addEventListener("resize", updateDimensions);
    return () => {
      window.removeEventListener("resize", updateDimensions);
    };
  }, []);

  return (
    <>
      {/* <RoomToggleButton handleToggle={handleRoomToggleClick} handleHome={handleHome} /> */}
      <Overlay />
      <Router />
      <Experience cameraPositions={cameraPositions}
        isRoomSwitched={isRoomSwitched}
        {...props}
      />
    </>
  );
}

export default App;
