'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';

const devices = [
{
  id: 'android',
  label: 'Android',
  icon: 'DevicePhoneMobileIcon',
  color: 'text-[#3DDC84]',
  activeBg: 'bg-[#3DDC84]',
  price: 'from $0.99',
  description: 'SHOW MORE DETAILS'
},
{
  id: 'ios',
  label: 'iOS',
  icon: 'DevicePhoneMobileIcon',
  color: 'text-electric',
  activeBg: 'bg-electric',
  price: 'from $1.49',
  description: 'SHOW MORE DETAILS'
},
{
  id: 'pc',
  label: 'PC',
  icon: 'ComputerDesktopIcon',
  color: 'text-accent',
  activeBg: 'bg-accent',
  price: 'from $1.29',
  description: '500 – 20,000 Diamonds'
}];


const floatingStats = [
{ label: 'Panels Sold Today', value: '1,247', icon: 'BoltIcon', color: 'text-primary' },
{ label: 'Instant Delivery', value: '< 60s', icon: 'ClockIcon', color: 'text-electric' }];


export default function HeroSection() {
  const [activeDevice, setActiveDevice] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center overflow-hidden bg-background bg-grid-pattern pt-20">
      
      {/* Atmospheric orbs */}
      <div
        className="absolute top-1/4 -left-32 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(255,107,0,0.12) 0%, transparent 70%)' }} />
      
      <div
        className="absolute bottom-1/4 -right-32 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(0,212,255,0.08) 0%, transparent 70%)' }} />
      
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(255,215,0,0.04) 0%, transparent 70%)' }} />
      

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 w-full py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* Left: Content */}
          <div className="space-y-8 order-2 lg:order-1">
            {/* Eyebrow */}
            <div
              className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
              
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full fire-border bg-fire-subtle text-primary text-xs font-bold uppercase tracking-widest">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse-glow" />
                FREE FIRE BEST PANELS
              </span>
            </div>

            {/* Headline */}
            <div
              className={`transition-all duration-700 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
              
              <h1 className="text-hero-xl text-foreground">
                AXSTER 999{' '}
                <span className="fire-gradient-text animate-fire-flicker inline-block">Premium</span>
                <br />
                <span className="text-foreground">Cheats.</span>
              </h1>
            </div>

            {/* Sub */}
            <p
              className={`text-base sm:text-lg text-muted-foreground max-w-md leading-relaxed transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
              
              Verified Free Fire panels for Android, iOS, and PC. Secure checkout, instant delivery — get back to the battlefield in under 60 seconds.
            </p>

            {/* Device Selector */}
            <div
              className={`transition-all duration-700 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
              
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Select Your Device</p>
              <div className="flex gap-3 flex-wrap">
                {devices.map((d, i) =>
                <button
                  key={d.id}
                  onClick={() => setActiveDevice(i)}
                  className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-bold transition-all duration-300 border ${
                  activeDevice === i ?
                  'bg-primary text-primary-foreground border-primary shadow-fire-md scale-105' :
                  'bg-card text-muted-foreground border-border hover:border-primary/50 hover:text-foreground'}`
                  }>
                  
                    <Icon name={d.icon as Parameters<typeof Icon>[0]['name']} size={16} variant={activeDevice === i ? 'solid' : 'outline'} />
                    {d.label}
                  </button>
                )}
              </div>

              {/* Device Info */}
              <div className="mt-4 p-4 rounded-2xl bg-card border border-border flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground font-medium">{devices[activeDevice].description}</p>
                  <p className="text-xl font-mono-price text-foreground mt-1">
                    Low price & best item
                  </p>
                </div>
                <Link
                  href="/products"
                  className="flex items-center gap-2 bg-fire-gradient text-primary-foreground px-5 py-2.5 rounded-full text-sm font-bold hover:scale-105 transition-transform duration-200 shadow-fire-sm whitespace-nowrap">
                  
                  View Panels
                  <Icon name="ArrowRightIcon" size={14} />
                </Link>
              </div>
            </div>

            {/* CTAs */}
            <div
              className={`flex flex-wrap gap-4 transition-all duration-700 delay-[400ms] ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
              
              <Link
                href="/products"
                className="inline-flex items-center gap-2 bg-fire-gradient text-primary-foreground px-8 py-4 rounded-full font-bold text-base hover:scale-105 transition-all duration-300 shadow-fire-md animate-pulse-glow">
                
                <Icon name="BoltIcon" size={18} variant="solid" />
                Shop All Panels
              </Link>
              <a
                href="#how-it-works"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold text-base border border-border text-foreground hover:border-primary hover:text-primary transition-all duration-300">
                
                How It Works
                <Icon name="ChevronDownIcon" size={16} />
              </a>
            </div>

            {/* Floating stats */}
            <div
              className={`flex flex-wrap gap-4 transition-all duration-700 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
              
              {floatingStats.map((stat) =>
              <div key={stat.label} className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-card border border-border">
                  <Icon name={stat.icon as Parameters<typeof Icon>[0]['name']} size={18} className={stat.color} variant="solid" />
                  <div>
                    <p className="text-base font-mono-price text-foreground">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right: Visual */}
          <div
            className={`relative order-1 lg:order-2 flex justify-center transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
            
            {/* Background glow behind image */}
            <div
              className="absolute inset-0 rounded-4xl pointer-events-none"
              style={{ background: 'radial-gradient(ellipse at center, rgba(255,107,0,0.2) 0%, transparent 70%)' }} />
            

            {/* Main image */}
            <div className="relative w-full max-w-[480px] lg:max-w-full">
              <div className="relative rounded-4xl overflow-hidden border border-border shadow-card-dark animate-float">
                <AppImage
                  src="/assets/images/hero.webp"
                  alt="Gamer in dark room with glowing screen, intense neon lighting, gaming atmosphere, deep shadows, electric blue and orange glow"
                  width={600}
                  height={500}
                  priority
                  className="w-full object-cover h-[320px] sm:h-[400px] lg:h-[500px]" />
                
                {/* Scrim for text contrast */}
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent" />

                {/* Overlay badge bottom */}
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="glass-card rounded-2xl p-4 border border-border flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-fire-subtle border border-primary/30 flex items-center justify-center">
                        <Icon name="FireIcon" size={20} className="text-primary" variant="solid" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-foreground">🔥 Top Seller</p>
                        <p className="text-xs text-muted-foreground">999+ customers base</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-mono-price text-accent text-lg font-extrabold">Good Choice</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating card - top right */}
              <div
                className="absolute -top-4 -right-4 sm:-right-8 glass-card border border-border rounded-2xl p-3 shadow-fire-sm animate-float-delayed hidden sm:block">
                
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-electric-subtle border border-electric/30 flex items-center justify-center">
                    <Icon name="ShieldCheckIcon" size={16} className="text-electric" variant="solid" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-foreground">Verified Seller</p>
                    <p className="text-[10px] text-muted-foreground">100% Authentic</p>
                  </div>
                </div>
              </div>

              {/* Floating card - bottom left */}
              <div
                className="absolute -bottom-4 -left-4 sm:-left-8 glass-card border border-border rounded-2xl p-3 shadow-gold-sm animate-float hidden sm:block">
                
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-fire-subtle border border-accent/30 flex items-center justify-center">
                    <Icon name="StarIcon" size={16} className="text-accent" variant="solid" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-foreground">4.9 / 5.0</p>
                    <p className="text-[10px] text-muted-foreground">12,400+ reviews</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground">
        <p className="text-xs font-medium tracking-widest uppercase">Scroll</p>
        <Icon name="ChevronDownIcon" size={20} className="animate-bounce" />
      </div>
    </section>);

}
