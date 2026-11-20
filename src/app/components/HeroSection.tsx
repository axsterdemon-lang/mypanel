'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';

const devices = [
  { id: 'android', label: 'Android', icon: 'DevicePhoneMobileIcon', detail: 'Android panels', price: 'from $0.99' },
  { id: 'ios', label: 'iOS', icon: 'DevicePhoneMobileIcon', detail: 'iOS panels', price: 'from $1.49' },
  { id: 'pc', label: 'PC', icon: 'ComputerDesktopIcon', detail: 'PC panels', price: 'from $1.29' },
];

export default function HeroSection() {
  const [activeDevice, setActiveDevice] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const device = devices[activeDevice];

  return (
    <section className="relative isolate min-h-[calc(100svh-5rem)] overflow-hidden bg-background bg-grid-pattern pt-20">
      <div className="pointer-events-none absolute -left-40 top-16 -z-10 h-[32rem] w-[32rem] rounded-full bg-[#ff6b00]/10 blur-[120px]" />
      <div className="pointer-events-none absolute -right-32 bottom-0 -z-10 h-[32rem] w-[32rem] rounded-full bg-[#00d4ff]/10 blur-[120px]" />

      <div className="mx-auto grid min-h-[calc(100svh-5rem)] max-w-7xl items-center gap-8 px-4 py-14 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:gap-4 lg:px-8 lg:py-10">
        <div className={`relative z-10 order-2 space-y-7 transition-all duration-700 lg:order-1 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}>
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-fire-subtle px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-primary">
            <span className="h-2 w-2 rounded-full bg-primary shadow-[0_0_12px_#ff6b00]" />
            FirePanels · Gaming Store
          </div>

          <div className="space-y-4">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground">Your game. Your setup. Your edge.</p>
            <h1 className="max-w-3xl text-hero-xl text-foreground">
              LEVEL UP YOUR <span className="fire-gradient-text">GAME.</span>
              <br />
              <span className="electric-gradient-text">PLAY YOUR WAY.</span>
            </h1>
            <p className="max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              Explore Free Fire panels for Android, iOS, and PC. Choose your device, find your panel, and get back to the action.
            </p>
          </div>

          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">Choose your platform</p>
            <div className="flex flex-wrap gap-3" role="group" aria-label="Choose your device">
              {devices.map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  aria-pressed={activeDevice === index}
                  onClick={() => setActiveDevice(index)}
                  className={`inline-flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-bold transition-all duration-200 ${
                    activeDevice === index
                      ? 'border-primary bg-primary text-primary-foreground shadow-[0_0_24px_rgba(255,107,0,0.22)]'
                      : 'border-border bg-card/80 text-muted-foreground hover:border-primary/60 hover:text-foreground'
                  }`}
                >
                  <Icon name={item.icon as Parameters<typeof Icon>[0]['name']} size={17} />
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex max-w-xl flex-col gap-4 rounded-2xl border border-border bg-card/80 p-4 backdrop-blur sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-foreground">{device.detail}</p>
              <p className="mt-1 font-mono-price text-lg text-accent">{device.price}</p>
            </div>
            <Link href="/products" className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-fire-gradient px-5 py-3 text-sm font-bold text-primary-foreground transition-transform hover:scale-[1.03]">
              Browse panels <Icon name="ArrowRightIcon" size={16} />
            </Link>
          </div>

          <div className="flex flex-wrap gap-x-6 gap-y-3 pt-1 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground sm:text-sm">
            <span className="inline-flex items-center gap-2"><Icon name="ShieldCheckIcon" size={17} className="text-electric" /> Secure checkout</span>
            <span className="inline-flex items-center gap-2"><Icon name="BoltIcon" size={17} className="text-primary" /> Quick delivery</span>
            <span className="inline-flex items-center gap-2"><Icon name="ComputerDesktopIcon" size={17} className="text-accent" /> Android · iOS · PC</span>
          </div>

          <Link href="#how-it-works" className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground transition-colors hover:text-foreground">
            How it works <Icon name="ChevronDownIcon" size={16} />
          </Link>
        </div>

        <div className={`relative order-1 mx-auto w-full max-w-2xl transition-all duration-1000 lg:order-2 ${isVisible ? 'scale-100 opacity-100' : 'scale-[0.97] opacity-0'}`}>
          <div className="pointer-events-none absolute inset-8 rounded-full bg-primary/10 blur-[90px]" />
          <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] border border-white/10 bg-[#090a10] shadow-[0_32px_100px_rgba(0,0,0,0.55)]">
            <AppImage
              src="/assets/images/hero-firepanels-samurai.png"
              alt="Cinematic samurai warrior artwork with a dark gaming atmosphere"
              width={1536}
              height={1024}
              priority
              className="absolute inset-0 h-full w-full object-cover object-[62%_center]"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#090a10]/85 via-[#090a10]/15 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-[#090a10]/80 to-transparent" />
            <div className="absolute left-5 top-5 rounded-full border border-white/15 bg-black/40 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white/80 backdrop-blur sm:left-7 sm:top-7 sm:text-xs">
              Built for the battlefield
            </div>
            <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-4 sm:bottom-7 sm:left-7 sm:right-7">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-primary sm:text-xs">FirePanels / 01</p>
                <p className="mt-2 text-xl font-extrabold uppercase leading-none text-white sm:text-3xl">Pick your panel.<br /><span className="text-white/60">Own your play.</span></p>
              </div>
              <div className="hidden rounded-xl border border-white/15 bg-black/40 px-4 py-3 text-right backdrop-blur sm:block">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/50">Available on</p>
                <p className="mt-1 text-sm font-bold text-white">Android · iOS · PC</p>
              </div>
            </div>
          </div>
          <div className="absolute -bottom-4 right-4 hidden rounded-xl border border-primary/30 bg-[#12121c]/95 px-4 py-3 shadow-[0_12px_40px_rgba(0,0,0,0.4)] backdrop-blur sm:block lg:-right-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">Find your setup</p>
            <p className="mt-1 text-sm font-extrabold text-foreground">Android / iOS / PC</p>
          </div>
        </div>
      </div>
    </section>
  );
}
