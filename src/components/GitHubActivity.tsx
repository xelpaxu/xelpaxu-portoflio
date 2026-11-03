'use client';

import { useEffect, useState } from 'react';
import { ArrowUpRight, GitFork, Star } from 'lucide-react';
import { FaGithub } from 'react-icons/fa';
import { profile } from '@/data/profile';
import type { GitHubActivity as Activity } from '@/types/github';
import ContributionCalendar from './ContributionCalendar';
import LiveVisits from './LiveVisits';

const levels = ['var(--activity-0)', 'var(--activity-1)', 'var(--activity-2)', 'var(--activity-3)', 'var(--activity-4)'];

export default function GitHubActivity() {
  const [data, setData] = useState<Activity | null>(null);
  const [failed, setFailed] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState('all');
  const [selectedDate, setSelectedDate] = useState('');
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
  const monthOptions = [...new Set(pastDays.map(day => day.date.slice(0, 7)))];
  const inspectableDays = pastDays.filter(day => selectedMonth === 'all' || day.date.startsWith(selectedMonth));
  const inspectedDay = inspectableDays.find(day => day.date === selectedDate);
  const activityLabels = ['No', 'Low', 'Moderate', 'High', 'Very high'];
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
          <span className="flex size-10 items-center justify-start"><FaGithub className="size-5 text-accent" aria-hidden="true" /></span>
          <div><p className="text-sm font-semibold text-accent">@{profile.github}</p><p className="mt-0.5 text-xs text-subtle">Building in public</p></div>
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
              <p><span className="text-2xl font-semibold tracking-tight text-accent">{activeDays}</span><span className="ml-2 text-sm text-muted">active days</span></p>
              <p className="text-sm text-muted">Longest streak <span className="ml-1 font-medium text-foreground">{bestStreak} days</span></p>
            </div>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs text-muted">Hover or tap a day to explore.</p>
              <label className="flex items-center gap-2 text-xs text-muted">Highlight
                <select value={selectedMonth} onChange={event => { setSelectedMonth(event.target.value); setSelectedDate(''); }} className="min-h-11 max-w-full rounded-lg border border-line bg-transparent px-3 text-foreground">
                  <option value="all" className="bg-page">Past year</option>
                  {monthOptions.map(month => <option key={month} value={month} className="bg-page">{new Date(`${month}-01T12:00:00Z`).toLocaleDateString('en', { month: 'long', year: 'numeric', timeZone: 'UTC' })}</option>)}
                </select>
              </label>
            </div>
            <ContributionCalendar days={days} offset={offset} weeks={weeks} months={months} inspectedDate={inspectedDay?.date} highlightedDates={new Set(days.filter(day => day.date <= today && (selectedMonth === 'all' || day.date.startsWith(selectedMonth))).map(day => day.date))} onSelect={date => { if (date <= today && (selectedMonth === 'all' || date.startsWith(selectedMonth))) setSelectedDate(date); }} />
            <div className="mt-3 flex items-center justify-between gap-3 text-xs text-subtle"><span>Past year · Public GitHub activity</span><span className="flex items-center gap-1.5">Less{levels.map(color => <span key={color} className="size-2.5 rounded-[3px]" style={{ background: color }} />)}More</span></div>
            <div className="mt-4 flex min-h-11 flex-wrap items-center justify-between gap-2 border-t border-line pt-3 text-xs">
              {inspectedDay ? <><span className="text-strong">{new Date(`${inspectedDay.date}T12:00:00Z`).toLocaleDateString('en', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' })}</span><span className="flex items-center gap-2 text-muted"><span className="size-2 rounded-full" style={{ background: levels[inspectedDay.level] }} />{activityLabels[inspectedDay.level]} activity</span></> : <span className="text-subtle">Hover or tap a contribution to see its activity.</span>}
            </div>
          </>
        ) : <p role="status" className="py-8 text-center text-sm text-muted">Activity is temporarily unavailable. <a className="underline underline-offset-4" href={`https://github.com/${profile.github}`}>View it on GitHub</a>.</p>}
      </div>
      {!!data?.repositories.length && <div className="border-t border-line py-2">
        <p className="pt-4 text-xs font-medium text-subtle">Recently updated repositories</p>
        {data.repositories.map(repo => <a key={repo.name} href={repo.html_url} target="_blank" rel="noopener noreferrer" className="group flex items-start justify-between gap-4 border-b border-line py-4 last:border-0">
          <div className="min-w-0"><p className="flex items-center gap-2 text-sm font-medium group-hover:text-accent"><GitFork className="size-4 shrink-0 text-subtle" aria-hidden="true" /><span className="truncate">{repo.name}</span></p>{repo.description && <p className="mt-1.5 line-clamp-2 text-xs leading-5 text-muted">{repo.description}</p>}<p className="mt-2 flex items-center gap-3 text-xs text-subtle">{repo.language}<span className="inline-flex items-center gap-1"><Star className="size-3" aria-hidden="true" />{repo.stargazers_count}</span></p></div>
          <ArrowUpRight className="mt-1 size-4 shrink-0 text-subtle transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
        </a>)}
      </div>}
    </div>
  );
}
