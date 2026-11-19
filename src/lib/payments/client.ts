export async function paymentRequest(url: string, init?: RequestInit) {
  const response = await fetch(url, { ...init, cache: 'no-store' });
  let data;
  try { data = await response.json(); }
  catch { throw new Error('The payment service did not respond in time. Please refresh your order status before trying again.'); }
  if (!response.ok) throw new Error(data.error || 'Request failed. Please try again.');
  return data;
}
export function savedOrders(): { id: string; token: string }[] {
  try { return JSON.parse(localStorage.getItem('payment-orders-v1') || '[]'); } catch { return []; }
}
export function saveOrder(id: string, token: string) {
  localStorage.setItem('payment-orders-v1', JSON.stringify([{id,token}, ...savedOrders().filter(o => o.id !== id)].slice(0,20)));
}
