"use client";

import { useState } from 'react';
import Image from 'next/image';
import { Experience } from '@/types/experience';

interface FeaturedExperienceProps extends Experience {}

// Use DevIcon CDN - provides colored icons
const getTechIconUrl = (tech: string): string => {
  const iconMap: { [key: string]: string } = {
    'Next.js': 'nextjs',
    'React': 'react',
    'TypeScript': 'typescript',
    'Tailwind CSS': 'tailwindcss',
    'Figma': 'figma',
    'Node.js': 'nodejs',
    'Express': 'express',
    'MongoDB': 'mongodb',
    'Python': 'python',
    'Django': 'django',
    'PostgreSQL': 'postgresql',
    'Docker': 'docker',
  };
  
  const iconName = iconMap[tech] || tech.toLowerCase().replace(/\./g, '').replace(/\s/g, '');
  return `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${iconName}/${iconName}-original.svg`;
};

export default function FeaturedExperience({
  logo,
  title,
  role,
  startDate,
  endDate,
  location,
  technologies,
  description,
  notes
}: FeaturedExperienceProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.currentTarget;
    const tech = target.getAttribute('data-tech') || '';
    
    // Try fallback URL
    const fallbackUrl = `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${tech.toLowerCase()}/${tech.toLowerCase()}-original.svg`;
    
    if (target.src !== fallbackUrl) {
      target.src = fallbackUrl;
    } else {
      // If both fail, hide the image
      target.style.display = 'none';
    }
  };

  return (
    <div className="border-b border-zinc-800 last:border-0">
      <div className="py-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-1 items-start gap-4">
            <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg bg-zinc-800">
              <Image
                src={logo}
                alt={`${title} logo`}
                fill
                className="object-cover p-2"
              />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-semibold text-white">{title}</h3>
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="rounded-lg p-0.5 transition-all hover:bg-zinc-800"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className={`h-4 w-4 text-zinc-500 transition-transform duration-300 ${
                      isExpanded ? 'rotate-180' : ''
                    }`}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m19.5 8.25-7.5 7.5-7.5-7.5"
                    />
                  </svg>
                </button>
              </div>
              <p className="text-sm text-zinc-400">{role}</p>
            </div>
          </div>

          <div className="flex flex-col items-end gap-1 flex-shrink-0">
            <span className="text-sm text-zinc-400 whitespace-nowrap">
              {startDate} - {endDate}
            </span>
            {location && (
              <span className="text-xs text-zinc-500">
                {location}
              </span>
            )}
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="pb-6 pl-16">
          {description && (
            <p className="mb-4 text-sm text-zinc-400">{description}</p>
          )}

          {technologies && technologies.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-2">
              {technologies.map((tech) => (
                <span
                  key={tech}
                  className="inline-flex cursor-default items-center gap-1.5 rounded-[0.5rem] border border-dashed border-zinc-500 bg-white/5 px-2.5 py-[0.2rem] text-sm text-zinc-300 backdrop-blur-sm"
                >
                  <img
                    src={getTechIconUrl(tech)}
                    alt={`${tech} icon`}
                    data-tech={tech}
                    className="h-4 w-4 object-contain"
                    onError={handleImageError}
                  />
                  <span className="font-medium">{tech}</span>
                </span>
              ))}
            </div>
          )}

          {notes && notes.length > 0 && (
            <div className="space-y-1">
              {notes.map((note, index) => (
                <p key={index} className="text-sm text-zinc-400">
                  • {note}
                </p>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}