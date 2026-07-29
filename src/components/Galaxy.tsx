"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface GalaxyProps {
  count?: number;
  radius?: number;
  branches?: number;
  spin?: number;
  randomness?: number;
  color1?: string;
  color2?: string;
}

function seededRandom(seed: number) {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

function generateGalaxyData(count: number, radius: number, branches: number, spin: number, randomness: number, color1: string, color2: string) {
  const pos = new Float32Array(count * 3);
  const col = new Float32Array(count * 3);
  const c1 = new THREE.Color(color1);
  const c2 = new THREE.Color(color2);

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    const r = seededRandom(i) * radius;
    const branchAngle = ((i % branches) / branches) * Math.PI * 2;
    const spinAngle = r * spin;
    const randomX = (seededRandom(i + 1000) - 0.5) * randomness * r * 0.5;
    const randomY = (seededRandom(i + 2000) - 0.5) * randomness * r * 0.2;
    const randomZ = (seededRandom(i + 3000) - 0.5) * randomness * r * 0.5;

    pos[i3] = Math.cos(branchAngle + spinAngle) * r + randomX;
    pos[i3 + 1] = randomY;
    pos[i3 + 2] = Math.sin(branchAngle + spinAngle) * r + randomZ;

    const mixedColor = c1.clone().lerp(c2, r / radius);
    col[i3] = mixedColor.r;
    col[i3 + 1] = mixedColor.g;
    col[i3 + 2] = mixedColor.b;
  }

  return { pos, col };
}

export default function Galaxy({
  count = 5000,
  radius = 5,
  branches = 3,
  spin = 1,
  randomness = 0.5,
  color1 = "#6C63FF",
  color2 = "#00E5FF",
}: GalaxyProps) {
  const pointsRef = useRef<THREE.Points>(null);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const { pos, col } = useMemo(() => generateGalaxyData(count, radius, branches, spin, randomness, color1, color2), []);

  useFrame((state) => {
    if (!pointsRef.current) return;
    pointsRef.current.rotation.y = state.clock.elapsedTime * 0.02;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[pos, 3]} />
        <bufferAttribute attach="attributes-color" args={[col, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.02}
        vertexColors
        transparent
        opacity={0.8}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
}
