# 🌍 The World That Forgot the Sun

An immersive interactive 3D storytelling experience built with Next.js, Three.js, and Framer Motion. Journey through a post-apocalyptic world where the artificial sun has gone dark, and follow Aren and Nova as they attempt to restore the light.

A project by **aditya226-sharma** and **Dev9269**.

## Tech Stack

- **Framework:** Next.js 16 with App Router
- **3D Rendering:** Three.js, React Three Fiber, Drei
- **Animations:** Framer Motion, GSAP
- **Audio:** Web Audio API
- **State:** Zustand
- **Styling:** Tailwind CSS 4

## Features

- 8 cinematic story chapters with full-screen 3D environments
- Dynamic lighting and post-processing effects
- Procedural particle systems (stars, nebulae, galaxies)
- Audio narration with ambient soundscapes
- Smooth scroll-based chapter progression
- Custom cursor with parallax effects
- Chapter navigation with progress tracking
- Responsive design with reduced-motion support

## Getting Started

```bash
# Install dependencies
npm install

# Start development server (port 3008)
npm run dev

# Build for production
npm run build
```

Open [http://localhost:3008](http://localhost:3008) to view the experience.

## Project Structure

```
src/
  app/            # Next.js app router pages and layout
  components/     # React components (3D scenes, UI, effects)
  data/           # Story chapters and content
  hooks/          # Custom React hooks (audio, scroll, FPS)
  shaders/        # GLSL shader code
  store/          # Zustand state management
  types/          # TypeScript type definitions
```

## Story

The year is 2189. Helios Core, the artificial sun that sustained humanity, has shut down without warning. The world has fallen into endless night. Follow Aren, a curious explorer, and Nova, an ancient robotic companion, on an impossible journey across frozen cities, flooded metropolises, and floating havens to restore the light.

8 chapters. 300 years of darkness. One final choice.

## License

MIT
