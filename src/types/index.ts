export interface Chapter {
  id: number;
  title: string;
  subtitle: string;
  narration: string;
  color: string;
  secondaryColor: string;
  environment: "space" | "forest" | "storm" | "sunrise" | "cosmos";
  music: string;
  soundEffects: string[];
  duration: number;
}

export interface StoryState {
  isLoaded: boolean;
  currentChapter: number;
  scrollProgress: number;
  isMusicPlaying: boolean;
  musicVolume: number;
  isMuted: boolean;
  isReducedMotion: boolean;
  fps: number;
  isLoadingComplete: boolean;
  showIntro: boolean;
  showEnding: boolean;
}

export interface CursorState {
  position: { x: number; y: number };
  isVisible: boolean;
  isHovering: boolean;
  isClicking: boolean;
}
