import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "The World That Forgot the Sun | An Interactive 3D Story",
  description:
    "An immersive interactive storytelling experience set in 2189 — after the artificial sun Helios Core shuts down, follow Aren and Nova on a journey across a frozen world to restore the light.",
  keywords: [
    "interactive storytelling",
    "3D experience",
    "cinematic website",
    "Three.js",
    "Next.js",
    "web experience",
    "science fiction",
    "post-apocalyptic",
  ],
  openGraph: {
    title: "The World That Forgot the Sun | An Interactive 3D Story",
    description:
      "An immersive interactive storytelling experience set in 2189 — follow Aren and Nova on a journey across a frozen world to restore the light.",
    type: "website",
    images: ["/og-image.png"],
    siteName: "The World That Forgot the Sun",
  },
  twitter: {
    card: "summary_large_image",
    title: "The World That Forgot the Sun",
    description:
      "An immersive interactive 3D storytelling experience set in 2189. Follow Aren and Nova on a journey to restore the light.",
  },
  robots: {
    index: true,
    follow: true,
  },
  metadataBase: new URL("https://story-teller-omega.vercel.app"),
  alternates: {
    canonical: "/",
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
