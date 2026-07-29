"use client";

import { useEffect, useRef } from "react";
import { useStore } from "@/store/useStore";
import { getAudioManager } from "@/hooks/useAudio";

export default function AudioProvider() {
  const musicVolume = useStore((s) => s.musicVolume);
  const isMuted = useStore((s) => s.isMuted);
  const currentChapter = useStore((s) => s.currentChapter);
  const setMusicPlaying = useStore((s) => s.setMusicPlaying);
  const audioRef = useRef(getAudioManager());
  const initedRef = useRef(false);

  // Handle user gesture to start audio context
  useEffect(() => {
    const handler = async () => {
      if (initedRef.current) return;
      initedRef.current = true;

      await audioRef.current.init();
      audioRef.current.start();
      audioRef.current.setVolume(isMuted ? 0 : musicVolume);
      setMusicPlaying(true);

      document.removeEventListener("click", handler);
      document.removeEventListener("keydown", handler);
      document.removeEventListener("touchstart", handler);
      document.removeEventListener("scroll", handler);
    };

    document.addEventListener("click", handler);
    document.addEventListener("keydown", handler);
    document.addEventListener("touchstart", handler);
    document.addEventListener("scroll", handler);

    return () => {
      document.removeEventListener("click", handler);
      document.removeEventListener("keydown", handler);
      document.removeEventListener("touchstart", handler);
      document.removeEventListener("scroll", handler);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Chapter transitions
  useEffect(() => {
    if (initedRef.current) {
      audioRef.current.transitionTo(currentChapter);
    }
  }, [currentChapter]);

  // Volume / mute
  useEffect(() => {
    if (initedRef.current) {
      audioRef.current.setVolume(isMuted ? 0 : musicVolume);
    }
  }, [musicVolume, isMuted]);

  return null;
}
