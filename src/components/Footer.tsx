import Link from 'next/link';
import { getSession } from '@/lib/auth';
import { LogoutButton } from '@/components/LogoutButton';

export async function Footer() {
  const year = new Date().getFullYear();
  const user = await getSession();

  const dashboardHref = user
    ? user.role === 'admin'
      ? '/admin/dashboard'
      : user.role === 'hr'
        ? '/hr/dashboard'
        : '/candidate/dashboard'
    : null;

  return (
    <footer className="glass-footer site-footer">
      <div className="site-container">
        <div className="footer-grid">
          <div className="footer-brand-block">
            <Link href="/" className="footer-brand">
              <i className="fa-solid fa-robot me-2" />
              Smart Resume AI
            </Link>
            <p className="footer-tagline">
              AI-powered resume screening and job matching for smarter hiring.
            </p>
          </div>

          <div>
            <h6 className="footer-heading">Explore</h6>
            <ul className="footer-links">
              <li>
                <Link href="/">
                  <i className="fa-solid fa-house me-2" />
                  Home
                </Link>
              </li>
              <li>
                <Link href="/#features">
                  <i className="fa-solid fa-sparkles me-2" />
                  Features
                </Link>
              </li>
              <li>
                <Link href="/#team">
                  <i className="fa-solid fa-people-group me-2" />
                  Team
                </Link>
              </li>
              <li>
                <Link href="/#contact">
                  <i className="fa-solid fa-envelope me-2" />
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h6 className="footer-heading">Account</h6>
            <ul className="footer-links">
              {user ? (
                <>
                  <li>
                    <Link href={dashboardHref!}>
                      <i className="fa-solid fa-gauge-high me-2" />
                      {user.role === 'admin'
                        ? 'Admin Dashboard'
                        : user.role === 'hr'
                          ? 'HR Dashboard'
                          : 'Candidate Dashboard'}
                    </Link>
                  </li>
                  <li className="footer-logout">
                    <LogoutButton />
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link href="/login">
                      <i className="fa-solid fa-right-to-bracket me-2" />
                      Login
                    </Link>
                  </li>
                  <li>
                    <Link href="/register">
                      <i className="fa-solid fa-user-plus me-2" />
                      Register
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-social">
            <a href="#" className="footer-icon" aria-label="LinkedIn">
              <i className="fab fa-linkedin-in" />
            </a>
            <a href="#" className="footer-icon" aria-label="GitHub">
              <i className="fab fa-github" />
            </a>
            <a href="#" className="footer-icon" aria-label="Twitter">
              <i className="fab fa-twitter" />
            </a>
          </div>
          <p className="footer-copy mb-0">&copy; {year} Smart Resume AI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
