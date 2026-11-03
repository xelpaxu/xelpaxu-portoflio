import { getPokes } from '@/lib/pokes';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
const headers = { 'Cache-Control': 'no-store' };
async function respond(increment: boolean) {
  try { return Response.json(await getPokes(increment), { headers }); }
  catch { return Response.json({ error: 'Pokes are unavailable. Try again shortly.' }, { status: 503, headers }); }
}
export async function GET() { return respond(false); }
export async function POST(request: Request) {
  const origin = request.headers.get('origin');
  if (origin && origin !== new URL(request.url).origin) return new Response(null, { status: 403 });
  return respond(true);
}
