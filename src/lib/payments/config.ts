import type { Method } from './types';

export function paymentConfig() {
  const rate = Number(process.env.PAYMENT_LKR_PER_USD || 300);
  if (!Number.isFinite(rate) || rate <= 0) throw new Error('Payment pricing configuration is unavailable.');
  return {
    // The owner password is the only required dashboard setting. Explicit false pauses checkout.
    enabled: process.env.PAYMENTS_ENABLED !== 'false' && Boolean(process.env.PAYMENT_ADMIN_PASSWORD),
    lkrPerUsd: rate,
    methods: {
      bank: { label: 'Bank transfer', currency: 'LKR', account: '001021031868', details: [
        ['Bank', 'Dialog Finance Bank'], ['Account name', 'W.A.G Wanasingha'],
        ['Account number', '001021031868'], ['Branch', 'Head Office'],
      ] },
      ezcash: { label: 'eZ Cash', currency: 'LKR', account: '0743057846', details: [
        ['Receiving number', '0743057846'],
      ] },
      binance: { label: 'Binance', currency: 'USDT', account: '970871875', details: [
        ['Binance receiving ID', '970871875'],
        ['Before sending', 'Confirm this receiving ID and recipient inside Binance. Contact the seller if Binance cannot find the recipient.'],
      ] },
    } satisfies Record<Method, {label: string; currency: string; account: string; details: string[][]}>,
  };
}
