import { sameOrigin, rateLimit, fail, ownerPassword, sameSecret, makeSession, PaymentError } from '@/lib/payments/security';
export const runtime = 'nodejs';
export async function POST(request: Request) {
  try {
    sameOrigin(request);
    await rateLimit(request, 'admin-login', 5, 15);
    const { password } = await request.json();
    if (typeof password !== 'string' || password.length > 256 || !sameSecret(password, ownerPassword())) throw new PaymentError('Incorrect password.', 401);
    return Response.json({ ok: true }, { headers: { 'Cache-Control': 'no-store',
      'Set-Cookie': `payment_admin=${makeSession()}; HttpOnly; SameSite=Strict; Path=/api/payments/admin; Max-Age=28800${process.env.NODE_ENV === 'production' ? '; Secure' : ''}` } });
  } catch (e) { return fail(e); }
}
export async function DELETE(request: Request) {
  try { sameOrigin(request); return Response.json({ok:true}, { headers: {
    'Set-Cookie': 'payment_admin=; HttpOnly; SameSite=Strict; Path=/api/payments/admin; Max-Age=0',
    'Cache-Control': 'no-store',
  } }); } catch(e) { return fail(e); }
}
