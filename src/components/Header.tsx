'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import AppLogo from '@/components/ui/AppLogo';
import Icon from '@/components/ui/AppIcon';

const navLinks = [
{ label: 'Home', href: '/' },
{ label: 'Products', href: '/products' },
{ label: 'How It Works', href: '#how-it-works' },
{ label: 'Reviews', href: '#reviews' },
{ label: 'My Order', href: '/order-confirmation' }];


export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {document.body.style.overflow = '';};
  }, [menuOpen]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ?
        'bg-background/90 backdrop-blur-xl border-b border-border shadow-card-dark' :
        'bg-transparent'}`
        }>

        <nav className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <AppLogo
              size={36}
              className="transition-transform duration-300 group-hover:scale-110" />

            <span className="font-sans font-800 text-lg sm:text-xl tracking-tight text-foreground hidden sm:block">
              <span className="fire-gradient-text font-extrabold">AXSTER 999</span>
              <span className="text-foreground font-extrabold"> PANELS</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks?.map((link) =>
            <Link
              key={link?.label}
              href={link?.href}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200">

                {link?.label}
              </Link>
            )}
          </div>

          {/* CTA */}
          <div className="flex items-center gap-3">
            <Link
              href="/products"
              className="hidden sm:inline-flex items-center gap-2 bg-fire-gradient text-primary-foreground px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 hover:scale-105 hover:shadow-fire-md">

              <Icon name="ShoppingBagIcon" size={16} variant="solid" />
              Shop Now
            </Link>
            {/* Mobile hamburger */}
            <button
              className="md:hidden p-2 text-foreground"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu">

              <Icon name="Bars3Icon" size={24} />
            </button>
          </div>
        </nav>
      </header>
      {/* Mobile Menu Overlay */}
      {menuOpen &&
      <div
        className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-xl flex flex-col"
        onClick={() => setMenuOpen(false)}>

          <div className="flex items-center justify-between px-6 h-20 border-b border-border" onClick={(e) => e?.stopPropagation()}>
            <div className="flex items-center gap-2.5">
              <AppLogo size={36} />
              <span className="font-extrabold text-xl">
                <span className="fire-gradient-text">Fire</span>
                <span className="text-foreground">Panels</span>
              </span>
            </div>
            <button
            onClick={() => setMenuOpen(false)}
            className="p-2 text-muted-foreground hover:text-foreground"
            aria-label="Close menu">

              <Icon name="XMarkIcon" size={28} />
            </button>
          </div>
          <nav className="flex flex-col gap-2 p-6 flex-1" onClick={(e) => e?.stopPropagation()}>
            {navLinks?.map((link) =>
          <Link
            key={link?.label}
            href={link?.href}
            onClick={() => setMenuOpen(false)}
            className="text-lg font-semibold text-foreground py-4 border-b border-border hover:text-primary transition-colors">

                {link?.label}
              </Link>
          )}
            <Link
            href="/products"
            onClick={() => setMenuOpen(false)}
            className="mt-6 inline-flex items-center justify-center gap-2 bg-fire-gradient text-primary-foreground px-6 py-4 rounded-2xl text-base font-bold">

              <Icon name="ShoppingBagIcon" size={20} variant="solid" />
              Shop Panels Now
            </Link>
          </nav>
        </div>
      }
    </>);

}