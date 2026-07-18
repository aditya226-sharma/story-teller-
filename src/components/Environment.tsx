"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { useStore } from "@/store/useStore";
import * as THREE from "three";

function seededRandom(seed: number) {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

export default function Environment() {
  const currentChapter = useStore((s) => s.currentChapter);

  return (
    <>
      <Lighting chapter={currentChapter} />
      <Terrain />
      <FogSystem />
      <FloatingObjects chapter={currentChapter} />
      {currentChapter === 2 && <StormEffects />}
    </>
  );
}

function Lighting({ chapter }: { chapter: number }) {
  const lightRef = useRef<THREE.DirectionalLight>(null);
  const ambientRef = useRef<THREE.AmbientLight>(null);

  const configRef = useRef({ color: "#6C63FF", intensity: 0.8, ambient: 0.1 });

  useFrame(() => {
    if (!lightRef.current || !ambientRef.current) return;

    const configs = [
      { color: "#6C63FF", intensity: 0.8, ambient: 0.1 },
      { color: "#00FF88", intensity: 0.6, ambient: 0.15 },
      { color: "#FF4FD8", intensity: 1.0, ambient: 0.05 },
      { color: "#FFD93D", intensity: 1.2, ambient: 0.2 },
      { color: "#6C63FF", intensity: 0.9, ambient: 0.12 },
    ];

    const config = configs[chapter] || configs[0];
    configRef.current = config;
    lightRef.current.color.lerp(new THREE.Color(config.color), 0.02);
    lightRef.current.intensity += (config.intensity - lightRef.current.intensity) * 0.02;
    ambientRef.current.intensity += (config.ambient - ambientRef.current.intensity) * 0.02;
  });

  return (
    <>
      <ambientLight ref={ambientRef} intensity={0.1} />
      <directionalLight ref={lightRef} position={[5, 10, 5]} intensity={0.8} color="#6C63FF" />
      <pointLight position={[-5, 5, -5]} intensity={0.3} color="#00E5FF" />
      <pointLight position={[5, -5, 5]} intensity={0.2} color="#FF4FD8" />
    </>
  );
}

function Terrain() {
  const meshRef = useRef<THREE.Mesh>(null);

  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(100, 100, 128, 128);
    const pos = geo.attributes.position;
    const array = pos.array as Float32Array;

    for (let i = 0; i < array.length; i += 3) {
      const x = array[i];
      const y = array[i + 1];
      array[i + 2] =
        Math.sin(x * 0.1) * Math.cos(y * 0.1) * 2 +
        Math.sin(x * 0.05 + y * 0.05) * 3;
    }

    geo.computeVertexNormals();
    return geo;
  }, []);

  useFrame((state) => {
    if (!meshRef.current) return;
    const pos = meshRef.current.geometry.attributes.position;
    const array = pos.array as Float32Array;
    const time = state.clock.elapsedTime;

    for (let i = 0; i < array.length; i += 3) {
      const x = array[i];
      const y = array[i + 1];
      array[i + 2] =
        Math.sin(x * 0.1 + time * 0.1) * Math.cos(y * 0.1 + time * 0.05) * 2 +
        Math.sin(x * 0.05 + y * 0.05) * 3;
    }
    pos.needsUpdate = true;
  });

  return (
    <mesh
      ref={meshRef}
      geometry={geometry}
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, -3, 0]}
    >
      <meshStandardMaterial
        color="#1a0a3e"
        wireframe
        transparent
        opacity={0.3}
        emissive="#1a0a3e"
        emissiveIntensity={0.2}
      />
    </mesh>
  );
}

function FogSystem() {
  const meshRef = useRef<THREE.Points>(null);
  const count = 200;

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (seededRandom(i * 3 + 5000) - 0.5) * 30;
      pos[i * 3 + 1] = seededRandom(i * 3 + 5001) * 5 - 2;
      pos[i * 3 + 2] = (seededRandom(i * 3 + 5002) - 0.5) * 30;
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.02;
    const pos = meshRef.current.geometry.attributes.position;
    const array = pos.array as Float32Array;

    for (let i = 0; i < count; i++) {
      array[i * 3 + 1] += Math.sin(state.clock.elapsedTime + i) * 0.002;
    }
    pos.needsUpdate = true;
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.5}
        color="#6C63FF"
        transparent
        opacity={0.05}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
}

function FloatingObjects({ chapter }: { chapter: number }) {
  const groupRef = useRef<THREE.Group>(null);

  const objects = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => ({
      position: [
        (seededRandom(i * 4 + 8000) - 0.5) * 20,
        seededRandom(i * 4 + 8001) * 8 - 2,
        (seededRandom(i * 4 + 8002) - 0.5) * 20,
      ] as [number, number, number],
      scale: seededRandom(i * 4 + 8003) * 0.3 + 0.1,
      speed: seededRandom(i + 9000) * 0.5 + 0.2,
      offset: seededRandom(i + 9500) * Math.PI * 2,
    }));
  }, []);

  useFrame((state) => {
    if (!groupRef.current) return;
    const time = state.clock.elapsedTime;
    groupRef.current.children.forEach((child, i) => {
      if (i >= objects.length) return;
      const obj = objects[i];
      child.position.y = obj.position[1] + Math.sin(time * obj.speed + obj.offset) * 1;
      child.rotation.x = time * obj.speed * 0.5;
      child.rotation.z = time * obj.speed * 0.3;
    });
  });

  const colors: Record<number, string> = {
    0: "#6C63FF",
    1: "#00FF88",
    2: "#FF4FD8",
    3: "#FFD93D",
    4: "#00E5FF",
  };

  return (
    <group ref={groupRef}>
      {objects.map((obj, i) => (
        <mesh key={i} position={obj.position} scale={obj.scale}>
          <octahedronGeometry args={[1, 0]} />
          <meshStandardMaterial
            color={colors[chapter] || "#6C63FF"}
            emissive={colors[chapter] || "#6C63FF"}
            emissiveIntensity={0.5}
            transparent
            opacity={0.6}
            wireframe
          />
        </mesh>
      ))}
    </group>
  );
}

function StormEffects() {
  const lightningRef = useRef<THREE.PointLight>(null);

  useFrame(() => {
    if (!lightningRef.current) return;
    const flash = Math.random() > 0.98 ? 5 : 0;
    lightningRef.current.intensity += (flash - lightningRef.current.intensity) * 0.1;
  });

  return (
    <pointLight
      ref={lightningRef}
      position={[0, 10, 0]}
      intensity={0}
      color="#ffffff"
      distance={50}
    />
  );
}
