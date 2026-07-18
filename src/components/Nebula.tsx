"use client";

import { useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useStore } from "@/store/useStore";
import * as THREE from "three";

const TARGET_COLORS: [string, string][] = [
  ["#6C63FF", "#00E5FF"],
  ["#00E5FF", "#00FF88"],
  ["#FF4FD8", "#FF6B6B"],
  ["#FFD93D", "#FF4FD8"],
  ["#6C63FF", "#FFD93D"],
];

// Three.js shader uniforms are designed to be mutated imperatively
/* eslint-disable react-hooks/immutability */

export default function Nebula() {
  const meshRef = useRef<THREE.Mesh>(null);
  const currentChapter = useStore((s) => s.currentChapter);
  const chapterRef = useRef(currentChapter);

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uColor1: { value: new THREE.Color("#6C63FF") },
    uColor2: { value: new THREE.Color("#00E5FF") },
    uOpacity: { value: 0.3 },
  }), []);

  useEffect(() => {
    chapterRef.current = currentChapter;
    const target = TARGET_COLORS[currentChapter] || TARGET_COLORS[0];
    uniforms.uColor1.value.set(target[0]);
    uniforms.uColor2.value.set(target[1]);
  }, [currentChapter, uniforms]);

  useFrame((state) => {
    uniforms.uTime.value = state.clock.elapsedTime;
    uniforms.uColor1.value.lerp(new THREE.Color("#ffffff"), 0.001);
    uniforms.uColor2.value.lerp(new THREE.Color("#ffffff"), 0.001);
  });

  return (
    <mesh ref={meshRef} position={[0, 0, -10]}>
      <planeGeometry args={[40, 40]} />
      <shaderMaterial
        transparent
        depthWrite={false}
        uniforms={uniforms}
        vertexShader={`
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          uniform float uTime;
          uniform vec3 uColor1;
          uniform vec3 uColor2;
          uniform float uOpacity;
          varying vec2 vUv;
          float noise(vec2 st) {
            return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
          }
          float fbm(vec2 st) {
            float value = 0.0;
            float amplitude = 0.5;
            for (int i = 0; i < 5; i++) {
              value += amplitude * noise(st);
              st *= 2.0;
              amplitude *= 0.5;
            }
            return value;
          }
          void main() {
            vec2 uv = vUv;
            float n = fbm(uv * 3.0 + uTime * 0.05);
            float n2 = fbm(uv * 5.0 - uTime * 0.08);
            vec3 color = mix(uColor1, uColor2, n);
            color += vec3(n2 * 0.15);
            float alpha = smoothstep(0.2, 0.7, n) * uOpacity;
            gl_FragColor = vec4(color, alpha);
          }
        `}
      />
    </mesh>
  );
}
