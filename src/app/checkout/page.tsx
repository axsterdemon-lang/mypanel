'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { allProducts } from '@/lib/payments/catalog';
import { paymentRequest, saveOrder, savedOrders } from '@/lib/payments/client';
import { statusLabels, type Method, type PaymentOrder, type ReceiptFields } from '@/lib/payments/types';

const inputStyle = 'w-full rounded-xl bg-background border border-border px-4 py-3 text-base text-foreground';
type Config = {lkrPerUsd:number; methods: Record<Method,{label:string;account:string;details:string[][]}>};
type PublicOrder = Omit<PaymentOrder,'accessHash'>;

function Checkout() {
  const params = useSearchParams();
  const router = useRouter();
  const product = allProducts.find(p => p.id === params.get('product'));
  const [config,setConfig] = useState<Config|null>(null);
  const [device,setDevice] = useState(params.get('device') || product?.devices[0] || 'Android');
  const [method,setMethod] = useState<Method>('bank');
  const [order,setOrder] = useState<PublicOrder|null>(null);
  const [token,setToken] = useState('');
  const [file,setFile] = useState<File|null>(null);
  const [fields,setFields] = useState<ReceiptFields>({account:'',amount:'',currency:'LKR',date:'',time:'',reference:''});
  const [ocrText,setOcrText] = useState('');
  const [busy,setBusy] = useState(false);
  const [reading,setReading] = useState(false);
  const [message,setMessage] = useState('');
  const [consent,setConsent] = useState(false);
  useEffect(() => {
    paymentRequest('/api/payments/config').then(setConfig).catch(e => setMessage(e.message));
    const resume = params.get('order');
    const saved = savedOrders().find(o => o.id === resume);
    if (saved) paymentRequest(`/api/payments/orders/${saved.id}`, {headers:{Authorization:`Bearer ${saved.token}`}})
      .then(o => {setOrder(o);setToken(saved.token);setMethod(o.method);setDevice(o.device);}).catch(e => setMessage(e.message));
  }, [params]);

  const create = async () => {
    setBusy(true);setMessage('');
    try {
      const result = await paymentRequest('/api/payments/orders',{method:'POST',headers:{'Content-Type':'application/json'},
        body:JSON.stringify({productId:product?.id,device,method})});
      saveOrder(result.order.id,result.token);setOrder(result.order);setToken(result.token);
      router.replace(`/checkout?order=${result.order.id}`);
    } catch(e) {setMessage((e as Error).message);} finally {setBusy(false);}
  };
  const readSlip = async () => {
    if (!file || file.type === 'application/pdf') return;
    setReading(true);setMessage('Reading your slip on this device…');
    let worker;
    try {
      const { createWorker } = await import('tesseract.js');
      worker = await createWorker('eng');
      const result = await worker.recognize(file);
      const text = result.data.text.slice(0,20000); setOcrText(text);
      const account = config?.methods[method].account || '';
      const date = text.match(/\b(20\d{2})[-/.](\d{2})[-/.](\d{2})\b/);
      const reverseDate = text.match(/\b(\d{2})[-/.](\d{2})[-/.](20\d{2})\b/);
      const time = text.match(/\b([01]\d|2[0-3]):([0-5]\d)\b/);
      const amount = text.match(/(?:amount|LKR|USDT|Rs\.?)[^\d\n]{0,15}([\d,]+\.\d{2})/i);
      const ref = text.match(/(?:reference|ref(?:erence)?\s*(?:no|number)?|transaction\s*(?:id|no))\s*[:#.-]?\s*([a-z0-9][a-z0-9/_-]{3,79})/i);
      setFields(f => ({...f, account:text.replace(/\D/g,'').includes(account) ? account : f.account,
        amount:amount?.[1].replace(/,/g,'') || f.amount,
        date:date ? `${date[1]}-${date[2]}-${date[3]}` : reverseDate ? `${reverseDate[3]}-${reverseDate[2]}-${reverseDate[1]}` : f.date,
        time:time?.[0] || f.time, reference:ref?.[1] || f.reference,
        currency:/USDT/i.test(text) ? 'USDT' : /LKR|\bRs\b/i.test(text) ? 'LKR' : f.currency}));
      setMessage('Slip text read. Check every field against your original slip. Final approval follows transaction review.');
    } catch {setMessage('Could not read this image. Enter the details from your slip manually.');}
    finally {if(worker) await worker.terminate();setReading(false);}
  };
  const upload = async (event: React.FormEvent) => {
    event.preventDefault(); if(!order || !file || !consent) return;
    setBusy(true);setMessage('');
    try {
      const form=new FormData(); form.set('slip',file);form.set('fields',JSON.stringify(fields));form.set('ocrText',ocrText);
      const result=await paymentRequest(`/api/payments/orders/${order.id}`,{method:'POST',headers:{Authorization:`Bearer ${token}`},body:form});
      setOrder(result);router.push('/order-confirmation');
    } catch(e){setMessage((e as Error).message);} finally{setBusy(false);}
  };
  const displayProduct = product || allProducts.find(p=>p.id===order?.productId);
  const price = product?.prices[device as keyof typeof product.prices];
  return <main className="min-h-screen bg-background text-foreground"><Header/>
    <section className="mx-auto max-w-3xl px-4 pt-28 pb-20 space-y-6">
      <Link href="/products" className="text-primary">Back to products</Link>
      <h1 className="text-3xl font-bold">Payment checkout</h1>
      <p className="text-muted-foreground">ගෙවීමේ ක්‍රමය තෝරන්න. ගෙවීම කළ පසු slip එක මෙතැනට upload කරන්න.</p>
      {message && <p role="status" className="border border-primary/40 bg-primary/10 p-4 rounded-xl">{message}</p>}
      {!displayProduct && !order && <p>Select a product from the <Link href="/products" className="text-primary">products page</Link>.</p>}
      {displayProduct && <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
        <h2 className="text-xl font-bold">{displayProduct.name}</h2>
        {!order && <><label className="block">Device<select className={inputStyle} value={device} onChange={e=>setDevice(e.target.value)}>{displayProduct.devices.map(d=><option key={d}>{d}</option>)}</select></label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3" role="group" aria-label="Payment method">{(['bank','ezcash','binance'] as Method[]).map(m=><button key={m} aria-pressed={method===m} onClick={()=>setMethod(m)} className={`rounded-xl border p-4 text-base ${method===m?'border-primary bg-primary/15':'border-border'}`}>{config?.methods[m].label || ({bank:'Bank transfer',ezcash:'eZ Cash',binance:'Binance'}[m])}</button>)}</div>
          {config && price && <p className="text-xl font-bold">{method==='binance'? `${price.toFixed(2)} USDT`:`LKR ${(price*config.lkrPerUsd).toFixed(2)}`}<span className="block text-sm font-normal text-muted-foreground">Bank / eZ Cash use the store rate of LKR {config.lkrPerUsd} per listed dollar. Binance total is quoted in USDT.</span></p>}
          <button onClick={create} disabled={busy||!config||!price} className="w-full rounded-xl bg-fire-gradient p-4 font-bold disabled:opacity-50">{busy?'Creating order…':'Continue to payment details'}</button></>}
        {order && <><p className="font-mono break-all">{order.id}</p><p>{order.device} · {config?.methods[order.method].label}</p><p className="text-2xl font-bold">{(order.amountMinor/100).toFixed(2)} {order.currency}</p><p>{statusLabels[order.status]}</p></>}
      </div>}
      {order?.status==='awaiting_payment' && config && <>
        <div className="bg-card rounded-2xl border border-border p-5 space-y-3"><h2 className="text-xl font-bold">{config.methods[order.method].label} details</h2>
          {config.methods[order.method].details.map(([label,value])=><div key={label}><p className="text-sm text-muted-foreground">{label}</p><p className="text-base break-words select-all">{value}</p></div>)}
          <p className="text-sm text-muted-foreground">Pay the exact total above. Use your order ID in the payment remarks if available. Keep the transaction reference from the completed payment.</p>
        </div>
        <form onSubmit={upload} className="bg-card rounded-2xl border border-border p-5 space-y-4">
          <h2 className="text-xl font-bold">Upload payment slip</h2>
          <label className="block space-y-2"><span>Slip photo or PDF · maximum 3 MB</span><input className={inputStyle} type="file" accept="image/jpeg,image/png,image/webp,application/pdf" required disabled={busy||reading} onChange={e=>{
            const chosen=e.target.files?.[0];setOcrText('');setFields({account:'',amount:'',currency:order.currency,date:'',time:'',reference:''});
            if(chosen && chosen.size>3*1024*1024){setFile(null);e.target.value='';setMessage('Choose a slip smaller than 3 MB.');return;}setFile(chosen||null);
          }}/></label>
          <button type="button" onClick={readSlip} disabled={!file||reading||busy||file.type==='application/pdf'} className="rounded-xl border border-primary p-3 disabled:opacity-50">{reading?'Reading slip…':'Read details from image'}</button>
          <p className="text-sm text-muted-foreground">Image text recognition runs on your device. PDFs and unclear images can be reviewed manually. Text recognition can make mistakes; check the fields below.</p>
          <div className="grid sm:grid-cols-2 gap-4">{([
            ['account','Receiving account / mobile / Binance ID','text'],['amount','Paid amount','text'],['currency','Currency (LKR or USDT)','text'],
            ['date','Payment date (Sri Lanka)','date'],['time','Payment time (Sri Lanka)','time'],['reference','Transaction reference','text'],
          ] as const).map(([key,label,type])=><label key={key} className="block space-y-2"><span>{label}</span><input required maxLength={100} type={type} className={inputStyle} value={fields[key]} onChange={e=>setFields(f=>({...f,[key]:key==='currency'?e.target.value.toUpperCase():e.target.value}))}/></label>)}</div>
          <label className="flex gap-3 items-start"><input type="checkbox" required checked={consent} onChange={e=>setConsent(e.target.checked)} className="mt-1"/><span>I agree to send this slip and its details to this store for payment review. Include only the payment details needed for this order. Slips are stored privately; approval follows a check of the actual incoming transaction.</span></label>
          <button disabled={!file||!consent||busy||reading} className="w-full rounded-xl bg-fire-gradient p-4 font-bold disabled:opacity-50">{busy?'Uploading…':'Submit slip for verification'}</button>
        </form></>}
      {order && order.status!=='awaiting_payment' && <Link className="block text-primary" href="/order-confirmation">View payment status</Link>}
    </section><Footer/></main>;
}
export default function CheckoutPage(){return <Suspense fallback={<p className="p-10">Loading checkout…</p>}><Checkout/></Suspense>;}
