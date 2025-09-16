import React, { useState, useEffect } from "react";
import { Canvas, useThree } from "@react-three/fiber";

// Component chạy trong Canvas, dùng hook useThree()
export function SceneStatsCollector({ onUpdate }) {
  const { scene } = useThree();

  useEffect(() => {
    if (!scene) return;

    const stats = {
      totalObjects: 0,
      meshCount: 0,
      lightCount: 0,
      cameraCount: 0,
      groupCount: 0,
    };

    scene.traverse((obj) => {
      stats.totalObjects++;

      if (obj.type === "Mesh" || obj.type === "InstancedMesh") {
        stats.meshCount++;
      } else if (obj.type.endsWith("Light")) {
        stats.lightCount++;
      } else if (obj.type === "Camera") {
        stats.cameraCount++;
      } else if (obj.type === "Group") {
        stats.groupCount++;
      }
    });

    console.log("Tổng số đối tượng trong scene:", stats.totalObjects);

    onUpdate(stats);
  }, [scene, onUpdate]);

  return null; // không render gì trong Canvas
}

// Component hiển thị UI bên ngoài Canvas
export function SceneStatistics({ stats }) {
  return (
    <div
      style={{
        position: "fixed",
        top: 200,
        left: 20,
        color: "#000",
        backgroundColor: "rgba(255,255,255,0.8)",
        padding: 8,
        borderRadius: 4,
        fontSize: 12,
        zIndex: 9999,
      }}
    >
      <div>
        <b>Tổng đối tượng:</b> {stats.totalObjects}
      </div>
      <div>
        <b>Mesh:</b> {stats.meshCount}
      </div>
      <div>
        <b>Ánh sáng:</b> {stats.lightCount}
      </div>
      <div>
        <b>Camera:</b> {stats.cameraCount}
      </div>
      <div>
        <b>Group:</b> {stats.groupCount}
      </div>
    </div>
  );
}
