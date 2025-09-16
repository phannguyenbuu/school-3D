import React, { useRef, useEffect } from "react";
import "./RoomToggleButton.scss";
import { useToggleRoomStore } from "../../../stores/toggleRoomStore";
import gsap from "gsap";
import { useNavigate } from "react-router";

const RoomToggleButton = ({ handleHome,handleToggle }) => {
  const toggleButtonRef = useRef();
  
  const isMB = () => {
    return window.innerWidth < 768;
  }

  return (
    <div style={{display:'flex', position:'fixed',bottom: isMB()? 30 : 60, gap:10, 
      right: isMB()? 160: 40, zIndex:40}}>
    <button
        className='toggle-button'
        onClick={handleHome} // Dùng luôn hàm này truyền từ ngoài
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="18" viewBox="0 0 24 24" fill="none">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M21.4498 10.275L11.9998 3.1875L2.5498 10.275L2.9998 11.625H3.7498V20.25H20.2498V11.625H20.9998L21.4498 10.275ZM5.2498 18.75V10.125L11.9998 5.0625L18.7498 10.125V18.75H14.9999V14.3333L14.2499 13.5833H9.74988L8.99988 14.3333V18.75H5.2498ZM10.4999 18.75H13.4999V15.0833H10.4999V18.75Z" fill="#080341"/>
        </svg>
      </button>

      <button
        className='toggle-button'
        onClick={handleToggle} // Dùng luôn hàm này truyền từ ngoài
      >
        <svg
          width="48"
          height="18"
          viewBox="0 0 31 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            x="9.99939"
            y="5.55542"
            width="10.6667"
            height="0.888892"
            fill="black"
          />
          <rect
            x="20.2013"
            y="6"
            width="6.65685"
            height="6.65685"
            transform="rotate(-45 20.2013 6)"
            stroke="black"
          />
          <rect
            x="1.29289"
            y="6"
            width="6.65685"
            height="6.65685"
            transform="rotate(-45 1.29289 6)"
            stroke="black"
          />
        </svg>
      </button>
    </div>
  );
};

export default RoomToggleButton;
