export type Method = 'bank' | 'ezcash' | 'binance';
export type PaymentStatus = 'awaiting_payment' | 'pending_review' | 'approved' | 'rejected';
export type ReceiptFields = {
  account: string; amount: string; currency: string; date: string; time: string; reference: string;
};
export type PaymentOrder = {
  id: string; accessHash: string; productId: string; productName: string; device: string;
  method: Method; amountMinor: number; currency: 'LKR' | 'USDT'; createdAt: string;
  status: PaymentStatus; receipt?: {
    key: string; hash: string; mime: string; size: number; submittedAt: string;
    fields: ReceiptFields; ocrText: string; checks: { label: string; result: 'match' | 'review' }[];
  };
  decision?: { at: string; note: string; confirmedInProvider: boolean };
};
export const statusLabels: Record<PaymentStatus, string> = {
  awaiting_payment: 'Awaiting payment / ගෙවීම බලාපොරොත්තුවෙන්',
  pending_review: 'Payment under review / ගෙවීම පරීක්ෂා වෙමින්',
  approved: 'Payment approved / ගෙවීම තහවුරු කළා',
  rejected: 'Payment not approved / ගෙවීම අනුමත කර නැහැ',
};
