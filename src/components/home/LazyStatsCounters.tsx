'use client';

import dynamic from 'next/dynamic';

const StatsCounter = dynamic(
  () => import('@/components/StatsCounter').then((m) => ({ default: m.StatsCounter })),
  {
    ssr: false,
    loading: () => <div className="stats-counter opacity-60">…</div>,
  }
);

export function LazyStatsCounters() {
  return (
    <div className="flex flex-wrap gap-8">
      <div>
        <StatsCounter target={1200} />
        <small className="text-accent">Resumes analyzed</small>
      </div>
      <div>
        <StatsCounter target={280} />
        <small className="text-accent">Jobs posted</small>
      </div>
      <div>
        <StatsCounter target={87} />
        <small className="text-accent">Avg. match score</small>
      </div>
    </div>
  );
}
