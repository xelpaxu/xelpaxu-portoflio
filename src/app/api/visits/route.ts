import { randomUUID } from 'node:crypto';
import { cookies } from 'next/headers';
import { getVisitCounts } from '@/lib/visits';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
const headers = { 'Cache-Control': 'no-store' };

export async function GET() {
  try { return Response.json(await getVisitCounts(), { headers }); }
  catch { return Response.json({ available: false }, { status: 503, headers }); }
}

export async function POST(request: Request) {
  const origin = request.headers.get('origin');
  if (origin && origin !== new URL(request.url).origin) return new Response(null, { status: 403 });
  const jar = await cookies();
  const existing = jar.get('portfolio-visit')?.value ?? request.headers.get('x-portfolio-visit');
  const session = existing && /^[0-9a-f-]{36}$/.test(existing) ? existing : randomUUID();
  try {
    const counts = await getVisitCounts(session);
    jar.set('portfolio-visit', session, {
      httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production',
      maxAge: 1800, path: '/',
    });
    return Response.json(counts, { headers });
  } catch { return Response.json({ available: false }, { status: 503, headers }); }
}
