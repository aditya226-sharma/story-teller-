"use client";

import { useEffect, useRef, useState } from "react";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);
  const rippleRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const posRef = useRef({ x: 0, y: 0 });
  const trailPosRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const isTouchDevice = "ontouchstart" in window;
    if (isTouchDevice) return;

    const cursor = cursorRef.current;
    const trail = trailRef.current;
    const glow = glowRef.current;

    const onMouseMove = (e: MouseEvent) => {
      posRef.current = { x: e.clientX, y: e.clientY };
      if (cursor) {
        cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      }
      if (glow) {
        glow.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      }
    };

    const onMouseDown = (e: MouseEvent) => {
      setIsClicking(true);
      if (rippleRef.current) {
        const ripple = rippleRef.current;
        ripple.style.left = `${e.clientX}px`;
        ripple.style.top = `${e.clientY}px`;
        ripple.classList.remove("cursor-ripple-animate");
        void ripple.offsetWidth;
        ripple.classList.add("cursor-ripple-animate");
      }
    };

    const onMouseUp = () => setIsClicking(false);

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("a, button, [data-cursor-hover], input, select, textarea")) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    let animFrame: number;
    const animateTrail = () => {
      trailPosRef.current.x += (posRef.current.x - trailPosRef.current.x) * 0.15;
      trailPosRef.current.y += (posRef.current.y - trailPosRef.current.y) * 0.15;
      if (trail) {
        trail.style.transform = `translate(${trailPosRef.current.x}px, ${trailPosRef.current.y}px)`;
      }
      animFrame = requestAnimationFrame(animateTrail);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("mouseover", onMouseOver);
    animFrame = requestAnimationFrame(animateTrail);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("mouseover", onMouseOver);
      cancelAnimationFrame(animFrame);
    };
  }, []);

  const isTouchDevice =
    typeof window !== "undefined" && "ontouchstart" in window;
  if (isTouchDevice) return null;

  return (
    <>
      {/* Main Cursor */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 z-[9999] pointer-events-none"
        style={{ willChange: "transform" }}
      >
        <div
          className={`relative -translate-x-1/2 -translate-y-1/2 transition-all duration-200 ${
            isClicking ? "scale-50" : isHovering ? "scale-150" : "scale-100"
          }`}
        >
          <div
            className={`w-3 h-3 rounded-full border-2 transition-all duration-200 ${
              isHovering
                ? "border-[#00E5FF] bg-[#00E5FF]/20"
                : "border-[#6C63FF] bg-[#6C63FF]/10"
            }`}
          />
        </div>
      </div>

      {/* Trail */}
      <div
        ref={trailRef}
        className="fixed top-0 left-0 z-[9998] pointer-events-none"
        style={{ willChange: "transform" }}
      >
        <div
          className={`-translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-300 ${
            isHovering
              ? "w-12 h-12 bg-[#00E5FF]/10"
              : "w-8 h-8 bg-[#6C63FF]/5"
          }`}
        />
      </div>

      {/* Glow */}
      <div
        ref={glowRef}
        className="fixed top-0 left-0 z-[9997] pointer-events-none"
        style={{ willChange: "transform" }}
      >
        <div className="-translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full bg-gradient-to-r from-[#6C63FF]/10 to-[#00E5FF]/10 blur-2xl" />
      </div>

      {/* Ripple */}
      <div
        ref={rippleRef}
        className="fixed z-[9996] pointer-events-none -translate-x-1/2 -translate-y-1/2"
      >
        <div className="w-0 h-0 rounded-full border border-[#6C63FF]/50 opacity-0" />
      </div>

      <style jsx>{`
        .cursor-ripple-animate {
          animation: ripple-expand 0.6s ease-out forwards;
        }
        @keyframes ripple-expand {
          0% {
            width: 0;
            height: 0;
            opacity: 0.8;
            border-width: 2px;
          }
          100% {
            width: 80px;
            height: 80px;
            opacity: 0;
            border-width: 0.5px;
          }
        }
      `}</style>
    </>
  );
}
