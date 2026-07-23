"use client";

import { useState } from 'react';
import FeaturedExperience from './FeaturedExperience';
import { workExperiences } from '../../data/experience/work-experience';

export default function ExperienceSection() {
  const [activeTab, setActiveTab] = useState<'journey' | 'experience'>('experience');
  
  // Get only first 3 experiences for featured section
  const featuredExperiences = workExperiences.slice(0, 3);

  return (
    <section id="experience">
      {/* Toggle between Journey and Experience */}
      <div className="mb-6 flex justify-start">
        <div className="inline-flex gap-4">
          <button
            onClick={() => setActiveTab('journey')}
            className={`text-sm font-medium transition-all duration-300 ${
              activeTab === 'journey'
                ? 'text-white border-b-2 border-white'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            Journey
          </button>
          <button
            onClick={() => setActiveTab('experience')}
            className={`text-sm font-medium transition-all duration-300 ${
              activeTab === 'experience'
                ? 'text-white border-b-2 border-white'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            Experience
          </button>
        </div>
      </div>

      {/* Experience List - Only 3 items */}
      {activeTab === 'experience' && (
        <>
          <div className="flex flex-col divide-y divide-zinc-800">
            {featuredExperiences.map((experience) => (
              <FeaturedExperience key={experience.id} {...experience} />
            ))}
          </div>

          {/* Only show View All link if there are more than 3 experiences */}
          {workExperiences.length > 3 && (
            <div className="mt-8">
              <a
                href="/experience"
                className="inline-flex items-center gap-2 text-sm text-zinc-500 transition-all hover:text-zinc-300"
              >
                View all experience →
              </a>
            </div>
          )}
        </>
      )}

      {/* Journey Tab Content */}
      {activeTab === 'journey' && (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-8 text-center">
          <p className="text-zinc-400">Journey content coming soon...</p>
        </div>
      )}
    </section>
  );
}