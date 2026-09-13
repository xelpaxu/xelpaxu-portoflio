"use client";

import { useState } from 'react';
import FeaturedExperience from './FeaturedExperience';
import { workExperiences } from '../../data/experience/work-experience';
import { education } from '../../data/experience/journey';

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
        <div className="flex flex-col divide-y divide-zinc-800">
          {education.map((item) => (
            <div key={item.id} className="border-b border-zinc-800 last:border-0">
              <div className="py-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-semibold text-white">{item.title}</h3>
                    </div>
                    <p className="mt-1 text-sm text-zinc-400">{item.description}</p>
                  </div>
                  <span className="text-sm text-zinc-400 whitespace-nowrap">{item.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}