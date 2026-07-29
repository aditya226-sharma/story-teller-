"use client";

import { useEffect, useRef } from "react";
import { useStore } from "@/store/useStore";

export function useScrollProgress() {
  const setScrollProgress = useStore((s) => s.setScrollProgress);
  const setCurrentChapter = useStore((s) => s.setCurrentChapter);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = Math.min(scrollTop / docHeight, 1);
      setScrollProgress(progress);

      const chapterIndex = Math.min(Math.floor(progress * 8), 7);
      setCurrentChapter(chapterIndex);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [setScrollProgress, setCurrentChapter]);
}

export function useFPS() {
  const setFps = useStore((s) => s.setFps);
  const frameRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const countRef = useRef(0);

  useEffect(() => {
    lastTimeRef.current = performance.now();
    let isActive = true;

    const measure = () => {
      if (!isActive) return;
      countRef.current++;
      const now = performance.now();
      if (now - lastTimeRef.current >= 1000) {
        setFps(countRef.current);
        countRef.current = 0;
        lastTimeRef.current = now;
      }
      frameRef.current = requestAnimationFrame(measure);
    };

    frameRef.current = requestAnimationFrame(measure);
    return () => {
      isActive = false;
      cancelAnimationFrame(frameRef.current);
    };
  }, [setFps]);
}
