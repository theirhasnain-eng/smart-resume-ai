import Link from 'next/link';
import { contactFormAction } from '@/app/actions/contact';
import { StatsCounter } from '@/components/StatsCounter';

const team = [
  { name: 'Muhammad Gulzaman', role: 'AI & Full-Stack Engineer', photo: '/picture/gullzaman.jpg' },
  { name: 'Muhammad Hasnain', role: 'Frontend Developer', photo: '/picture/hasnain.jpg' },
  { name: 'Syed Rizwan', role: 'Python & Machine Learning Expert', photo: '/picture/rizwan.jpg' },
  { name: 'Shaikh Usman', role: 'PHP & Backend Developer', photo: '/picture/IMG-20240608-WA0037.jpg' },
];

const features = [
  {
    icon: 'fa-wand-magic-sparkles',
    title: 'AI Resume Screening',
    desc: 'Leverage TF-IDF & cosine similarity to rank candidates by how well their profiles match job descriptions.',
  },
  {
    icon: 'fa-chart-line',
    title: 'Skill Gap Analytics',
    desc: 'Visualize missing skills and help candidates understand where to upskill for better matching opportunities.',
  },
  {
    icon: 'fa-user-shield',
    title: 'Role-Based Dashboards',
    desc: 'Dedicated experiences for HR, Candidates, and Admin with secure passwords and controlled access.',
  },
];

export default function HomePage({
  searchParams,
}: {
  searchParams: { contact?: string };
}) {
  const contactOk = searchParams.contact === 'ok';
  const contactErr = searchParams.contact === 'error';

  return (
    <>
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
              <Link href="/login" className="btn-gradient px-6 py-3 text-base">
                <i className="fa-solid fa-right-to-bracket me-2" />
                Login
              </Link>
              <Link href="/register" className="btn-outline-soft px-6 py-3 text-base">
                <i className="fa-solid fa-user-plus me-2" />
                Register
              </Link>
            </div>
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

      <section id="features" className="py-5">
        <div className="site-container">
          <div className="mb-5 text-center">
            <div className="section-title-pill mb-2">
              <span className="badge-dot" />
              <span>Core Features</span>
            </div>
            <h2 className="text-2xl font-bold">Smarter Screening, Better Matches</h2>
            <p className="text-accent mb-0">From AI-powered ranking to skill gap analytics, every step is automated.</p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {features.map((f) => (
              <div key={f.title} className="glass-card h-full p-4">
                <div className="feature-icon mb-3">
                  <i className={`fa-solid ${f.icon}`} />
                </div>
                <h5 className="mb-2 font-semibold">{f.title}</h5>
                <p className="text-accent mb-0 text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="team" className="py-5">
        <div className="site-container">
          <div className="mb-5 text-center">
            <div className="section-title-pill mb-2">
              <span className="badge-dot" />
              <span>Our Team</span>
            </div>
            <h2 className="text-2xl font-bold">Meet the Builders</h2>
            <p className="text-accent mb-0">Four passionate innovators behind Smart Resume AI.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
            {team.map((m) => (
              <div key={m.name} className="glass-card p-3 text-center">
                <img src={m.photo} alt={m.name} className="team-avatar mx-auto mb-3" loading="lazy" />
                <h6 className="mb-1 font-semibold">{m.name}</h6>
                <p className="text-accent mb-0 text-sm">{m.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="py-5 pb-16">
        <div className="site-container">
          <div className="grid items-center gap-8 lg:grid-cols-2">
            <div>
              <div className="section-title-pill mb-2">
                <span className="badge-dot" />
                <span>Contact</span>
              </div>
              <h2 className="mb-3 text-2xl font-bold">Let&apos;s talk about smarter hiring.</h2>
              <p className="text-accent mb-0">
                Have questions about implementation, integrations, or research? Send us a message and our
                team will respond.
              </p>
            </div>
            <form action={contactFormAction} className="glass-card p-4">
              {contactOk && <div className="alert alert-success">Thank you! Your message has been received.</div>}
              {contactErr && <div className="alert alert-danger">Please fill all fields correctly.</div>}
              <div className="mb-3">
                <label className="form-label" htmlFor="name">
                  Name
                </label>
                <input id="name" name="name" className="form-control" required maxLength={100} />
              </div>
              <div className="mb-3">
                <label className="form-label" htmlFor="email">
                  Email
                </label>
                <input id="email" name="email" type="email" className="form-control" required maxLength={190} />
              </div>
              <div className="mb-3">
                <label className="form-label" htmlFor="message">
                  Message
                </label>
                <textarea id="message" name="message" className="form-control" rows={4} required maxLength={5000} />
              </div>
              <button type="submit" className="btn-gradient w-full py-3">
                <i className="fa-solid fa-paper-plane me-2" />
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
