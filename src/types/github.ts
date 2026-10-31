export interface ContributionDay { date: string; level: number }
export interface GitHubRepository {
  name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
}
export interface GitHubActivity {
  username: string;
  days: ContributionDay[];
  repositories: GitHubRepository[];
  calendarAvailable: boolean;
  repositoriesAvailable: boolean;
}
