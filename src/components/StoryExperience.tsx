"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef } from "react";
import { useStore } from "@/store/useStore";
import { useScrollProgress, useFPS } from "@/hooks/useScrollProgress";
import Loader from "@/components/Loader";
import CustomCursor from "@/components/CustomCursor";
import Navigation from "@/components/Navigation";
import IntroSection from "@/components/IntroSection";
import StoryChapters from "@/components/StoryChapters";
import EndingScene from "@/components/EndingScene";
import FPSCounter from "@/components/FPSCounter";

import AudioProvider from "@/components/AudioProvider";

const Scene3D = dynamic(() => import("@/components/Scene3D"), { ssr: false });

export default function StoryExperience() {
  const isLoaded = useStore((s) => s.isLoaded);
  const containerRef = useRef<HTMLDivElement>(null);

  useScrollProgress();
  useFPS();

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mediaQuery.matches) {
      useStore.getState().setReducedMotion(true);
    }
  }, []);

  return (
    <div className="relative bg-black min-h-screen overflow-x-hidden">
      <Loader />
      <Scene3D />
      <AudioProvider />
      <CustomCursor />
      {isLoaded && <Navigation />}
      <div className="relative z-10" ref={containerRef}>
        <IntroSection />
        <StoryChapters />
        <EndingScene />
      </div>
      <FPSCounter />
      <div className="fixed inset-0 z-[50] pointer-events-none opacity-[0.03] mix-blend-overlay">
        <div className="w-full h-full bg-noise" />
      </div>
      <div
        className="fixed inset-0 z-[49] pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(255,255,255,0.03) 1px, rgba(255,255,255,0.03) 2px)",
          backgroundSize: "100% 3px",
        }}
      />
    </div>
  );
}
