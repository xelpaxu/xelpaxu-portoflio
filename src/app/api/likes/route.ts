import { cookies } from 'next/headers';
import { randomUUID } from 'node:crypto';
import { projects } from '@/data/projects/projects';
import { getLikes } from '@/lib/likes';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
const headers = { 'Cache-Control': 'no-store' };

async function respond(request: Request, action: 'read' | 'like' | 'unlike') {
  const projectId = new URL(request.url).searchParams.get('project') ?? undefined;
  if (projectId !== undefined && !projects.some(project => project.id === projectId)) {
    return Response.json({ error: 'Project not found.' }, { status: 404, headers });
  }
  const jar = await cookies();
  const stored = jar.get('portfolio-like')?.value;
  const visitor = stored && /^[0-9a-f-]{36}$/.test(stored) ? stored : randomUUID();
  try {
    const result = await getLikes(visitor, action, projectId);
    jar.set('portfolio-like', visitor, {
      httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production',
      maxAge: 365 * 24 * 60 * 60, path: '/',
    });
    return Response.json(result, { headers });
  } catch {
    return Response.json({ error: 'Likes are unavailable. Please try again later.' }, { status: 503, headers });
  }
}

export async function GET(request: Request) { return respond(request, 'read'); }
export async function POST(request: Request) {
  const origin = request.headers.get('origin');
  if (origin && origin !== new URL(request.url).origin) return new Response(null, { status: 403 });
  return respond(request, 'like');
}

export async function DELETE(request: Request) {
  const origin = request.headers.get('origin');
  if (origin && origin !== new URL(request.url).origin) return new Response(null, { status: 403 });
  return respond(request, 'unlike');
}
