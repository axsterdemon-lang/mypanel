'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/** Animate only visible backdrops; pointer motion never moves the content. */
export default function BackgroundMotion() {
  const pathname = usePathname();

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>('[data-depth-background]'));
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const pointer = window.matchMedia('(hover: hover) and (pointer: fine)');
    let frame = 0;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(({ target, isIntersecting }) => {
        (target as HTMLElement).style.setProperty('--background-play', isIntersecting ? 'running' : 'paused');
      });
    });
    sections.forEach((section) => observer.observe(section));

    const reset = () => sections.forEach((section) => {
      section.style.setProperty('--depth-x', '0px');
      section.style.setProperty('--depth-y', '0px');
    });
    const move = (event: PointerEvent) => {
      if (preference.matches || !pointer.matches || event.pointerType !== 'mouse') return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const section = (event.target as Element).closest<HTMLElement>('[data-depth-background]');
        sections.forEach((other) => {
          if (other !== section) {
            other.style.setProperty('--depth-x', '0px');
            other.style.setProperty('--depth-y', '0px');
          }
        });
        if (!section) return;
        const bounds = section.getBoundingClientRect();
        section.style.setProperty('--depth-x', `${((event.clientX - bounds.left) / bounds.width - .5) * 16}px`);
        section.style.setProperty('--depth-y', `${(event.clientY / window.innerHeight - .5) * 10}px`);
      });
    };
    document.addEventListener('pointermove', move, { passive: true });
    document.documentElement.addEventListener('pointerleave', reset);
    window.addEventListener('blur', reset);
    preference.addEventListener('change', reset);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      document.removeEventListener('pointermove', move);
      document.documentElement.removeEventListener('pointerleave', reset);
      window.removeEventListener('blur', reset);
      preference.removeEventListener('change', reset);
      reset();
    };
  }, [pathname]);

  return null;
}
