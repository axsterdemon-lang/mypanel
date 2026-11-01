'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';

const steps = [
{
  number: '01',
  icon: 'DevicePhoneMobileIcon',
  title: 'Pick Your Device & Panel',
  description: 'Choose Android, iOS, or PC. Select your diamond bundle — from 100 to 20,000 diamonds.',
  color: 'text-primary',
  borderColor: 'border-primary/30',
  bgColor: 'bg-fire-subtle',
  glowColor: 'shadow-fire-sm'
},
{
  number: '02',
  icon: 'LockClosedIcon',
  title: 'Secure Checkout',
  description: 'Pay with your preferred method. All transactions are encrypted and verified instantly.',
  color: 'text-electric',
  borderColor: 'border-electric/30',
  bgColor: 'bg-electric-subtle',
  glowColor: 'shadow-electric-sm'
},
{
  number: '03',
  icon: 'BoltIcon',
  title: 'Receive & Play',
  description: 'Your panel code arrives in under 60 seconds. Redeem in-game and dominate the battlefield.',
  color: 'text-accent',
  borderColor: 'border-accent/30',
  bgColor: '',
  glowColor: 'shadow-gold-sm'
}];


export default function HowItWorksSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll('.scroll-reveal').forEach((el, i) => {
              setTimeout(() => el.classList.add('revealed'), i * 120);
            });
          }
        });
      },
      { threshold: 0.15 }
    );
    if (sectionRef?.current) observer?.observe(sectionRef?.current);
    return () => observer?.disconnect();
  }, []);

  return (
    <section
      id="how-it-works"
      ref={sectionRef}
      className="py-20 relative overflow-hidden bg-[rgba(10,10,41,1)]">

      {/* Background texture */}
      <div className="absolute inset-0 bg-grid-pattern opacity-50 pointer-events-none" />
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[2px] pointer-events-none"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(255,107,0,0.4), transparent)' }} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-16 scroll-reveal">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full electric-border bg-electric-subtle text-electric text-xs font-bold uppercase tracking-widest mb-6">
            <Icon name="BoltIcon" size={12} variant="solid" />
            Super Simple Process
          </span>
          <h2 className="text-section-title text-foreground mb-4">
            Choose the product that suits your device.
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto leading-relaxed">The number one trusted best place in Sri Lanka

          </p>
        </div>

        {/* Steps — asymmetric layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {steps?.map((step, i) =>
          <div
            key={step?.number}
            className={`scroll-reveal stagger-${i + 1} relative group`}>

              {/* Connector line (desktop) */}
              {i < steps?.length - 1 &&
            <div
              className="hidden md:block absolute top-12 left-[calc(100%_-_16px)] w-[calc(100%_-_32px)] h-px z-10 pointer-events-none"
              style={{ background: 'linear-gradient(90deg, rgba(255,107,0,0.4), transparent)' }} />

            }

            </div>
          )}
        </div>

        {/* CTA */}
        <div className="text-center mt-12 scroll-reveal stagger-4">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-fire-gradient text-primary-foreground px-10 py-4 rounded-full font-bold text-base hover:scale-105 transition-all duration-300 shadow-fire-md">

            Start Shopping
            <Icon name="ArrowRightIcon" size={18} />
          </Link>
        </div>
      </div>
    </section>);

}