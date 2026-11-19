import { customerOrder, publicOrder, submitReceipt } from '@/lib/payments/service';
import { sameOrigin, rateLimit, fail, json, PaymentError } from '@/lib/payments/security';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
type Context = { params: Promise<{id:string}> };
const token = (r: Request) => r.headers.get('authorization')?.replace(/^Bearer /, '') || '';
export async function GET(request: Request, ctx: Context) {
  try { return json(publicOrder((await customerOrder((await ctx.params).id, token(request))).value)); } catch (e) { return fail(e); }
}
export async function POST(request: Request, ctx: Context) {
  try {
    sameOrigin(request);
    if (Number(request.headers.get('content-length') || 0) > 3 * 1024 * 1024 + 50000) throw new PaymentError('Choose a slip up to 3 MB.', 413);
    const id = (await ctx.params).id;
    await customerOrder(id, token(request));
    await rateLimit(request, 'upload-slip', 8, 60);
    const form = await request.formData();
    const file = form.get('slip');
    if (!(file instanceof File)) throw new PaymentError('Choose a payment slip.');
    return json(await submitReceipt(id, token(request), Buffer.from(await file.arrayBuffer()),
      JSON.parse(String(form.get('fields') || '{}')), String(form.get('ocrText') || '')));
  } catch (e) { return fail(e); }
}
