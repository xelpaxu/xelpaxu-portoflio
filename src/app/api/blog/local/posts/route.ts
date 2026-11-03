import { allowLocalBlog, BlogError, readLocalBlogs, saveLocalBlog } from '@/lib/blog-local';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
const headers = { 'Cache-Control': 'no-store' };
export async function GET(request: Request) {
  if (!allowLocalBlog(request)) return new Response(null, { status: 404 });
  try { return Response.json(await readLocalBlogs(), { headers }); }
  catch (error) { return Response.json({ error: error instanceof BlogError ? error.message : 'Could not read the blog file.' }, { status: 409, headers }); }
}
export async function POST(request: Request) {
  if (!allowLocalBlog(request, true)) return new Response(null, { status: 404 });
  try {
    const text = await request.text();
    if (Buffer.byteLength(text) > 500000) return Response.json({ error: 'Keep each post under 500 KB.' }, { status: 413 });
    let data: unknown;
    try { data = JSON.parse(text); } catch { throw new BlogError('Invalid request.'); }
    return Response.json(await saveLocalBlog(data), { headers });
  } catch (error) {
    return Response.json({ error: error instanceof BlogError ? error.message : 'Could not save the blog file. Your edits are still in the editor.' }, { status: error instanceof BlogError ? error.status : 500, headers });
  }
}
