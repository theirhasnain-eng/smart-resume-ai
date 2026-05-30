'use client';

import { useEffect } from 'react';

/** Slower, eased scroll for in-page anchor links (navbar Features, Team, Contact). */
const SCROLL_DURATION_MS = 1100;

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function smoothScrollTo(targetY: number) {
  const startY = window.scrollY;
  const distance = targetY - startY;
  const startTime = performance.now();

  function step(now: number) {
    const elapsed = now - startTime;
    const progress = Math.min(1, elapsed / SCROLL_DURATION_MS);
    const eased = easeInOutCubic(progress);
    window.scrollTo(0, startY + distance * eased);
    if (progress < 1) requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
}

export function SmoothScroll() {
  useEffect(() => {
    function onClick(e: MouseEvent) {
      const anchor = (e.target as HTMLElement).closest('a[href*="#"]') as HTMLAnchorElement | null;
      if (!anchor) return;

      const href = anchor.getAttribute('href');
      if (!href || !href.includes('#')) return;

      const hashIndex = href.indexOf('#');
      const path = href.slice(0, hashIndex) || window.location.pathname;
      const hash = href.slice(hashIndex);

      if (hash === '#') return;

      const onSamePage =
        path === '' ||
        path === window.location.pathname ||
        (path === '/' && window.location.pathname === '/');

      if (!onSamePage) return;

      const id = hash.slice(1);
      const el = document.getElementById(id);
      if (!el) return;

      e.preventDefault();

      const navOffset = 88;
      const top = el.getBoundingClientRect().top + window.scrollY - navOffset;

      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        window.scrollTo(0, Math.max(0, top));
      } else {
        smoothScrollTo(Math.max(0, top));
      }

      window.history.pushState(null, '', hash);
    }

    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  return null;
}
