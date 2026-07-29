"use client";
/* eslint-disable react-hooks/immutability */

import { useMemo, useRef, useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

// ─── Helpers ──────────────────────────────────────
function sRand(seed: number) {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

const CHAPTER_COLORS = [
  { primary: "#4A90D9", secondary: "#1a1a3e", fog: "#0a0a2e" },  // 1: Frozen Night
  { primary: "#00BFFF", secondary: "#0a2a4e", fog: "#0a1a3e" },  // 2: Crystal Blue
  { primary: "#00CED1", secondary: "#002a3e", fog: "#001a2e" },  // 3: Ocean Teal
  { primary: "#DDA0DD", secondary: "#2a1a3e", fog: "#1a0a3e" },  // 4: Cloud Purple
  { primary: "#FF4FD8", secondary: "#3e0a2a", fog: "#2e0a1a" },  // 5: Eclipse Pink
  { primary: "#FFD93D", secondary: "#3e2a0a", fog: "#2e1a0a" },  // 6: Golden Core
  { primary: "#FF6B35", secondary: "#3e1a0a", fog: "#4e2a0a" },  // 7: Sunrise Orange
  { primary: "#6C63FF", secondary: "#0a1a3e", fog: "#0a0a2e" },  // 8: Legacy Blue
];

// ─── Galaxy ───────────────────────────────────────
function GalaxyPoints() {
  const pointsRef = useRef<THREE.Points>(null);
  const data = useMemo(() => {
    const count = 3000, radius = 8, branches = 4, spin = 2, randomness = 0.5;
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const c1 = new THREE.Color("#6C63FF");
    const c2 = new THREE.Color("#00E5FF");
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const r = sRand(i) * radius;
      const ba = ((i % branches) / branches) * Math.PI * 2;
      const sa = r * spin;
      pos[i3] = Math.cos(ba + sa) * r + (sRand(i + 1000) - 0.5) * randomness * r * 0.5;
      pos[i3 + 1] = (sRand(i + 2000) - 0.5) * randomness * r * 0.2;
      pos[i3 + 2] = Math.sin(ba + sa) * r + (sRand(i + 3000) - 0.5) * randomness * r * 0.5;
      const mc = c1.clone().lerp(c2, r / radius);
      col[i3] = mc.r; col[i3 + 1] = mc.g; col[i3 + 2] = mc.b;
    }
    return { pos, col };
  }, []);
  useFrame((state) => { if (pointsRef.current) pointsRef.current.rotation.y = state.clock.elapsedTime * 0.02; });
  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[data.pos, 3]} />
        <bufferAttribute attach="attributes-color" args={[data.col, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.02} vertexColors transparent opacity={0.8} blending={THREE.AdditiveBlending} depthWrite={false} sizeAttenuation />
    </points>
  );
}

// ─── Stars ────────────────────────────────────────
function StarFieldPoints() {
  const meshRef = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const count = 2000, radius = 50;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = sRand(i) * Math.PI * 2;
      const phi = Math.acos(2 * sRand(i + 500) - 1);
      const r = radius + (sRand(i + 1000) - 0.5) * 5;
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
    }
    return pos;
  }, []);
  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.005;
    meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.01) * 0.02;
  });
  return (
    <points ref={meshRef}>
      <bufferGeometry><bufferAttribute attach="attributes-position" args={[positions, 3]} /></bufferGeometry>
      <pointsMaterial size={0.06} color="#ffffff" transparent opacity={0.9} blending={THREE.AdditiveBlending} depthWrite={false} sizeAttenuation />
    </points>
  );
}

// ─── Floating Particles ───────────────────────────
function FloatingParticles({ count, color, spread, size, speed, opacity }: {
  count: number; color: string; spread: number; size: number; speed: number; opacity: number;
}) {
  const meshRef = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (sRand(i * 3) - 0.5) * spread;
      pos[i * 3 + 1] = (sRand(i * 3 + 1) - 0.5) * spread;
      pos[i * 3 + 2] = (sRand(i * 3 + 2) - 0.5) * spread;
    }
    return pos;
  }, [count, spread]);
  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;
    meshRef.current.rotation.y = t * speed * 0.1;
    meshRef.current.rotation.x = Math.sin(t * speed * 0.05) * 0.1;
    const pa = meshRef.current.geometry.attributes.position;
    if (pa) {
      const a = pa.array as Float32Array;
      for (let i = 0; i < count; i++) a[i * 3 + 1] += Math.sin(t + i * 0.1) * 0.001;
      pa.needsUpdate = true;
    }
  });
  return (
    <points ref={meshRef}>
      <bufferGeometry><bufferAttribute attach="attributes-position" args={[positions, 3]} /></bufferGeometry>
      <pointsMaterial size={size} color={color} transparent opacity={opacity} blending={THREE.AdditiveBlending} depthWrite={false} sizeAttenuation />
    </points>
  );
}

// ─── Terrain ──────────────────────────────────────
function AnimatedTerrain({ chapter }: { chapter: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(100, 100, 64, 64);
    const pos = geo.attributes.position;
    const a = pos.array as Float32Array;
    for (let i = 0; i < a.length; i += 3) {
      a[i + 2] = Math.sin(a[i] * 0.1) * Math.cos(a[i + 1] * 0.1) * 2 + Math.sin(a[i] * 0.05 + a[i + 1] * 0.05) * 3;
    }
    geo.computeVertexNormals();
    return geo;
  }, []);
  useFrame((state) => {
    if (!meshRef.current) return;
    const pos = meshRef.current.geometry.attributes.position;
    const a = pos.array as Float32Array;
    const t = state.clock.elapsedTime;
    for (let i = 0; i < a.length; i += 3) {
      a[i + 2] = Math.sin(a[i] * 0.1 + t * 0.1) * Math.cos(a[i + 1] * 0.1 + t * 0.05) * 2 + Math.sin(a[i] * 0.05 + a[i + 1] * 0.05) * 3;
    }
    pos.needsUpdate = true;
  });
  const c = CHAPTER_COLORS[chapter] || CHAPTER_COLORS[0];
  return (
    <mesh ref={meshRef} geometry={geometry} rotation={[-Math.PI / 2, 0, 0]} position={[0, -3, 0]}>
      <meshStandardMaterial color={c.secondary} wireframe transparent opacity={0.3} emissive={c.primary} emissiveIntensity={0.15} />
    </mesh>
  );
}

// ─── Floating Octahedra ───────────────────────────
function FloatingOctahedra({ chapter }: { chapter: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const objects = useMemo(() => Array.from({ length: 12 }, (_, i) => ({
    position: [(sRand(i * 4 + 8000) - 0.5) * 20, sRand(i * 4 + 8001) * 8 - 2, (sRand(i * 4 + 8002) - 0.5) * 20] as [number, number, number],
    scale: sRand(i * 4 + 8003) * 0.3 + 0.1,
    speed: sRand(i + 9000) * 0.5 + 0.2,
    offset: sRand(i + 9500) * Math.PI * 2,
  })), []);
  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    groupRef.current.children.forEach((child, i) => {
      if (i >= objects.length) return;
      const o = objects[i];
      child.position.y = o.position[1] + Math.sin(t * o.speed + o.offset);
      child.rotation.x = t * o.speed * 0.5;
      child.rotation.z = t * o.speed * 0.3;
    });
  });
  const color = CHAPTER_COLORS[chapter]?.primary || "#6C63FF";
  return (
    <group ref={groupRef}>
      {objects.map((o, i) => (
        <mesh key={i} position={o.position} scale={o.scale}>
          <octahedronGeometry args={[1, 0]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} transparent opacity={0.6} wireframe />
        </mesh>
      ))}
    </group>
  );
}

// ─── Snow Particles (Chapters 1, 2) ──────────────
function SnowParticles({ active }: { active: boolean }) {
  const meshRef = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const count = 500;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (sRand(i * 7 + 10000) - 0.5) * 40;
      pos[i * 3 + 1] = sRand(i * 7 + 10001) * 20 - 5;
      pos[i * 3 + 2] = (sRand(i * 7 + 10002) - 0.5) * 40;
    }
    return pos;
  }, []);
  useFrame((state) => {
    if (!meshRef.current || !active) return;
    const t = state.clock.elapsedTime;
    const pa = meshRef.current.geometry.attributes.position;
    const a = pa.array as Float32Array;
    for (let i = 0; i < 500; i++) {
      a[i * 3 + 1] -= 0.02;
      a[i * 3] += Math.sin(t + i) * 0.005;
      if (a[i * 3 + 1] < -5) a[i * 3 + 1] = 15;
    }
    pa.needsUpdate = true;
  });
  return (
    <points ref={meshRef}>
      <bufferGeometry><bufferAttribute attach="attributes-position" args={[positions, 3]} /></bufferGeometry>
      <pointsMaterial size={0.08} color="#ffffff" transparent opacity={active ? 0.7 : 0} sizeAttenuation />
    </points>
  );
}

// ─── Rain Particles (Chapter 3, 5) ───────────────
function RainParticles({ active }: { active: boolean }) {
  const meshRef = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const count = 600;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (sRand(i * 7 + 20000) - 0.5) * 40;
      pos[i * 3 + 1] = sRand(i * 7 + 20001) * 25;
      pos[i * 3 + 2] = (sRand(i * 7 + 20002) - 0.5) * 40;
    }
    return pos;
  }, []);
  useFrame(() => {
    if (!meshRef.current || !active) return;
    const pa = meshRef.current.geometry.attributes.position;
    const a = pa.array as Float32Array;
    for (let i = 0; i < 600; i++) {
      a[i * 3 + 1] -= 0.3;
      if (a[i * 3 + 1] < -5) a[i * 3 + 1] = 20;
    }
    pa.needsUpdate = true;
  });
  return (
    <points ref={meshRef}>
      <bufferGeometry><bufferAttribute attach="attributes-position" args={[positions, 3]} /></bufferGeometry>
      <pointsMaterial size={0.04} color="#aaccff" transparent opacity={active ? 0.5 : 0} sizeAttenuation />
    </points>
  );
}

// ─── Water Surface (Chapter 3) ────────────────────
function WaterSurface({ active }: { active: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;
    meshRef.current.position.y = -1.5 + Math.sin(t * 0.5) * 0.1;
    const mat = meshRef.current.material as THREE.MeshStandardMaterial;
    mat.opacity = active ? 0.15 : 0;
  });
  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.5, 0]}>
      <planeGeometry args={[60, 60]} />
      <meshStandardMaterial color="#00CED1" transparent opacity={0.15} emissive="#00CED1" emissiveIntensity={0.3} side={THREE.DoubleSide} />
    </mesh>
  );
}

// ─── Floating City Islands (Chapter 4) ────────────
function FloatingIslands({ active }: { active: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const islands = useMemo(() => Array.from({ length: 8 }, (_, i) => ({
    position: [(sRand(i + 40000) - 0.5) * 20, sRand(i + 40001) * 6 + 3, (sRand(i + 40002) - 0.5) * 20] as [number, number, number],
    scale: sRand(i + 40003) * 0.8 + 0.4,
    speed: sRand(i + 40004) * 0.3 + 0.1,
  })), []);
  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    groupRef.current.children.forEach((child, i) => {
      if (i >= islands.length) return;
      const o = islands[i];
      child.position.y = o.position[1] + Math.sin(t * o.speed + i) * 0.5;
      child.rotation.y = t * 0.05;
    });
  });
  return (
    <group ref={groupRef} visible={active}>
      {islands.map((o, i) => (
        <mesh key={i} position={o.position} scale={o.scale}>
          <dodecahedronGeometry args={[1, 1]} />
          <meshStandardMaterial color="#DDA0DD" emissive="#DDA0DD" emissiveIntensity={0.3} transparent opacity={0.4} wireframe />
        </mesh>
      ))}
    </group>
  );
}

// ─── Energy Rings (Chapter 5 — Eclipse) ──────────
function EnergyRings({ active }: { active: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    groupRef.current.children.forEach((child, i) => {
      child.rotation.x = t * 0.5 * (i + 1);
      child.rotation.z = t * 0.3 * (i + 1);
    });
  });
  return (
    <group ref={groupRef} visible={active}>
      {[3, 4, 5].map((r, i) => (
        <mesh key={i}>
          <torusGeometry args={[r, 0.02, 16, 64]} />
          <meshStandardMaterial color="#FF4FD8" emissive="#FF4FD8" emissiveIntensity={2} transparent opacity={0.6} />
        </mesh>
      ))}
    </group>
  );
}

// ─── Helios Core (Chapters 6, 7) ──────────────────
function HeliosCore({ active, merged }: { active: boolean; merged: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    groupRef.current.rotation.y = t * 0.5;
    if (coreRef.current) {
      const scale = merged ? 1 + Math.sin(t * 3) * 0.3 : 0.5;
      coreRef.current.scale.setScalar(scale);
    }
  });
  const color = merged ? "#FFD93D" : "#FFA500";
  return (
    <group ref={groupRef} visible={active} position={[0, 2, -5]}>
      <mesh ref={coreRef}>
        <icosahedronGeometry args={[1, 2]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={merged ? 3 : 1} transparent opacity={0.8} wireframe />
      </mesh>
      {merged && <pointLight position={[0, 0, 0]} intensity={5} color="#FFD93D" distance={30} />}
      {[2, 3, 4].map((r) => (
        <mesh key={r}>
          <torusGeometry args={[r, 0.01, 8, 32]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.5} transparent opacity={0.3} />
        </mesh>
      ))}
    </group>
  );
}

// ─── Sunrise Light (Chapter 7) ────────────────────
function SunriseLight({ active }: { active: boolean }) {
  const lightRef = useRef<THREE.PointLight>(null);
  useFrame((state) => {
    if (!lightRef.current) return;
    const t = state.clock.elapsedTime;
    lightRef.current.position.y = active ? 5 + Math.sin(t * 0.3) * 2 : 20;
    lightRef.current.intensity = active ? 3 + Math.sin(t * 0.5) : 0;
  });
  return <pointLight ref={lightRef} position={[0, 5, -5]} intensity={0} color="#FF6B35" distance={50} />;
}

// ─── Growing Trees (Chapter 8) ────────────────────
function GrowingTrees({ active }: { active: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const trees = useMemo(() => Array.from({ length: 15 }, (_, i) => ({
    position: [(sRand(i + 80000) - 0.5) * 15, 0, (sRand(i + 80001) - 0.5) * 15] as [number, number, number],
    height: sRand(i + 80002) * 2 + 1,
    speed: sRand(i + 80003) * 0.5 + 0.2,
  })), []);
  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    groupRef.current.children.forEach((child, i) => {
      if (i >= trees.length) return;
      const o = trees[i];
      const growth = active ? Math.min(1, t * 0.1) : 0;
      child.scale.y = growth;
      child.position.y = -3 + o.height * growth * 0.5;
    });
  });
  return (
    <group ref={groupRef} visible={active}>
      {trees.map((o, i) => (
        <mesh key={i} position={o.position}>
          <coneGeometry args={[0.3, o.height, 6]} />
          <meshStandardMaterial color="#228B22" emissive="#00FF00" emissiveIntensity={0.2} transparent opacity={0.7} />
        </mesh>
      ))}
    </group>
  );
}

// ─── Character: Aren ──────────────────────────────
function ArenCharacter() {
  const groupRef = useRef<THREE.Group>(null);
  const bodyRef = useRef<THREE.Mesh>(null);
  const headRef = useRef<THREE.Mesh>(null);
  const leftArmRef = useRef<THREE.Mesh>(null);
  const rightArmRef = useRef<THREE.Mesh>(null);
  const leftLegRef = useRef<THREE.Mesh>(null);
  const rightLegRef = useRef<THREE.Mesh>(null);
  const crystalRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    groupRef.current.position.y = -2 + Math.sin(t * 0.5) * 0.2;
    groupRef.current.rotation.y = Math.sin(t * 0.3) * 0.5;
    if (bodyRef.current) bodyRef.current.rotation.z = Math.sin(t * 1.5) * 0.05;
    if (headRef.current) { headRef.current.rotation.x = Math.sin(t * 0.8) * 0.1; headRef.current.rotation.y = Math.sin(t * 0.5) * 0.15; }
    if (leftArmRef.current) leftArmRef.current.rotation.x = Math.sin(t * 2) * 0.3;
    if (rightArmRef.current) rightArmRef.current.rotation.x = Math.sin(t * 2 + Math.PI) * 0.3;
    if (leftLegRef.current) leftLegRef.current.rotation.x = Math.sin(t * 2) * 0.2;
    if (rightLegRef.current) rightLegRef.current.rotation.x = Math.sin(t * 2 + Math.PI) * 0.2;
    if (crystalRef.current) {
      crystalRef.current.rotation.y = t * 2;
      crystalRef.current.rotation.x = Math.sin(t * 3) * 0.3;
    }
  });

  return (
    <group ref={groupRef} position={[0, -2, 3]}>
      {/* Body */}
      <mesh ref={bodyRef} position={[0, 0.6, 0]}>
        <capsuleGeometry args={[0.2, 0.5, 4, 8]} />
        <meshStandardMaterial color="#2a2a4a" emissive="#4A90D9" emissiveIntensity={0.15} metalness={0.3} roughness={0.5} />
      </mesh>
      {/* Head */}
      <mesh ref={headRef} position={[0, 1.3, 0]}>
        <sphereGeometry args={[0.25, 16, 16]} />
        <meshStandardMaterial color="#DEB887" emissive="#FFD93D" emissiveIntensity={0.05} />
      </mesh>
      {/* Eyes */}
      <mesh position={[-0.08, 1.35, 0.2]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshStandardMaterial color="#00BFFF" emissive="#00BFFF" emissiveIntensity={2} />
      </mesh>
      <mesh position={[0.08, 1.35, 0.2]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshStandardMaterial color="#00BFFF" emissive="#00BFFF" emissiveIntensity={2} />
      </mesh>
      {/* Arms */}
      <mesh ref={leftArmRef} position={[-0.35, 0.7, 0]}>
        <capsuleGeometry args={[0.06, 0.35, 4, 8]} />
        <meshStandardMaterial color="#2a2a4a" emissive="#4A90D9" emissiveIntensity={0.1} />
      </mesh>
      <mesh ref={rightArmRef} position={[0.35, 0.7, 0]}>
        <capsuleGeometry args={[0.06, 0.35, 4, 8]} />
        <meshStandardMaterial color="#2a2a4a" emissive="#4A90D9" emissiveIntensity={0.1} />
      </mesh>
      {/* Legs */}
      <mesh ref={leftLegRef} position={[-0.12, -0.05, 0]}>
        <capsuleGeometry args={[0.08, 0.35, 4, 8]} />
        <meshStandardMaterial color="#1a1a3a" emissive="#4A90D9" emissiveIntensity={0.08} />
      </mesh>
      <mesh ref={rightLegRef} position={[0.12, -0.05, 0]}>
        <capsuleGeometry args={[0.08, 0.35, 4, 8]} />
        <meshStandardMaterial color="#1a1a3a" emissive="#4A90D9" emissiveIntensity={0.08} />
      </mesh>
      {/* Blue Crystal */}
      <mesh ref={crystalRef} position={[0.4, 1.0, 0.2]}>
        <octahedronGeometry args={[0.08, 0]} />
        <meshStandardMaterial color="#00BFFF" emissive="#00BFFF" emissiveIntensity={3} transparent opacity={0.9} />
      </mesh>
      <pointLight position={[0.4, 1.0, 0.2]} intensity={0.5} color="#00BFFF" distance={2} />
      {/* Character glow */}
      <pointLight position={[0, 0.8, 0]} intensity={0.5} color="#4A90D9" distance={4} />
    </group>
  );
}

// ─── Nova Companion (follows Aren) ────────────────
function NovaCompanion() {
  const groupRef = useRef<THREE.Group>(null);
  const bodyRef = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    groupRef.current.position.x = 1 + Math.sin(t * 0.7) * 0.3;
    groupRef.current.position.y = -1 + Math.sin(t * 1.2) * 0.2;
    groupRef.current.position.z = 3;
    groupRef.current.rotation.y = t * 0.5;
    if (bodyRef.current) bodyRef.current.rotation.z = Math.sin(t * 2) * 0.1;
  });
  return (
    <group ref={groupRef}>
      <mesh ref={bodyRef}>
        <capsuleGeometry args={[0.1, 0.2, 4, 8]} />
        <meshStandardMaterial color="#C0C0C0" emissive="#FFD93D" emissiveIntensity={0.4} metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0, 0.2, 0]}>
        <sphereGeometry args={[0.12, 12, 12]} />
        <meshStandardMaterial color="#D4D4D4" emissive="#FFD93D" emissiveIntensity={0.3} metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Nova eyes */}
      <mesh position={[-0.04, 0.22, 0.1]}>
        <sphereGeometry args={[0.02, 8, 8]} />
        <meshStandardMaterial color="#FFD93D" emissive="#FFD93D" emissiveIntensity={3} />
      </mesh>
      <mesh position={[0.04, 0.22, 0.1]}>
        <sphereGeometry args={[0.02, 8, 8]} />
        <meshStandardMaterial color="#FFD93D" emissive="#FFD93D" emissiveIntensity={3} />
      </mesh>
      <pointLight position={[0, 0.2, 0]} intensity={0.3} color="#FFD93D" distance={2} />
    </group>
  );
}

// ─── Nebula Background ────────────────────────────
function NebulaPlane({ chapter }: { chapter: number }) {
  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uColor1: { value: new THREE.Color("#6C63FF") },
    uColor2: { value: new THREE.Color("#00E5FF") },
  }), []);
  useFrame((state) => {
    uniforms.uTime.value = state.clock.elapsedTime;
    const c = CHAPTER_COLORS[chapter] || CHAPTER_COLORS[0];
    uniforms.uColor1.value.lerp(new THREE.Color(c.primary), 0.01);
    uniforms.uColor2.value.lerp(new THREE.Color(c.secondary), 0.01);
  });
  return (
    <mesh position={[0, 0, -15]}>
      <planeGeometry args={[50, 50]} />
      <shaderMaterial transparent depthWrite={false} uniforms={uniforms}
        vertexShader={`varying vec2 vUv; void main() { vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }`}
        fragmentShader={`uniform float uTime; uniform vec3 uColor1; uniform vec3 uColor2; varying vec2 vUv;
          float noise(vec2 st){return fract(sin(dot(st,vec2(12.9898,78.233)))*43758.5453);}
          float fbm(vec2 st){float v=0.0;float a=0.5;for(int i=0;i<5;i++){v+=a*noise(st);st*=2.0;a*=0.5;}return v;}
          void main(){float n=fbm(vUv*3.0+uTime*0.05);float n2=fbm(vUv*5.0-uTime*0.08);vec3 c=mix(uColor1,uColor2,n)+vec3(n2*0.15);gl_FragColor=vec4(c,smoothstep(0.2,0.7,n)*0.25);}`}
      />
    </mesh>
  );
}

// ─── Lighting ─────────────────────────────────────
function SceneLighting({ chapter }: { chapter: number }) {
  const lightRef = useRef<THREE.DirectionalLight>(null);
  const ambientRef = useRef<THREE.AmbientLight>(null);
  useFrame(() => {
    if (!lightRef.current || !ambientRef.current) return;
    const c = CHAPTER_COLORS[chapter] || CHAPTER_COLORS[0];
    lightRef.current.color.lerp(new THREE.Color(c.primary), 0.02);
    lightRef.current.intensity += ((chapter === 7 ? 2 : chapter === 6 ? 1.5 : 0.8) - lightRef.current.intensity) * 0.02;
    ambientRef.current.intensity += ((chapter >= 6 ? 0.3 : 0.08) - ambientRef.current.intensity) * 0.02;
  });
  return (
    <>
      <ambientLight ref={ambientRef} intensity={0.08} />
      <directionalLight ref={lightRef} position={[5, 10, 5]} intensity={0.8} color="#4A90D9" />
      <pointLight position={[-5, 5, -5]} intensity={0.2} color="#00E5FF" />
      <pointLight position={[5, -5, 5]} intensity={0.15} color="#FF4FD8" />
    </>
  );
}

// ─── Camera ───────────────────────────────────────
function CameraRig() {
  const { camera } = useThree();
  const posRef = useRef({ x: 0, y: 2, z: 8 });
  const lookRef = useRef({ x: 0, y: 0, z: 0 });
  const scrollRef = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      scrollRef.current = docH > 0 ? window.scrollY / docH : 0;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const sf = scrollRef.current;
    const ch = Math.min(Math.floor(sf * 8), 7);

    const cams: { x: number; y: number; z: number }[] = [
      // Ch1: Frozen night - slow drift over dark landscape
      { x: Math.sin(t * 0.05) * 2, y: 4 + Math.sin(t * 0.08) * 0.5, z: 10 - sf * 10 },
      // Ch2: Aren in observatory - closer orbit
      { x: Math.sin(sf * Math.PI * 2 + t * 0.15) * 4, y: 2, z: Math.cos(sf * Math.PI * 2 + t * 0.15) * 6 },
      // Ch3: Flooded city - low angle near water
      { x: Math.sin(t * 0.1) * 3, y: 0.5 + Math.sin(t * 0.15) * 0.3, z: 7 },
      // Ch4: Above clouds - high altitude sweep
      { x: Math.sin(t * 0.08) * 5, y: 8 + Math.sin(t * 0.1) * 1, z: 8 },
      // Ch5: Underground chamber - tight dramatic
      { x: Math.sin(t * 0.2) * 2, y: 2, z: 5 + Math.sin(t * 0.15) * 1 },
      // Ch6: Core merging - dynamic pull-in
      { x: Math.sin(t * 0.3) * 1.5, y: 3 + Math.sin(t * 0.4) * 0.5, z: 6 - Math.sin(t * 0.2) * 1 },
      // Ch7: Sunrise - wide pull-back
      { x: Math.sin(t * 0.05) * 3, y: 5 + Math.sin(t * 0.08), z: 12 },
      // Ch8: Rising into space - ascending
      { x: Math.sin(t * 0.03) * 2, y: 3 + sf * 10, z: 8 + sf * 5 },
    ];
    const looks = [
      { x: 0, y: 0, z: -5 },
      { x: 0.5, y: 0, z: 0 },
      { x: 0, y: -0.5, z: -3 },
      { x: 0, y: 5, z: 0 },
      { x: 0, y: 2, z: -3 },
      { x: 0, y: 2, z: -5 },
      { x: 0, y: 3, z: 0 },
      { x: 0, y: 0, z: 0 },
    ];
    const c = cams[ch] || cams[0];
    const l = looks[ch] || looks[0];
    posRef.current.x += (c.x - posRef.current.x) * 0.03;
    posRef.current.y += (c.y - posRef.current.y) * 0.03;
    posRef.current.z += (c.z - posRef.current.z) * 0.03;
    lookRef.current.x += (l.x - lookRef.current.x) * 0.03;
    lookRef.current.y += (l.y - lookRef.current.y) * 0.03;
    lookRef.current.z += (l.z - lookRef.current.z) * 0.03;
    camera.position.set(posRef.current.x, posRef.current.y, posRef.current.z);
    camera.lookAt(lookRef.current.x, lookRef.current.y, lookRef.current.z);
  });
  return null;
}

// ─── Storm Flash (Chapter 5) ──────────────────────
function StormFlash() {
  const ref = useRef<THREE.PointLight>(null);
  useFrame(() => {
    if (!ref.current) return;
    ref.current.intensity += ((Math.random() > 0.98 ? 5 : 0) - ref.current.intensity) * 0.1;
  });
  return <pointLight ref={ref} position={[0, 10, 0]} intensity={0} color="#ffffff" distance={50} />;
}

// ─── Fog Points ───────────────────────────────────
function FogPoints() {
  const meshRef = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const count = 200;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (sRand(i * 3 + 5000) - 0.5) * 30;
      pos[i * 3 + 1] = sRand(i * 3 + 5001) * 5 - 2;
      pos[i * 3 + 2] = (sRand(i * 3 + 5002) - 0.5) * 30;
    }
    return pos;
  }, []);
  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.02;
    const pa = meshRef.current.geometry.attributes.position;
    const a = pa.array as Float32Array;
    for (let i = 0; i < 200; i++) a[i * 3 + 1] += Math.sin(state.clock.elapsedTime + i) * 0.002;
    pa.needsUpdate = true;
  });
  return (
    <points ref={meshRef}>
      <bufferGeometry><bufferAttribute attach="attributes-position" args={[positions, 3]} /></bufferGeometry>
      <pointsMaterial size={0.5} color="#6C63FF" transparent opacity={0.05} blending={THREE.AdditiveBlending} depthWrite={false} sizeAttenuation />
    </points>
  );
}

// ─── Aurora Borealis (Chapter 8) ──────────────────
function Aurora({ active }: { active: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
  }), []);
  useFrame((state) => {
    uniforms.uTime.value = state.clock.elapsedTime;
  });
  return (
    <mesh ref={meshRef} position={[0, 8, -20]} rotation={[0, 0, 0]} visible={active}>
      <planeGeometry args={[40, 10, 32, 16]} />
      <shaderMaterial transparent depthWrite={false} uniforms={uniforms} side={THREE.DoubleSide}
        vertexShader={`uniform float uTime; varying vec2 vUv; varying float vY;
          void main(){vUv=uv;vec3 p=position;p.y+=sin(position.x*0.5+uTime)*2.0;vY=p.y;gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.0);}`}
        fragmentShader={`varying vec2 vUv;varying float vY;
          void main(){float t=vY*0.1+0.5;vec3 c=mix(vec3(0,1,0.5),vec3(0.4,0.4,1),t);float a=smoothstep(0.0,0.3,t)*(1.0-smoothstep(0.7,1.0,t))*0.3;gl_FragColor=vec4(c,a);}`}
      />
    </mesh>
  );
}

// ─── Main Scene Component ─────────────────────────
function ScrollTracker() {
  const [, setTick] = useState(0);
  useEffect(() => {
    const onScroll = () => setTick((v) => v + 1);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return null;
}

export default function Scene3D() {
  const [chapter, setChapter] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      const sf = docH > 0 ? window.scrollY / docH : 0;
      setChapter(Math.min(Math.floor(sf * 8), 7));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isSnow = chapter === 0 || chapter === 1;
  const isRain = chapter === 2 || chapter === 4;
  const isWater = chapter === 2;
  const isClouds = chapter === 3;
  const isEclipse = chapter === 4;
  const isCore = chapter === 5 || chapter === 6;
  const isSunrise = chapter === 6;
  const isLegacy = chapter === 7;
  const isMerged = chapter >= 6;

  return (
    <div className="fixed inset-0 z-0">
      <Canvas
        camera={{ position: [0, 2, 8], fov: 60, near: 0.1, far: 1000 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
        style={{ background: "#000000" }}
      >
        <color attach="background" args={[CHAPTER_COLORS[chapter]?.fog || "#000008"]} />
        <fog attach="fog" args={[CHAPTER_COLORS[chapter]?.fog || "#000008", 10, 50]} />

        <CameraRig />
        <SceneLighting chapter={chapter} />
        <ScrollTracker />

        <GalaxyPoints />
        <StarFieldPoints />
        <NebulaPlane chapter={chapter} />

        <FloatingParticles count={300} color={CHAPTER_COLORS[chapter]?.primary || "#6C63FF"} spread={30} size={0.03} speed={0.2} opacity={0.8} />
        <FloatingParticles count={200} color="#00E5FF" spread={25} size={0.02} speed={0.15} opacity={0.5} />
        <FloatingParticles count={150} color="#FF4FD8" spread={20} size={0.025} speed={0.25} opacity={0.4} />

        <AnimatedTerrain chapter={chapter} />
        <FogPoints />
        <FloatingOctahedra chapter={chapter} />
        <SnowParticles active={isSnow} />
        <RainParticles active={isRain} />
        <WaterSurface active={isWater} />
        <FloatingIslands active={isClouds} />
        <EnergyRings active={isEclipse} />
        <HeliosCore active={isCore} merged={isMerged} />
        <SunriseLight active={isSunrise} />
        <GrowingTrees active={isLegacy} />
        <Aurora active={isLegacy} />
        {isEclipse && <StormFlash />}
        <ArenCharacter />
        <NovaCompanion />
      </Canvas>
    </div>
  );
}
