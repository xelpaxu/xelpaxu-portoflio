import { ChevronDown } from 'lucide-react';
import type { ProjectFeatureGroup } from '@/types/project';

export default function ProjectFeatures({ groups }: { groups: ProjectFeatureGroup[] }) {
  const count = groups.reduce((total, group) => total + group.features.length, 0);
  return <div className="project-feature-explorer">
    <div className="project-content-heading"><div><h2>Explore the capabilities</h2><p>Open an area to see the features behind it.</p></div><span>{count} capabilities · {groups.length} areas</span></div>
    <div className="project-feature-groups">
      {groups.map((group, index) => <details key={group.title} className="project-feature-group" open={index === 0}>
        <summary><div><h3>{group.title}</h3><p>{group.summary}</p></div><span className="project-feature-group-count">{group.features.length}<span className="sr-only"> features</span></span><ChevronDown size={18} aria-hidden="true" /></summary>
        <ul className="project-feature-inventory">
          {group.features.map(feature => <li key={feature.title}><h4>{feature.title}</h4><p>{feature.description}</p>{!!feature.details?.length && <ul>{feature.details.map(detail => <li key={detail}>{detail}</li>)}</ul>}</li>)}
        </ul>
      </details>)}
    </div>
  </div>;
}
