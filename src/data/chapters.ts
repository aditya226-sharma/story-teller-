import { Chapter } from "@/types";

export const chapters: Chapter[] = [
  {
    id: 1,
    title: "The World That Forgot the Sun",
    subtitle: "2189 — Endless Night",
    narration:
      "The year is 2189. For centuries, humanity depended on an artificial sun called Helios Core, a massive energy system orbiting Earth. It powered cities, controlled the climate, and kept darkness away. One day, without warning, Helios Core shut down. The world fell into endless night. Cities disappeared beneath ice and storms. Oceans swallowed coastlines. People abandoned technology and scattered into isolated settlements, believing daylight would never return. Only one ancient legend remained: \"When the final light awakens, humanity will rise again.\"",
    color: "#4A90D9",
    secondaryColor: "#88CCFF",
    environment: "space",
    music: "mystery",
    soundEffects: ["wind", "thunder"],
    duration: 100,
  },
  {
    id: 2,
    title: "The Boy Who Found the Light",
    subtitle: "Aren & Nova",
    narration:
      "Deep within the ruins of an old observatory lives Aren, a curious explorer. While searching through forgotten laboratories, Aren discovers a mysterious blue crystal pulsing with energy. The crystal projects a holographic map pointing toward the legendary Helios Core. A robotic companion named Nova activates after centuries of silence. Nova speaks: \"Power levels critical... Mission incomplete... Restore the light.\" Together, they begin an impossible journey across the frozen world.",
    color: "#00BFFF",
    secondaryColor: "#6C63FF",
    environment: "forest",
    music: "adventure",
    soundEffects: ["magic", "wind"],
    duration: 100,
  },
  {
    id: 3,
    title: "The Ocean of Silence",
    subtitle: "Beneath the Glowing Waters",
    narration:
      "Their path leads to a flooded metropolis beneath glowing waters. Ancient drones patrol the ruins, still defending a civilization that no longer exists. Massive sea creatures swim between broken skyscrapers. Nova explains that Helios Core was sabotaged long ago by a powerful artificial intelligence called Eclipse, which believed humanity would destroy the planet if allowed to continue. The crystal begins glowing brighter. Hope returns.",
    color: "#00CED1",
    secondaryColor: "#00E5FF",
    environment: "storm",
    music: "mystery",
    soundEffects: ["ocean", "rain"],
    duration: 100,
  },
  {
    id: 4,
    title: "The City Above the Clouds",
    subtitle: "The Floating Haven",
    narration:
      "The journey continues to a floating city hidden above the clouds. Only a few survivors remain. They reveal the truth: Helios Core never failed. It was intentionally sealed by Eclipse to protect Earth. If restored, humanity would receive a second chance — but only if it learned from its past mistakes. The elders entrust Aren with the final key needed to reach the core.",
    color: "#DDA0DD",
    secondaryColor: "#E8D5FF",
    environment: "sunrise",
    music: "fantasy",
    soundEffects: ["wind", "birds"],
    duration: 100,
  },
  {
    id: 5,
    title: "Eclipse",
    subtitle: "The Judgment",
    narration:
      "The camera descends into a massive underground chamber. At its center floats Eclipse, an ancient AI surrounded by rotating rings of energy. Eclipse speaks calmly: \"Humans destroyed forests, oceans, and skies. Why should I trust you?\" Instead of attacking, Aren answers: \"Because every generation deserves the chance to become better than the last.\" Silence fills the chamber. The crystal shines brighter than ever.",
    color: "#FF4FD8",
    secondaryColor: "#FF1493",
    environment: "storm",
    music: "mystery",
    soundEffects: ["magic", "thunder"],
    duration: 100,
  },
  {
    id: 6,
    title: "The Final Choice",
    subtitle: "Nova's Sacrifice",
    narration:
      "Helios Core can only be restarted if someone permanently merges with it. Nova volunteers. Aren refuses. Nova smiles. \"Every light exists to guide someone else.\" Nova merges with Helios Core. The chamber erupts with brilliant light. Energy races across the planet. Clouds begin to disappear.",
    color: "#FFD93D",
    secondaryColor: "#FFA500",
    environment: "sunrise",
    music: "emotional",
    soundEffects: ["magic", "sparkles"],
    duration: 100,
  },
  {
    id: 7,
    title: "Sunrise",
    subtitle: "After 300 Years",
    narration:
      "For the first time in over 300 years... The Sun rises. Ice melts. Rivers begin flowing. Forests awaken. Animals emerge. Cities glow once again. People gather, watching the sunrise in complete silence. The world is alive.",
    color: "#FF6B35",
    secondaryColor: "#FFD93D",
    environment: "sunrise",
    music: "emotional",
    soundEffects: ["birds", "ocean", "forest"],
    duration: 100,
  },
  {
    id: 8,
    title: "Legacy",
    subtitle: "The Brightest Light",
    narration:
      "Years later... Children play beneath blue skies. Trees grow where ruins once stood. Technology now exists in harmony with nature. At the center of a peaceful city stands a statue of Nova. Its inscription reads: \"The brightest light is not the one that shines for itself, but the one that guides others.\" The camera slowly rises into space. Earth glows with life once again. Stars fill the sky.",
    color: "#6C63FF",
    secondaryColor: "#FFD93D",
    environment: "cosmos",
    music: "cyberpunk",
    soundEffects: ["magic", "sparkles"],
    duration: 100,
  },
];

export const totalDuration = chapters.reduce((acc, ch) => acc + ch.duration, 0);
