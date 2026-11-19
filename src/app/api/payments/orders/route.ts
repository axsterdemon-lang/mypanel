import { createOrder } from '@/lib/payments/service';
import { sameOrigin, rateLimit, fail, json, PaymentError } from '@/lib/payments/security';
export const runtime = 'nodejs';
export async function POST(request: Request) {
  try {
    sameOrigin(request);
    if (Number(request.headers.get('content-length') || 0) > 4096) throw new PaymentError('Request too large.', 413);
    await rateLimit(request, 'new-order', 20, 60);
    return json(await createOrder(await request.json()), 201);
  } catch (e) { return fail(e); }
}
