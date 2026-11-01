// data/experience/work-experience.ts
import { Experience } from "@/types/experience";

export const workExperiencess: Experience[] = [
  {
    id: "mit-app-invention",
    logo: "/assets/logos/ixl.png",
    title: "MIT App Development",
    role: "Frontend Developer",
    startDate: "May 2023",
    endDate: "August 2023",
    location: "Remote",
    technologies: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Figma"],
    description: "",
    notes: [
      "Translated Figma UI/UX designs into pixel-perfect responsive interfaces using Next.js, React, and Tailwind CSS",
      "Worked on electron projects for Windows focusing on frontend development and UI/UX design",
      "Worked on ecommerce projects focusing on development and testing"
    ]
  },
  {
    id: "code-help",
    logo: "/assets/logos/codehelp.png",
    title: "Code Help",
    role: "Full Stack Developer Intern",
    startDate: "Aug 2025",
    endDate: "Nov 2025",
    location: "Remote",
    technologies: ["React", "Node.js", "Express", "MongoDB"],
    description: "",
    notes: [
      "Built RESTful APIs for client applications",
      "Implemented JWT authentication and authorization",
      "Optimized database queries for better performance"
    ]
  },
  {
    id: "astraea",
    logo: "/assets/logos/astraea.png",
    title: "Astraea Solutions",
    role: "Product Tech Intern",
    startDate: "Jun 2025",
    endDate: "Aug 2025",
    location: "Remote",
    technologies: ["Python", "Django", "PostgreSQL", "Docker"],
    description: "",
    notes: [
      "Assisted in developing product features",
      "Wrote unit tests achieving 85% coverage",
      "Documented API endpoints for internal use"
    ]
  }
];

export const workExperiences: Experience[] = [];