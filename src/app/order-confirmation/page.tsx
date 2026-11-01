'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Icon from '@/components/ui/AppIcon';

interface OrderDetails {
  orderNumber: string;
  totalCharged: string;
  shippingAddress: {
    name: string;
    line1: string;
    line2: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  deliveryTimeline: {
    ordered: string;
    processing: string;
    shipped: string;
    delivered: string;
  };
  items: { name: string; qty: number; price: string }[];
  payment: {
    method: string;
    last4: string;
    status: 'Approved' | 'Pending' | 'Declined';
  };
}

function generateOrderNumber() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = 'AXP-';
  for (let i = 0; i < 4; i++) code += chars[Math.floor(Math.random() * chars.length)];
  code += '-';
  for (let i = 0; i < 5; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

const timelineSteps = [
  { key: 'ordered', label: 'Order Placed', icon: 'ShoppingBagIcon', done: true },
  { key: 'processing', label: 'Processing', icon: 'CogIcon', done: true },
  { key: 'shipped', label: 'Shipped', icon: 'TruckIcon', done: false },
  { key: 'delivered', label: 'Delivered', icon: 'CheckCircleIcon', done: false },
];

function OrderConfirmationContent() {
  const [revealed, setRevealed] = useState(false);
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    const t = setTimeout(() => setRevealed(true), 80);

    const productName = searchParams.get('name');
    const productPrice = searchParams.get('price');
    const device = searchParams.get('device');

    const now = new Date();
    const fmt = (d: Date) =>
      d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const addDays = (d: Date, n: number) => {
      const r = new Date(d);
      r.setDate(r.getDate() + n);
      return r;
    };

    const itemName = productName ? `${productName}${device ? ` (${device})` : ''}` : 'Pro Gamer Bundle (Android)';
    const itemPrice = productPrice ? `$${parseFloat(productPrice).toFixed(2)}` : '$24.99';

    setOrder({
      orderNumber: generateOrderNumber(),
      totalCharged: itemPrice,
      shippingAddress: {
        name: 'Alex Rivera',
        line1: '142 Ember Street',
        line2: 'Apt 7B',
        city: 'Los Angeles',
        state: 'CA',
        zip: '90012',
        country: 'United States',
      },
      deliveryTimeline: {
        ordered: fmt(now),
        processing: fmt(addDays(now, 1)),
        shipped: fmt(addDays(now, 2)),
        delivered: `${fmt(addDays(now, 5))}–${fmt(addDays(now, 7))}`,
      },
      items: [
        { name: itemName, qty: 1, price: itemPrice },
      ],
      payment: {
        method: 'Visa',
        last4: '4242',
        status: 'Approved',
      },
    });

    return () => clearTimeout(t);
  }, [searchParams]);

  if (!order) return null;

  return (
    <main className="bg-background min-h-screen overflow-x-hidden">
      <Header />

      {/* Hero band */}
      <section className="relative pt-28 pb-12 px-4 overflow-hidden">
        {/* Background glow orbs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/10 rounded-full blur-[100px]" />
          <div className="absolute top-10 right-1/4 w-[200px] h-[200px] bg-accent/8 rounded-full blur-[80px]" />
        </div>

        <div
          className={`relative max-w-2xl mx-auto text-center transition-all duration-700 ${
            revealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-fire-gradient shadow-fire-md mb-6 animate-pulse-glow">
            <Icon name="CheckIcon" size={36} variant="solid" className="text-white" />
          </div>

          <p className="text-sm font-semibold tracking-widest uppercase text-primary mb-2">
            Order Confirmed
          </p>
          <h1 className="text-section-title text-foreground mb-3">
            Your purchase is{' '}
            <span className="fire-gradient-text">on its way!</span>
          </h1>
          <p className="text-muted-foreground text-base max-w-md mx-auto">
            A confirmation email has been sent. Keep this page for your records.
          </p>
        </div>
      </section>

      {/* Main content */}
      <section className="max-w-2xl mx-auto px-4 pb-20 flex flex-col gap-5">

        {/* Order number + total */}
        <div
          className={`glass-card fire-border rounded-2xl p-6 transition-all duration-700 delay-100 ${
            revealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1">
                Order Number
              </p>
              <p className="font-mono-price text-xl text-foreground">{order.orderNumber}</p>
            </div>
            <div className="text-right">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1">
                Total Charged
              </p>
              <p className="font-mono-price text-2xl fire-gradient-text">{order.totalCharged}</p>
            </div>
          </div>

          {/* Items */}
          <div className="mt-5 pt-5 border-t border-border flex flex-col gap-3">
            {order.items.map((item, i) => (
              <div key={i} className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-fire-subtle flex items-center justify-center flex-shrink-0">
                    <Icon name="CubeIcon" size={14} className="text-primary" />
                  </div>
                  <span className="text-sm font-medium text-foreground">
                    {item.name}
                    <span className="text-muted-foreground ml-1.5">×{item.qty}</span>
                  </span>
                </div>
                <span className="font-mono-price text-sm text-foreground">{item.price}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Payment details */}
        <div
          className={`glass-card rounded-2xl p-6 border border-border transition-all duration-700 delay-[150ms] ${
            revealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-9 h-9 rounded-xl bg-fire-subtle flex items-center justify-center">
              <Icon name="CreditCardIcon" size={18} className="text-primary" />
            </div>
            <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
              Payment Details
            </h2>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            {/* Payment method + card */}
            <div className="flex items-center gap-3 flex-1">
              <div className="w-12 h-8 rounded-md bg-card border border-border flex items-center justify-center">
                <Icon name="CreditCardIcon" size={18} className="text-foreground" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                  {order.payment.method}
                </p>
                <p className="text-sm font-semibold text-foreground font-mono-price tracking-widest">
                  •••• •••• •••• {order.payment.last4}
                </p>
              </div>
            </div>

            {/* Transaction status */}
            <div className="flex items-center gap-2">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide ${
                  order.payment.status === 'Approved' ?'bg-green-500/15 text-green-400 border border-green-500/30'
                    : order.payment.status === 'Pending' ?'bg-yellow-500/15 text-yellow-400 border border-yellow-500/30' :'bg-red-500/15 text-red-400 border border-red-500/30'
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    order.payment.status === 'Approved' ?'bg-green-400'
                      : order.payment.status === 'Pending' ?'bg-yellow-400' :'bg-red-400'
                  }`}
                />
                {order.payment.status}
              </span>
            </div>
          </div>
        </div>

        {/* Shipping address */}
        <div
          className={`glass-card accent-border rounded-2xl p-6 transition-all duration-700 delay-200 ${
            revealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-9 h-9 rounded-xl bg-electric-subtle flex items-center justify-center">
              <Icon name="MapPinIcon" size={18} className="text-electric" />
            </div>
            <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
              Shipping Address
            </h2>
          </div>
          <div className="text-foreground text-sm leading-relaxed font-medium space-y-0.5">
            <p className="text-base font-bold">{order.shippingAddress.name}</p>
            <p>{order.shippingAddress.line1}</p>
            {order.shippingAddress.line2 && <p>{order.shippingAddress.line2}</p>}
            <p>
              {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
              {order.shippingAddress.zip}
            </p>
            <p className="text-muted-foreground">{order.shippingAddress.country}</p>
          </div>
        </div>

        {/* Delivery timeline */}
        <div
          className={`glass-card electric-border rounded-2xl p-6 transition-all duration-700 delay-300 ${
            revealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <div className="flex items-center gap-2.5 mb-6">
            <div className="w-9 h-9 rounded-xl bg-fire-subtle flex items-center justify-center">
              <Icon name="TruckIcon" size={18} className="text-primary" />
            </div>
            <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
              Delivery Timeline
            </h2>
          </div>

          <div className="relative flex items-start justify-between gap-2">
            <div className="absolute top-4 left-4 right-4 h-px bg-border" />
            <div
              className="absolute top-4 left-4 h-px bg-fire-gradient transition-all duration-1000"
              style={{ width: revealed ? '35%' : '0%' }}
            />

            {timelineSteps.map((step, i) => {
              const dateKey = step.key as keyof typeof order.deliveryTimeline;
              return (
                <div key={step.key} className="relative flex flex-col items-center gap-2 flex-1 min-w-0">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center z-10 border-2 transition-all duration-500 ${
                      step.done
                        ? 'bg-fire-gradient border-primary shadow-fire-sm'
                        : 'bg-card border-border'
                    }`}
                    style={{ transitionDelay: `${i * 120}ms` }}
                  >
                    <Icon
                      name={step.icon as Parameters<typeof Icon>[0]['name']}
                      size={14}
                      variant={step.done ? 'solid' : 'outline'}
                      className={step.done ? 'text-white' : 'text-muted-foreground'}
                    />
                  </div>
                  <p
                    className={`text-xs font-semibold text-center leading-tight ${
                      step.done ? 'text-foreground' : 'text-muted-foreground'
                    }`}
                  >
                    {step.label}
                  </p>
                  <p className="text-[10px] text-muted-foreground text-center leading-tight">
                    {order.deliveryTimeline[dateKey]}
                  </p>
                </div>
              );
            })}
          </div>

          <p className="mt-6 text-xs text-muted-foreground text-center">
            Estimated delivery:{' '}
            <span className="text-accent font-semibold">{order.deliveryTimeline.delivered}</span>
          </p>
        </div>

        {/* Actions */}
        <div
          className={`flex flex-col sm:flex-row gap-3 transition-all duration-700 delay-[400ms] ${
            revealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <Link
            href="/products"
            className="flex-1 inline-flex items-center justify-center gap-2 bg-fire-gradient text-primary-foreground px-6 py-3.5 rounded-2xl text-sm font-bold transition-all duration-300 hover:scale-[1.02] hover:shadow-fire-md"
          >
            <Icon name="ShoppingBagIcon" size={16} variant="solid" />
            Continue Shopping
          </Link>
          <button
            onClick={() => window.print()}
            className="flex-1 inline-flex items-center justify-center gap-2 bg-card border border-border text-foreground px-6 py-3.5 rounded-2xl text-sm font-semibold transition-all duration-200 hover:border-primary/40 hover:bg-muted"
          >
            <Icon name="PrinterIcon" size={16} />
            Print Receipt
          </button>
        </div>
      </section>

      <Footer />
    </main>
  );
}

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={<div className="bg-background min-h-screen" />}>
      <OrderConfirmationContent />
    </Suspense>
  );
}
