"use client";

import { create } from "zustand";

interface AppStore {
  isLoading: boolean;
  loadingProgress: number;
  isLoaded: boolean;
  currentChapter: number;
  scrollProgress: number;
  isMusicPlaying: boolean;
  musicVolume: number;
  isMuted: boolean;
  isReducedMotion: boolean;
  showIntro: boolean;
  showEnding: boolean;
  fps: number;
  setLoading: (loading: boolean) => void;
  setLoadingProgress: (progress: number) => void;
  setLoaded: (loaded: boolean) => void;
  setCurrentChapter: (chapter: number) => void;
  setScrollProgress: (progress: number) => void;
  setMusicPlaying: (playing: boolean) => void;
  setMusicVolume: (volume: number) => void;
  setMuted: (muted: boolean) => void;
  setReducedMotion: (reduced: boolean) => void;
  setShowIntro: (show: boolean) => void;
  setShowEnding: (show: boolean) => void;
  setFps: (fps: number) => void;
}

export const useStore = create<AppStore>((set) => ({
  isLoading: true,
  loadingProgress: 0,
  isLoaded: false,
  currentChapter: 0,
  scrollProgress: 0,
  isMusicPlaying: false,
  musicVolume: 0.3,
  isMuted: false,
  isReducedMotion: false,
  showIntro: true,
  showEnding: false,
  fps: 60,
  setLoading: (loading) => set({ isLoading: loading }),
  setLoadingProgress: (progress) => set({ loadingProgress: progress }),
  setLoaded: (loaded) => set({ isLoaded: loaded }),
  setCurrentChapter: (chapter) => set({ currentChapter: chapter }),
  setScrollProgress: (progress) => set({ scrollProgress: progress }),
  setMusicPlaying: (playing) => set({ isMusicPlaying: playing }),
  setMusicVolume: (volume) => set({ musicVolume: volume }),
  setMuted: (muted) => set({ isMuted: muted }),
  setReducedMotion: (reduced) => set({ isReducedMotion: reduced }),
  setShowIntro: (show) => set({ showIntro: show }),
  setShowEnding: (show) => set({ showEnding: show }),
  setFps: (fps) => set({ fps: fps }),
}));
