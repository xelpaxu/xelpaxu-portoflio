import { projectExperiences } from './project-experience';
import { workExperiences } from './work-experience';

// false: highlight projects; true: show entries from work-experience.ts.
export const showWorkExperience: boolean = false;

export const experienceLabel = showWorkExperience ? 'Work experience' : 'Project experience';
export const experienceDescription = showWorkExperience
  ? 'The teams I have worked with and what I contributed along the way.'
  : 'What I built across web, mobile, and AI projects, and the contributions I made along the way.';

export const experiences = [...(showWorkExperience ? workExperiences : projectExperiences)]
  .sort((a, b) => {
    const aDate = Date.parse(a.startDate);
    const bDate = Date.parse(b.startDate);
    return Number.isNaN(aDate) || Number.isNaN(bDate) ? 0 : bDate - aDate;
  });
