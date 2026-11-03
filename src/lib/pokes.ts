import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import path from 'node:path';

const queues = globalThis as typeof globalThis & { pokesQueue?: Promise<unknown> };

export async function getPokes(increment = false) {
  const month = new Date().toISOString().slice(0, 7);
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (url && token) {
    const response = await fetch(url, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify([increment ? 'INCR' : 'GET', `devport:pokes:${month}`]),
      cache: 'no-store', signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) throw new Error('Pokes unavailable');
    const data = await response.json();
    const count = Number(data.result ?? 0);
    if (data.error || !Number.isSafeInteger(count) || count < 0) throw new Error('Invalid poke total');
    return { count, month };
  }
  if (process.env.NODE_ENV === 'production') throw new Error('Pokes store not configured');
  const storePath = path.join(process.cwd(), '.data', `pokes-${month}.json`);
  const operation = (queues.pokesQueue ?? Promise.resolve()).catch(() => {}).then(async () => {
    let count = 0;
    try { count = JSON.parse(await readFile(storePath, 'utf8')).count; }
    catch (error) { if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error; }
    if (!Number.isSafeInteger(count) || count < 0) throw new Error('Invalid poke total');
    if (increment) {
      count++;
      await mkdir(path.dirname(storePath), { recursive: true });
      await writeFile(`${storePath}.tmp`, JSON.stringify({ count }), 'utf8');
      await rename(`${storePath}.tmp`, storePath);
    }
    return { count, month };
  });
  queues.pokesQueue = operation;
  return operation;
}
