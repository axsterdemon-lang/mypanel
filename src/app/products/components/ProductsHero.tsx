import React from 'react';
import Icon from '@/components/ui/AppIcon';

export default function ProductsHero() {
  return (
    <section className="relative pt-28 pb-12 bg-background overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(255,107,0,0.1) 0%, transparent 70%)' }} />


      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 text-center">
        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full fire-border bg-fire-subtle text-primary text-xs font-bold uppercase tracking-widest mb-6">
          <Icon name="CubeIcon" size={12} variant="solid" />
          All Panels
        </span>
        <h1 className="text-section-title text-foreground mb-4">
          Free Fire <span className="fire-gradient-text">Best Panels</span>
        </h1>
        <p className="text-muted-foreground max-w-lg mx-auto text-base leading-relaxed">The number one trusted best place in Sri Lanka
Browse all available panels for Android, iOS, and PC. Instant delivery guaranteed.
        </p>

        {/* Quick stats */}
        <div className="flex flex-wrap justify-center gap-6 mt-8">
          {[
          { icon: 'BoltIcon', label: 'Instant Delivery', color: 'text-primary' },
          { icon: 'ShieldCheckIcon', label: 'Secure Checkout', color: 'text-electric' },
          { icon: 'StarIcon', label: '4.9 Avg Rating', color: 'text-accent' }].
          map((item) =>
          <div key={item.label} className="flex items-center gap-2 text-sm text-muted-foreground">
              <Icon name={item.icon as Parameters<typeof Icon>[0]['name']} size={16} className={item.color} variant="solid" />
              {item.label}
            </div>
          )}
        </div>
      </div>
    </section>);

}