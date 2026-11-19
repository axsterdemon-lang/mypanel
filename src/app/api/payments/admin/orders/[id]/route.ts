import { requireAdmin, sameOrigin, fail, json, PaymentError } from '@/lib/payments/security';
import { reviewOrder, loadOrder } from '@/lib/payments/service';
import { readRecord } from '@/lib/payments/store';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
type Context = { params: Promise<{id:string}> };
export async function PATCH(request: Request, ctx: Context) {
  try {
    sameOrigin(request); requireAdmin(request);
    const body = await request.json();
    return json(await reviewOrder((await ctx.params).id, body.status, body.confirmedInProvider, body.note));
  } catch(e) { return fail(e); }
}
export async function GET(request: Request, ctx: Context) {
  try {
    requireAdmin(request);
    const order = (await loadOrder((await ctx.params).id)).value;
    if (!order.receipt) throw new PaymentError('Slip not found.', 404);
    const slip = await readRecord<{base64:string}>(order.receipt.key);
    if (!slip) throw new PaymentError('Slip not found.', 404);
    const extension = {'image/jpeg':'jpg','image/png':'png','image/webp':'webp','application/pdf':'pdf'}[order.receipt.mime] || 'bin';
    return new Response(Buffer.from(slip.value.base64, 'base64'), { headers: {
      'Content-Type': order.receipt.mime, 'Content-Disposition': `attachment; filename="${order.id}.${extension}"`,
      'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff', 'Content-Security-Policy': "default-src 'none'; sandbox",
    } });
  } catch(e) { return fail(e); }
}
