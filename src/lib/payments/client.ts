export async function paymentRequest(url: string, init?: RequestInit) {
  const response = await fetch(url, { ...init, cache: 'no-store' });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Request failed. Please try again.');
  return data;
}
export function savedOrders(): { id: string; token: string }[] {
  try { return JSON.parse(localStorage.getItem('payment-orders-v1') || '[]'); } catch { return []; }
}
export function saveOrder(id: string, token: string) {
  localStorage.setItem('payment-orders-v1', JSON.stringify([{id,token}, ...savedOrders().filter(o => o.id !== id)].slice(0,20)));
}
