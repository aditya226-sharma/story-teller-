"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useStore } from "@/store/useStore";
import * as THREE from "three";

export default function Character() {
  const groupRef = useRef<THREE.Group>(null);
  const bodyRef = useRef<THREE.Mesh>(null);
  const headRef = useRef<THREE.Mesh>(null);
  const leftArmRef = useRef<THREE.Mesh>(null);
  const rightArmRef = useRef<THREE.Mesh>(null);
  const leftLegRef = useRef<THREE.Mesh>(null);
  const rightLegRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.PointLight>(null);
  const currentChapter = useStore((s) => s.currentChapter);
  const scrollProgress = useStore((s) => s.scrollProgress);

  useFrame((state) => {
    if (!groupRef.current) return;
    const time = state.clock.elapsedTime;

    // Position character based on scroll
    const targetY = -2 + Math.sin(time * 0.5) * 0.2;
    groupRef.current.position.y = targetY;
    groupRef.current.position.x = Math.sin(scrollProgress * Math.PI * 4) * 2;

    // Face direction of movement
    groupRef.current.rotation.y = Math.sin(time * 0.3) * 0.5;

    // Idle animation
    if (bodyRef.current) {
      bodyRef.current.rotation.z = Math.sin(time * 1.5) * 0.05;
    }
    if (headRef.current) {
      headRef.current.rotation.x = Math.sin(time * 0.8) * 0.1;
      headRef.current.rotation.y = Math.sin(time * 0.5) * 0.15;
    }

    // Arm swing
    if (leftArmRef.current) {
      leftArmRef.current.rotation.x = Math.sin(time * 2) * 0.3;
      leftArmRef.current.rotation.z = Math.sin(time * 1.2) * 0.1;
    }
    if (rightArmRef.current) {
      rightArmRef.current.rotation.x = Math.sin(time * 2 + Math.PI) * 0.3;
      rightArmRef.current.rotation.z = Math.sin(time * 1.2 + Math.PI) * 0.1;
    }

    // Leg movement
    if (leftLegRef.current) {
      leftLegRef.current.rotation.x = Math.sin(time * 2) * 0.2;
    }
    if (rightLegRef.current) {
      rightLegRef.current.rotation.x = Math.sin(time * 2 + Math.PI) * 0.2;
    }

    // Glow pulse
    if (glowRef.current) {
      glowRef.current.intensity = 1 + Math.sin(time * 2) * 0.3;
    }
  });

  const characterColors: string[] = [
    "#6C63FF",
    "#00E5FF",
    "#FF4FD8",
    "#FFD93D",
    "#6C63FF",
  ];

  const color = characterColors[currentChapter] || "#6C63FF";

  return (
    <group ref={groupRef} position={[0, -2, 3]}>
      {/* Body */}
      <mesh ref={bodyRef} position={[0, 0.6, 0]}>
        <capsuleGeometry args={[0.2, 0.5, 4, 8]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.3}
          metalness={0.5}
          roughness={0.3}
        />
      </mesh>

      {/* Head */}
      <mesh ref={headRef} position={[0, 1.3, 0]}>
        <sphereGeometry args={[0.25, 16, 16]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.4}
          metalness={0.5}
          roughness={0.2}
        />
      </mesh>

      {/* Eyes */}
      <mesh position={[-0.08, 1.35, 0.2]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={2} />
      </mesh>
      <mesh position={[0.08, 1.35, 0.2]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={2} />
      </mesh>

      {/* Left Arm */}
      <mesh ref={leftArmRef} position={[-0.35, 0.7, 0]}>
        <capsuleGeometry args={[0.06, 0.35, 4, 8]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.2}
          metalness={0.5}
          roughness={0.3}
        />
      </mesh>

      {/* Right Arm */}
      <mesh ref={rightArmRef} position={[0.35, 0.7, 0]}>
        <capsuleGeometry args={[0.06, 0.35, 4, 8]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.2}
          metalness={0.5}
          roughness={0.3}
        />
      </mesh>

      {/* Left Leg */}
      <mesh ref={leftLegRef} position={[-0.12, -0.05, 0]}>
        <capsuleGeometry args={[0.08, 0.35, 4, 8]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.15}
          metalness={0.5}
          roughness={0.3}
        />
      </mesh>

      {/* Right Leg */}
      <mesh ref={rightLegRef} position={[0.12, -0.05, 0]}>
        <capsuleGeometry args={[0.08, 0.35, 4, 8]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.15}
          metalness={0.5}
          roughness={0.3}
        />
      </mesh>

      {/* Character Glow */}
      <pointLight ref={glowRef} position={[0, 0.8, 0]} intensity={1} color={color} distance={5} />

      {/* Shadow */}
      <mesh position={[0, -0.4, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.4, 16]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.3} />
      </mesh>
    </group>
  );
}
