'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';
import styles from './HeroSection.module.css';

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
    <section className={styles.hero} data-depth-background>
      <div className={styles.artwork} aria-hidden="true">
        <AppImage src="/assets/images/samurai-home-background.png" alt="" width={1672} height={941} priority className={styles.backgroundImage} />
      </div>
      <div className={styles.overlay} aria-hidden="true" />
      <div className={styles.container}>
        <div className={`${styles.content} space-y-7 transition-all duration-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}>
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

      </div>
    </section>
  );
}
