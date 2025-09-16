// src/components/Dialog/Dialog.jsx
import React, { useState, useEffect } from "react";
import { Html } from '@react-three/drei';
import ThinButton from "../Buttons/ThinButton";
import Button from '@mui/material/Button';

const Dialog = ({ text, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000); // 3000ms = 3 giây

    return () => clearTimeout(timer); // Cleanup nếu component unmount sớm
  }, [onClose]);

  


  return (
    <Html>
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.dialog} onClick={(e) => e.stopPropagation()}>
        <p style={{ marginBottom: 20, fontFamily:'Tahoma' }}>{text.replace("n/a","").trim()}</p>

        {/* <div style={{display:"flex", width:400, flexDirection:"row", alignItems:'center', justifyContent:'center'}}> */}
        {/* <button onClick={onClose} style={styles.button}>
          Go
        </button> */}
        <Button style={{ background:'#747474', color:'#ffffff', borderRadius: 5, padding:5, width:60,height:30 }} onClick={onClose}>OK</Button>
          
        {/* </div> */}
      </div>
    </div>
    </Html>
  );
};

const styles = {
  overlay: {
    position: "fixed",
    top: -100, left: 0,
    width: "0",
    height: "0",
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  },
  dialog: {
    backgroundColor: "rgba(255,255,255,0.75)",
    borderRadius: 5,
    padding: 24,
    boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
    minWidth: 320,
    textAlign: "center",
    fontFamily: "'Comic Sans MS', cursive, sans-serif",
    display:"flex",
    flexDirection:"column",
    alignItems: "center",
    justifyContent: "content"
  },
  button: {
    backgroundColor: "#ff6867",
    border: "none",
    borderRadius: 12,
    padding: "10px 24px",
    color: "#fff",
    fontWeight: "bold",
    cursor: "pointer",
    fontSize: 16,
  },
};

export default Dialog;
