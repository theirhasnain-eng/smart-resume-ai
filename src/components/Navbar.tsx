import type { SessionUser } from '@/lib/auth';
import Link from 'next/link';
import { LogoutButton } from '@/components/LogoutButton';
import { ThemeToggle } from '@/components/ThemeToggle';

const navItems = [
  { href: '/#features', label: 'Features', icon: 'fa-sparkles' },
  { href: '/#team', label: 'Team', icon: 'fa-people-group' },
  { href: '/#contact', label: 'Contact', icon: 'fa-envelope' },
];

type NavbarProps = {
  user: SessionUser | null;
};

export function Navbar({ user }: NavbarProps) {
  const dashboardHref =
    user?.role === 'admin'
      ? '/admin/dashboard'
      : user?.role === 'hr'
        ? '/hr/dashboard'
        : '/candidate/dashboard';

  return (
    <nav className="glass-nav fixed top-0 z-50 w-full">
      <div className="site-container nav-inner">
        <Link href="/" prefetch className="nav-brand">
          <span className="nav-brand__icon">
            <i className="fa-solid fa-robot" />
          </span>
          <span className="nav-brand__text">Smart Resume AI</span>
        </Link>

        <div className="nav-links">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} prefetch={false} className="nav-link-custom">
              <i className={`fa-solid ${item.icon}`} />
              {item.label}
            </Link>
          ))}
        </div>

        <div className="nav-actions">
          <ThemeToggle />
          {user ? (
            <>
              {user.name && (
                <span className="nav-user-pill">
                  <i className="fa-solid fa-circle-user" />
                  {user.name}
                </span>
              )}
              <Link href={dashboardHref} prefetch className="btn-nav btn-nav-dashboard">
                <i className="fa-solid fa-gauge-high" />
                Dashboard
              </Link>
              <LogoutButton />
            </>
          ) : (
            <>
              <Link href="/login" prefetch className="btn-nav btn-nav-ghost">
                <i className="fa-solid fa-right-to-bracket" />
                Login
              </Link>
              <Link href="/register" prefetch className="btn-nav btn-nav-accent">
                <i className="fa-solid fa-user-plus" />
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export function NavbarFallback() {
  return (
    <nav className="glass-nav fixed top-0 z-50 w-full">
      <div className="site-container nav-inner">
        <div className="nav-brand">
          <span className="nav-brand__icon">
            <i className="fa-solid fa-robot" />
          </span>
          <span className="nav-brand__text">Smart Resume AI</span>
        </div>
      </div>
    </nav>
  );
}
