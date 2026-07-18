"use client";

import { useStore } from "@/store/useStore";

export default function FPSCounter() {
  const fps = useStore((s) => s.fps);

  return (
    <div className="fixed bottom-4 left-4 z-[80] px-3 py-1.5 rounded-lg bg-black/50 backdrop-blur-sm border border-white/5 font-mono text-[10px]">
      <span className={fps >= 55 ? "text-green-400" : fps >= 30 ? "text-yellow-400" : "text-red-400"}>
        {fps} FPS
      </span>
    </div>
  );
}
