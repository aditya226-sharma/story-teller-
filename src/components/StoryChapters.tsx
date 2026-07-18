"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { chapters } from "@/data/chapters";

export default function StoryChapters() {
  return (
    <div className="relative z-10">
      {chapters.map((chapter) => (
        <ChapterSection key={chapter.id} chapter={chapter} />
      ))}
    </div>
  );
}

function ChapterSection({
  chapter,
}: {
  chapter: (typeof chapters)[0];
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: "-20% 0px -20% 0px", once: false });

  return (
    <section
      id={`chapter-${chapter.id}`}
      ref={ref}
      className="relative min-h-screen flex items-center justify-center px-4 md:px-8"
    >
      {/* Chapter Number */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={isInView ? { opacity: 0.08, scale: 1 } : { opacity: 0, scale: 0.5 }}
        transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none"
      >
        <span
          className="text-[15vw] md:text-[10vw] font-black leading-none"
          style={{
            WebkitTextStroke: `1px ${chapter.color}`,
            WebkitTextFillColor: "transparent",
          }}
        >
          {String(chapter.id).padStart(2, "0")}
        </span>
      </motion.div>

      <div className="relative max-w-4xl w-full">
        {/* Subtitle */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.76, 0, 0.24, 1] }}
          className="mb-4"
        >
          <span
            className="text-xs md:text-sm tracking-[0.5em] uppercase font-medium"
            style={{ color: chapter.color }}
          >
            Chapter {chapter.id}
          </span>
        </motion.div>

        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 1, delay: 0.4, ease: [0.76, 0, 0.24, 1] }}
          className="text-4xl md:text-6xl lg:text-8xl font-bold mb-6 leading-tight"
        >
          <AnimatedText text={chapter.title} color={chapter.color} isInView={isInView} />
        </motion.h2>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: [0.76, 0, 0.24, 1] }}
          className="w-24 h-[2px] mb-6 origin-left"
          style={{
            background: `linear-gradient(90deg, ${chapter.color}, ${chapter.secondaryColor})`,
          }}
        />

        {/* Subtitle text */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 0.6, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 0.7, ease: [0.76, 0, 0.24, 1] }}
          className="text-lg md:text-xl font-medium mb-8"
          style={{ color: chapter.secondaryColor }}
        >
          {chapter.subtitle}
        </motion.p>

        {/* Narration */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 1, delay: 0.9, ease: [0.76, 0, 0.24, 1] }}
          className="text-base md:text-lg text-white/50 leading-relaxed max-w-2xl"
        >
          {chapter.narration}
        </motion.p>

        {/* Glow orb */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 0.12 } : { opacity: 0 }}
          transition={{ duration: 1.5, delay: 0.5 }}
          className="absolute -right-8 md:-right-20 top-1/2 -translate-y-1/2 pointer-events-none"
        >
          <div
            className="w-32 h-32 md:w-48 md:h-48 rounded-full blur-3xl"
            style={{ background: chapter.color }}
          />
        </motion.div>
      </div>
    </section>
  );
}

function AnimatedText({
  text,
  color,
  isInView,
}: {
  text: string;
  color: string;
  isInView: boolean;
}) {
  const words = text.split(" ");
  return (
    <span className="inline-flex flex-wrap gap-x-3 md:gap-x-4">
      {words.map((word, wi) => (
        <span key={wi} className="inline-flex">
          {word.split("").map((char, ci) => (
            <motion.span
              key={ci}
              initial={{ opacity: 0, y: 50, rotateX: -90 }}
              animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : { opacity: 0, y: 50, rotateX: -90 }}
              transition={{
                duration: 0.6,
                delay: 0.4 + wi * 0.08 + ci * 0.025,
                ease: [0.76, 0, 0.24, 1],
              }}
              className="inline-block"
              style={{ color: "white", textShadow: `0 0 40px ${color}40, 0 0 80px ${color}20` }}
            >
              {char}
            </motion.span>
          ))}
        </span>
      ))}
    </span>
  );
}
