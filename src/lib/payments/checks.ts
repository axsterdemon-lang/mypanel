import type { PaymentOrder, ReceiptFields } from './types';
import { paymentConfig } from './config';

export const clean = (s: string) => s.normalize('NFKC').replace(/[^a-z0-9]/gi, '').toLowerCase();
export function receiptChecks(order: PaymentOrder, fields: ReceiptFields, ocrText: string) {
  const text = clean(ocrText);
  const account = paymentConfig().methods[order.method].account;
  const date = Date.parse(`${fields.date}T${fields.time}:00+05:30`);
  const amount = /^\d{1,9}(\.\d{1,2})?$/.test(fields.amount) ? Math.round(Number(fields.amount) * 100) : NaN;
  const checks = [
    { label: 'Receiving account / number', ok: clean(fields.account) === clean(account) && text.includes(clean(account)) },
    { label: 'Amount and currency', ok: amount === order.amountMinor && fields.currency === order.currency && text.includes(clean(fields.amount)) && text.includes(clean(fields.currency)) },
    { label: 'Transaction date and time (Sri Lanka)', ok: Number.isFinite(date) && date >= Date.parse(order.createdAt) - 10 * 60000 && date <= Date.now() + 5 * 60000 &&
      text.includes(clean(fields.time)) && [fields.date, fields.date.split('-').reverse().join('-')].some(d => text.includes(clean(d))) },
    { label: 'Transaction reference', ok: clean(fields.reference).length >= 4 && text.includes(clean(fields.reference)) },
  ];
  return checks.map(c => ({ label: c.label, result: (c.ok ? 'match' : 'review') as 'match' | 'review' }));
}
export function detectMime(bytes: Buffer) {
  if (bytes.subarray(0, 8).equals(Buffer.from([137,80,78,71,13,10,26,10]))) return 'image/png';
  if (bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255) return 'image/jpeg';
  if (bytes.subarray(0,4).toString() === 'RIFF' && bytes.subarray(8,12).toString() === 'WEBP') return 'image/webp';
  if (bytes.subarray(0,5).toString() === '%PDF-') return 'application/pdf';
  return null;
}
