import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import path from 'node:path';

const queues = globalThis as typeof globalThis & { likesQueue?: Promise<unknown> };
const script = `
if ARGV[2] == 'like' then redis.call('SADD', KEYS[1], ARGV[1]) end
if ARGV[2] == 'unlike' then redis.call('SREM', KEYS[1], ARGV[1]) end
return {redis.call('SCARD', KEYS[1]), redis.call('SISMEMBER', KEYS[1], ARGV[1])}
`;

export async function getLikes(visitor: string, action: 'read' | 'like' | 'unlike' = 'read', projectId?: string) {
  const storePath = path.join(process.cwd(), '.data', projectId ? `likes-project-${projectId}.json` : 'likes.json');
  const key = projectId ? `devport:project:${projectId}:likes` : 'devport:about:likes';
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (url && token) {
    const response = await fetch(url, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(['EVAL', script, '1', key, visitor, action]),
      cache: 'no-store', signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) throw new Error('Likes unavailable');
    const data = await response.json();
    if (data.error || !Array.isArray(data.result)) throw new Error('Invalid likes response');
    return { count: Number(data.result[0]), liked: data.result[1] === 1 };
  }
  if (process.env.NODE_ENV === 'production') throw new Error('Likes store not configured');
  const operation = (queues.likesQueue ?? Promise.resolve()).catch(() => {}).then(async () => {
    let visitors: string[] = [];
    try { visitors = JSON.parse(await readFile(storePath, 'utf8')); }
    catch (error) { if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error; }
    const wasLiked = visitors.includes(visitor);
    if ((action === 'like' && !wasLiked) || (action === 'unlike' && wasLiked)) {
      visitors = action === 'like' ? [...visitors, visitor] : visitors.filter(item => item !== visitor);
      await mkdir(path.dirname(storePath), { recursive: true });
      await writeFile(`${storePath}.tmp`, JSON.stringify(visitors), 'utf8');
      await rename(`${storePath}.tmp`, storePath);
    }
    return { count: visitors.length, liked: visitors.includes(visitor) };
  });
  queues.likesQueue = operation;
  return operation;
}
