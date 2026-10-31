import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import path from 'node:path';

interface VisitStore { total: number; githubViews?: number; sessions: Record<string, number> }
export interface VisitCounts { total: number; online: number; githubViews: number }
const SESSION_MS = 30 * 60 * 1000;
const ONLINE_MS = 60 * 1000;
const storePath = path.join(process.cwd(), '.data', 'visits.json');
const globalStore = globalThis as typeof globalThis & { visitQueue?: Promise<unknown> };

// Both counters are updated atomically across server instances when Redis is configured.
const script = `
local now = tonumber(ARGV[1])
local session = ARGV[2]
redis.call('ZREMRANGEBYSCORE', KEYS[2], '-inf', now - 1800000)
if session ~= '' then
  if not redis.call('ZSCORE', KEYS[2], session) then redis.call('INCR', KEYS[1]) end
  redis.call('ZADD', KEYS[2], now, session)
end
if ARGV[3] == 'github' then redis.call('INCR', KEYS[3]) end
return {tonumber(redis.call('GET', KEYS[1]) or '0'), redis.call('ZCOUNT', KEYS[2], now - 60000, '+inf'), tonumber(redis.call('GET', KEYS[3]) or '0')}
`;

export async function getVisitCounts(session?: string, githubView = false): Promise<VisitCounts> {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  const now = Date.now();
  if (url && token) {
    const response = await fetch(url, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(['EVAL', script, '3', 'devport:visits:total', 'devport:visits:sessions', 'devport:github:views', now, session ?? '', githubView ? 'github' : '']),
      cache: 'no-store', signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) throw new Error('Visitor store unavailable');
    const result = await response.json();
    if (result.error || !Array.isArray(result.result)) throw new Error('Invalid visitor store response');
    return { total: Number(result.result[0]), online: Number(result.result[1]), githubViews: Number(result.result[2]) };
  }
  // A file survives local restarts. Production requires the shared, durable store above.
  if (process.env.NODE_ENV === 'production') throw new Error('Visitor store not configured');
  const operation = (globalStore.visitQueue ?? Promise.resolve()).catch(() => {}).then(async () => {
    let store: VisitStore = { total: 0, sessions: {} };
    try { store = JSON.parse(await readFile(storePath, 'utf8')); }
    catch (error) { if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error; }
    for (const [id, seen] of Object.entries(store.sessions)) if (seen <= now - SESSION_MS) delete store.sessions[id];
    if (session) {
      if (!store.sessions[session]) store.total++;
      store.sessions[session] = now;
    }
    if (githubView) store.githubViews = (store.githubViews ?? 0) + 1;
    if (session || githubView) {
      await mkdir(path.dirname(storePath), { recursive: true });
      await writeFile(`${storePath}.tmp`, JSON.stringify(store), 'utf8');
      await rename(`${storePath}.tmp`, storePath);
    }
    return { total: store.total, online: Object.values(store.sessions).filter(seen => seen >= now - ONLINE_MS).length, githubViews: store.githubViews ?? 0 };
  });
  globalStore.visitQueue = operation;
  return operation;
}
