'use client';

import dynamic from 'next/dynamic';

const ThemeToggleInner = dynamic(
  () => import('@/components/ThemeToggleInner').then((m) => ({ default: m.ThemeToggleInner })),
  {
    ssr: false,
    loading: () => (
      <button type="button" className="btn-nav btn-nav-ghost btn-nav-theme px-3 py-1 text-xs" aria-hidden>
        <i className="fa-solid fa-circle-half-stroke" />
      </button>
    ),
  }
);

export function ThemeToggle() {
  return <ThemeToggleInner />;
}
