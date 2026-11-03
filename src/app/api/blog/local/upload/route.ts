import { randomUUID } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { allowLocalBlog } from '@/lib/blog-local';

export const runtime = 'nodejs';
export async function POST(request: Request) {
  if (!allowLocalBlog(request, true)) return new Response(null, { status: 404 });
  try {
    const form = await request.formData();
    const file = form.get('image');
    if (!(file instanceof File) || !file.size || file.size > 5 * 1024 * 1024) return Response.json({ error: 'Choose an image under 5 MB.' }, { status: 400 });
    const bytes = Buffer.from(await file.arrayBuffer());
    let extension = '';
    if (bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))) extension = 'png';
    else if (bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255) extension = 'jpg';
    else if (bytes.subarray(0, 4).toString() === 'RIFF' && bytes.subarray(8, 12).toString() === 'WEBP') extension = 'webp';
    else if (['GIF87a', 'GIF89a'].includes(bytes.subarray(0, 6).toString())) extension = 'gif';
    if (!extension) return Response.json({ error: 'Use a PNG, JPEG, WebP, or GIF image.' }, { status: 400 });
    const filename = `${Date.now()}-${randomUUID().slice(0, 8)}.${extension}`;
    const directory = path.join(process.cwd(), 'public/assets/blog');
    await mkdir(directory, { recursive: true });
    await writeFile(path.join(directory, filename), bytes, { flag: 'wx' });
    return Response.json({ url: `/assets/blog/${filename}` }, { headers: { 'Cache-Control': 'no-store' } });
  } catch { return Response.json({ error: 'Could not upload this image.' }, { status: 500 }); }
}
