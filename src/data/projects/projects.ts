import type { Project } from '@/types/project';
import { projectCaseStudies } from './case-studies';

const projectEntries: Project[] = [
  {
    "id": "vecpro",
    "title": "VECPRO",
    "images": [
      "/assets/projects/aedify.png",
      "/assets/projects/aedify-2.png",
      "/assets/projects/aedify3.png",
    ],
    "imageLabel": "Project artwork",
    "description": "Thesis project combining Aedify, a web dashboard for vector surveillance, and Aedex, a mobile app for mosquito breeding-site reporting.",
    "tags": [
      "Next.js",
      "React Native",
      "Expo",
      "TypeScript",
      "Convex"
    ],
    "status": "project",
    "category": "Thesis / Web + mobile",
    "link": "/projects/vecpro",
    "featured": true,
    "notes": [
      "Aedify brings together surveillance reports, maps, assignments, and analytics.",
      "Aedex supports field capture, geotagged reports, and community reporting.",
      "Connect the dashboard and mobile workflows through Convex."
    ],
    "components": [
      {
        "name": "Aedify",
        "github": "https://github.com/xelpaxu/aedify",
        "description": "Web dashboard for surveillance reports, maps, assignments, and analytics.",
        "tags": [
          "Next.js",
          "React",
          "TypeScript",
          "Convex"
        ]
      },
      {
        "name": "Aedex",
        "github": "https://github.com/xelpaxu/aedex",
        "description": "Expo and React Native mobile application for field capture and community reporting.",
        "tags": [
          "React Native",
          "Expo",
          "TypeScript",
          "Convex"
        ]
      }
    ],
    "github": "https://github.com/kheypaxu/visaia",
    "demo": "https://vecprolanding.vercel.app"
  },
  {
    "id": "visaia",
    "title": "VISAIA",
    "images": [
      "/assets/projects/visaia.svg"
    ],
    "imageLabel": "Project artwork",
    "description": "A mobile farm-management and pest-monitoring app with field mapping, crop cycles, activity logs, and image-based pest detection.",
    "tags": [
      "Flutter",
      "Dart",
      "Firebase"
    ],
    "status": "project",
    "category": "Mobile / Agriculture",
    "link": "/projects/visaia",
    "featured": true,
    "notes": [
      "Define farms and fields and manage crop growing cycles.",
      "Record farming activities and carry out image-based pest scouting.",
      "Review farm records, pest reports, and notifications."
    ],
    "github": "https://github.com/kheypaxu/visaia",
    "demo": "https://visaialanding.vercel.app"
  },
  {
    "id": "visaia-dashboard",
    "title": "VISAIA Dashboard",
    "images": [
      "/assets/projects/vdashb.png",
      "/assets/projects/vdashb2.png",
      "/assets/projects/vdashb3.png",
      "/assets/projects/vdashb4.png"
    ],
    "imageLabel": "Project artwork",
    "description": "A pest-surveillance dashboard for agricultural offices, with report validation, farmer management, geospatial risk maps, and regional analytics.",
    "tags": [
      "Next.js",
      "TypeScript",
      "Firebase",
      "Leaflet"
    ],
    "status": "project",
    "category": "Dashboard / Agriculture",
    "link": "/projects/visaia-dashboard",
    "featured": true,
    "notes": [
      "Provide separate workflows for Municipal Agricultural Offices and regional crop-protection administrators.",
      "Review pest reports and visualize farms and risk zones on interactive maps.",
      "Manage farmers, growing cycles, advisories, and exportable reports."
    ],
    "github": "https://github.com/kheypaxu/visaia-dashboard",
    "demo": "https://visaialanding.vercel.app"
  },
  {
    "id": "amogus",
    "title": "Amogus",
    "images": [
      "/assets/projects/amogus.png",
      "/assets/projects/amogus1.png",
      "/assets/projects/amogus2.png",
      "/assets/projects/amogus3.png",
      "/assets/projects/amogus4.png"
    ],
    "imageLabel": "Project artwork",
    "description": "A multiplayer social-deduction game with player setup, shared room lobbies, secret roles, and real-time game sessions.",
    "tags": [
      "React",
      "TypeScript",
      "Socket.io",
      "Three.js",
      "Python"
    ],
    "status": "project",
    "category": "Multiplayer game",
    "link": "/projects/amogus",
    "featured": true,
    "notes": [
      "Create a player identity and join a multiplayer room.",
      "Reveal hidden roles and play through shared real-time game sessions.",
      "Keep players synchronized through Socket.IO and a Python game server."
    ],
    "github": "https://github.com/xelpaxu/amogus",
    "demo": "https://amogus-nlp.vercel.app"
  },
  {
    "id": "encast",
    "title": "enCast",
    "images": [
      "/assets/projects/encast.svg"
    ],
    "imageLabel": "Project artwork",
    "description": "A household energy-use simulator that organizes rooms and appliances and estimates how usage choices affect consumption and electricity costs.",
    "tags": [
      "Flutter",
      "Dart"
    ],
    "status": "project",
    "category": "Mobile / Energy",
    "link": "/projects/encast",
    "featured": true,
    "notes": [
      "Organize home sections and appliances with wattage and usage-time inputs.",
      "Explore what-if scenarios for energy consumption and estimated costs.",
      "The project specification includes summaries, reminders, and an energy-help chatbot."
    ],
    "github": "https://github.com/xelpaxu/enCast"
  },
  {
    "id": "memowee",
    "title": "Memowee",
    "images": [
      "/assets/projects/memowee.png",
      "/assets/projects/memowee2.png",
      "/assets/projects/memowee3.png",
    ],
    "imageLabel": "Project artwork",
    "description": "A camera-based face-identification prototype with profile registration, learned face embeddings, adjustable recognition thresholds, and an activity log.",
    "tags": [
      "Python",
      "TensorFlow",
      "FastAPI",
      "JavaScript"
    ],
    "status": "project",
    "category": "AI / Computer vision",
    "link": "/projects/memowee",
    "featured": true,
    "notes": [
      "Register a face with a name, relationship, and short description.",
      "Compare camera captures against stored face embeddings using a TensorFlow model.",
      "Adjust the recognition threshold and follow identification events in the activity log."
    ],
    "github": "https://github.com/xelpaxu/Memowee"
  },
  {
    "id": "nexacare",
    "title": "NexaCare",
    "images": [
      "/assets/projects/nexacare.svg"
    ],
    "imageLabel": "Project artwork",
    "description": "A desktop healthcare-management system with patient records, appointments, and separate workflows for doctors, administrators, and HR staff.",
    "tags": [
      "Python",
      "Flet",
      "MySQL"
    ],
    "status": "project",
    "category": "Desktop / Healthcare",
    "link": "/projects/nexacare",
    "featured": false,
    "notes": [
      "Manage patient records and appointment data.",
      "Provide role-specific interfaces for doctors, administrators, and HR staff.",
      "Store application data in MySQL behind a Python and Flet interface."
    ],
    "github": "https://github.com/nicssskie/NexaCare"
  },
  {
    "id": "revia",
    "title": "Revia",
    "images": [
      "/assets/projects/revia.svg"
    ],
    "imageLabel": "Project artwork",
    "description": "A study-space discovery and reservation platform that helps students find places to work and plan their study sessions.",
    "tags": [
      "React",
      "Firebase",
      "Supabase",
      "Framer Motion"
    ],
    "status": "project",
    "category": "Web / Reservations",
    "link": "/projects/revia",
    "featured": false,
    "notes": [
      "Discover study spaces through a student-oriented web interface.",
      "Explore locations and reservation workflows with mapping and calendar components.",
      "Use Firebase and Supabase services in the application."
    ],
    "github": "https://github.com/nicssskie/Revia",
    "demo": "https://revia-npk.vercel.app"
  },
  {
    "id": "vertex-realty",
    "title": "Vertex Realty",
    "images": [
      "/assets/projects/vertex-realty.svg"
    ],
    "imageLabel": "Project artwork",
    "description": "A real-estate showcase with searchable property listings, dedicated property detail pages, and an animated, responsive browsing experience.",
    "tags": [
      "React",
      "TypeScript",
      "Framer Motion"
    ],
    "status": "project",
    "category": "Web / Real estate",
    "link": "/projects/vertex-realty",
    "featured": false,
    "notes": [
      "Browse a property collection and open individual property detail pages.",
      "Present listing information alongside a dedicated agency About page.",
      "Use responsive layouts and Framer Motion for interface transitions."
    ],
    "github": "https://github.com/xelpaxu/vertex-realty"
  },
  {
    "id": "cictzone",
    "title": "CICTZONE",
    "images": [
      "/assets/projects/cictzone.svg"
    ],
    "imageLabel": "Project artwork",
    "description": "A Python 2D campus game exploring player movement, obstacles, enemy navigation, and constraint-based placement.",
    "tags": [
      "Python",
      "Pygame",
      "Arcade"
    ],
    "status": "project",
    "category": "Game / Algorithms",
    "link": "/projects/cictzone",
    "featured": false,
    "notes": [
      "Move through a campus-map environment with obstacles and collision boundaries.",
      "Explore A* pathfinding and constraint-based placement in the game logic.",
      "Includes Pygame and Arcade implementations."
    ],
    "github": "https://github.com/xelpaxu/cictzone",
    "videoDemo": "https://youtu.be/4dCCRnqYmrQ"
  },
  {
    "id": "bigbrew-pos",
    "title": "BigBrew POS",
    "images": [
      "/assets/projects/bigbrew-pos.svg"
    ],
    "imageLabel": "Project artwork",
    "description": "A Python point-of-sale application for ordering drinks, managing products, recording transactions, and reviewing sales reports.",
    "tags": [
      "Python",
      "Flet"
    ],
    "status": "project",
    "category": "Desktop / Point of sale",
    "link": "/projects/bigbrew-pos",
    "featured": false,
    "notes": [
      "Build orders and handle payment and change calculations.",
      "Manage products and review recorded transactions.",
      "Provide separate login, dashboard, and sales-reporting views."
    ],
    "github": "https://github.com/xelpaxu/BIGBREW-POS",
    "videoDemo": "https://youtu.be/Pxr7T5pMtMg"
  }
];

export const projects: Project[] = projectEntries.map(project => ({ ...project, caseStudy: projectCaseStudies[project.id] }));
