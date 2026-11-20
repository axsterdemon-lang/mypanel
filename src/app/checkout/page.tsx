'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import {
  ArrowLeft,
  Landmark,
  Wallet,
  ShieldCheck,
  Check,
  ChevronDown,
  Copy,
  UploadCloud,
  FileText,
  ScanLine,
  LoaderCircle,
  Smartphone,
  Monitor,
  LockKeyhole,
  ReceiptText,
  Sparkles,
  Info,
  Clock3,
} from 'lucide-react';
import styles from './checkout.module.css';
import { allProducts } from '@/lib/payments/catalog';
import { paymentRequest, saveOrder, savedOrders } from '@/lib/payments/client';
import {
  statusLabels,
  type Method,
  type PaymentOrder,
  type ReceiptFields,
} from '@/lib/payments/types';

const methodDesign = {
  bank: { name: 'Bank transfer', caption: 'Local bank payment', color: '#91bfff', icon: Landmark },
  ezcash: { name: 'eZ Cash', caption: 'Mobile wallet', color: '#8be1bc', icon: Wallet },
  binance: { name: 'Binance', caption: 'Pay with USDT', color: '#f5cf70', icon: Wallet },
};
type Config = {
  lkrPerUsd: number;
  methods: Record<Method, { label: string; account: string; details: string[][] }>;
};
type PublicOrder = Omit<PaymentOrder, 'accessHash'>;

function Checkout() {
  const params = useSearchParams();
  const router = useRouter();
  const product = allProducts.find((p) => p.id === params.get('product'));
  const [config, setConfig] = useState<Config | null>(null);
  const [device, setDevice] = useState(params.get('device') || product?.devices[0] || 'Android');
  const [method, setMethod] = useState<Method>('bank');
  const [order, setOrder] = useState<PublicOrder | null>(null);
  const [token, setToken] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [fields, setFields] = useState<ReceiptFields>({
    account: '',
    amount: '',
    currency: 'LKR',
    date: '',
    time: '',
    reference: '',
  });
  const [ocrText, setOcrText] = useState('');
  const [busy, setBusy] = useState(false);
  const [reading, setReading] = useState(false);
  const [message, setMessage] = useState('');
  const [consent, setConsent] = useState(false);
  const [copied, setCopied] = useState('');
  const [preview, setPreview] = useState('');
  useEffect(() => {
    if (!file || !file.type.startsWith('image/')) {
      setPreview('');
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);
  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(''), 2000);
    return () => clearTimeout(timer);
  }, [copied]);
  const copyValue = async (key: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(key);
    } catch {
      setMessage('Copy is unavailable in this browser. Select and copy the number directly.');
    }
  };
  useEffect(() => {
    paymentRequest('/api/payments/config')
      .then(setConfig)
      .catch((e) => setMessage(e.message));
    const resume = params.get('order');
    const saved = savedOrders().find((o) => o.id === resume);
    if (saved)
      paymentRequest(`/api/payments/orders/${saved.id}`, {
        headers: { Authorization: `Bearer ${saved.token}` },
      })
        .then((o) => {
          setOrder(o);
          setToken(saved.token);
          setMethod(o.method);
          setDevice(o.device);
        })
        .catch((e) => setMessage(e.message));
  }, [params]);

  const create = async () => {
    setBusy(true);
    setMessage('');
    try {
      const result = await paymentRequest('/api/payments/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product?.id, device, method }),
      });
      saveOrder(result.order.id, result.token);
      setOrder(result.order);
      setToken(result.token);
      router.replace(`/checkout?order=${result.order.id}`);
    } catch (e) {
      setMessage((e as Error).message);
    } finally {
      setBusy(false);
    }
  };
  const readSlip = async () => {
    if (!file || file.type === 'application/pdf') return;
    setReading(true);
    setMessage('Reading your slip on this device…');
    let worker;
    try {
      const { createWorker } = await import('tesseract.js');
      worker = await createWorker('eng');
      const result = await worker.recognize(file);
      const text = result.data.text.slice(0, 20000);
      setOcrText(text);
      const account = config?.methods[method].account || '';
      const date = text.match(/\b(20\d{2})[-/.](\d{2})[-/.](\d{2})\b/);
      const reverseDate = text.match(/\b(\d{2})[-/.](\d{2})[-/.](20\d{2})\b/);
      const time = text.match(/\b([01]\d|2[0-3]):([0-5]\d)\b/);
      const amount = text.match(/(?:amount|LKR|USDT|Rs\.?)[^\d\n]{0,15}([\d,]+\.\d{2})/i);
      const ref = text.match(
        /(?:reference|ref(?:erence)?\s*(?:no|number)?|transaction\s*(?:id|no))\s*[:#.-]?\s*([a-z0-9][a-z0-9/_-]{3,79})/i
      );
      setFields((f) => ({
        ...f,
        account: text.replace(/\D/g, '').includes(account) ? account : f.account,
        amount: amount?.[1].replace(/,/g, '') || f.amount,
        date: date
          ? `${date[1]}-${date[2]}-${date[3]}`
          : reverseDate
            ? `${reverseDate[3]}-${reverseDate[2]}-${reverseDate[1]}`
            : f.date,
        time: time?.[0] || f.time,
        reference: ref?.[1] || f.reference,
        currency: /USDT/i.test(text) ? 'USDT' : /LKR|\bRs\b/i.test(text) ? 'LKR' : f.currency,
      }));
      setMessage(
        'Slip text read. Check every field against your original slip. Final approval follows transaction review.'
      );
    } catch {
      setMessage('Could not read this image. Enter the details from your slip manually.');
    } finally {
      if (worker) await worker.terminate();
      setReading(false);
    }
  };
  const upload = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!order || !file || !consent) return;
    setBusy(true);
    setMessage('');
    try {
      const form = new FormData();
      form.set('slip', file);
      form.set('fields', JSON.stringify(fields));
      form.set('ocrText', ocrText);
      const result = await paymentRequest(`/api/payments/orders/${order.id}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: form,
      });
      setOrder(result);
      router.push('/order-confirmation');
    } catch (e) {
      setMessage((e as Error).message);
    } finally {
      setBusy(false);
    }
  };
  const displayProduct = product || allProducts.find((p) => p.id === order?.productId);
  const price = product?.prices[device as keyof typeof product.prices];
  const activeMethod = order?.method || method;
  const currency = order?.currency || (activeMethod === 'binance' ? 'USDT' : 'LKR');
  const amountMinor =
    order?.amountMinor ??
    (config && price
      ? Math.round(price * 100 * (activeMethod === 'binance' ? 1 : config.lkrPerUsd))
      : null);
  const amount =
    amountMinor === null
      ? '—'
      : (amountMinor / 100).toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
  const activeStep = !order ? 0 : order.status === 'awaiting_payment' ? 1 : 2;
  const DeviceIcon = device === 'PC' ? Monitor : Smartphone;
  const SelectedMethodIcon = methodDesign[activeMethod].icon;
  const accountLabel =
    activeMethod === 'bank'
      ? 'Account number'
      : activeMethod === 'ezcash'
        ? 'Receiving mobile number'
        : 'Binance receiving ID';

  return (
    <main className={styles.page}>
      <Header />
      <div className={styles.ambient} aria-hidden="true" />
      <section className={styles.shell}>
        <Link href="/products" className={styles.back}>
          <ArrowLeft size={16} /> Back to products
        </Link>
        <div className={styles.hero}>
          <div>
            <div className={styles.eyebrow}>
              <Sparkles size={14} /> THE FINAL STEP
            </div>
            <h1 className={styles.title}>
              A better way to <span>checkout.</span>
            </h1>
            <p className={styles.subtitle}>
              කැමති payment method එක තෝරන්න. ගෙවීම කළ පසු slip එක upload කරන්න.
            </p>
          </div>
          <div className={styles.privatePill}>
            <ShieldCheck size={17} /> Private payment review
          </div>
        </div>

        <nav className={styles.steps} aria-label="Checkout progress">
          {['Choose method', 'Pay & upload', 'Payment review'].map((label, index) => (
            <React.Fragment key={label}>
              {index > 0 && <div className={styles.stepLine} aria-hidden="true" />}
              <div
                className={`${styles.step} ${index === activeStep ? styles.stepActive : index < activeStep ? styles.stepDone : ''}`}
                aria-current={index === activeStep ? 'step' : undefined}
              >
                <span className={styles.stepNumber}>
                  {index < activeStep ? <Check size={13} /> : index + 1}
                </span>
                <span>{label}</span>
              </div>
            </React.Fragment>
          ))}
        </nav>

        {message && (
          <div role="status" className={styles.notice}>
            <Info size={19} />
            <span>{message}</span>
          </div>
        )}
        {!displayProduct && !order && (
          <div className={`${styles.panel} ${styles.empty}`}>
            <div className={styles.completeIcon}>
              <ReceiptText size={27} />
            </div>
            <h2 className={styles.sectionTitle}>
              {params.get('order') ? 'Loading your order' : 'Your next upgrade starts here'}
            </h2>
            <p className={styles.subtitle}>
              {params.get('order')
                ? 'Order access is saved in the browser used at checkout.'
                : 'Choose a product to see your payment options.'}
            </p>
            <Link href="/products" className={styles.primary}>
              Browse products
            </Link>
          </div>
        )}

        {displayProduct && (
          <div className={`${styles.layout} ${!order ? styles.choosing : ''}`}>
            <div className={styles.mainColumn}>
              <section className={styles.panel} aria-labelledby="payment-method-title">
                <div className={styles.panelHeading}>
                  <div className={styles.sectionIcon}>
                    <Wallet size={21} />
                  </div>
                  <div>
                    <h2 id="payment-method-title" className={styles.sectionTitle}>
                      {order ? 'Your payment method' : 'Choose your payment method'}
                    </h2>
                    <p className={styles.sectionHint}>Select the option that works best for you.</p>
                  </div>
                </div>
                <div className={styles.deviceRow}>
                  <label className={styles.deviceLabel} htmlFor="checkout-device">
                    <DeviceIcon size={17} /> Your device
                  </label>
                  <div className={styles.selectWrap}>
                    <select
                      id="checkout-device"
                      className={styles.deviceSelect}
                      value={device}
                      disabled={Boolean(order) || busy}
                      onChange={(e) => setDevice(e.target.value)}
                    >
                      {displayProduct.devices.map((d) => (
                        <option key={d}>{d}</option>
                      ))}
                    </select>
                    <ChevronDown size={14} />
                  </div>
                </div>
                <div className={styles.methods} role="group" aria-label="Payment method">
                  {(['bank', 'ezcash', 'binance'] as Method[]).map((m) => {
                    const design = methodDesign[m];
                    const MethodIcon = design.icon;
                    return (
                      <button
                        key={m}
                        type="button"
                        aria-pressed={activeMethod === m}
                        disabled={Boolean(order) || busy}
                        onClick={() => setMethod(m)}
                        className={`${styles.method} ${activeMethod === m ? styles.methodSelected : ''}`}
                        style={{ '--method-color': design.color } as React.CSSProperties}
                      >
                        <span className={styles.methodRadio} aria-hidden="true">
                          {activeMethod === m && <Check size={11} strokeWidth={3} />}
                        </span>
                        <span className={styles.methodIcon}>
                          <MethodIcon size={21} />
                        </span>
                        <span className={styles.methodName}>{design.name}</span>
                        <span className={styles.methodCaption}>{design.caption}</span>
                      </button>
                    );
                  })}
                </div>
                <p className={styles.selectionNote}>
                  <Check size={15} /> {methodDesign[activeMethod].name} selected
                  {order ? ' for this order' : ''}
                </p>
              </section>

              {order?.status === 'awaiting_payment' && config && (
                <>
                  <section className={styles.panel} aria-labelledby="transfer-details-title">
                    <div className={styles.panelHeading}>
                      <div className={styles.sectionIcon}>
                        <SelectedMethodIcon size={21} />
                      </div>
                      <div>
                        <h2 id="transfer-details-title" className={styles.sectionTitle}>
                          {config.methods[activeMethod].label} details
                        </h2>
                        <p className={styles.sectionHint}>
                          Use these details to make your payment.
                        </p>
                      </div>
                    </div>
                    <div className={styles.accountBox}>
                      <p className={styles.accountLabel}>{accountLabel}</p>
                      <div className={styles.accountValueRow}>
                        <p className={styles.accountNumber}>
                          {config.methods[activeMethod].account}
                        </p>
                        <button
                          type="button"
                          className={styles.copy}
                          aria-label={`Copy ${accountLabel.toLowerCase()}`}
                          onClick={() => copyValue('account', config.methods[activeMethod].account)}
                        >
                          {copied === 'account' ? <Check size={17} /> : <Copy size={17} />}
                        </button>
                      </div>
                      {copied === 'account' && (
                        <span role="status" className={styles.dropCaption}>
                          Copied to clipboard
                        </span>
                      )}
                    </div>
                    <dl className={styles.detailsGrid}>
                      {config.methods[activeMethod].details
                        .filter(([, value]) => value !== config.methods[activeMethod].account)
                        .map(([label, value]) => (
                          <div key={label}>
                            <dt className={styles.detailLabel}>{label}</dt>
                            <dd className={styles.detailValue}>{value}</dd>
                          </div>
                        ))}
                    </dl>
                    <div className={styles.instructions}>
                      <Info size={17} />
                      <p>
                        Transfer exactly{' '}
                        <strong>
                          {amount} {currency}
                        </strong>
                        . Add your order ID to the payment remarks if available, and keep your
                        transaction reference.
                      </p>
                    </div>
                  </section>

                  <form
                    onSubmit={upload}
                    className={styles.panel}
                    aria-labelledby="upload-slip-title"
                  >
                    <div className={styles.panelHeading}>
                      <div className={styles.sectionIcon}>
                        <UploadCloud size={21} />
                      </div>
                      <div>
                        <h2 id="upload-slip-title" className={styles.sectionTitle}>
                          Upload your payment slip
                        </h2>
                        <p className={styles.sectionHint}>
                          A clear image helps us review your payment.
                        </p>
                      </div>
                    </div>
                    <label className={styles.dropzone}>
                      {preview ? (
                        <img
                          src={preview}
                          alt="Preview of your selected payment slip"
                          className={styles.preview}
                        />
                      ) : file ? (
                        <FileText className={styles.uploadIcon} />
                      ) : (
                        <UploadCloud className={styles.uploadIcon} />
                      )}
                      <span className={styles.dropTitle}>
                        {file ? file.name : 'Choose a file or drop it here'}
                      </span>
                      <span className={styles.dropCaption}>
                        {file
                          ? `${(file.size / 1024).toFixed(0)} KB · Click to replace`
                          : 'JPG, PNG, WEBP or PDF · Up to 3 MB'}
                      </span>
                      <input
                        className={styles.fileInput}
                        aria-label="Payment slip file"
                        type="file"
                        accept="image/jpeg,image/png,image/webp,application/pdf"
                        required
                        disabled={busy || reading}
                        onChange={(e) => {
                          const chosen = e.target.files?.[0];
                          setOcrText('');
                          setFields({
                            account: '',
                            amount: '',
                            currency: order.currency,
                            date: '',
                            time: '',
                            reference: '',
                          });
                          if (chosen && chosen.size > 3 * 1024 * 1024) {
                            setFile(null);
                            e.target.value = '';
                            setMessage('Choose a slip smaller than 3 MB.');
                            return;
                          }
                          setFile(chosen || null);
                        }}
                      />
                    </label>
                    <div className={styles.scanRow}>
                      <button
                        type="button"
                        onClick={readSlip}
                        disabled={!file || reading || busy || file.type === 'application/pdf'}
                        className={styles.secondary}
                      >
                        {reading ? (
                          <LoaderCircle size={17} className={styles.spinner} />
                        ) : (
                          <ScanLine size={17} />
                        )}
                        {reading ? 'Reading your slip…' : 'Read slip details'}
                      </button>
                      <p className={styles.scanCaption}>
                        Read image details automatically, then check the fields below. PDFs can be
                        entered manually.
                      </p>
                    </div>
                    <div className={styles.formFields}>
                      <label className={styles.field}>
                        <span className={styles.label}>Receiving account / ID</span>
                        <input
                          required
                          maxLength={100}
                          className={styles.input}
                          inputMode="numeric"
                          placeholder="Number shown on the slip"
                          value={fields.account}
                          onChange={(e) => setFields((f) => ({ ...f, account: e.target.value }))}
                        />
                      </label>
                      <label className={styles.field}>
                        <span className={styles.label}>Paid amount</span>
                        <input
                          required
                          maxLength={100}
                          className={styles.input}
                          inputMode="decimal"
                          placeholder="0.00"
                          value={fields.amount}
                          onChange={(e) => setFields((f) => ({ ...f, amount: e.target.value }))}
                        />
                      </label>
                      <label className={styles.field}>
                        <span className={styles.label}>Currency</span>
                        <span className={styles.selectWrap}>
                          <select
                            className={styles.input}
                            value={fields.currency}
                            onChange={(e) => setFields((f) => ({ ...f, currency: e.target.value }))}
                          >
                            <option value="LKR">LKR — Sri Lankan Rupee</option>
                            <option value="USDT">USDT — Tether</option>
                          </select>
                          <ChevronDown size={15} />
                        </span>
                      </label>
                      <label className={styles.field}>
                        <span className={styles.label}>Transaction reference</span>
                        <input
                          required
                          maxLength={80}
                          className={styles.input}
                          placeholder="Reference number on the slip"
                          value={fields.reference}
                          onChange={(e) => setFields((f) => ({ ...f, reference: e.target.value }))}
                        />
                      </label>
                      <label className={styles.field}>
                        <span className={styles.label}>Payment date · Sri Lanka</span>
                        <input
                          required
                          type="date"
                          className={styles.input}
                          value={fields.date}
                          onChange={(e) => setFields((f) => ({ ...f, date: e.target.value }))}
                        />
                      </label>
                      <label className={styles.field}>
                        <span className={styles.label}>Payment time · Sri Lanka</span>
                        <input
                          required
                          type="time"
                          className={styles.input}
                          value={fields.time}
                          onChange={(e) => setFields((f) => ({ ...f, time: e.target.value }))}
                        />
                      </label>
                    </div>
                    <label className={styles.consent}>
                      <input
                        type="checkbox"
                        required
                        checked={consent}
                        onChange={(e) => setConsent(e.target.checked)}
                      />
                      <span>
                        I agree to share this slip and its details with the store for payment
                        review. I have checked the information against my original slip.
                      </span>
                    </label>
                    <button
                      disabled={!file || !consent || busy || reading}
                      className={styles.primary}
                    >
                      {busy ? (
                        <LoaderCircle size={18} className={styles.spinner} />
                      ) : (
                        <ShieldCheck size={18} />
                      )}
                      {busy ? 'Submitting your slip…' : 'Submit payment slip'}
                    </button>
                    <p className={styles.uploadFoot}>
                      <LockKeyhole size={13} /> Your slip is private and accessible to the store
                      owner.
                    </p>
                  </form>
                </>
              )}

              {order && order.status !== 'awaiting_payment' && (
                <section className={`${styles.panel} ${styles.complete}`}>
                  <div className={styles.completeIcon}>
                    <ReceiptText size={28} />
                  </div>
                  <h2 className={styles.sectionTitle}>
                    {order.status === 'pending_review'
                      ? 'Your slip is with us'
                      : 'Your payment status is ready'}
                  </h2>
                  <p>{statusLabels[order.status]}</p>
                  <Link className={styles.primary} href="/order-confirmation">
                    View payment status
                  </Link>
                </section>
              )}
            </div>

            <aside className={`${styles.panel} ${styles.summary}`} aria-label="Order summary">
              <div className={styles.summaryTop}>
                <span>ORDER SUMMARY</span>
                <ReceiptText size={17} />
              </div>
              <div className={styles.product}>
                <div className={styles.productMark} aria-hidden="true">
                  AX
                </div>
                <div>
                  <h2 className={styles.productName}>{displayProduct.name}</h2>
                  <p className={styles.productDevice}>{device} · Digital product</p>
                </div>
              </div>
              <div className={styles.divider} />
              <div className={styles.summaryRow}>
                <span>Payment method</span>
                <strong>{methodDesign[activeMethod].name}</strong>
              </div>
              <div className={styles.summaryRow}>
                <span>Quantity</span>
                <strong>01</strong>
              </div>
              <div className={styles.divider} />
              <p className={styles.totalLabel}>Total to pay</p>
              <div className={styles.total}>
                <span className={styles.totalNumber}>{amount}</span>
                <span className={styles.currency}>{currency}</span>
              </div>
              <p className={styles.rate}>
                {activeMethod === 'binance'
                  ? 'Your Binance payment total is quoted in USDT.'
                  : `Store conversion: 1 USD = ${config?.lkrPerUsd || '…'} LKR.`}
              </p>
              {!order && (
                <button
                  onClick={create}
                  disabled={busy || !config || !price}
                  className={styles.primary}
                >
                  {busy ? (
                    <LoaderCircle size={17} className={styles.spinner} />
                  ) : (
                    <LockKeyhole size={16} />
                  )}
                  {busy ? 'Preparing your order…' : 'Continue to payment'}
                </button>
              )}
              {!order && (
                <p className={styles.summaryFoot}>
                  <ShieldCheck size={13} /> No payment is taken on this step
                </p>
              )}
              {order && (
                <>
                  <div className={styles.status}>
                    <Clock3 size={16} />
                    <span>{statusLabels[order.status]}</span>
                  </div>
                  <div className={styles.orderId}>
                    <div className={styles.orderIdTop}>
                      <span>ORDER REFERENCE</span>
                      <button
                        className={styles.copy}
                        type="button"
                        aria-label="Copy order reference"
                        onClick={() => copyValue('order', order.id)}
                      >
                        {copied === 'order' ? <Check size={14} /> : <Copy size={14} />}
                      </button>
                    </div>
                    <span className={styles.orderCode}>{order.id}</span>
                  </div>
                </>
              )}
              <div className={styles.privacyNote}>
                <ShieldCheck size={18} />
                <p>
                  Slip details are checked first. Payment is approved after the actual incoming
                  transaction is reviewed.
                </p>
              </div>
            </aside>
          </div>
        )}
      </section>
      <Footer />
    </main>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <main className={styles.page}>
          <div className={styles.shell}>Loading checkout…</div>
        </main>
      }
    >
      <Checkout />
    </Suspense>
  );
}
