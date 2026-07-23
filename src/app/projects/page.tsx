// app/projects/page.tsx
'use client';

import { useState } from 'react';
import { ShaderBackground } from '@/components/ShaderBackground';
import { GrainOverlay } from '@/components/GrainOverlay';
import Navbar from '@/components/Navbar';
import { Search, X } from 'lucide-react';

// Sample projects data - replace with your actual data
const projects = [
  {
    id: 1,
    title: 'End-to-End Encrypted Peer-to-Peer Transfer',
    description: 'Send files, privately. Every data in your browser. Streamed straight to the other device. No cloud, no accounts.',
    tags: ['TypeScript', 'WebRTC', 'React'],
    status: 'All Systems Operational',
  },
  {
    id: 2,
    title: 'Beam',
    description: 'End-to-end encrypted, peer-to-peer file transfer - Files are encrypted in the browser and streamed...',
    tags: ['TypeScript', 'Next.js', 'WebRTC'],
    status: 'All Systems Operational',
  },
  {
    id: 3,
    title: 'GearOne',
    description: 'Smart Automobile Service Platform - Production-ready mobile app ecosystem with React Native...',
    tags: ['TypeScript', 'React Native', 'Node.js'],
    status: 'All Systems Operational',
  },
  // Add more projects as needed
];

const technologies = [
  'All', 'Bun', 'Expo', 'FFmpeg.wasm', 'GitHub', 'Go', 'Google AI',
  'Next.js', 'Node.js', 'OpenAI', 'PostgreSQL', 'React', 'React Native',
  'Supabase', 'Tailwind CSS', 'Three.js', 'TypeScript', 'Vercel'
];

export default function ProjectsPage() {
  const [selectedTech, setSelectedTech] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter projects based on selected tech and search
  const filteredProjects = projects.filter(project => {
    const matchesTech = selectedTech === 'All' || project.tags.includes(selectedTech);
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          project.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTech && matchesSearch;
  });

  return (
    <>
      {/* Shader Background */}
      <ShaderBackground />
      
      {/* Grain Overlay */}
      <GrainOverlay />

      {/* Main Content */}
      <main className="min-h-screen relative z-10">
        <Navbar />
        
        <div className="mx-auto max-w-6xl px-6 pt-32 pb-16">
          {/* Header */}
          <div className="mb-12 mt-[4rem]">
            <h1 className="text-5xl font-bold text-white mb-2 text-center">Projects</h1>
            <p className="text-zinc-400 text-lg text-center">
              My projects and work across different technologies and domains.
            </p>
          </div>

          {/* Separator Line */}
          <div className="mt-5 mx-auto max-w-2xl mb-8 border-t border-zinc-800/30"></div>

          {/* Search Bar */}
          <div className="mb-8">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-zinc-800/50 bg-zinc-900/30 py-2 pl-10 pr-4 text-sm text-white placeholder-zinc-500 backdrop-blur-sm focus:border-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-600"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          {/* Technology Filters */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-2">
              {technologies.map((tech) => (
                <button
                  key={tech}
                  onClick={() => setSelectedTech(tech)}
                  className={`rounded-full px-4 py-1.5 text-sm transition-all duration-200 ${
                    selectedTech === tech
                      ? 'bg-white text-black'
                      : 'bg-zinc-800/50 text-zinc-400 hover:bg-zinc-700/50 hover:text-zinc-200'
                  }`}
                >
                  {tech}
                </button>
              ))}
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-6">
            <p className="text-sm text-zinc-500">
              Showing {filteredProjects.length} project{filteredProjects.length !== 1 ? 's' : ''}
            </p>
          </div>

          {/* Projects Grid */}
          <div className="space-y-4">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="group rounded-xl border border-zinc-800/50 bg-zinc-900/20 p-6 backdrop-blur-sm transition-all hover:border-zinc-700/50 hover:bg-zinc-900/30"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white group-hover:text-zinc-200">
                      {project.title}
                    </h3>
                    <p className="mt-1 text-sm text-zinc-400">
                      {project.description}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-zinc-800/50 px-3 py-0.5 text-xs text-zinc-400"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col items-start gap-2 md:items-end">
                    <div className="flex items-center gap-2">
                      <span className="inline-block h-2 w-2 rounded-full bg-emerald-500"></span>
                      <span className="text-xs text-zinc-400">{project.status}</span>
                    </div>
                    <button className="text-sm text-zinc-500 transition-colors hover:text-zinc-300">
                      View Details →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredProjects.length === 0 && (
            <div className="rounded-xl border border-zinc-800/50 bg-zinc-900/20 p-12 text-center backdrop-blur-sm">
              <p className="text-zinc-400">No projects found matching your criteria.</p>
            </div>
          )}
        </div>
      </main>
    </>
  );
}