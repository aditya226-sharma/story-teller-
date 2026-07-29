"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useStore } from "@/store/useStore";

export default function CameraController() {
  const scrollProgress = useStore((s) => s.scrollProgress);
  const currentChapter = useStore((s) => s.currentChapter);
  const cameraRef = useRef({ x: 0, y: 2, z: 8 });
  const lookAtRef = useRef({ x: 0, y: 0, z: 0 });

  useFrame((state) => {
    const camera = state.camera;
    const time = state.clock.elapsedTime;

    const chapterCams = [
      { x: Math.sin(time * 0.1) * 0.5, y: 2 + Math.sin(time * 0.15) * 0.3, z: 8 - scrollProgress * 15 },
      { x: Math.sin(scrollProgress * Math.PI * 2 + time * 0.2) * 3, y: 3, z: Math.cos(scrollProgress * Math.PI * 2 + time * 0.2) * 5 },
      { x: Math.sin(time * 0.5) * 2, y: 4 + Math.sin(time * 0.8) * 1, z: 5 },
      { x: 0, y: 5 + Math.sin(time * 0.1) * 0.5, z: 10 },
      { x: Math.sin(time * 0.15) * 4, y: 3, z: Math.cos(time * 0.15) * 6 },
    ];

    const lookAts = [
      { x: 0, y: 0, z: -5 },
      { x: Math.sin(scrollProgress * 2) * 2, y: 1, z: 0 },
      { x: 0, y: 2, z: -3 },
      { x: 0, y: 3, z: 0 },
      { x: 0, y: 0, z: 0 },
    ];

    const targetCam = chapterCams[currentChapter] || chapterCams[0];
    const targetLookAt = lookAts[currentChapter] || lookAts[0];

    cameraRef.current.x += (targetCam.x - cameraRef.current.x) * 0.03;
    cameraRef.current.y += (targetCam.y - cameraRef.current.y) * 0.03;
    cameraRef.current.z += (targetCam.z - cameraRef.current.z) * 0.03;

    lookAtRef.current.x += (targetLookAt.x - lookAtRef.current.x) * 0.03;
    lookAtRef.current.y += (targetLookAt.y - lookAtRef.current.y) * 0.03;
    lookAtRef.current.z += (targetLookAt.z - lookAtRef.current.z) * 0.03;

    camera.position.set(
      cameraRef.current.x,
      cameraRef.current.y,
      cameraRef.current.z
    );
    camera.lookAt(
      lookAtRef.current.x,
      lookAtRef.current.y,
      lookAtRef.current.z
    );
  });

  return null;
}
