import { profile } from '@/data/profile';
import type { ContributionDay, GitHubActivity, GitHubRepository } from '@/types/github';

export const revalidate = 3600;

async function readPublicResource(url: string) {
  const response = await fetch(url, {
    headers: { 'User-Agent': 'xelpaxu-portfolio' },
    next: { revalidate: 3600 },
    signal: AbortSignal.timeout(8000),
  });
  if (!response.ok) throw new Error(`GitHub returned ${response.status}`);
  return response;
}

export async function GET() {
  const [calendar, repos] = await Promise.allSettled([
    readPublicResource(`https://github.com/users/${profile.github}/contributions`).then(r => r.text()),
    readPublicResource(`https://api.github.com/users/${profile.github}/repos?sort=pushed&per_page=30`).then(r => r.json()),
  ]);
  const days: ContributionDay[] = [];
  if (calendar.status === 'fulfilled') {
    // GitHub's public calendar includes date and intensity on each calendar cell.
    for (const match of calendar.value.matchAll(/<(?:td|rect)\b[^>]*data-date="([^"]+)"[^>]*>/g)) {
      const level = match[0].match(/data-level="([0-4])"/);
      if (level && /^\d{4}-\d{2}-\d{2}$/.test(match[1])) days.push({ date: match[1], level: Number(level[1]) });
    }
    days.sort((a, b) => a.date.localeCompare(b.date));
  }
  const repositories: GitHubRepository[] = repos.status === 'fulfilled' && Array.isArray(repos.value)
    ? repos.value.filter((repo: { fork: boolean; archived: boolean }) => !repo.fork && !repo.archived)
      .slice(0, 3).map((repo: GitHubRepository) => ({
        name: repo.name, description: repo.description, html_url: repo.html_url,
        language: repo.language, stargazers_count: repo.stargazers_count,
      })) : [];
  const data: GitHubActivity = {
    username: profile.github, days, repositories,
    calendarAvailable: days.length > 0,
    repositoriesAvailable: repos.status === 'fulfilled' && Array.isArray(repos.value),
  };
  const complete = data.calendarAvailable && data.repositoriesAvailable;
  return Response.json(data, {
    headers: { 'Cache-Control': complete ? 'public, s-maxage=3600, stale-while-revalidate=86400' : 'no-store' },
  });
}
