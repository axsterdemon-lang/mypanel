'use client';

import React, { useState, useEffect, useRef } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { allProducts, type Product } from '@/lib/payments/catalog';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';

type DeviceType = 'All' | 'Android' | 'iOS' | 'PC';
type SortType = 'popular' | 'price-asc' | 'price-desc' | 'diamonds-asc' | 'diamonds-desc';

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
  const router = useRouter();
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
                <ProductCard product={product} selectedDevice={activeDevice} onBuyNow={(p) => router.push(`/checkout?product=${encodeURIComponent(p.id)}&device=${encodeURIComponent(activeDevice === 'All' ? p.devices[0] : activeDevice)}`)} />
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
