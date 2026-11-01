import React from 'react';
import Link from 'next/link';
import AppLogo from '@/components/ui/AppLogo';
import Icon from '@/components/ui/AppIcon';

const footerLinks = [
{ label: 'Home', href: '/' },
{ label: 'Products', href: '/products' },
{ label: 'How It Works', href: '#how-it-works' },
{ label: 'Privacy', href: '#' },
{ label: 'Terms', href: '#' }];


const socialLinks = [
{ icon: 'GlobeAltIcon', label: 'Discord', href: '#' },
{ icon: 'ChatBubbleLeftEllipsisIcon', label: 'Telegram', href: '#' },
{ icon: 'VideoCameraIcon', label: 'YouTube', href: '#' }];


export default function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="max-w-7xl mx-auto px-6 py-16 flex flex-col items-center gap-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <AppLogo size={40} />
          <span className="font-extrabold text-xl tracking-tight">
            <span className="fire-gradient-text">Axster </span>
            <span className="text-foreground">Panels</span>
          </span>
        </Link>

        {/* Links */}
        <nav className="flex flex-wrap justify-center gap-x-8 gap-y-3">
          {footerLinks.map((link) =>
          <Link
            key={link.label}
            href={link.href}
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200 min-h-[44px] flex items-center">

              {link.label}
            </Link>
          )}
        </nav>

        {/* Social */}
        <div className="flex items-center gap-5">
          {socialLinks.map((s) =>
          <a
            key={s.label}
            href={s.href}
            aria-label={s.label}
            className="p-2 text-muted-foreground hover:text-primary transition-colors duration-200 min-h-[44px] min-w-[44px] flex items-center justify-center">

              <Icon name={s.icon as Parameters<typeof Icon>[0]['name']} size={20} />
            </a>
          )}
        </div>

        {/* Copyright */}
        <p className="text-xs font-medium text-muted-foreground text-center">
          © 2026 FirePanels. All rights reserved. · Not affiliated with Garena Free Fire.
        </p>
      </div>
    </footer>);

}