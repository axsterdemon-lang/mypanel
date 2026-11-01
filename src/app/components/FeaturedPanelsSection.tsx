'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Icon from '@/components/ui/AppIcon';

const featuredPanels = [
{
  id: 'mega-bundle',
  name: 'All device panels',
  diamonds: '10,000',
  devices: ['Android', 'iOS', 'PC'],
  price: '$8',
  originalPrice: '$109.99',
  badge: 'best-value',
  image: '/assets/images/panel-mega-bundle.png',
  imageAlt: 'Epic gaming setup with dual monitors glowing orange and blue, dark room, dramatic neon lighting, deep shadows',
  colSpan: 'md:col-span-1',
  rowSpan: 'md:row-span-2',
  tall: true
},
{
  id: 'starter-pack',
  name: 'Axster Cheats Full Pack',
  diamonds: '500',
  devices: ['Android', 'iOS'],
  price: '$4.99',
  originalPrice: null,
  badge: 'hot',
  image: '/assets/images/panel-starter.webp',
  imageAlt: 'Mobile gaming with colorful screen glow, dark background, vibrant neon reflections on hands',
  colSpan: 'md:col-span-1',
  rowSpan: '',
  tall: false
},
{
  id: 'pro-gamer',
  name: 'Android Drip Proxy',
  diamonds: '3,000',
  devices: ['Android', 'iOS', 'PC'],
  price: '$29.99',
  originalPrice: '$36.99',
  badge: null,
  image: '/assets/images/panel-pro.webp',
  imageAlt: 'Professional esports player at gaming station, intense focus, dark room with purple and orange glow',
  colSpan: 'md:col-span-1',
  rowSpan: '',
  tall: false
},
{
  id: 'android-exclusive',
  name: 'Reseller Dashbord',
  diamonds: '1,000',
  devices: ['Android'],
  price: '$8.99',
  originalPrice: '$11.99',
  badge: 'hot',
  image: '/assets/images/panel-android.webp',
  imageAlt: 'Android phone with gaming app open, dark atmospheric background, green and orange neon glow',
  colSpan: 'md:col-span-2',
  rowSpan: '',
  tall: false
},
{
  id: 'pc-poweruser',
  name: 'PC Power User',
  diamonds: '20,000',
  devices: ['PC'],
  price: '$169.99',
  originalPrice: '$199.99',
  badge: 'best-value',
  image: '/assets/images/panel-pc.webp',
  imageAlt: 'High-end gaming PC setup with RGB lighting, dark room, yellow and blue neon illumination on desk',
  colSpan: 'md:col-span-3',
  rowSpan: '',
  tall: false
},
{
  id: 'aim-practice',
  name: 'Aim Practice Trainer',
  diamonds: 'Free',
  devices: ['Android', 'iOS', 'PC'],
  price: 'Free',
  originalPrice: null,
  badge: 'new',
  image: '/assets/images/panel-android.webp',
  imageAlt: 'Standalone browser aim practice trainer',
  colSpan: 'md:col-span-3',
  rowSpan: '',
  tall: false
}];


function DeviceBadge({ device }: {device: string;}) {
  const cls =
  device === 'Android' ? 'device-badge-android' :
  device === 'iOS' ? 'device-badge-ios' : 'device-badge-pc';
  return (
    <span className={`${cls} text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full`}>
      {device}
    </span>);

}

function PanelCard({ panel }: {panel: (typeof featuredPanels)[0];}) {
  return (
    <div
      onClick={panel.id === 'aim-practice' ? () => { window.location.href = '/tools/aim-practice'; } : undefined}
      onKeyDown={panel.id === 'aim-practice' ? (event) => { if (event.key === 'Enter') window.location.href = '/tools/aim-practice'; } : undefined}
      role={panel.id === 'aim-practice' ? 'link' : undefined}
      tabIndex={panel.id === 'aim-practice' ? 0 : undefined}
      className={`${panel.colSpan} ${panel.rowSpan} group relative rounded-3xl overflow-hidden border border-border bg-card card-glow-primary transition-all duration-300 cursor-pointer ${panel.tall ? 'flex flex-col' : ''}`}>
      
      {/* Image */}
      <div className={`relative overflow-hidden ${panel.tall ? 'flex-1' : 'h-48 sm:h-52'}`}>
        <Image
          src={panel.image}
          alt={panel.imageAlt}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover transition-transform duration-700 group-hover:scale-110" />
        
        {/* Scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />

        {/* Badge */}
        {panel.badge &&
        <div className="absolute top-3 left-3">
          {panel.badge === 'hot' ?
          <span className="hot-badge">🔥 Hot</span> :
          panel.badge === 'new' ? <span className="rounded-full border border-primary/40 bg-primary/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary">New · Free</span> :
          <span className="best-value-badge">⭐ Best Value</span>
          }
          </div>
        }
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex flex-wrap gap-1.5 mb-3">
          {panel.devices.map((d) =>
          <DeviceBadge key={d} device={d} />
          )}
        </div>
        <h3 className="font-bold text-foreground text-base mb-1">{panel.name}</h3>
        <p className="text-xs mb-4 text-[rgba(254,251,230,1)]">
          {panel.id === 'aim-practice' ? 'Practice aim in your browser. No game files or account access needed.' : <>Life Time access✅<br />24H support team.<br />A-Z setup Guide</>}
        </p>
        {panel.id === 'aim-practice' && <span className="inline-flex items-center gap-2 text-sm font-bold text-primary">Play practice game <Icon name="ArrowRightIcon" size={16} /></span>}
      </div>
    </div>);

}

export default function FeaturedPanelsSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll('.scroll-reveal').forEach((el, i) => {
              setTimeout(() => el.classList.add('revealed'), i * 100);
            });
          }
        });
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="featured-panels" ref={sectionRef} className="py-20 bg-background relative overflow-hidden">
      <div
        className="absolute top-0 right-0 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(255,215,0,0.06) 0%, transparent 70%)' }} />
      

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12 scroll-reveal">
          <div>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full fire-border bg-fire-subtle text-primary text-xs font-bold uppercase tracking-widest mb-4">
              <Icon name="FireIcon" size={12} variant="solid" />
              Top Sellers
            </span>
            <h2 className="text-section-title text-foreground">
              Featured <span className="fire-gradient-text">Panels</span>
            </h2>
          </div>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary transition-colors duration-200 whitespace-nowrap">
            
            View All Panels
            <Icon name="ArrowRightIcon" size={16} />
          </Link>
        </div>

        {/* BENTO GRID */}
        {/* Row 1: MegaBundle(rs-2) | StarterPack | ProGamer */}
        {/* Row 2: (MegaBundle cont.) | AndroidExclusive(cs-2) */}
        {/* Row 3: PCPowerUser(cs-3) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* col-1 rs-2: MegaBundle */}
          <div className="md:col-span-1 md:row-span-2 scroll-reveal stagger-1">
            <PanelCard panel={featuredPanels[0]} />
          </div>

          {/* col-2 rs-1: StarterPack */}
          <div className="md:col-span-1 scroll-reveal stagger-2">
            <PanelCard panel={{ ...featuredPanels[1], colSpan: '', rowSpan: '' }} />
          </div>

          {/* col-3 rs-1: ProGamer */}
          <div className="md:col-span-1 scroll-reveal stagger-3">
            <PanelCard panel={{ ...featuredPanels[2], colSpan: '', rowSpan: '' }} />
          </div>

          {/* col-2..3 rs-1: AndroidExclusive */}
          <div className="md:col-span-2 scroll-reveal stagger-4">
            <PanelCard panel={{ ...featuredPanels[3], colSpan: '', rowSpan: '' }} />
          </div>

          {/* col-1..3 rs-1: PCPowerUser */}
          <div className="md:col-span-3 scroll-reveal stagger-5">
            <PanelCard panel={{ ...featuredPanels[4], colSpan: '', rowSpan: '' }} />
          </div>
          <div className="md:col-span-3 scroll-reveal stagger-5">
            <PanelCard panel={{ ...featuredPanels[5], colSpan: '', rowSpan: '' }} />
          </div>
        </div>
      </div>
    </section>);

}
