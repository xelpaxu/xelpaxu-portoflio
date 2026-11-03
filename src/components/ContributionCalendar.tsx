'use client';

import { useRef } from 'react';
import GitHubCrawler from './GitHubCrawler';
import type { ContributionDay } from '@/types/github';

const levels = ['var(--activity-0)', 'var(--activity-1)', 'var(--activity-2)', 'var(--activity-3)', 'var(--activity-4)'];
const activityLabels = ['No', 'Low', 'Moderate', 'High', 'Very high'];

export default function ContributionCalendar({ days, offset, weeks, months, inspectedDate, highlightedDates, onSelect }: {
  days: ContributionDay[];
  offset: number;
  weeks: number;
  months: { week: number; label: string }[];
  inspectedDate?: string;
  highlightedDates: Set<string>;
  onSelect: (date: string) => void;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  return <div ref={hostRef} className="relative isolate">
    <div className="overflow-x-auto pb-2" tabIndex={0} role="region" aria-label="Scrollable contribution calendar">
    <svg viewBox={`0 0 ${weeks * 13 + 52} 130`} data-crawler-grid className="w-full min-w-[560px]" role="group" aria-label="Contribution calendar">
      {months.map(month => <text key={`${month.week}-${month.label}`} x={month.week * 13 + 26} y={10} className="fill-subtle text-[9px]">{month.label}</text>)}
      {['Mon', 'Wed', 'Fri'].map((label, i) => <text key={label} x={0} y={35 + i * 26} className="fill-subtle text-[8px]">{label}</text>)}
      {days.map((day, i) => <rect key={day.date} data-commit-date={day.date} data-crawler-food={day.level > 0 && highlightedDates.has(day.date) ? 'true' : undefined} x={Math.floor((i + offset) / 7) * 13 + 26} y={(i + offset) % 7 * 13 + 20} width={10} height={10} rx={2.5} fill={levels[day.level]} opacity={highlightedDates.has(day.date) ? 1 : 0.12} stroke={inspectedDate === day.date ? 'var(--foreground)' : 'none'} strokeWidth={1.5} className="cursor-crosshair origin-center [transform-box:fill-box] transition-[fill,opacity,transform] duration-150 hover:scale-125 hover:stroke-accent motion-reduce:transition-none motion-reduce:hover:scale-100" onPointerEnter={() => onSelect(day.date)} onClick={() => onSelect(day.date)}><title>{day.date}: {activityLabels[day.level]} contribution activity</title></rect>)}
    </svg>
    </div>
    <GitHubCrawler hostRef={hostRef} enabled={days.some(day => day.level > 0)} />
  </div>;
}
