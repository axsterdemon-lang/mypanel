import { paymentConfig } from '@/lib/payments/config';
import { json, fail } from '@/lib/payments/security';
import { ready } from '@/lib/payments/service';
export const dynamic = 'force-dynamic';
export async function GET() { try { ready(); return json(paymentConfig()); } catch (e) { return fail(e); } }
