"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/store/useStore";

export default function Loader() {
  const { isLoading, loadingProgress, setLoadingProgress, setLoaded, setLoading, showIntro, setShowIntro } = useStore();
  const [exitComplete, setExitComplete] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const stars: { x: number; y: number; size: number; speed: number; opacity: number }[] = [];
    for (let i = 0; i < 300; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 0.5,
        speed: Math.random() * 2 + 0.5,
        opacity: Math.random(),
      });
    }

    let frame = 0;
    const animate = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const gradient = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        0,
        canvas.width / 2,
        canvas.height / 2,
        canvas.width * 0.5
      );
      gradient.addColorStop(0, "rgba(108, 99, 255, 0.15)");
      gradient.addColorStop(0.5, "rgba(0, 229, 255, 0.05)");
      gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      stars.forEach((star) => {
        star.opacity = 0.5 + Math.sin(frame * 0.02 + star.x * 0.01) * 0.5;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
        ctx.fill();

        star.y += star.speed;
        if (star.y > canvas.height) {
          star.y = 0;
          star.x = Math.random() * canvas.width;
        }
      });

      frame++;
      requestAnimationFrame(animate);
    };

    animate();
  }, []);

  useEffect(() => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 3 + 1;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setTimeout(() => {
          setLoadingProgress(100);
          setLoading(false);
          setLoaded(true);
          setTimeout(() => {
            setShowIntro(false);
          }, 2000);
        }, 500);
      }
      setLoadingProgress(Math.min(progress, 100));
    }, 50);

    return () => clearInterval(interval);
  }, [setLoadingProgress, setLoading, setLoaded, setShowIntro]);

  if (!isLoading && exitComplete) return null;

  return (
    <AnimatePresence
      onExitComplete={() => setExitComplete(true)}
    >
      {(isLoading || showIntro) && (
        <motion.div
          key="loader"
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black"
          exit={{ opacity: 0, scale: 1.5 }}
          transition={{ duration: 1.5, ease: [0.76, 0, 0.24, 1] }}
        >
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full"
          />

          <div className="relative z-10 flex flex-col items-center gap-8">
            {/* Animated Logo */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 1.5, ease: [0.34, 1.56, 0.64, 1] }}
              className="relative"
            >
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-2 border-[#6C63FF] flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#6C63FF]/30 to-[#00E5FF]/30 animate-pulse" />
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#6C63FF] via-[#00E5FF] to-[#FF4FD8] bg-clip-text text-transparent"
                >
                  S
                </motion.span>
                <motion.div
                  className="absolute inset-0 rounded-full border border-[#00E5FF]/50"
                  animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <motion.div
                  className="absolute inset-0 rounded-full border border-[#6C63FF]/30"
                  animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0, 0.3] }}
                  transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
                />
              </div>
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-2xl md:text-4xl font-light tracking-[0.3em] uppercase"
            >
              <span className="bg-gradient-to-r from-[#6C63FF] via-[#00E5FF] to-[#FF4FD8] bg-clip-text text-transparent">
                The Infinite Story
              </span>
            </motion.h1>

            {/* Progress Bar */}
            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="w-64 md:w-80"
            >
              <div className="h-[2px] bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-[#6C63FF] via-[#00E5FF] to-[#FF4FD8] rounded-full"
                  style={{ width: `${loadingProgress}%` }}
                  transition={{ duration: 0.1 }}
                />
              </div>
              <div className="mt-3 flex justify-between items-center">
                <span className="text-white/40 text-xs tracking-widest uppercase">Loading</span>
                <span className="text-white/60 text-sm font-mono">
                  {Math.round(loadingProgress)}%
                </span>
              </div>
            </motion.div>

            {/* Loading Text */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: 1.2 }}
              className="text-white/30 text-xs tracking-[0.5em] uppercase"
            >
              Preparing your journey
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
