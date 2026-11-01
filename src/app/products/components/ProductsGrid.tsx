'use client';

import React, { useState, useEffect, useRef } from 'react';

import Link from 'next/link';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';

type DeviceType = 'All' | 'Android' | 'iOS' | 'PC';
type SortType = 'popular' | 'price-asc' | 'price-desc' | 'diamonds-asc' | 'diamonds-desc';

interface Product {
  id: string;
  name: string;
  diamonds: number;
  devices: ('Android' | 'iOS' | 'PC')[];
  prices: {Android?: number;iOS?: number;PC?: number;};
  badge?: 'hot' | 'best-value' | 'new' | null;
  image: string;
  imageAlt: string;
  rating: number;
  reviews: number;
  stock: 'in-stock' | 'limited' | 'out-of-stock';
  popular: boolean;
  lifetime?: boolean;
}

const allProducts: Product[] = [
{
  id: 'starter-100',
  name: 'Aim Bot Brutal',
  diamonds: 100,
  devices: ['Android'],
  prices: { Android: 9 },
  badge: null,
  image: "https://user23826.na.imgto.link/public/20260814/hq720-11.avif",
  imageAlt: 'Aim Bot Brutal product image',
  rating: 4.7,
  reviews: 312,
  stock: 'in-stock',
  popular: false,
  lifetime: true
},
{
  id: 'bronze-500',
  name: 'HG Cheats Mod',
  diamonds: 500,
  devices: ['Android'],
  prices: { Android: 12.02 },
  badge: 'hot',
  image: "/assets/images/maxresdefault (2).jpg",
  imageAlt: 'Mobile gaming screen with colorful game interface, dark atmospheric background',
  rating: 4.8,
  reviews: 890,
  stock: 'in-stock',
  popular: true
},
{
  id: 'silver-1000',
  name: 'Pato Team V2',
  diamonds: 1000,
  devices: ['Android'],
  prices: { Android: 11.72 },
  badge: null,
  image: "/assets/images/hqdefault.jpg",
  imageAlt: 'Competitive gamer at desktop setup, intense expression, dark room with neon RGB lighting',
  rating: 4.9,
  reviews: 1240,
  stock: 'in-stock',
  popular: true
},
{
  id: 'android-exclusive-1500',
  name: 'Prime Hook',
  diamonds: 1500,
  devices: ['Android'],
  prices: { Android: 12 },
  badge: 'hot',
  image: "/assets/images/hq720 (3).jpg",
  imageAlt: 'Android phone showing game with green neon glow, dark background, gaming atmosphere',
  rating: 4.7,
  reviews: 445,
  stock: 'in-stock',
  popular: false
},
{
  id: 'gold-2000',
  name: 'Admin Panel',
  diamonds: 2000,
  devices: ['Android'],
  prices: { Android: 16.99 },
  badge: null,
  image: "/assets/images/b82aa79739aa2a56f58fd95f2b8f0c7c7022f231.jpg",
  imageAlt: 'Gaming setup with golden RGB lighting, dark environment, premium esports atmosphere',
  rating: 4.8,
  reviews: 756,
  stock: 'in-stock',
  popular: false
},
{
  id: 'pro-3000',
  name: 'Pato Team v1',
  diamonds: 3000,
  devices: ['Android'],
  prices: { Android: 13 },
  badge: null,
  image: "/assets/images/hq720 (1).jpg",
  imageAlt: 'Professional gaming tournament setup, multiple screens, intense competitive atmosphere, dark hall',
  rating: 4.9,
  reviews: 2100,
  stock: 'in-stock',
  popular: true
},
{
  id: 'elite-5000',
  name: 'Drip Client Proxy',
  diamonds: 5000,
  devices: ['Android'],
  prices: { Android: 12.00 },
  badge: 'best-value',
  image: "/assets/images/1784905788746-9e72a2c82df0bbbbe92c4159.webp",
  imageAlt: 'High-end gaming rig with purple and blue RGB, dark room, premium gaming setup',
  rating: 5.0,
  reviews: 3450,
  stock: 'in-stock',
  popular: true
},
{
  id: 'ios-premium-2500',
  name: 'Miguel Pro',
  diamonds: 2500,
  devices: ['iOS'],
  prices: { iOS: 15.02 },
  badge: 'new',
  image: "/assets/images/hq720 (7).jpg",
  imageAlt: 'iPhone with gaming app running, blue neon background, sleek premium feel',
  rating: 4.8,
  reviews: 189,
  stock: 'limited',
  popular: false
},
{
  id: 'pc-power-7500',
  name: 'Bala Mod',
  diamonds: 7500,
  devices: ['Android'],
  prices: { Android: 46.50 },
  badge: null,
  image: "/assets/images/hq720 (2).jpg",
  imageAlt: 'Gaming PC tower with RGB lighting, dark studio, yellow and blue neon illumination',
  rating: 4.9,
  reviews: 672,
  stock: 'in-stock',
  popular: true
},
{
  id: 'mega-10000',
  name: 'Drip Client Mod Apk',
  diamonds: 10000,
  devices: ['Android'],
  prices: { Android: 13.52 },
  badge: 'best-value',
  image: "/assets/images/drip-client-thumbnail.jpg",
  imageAlt: 'Epic dual monitor gaming setup with orange and blue neon, dark room, dramatic lighting',
  rating: 5.0,
  reviews: 4200,
  stock: 'in-stock',
  popular: true
},
{
  id: 'reseller-15000',
  name: 'Reseller Bundle',
  diamonds: 15000,
  devices: ['Android'],
  prices: { Android: 24 },
  badge: null,
  image: "/assets/images/hqdefault.jpg",
  imageAlt: 'Multiple gaming devices on desk, dark room with multicolored neon glow, reseller setup',
  rating: 4.8,
  reviews: 320,
  stock: 'in-stock',
  popular: false,
  lifetime: true
},
{
  id: 'pc-ultimate-20000',
  name: 'BR MOD ',
  diamonds: 20000,
  devices: ['PC'],
  prices: { PC: 7.50 },
  badge: 'best-value',
  image: "https://user23826.na.imgto.link/public/20260814/hq720-8.avif",
  imageAlt: 'BR MOD product image',
  rating: 5.0,
  reviews: 198,
  stock: 'limited',
  popular: false
},
{
  id: 'pc-pro-12000',
  name: 'PC Aim Bot',
  diamonds: 12000,
  devices: ['PC'],
  prices: { PC: 6.01 },
  badge: 'new',
  image: "https://user23826.na.imgto.link/public/20260814/hq720-9.avif",
  imageAlt: 'PC Aim Bot product — gaming software package for PC platform',
  rating: 4.7,
  reviews: 85,
  stock: 'in-stock',
  popular: false,
  lifetime: true
},
{
  id: 'pc-elite-8000',
  name: 'Dark Engine',
  diamonds: 8000,
  devices: ['PC'],
  prices: { PC: 12.02 },
  badge: null,
  image: "/assets/images/hq720 (4).jpg",
  imageAlt: 'Dark Engine product — premium PC gaming enhancement package',
  rating: 4.8,
  reviews: 62,
  stock: 'in-stock',
  popular: false
},
{
  id: 'ios-swift-800',
  name: 'Kyzo FF Xit',
  diamonds: 800,
  devices: ['iOS'],
  prices: { iOS: 10.52 },
  badge: 'new',
  lifetime: true,
  image: "/assets/images/maxresdefault (3).jpg",
  imageAlt: 'Kyzo FF Xit product image',
  rating: 4.6,
  reviews: 54,
  stock: 'in-stock',
  popular: false
},
{
  id: 'ios-elite-6000',
  name: 'Fluorite Panel',
  diamonds: 6000,
  devices: ['iOS'],
  prices: { iOS: 15 },
  badge: 'best-value',
  image: "https://user23826.na.imgto.link/public/20260814/images-5.avif",
  imageAlt: 'Fluorite Panel iOS product — premium gaming panel interface with vibrant display',
  rating: 4.9,
  reviews: 87,
  stock: 'limited',
  popular: true
},
{
  id: 'ios-ultra-12000',
  name: 'Proxy Ios ',
  diamonds: 12000,
  devices: ['iOS'],
  prices: { iOS: 13.52 },
  badge: null,
  image: "/assets/images/hq720 (6).jpg",
  imageAlt: 'Proxy Ios product image',
  rating: 4.8,
  reviews: 41,
  stock: 'in-stock',
  popular: false,
  lifetime: true
},
{
  id: 'ios-spark-400',
  name: 'Aim Lock ios',
  diamonds: 400,
  devices: ['iOS'],
  prices: { iOS: 7.51 },
  badge: null,
  image: "/assets/images/Aimlock-FF-Headshot.webp",
  imageAlt: 'Aim Lock iOS — aim lock gaming tool for iOS devices',
  rating: 4.5,
  reviews: 18,
  stock: 'in-stock',
  popular: false,
  lifetime: true
},
{
  id: 'ios-blaze-1500',
  name: 'Proxy Bhanu',
  diamonds: 1500,
  devices: ['iOS'],
  prices: { iOS: 10.50 },
  badge: 'hot',
  image: "https://user23826.na.imgto.link/public/20260814/maxresdefault-4.avif",
  imageAlt: 'Proxy Bhanu — mid-tier gaming diamonds bundle for iOS users',
  rating: 4.7,
  reviews: 32,
  stock: 'in-stock',
  popular: true,
  lifetime: true
},
{
  id: 'ios-titan-4000',
  name: 'iOS\nBody Hs',
  diamonds: 4000,
  devices: ['iOS'],
  prices: { iOS: 10.52 },
  badge: 'best-value',
  image: "https://user23826.na.imgto.link/public/20260814/hq720-7.avif",
  imageAlt: 'Body Hs — premium high-value diamonds bundle exclusively for iOS',
  rating: 4.9,
  reviews: 27,
  stock: 'in-stock',
  popular: true,
  lifetime: true
}];


const deviceFilters: {label: string;value: DeviceType;icon: string;}[] = [
{ label: 'All Devices', value: 'All', icon: 'Squares2X2Icon' },
{ label: 'Android', value: 'Android', icon: 'DevicePhoneMobileIcon' },
{ label: 'iOS', value: 'iOS', icon: 'DevicePhoneMobileIcon' },
{ label: 'PC', value: 'PC', icon: 'ComputerDesktopIcon' }];


const sortOptions: {label: string;value: SortType;}[] = [
{ label: 'Most Popular', value: 'popular' },
{ label: 'Price: Low to High', value: 'price-asc' },
{ label: 'Price: High to Low', value: 'price-desc' },
{ label: 'Diamonds: Low to High', value: 'diamonds-asc' },
{ label: 'Diamonds: High to Low', value: 'diamonds-desc' }];


function getDisplayPrice(product: Product, device: DeviceType): number {
  if (device !== 'All' && product.prices[device]) {
    return product.prices[device]!;
  }
  const prices = Object.values(product.prices).filter(Boolean) as number[];
  return Math.min(...prices);
}

function StockBadge({ stock }: {stock: Product['stock'];}) {
  if (stock === 'in-stock') {
    return (
      <span className="flex items-center gap-1 text-[10px] font-bold text-[#3DDC84]">
        <span className="w-1.5 h-1.5 rounded-full bg-[#3DDC84] animate-pulse" />
        In Stock
      </span>);

  }
  if (stock === 'limited') {
    return (
      <span className="flex items-center gap-1 text-[10px] font-bold text-accent">
        <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
        Limited
      </span>);

  }
  return (
    <span className="flex items-center gap-1 text-[10px] font-bold text-muted-foreground">
      <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground" />
      Out of Stock
    </span>);

}

function DevicePill({ device }: {device: string;}) {
  const cls =
  device === 'Android' ? 'device-badge-android' :
  device === 'iOS' ? 'device-badge-ios' : 'device-badge-pc';
  return null;
}

// ─── Payment Modal ────────────────────────────────────────────────────────────
interface PaymentModalProps {
  product: Product | null;
  onClose: () => void;
}

function PaymentModal({ product, onClose }: PaymentModalProps) {
  if (!product) return null;

  const whatsappNumber = '0743057846';
  const whatsappLink = `https://wa.me/94743057846?text=${encodeURIComponent(`Hi, I'd like to buy ${product.name}`)}`;

  const displayPrice = Math.min(...(Object.values(product.prices).filter(Boolean) as number[]));
  const lkrRate = 300;
  const lkrPrice = displayPrice * lkrRate;
  const orderId = `ORD-${product.id.slice(0, 6).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
  const orderDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative bg-card border border-border rounded-3xl w-full max-w-md shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-fire-gradient px-6 py-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-primary-foreground/70 font-semibold uppercase tracking-widest">Order Summary</p>
            <h2 className="text-lg font-bold text-primary-foreground">{product.name}</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
          >
            <Icon name="XMarkIcon" size={18} className="text-primary-foreground" variant="solid" />
          </button>
        </div>

        <div className="p-6 space-y-4">

          {/* ── Receipt ── */}
          <div className="bg-background border border-border rounded-2xl overflow-hidden">
            {/* Receipt header */}
            <div className="bg-muted/40 px-4 py-3 flex items-center gap-2 border-b border-border">
              <span className="text-lg">🧾</span>
              <span className="font-bold text-foreground text-sm uppercase tracking-wide">Receipt</span>
            </div>

            {/* Dotted top edge */}
            <div className="px-4 pt-4 pb-2 space-y-2.5 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Order ID</span>
                <span className="text-foreground font-mono font-semibold text-xs">{orderId}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Date</span>
                <span className="text-foreground font-medium text-xs">{orderDate}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Product</span>
                <span className="text-foreground font-semibold text-right max-w-[55%] leading-tight">{product.name}</span>
              </div>
              {product.devices.length > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Platform</span>
                  <span className="text-foreground font-medium">{product.devices.join(' / ')}</span>
                </div>
              )}

              {/* Dashed divider */}
              <div className="border-t border-dashed border-border my-1" />

              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="text-foreground font-mono">${displayPrice.toFixed(2)} <span className="text-xs text-muted-foreground">/ LKR {lkrPrice.toLocaleString()}</span></span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Discount</span>
                <span className="text-[#3DDC84] font-mono">$0.00</span>
              </div>

              {/* Total row */}
              <div className="border-t border-dashed border-border my-1" />
              <div className="flex justify-between items-center py-1">
                <span className="text-foreground font-bold text-base">Total</span>
                <div className="text-right">
                  <span className="text-primary font-mono font-extrabold text-xl">${displayPrice.toFixed(2)}</span>
                  <div className="text-xs text-muted-foreground font-mono">LKR {lkrPrice.toLocaleString()}</div>
                </div>
              </div>

              {/* Status pill */}
              <div className="flex justify-center pt-1 pb-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-xs font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse" />
                  Awaiting Payment
                </span>
              </div>
            </div>
          </div>

          {/* ── Divider with label ── */}
          <div className="flex items-center gap-3">
            <div className="flex-1 border-t border-border" />
            <span className="text-xs text-muted-foreground font-semibold uppercase tracking-widest">Pay Via</span>
            <div className="flex-1 border-t border-border" />
          </div>

          {/* Bank Transfer */}
          <div className="bg-background border border-border rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">🏦</span>
              <span className="font-bold text-foreground text-sm uppercase tracking-wide">Bank Transfer</span>
            </div>
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Bank</span>
                <span className="text-foreground font-medium">Dialog Finance Bank</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Account Name</span>
                <span className="text-foreground font-medium">W.A.G Wanasingha</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Account No.</span>
                <span className="text-foreground font-mono font-bold tracking-wider">001021031868</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Branch</span>
                <span className="text-foreground font-medium">Head Office</span>
              </div>
            </div>
          </div>

          {/* EZ Cash */}
          <div className="bg-background border border-border rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">💰</span>
              <span className="font-bold text-foreground text-sm uppercase tracking-wide">EZ Cash</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Number</span>
              <span className="text-foreground font-mono font-bold tracking-wider">{whatsappNumber}</span>
            </div>
          </div>

          {/* Binance */}
          <div className="bg-background border border-border rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">🛡</span>
              <span className="font-bold text-foreground text-sm uppercase tracking-wide">Binance</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Binance ID</span>
              <span className="text-foreground font-mono font-bold tracking-wider">970871875</span>
            </div>
          </div>

          {/* WhatsApp CTA */}
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 w-full py-3.5 rounded-2xl bg-[#25D366] hover:bg-[#1ebe5d] text-white font-bold text-sm transition-all duration-200 hover:scale-[1.02] shadow-lg"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Contact on WhatsApp · {whatsappNumber}
          </a>

          <p className="text-center text-xs text-muted-foreground">
            After payment, send your receipt via WhatsApp to confirm your order.
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── ProductCard ──────────────────────────────────────────────────────────────
function ProductCard({ product, selectedDevice, onBuyNow }: {product: Product; selectedDevice: DeviceType; onBuyNow: (p: Product) => void;}) {
  const displayPrice = getDisplayPrice(product, selectedDevice);

  return (
    <div className="group relative bg-card border border-border rounded-3xl overflow-hidden card-glow-primary transition-all duration-300 flex flex-col">
      {/* Image — links to product detail */}
      <Link href={`/products/${product.id}`} className="relative overflow-hidden h-44 sm:h-48 block">
        <AppImage
          src={product.image}
          alt={product.imageAlt}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-110" />
        
        <div className="absolute inset-0 bg-gradient-to-t from-card via-card/30 to-transparent" />

        {/* Badges top-left */}
        <div className="absolute top-3 left-3 flex gap-1.5">
          {product.badge === 'hot' && <span className="hot-badge">🔥 Hot</span>}
          {product.badge === 'best-value' && <span className="best-value-badge">⭐ Best Value</span>}
          {product.badge === 'new' &&
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-electric/20 text-electric border border-electric/30">
              New
            </span>
          }
        </div>

        {/* Stock top-right */}
        <div className="absolute top-3 right-3 glass-card rounded-full px-2 py-1">
          <StockBadge stock={product.stock} />
        </div>
      </Link>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        {/* Device badges */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {product.devices.map((d) =>
          <DevicePill key={d} device={d} />
          )}
        </div>

        <Link href={`/products/${product.id}`} className="hover:opacity-80 transition-opacity">
          <h3 className="font-bold text-foreground text-base mb-1 flex items-center gap-2">
            {product.devices.includes('Android') && (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-green-500 text-white shrink-0">Android</span>
            )}
            {product.devices.includes('iOS') && !product.devices.includes('Android') && (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-blue-500 text-white shrink-0">iOS</span>
            )}
            {product.devices.includes('PC') && !product.devices.includes('Android') && !product.devices.includes('iOS') && (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-purple-500 text-white shrink-0">PC</span>
            )}
            {product.name}
          </h3>
          {product.lifetime && (
            <span className="inline-flex items-center gap-1 mt-1 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase tracking-widest bg-green-500/20 text-green-400 border border-green-500/50 shadow-[0_0_8px_rgba(34,197,94,0.4)]">
              ✦ LIFE TIME
            </span>
          )}
        </Link>

        <div className="flex items-center gap-2 mb-4">
          <span className="text-xs text-muted-foreground">4.8 by 543k+ users</span>
          <span className="text-muted-foreground">·</span>
          <div className="flex items-center gap-1">
            <Icon name="StarIcon" size={12} className="text-accent" variant="solid" />
            <span className="text-xs text-muted-foreground">{product.rating} ({product.reviews.toLocaleString()})</span>
          </div>
        </div>

        <div className="mt-auto">
          {/* Prices by device */}
          {selectedDevice === 'All' ?
          <div className="flex flex-wrap gap-x-3 gap-y-1 mb-4">
              {Object.entries(product.prices).map(([dev, price]) =>
            <div key={dev} className="flex items-center gap-1">
                  <span className="text-[10px] text-muted-foreground">{dev}:</span>
                  <span className="font-mono-price text-sm text-foreground">${price?.toFixed(2)}</span>
                </div>
            )}
            </div> :

          <div className="mb-4">
              <span className="font-mono-price text-2xl text-foreground">${displayPrice.toFixed(2)}</span>
              <span className="text-xs text-muted-foreground ml-1">for {selectedDevice}</span>
            </div>
          }

          <button
            onClick={() => { if (product.stock !== 'out-of-stock') onBuyNow(product); }}
            disabled={product.stock === 'out-of-stock'}
            className={`w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-bold transition-all duration-300 ${
            product.stock === 'out-of-stock' ? 'bg-muted text-muted-foreground cursor-not-allowed' :
            'bg-fire-gradient text-primary-foreground hover:scale-105 hover:shadow-fire-sm'}`
            }>
            {product.stock === 'out-of-stock' ? 'Out of Stock' : (
              <>
                <Icon name="ShoppingCartIcon" size={16} variant="solid" />
                Buy Now
              </>
            )}
          </button>
        </div>
      </div>
    </div>);
}

export default function ProductsGrid() {
  const [activeDevice, setActiveDevice] = useState<DeviceType>('All');
  const [sortBy, setSortBy] = useState<SortType>('popular');
  const [search, setSearch] = useState('');
  const [paymentProduct, setPaymentProduct] = useState<Product | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll('.scroll-reveal').forEach((el, i) => {
              setTimeout(() => el.classList.add('revealed'), i * 60);
            });
          }
        });
      },
      { threshold: 0.05 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // Re-reveal cards whenever the filtered list changes (device switch, search, sort)
  useEffect(() => {
    if (!sectionRef.current) return;
    const els = sectionRef.current.querySelectorAll('.scroll-reveal');
    els.forEach((el, i) => {
      el.classList.remove('revealed');
      setTimeout(() => el.classList.add('revealed'), i * 60);
    });
  }, [activeDevice, search, sortBy]);

  const filtered = allProducts.
  filter((p) => {
    if (activeDevice !== 'All' && !p.devices.includes(activeDevice)) return false;
    if (activeDevice === 'iOS' && p.devices.includes('Android')) return false;
    if (activeDevice === 'PC' && !p.devices.includes('PC')) return false;
    if (activeDevice === 'PC' && p.devices.includes('Android')) return false;
    if (search && !p.name.toLowerCase().includes(search.toLowerCase()) && !p.diamonds.toString().includes(search))
    return false;
    return true;
  }).
  sort((a, b) => {
    if (sortBy === 'popular') return (b.popular ? 1 : 0) - (a.popular ? 1 : 0) || b.reviews - a.reviews;
    if (sortBy === 'price-asc') return getDisplayPrice(a, activeDevice) - getDisplayPrice(b, activeDevice);
    if (sortBy === 'price-desc') return getDisplayPrice(b, activeDevice) - getDisplayPrice(a, activeDevice);
    if (sortBy === 'diamonds-asc') return a.diamonds - b.diamonds;
    if (sortBy === 'diamonds-desc') return b.diamonds - a.diamonds;
    return 0;
  });

  return (
    <>
      {paymentProduct && (
        <PaymentModal product={paymentProduct} onClose={() => setPaymentProduct(null)} />
      )}
      <section ref={sectionRef} className="py-12 pb-24 bg-background relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* Filters row */}
        <div className="flex flex-col sm:flex-row gap-4 mb-10 scroll-reveal">
          {/* Device tabs */}
          <div className="flex gap-2 flex-wrap flex-1">
            {deviceFilters.map((f) =>
            <button
              key={f.value}
              onClick={() => setActiveDevice(f.value)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-bold transition-all duration-300 border ${
              activeDevice === f.value ?
              'bg-primary text-primary-foreground border-primary shadow-fire-sm scale-105' :
              'bg-card text-muted-foreground border-border hover:border-primary/50 hover:text-foreground'}`
              }>
              
                <Icon name={f.icon as Parameters<typeof Icon>[0]['name']} size={14} variant={activeDevice === f.value ? 'solid' : 'outline'} />
                {f.label}
              </button>
            )}
          </div>

          {/* Search */}
          <div className="relative">
            <Icon name="MagnifyingGlassIcon" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search panels..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-card border border-border rounded-full pl-9 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors w-full sm:w-48" />
            
          </div>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortType)}
            className="bg-card border border-border rounded-full px-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary transition-colors cursor-pointer">
            
            {sortOptions.map((o) =>
            <option key={o.value} value={o.value} className="bg-card text-foreground">
                {o.label}
              </option>
            )}
          </select>
        </div>

        {/* Results count */}
        <div className="mb-6 scroll-reveal stagger-1">
          <p className="text-sm text-muted-foreground">
            Showing <span className="text-foreground font-bold">{filtered.length}</span> panels
            {activeDevice !== 'All' &&
            <> for <span className="text-primary font-bold">{activeDevice}</span></>
            }
          </p>
        </div>

        {/* Grid */}
        {filtered.length > 0 ?
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((product, i) =>
          <div key={product.id} className={`scroll-reveal stagger-${Math.min(i + 1, 5)}`}>
                <ProductCard product={product} selectedDevice={activeDevice} onBuyNow={setPaymentProduct} />
              </div>
          )}
          </div> :

        <div className="text-center py-24">
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <Icon name="MagnifyingGlassIcon" size={32} className="text-muted-foreground" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">No panels found</h3>
            <p className="text-muted-foreground">Try a different device filter or search term.</p>
          </div>
        }
      </div>
    </section>
    </>
  );
}
