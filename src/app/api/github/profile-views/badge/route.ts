import { getVisitCounts } from '@/lib/visits';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** Embed only in the GitHub profile README; the portfolio reads totals separately. */
export async function GET() {
  try {
    const { githubViews } = await getVisitCounts(undefined, true);
    const count = githubViews.toLocaleString('en');
    const width = 111 + count.length * 8;
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="24" role="img" aria-label="Profile badge views: ${count}"><rect width="${width}" height="24" rx="5" fill="#242429"/><path d="M0 0h104v24H0z" fill="#34343b"/><g fill="#fafafa" font-family="Arial,sans-serif" font-size="11"><text x="10" y="16">Profile badge views</text><text x="111" y="16">${count}</text></g></svg>`;
    return new Response(svg, { headers: { 'Content-Type': 'image/svg+xml', 'Cache-Control': 'no-store, max-age=0', 'X-Content-Type-Options': 'nosniff' } });
  } catch { return new Response('Profile tracking unavailable', { status: 503, headers: { 'Cache-Control': 'no-store' } }); }
}
