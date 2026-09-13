// components/projects/ProjectCard.tsx
"use client";

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import type { Project } from '../../types/project';

interface ProjectCardProps extends Project {}

export default function ProjectCard({
  image,
  title,
  description,
  tags,
  status,
  link,
  github,
  demo,
  metrics,
  notes
}: ProjectCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  // Mouse tracking for 3D effect
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const rotateX = useTransform(y, [-100, 100], [6, -6]);
  const rotateY = useTransform(x, [-100, 100], [-6, 6]);
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const moveX = e.clientX - centerX;
    const moveY = e.clientY - centerY;
    
    x.set(moveX);
    y.set(moveY);
  };
  
  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  };
  
  const statusColors = {
    operational: 'border-green-300 bg-green-500/10',
    beta: 'border-yellow-300 bg-yellow-500/10',
    'coming-soon': 'border-blue-300 bg-blue-500/10',
    archived: 'border-gray-300 bg-gray-500/10'
  };
  
  const statusDotColors = {
    operational: 'bg-green-500',
    beta: 'bg-yellow-500',
    'coming-soon': 'bg-blue-500',
    archived: 'bg-gray-500'
  };
  
  const statusLabels = {
    operational: 'All Systems Operational',
    beta: 'Beta',
    'coming-soon': 'Coming Soon',
    archived: 'Archived'
  };

  // Get the first note as the install command
  const installCommand = notes && notes.length > 0 ? notes[0] : null;

  return (
    <motion.div
      className="group h-full w-full overflow-hidden border border-gray-100 dark:border-gray-800 rounded-xl bg-zinc-900/50 transition-all hover:border-zinc-700"
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
        perspective: '800px',
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={() => setIsHovered(true)}
      whileHover={{
        scale: 1.02,
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.6)',
        transition: { duration: 0.2 }
      }}
    >
      {/* Image Section - Top */}
      <div className="relative overflow-hidden" style={{ aspectRatio: '16 / 5.5' }}>
        <Image
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          src={image}
          alt={title}
          width={1920}
          height={1080}
        />
      </div>

      {/* Content Section - Bottom */}
      <div className="px-3 pt-2 pb-1.5 space-y-2" style={{ transform: 'translateZ(20px)' }}>
        {/* Project Header - Title and Icons */}
        <div className="flex items-center justify-between gap-4">
          <Link href={link}>
            <h3 className="text-base leading-tight font-semibold text-white group-hover:text-indigo-400 transition-colors hover:cursor-pointer">
              {title}
            </h3>
          </Link>
          <div className="flex items-center gap-2">
            {/* Website Icon */}
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-500 hover:text-zinc-300 flex size-6 items-center justify-center transition-colors"
              aria-label="View Website"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-5 w-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 21a9 9 0 0 0 0-18m0 18a9 9 0 0 1 0-18m0 18c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 12h18"
                />
              </svg>
            </a>
            {/* GitHub Icon */}
            {github && (
              <a
                href={github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-500 hover:text-zinc-300 flex size-6 items-center justify-center transition-colors"
                aria-label="View GitHub"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.15 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.62.24 2.85.12 3.15.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                </svg>
              </a>
            )}
          </div>
        </div>

        {/* Description */}
        <p className="text-zinc-400 line-clamp-2 text-sm">
          {description}
        </p>

        {/* Technologies / Stack */}
        <div>
          <h4 className="text-zinc-500 mb-1.5 text-xs font-medium tracking-wide uppercase">
            Stack
          </h4>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="text-sm font-medium text-zinc-300"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Footer - Status and View Details */}
      <div className="flex justify-between px-3 pt-0 pb-2">
        <div
          className={`flex items-center gap-1 rounded-md px-2 py-1 text-xs ${statusColors[status]}`}
        >
          <div className={`size-2 animate-pulse rounded-full ${statusDotColors[status]}`} />
          {statusLabels[status]}
        </div>
        <Link
          href={link}
          className="text-zinc-500 hover:text-zinc-300 flex items-center gap-2 text-sm underline-offset-4 transition-colors hover:underline"
        >
          View Details
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="h-4 w-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
            />
          </svg>
        </Link>
      </div>

      {/* 3D shadow effect */}
      <motion.div
        className="absolute -bottom-6 left-1/2 h-8 w-3/4 -translate-x-1/2 rounded-full bg-indigo-500/20"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{
          opacity: isHovered ? 0.6 : 0,
          scale: isHovered ? 1 : 0.8,
        }}
        transition={{ duration: 0.3 }}
        style={{ transform: 'translateZ(-30px)' }}
      />
    </motion.div>
  );
}