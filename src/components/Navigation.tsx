"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/store/useStore";
import { chapters } from "@/data/chapters";
import { getAudioManager } from "@/hooks/useAudio";

export default function Navigation() {
  const { currentChapter, scrollProgress, musicVolume, isMuted, isMusicPlaying, setMusicVolume, setMuted, setMusicPlaying } = useStore();
  const [showNav, setShowNav] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [showChapterList, setShowChapterList] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setShowNav(currentScrollY < lastScrollY || currentScrollY < 100);
      setLastScrollY(currentScrollY);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const toggleMute = useCallback(() => {
    setMuted(!isMuted);
  }, [isMuted, setMuted]);

  const togglePlay = useCallback(() => {
    const audio = getAudioManager();
    if (isMusicPlaying) {
      audio.stop();
      setMusicPlaying(false);
    } else {
      audio.start();
      setMusicPlaying(true);
    }
  }, [isMusicPlaying, setMusicPlaying]);

  return (
    <>
      {/* Top progress bar */}
      <div className="fixed top-0 left-0 right-0 z-[100] h-[2px]">
        <motion.div
          className="h-full bg-gradient-to-r from-[#4A90D9] via-[#00BFFF] to-[#FFD93D]"
          style={{ width: `${scrollProgress * 100}%` }}
        />
      </div>

      {/* Nav bar */}
      <AnimatePresence>
        {showNav && (
          <motion.nav
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.76, 0, 0.24, 1] }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-[90] px-2"
          >
            <div className="flex items-center gap-2 md:gap-4 px-4 md:px-6 py-3 rounded-full bg-white/5 backdrop-blur-xl border border-white/10">
              <div className="text-sm md:text-base font-bold bg-gradient-to-r from-[#4A90D9] to-[#00BFFF] bg-clip-text text-transparent">
                STORY
              </div>
              <div className="w-px h-4 bg-white/10" />
              <button
                onClick={() => setShowChapterList(!showChapterList)}
                className="text-white/60 hover:text-white text-xs md:text-sm transition-colors flex items-center gap-2"
                data-cursor-hover
              >
                <span className="text-[#4A90D9]">
                  {String(currentChapter + 1).padStart(2, "0")}
                </span>
                <span className="hidden md:inline">/</span>
                <span className="hidden md:inline text-white/30">{chapters[currentChapter]?.title}</span>
              </button>
              <div className="w-px h-4 bg-white/10" />
              <button
                onClick={togglePlay}
                className="flex items-center gap-2 text-white/60 hover:text-white transition-colors"
                data-cursor-hover
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                  {isMusicPlaying ? (
                    <>
                      <rect x="6" y="4" width="4" height="16" rx="1" />
                      <rect x="14" y="4" width="4" height="16" rx="1" />
                    </>
                  ) : (
                    <polygon points="5 3 19 12 5 21 5 3" />
                  )}
                </svg>
              </button>
              <div className="w-px h-4 bg-white/10" />
              <button
                onClick={toggleMute}
                className="flex items-center gap-2 text-white/60 hover:text-white transition-colors"
                data-cursor-hover
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  {isMuted ? (
                    <>
                      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                      <line x1="23" y1="9" x2="17" y2="15" />
                      <line x1="17" y1="9" x2="23" y2="15" />
                    </>
                  ) : (
                    <>
                      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                      <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
                    </>
                  )}
                </svg>
              </button>
              <div className="hidden md:block">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={isMuted ? 0 : musicVolume}
                  onChange={(e) => {
                    const vol = parseFloat(e.target.value);
                    setMusicVolume(vol);
                    if (vol > 0 && isMuted) setMuted(false);
                  }}
                  className="w-16 h-1 appearance-none bg-white/10 rounded-full cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2.5 [&::-webkit-slider-thumb]:h-2.5 [&::-webkit-slider-thumb]:bg-[#4A90D9] [&::-webkit-slider-thumb]:rounded-full"
                  data-cursor-hover
                />
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>

      {/* Chapter dropdown */}
      <AnimatePresence>
        {showChapterList && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed top-16 left-1/2 -translate-x-1/2 z-[90] w-80 max-h-[70vh] overflow-y-auto p-4 rounded-2xl bg-black/80 backdrop-blur-xl border border-white/10"
          >
            {chapters.map((ch, i) => (
              <button
                key={ch.id}
                onClick={() => {
                  const section = document.getElementById(`chapter-${ch.id}`);
                  section?.scrollIntoView({ behavior: "smooth" });
                  setShowChapterList(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                  i === currentChapter ? "bg-white/10" : "hover:bg-white/5"
                }`}
                data-cursor-hover
              >
                <span
                  className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0"
                  style={{
                    background: i === currentChapter ? ch.color : "transparent",
                    border: `1px solid ${i === currentChapter ? ch.color : "rgba(255,255,255,0.1)"}`,
                    color: i === currentChapter ? "white" : "rgba(255,255,255,0.4)",
                  }}
                >
                  {ch.id}
                </span>
                <div className="text-left">
                  <div className={`text-xs font-medium ${i === currentChapter ? "text-white" : "text-white/50"}`}>
                    {ch.title}
                  </div>
                  <div className="text-[10px] text-white/25">{ch.subtitle}</div>
                </div>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Side indicators */}
      <div className="fixed right-6 top-1/2 -translate-y-1/2 z-[80] hidden lg:flex flex-col gap-2">
        {chapters.map((ch, i) => (
          <button
            key={ch.id}
            onClick={() => {
              const section = document.getElementById(`chapter-${ch.id}`);
              section?.scrollIntoView({ behavior: "smooth" });
            }}
            className="group flex items-center gap-2"
            data-cursor-hover
          >
            <span className="text-[9px] text-white/0 group-hover:text-white/60 transition-colors duration-300 uppercase tracking-wider max-w-[100px] truncate">
              {ch.title}
            </span>
            <div
              className={`transition-all duration-300 ${
                i === currentChapter ? "w-6 h-1.5" : "w-3 h-1 group-hover:w-4 group-hover:h-1"
              } rounded-full`}
              style={{
                background:
                  i === currentChapter
                    ? `linear-gradient(90deg, ${ch.color}, ${ch.secondaryColor})`
                    : "rgba(255,255,255,0.15)",
              }}
            />
          </button>
        ))}
      </div>

      {/* Scroll hint */}
      {scrollProgress < 0.02 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[80] flex flex-col items-center gap-2"
        >
          <span className="text-[10px] text-white/30 tracking-[0.3em] uppercase">
            Scroll to begin the journey
          </span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-5 h-8 rounded-full border border-white/20 flex items-start justify-center pt-1.5"
          >
            <div className="w-1 h-1.5 rounded-full bg-[#4A90D9]" />
          </motion.div>
        </motion.div>
      )}
    </>
  );
}
