'use client';

import { useEffect, useState } from 'react';
import { ArrowUpRight, GitFork, Star } from 'lucide-react';
import { FaGithub } from 'react-icons/fa';
import { profile } from '@/data/profile';
import type { GitHubActivity as Activity } from '@/types/github';
import LiveVisits from './LiveVisits';

const levels = ['var(--activity-0)', 'var(--activity-1)', 'var(--activity-2)', 'var(--activity-3)', 'var(--activity-4)'];

export default function GitHubActivity() {
  const [data, setData] = useState<Activity | null>(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    const controller = new AbortController();
    fetch('/api/github', { signal: controller.signal })
      .then(response => { if (!response.ok) throw new Error('Unavailable'); return response.json(); })
      .then(setData).catch(error => { if (error.name !== 'AbortError') setFailed(true); });
    return () => controller.abort();
  }, []);

  const days = data?.days ?? [];
  const offset = days.length ? new Date(`${days[0].date}T12:00:00Z`).getUTCDay() : 0;
  const weeks = Math.ceil((days.length + offset) / 7);
  const today = new Date().toISOString().slice(0, 10);
  const pastDays = days.filter(day => day.date <= today);
  const activeDays = pastDays.filter(day => day.level > 0).length;
  let bestStreak = 0;
  let streak = 0;
  for (const day of pastDays) { streak = day.level ? streak + 1 : 0; bestStreak = Math.max(bestStreak, streak); }
  const months = days.flatMap((day, i) => {
    if (i && day.date.slice(0, 7) === days[i - 1].date.slice(0, 7)) return [];
    const week = Math.floor((i + offset) / 7);
    if (week > weeks - 3) return [];
    return [{ week, label: new Date(`${day.date}T12:00:00Z`).toLocaleDateString('en', { month: 'short', timeZone: 'UTC' }) }];
  });

  return (
    <div className="bg-transparent">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-5">
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-start"><FaGithub className="size-5" aria-hidden="true" /></span>
          <div><p className="text-sm font-semibold">@{profile.github}</p><p className="mt-0.5 text-xs text-subtle">Building in public</p></div>
        </div>
        <LiveVisits />
        <a href={`https://github.com/${profile.github}`} target="_blank" rel="noopener noreferrer" aria-label="Open GitHub profile" title="Open GitHub profile" className="inline-flex size-11 shrink-0 items-center justify-center text-muted hover:text-foreground"><ArrowUpRight className="size-4" aria-hidden="true" /></a>
      </div>
      <div className="py-6">
        {!data && !failed ? (
          <div role="status" className="flex h-40 items-center justify-center text-sm text-subtle">Loading GitHub activity…</div>
        ) : data?.calendarAvailable ? (
          <>
            <div className="mb-6 flex flex-wrap items-baseline gap-x-6 gap-y-2">
              <p><span className="text-2xl font-semibold tracking-tight">{activeDays}</span><span className="ml-2 text-sm text-muted">active days</span></p>
              <p className="text-sm text-muted">Longest streak <span className="ml-1 font-medium text-foreground">{bestStreak} days</span></p>
            </div>
            <div className="overflow-x-auto pb-2" tabIndex={0} role="region" aria-label="Scrollable contribution calendar">
              <svg viewBox={`0 0 ${weeks * 13 + 26} 111`} className="w-full min-w-[560px]" role="img" aria-label={`${activeDays} active days in the past year. Longest contribution streak: ${bestStreak} days.`}>
                {months.map(month => <text key={`${month.week}-${month.label}`} x={month.week * 13 + 26} y={10} className="fill-subtle text-[9px]">{month.label}</text>)}
                {['Mon', 'Wed', 'Fri'].map((label, i) => <text key={label} x={0} y={35 + i * 26} className="fill-subtle text-[8px]">{label}</text>)}
                {days.map((day, i) => <rect key={day.date} x={Math.floor((i + offset) / 7) * 13 + 26} y={(i + offset) % 7 * 13 + 20} width={10} height={10} rx={2.5} fill={levels[day.level]}><title>{day.date}: {['No', 'Low', 'Moderate', 'High', 'Very high'][day.level]} contribution activity</title></rect>)}
              </svg>
            </div>
            <div className="mt-3 flex items-center justify-between gap-3 text-xs text-subtle"><span>Past year · Public GitHub activity</span><span className="flex items-center gap-1.5">Less{levels.map(color => <span key={color} className="size-2.5 rounded-[3px]" style={{ background: color }} />)}More</span></div>
          </>
        ) : <p role="status" className="py-8 text-center text-sm text-muted">Activity is temporarily unavailable. <a className="underline underline-offset-4" href={`https://github.com/${profile.github}`}>View it on GitHub</a>.</p>}
      </div>
      {!!data?.repositories.length && <div className="border-t border-line py-2">
        <p className="pt-4 text-xs font-medium text-subtle">Recently updated repositories</p>
        {data.repositories.map(repo => <a key={repo.name} href={repo.html_url} target="_blank" rel="noopener noreferrer" className="group flex items-start justify-between gap-4 border-b border-line py-4 last:border-0">
          <div className="min-w-0"><p className="flex items-center gap-2 text-sm font-medium"><GitFork className="size-4 shrink-0 text-subtle" aria-hidden="true" /><span className="truncate">{repo.name}</span></p>{repo.description && <p className="mt-1.5 line-clamp-2 text-xs leading-5 text-muted">{repo.description}</p>}<p className="mt-2 flex items-center gap-3 text-xs text-subtle">{repo.language}<span className="inline-flex items-center gap-1"><Star className="size-3" aria-hidden="true" />{repo.stargazers_count}</span></p></div>
          <ArrowUpRight className="mt-1 size-4 shrink-0 text-subtle transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
        </a>)}
      </div>}
    </div>
  );
}
