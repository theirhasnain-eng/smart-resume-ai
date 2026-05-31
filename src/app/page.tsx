import { Suspense } from 'react';
import Link from 'next/link';
import { HomeBelowFold, HomeBelowFoldSkeleton } from '@/components/home/HomeBelowFold';
import { LazyStatsCounters } from '@/components/home/LazyStatsCounters';

export default function HomePage({
  searchParams,
}: {
  searchParams: { contact?: string };
}) {
  const contactOk = searchParams.contact === 'ok';
  const contactErr = searchParams.contact === 'error';

  return (
    <>
      {/* Hero loads first — below sections stream in via Suspense (lazy server rendering) */}
      <section className="hero-section site-container">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <div className="section-title-pill mb-3">
              <span className="badge-dot" />
              <span>AI-Powered Smart Hiring</span>
            </div>
            <h1 className="hero-heading mb-3">
              <span className="hero-gradient-text">AI-Powered Smart Resume Screening</span>
              <br />
              and Job Matching System
            </h1>
            <p className="hero-subtitle mb-4">
              Reduce manual screening time, discover the best-fit candidates in seconds, and unlock
              data-driven hiring decisions with an intelligent TF-IDF powered matching engine.
            </p>
            <p className="text-accent mb-1 text-xs font-semibold uppercase tracking-wide">
              Smart Hiring Powered by AI
            </p>
            <div className="mb-4 flex flex-wrap gap-3">
              <Link href="/login" prefetch className="btn-gradient px-6 py-3 text-base">
                <i className="fa-solid fa-right-to-bracket me-2" />
                Login
              </Link>
              <Link href="/register" prefetch className="btn-outline-soft px-6 py-3 text-base">
                <i className="fa-solid fa-user-plus me-2" />
                Register
              </Link>
            </div>
            <LazyStatsCounters />
          </div>
          <div className="glass-card p-5">
            <h5 className="mb-3 font-semibold">Why Smart Resume AI?</h5>
            <ul className="space-y-2 text-sm">
              <li>
                <i className="fa-solid fa-bolt me-2 text-amber-400" />
                Instant AI-powered ranking of candidates.
              </li>
              <li>
                <i className="fa-solid fa-magnifying-glass-chart me-2 text-sky-400" />
                Transparent similarity scores with skill gap analysis.
              </li>
              <li>
                <i className="fa-solid fa-shield-halved me-2 text-emerald-400" />
                Secure, role-based access for HR, Candidates, and Admin.
              </li>
              <li>
                <i className="fa-solid fa-cloud-arrow-up me-2 text-indigo-400" />
                Upload DOCX/PDF resumes and analyze in one click.
              </li>
            </ul>
          </div>
        </div>
      </section>

      <Suspense fallback={<HomeBelowFoldSkeleton />}>
        <HomeBelowFold contactOk={contactOk} contactErr={contactErr} />
      </Suspense>
    </>
  );
}
