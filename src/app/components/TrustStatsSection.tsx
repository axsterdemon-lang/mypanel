'use client';

import React, { useEffect, useRef, useState } from 'react';
import Icon from '@/components/ui/AppIcon';

const stats = [
  { value: 85000, suffix: '+', label: 'Happy Players', icon: 'UsersIcon', color: 'text-primary' },
  { value: 420000, suffix: '+', label: 'Panels Sold', icon: 'CubeIcon', color: 'text-electric' },
  { value: 99.8, suffix: '%', label: 'Uptime', icon: 'ServerIcon', color: 'text-accent' },
  { value: 60, suffix: 's', label: 'Avg Delivery', icon: 'BoltIcon', color: 'text-primary' },
];

const guarantees = [
  {
    icon: 'BoltIcon',
    title: 'Instant Delivery',
    desc: 'Panel codes delivered to your inbox in under 60 seconds after payment.',
    color: 'text-primary',
    border: 'border-primary/20',
    bg: 'bg-fire-subtle',
  },
  {
    icon: 'ShieldCheckIcon',
    title: '100% Secure',
    desc: 'Payment slips are stored privately for review. Payments are confirmed after checking the incoming transaction.',
    color: 'text-electric',
    border: 'border-electric/20',
    bg: 'bg-electric-subtle',
  },
  {
    icon: 'CheckBadgeIcon',
    title: 'Authentic Panels',
    desc: 'Every panel is sourced directly. Zero fake codes, zero ban risk.',
    color: 'text-accent',
    border: 'border-accent/20',
    bg: '',
  },
  {
    icon: 'ChatBubbleLeftEllipsisIcon',
    title: '24/7 Support',
    desc: 'Got an issue? Our team is live around the clock to resolve it fast.',
    color: 'text-primary',
    border: 'border-primary/20',
    bg: 'bg-fire-subtle',
  },
];

function AnimatedCounter({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !started) {
          setStarted(true);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    const duration = 1800;
    const steps = 50;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [started, target]);

  const formatted =
    target >= 1000
      ? count >= 1000
        ? `${(count / 1000).toFixed(count >= 10000 ? 0 : 1)}k`
        : count.toString()
      : target % 1 !== 0
      ? count.toFixed(1)
      : count.toString();

  return (
    <span ref={ref} className="font-mono-price">
      {formatted}{suffix}
    </span>
  );
}

export default function TrustStatsSection() {
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
    <section ref={sectionRef} className="py-20 bg-secondary relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none" />
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[2px] pointer-events-none"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(255,107,0,0.3), transparent)' }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        {/* Stats bar */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-16">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className={`scroll-reveal stagger-${i + 1} bg-card border border-border rounded-3xl p-6 text-center group card-glow-primary transition-all duration-300`}
            >
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 rounded-2xl bg-fire-subtle border border-primary/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Icon
                    name={stat.icon as Parameters<typeof Icon>[0]['name']}
                    size={22}
                    className={stat.color}
                    variant="solid"
                  />
                </div>
              </div>
              <div className={`text-3xl font-extrabold ${stat.color} mb-1`}>
                <AnimatedCounter target={stat.value} suffix={stat.suffix} />
              </div>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Guarantees */}
        <div className="scroll-reveal mb-10 text-center">
          <h2 className="text-section-title text-foreground mb-3">
            Why Players <span className="fire-gradient-text">Trust Us</span>
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            We've built FirePanels on four non-negotiable pillars.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {guarantees.map((g, i) => (
            <div
              key={g.title}
              className={`scroll-reveal stagger-${i + 1} bg-card border ${g.border} rounded-3xl p-7 group card-glow-primary transition-all duration-300 flex flex-col`}
            >
              <div
                className={`w-14 h-14 rounded-2xl ${g.bg} border ${g.border} flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110`}
              >
                <Icon
                  name={g.icon as Parameters<typeof Icon>[0]['name']}
                  size={26}
                  className={g.color}
                  variant="solid"
                />
              </div>
              <h3 className="font-bold text-foreground text-base mb-2">{g.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed flex-1">{g.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
