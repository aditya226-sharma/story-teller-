"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";

interface TextRevealProps {
  text: string;
  className?: string;
  delay?: number;
  speed?: "slow" | "normal" | "fast";
}

export function SplitText({
  text,
  className = "",
  delay = 0,
  speed = "normal",
}: TextRevealProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: "-10%", once: true });
  const speedMultiplier = speed === "slow" ? 0.08 : speed === "fast" ? 0.02 : 0.04;

  return (
    <span ref={ref} className={`inline-flex flex-wrap ${className}`}>
      {text.split("").map((char, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{
            duration: 0.4,
            delay: delay + i * speedMultiplier,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
          className="inline-block"
          style={{ whiteSpace: char === " " ? "pre" : "normal" }}
        >
          {char}
        </motion.span>
      ))}
    </span>
  );
}

interface GlowTextProps {
  text: string;
  color?: string;
  className?: string;
}

export function GlowText({
  text,
  color = "#6C63FF",
  className = "",
}: GlowTextProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: "-10%", once: true });

  return (
    <motion.span
      ref={ref}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
      className={`inline-block ${className}`}
      style={{
        textShadow: `0 0 20px ${color}, 0 0 40px ${color}80, 0 0 80px ${color}40`,
        color,
      }}
    >
      {text}
    </motion.span>
  );
}

interface TypewriterProps {
  text: string;
  className?: string;
  speed?: number;
}

export function TypewriterText({
  text,
  className = "",
  speed = 50,
}: TypewriterProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: "-10%", once: true });
  const [displayText, setDisplayText] = useState("");

  useEffect(() => {
    if (!isInView) return;
    let i = 0;
    const interval = setInterval(() => {
      if (i <= text.length) {
        setDisplayText(text.slice(0, i));
        i++;
      } else {
        clearInterval(interval);
      }
    }, speed);
    return () => clearInterval(interval);
  }, [isInView, text, speed]);

  return (
    <span ref={ref} className={className}>
      {displayText}
      {displayText.length < text.length && isInView && (
        <span className="animate-pulse text-[#6C63FF]">|</span>
      )}
    </span>
  );
}

interface GradientTextProps {
  text: string;
  colors?: string[];
  className?: string;
}

export function GradientText({
  text,
  colors = ["#6C63FF", "#00E5FF", "#FF4FD8"],
  className = "",
}: GradientTextProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: "-10%", once: true });

  return (
    <motion.span
      ref={ref}
      initial={{ opacity: 0, filter: "blur(10px)" }}
      animate={isInView ? { opacity: 1, filter: "blur(0px)" } : {}}
      transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
      className={`inline-block bg-gradient-to-r bg-clip-text text-transparent ${className}`}
      style={{
        backgroundImage: `linear-gradient(90deg, ${colors.join(", ")})`,
        backgroundSize: "200% 100%",
        animation: isInView ? "gradient-shift 3s ease infinite" : "none",
      }}
    >
      {text}
      <style jsx>{`
        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
      `}</style>
    </motion.span>
  );
}
