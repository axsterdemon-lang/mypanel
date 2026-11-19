'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { allProducts as checkoutProducts } from '@/lib/payments/catalog';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';

type DeviceKey = 'Android' | 'iOS' | 'PC';

interface Product {
  id: string;
  name: string;
  diamonds: number;
  devices: DeviceKey[];
  prices: { Android?: number; iOS?: number; PC?: number };
  badge?: 'hot' | 'best-value' | 'new' | null;
  image: string;
  imageAlt: string;
  rating: number;
  reviews: number;
  stock: 'in-stock' | 'limited' | 'out-of-stock';
  popular: boolean;
  description: string;
  specs: { label: string; value: string }[];
  features: string[];
}

const allProducts: Product[] = [
  {
    id: 'starter-100',
    name: 'Aim Bot Brutal',
    diamonds: 100,
    devices: ['Android'],
    prices: { Android: 0.99 },
    badge: null,
    image: 'https://img.rocket.new/generatedImages/rocket_gen_img_15f1c77f3-1772284591447.png',
    imageAlt: 'Smartphone with colorful gaming interface, dark background, neon glow effects',
    rating: 4.7,
    reviews: 312,
    stock: 'in-stock',
    popular: false,
    description:
      'The perfect entry-level panel for new users. Get instant access to essential cheats and mods with zero setup required. Compatible with Android and iOS devices, the Starter Pack delivers reliable performance at an unbeatable price.',
    specs: [
      { label: 'Diamonds', value: '100' },
      { label: 'Compatibility', value: 'Android, iOS' },
      { label: 'Activation', value: 'Instant' },
      { label: 'Support', value: '24/7 Chat' },
      { label: 'Updates', value: 'Lifetime' },
      { label: 'Accounts', value: '1 Device' },
    ],
    features: ['Instant activation', 'Anti-ban protection', 'Auto-update system', '24/7 support'],
  },
  {
    id: 'bronze-500',
    name: 'HG Cheats Mod',
    diamonds: 500,
    devices: ['Android'],
    prices: { Android: 4.99 },
    badge: 'hot',
    image: '/assets/images/maxresdefault (2).jpg',
    imageAlt: 'Mobile gaming screen with colorful game interface, dark atmospheric background',
    rating: 4.8,
    reviews: 890,
    stock: 'in-stock',
    popular: true,
    description:
      'HG Cheats Mod is one of our most popular panels, trusted by thousands of players worldwide. Packed with advanced features across all three platforms, it delivers smooth, undetected performance with a clean interface and real-time updates.',
    specs: [
      { label: 'Diamonds', value: '500' },
      { label: 'Compatibility', value: 'Android, iOS, PC' },
      { label: 'Activation', value: 'Instant' },
      { label: 'Support', value: '24/7 Chat' },
      { label: 'Updates', value: 'Lifetime' },
      { label: 'Accounts', value: '2 Devices' },
    ],
    features: [
      'Cross-platform support',
      'Advanced aimbot module',
      'ESP & wallhack',
      'Anti-ban protection',
      'Real-time updates',
      '24/7 support',
    ],
  },
  {
    id: 'silver-1000',
    name: 'Pato Team V2',
    diamonds: 1000,
    devices: ['Android'],
    prices: { Android: 8.99 },
    badge: null,
    image: '/assets/images/hqdefault.jpg',
    imageAlt: 'Competitive gamer at desktop setup, intense expression, dark room with neon RGB lighting',
    rating: 4.9,
    reviews: 1240,
    stock: 'in-stock',
    popular: true,
    description:
      'Pato Team V2 is the upgraded successor to the original, featuring a completely rewritten engine for faster injection, lower detection risk, and more stable performance across all supported platforms. A favourite among competitive players.',
    specs: [
      { label: 'Diamonds', value: '1,000' },
      { label: 'Compatibility', value: 'Android, iOS, PC' },
      { label: 'Activation', value: 'Instant' },
      { label: 'Support', value: 'Priority 24/7' },
      { label: 'Updates', value: 'Lifetime' },
      { label: 'Accounts', value: '3 Devices' },
    ],
    features: [
      'Rewritten injection engine',
      'Low detection risk',
      'Full ESP suite',
      'Speed & damage mods',
      'Priority support',
      'Multi-device license',
    ],
  },
  {
    id: 'android-exclusive-1500',
    name: 'Prime Hook',
    diamonds: 1500,
    devices: ['Android'],
    prices: { Android: 11.99 },
    badge: 'hot',
    image: '/assets/images/hq720 (3).jpg',
    imageAlt: 'Android phone showing game with green neon glow, dark background, gaming atmosphere',
    rating: 4.7,
    reviews: 445,
    stock: 'in-stock',
    popular: false,
    description:
      'Prime Hook is an Android-exclusive panel engineered specifically for the Android kernel, giving it a performance edge over generic cross-platform tools. Featuring a custom hook system that bypasses standard detection methods with ease.',
    specs: [
      { label: 'Diamonds', value: '1,500' },
      { label: 'Compatibility', value: 'Android Only' },
      { label: 'Activation', value: 'Instant' },
      { label: 'Support', value: '24/7 Chat' },
      { label: 'Updates', value: 'Lifetime' },
      { label: 'Accounts', value: '1 Device' },
    ],
    features: [
      'Android-native hook system',
      'Kernel-level injection',
      'Bypass standard detection',
      'Lightweight & fast',
      'Auto-update on launch',
      '24/7 support',
    ],
  },
  {
    id: 'gold-2000',
    name: 'Admin Panel',
    diamonds: 2000,
    devices: ['Android'],
    prices: { Android: 16.99 },
    badge: null,
    image: '/assets/images/b82aa79739aa2a56f58fd95f2b8f0c7c7022f231.jpg',
    imageAlt: 'Gaming setup with golden RGB lighting, dark environment, premium esports atmosphere',
    rating: 4.8,
    reviews: 756,
    stock: 'in-stock',
    popular: false,
    description:
      'The Admin Panel gives you full control over every aspect of your gameplay. With a comprehensive dashboard-style interface, you can toggle individual modules, set custom hotkeys, and manage multiple accounts from a single control centre.',
    specs: [
      { label: 'Diamonds', value: '2,000' },
      { label: 'Compatibility', value: 'Android, iOS, PC' },
      { label: 'Activation', value: 'Instant' },
      { label: 'Support', value: 'Priority 24/7' },
      { label: 'Updates', value: 'Lifetime' },
      { label: 'Accounts', value: '5 Devices' },
    ],
    features: [
      'Dashboard control interface',
      'Per-module toggle system',
      'Custom hotkey mapping',
      'Multi-account manager',
      'Full ESP & aimbot suite',
      'Priority support',
    ],
  },
  {
    id: 'pro-3000',
    name: 'Pato Team v1',
    diamonds: 3000,
    devices: ['Android'],
    prices: { Android: 24.99 },
    badge: null,
    image: '/assets/images/hq720 (1).jpg',
    imageAlt: 'Professional gaming tournament setup, multiple screens, intense competitive atmosphere, dark hall',
    rating: 4.9,
    reviews: 2100,
    stock: 'in-stock',
    popular: true,
    description:
      'The original Pato Team panel that started it all. Proven in thousands of matches, this battle-tested tool remains a top choice for players who value stability and reliability over flashy new features. Solid, consistent, and always updated.',
    specs: [
      { label: 'Diamonds', value: '3,000' },
      { label: 'Compatibility', value: 'Android, iOS, PC' },
      { label: 'Activation', value: 'Instant' },
      { label: 'Support', value: 'Priority 24/7' },
      { label: 'Updates', value: 'Lifetime' },
      { label: 'Accounts', value: '3 Devices' },
    ],
    features: [
      'Battle-tested stability',
      'Full aimbot & ESP',
      'Speed & damage mods',
      'Consistent update cycle',
      'Cross-platform',
      'Priority support',
    ],
  },
  {
    id: 'elite-5000',
    name: 'Drip Client Proxy',
    diamonds: 5000,
    devices: ['Android'],
    prices: { Android: 12.0 },
    badge: 'best-value',
    image: '/assets/images/1784905788746-9e72a2c82df0bbbbe92c4159.webp',
    imageAlt: 'High-end gaming rig with purple and blue RGB, dark room, premium gaming setup',
    rating: 5.0,
    reviews: 3450,
    stock: 'in-stock',
    popular: true,
    description:
      'Drip Client Proxy routes all panel traffic through an encrypted proxy layer, making it virtually impossible for anti-cheat systems to flag your connection. The most secure panel in our lineup, rated 5 stars by over 3,400 verified buyers.',
    specs: [
      { label: 'Diamonds', value: '5,000' },
      { label: 'Compatibility', value: 'Android, iOS, PC' },
      { label: 'Activation', value: 'Instant' },
      { label: 'Support', value: 'VIP 24/7' },
      { label: 'Updates', value: 'Lifetime' },
      { label: 'Accounts', value: 'Unlimited' },
    ],
    features: [
      'Encrypted proxy routing',
      'Undetectable traffic',
      'Unlimited device licenses',
      'Full feature suite',
      'VIP priority support',
      'Lifetime updates',
    ],
  },
  {
    id: 'ios-elite-6000',
    name: 'Fluorite Panel',
    diamonds: 6000,
    devices: ['iOS'],
    prices: { iOS: 15 },
    badge: 'best-value',
    image: 'https://user23826.na.imgto.link/public/20260814/images-5.avif',
    imageAlt: 'Fluorite Panel iOS product — premium gaming panel interface with vibrant display',
    rating: 4.9,
    reviews: 87,
    stock: 'limited',
    popular: true,
    description:
      'The Fluorite Panel is a premium iOS-exclusive panel delivering top-tier performance for serious players. With 6,000 diamonds and a best-value badge, it combines powerful features with a polished interface designed specifically for Apple devices.',
    specs: [
      { label: 'Diamonds', value: '6,000' },
      { label: 'Compatibility', value: 'iOS Only' },
      { label: 'Activation', value: 'Instant' },
      { label: 'Support', value: 'Priority 24/7' },
      { label: 'Updates', value: 'Lifetime' },
      { label: 'Accounts', value: '3 Devices' },
    ],
    features: [
      'iOS-exclusive premium panel',
      'Best-value diamond package',
      'Instant activation',
      'Anti-ban protection',
      'Priority 24/7 support',
      'Lifetime updates',
    ],
  },
  {
    id: 'ios-premium-2500',
    name: 'Miguel Pro',
    diamonds: 2500,
    devices: ['iOS'],
    prices: { iOS: 15.02 },
    badge: 'new',
    image: '/assets/images/hq720 (7).jpg',
    imageAlt: 'iPhone with gaming app running, blue neon background, sleek premium feel',
    rating: 4.8,
    reviews: 189,
    stock: 'limited',
    popular: false,
    description:
      'Miguel Pro is a cutting-edge iOS panel built for players who demand precision and reliability. Featuring a clean, native-feeling interface and deep system integration, it delivers a seamless experience on iPhone and iPad with instant activation.',
    specs: [
      { label: 'Diamonds', value: '2,500' },
      { label: 'Compatibility', value: 'iOS Only' },
      { label: 'Activation', value: 'Instant' },
      { label: 'Support', value: 'Priority 24/7' },
      { label: 'Updates', value: 'Lifetime' },
      { label: 'Accounts', value: '2 Devices' },
    ],
    features: [
      'iOS-native integration',
      'iPhone & iPad support',
      'Clean native interface',
      'Deep system hooks',
      'Anti-ban layer',
      'Priority support',
    ],
  },
  {
    id: 'pc-power-7500',
    name: 'Bala Mod',
    diamonds: 7500,
    devices: ['Android'],
    prices: { Android: 59.99 },
    badge: null,
    image: '/assets/images/hq720 (2).jpg',
    imageAlt: 'Gaming PC tower with RGB lighting, dark studio, yellow and blue neon illumination',
    rating: 4.9,
    reviews: 672,
    stock: 'in-stock',
    popular: true,
    description:
      'Bala Mod is a high-performance panel designed for power users on Android and PC. With an advanced configuration engine and deep customisation options, it gives experienced players granular control over every cheat module.',
    specs: [
      { label: 'Diamonds', value: '7,500' },
      { label: 'Compatibility', value: 'Android, PC' },
      { label: 'Activation', value: 'Instant' },
      { label: 'Support', value: 'VIP 24/7' },
      { label: 'Updates', value: 'Lifetime' },
      { label: 'Accounts', value: '5 Devices' },
    ],
    features: [
      'Advanced config engine',
      'Granular module control',
      'High-performance injection',
      'Android & PC dual license',
      'VIP support',
      'Lifetime updates',
    ],
  },
  {
    id: 'mega-10000',
    name: 'Drip Client Mod Apk',
    diamonds: 10000,
    devices: ['Android'],
    prices: { Android: 13.52 },
    badge: 'best-value',
    image: '/assets/images/drip-client-thumbnail.jpg',
    imageAlt: 'Epic dual monitor gaming setup with orange and blue neon, dark room, dramatic lighting',
    rating: 5.0,
    reviews: 4200,
    stock: 'in-stock',
    popular: true,
    description:
      'The Drip Client Mod Apk is our best-selling Android panel, downloaded over 10,000 times. Packed with every feature you need at an unbeatable price point, it consistently earns 5-star reviews from our most active community members.',
    specs: [
      { label: 'Diamonds', value: '10,000' },
      { label: 'Compatibility', value: 'Android Only' },
      { label: 'Activation', value: 'Instant' },
      { label: 'Support', value: 'VIP 24/7' },
      { label: 'Updates', value: 'Lifetime' },
      { label: 'Accounts', value: '3 Devices' },
    ],
    features: [
      'Best-selling Android panel',
      'Full feature suite',
      'Unbeatable price',
      'Instant activation',
      'Anti-ban protection',
      'VIP support',
    ],
  },
  {
    id: 'reseller-15000',
    name: 'Reseller Bundle',
    diamonds: 15000,
    devices: ['Android'],
    prices: { Android: 24 },
    badge: null,
    image: '/assets/images/hqdefault.jpg',
    imageAlt: 'Multiple gaming devices on desk, dark room with multicolored neon glow, reseller setup',
    rating: 4.8,
    reviews: 320,
    stock: 'in-stock',
    popular: false,
    description:
      'The Reseller Bundle is designed for entrepreneurs who want to sell panels to their own customers. Includes bulk activation keys, a reseller dashboard, and dedicated account management support to help you build a profitable business.',
    specs: [
      { label: 'Diamonds', value: '15,000' },
      { label: 'Compatibility', value: 'Android, iOS, PC' },
      { label: 'Activation', value: 'Bulk Keys' },
      { label: 'Support', value: 'Dedicated Manager' },
      { label: 'Updates', value: 'Lifetime' },
      { label: 'Accounts', value: 'Unlimited' },
    ],
    features: [
      'Bulk activation keys',
      'Reseller dashboard',
      'Dedicated account manager',
      'All platforms included',
      'Unlimited sub-licenses',
      'Priority reseller support',
    ],
  },
  {
    id: 'pc-ultimate-20000',
    name: 'BR MOD ',
    diamonds: 20000,
    devices: ['PC'],
    prices: { PC: 169.99 },
    badge: 'best-value',
    image: '/assets/images/1784905788746-9e72a2c82df0bbbbe92c4159.webp',
    imageAlt: 'Ultra-premium PC gaming battle station, triple monitors, RGB everywhere, dark room',
    rating: 5.0,
    reviews: 198,
    stock: 'limited',
    popular: false,
    description:
      'BR MOD  is the pinnacle of our PC panel lineup. Built for serious desktop players who demand the absolute best, it includes every module we offer, a dedicated VIP support line, and a custom overlay UI that integrates directly into your game.',
    specs: [
      { label: 'Diamonds', value: '20,000' },
      { label: 'Compatibility', value: 'PC Only' },
      { label: 'Activation', value: 'Instant' },
      { label: 'Support', value: 'VIP Dedicated' },
      { label: 'Updates', value: 'Lifetime' },
      { label: 'Accounts', value: 'Unlimited' },
    ],
    features: [
      'Every module included',
      'Custom in-game overlay',
      'VIP dedicated support line',
      'Unlimited device licenses',
      'Highest-tier anti-ban',
      'Lifetime updates',
    ],
  },
  {
    id: 'pc-pro-12000',
    name: 'PC Aim Bot',
    diamonds: 12000,
    devices: ['PC'],
    prices: { PC: 6.01 },
    badge: 'new',
    image: 'https://user23826.na.imgto.link/public/20260814/hq720-9.avif',
    imageAlt: 'PC Aim Bot product — gaming software package for PC platform',
    rating: 4.7,
    reviews: 85,
    stock: 'in-stock',
    popular: false,
    description:
      'PC Aim Bot is a precision-engineered aimbot panel built exclusively for desktop players. Featuring ultra-smooth aim assist, customisable sensitivity curves, and a lightweight footprint that keeps your system running at peak performance.',
    specs: [
      { label: 'Diamonds', value: '12,000' },
      { label: 'Compatibility', value: 'PC Only' },
      { label: 'Activation', value: 'Instant' },
      { label: 'Support', value: '24/7 Chat' },
      { label: 'Updates', value: 'Lifetime' },
      { label: 'Accounts', value: '1 Device' },
    ],
    features: [
      'Ultra-smooth aim assist',
      'Customisable sensitivity curves',
      'Lightweight PC footprint',
      'Instant activation',
      'Anti-ban protection',
      'Lifetime updates',
    ],
  },
  {
    id: 'pc-elite-8000',
    name: 'Dark Engine',
    diamonds: 8000,
    devices: ['PC'],
    prices: { PC: 12.02 },
    badge: null,
    image: '/assets/images/hq720 (4).jpg',
    imageAlt: 'Dark Engine product — premium PC gaming enhancement package',
    rating: 4.8,
    reviews: 62,
    stock: 'in-stock',
    popular: false,
    description:
      'Dark Engine is a powerful PC-exclusive panel featuring a dark-themed overlay and a full suite of enhancement modules. Engineered for stability and stealth, it runs silently in the background while delivering consistent, undetected performance.',
    specs: [
      { label: 'Diamonds', value: '8,000' },
      { label: 'Compatibility', value: 'PC Only' },
      { label: 'Activation', value: 'Instant' },
      { label: 'Support', value: '24/7 Chat' },
      { label: 'Updates', value: 'Lifetime' },
      { label: 'Accounts', value: '2 Devices' },
    ],
    features: [
      'Dark-themed in-game overlay',
      'Full enhancement module suite',
      'Silent background operation',
      'Stealth anti-detection engine',
      'Instant activation',
      'Lifetime updates',
    ],
  },
  {
    id: 'ios-swift-800',
    name: 'Kyzo FF Xit',
    diamonds: 800,
    devices: ['iOS'],
    prices: { iOS: 10.52 },
    badge: 'new',
    image: '/assets/images/maxresdefault (3).jpg',
    imageAlt: 'Kyzo FF Xit product image',
    rating: 4.6,
    reviews: 54,
    stock: 'in-stock',
    popular: false,
    description:
      'Kyzo FF Xit is a fast and lightweight iOS panel designed for Free Fire players who want a competitive edge without the complexity. Easy to set up, instant to activate, and packed with essential mods to dominate every match.',
    specs: [
      { label: 'Diamonds', value: '800' },
      { label: 'Compatibility', value: 'iOS Only' },
      { label: 'Activation', value: 'Instant' },
      { label: 'Support', value: '24/7 Chat' },
      { label: 'Updates', value: 'Lifetime' },
      { label: 'Accounts', value: '1 Device' },
    ],
    features: [
      'Lightweight iOS panel',
      'Free Fire optimised',
      'Easy one-tap setup',
      'Essential mod suite',
      'Anti-ban protection',
      'Lifetime updates',
    ],
  },
  {
    id: 'ios-ultra-12000',
    name: 'Proxy Ios',
    diamonds: 12000,
    devices: ['iOS'],
    prices: { iOS: 13.52 },
    badge: null,
    image: '/assets/images/hq720 (6).jpg',
    imageAlt: 'Proxy Ios product image',
    rating: 4.8,
    reviews: 41,
    stock: 'in-stock',
    popular: false,
    description:
      'Proxy Ios routes all panel traffic through a secure encrypted proxy layer on iOS, making it virtually undetectable by anti-cheat systems. Designed for serious iOS players who need maximum security and consistent performance in every session.',
    specs: [
      { label: 'Diamonds', value: '12,000' },
      { label: 'Compatibility', value: 'iOS Only' },
      { label: 'Activation', value: 'Instant' },
      { label: 'Support', value: 'Priority 24/7' },
      { label: 'Updates', value: 'Lifetime' },
      { label: 'Accounts', value: '2 Devices' },
    ],
    features: [
      'Encrypted iOS proxy routing',
      'Undetectable traffic layer',
      'Maximum anti-ban security',
      'Full mod suite included',
      'Priority 24/7 support',
      'Lifetime updates',
    ],
  },
  {
    id: 'ios-spark-400',
    name: 'Aim Lock ios',
    diamonds: 400,
    devices: ['iOS'],
    prices: { iOS: 7.51 },
    badge: null,
    image: '/assets/images/Aimlock-FF-Headshot.webp',
    imageAlt: 'Aim Lock iOS — aim lock gaming tool for iOS devices',
    rating: 4.5,
    reviews: 18,
    stock: 'in-stock',
    popular: false,
    description:
      'Aim Lock iOS is an entry-level aim-assist panel built specifically for iPhone users. With a simple one-tap lock-on system, it helps new and casual players land shots consistently without complex configuration or setup.',
    specs: [
      { label: 'Diamonds', value: '400' },
      { label: 'Compatibility', value: 'iOS Only' },
      { label: 'Activation', value: 'Instant' },
      { label: 'Support', value: '24/7 Chat' },
      { label: 'Updates', value: 'Lifetime' },
      { label: 'Accounts', value: '1 Device' },
    ],
    features: [
      'One-tap aim lock system',
      'iOS-native integration',
      'Beginner-friendly setup',
      'Consistent headshot assist',
      'Anti-ban protection',
      'Lifetime updates',
    ],
  },
  {
    id: 'ios-blaze-1500',
    name: 'Proxy Bhanu',
    diamonds: 1500,
    devices: ['iOS'],
    prices: { iOS: 10.50 },
    badge: 'hot',
    image: 'https://user23826.na.imgto.link/public/20260814/maxresdefault-4.avif',
    imageAlt: 'Proxy Bhanu — mid-tier gaming diamonds bundle for iOS users',
    rating: 4.7,
    reviews: 32,
    stock: 'in-stock',
    popular: true,
    description:
      'Proxy Bhanu is a popular mid-tier iOS panel that combines proxy-secured traffic routing with a full set of gameplay enhancement modules. Trusted by hundreds of iOS players for its reliability, stealth performance, and consistent anti-ban record.',
    specs: [
      { label: 'Diamonds', value: '1,500' },
      { label: 'Compatibility', value: 'iOS Only' },
      { label: 'Activation', value: 'Instant' },
      { label: 'Support', value: 'Priority 24/7' },
      { label: 'Updates', value: 'Lifetime' },
      { label: 'Accounts', value: '2 Devices' },
    ],
    features: [
      'Proxy-secured iOS traffic',
      'Full gameplay enhancement suite',
      'Consistent anti-ban record',
      'Mid-tier value package',
      'Priority 24/7 support',
      'Lifetime updates',
    ],
  },
  {
    id: 'ios-titan-4000',
    name: 'iOS Body Hs',
    diamonds: 4000,
    devices: ['iOS'],
    prices: { iOS: 10.52 },
    badge: 'best-value',
    image: 'https://user23826.na.imgto.link/public/20260814/hq720-7.avif',
    imageAlt: 'Body Hs — premium high-value diamonds bundle exclusively for iOS',
    rating: 4.9,
    reviews: 27,
    stock: 'in-stock',
    popular: true,
    description:
      'iOS Body Hs is a premium body-shot and headshot enhancement panel built exclusively for iOS. Featuring advanced hit-detection algorithms and a smooth aim-assist engine, it delivers pinpoint accuracy and consistent eliminations every round.',
    specs: [
      { label: 'Diamonds', value: '4,000' },
      { label: 'Compatibility', value: 'iOS Only' },
      { label: 'Activation', value: 'Instant' },
      { label: 'Support', value: 'Priority 24/7' },
      { label: 'Updates', value: 'Lifetime' },
      { label: 'Accounts', value: '2 Devices' },
    ],
    features: [
      'Advanced headshot algorithm',
      'Body-shot precision assist',
      'Smooth aim-assist engine',
      'iOS-exclusive optimisation',
      'Anti-ban protection',
      'Lifetime updates',
    ],
  },
];

const mockReviews = [
  {
    id: 1,
    author: 'xXShadowKing99Xx',
    avatar: 'S',
    rating: 5,
    date: 'Aug 10, 2026',
    device: 'Android',
    comment:
      'Absolutely insane panel. Activated in under 30 seconds and worked perfectly on the first match. Anti-ban is solid — been using it for 3 weeks with zero issues.',
  },
  {
    id: 2,
    author: 'ProGamer_Lena',
    avatar: 'L',
    rating: 5,
    date: 'Aug 7, 2026',
    device: 'iOS',
    comment:
      'Best purchase I have made this year. The support team responded within minutes when I had a setup question. 100% recommend to anyone serious about their game.',
  },
  {
    id: 3,
    author: 'NightOwl_Plays',
    avatar: 'N',
    rating: 4,
    date: 'Jul 29, 2026',
    device: 'PC',
    comment:
      'Really solid panel overall. Took a few minutes to figure out the config but once set up it runs flawlessly. Would give 5 stars if the UI was a bit more intuitive.',
  },
  {
    id: 4,
    author: 'FireStrike_Ace',
    avatar: 'F',
    rating: 5,
    date: 'Jul 22, 2026',
    device: 'Android',
    comment:
      'I have tried 6 different panels and this one is by far the most stable. No crashes, no bans, and the aimbot smoothness is unreal. Worth every cent.',
  },
];

function StarRating({ rating, size = 16 }: { rating: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Icon
          key={star}
          name="StarIcon"
          size={size}
          variant={star <= Math.round(rating) ? 'solid' : 'outline'}
          className={star <= Math.round(rating) ? 'text-accent' : 'text-muted'}
        />
      ))}
    </div>
  );
}

function StockBadge({ stock }: { stock: Product['stock'] }) {
  if (stock === 'in-stock') {
    return (
      <span className="flex items-center gap-1.5 text-sm font-bold text-[#3DDC84]">
        <span className="w-2 h-2 rounded-full bg-[#3DDC84] animate-pulse" />
        In Stock
      </span>
    );
  }
  if (stock === 'limited') {
    return (
      <span className="flex items-center gap-1.5 text-sm font-bold text-accent">
        <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
        Limited Stock
      </span>
    );
  }
  return (
    <span className="flex items-center gap-1.5 text-sm font-bold text-muted-foreground">
      <span className="w-2 h-2 rounded-full bg-muted-foreground" />
      Out of Stock
    </span>
  );
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params?.id as string;

  const details = allProducts.find((p) => p.id === productId);
  const canonical = checkoutProducts.find((p) => p.id === productId);
  const product = details && canonical ? { ...details, ...canonical } : undefined;

  const [selectedDevice, setSelectedDevice] = useState<DeviceKey>(
    product ? product.devices[0] : 'Android'
  );
  const [added, setAdded] = useState(false);

  if (!product) {
    return (
      <main className="bg-background min-h-screen">
        <Header />
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 px-4">
          <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
            <Icon name="ExclamationTriangleIcon" size={36} className="text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Product not found</h1>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-fire-gradient text-primary-foreground px-6 py-3 rounded-full font-bold hover:scale-105 transition-transform"
          >
            <Icon name="ArrowLeftIcon" size={16} variant="solid" />
            Back to Products
          </Link>
        </div>
        <Footer />
      </main>
    );
  }

  const displayPrice =
    product.prices[selectedDevice] ??
    Math.min(...(Object.values(product.prices).filter(Boolean) as number[]));

  const handleBuy = () => {
    if (product.stock === 'out-of-stock') return;
    setAdded(true);
    router.push(`/checkout?product=${encodeURIComponent(product.id)}&device=${encodeURIComponent(selectedDevice)}`);
  };

  const deviceColors: Record<DeviceKey, string> = {
    Android: 'text-[#3DDC84] border-[#3DDC84]/40 bg-[#3DDC84]/10',
    iOS: 'text-[#00D4FF] border-[#00D4FF]/40 bg-[#00D4FF]/10',
    PC: 'text-accent border-accent/40 bg-accent/10',
  };

  const deviceActiveColors: Record<DeviceKey, string> = {
    Android: 'bg-[#3DDC84] text-[#0A0A0F] border-[#3DDC84]',
    iOS: 'bg-[#00D4FF] text-[#0A0A0F] border-[#00D4FF]',
    PC: 'bg-accent text-[#0A0A0F] border-accent',
  };

  return (
    <main className="bg-background min-h-screen overflow-x-hidden">
      <Header />

      {/* Breadcrumb */}
      <div className="pt-24 pb-4 px-4 sm:px-6 max-w-7xl mx-auto">
        <nav className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground transition-colors">
            Home
          </Link>
          <Icon name="ChevronRightIcon" size={14} />
          <Link href="/products" className="hover:text-foreground transition-colors">
            Products
          </Link>
          <Icon name="ChevronRightIcon" size={14} />
          <span className="text-foreground font-medium truncate max-w-[160px]">{product.name}</span>
        </nav>
      </div>

      {/* Hero Section */}
      <section className="py-8 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-16 items-start">
          {/* Left — Image */}
          <div className="relative">
            <div className="relative rounded-3xl overflow-hidden aspect-[4/3] border border-border bg-card">
              <AppImage
                src={product.image}
                alt={product.imageAlt}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-card/60 via-transparent to-transparent" />

              {/* Badge overlay */}
              <div className="absolute top-4 left-4 flex gap-2">
                {product.badge === 'hot' && <span className="hot-badge">🔥 Hot</span>}
                {product.badge === 'best-value' && (
                  <span className="best-value-badge">⭐ Best Value</span>
                )}
                {product.badge === 'new' && (
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-electric/20 text-electric border border-electric/30">
                    New
                  </span>
                )}
              </div>
            </div>

            {/* Trust strip below image */}
            <div className="mt-4 grid grid-cols-3 gap-3">
              {[
                { icon: 'ShieldCheckIcon', label: 'Anti-Ban' },
                { icon: 'BoltIcon', label: 'Instant Delivery' },
                { icon: 'ArrowPathIcon', label: 'Lifetime Updates' },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex flex-col items-center gap-1.5 bg-card border border-border rounded-2xl py-3 px-2"
                >
                  <Icon
                    name={item.icon as Parameters<typeof Icon>[0]['name']}
                    size={20}
                    className="text-primary"
                    variant="solid"
                  />
                  <span className="text-[11px] font-semibold text-muted-foreground text-center">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Details */}
          <div className="flex flex-col gap-6">
            {/* Title & rating */}
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                {product.devices.includes('Android') && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#3DDC84]/15 text-[#3DDC84] border border-[#3DDC84]/30">
                    Android
                  </span>
                )}
                {product.devices.includes('iOS') && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#00D4FF]/12 text-[#00D4FF] border border-[#00D4FF]/30">
                    iOS
                  </span>
                )}
                {product.devices.includes('PC') && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-accent/12 text-accent border border-accent/30">
                    PC
                  </span>
                )}
                <StockBadge stock={product.stock} />
              </div>

              <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight mb-3">
                {product.name}
              </h1>

              <div className="flex items-center gap-3">
                <StarRating rating={product.rating} size={18} />
                <span className="font-bold text-foreground">{product.rating}</span>
                <span className="text-muted-foreground text-sm">
                  ({product.reviews.toLocaleString()} reviews)
                </span>
                <span className="text-muted-foreground">·</span>
                <span className="text-sm text-muted-foreground">
                  4.8 by 543k+ users
                </span>
              </div>
            </div>

            {/* Description */}
            <p className="text-muted-foreground leading-relaxed text-[15px]">
              {product.description}
            </p>

            {/* Device selector */}
            <div>
              <p className="text-sm font-bold text-foreground mb-3 uppercase tracking-wider">
                Select Device
              </p>
              <div className="flex flex-wrap gap-3">
                {product.devices.map((device) => (
                  <button
                    key={device}
                    onClick={() => setSelectedDevice(device)}
                    className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-bold border-2 transition-all duration-200 ${
                      selectedDevice === device
                        ? deviceActiveColors[device]
                        : `${deviceColors[device]} hover:opacity-80`
                    }`}
                  >
                    <Icon
                      name={
                        device === 'PC' ?'ComputerDesktopIcon' :'DevicePhoneMobileIcon'
                      }
                      size={16}
                      variant="solid"
                    />
                    {device}
                    {product.prices[device] !== undefined && (
                      <span className="font-mono-price ml-1">
                        ${product.prices[device]!.toFixed(2)}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Price */}
            <div className="flex items-end gap-3">
              <span className="font-mono-price text-5xl text-foreground">
                ${displayPrice.toFixed(2)}
              </span>
              <span className="text-muted-foreground text-sm mb-2">for {selectedDevice}</span>
            </div>

            {/* Add to Cart CTA */}
            <button
              onClick={handleBuy}
              disabled={product.stock === 'out-of-stock'}
              className={`w-full flex items-center justify-center gap-3 py-5 rounded-2xl text-lg font-extrabold tracking-wide transition-all duration-300 ${
                product.stock === 'out-of-stock' ?'bg-muted text-muted-foreground cursor-not-allowed'
                  : added
                  ? 'bg-[#3DDC84]/20 text-[#3DDC84] border-2 border-[#3DDC84]/40'
                  : 'bg-fire-gradient text-primary-foreground hover:scale-[1.02] hover:shadow-fire-md animate-pulse-glow'
              }`}
            >
              {added ? (
                <>
                  <Icon name="CheckIcon" size={22} variant="solid" />
                  Opening checkout…
                </>
              ) : product.stock === 'out-of-stock' ? (
                'Out of Stock'
              ) : (
                <>
                  <Icon name="ShoppingCartIcon" size={22} variant="solid" />
                  Buy Now — ${displayPrice.toFixed(2)}
                </>
              )}
            </button>

            <p className="text-xs text-muted-foreground text-center">
              Instant delivery · Secure checkout · 24/7 support
            </p>
          </div>
        </div>
      </section>

      {/* Specs + Features */}
      <section className="py-12 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Full Specs */}
          <div className="bg-card border border-border rounded-3xl p-6 sm:p-8">
            <h2 className="text-xl font-extrabold text-foreground mb-6 flex items-center gap-2">
              <Icon name="ClipboardDocumentListIcon" size={20} className="text-primary" variant="solid" />
              Full Specifications
            </h2>
            <div className="divide-y divide-border">
              {product.specs.map((spec) => (
                <div key={spec.label} className="flex items-center justify-between py-3.5">
                  <span className="text-sm text-muted-foreground">{spec.label}</span>
                  <span className="text-sm font-bold text-foreground">{spec.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Features */}
          <div className="bg-card border border-border rounded-3xl p-6 sm:p-8">
            <h2 className="text-xl font-extrabold text-foreground mb-6 flex items-center gap-2">
              <Icon name="SparklesIcon" size={20} className="text-accent" variant="solid" />
              What's Included
            </h2>
            <ul className="space-y-3">
              {product.features.map((feature) => (
                <li key={feature} className="flex items-start gap-3">
                  <span className="mt-0.5 w-5 h-5 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
                    <Icon name="CheckIcon" size={12} className="text-primary" variant="solid" />
                  </span>
                  <span className="text-sm text-foreground">{feature}</span>
                </li>
              ))}
            </ul>

            {/* Detailed description */}
            <div className="mt-8 pt-6 border-t border-border">
              <h3 className="text-base font-bold text-foreground mb-3">About this panel</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{product.description}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="py-12 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-end gap-4 justify-between">
          <div>
            <h2 className="text-2xl font-extrabold text-foreground mb-1">Customer Reviews</h2>
            <div className="flex items-center gap-3">
              <StarRating rating={product.rating} size={20} />
              <span className="text-2xl font-extrabold text-foreground">{product.rating}</span>
              <span className="text-muted-foreground">
                based on {product.reviews.toLocaleString()} reviews
              </span>
            </div>
          </div>
          {/* Rating bar summary */}
          <div className="flex flex-col gap-1.5 min-w-[180px]">
            {[5, 4, 3, 2, 1].map((star) => {
              const pct = star === 5 ? 72 : star === 4 ? 20 : star === 3 ? 5 : star === 2 ? 2 : 1;
              return (
                <div key={star} className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground w-3">{star}</span>
                  <Icon name="StarIcon" size={10} className="text-accent" variant="solid" />
                  <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-accent rounded-full"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground w-7 text-right">{pct}%</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {mockReviews.map((review) => (
            <div
              key={review.id}
              className="bg-card border border-border rounded-3xl p-6 flex flex-col gap-4 card-glow-primary"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-fire-gradient flex items-center justify-center text-primary-foreground font-extrabold text-sm shrink-0">
                    {review.avatar}
                  </div>
                  <div>
                    <p className="font-bold text-foreground text-sm">{review.author}</p>
                    <p className="text-xs text-muted-foreground">{review.date}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <StarRating rating={review.rating} size={13} />
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                    {review.device}
                  </span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{review.comment}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Back to products */}
      <div className="pb-16 px-4 sm:px-6 max-w-7xl mx-auto">
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-foreground transition-colors"
        >
          <Icon name="ArrowLeftIcon" size={16} />
          Back to all products
        </Link>
      </div>

      <Footer />
    </main>
  );
}
