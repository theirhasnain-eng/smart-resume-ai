import { contactFormAction } from '@/app/actions/contact';

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

type Props = {
  contactOk: boolean;
  contactErr: boolean;
};

/** Below-the-fold home content — loaded in a Suspense boundary so hero paints first. */
export function HomeBelowFold({ contactOk, contactErr }: Props) {
  return (
    <>
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
                <img
                  src={m.photo}
                  alt={m.name}
                  className="team-avatar mx-auto mb-3"
                  loading="lazy"
                  decoding="async"
                  width={150}
                  height={160}
                />
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
                Have questions about implementation, integrations, or research? Send us a message and our team will
                respond.
              </p>
            </div>
            <form action={contactFormAction} className="glass-card p-4">
              {contactOk && (
                <div className="alert alert-success">Thank you! Your message has been received.</div>
              )}
              {contactErr && (
                <div className="alert alert-danger">Please fill all fields correctly.</div>
              )}
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

export function HomeBelowFoldSkeleton() {
  return (
    <div className="site-container py-8" aria-hidden>
      <div className="mb-4 h-8 w-48 animate-pulse rounded-lg bg-white/10" />
      <div className="grid gap-4 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="glass-card h-40 animate-pulse bg-white/5" />
        ))}
      </div>
    </div>
  );
}
