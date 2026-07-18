"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

export default function EndingScene() {
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: "-20%", once: false });

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex flex-col items-center justify-center px-4 text-center"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#FFD93D]/5 to-black pointer-events-none" />

      <div className="relative z-10 max-w-3xl">
        {/* Star burst */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
          transition={{ duration: 2, ease: [0.76, 0, 0.24, 1] }}
          className="absolute -top-20 left-1/2 -translate-x-1/2 pointer-events-none"
        >
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0 }}
              animate={isInView ? { opacity: [0, 1, 0], scale: [0, 1, 0] } : {}}
              transition={{ duration: 2, delay: i * 0.1, repeat: Infinity, repeatDelay: 3 }}
              className="absolute w-1 h-1 rounded-full bg-[#FFD93D]"
              style={{
                left: `${Math.cos((i / 20) * Math.PI * 2) * 60}px`,
                top: `${Math.sin((i / 20) * Math.PI * 2) * 60}px`,
              }}
            />
          ))}
        </motion.div>

        {/* Credits heading */}
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
          className="text-4xl md:text-6xl lg:text-8xl font-black mb-8"
        >
          <span className="bg-gradient-to-r from-[#FFD93D] via-[#FF6B35] to-[#FF4FD8] bg-clip-text text-transparent">
            Credits
          </span>
        </motion.h2>

        {/* Nova's quote */}
        <motion.blockquote
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-lg md:text-xl text-white/60 mb-4 italic max-w-lg mx-auto"
        >
          &quot;The brightest light is not the one that shines for itself, but the one that guides others.&quot;
        </motion.blockquote>

        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 0.3 } : { opacity: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-xs text-white/20 tracking-widest uppercase mb-12"
        >
          — Nova
        </motion.p>

        {/* Credits */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="space-y-4 mb-12"
        >
          <div className="flex flex-col gap-1">
            <span className="text-[10px] text-white/20 tracking-[0.5em] uppercase">Story</span>
            <span className="text-sm text-white/60">The World That Forgot the Sun</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[10px] text-white/20 tracking-[0.5em] uppercase">Characters</span>
            <span className="text-sm text-white/60">Aren — The Explorer &bull; Nova — The Guide</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[10px] text-white/20 tracking-[0.5em] uppercase">Technology</span>
            <span className="text-sm text-white/60">Next.js / Three.js / React Three Fiber / GSAP</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[10px] text-white/20 tracking-[0.5em] uppercase">Inspired By</span>
            <span className="text-sm text-white/60">The infinite cosmos &bull; Hope that never dies</span>
          </div>
        </motion.div>

        {/* Final message */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
          transition={{ duration: 1.5, delay: 1 }}
          className="mb-16"
        >
          <p className="text-base md:text-lg text-white/40 italic">
            &quot;Every ending is the beginning of another story.&quot;
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="group relative px-8 py-3 rounded-full overflow-hidden"
            data-cursor-hover
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#FFD93D] to-[#FF6B35] opacity-20 group-hover:opacity-40 transition-opacity" />
            <div className="absolute inset-0 border border-[#FFD93D]/30 group-hover:border-[#FFD93D]/60 rounded-full transition-colors" />
            <span className="relative text-sm text-white/80 group-hover:text-white transition-colors flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="1 4 1 10 7 10" />
                <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
              </svg>
              Replay Story
            </span>
          </button>

          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: "The World That Forgot the Sun",
                  text: "Experience this cinematic storytelling journey about hope, sacrifice, and sunrise.",
                  url: window.location.href,
                });
              }
            }}
            className="group relative px-8 py-3 rounded-full overflow-hidden"
            data-cursor-hover
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#6C63FF] to-[#00BFFF] opacity-20 group-hover:opacity-40 transition-opacity" />
            <div className="absolute inset-0 border border-[#6C63FF]/30 group-hover:border-[#6C63FF]/60 rounded-full transition-colors" />
            <span className="relative text-sm text-white/80 group-hover:text-white transition-colors flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="18" cy="5" r="3" />
                <circle cx="6" cy="12" r="3" />
                <circle cx="18" cy="19" r="3" />
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
              </svg>
              Share Story
            </span>
          </button>
        </motion.div>
      </div>
    </section>
  );
}
