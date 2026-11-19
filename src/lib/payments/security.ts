import { createHash, createHmac, timingSafeEqual } from 'node:crypto';
import { readRecord, writeRecord } from './store';

export class PaymentError extends Error { constructor(message: string, public status = 400) { super(message); } }
export const digest = (s: string | Buffer) => createHash('sha256').update(s).digest('hex');
export const sameSecret = (a: string, b: string) => timingSafeEqual(Buffer.from(digest(a)), Buffer.from(digest(b)));
export function ownerPassword() {
  const password = process.env.PAYMENT_ADMIN_PASSWORD;
  if (!password || password.length < 16) throw new PaymentError('Payment review has not been configured by the owner.', 503);
  return password;
}
export function sameOrigin(request: Request) {
  const origin = request.headers.get('origin');
  const url = new URL(request.url);
  const host = request.headers.get('host') || url.host;
  // Next's dev server may normalize request.url to localhost while Host is 127.0.0.1.
  if (!origin || origin !== `${url.protocol}//${host}`) throw new PaymentError('Invalid request origin.', 403);
}
export async function rateLimit(request: Request, action: string, limit: number, minutes: number) {
  const ip = request.headers.get('x-nf-client-connection-ip') || (process.env.NODE_ENV === 'production' ? 'unknown' : 'local');
  const bucket = Math.floor(Date.now() / (minutes * 60000));
  const key = `limits/${action}/${digest(`${ip}:${bucket}`)}`;
  for (let attempt = 0; attempt < 12; attempt++) {
    const old = await readRecord<number>(key);
    if ((old?.value || 0) >= limit) throw new PaymentError('Too many requests. Please try again later.', 429);
    if (await writeRecord(key, (old?.value || 0) + 1, old ? { onlyIfMatch: old.etag } : { onlyIfNew: true })) return;
  }
  throw new PaymentError('Please wait and try again.', 429);
}
export function makeSession() {
  const expires = String(Date.now() + 8 * 60 * 60 * 1000);
  return `${expires}.${createHmac('sha256', ownerPassword()).update(expires).digest('hex')}`;
}
export function requireAdmin(request: Request) {
  const token = request.headers.get('cookie')?.split(';').map(s => s.trim()).find(s => s.startsWith('payment_admin='))?.slice(14) || '';
  const [expires, signature] = token.split('.');
  if (!expires || !signature || Number(expires) <= Date.now() || !sameSecret(signature,
    createHmac('sha256', ownerPassword()).update(expires).digest('hex'))) throw new PaymentError('Please sign in.', 401);
}
export function fail(error: unknown) {
  return Response.json({ error: error instanceof PaymentError ? error.message : 'Payment service is unavailable. Please try again or contact the seller.' },
    { status: error instanceof PaymentError ? error.status : 503, headers: { 'Cache-Control': 'no-store' } });
}
export const json = (data: unknown, status = 200) => Response.json(data, { status, headers: { 'Cache-Control': 'no-store' } });
