'use client';
import React, {useEffect,useState} from 'react';
import Link from 'next/link';
import {paymentRequest} from '@/lib/payments/client';
import {statusLabels,type PaymentOrder} from '@/lib/payments/types';
type Order=Omit<PaymentOrder,'accessHash'>;
function Review({order,onDone,onError}:{order:Order;onDone:()=>Promise<void>;onError:(s:string)=>void}){
  const [note,setNote]=useState(''); const [confirmed,setConfirmed]=useState(false); const [busy,setBusy]=useState(false);
  async function decide(status:string){setBusy(true);try{
    await paymentRequest(`/api/payments/admin/orders/${order.id}`,{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({status,note,confirmedInProvider:confirmed})});
    await onDone();
  }catch(e){onError((e as Error).message);}finally{setBusy(false);}}
  return <article className="border border-border bg-card rounded-2xl p-5 space-y-3">
    <h2 className="text-xl font-bold">{order.productName} · {order.device}</h2><p className="font-mono text-sm break-all">{order.id}</p>
    <p>{(order.amountMinor/100).toFixed(2)} {order.currency} · {order.method}</p><p>{statusLabels[order.status]}</p>
    {order.receipt&&<><a href={`/api/payments/admin/orders/${order.id}`} className="text-primary underline">Download original slip (private)</a>
      <dl className="grid sm:grid-cols-2 gap-2">{Object.entries(order.receipt.fields).map(([key,value])=><div key={key}><dt className="text-sm text-muted-foreground">{key}</dt><dd className="break-all">{value}</dd></div>)}</dl>
      <ul>{order.receipt.checks.map(c=><li key={c.label}>{c.label}: {c.result==='match'?'OCR / entered details match':'Manual review required'}</li>)}</ul>
    </>}
    {order.status==='pending_review'&&<><p className="text-yellow-400">Open the original slip and compare it with the actual incoming transaction in your bank, eZ Cash or Binance account.</p>
      <label className="flex gap-3"><input type="checkbox" checked={confirmed} onChange={e=>setConfirmed(e.target.checked)}/><span>I found the incoming transaction and matched the recipient, amount, currency, date/time and reference.</span></label>
      <label className="block">Review note (visible to customer)<textarea required minLength={4} maxLength={500} value={note} onChange={e=>setNote(e.target.value)} className="block w-full bg-background border border-border rounded-xl p-3 text-base"/></label>
      <div className="flex gap-3"><button disabled={!confirmed||note.trim().length<4||busy} onClick={()=>decide('approved')} className="rounded-xl bg-green-800 px-5 py-3 disabled:opacity-40">Approve payment</button><button disabled={note.trim().length<4||busy} onClick={()=>decide('rejected')} className="rounded-xl bg-red-900 px-5 py-3 disabled:opacity-40">Reject payment</button></div>
    </>}{order.decision&&<p>Decision: {order.decision.note} · {new Date(order.decision.at).toLocaleString()}</p>}
  </article>;
}
export default function PaymentAdmin(){
  const [password,setPassword]=useState(''); const [orders,setOrders]=useState<Order[]>([]); const [signedIn,setSignedIn]=useState(false); const [message,setMessage]=useState(''); const [busy,setBusy]=useState(false);
  const refresh=async()=>{const result=await paymentRequest('/api/payments/admin/orders');setOrders(result.orders);setSignedIn(true);};
  useEffect(()=>{refresh().catch(()=>{});},[]);
  async function login(e:React.FormEvent){e.preventDefault();setBusy(true);setMessage('');try{await paymentRequest('/api/payments/admin/session',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({password})});setPassword('');await refresh();}catch(e){setMessage((e as Error).message);}finally{setBusy(false);}}
  return <main className="min-h-screen bg-background text-foreground"><section className="mx-auto max-w-4xl px-4 py-12 space-y-5"><Link href="/" className="text-primary">Store home</Link><h1 className="text-3xl font-bold">Payment review</h1>
    <p>Owner access only. Payment slips never approve themselves.</p>{message&&<p role="alert" className="p-4 border border-primary rounded-xl">{message}</p>}
    {!signedIn?<form onSubmit={login} className="space-y-4 max-w-md"><label className="block">Owner review password<input required type="password" autoComplete="current-password" value={password} onChange={e=>setPassword(e.target.value)} className="w-full block border border-border bg-card rounded-xl p-3 text-base"/></label><button disabled={busy} className="rounded-xl bg-fire-gradient px-6 py-3">{busy?'Signing in…':'Sign in'}</button></form>:
      <><div className="flex gap-3"><button onClick={()=>refresh().catch(e=>setMessage(e.message))} className="border border-border rounded-xl px-5 py-3">Refresh orders</button><button onClick={async()=>{await paymentRequest('/api/payments/admin/session',{method:'DELETE'});setOrders([]);setSignedIn(false);}} className="border border-border rounded-xl px-5 py-3">Sign out</button></div>
      {!orders.length&&<p>No orders submitted yet.</p>}{orders.map(o=><Review key={o.id} order={o} onDone={refresh} onError={setMessage}/>)}</>}
  </section></main>;
}
