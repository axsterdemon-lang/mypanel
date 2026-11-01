'use client';

import React, { useEffect, useRef } from 'react';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';

/*
BENTO GRID AUDIT (Testimonials Mosaic):
Array has 7 cards: [StatDiamonds, QuoteCarlos, PhotoMia, QuoteAlex, StatDelivery, PhotoJordan, QuoteNadia]

Row 1 (grid-cols-3):
  [col-1: StatDiamonds cs-1 rs-1] [col-2: QuoteCarlos cs-2 rs-1]
Row 2 (grid-cols-3):
  [col-1: PhotoMia cs-1 rs-2] [col-2: QuoteAlex cs-1 rs-1] [col-3: StatDelivery cs-1 rs-1]
Row 3 (grid-cols-3):
  [col-1: (occupied by PhotoMia)] [col-2: PhotoJordan cs-2 rs-1]
Row 4 (grid-cols-3):
  [col-1: QuoteNadia cs-3 rs-1]

Placed 7/7 cards ✓
*/

const reviews = [
{
  id: 'carlos',
  type: 'quote',
  quote: '"Got my 3,000 diamonds in literally 45 seconds. Fastest top-up I\'ve ever done. Will never go back to the official store."',
  name: 'Carlos Mendes',
  role: 'Rank: Heroic',
  avatar: "https://images.unsplash.com/photo-1734233388742-e6857e8a1e8c",
  avatarAlt: 'Young man with short dark hair, friendly smile, casual clothing',
  stars: 5,
  device: 'Android',
  colSpan: 'md:col-span-2',
  rowSpan: ''
},
{
  id: 'alex',
  type: 'quote',
  quote: '"PC panels at a price that actually makes sense. The bulk discount saved me $40 this month alone."',
  name: 'Alex Okonkwo',
  role: 'Rank: Grandmaster',
  avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_1ae0f3431-1763296290027.png",
  avatarAlt: 'Man in his 20s with confident expression, dark background portrait',
  stars: 5,
  device: 'PC',
  colSpan: 'md:col-span-1',
  rowSpan: ''
},
{
  id: 'nadia',
  type: 'quote',
  quote: '"I resell panels to my squad every week. FirePanels has the best margin on bulk iOS bundles. Support is also super responsive."', name: 'Nadia Patel', role: 'Reseller · 200+ orders', avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_12d00e908-1772206554742.png", avatarAlt: 'Young woman with dark hair, bright eyes, natural smile, light background', stars: 5, device: 'iOS', colSpan: 'md:col-span-3', rowSpan: ''
}];


const photoCards = [
{
  id: 'mia',
  image: "https://images.unsplash.com/photo-1725273454553-aec0c2905bbb",
  imageAlt: 'Young woman gaming, dark room with pink and purple screen glow, intense focused expression',
  name: 'Mia Torres',
  role: 'iOS · 50+ orders',
  colSpan: 'md:col-span-1',
  rowSpan: 'md:row-span-2'
},
{
  id: 'jordan',
  image: "https://images.unsplash.com/photo-1636487658609-28282bb5a3a0",
  imageAlt: 'Gamer with headset at desktop PC setup, dark room, orange and blue RGB lighting, competitive gaming environment',
  name: 'Jordan Kim',
  role: 'PC · Grandmaster',
  colSpan: 'md:col-span-2',
  rowSpan: ''
}];


const statCards = [
{
  id: 'stat-diamonds',
  value: '420K+',
  label: 'Diamonds Delivered',
  icon: 'CubeIcon',
  color: 'text-primary',
  bg: 'bg-fire-subtle',
  border: 'border-primary/20'
},
{
  id: 'stat-delivery',
  value: '< 60s',
  label: 'Avg. Delivery Time',
  icon: 'BoltIcon',
  color: 'text-electric',
  bg: 'bg-electric-subtle',
  border: 'border-electric/20'
}];


function StarRating({ count }: {count: number;}) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) =>
      <Icon key={i} name="StarIcon" size={14} className="text-accent" variant="solid" />
      )}
    </div>);

}

function DevicePill({ device }: {device: string;}) {
  const cls =
  device === 'Android' ? 'device-badge-android' :
  device === 'iOS' ? 'device-badge-ios' : 'device-badge-pc';
  return (
    <span className={`${cls} text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full`}>
      {device}
    </span>);

}

export default function TestimonialsSection() {
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
    <section id="reviews" ref={sectionRef} className="py-20 bg-background relative overflow-hidden">
      <div
        className="absolute bottom-0 left-0 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(0,212,255,0.06) 0%, transparent 70%)' }} />
      

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-12 scroll-reveal">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full electric-border bg-electric-subtle text-electric text-xs font-bold uppercase tracking-widest mb-6">
            <Icon name="StarIcon" size={12} variant="solid" />
            Player Reviews
          </span>
          <h2 className="text-section-title text-foreground mb-4">
            Trusted by <span className="fire-gradient-text">85,000+</span> Players
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">Real players. Real diamonds. Real results.</p>
        </div>

        {/* MOSAIC GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

          {/* Row 1: StatDiamonds | QuoteCarlos(cs-2) */}

          {/* StatDiamonds */}
          <div className="md:col-span-1 scroll-reveal stagger-1">
            <div className={`bg-card border ${statCards[0].border} rounded-3xl p-8 h-full flex flex-col items-center justify-center text-center group card-glow-primary transition-all duration-300`}>
              <div className={`w-16 h-16 rounded-2xl ${statCards[0].bg} border ${statCards[0].border} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <Icon name={statCards[0].icon as Parameters<typeof Icon>[0]['name']} size={30} className={statCards[0].color} variant="solid" />
              </div>
              <p className={`text-4xl font-extrabold font-mono-price ${statCards[0].color} mb-2`}>{statCards[0].value}</p>
              <p className="text-sm text-muted-foreground font-medium uppercase tracking-widest">{statCards[0].label}</p>
            </div>
          </div>

          {/* QuoteCarlos (cs-2) */}
          <div className="md:col-span-2 scroll-reveal stagger-2">
            <div className="bg-card border border-border rounded-3xl p-8 h-full flex flex-col justify-between group card-glow-primary transition-all duration-300">
              <div>
                <StarRating count={reviews[0].stars} />
                <p className="text-foreground text-base leading-relaxed mt-4 italic">{reviews[0].quote}</p>
              </div>
              <div className="flex items-center justify-between mt-6">
                <div className="flex items-center gap-3">
                  <AppImage
                    src={reviews[0].avatar}
                    alt={reviews[0].avatarAlt}
                    width={44}
                    height={44}
                    className="rounded-full border-2 border-border object-cover" />
                  
                  <div>
                    <p className="text-sm font-bold text-foreground">{reviews[0].name}</p>
                    <p className="text-xs text-muted-foreground">{reviews[0].role}</p>
                  </div>
                </div>
                <DevicePill device={reviews[0].device} />
              </div>
            </div>
          </div>

          {/* Row 2: PhotoMia(rs-2) | QuoteAlex | StatDelivery */}

          {/* PhotoMia (rs-2) */}
          <div className="md:col-span-1 md:row-span-2 scroll-reveal stagger-1">
            <div className="relative rounded-3xl overflow-hidden border border-border h-full min-h-[300px] group">
              <AppImage
                src={photoCards[0].image}
                alt={photoCards[0].imageAlt}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover transition-transform duration-700 group-hover:scale-110" />
              
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/30 to-transparent" />
              <div className="absolute bottom-5 left-5 right-5">
                <p className="text-sm font-bold text-foreground">{photoCards[0].name}</p>
                <p className="text-xs text-muted-foreground">{photoCards[0].role}</p>
              </div>
            </div>
          </div>

          {/* QuoteAlex */}
          <div className="md:col-span-1 scroll-reveal stagger-2">
            <div className="bg-card border border-border rounded-3xl p-7 h-full flex flex-col justify-between group card-glow-primary transition-all duration-300">
              <div>
                <StarRating count={reviews[1].stars} />
                <p className="text-foreground text-sm leading-relaxed mt-4 italic">{reviews[1].quote}</p>
              </div>
              <div className="flex items-center justify-between mt-6">
                <div className="flex items-center gap-3">
                  <AppImage
                    src={reviews[1].avatar}
                    alt={reviews[1].avatarAlt}
                    width={40}
                    height={40}
                    className="rounded-full border-2 border-border object-cover" />
                  
                  <div>
                    <p className="text-sm font-bold text-foreground">{reviews[1].name}</p>
                    <p className="text-xs text-muted-foreground">{reviews[1].role}</p>
                  </div>
                </div>
                <DevicePill device={reviews[1].device} />
              </div>
            </div>
          </div>

          {/* StatDelivery */}
          <div className="md:col-span-1 scroll-reveal stagger-3">
            <div className={`bg-card border ${statCards[1].border} rounded-3xl p-8 h-full flex flex-col items-center justify-center text-center group card-glow-electric transition-all duration-300`}>
              <div className={`w-16 h-16 rounded-2xl ${statCards[1].bg} border ${statCards[1].border} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <Icon name={statCards[1].icon as Parameters<typeof Icon>[0]['name']} size={30} className={statCards[1].color} variant="solid" />
              </div>
              <p className={`text-4xl font-extrabold font-mono-price ${statCards[1].color} mb-2`}>{statCards[1].value}</p>
              <p className="text-sm text-muted-foreground font-medium uppercase tracking-widest">{statCards[1].label}</p>
            </div>
          </div>

          {/* Row 3: (PhotoMia occupied) | PhotoJordan(cs-2) */}

          {/* PhotoJordan (cs-2) */}
          <div className="md:col-span-2 scroll-reveal stagger-2">
            <div className="relative rounded-3xl overflow-hidden border border-border h-52 group">
              <AppImage
                src={photoCards[1].image}
                alt={photoCards[1].imageAlt}
                fill
                sizes="(max-width: 768px) 100vw, 66vw"
                className="object-cover transition-transform duration-700 group-hover:scale-110" />
              
              <div className="absolute inset-0 bg-gradient-to-r from-background/70 via-background/20 to-transparent" />
              <div className="absolute bottom-5 left-5">
                <p className="text-sm font-bold text-foreground">{photoCards[1].name}</p>
                <p className="text-xs text-muted-foreground">{photoCards[1].role}</p>
              </div>
            </div>
          </div>

          {/* Row 4: QuoteNadia (cs-3) */}
          <div className="md:col-span-3 scroll-reveal stagger-1">
            <div className="bg-card border border-border rounded-3xl p-8 group card-glow-primary transition-all duration-300">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex-1">
                  <StarRating count={reviews[2].stars} />
                  <p className="text-foreground text-lg leading-relaxed mt-4 italic max-w-3xl">{reviews[2].quote}</p>
                </div>
                <div className="flex flex-col items-start md:items-end gap-3 shrink-0">
                  <div className="flex items-center gap-3">
                    <div className="text-right hidden md:block">
                      <p className="text-sm font-bold text-foreground">{reviews[2].name}</p>
                      <p className="text-xs text-muted-foreground">{reviews[2].role}</p>
                    </div>
                    <AppImage
                      src={reviews[2].avatar}
                      alt={reviews[2].avatarAlt}
                      width={52}
                      height={52}
                      className="rounded-full border-2 border-primary/30 object-cover" />
                    
                  </div>
                  <div className="md:hidden">
                    <p className="text-sm font-bold text-foreground">{reviews[2].name}</p>
                    <p className="text-xs text-muted-foreground">{reviews[2].role}</p>
                  </div>
                  <DevicePill device={reviews[2].device} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>);

}