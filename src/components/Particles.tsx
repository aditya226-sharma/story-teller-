"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface ParticlesProps {
  count?: number;
  color?: string;
  size?: number;
  spread?: number;
  speed?: number;
  opacity?: number;
}

function seededRandom(seed: number) {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

function generateParticleData(count: number, color: string, size: number, spread: number) {
  const pos = new Float32Array(count * 3);
  const col = new Float32Array(count * 3);
  const siz = new Float32Array(count);
  const baseColor = new THREE.Color(color);

  for (let i = 0; i < count; i++) {
    pos[i * 3] = (seededRandom(i * 3) - 0.5) * spread;
    pos[i * 3 + 1] = (seededRandom(i * 3 + 1) - 0.5) * spread;
    pos[i * 3 + 2] = (seededRandom(i * 3 + 2) - 0.5) * spread;

    col[i * 3] = baseColor.r;
    col[i * 3 + 1] = baseColor.g;
    col[i * 3 + 2] = baseColor.b;

    siz[i] = seededRandom(i + 100) * size + size * 0.5;
  }

  return { pos, col, siz };
}

export default function Particles({
  count = 500,
  color = "#6C63FF",
  size = 0.02,
  spread = 50,
  speed = 0.3,
  opacity = 0.8,
}: ParticlesProps) {
  const meshRef = useRef<THREE.Points>(null);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const { pos, col, siz } = useMemo(() => generateParticleData(count, color, size, spread), []);

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.elapsedTime;
    meshRef.current.rotation.y = time * speed * 0.1;
    meshRef.current.rotation.x = Math.sin(time * speed * 0.05) * 0.1;

    const posAttr = meshRef.current.geometry.attributes.position;
    if (posAttr) {
      const array = posAttr.array as Float32Array;
      for (let i = 0; i < count; i++) {
        array[i * 3 + 1] += Math.sin(time + i * 0.1) * 0.001;
      }
      posAttr.needsUpdate = true;
    }
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[pos, 3]} />
        <bufferAttribute attach="attributes-color" args={[col, 3]} />
        <bufferAttribute attach="attributes-size" args={[siz, 1]} />
      </bufferGeometry>
      <pointsMaterial
        size={size}
        vertexColors
        transparent
        opacity={opacity}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
}
