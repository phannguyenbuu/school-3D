import React, { useState } from "react";

export default function ThinButton({ text, onClick }) {
  const [hovered, setHovered] = useState(false);

  const baseStyle = {
    margin: "0px 0px",
    fontSize: 8,
    border: "1px solid #000",
    borderLeft: "none",
    borderRight: "none",
    background: "none",
    backgroundColor: "none",
    borderRadius: "5px",
    padding: "6px 0px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    maxWidth: 40,
    minWidth: 40,
    maxHeight: 40,
    minHeight: 40,
    overflow: 'hidden'
  };

  const hoverStyle = {
    transform: "scale(1.1)",
    backgroundColor: "rgba(0, 0, 0, 0.1)",  // overlay nhẹ
    boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
  };

  return (
    <button
      style={hovered ? { ...baseStyle, ...hoverStyle } : baseStyle}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {text}
    </button>
  );
}