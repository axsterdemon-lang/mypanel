import { randomBytes, randomUUID } from 'node:crypto';
import { allProducts } from './catalog';
import { paymentConfig } from './config';
import { detectMime, clean, receiptChecks } from './checks';
import { PaymentError, digest, ownerPassword, sameSecret } from './security';
import { readRecord, writeRecord } from './store';
import type { Method, PaymentOrder, ReceiptFields } from './types';

export function ready() {
  ownerPassword();
  if (!paymentConfig().enabled) throw new PaymentError('Online payments are being set up. Please contact the seller before paying.', 503);
}
export function publicOrder(order: PaymentOrder) {
  const { accessHash: _secret, receipt, ...rest } = order;
  return { ...rest, receipt: receipt ? { submittedAt: receipt.submittedAt, fields: receipt.fields, checks: receipt.checks } : undefined };
}
export async function createOrder(body: { productId?: string; device?: string; method?: string }) {
  ready();
  const product = allProducts.find(p => p.id === body.productId);
  if (!product || product.stock === 'out-of-stock') throw new PaymentError('Product is unavailable.');
  const device = body.device as keyof typeof product.prices;
  const price = product.prices[device];
  if (!product.devices.includes(device) || !price) throw new PaymentError('Select an available device.');
  const method = body.method as Method;
  if (!Object.hasOwn(paymentConfig().methods, method)) throw new PaymentError('Select a payment method.');
  const token = randomBytes(32).toString('base64url');
  const order: PaymentOrder = {
    id: `AXP-${randomUUID()}`, accessHash: digest(token), productId: product.id, productName: product.name,
    device, method, amountMinor: Math.round(price * 100 * (method === 'binance' ? 1 : paymentConfig().lkrPerUsd)),
    currency: method === 'binance' ? 'USDT' : 'LKR', createdAt: new Date().toISOString(), status: 'awaiting_payment',
  };
  if (!await writeRecord(`orders/${order.id}`, order, { onlyIfNew: true })) throw new PaymentError('Please try again.', 409);
  return { order: publicOrder(order), token };
}
export async function loadOrder(id: string) {
  if (!/^AXP-[0-9a-f-]{36}$/.test(id)) throw new PaymentError('Order not found.', 404);
  const record = await readRecord<PaymentOrder>(`orders/${id}`);
  if (!record) throw new PaymentError('Order not found.', 404);
  return record;
}
export async function customerOrder(id: string, token: string) {
  const record = await loadOrder(id);
  if (!token || !sameSecret(digest(token), record.value.accessHash)) throw new PaymentError('Order not found.', 404);
  return record;
}
export async function submitReceipt(id: string, token: string, bytes: Buffer, fields: ReceiptFields, ocrText: string) {
  ready();
  const record = await customerOrder(id, token);
  const order = record.value;
  if (order.status !== 'awaiting_payment') throw new PaymentError('This order already has a submitted receipt. Refresh its status.', 409);
  if (!bytes.length || bytes.length > 3 * 1024 * 1024) throw new PaymentError('Choose a file up to 3 MB.');
  const mime = detectMime(bytes);
  if (!mime) throw new PaymentError('Only JPG, PNG, WEBP or PDF slips are supported.');
  if (!fields || Object.keys(fields).length !== 6 || Object.values(fields).some(v => typeof v !== 'string' || v.length > 100)) throw new PaymentError('Invalid receipt fields.');
  if (!fields.account || !/^\d{1,9}(\.\d{1,2})?$/.test(fields.amount) || !['LKR','USDT'].includes(fields.currency) ||
    !/^\d{4}-\d{2}-\d{2}$/.test(fields.date) || !/^\d{2}:\d{2}$/.test(fields.time) || !/^[a-z0-9/_. -]{4,80}$/i.test(fields.reference) ||
    !Number.isFinite(Date.parse(`${fields.date}T${fields.time}:00+05:30`))) throw new PaymentError('Enter the account, amount, currency, date, time and transaction reference shown on your slip.');
  if (typeof ocrText !== 'string' || ocrText.length > 20000) throw new PaymentError('Receipt text is too long.');
  const fileHash = digest(bytes);
  // Conditional writes prevent concurrent reuse of the same file or reference across orders.
  const claims = [`claims/file/${fileHash}`, `claims/reference/${digest(`${order.method}:${clean(fields.reference)}`)}`];
  for (const key of claims) {
    const added = await writeRecord(key, { orderId: id }, { onlyIfNew: true });
    if (!added && (await readRecord<{orderId:string}>(key))?.value.orderId !== id) throw new PaymentError('This slip or reference was already submitted for another order. Contact the seller.', 409);
  }
  const receiptKey = `receipts/${id}/${fileHash}`;
  await writeRecord(receiptKey, { base64: bytes.toString('base64') }, { onlyIfNew: true });
  order.receipt = { key: receiptKey, hash: fileHash, mime, size: bytes.length, submittedAt: new Date().toISOString(),
    fields, ocrText, checks: receiptChecks(order, fields, ocrText) };
  // OCR/client fields are evidence for review only. They never prove receipt of funds.
  order.status = 'pending_review';
  if (!await writeRecord(`orders/${id}`, order, { onlyIfMatch: record.etag })) throw new PaymentError('Order changed. Refresh to see its status.', 409);
  return publicOrder(order);
}
export async function reviewOrder(id: string, status: string, confirmedInProvider: boolean, note: string) {
  if (!['approved','rejected'].includes(status) || typeof note !== 'string' || note.trim().length < 4 || note.length > 500) throw new PaymentError('Select a decision and add a review note.');
  const record = await loadOrder(id);
  if (record.value.status !== 'pending_review' || !record.value.receipt) throw new PaymentError('This order is not awaiting review.', 409);
  if (status === 'approved' && confirmedInProvider !== true) throw new PaymentError('Check the actual incoming transaction in your bank, eZ Cash or Binance account before approval.');
  record.value.status = status as 'approved' | 'rejected';
  record.value.decision = { at: new Date().toISOString(), note: note.trim(), confirmedInProvider: status === 'approved' && confirmedInProvider };
  if (!await writeRecord(`orders/${id}`, record.value, { onlyIfMatch: record.etag })) throw new PaymentError('Another review changed this order. Refresh.', 409);
  return publicOrder(record.value);
}
