import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "The Infinite Story | A Cinematic 3D Experience",
  description:
    "An immersive interactive storytelling experience featuring 3D environments, cinematic transitions, and a journey through five chapters of wonder.",
  keywords: [
    "interactive storytelling",
    "3D experience",
    "cinematic website",
    "Three.js",
    "Next.js",
    "web experience",
  ],
  openGraph: {
    title: "The Infinite Story | A Cinematic 3D Experience",
    description:
      "An immersive interactive storytelling experience featuring 3D environments and cinematic transitions.",
    type: "website",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "The Infinite Story",
    description:
      "An immersive interactive storytelling experience featuring 3D environments and cinematic transitions.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full bg-black text-white overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
