"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

export default function IntroSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: "-10%", once: false });

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex flex-col items-center justify-center px-4 text-center"
    >
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
        transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
        className="mb-8"
      >
        <h1 className="text-5xl md:text-7xl lg:text-9xl font-black tracking-tight">
          <span className="block bg-gradient-to-r from-[#4A90D9] via-[#00BFFF] to-[#6C63FF] bg-clip-text text-transparent">
            THE WORLD
          </span>
          <span className="block text-white mt-2">
            THAT FORGOT
          </span>
          <span className="block bg-gradient-to-r from-[#FFD93D] via-[#FF6B35] to-[#FF4FD8] bg-clip-text text-transparent mt-2">
            THE SUN
          </span>
        </h1>
      </motion.div>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 0.5, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.8, delay: 0.5, ease: [0.76, 0, 0.24, 1] }}
        className="text-sm md:text-base text-white/40 tracking-[0.5em] uppercase mb-6"
      >
        An Interactive Cinematic Experience
      </motion.p>

      <motion.div
        initial={{ scaleX: 0 }}
        animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
        transition={{ duration: 1, delay: 0.8, ease: [0.76, 0, 0.24, 1] }}
        className="w-32 h-px bg-gradient-to-r from-transparent via-[#4A90D9] to-transparent mb-6"
      />

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 0.35, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.8, delay: 1, ease: [0.76, 0, 0.24, 1] }}
        className="text-sm md:text-base text-white/30 max-w-md leading-relaxed"
      >
        The year is 2189. Helios Core has fallen. Humanity scatters into endless night.
        Only one legend remains: &quot;When the final light awakens, humanity will rise again.&quot;
      </motion.p>

      {/* Floating orbs */}
      <motion.div
        animate={{ y: [-10, 10, -10], x: [-5, 5, -5] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 left-1/4 w-2 h-2 rounded-full bg-[#4A90D9]/40 blur-sm"
      />
      <motion.div
        animate={{ y: [10, -10, 10], x: [5, -5, 5] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-1/3 right-1/4 w-3 h-3 rounded-full bg-[#00BFFF]/30 blur-sm"
      />
      <motion.div
        animate={{ y: [-15, 15, -15], x: [-8, 8, -8] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/3 right-1/3 w-1.5 h-1.5 rounded-full bg-[#FFD93D]/35 blur-sm"
      />
    </section>
  );
}
