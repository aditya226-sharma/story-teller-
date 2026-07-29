"use client";

import dynamic from "next/dynamic";

const StoryExperience = dynamic(() => import("@/components/StoryExperience"), {
  ssr: false,
  loading: () => (
    <div className="fixed inset-0 bg-black flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-[#6C63FF] border-t-transparent rounded-full animate-spin" />
    </div>
  ),
});

export default function Home() {
  return <StoryExperience />;
}
