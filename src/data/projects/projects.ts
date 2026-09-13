// data/projects/projects-data.ts
import { Project } from "../../types/project";

export const projects: Project[] = [
  {
    id: "krosztube",
    image: "/assets/projects/krosztube.jpg",
    title: "KroszTube",
    description: "YouTube Downloader CLI & Library - Download videos in any quality without re-encoding, extract MP3s, fetch clean metadata, and more.",
    tags: ["TS", "Node.js", "YouTube"],
    status: "operational",
    link: "/projects/krosztube",
    github: "https://github.com/yourusername/krosztube",
    demo: "https://krosztube.vercel.app",
    featured: true
  },
  {
    id: "rune",
    image: "/assets/projects/rune.jpg",
    title: "Rune",
    description: "Customizable QR Code Library - Lightweight, framework-agnostic QR codes built from scratch per ISO/IEC 18004 standards.",
    tags: ["TS", "QR", "Library"],
    status: "operational",
    link: "/projects/rune",
    github: "https://github.com/yourusername/rune",
    demo: "https://rune-demo.vercel.app",
    featured: true
  },
  {
    id: "nexus-dashboard",
    image: "/assets/projects/nexus-dashboard.jpg",
    title: "Nexus Dashboard",
    description: "Real-time analytics dashboard for monitoring application performance and user metrics with beautiful visualizations.",
    tags: ["Next.js", "React", "TypeScript"],
    status: "operational",
    link: "/projects/nexus-dashboard",
    github: "https://github.com/yourusername/nexus-dashboard",
    demo: "https://nexus-dashboard.vercel.app",
    featured: true
  }
];