import type { ContributionDay } from '@/types/github';

export function getActivityHighlights(input: ContributionDay[]) {
  const days = [...input].sort((a, b) => a.date.localeCompare(b.date));
  let run: string[] = [];
  let longest: string[] = [];
  let previousDate = '';
  const months = new Map<string, number>();
  for (const day of days) {
    const consecutive = previousDate && Date.parse(`${day.date}T00:00:00Z`) - Date.parse(`${previousDate}T00:00:00Z`) === 86_400_000;
    if (!consecutive || !day.level) run = [];
    if (day.level > 0) {
      run.push(day.date);
      if (run.length >= longest.length) longest = [...run];
      const month = day.date.slice(0, 7);
      months.set(month, (months.get(month) ?? 0) + 1);
    }
    previousDate = day.date;
  }
  const busiest = [...months.entries()].sort((a, b) => b[1] - a[1] || b[0].localeCompare(a[0]))[0];
  return { longest, busiestMonth: busiest?.[0] ?? '', busiestActiveDays: busiest?.[1] ?? 0 };
}
