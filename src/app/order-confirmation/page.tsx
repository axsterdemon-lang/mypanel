'use client';
import React, {useEffect,useState} from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import {paymentRequest,savedOrders} from '@/lib/payments/client';
import {statusLabels,type PaymentOrder} from '@/lib/payments/types';
type PublicOrder=Omit<PaymentOrder,'accessHash'>;
export default function OrderPage(){
  const [orders,setOrders]=useState<PublicOrder[]>([]);
  const [message,setMessage]=useState('');
  const [busy,setBusy]=useState(false);
  const refresh=async()=>{setBusy(true);setMessage('');try{
    const saved=savedOrders();
    const results=await Promise.allSettled(saved.map(o=>paymentRequest('/api/payments/orders/'+o.id,{headers:{Authorization:'Bearer '+o.token}})));
    setOrders(results.filter((r):r is PromiseFulfilledResult<PublicOrder>=>r.status==='fulfilled').map(r=>r.value));
    if(results.some(r=>r.status==='rejected'))setMessage('Some order statuses could not be loaded. Please retry.');
  }catch{setMessage('Could not load orders. Please retry.');}finally{setBusy(false);}};
  useEffect(()=>{void refresh();},[]);
  return <main className="min-h-screen bg-background text-foreground"><Header/><section className="max-w-3xl mx-auto px-4 pt-28 pb-20 space-y-6">
    <h1 className="text-3xl font-bold">My orders & payment status</h1>
    <p className="text-muted-foreground">Only payments confirmed by the store are marked approved. Keep access to this browser to view your orders.</p>
    <button onClick={refresh} disabled={busy} className="border border-primary rounded-xl px-5 py-3">{busy?'Refreshing…':'Refresh status'}</button>
    {message&&<p role="status">{message}</p>}
    {!orders.length&&!busy&&<p>No saved orders in this browser. <Link href="/products" className="text-primary">Browse products</Link></p>}
    {orders.map(o=><article key={o.id} className="bg-card border border-border rounded-2xl p-5 space-y-3">
      <h2 className="text-xl font-bold">{o.productName} · {o.device}</h2><p className="font-mono text-sm break-all">{o.id}</p>
      <p>{(o.amountMinor/100).toFixed(2)} {o.currency} · {o.method}</p>
      <p className={o.status==='approved'?'text-green-400':o.status==='rejected'?'text-red-400':'text-yellow-400'}>{statusLabels[o.status]}</p>
      {o.receipt&&<><p>Slip received: {new Date(o.receipt.submittedAt).toLocaleString()}</p><ul className="space-y-1 text-sm">{o.receipt.checks.map(c=><li key={c.label}>{c.label}: {c.result==='match'?'Details match — still awaiting review':'Needs manual review'}</li>)}</ul></>}
      {o.status==='pending_review'&&<p>Slip checks do not confirm receipt of money. The seller is checking the incoming transaction.</p>}
      {o.decision&&<p>Seller review: {o.decision.note}</p>}
      {o.status==='awaiting_payment'&&<Link href={'/checkout?order='+o.id} className="text-primary block">Continue payment / upload slip</Link>}
    </article>)}
  </section><Footer/></main>;
}
