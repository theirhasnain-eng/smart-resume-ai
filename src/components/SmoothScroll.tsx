'use client';

import dynamic from 'next/dynamic';

/** Lazy-load scroll script — not needed for first paint on login/dashboard. */
export const SmoothScroll = dynamic(
  () => import('@/components/SmoothScrollInner').then((m) => ({ default: m.SmoothScrollInner })),
  { ssr: false }
);
