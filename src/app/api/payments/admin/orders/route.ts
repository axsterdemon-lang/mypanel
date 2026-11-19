import { requireAdmin, fail, json } from '@/lib/payments/security';
import { publicOrder, loadOrder } from '@/lib/payments/service';
import { recordKeys } from '@/lib/payments/store';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export async function GET(request: Request) {
  try {
    requireAdmin(request);
    // A bounded review queue; customer tokens and receipt bytes never leave this endpoint.
    const keys = await recordKeys('orders/');
    const orders = await Promise.all(keys.map(k => loadOrder(k.slice(7)).then(r => publicOrder(r.value))));
    orders.sort((a,b) => b.createdAt.localeCompare(a.createdAt));
    return json({orders: orders.slice(0,100)});
  } catch(e) { return fail(e); }
}
