"use client";

import Link from "next/link";

import { useState } from 'react';
import FeaturedExperience from './FeaturedExperience';
import { workExperiences } from '../../data/experience/work-experience';
import { education } from '../../data/experience/journey';

export default function ExperienceSection({ showAll = false }: { showAll?: boolean }) {
  const [activeTab, setActiveTab] = useState<'journey' | 'experience'>('experience');
  const [expandedRoles, setExpandedRoles] = useState<string[]>(() => showAll ? workExperiences.map(role => role.id) : []);
  
  // Get only first 3 experiences for featured section
  const orderedExperiences = [...workExperiences].sort((a, b) => Date.parse(b.startDate) - Date.parse(a.startDate));
  const featuredExperiences = showAll ? orderedExperiences : orderedExperiences.slice(0, 3);

  return (
    <section id="experience" className="scroll-mt-28 bg-transparent" aria-label="Work and education">
      {/* Toggle between Journey and Experience */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex gap-5 border-b border-line">
          <button
            aria-pressed={activeTab === 'journey'}
            onClick={() => setActiveTab('journey')}
            className={`min-h-11 border-b-2 px-1 text-sm font-medium transition-colors ${
              activeTab === 'journey'
                ? 'border-accent text-accent'
                : 'border-transparent text-subtle hover:text-strong'
            }`}
          >
            Journey
          </button>
          <button
            aria-pressed={activeTab === 'experience'}
            onClick={() => setActiveTab('experience')}
            className={`min-h-11 border-b-2 px-1 text-sm font-medium transition-colors ${
              activeTab === 'experience'
                ? 'border-accent text-accent'
                : 'border-transparent text-subtle hover:text-strong'
            }`}
          >
            Experience
          </button>
        </div>
        {activeTab === 'experience' && <button type="button" onClick={() => setExpandedRoles(featuredExperiences.every(role => expandedRoles.includes(role.id)) ? [] : featuredExperiences.map(role => role.id))} className="min-h-11 text-xs text-accent hover:underline">{featuredExperiences.every(role => expandedRoles.includes(role.id)) ? 'Collapse all' : 'Expand all'}</button>}
      </div>

      {/* Experience List - Only 3 items */}
      {activeTab === 'experience' && (
        <>
          <div className="experience-timeline flex flex-col">
            {featuredExperiences.map((experience) => (
              <FeaturedExperience key={experience.id} {...experience} card={showAll} expanded={expandedRoles.includes(experience.id)} onToggle={() => setExpandedRoles(previous => previous.includes(experience.id) ? previous.filter(id => id !== experience.id) : [...previous, experience.id])} />
            ))}
          </div>

          {/* Only show View All link if there are more than 3 experiences */}
          {!showAll && (
            <div className="mt-8">
              <Link
                href="/experience"
                className="inline-flex items-center gap-2 text-sm text-subtle transition-all hover:text-strong"
              >
                View all experience →
              </Link>
            </div>
          )}
        </>
      )}

      {/* Journey Tab Content */}
      {activeTab === 'journey' && (
        <div className="flex flex-col divide-y divide-line">
          {education.map((item) => (
            <div key={item.id} className="border-b border-line last:border-0">
              <div className="py-6">
                <div className="flex flex-col items-start justify-between gap-2 sm:flex-row sm:gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-semibold text-foreground">{item.title}</h3>
                    </div>
                    <p className="mt-1 text-sm text-muted">{item.description}</p>
                  </div>
                  <span className="text-sm text-muted whitespace-nowrap">{item.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
