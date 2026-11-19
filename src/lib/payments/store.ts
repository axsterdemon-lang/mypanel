import { getStore } from '@netlify/blobs';
import { createHash, randomUUID } from 'node:crypto';
import { mkdir, readFile, writeFile, rename, open, unlink, readdir } from 'node:fs/promises';
import path from 'node:path';

// Production never falls back to ephemeral serverless disk.
const localRoot = () => path.resolve(process.env.PAYMENTS_DATA_DIR || '.payment-data');
const local = () => process.env.NODE_ENV !== 'production' && !process.env.NETLIFY;
// Storage requests must bypass Next's fetch/Data Cache, which itself uses Blobs on Netlify.
// This follows the unpatched-fetch strategy used by Netlify's Next.js runtime.
export const storageFetch: typeof fetch = async (input, init) => {
  const current = globalThis.fetch as typeof fetch & { _nextOriginalFetch?: typeof fetch };
  const original = current._nextOriginalFetch || current;
  const method = init?.method || 'GET';
  if (process.env.NODE_ENV === 'production') console.info('[payment-storage] request', method);
  try {
    const response = await original(input, { ...init, cache: 'no-store', signal: init?.signal || AbortSignal.timeout(5000) });
    if (process.env.NODE_ENV === 'production') console.info('[payment-storage] response', method, response.status);
    return response;
  } catch (error) {
    if (process.env.NODE_ENV === 'production') console.error('[payment-storage] transport-error', (error as Error).name);
    throw error;
  }
};
const cloud = () => getStore({ name: 'private-payment-orders-v1', consistency: 'strong', fetch: storageFetch });
const hash = (s: string) => createHash('sha256').update(s).digest('hex');
const filename = (key: string) => path.join(localRoot(), `${Buffer.from(key).toString('base64url')}.json`);

export async function readRecord<T>(key: string): Promise<{ value: T; etag: string } | null> {
  if (!local()) {
    if (process.env.NODE_ENV === 'production') console.info('[payment-storage] read', key.split('/')[0]);
    const entry = await cloud().getWithMetadata(key, { type: 'json' });
    if (process.env.NODE_ENV === 'production') console.info('[payment-storage] read-complete', Boolean(entry));
    if (entry && !entry.etag) throw new Error('Payment store returned no concurrency token.');
    return entry ? { value: entry.data as T, etag: entry.etag! } : null;
  }
  try {
    const raw = await readFile(filename(key), 'utf8');
    return { value: JSON.parse(raw) as T, etag: hash(raw) };
  } catch (e) { if ((e as NodeJS.ErrnoException).code === 'ENOENT') return null; throw e; }
}

export async function writeRecord(key: string, value: unknown, opts: { onlyIfNew?: boolean; onlyIfMatch?: string } = {}) {
  if (!local()) return (await cloud().setJSON(key, value, opts.onlyIfNew ? { onlyIfNew: true } : opts.onlyIfMatch ? { onlyIfMatch: opts.onlyIfMatch } : {})).modified;
  await mkdir(localRoot(), { recursive: true });
  const lockName = `${filename(key)}.lock`;
  let lock;
  for (let i = 0; i < 100; i++) {
    try { lock = await open(lockName, 'wx'); break; }
    catch (e) { if ((e as NodeJS.ErrnoException).code !== 'EEXIST') throw e; await new Promise(r => setTimeout(r, 10)); }
  }
  if (!lock) throw new Error('Payment store is busy. Try again.');
  try {
    const old = await readRecord(key);
    if (opts.onlyIfNew && old || opts.onlyIfMatch && old?.etag !== opts.onlyIfMatch) return false;
    const temp = `${filename(key)}.${randomUUID()}.tmp`;
    await writeFile(temp, JSON.stringify(value), { mode: 0o600 });
    await rename(temp, filename(key));
    return true;
  } finally { await lock.close(); await unlink(lockName); }
}

export async function recordKeys(prefix: string) {
  if (!local()) {
    const result = await cloud().list({ prefix });
    return result.blobs.map(b => b.key);
  }
  await mkdir(localRoot(), { recursive: true });
  return (await readdir(localRoot())).filter(n => n.endsWith('.json'))
    .map(n => Buffer.from(n.slice(0, -5), 'base64url').toString()).filter(k => k.startsWith(prefix));
}
