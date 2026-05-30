import Link from 'next/link';
import { loginAction } from '@/app/actions/auth';

export default function LoginPage({
  searchParams,
}: {
  searchParams: { registered?: string; error?: string };
}) {
  return (
    <div className="auth-wrapper">
      <div className="auth-card glass-card p-4">
        <h4 className="mb-3 text-center font-bold">Welcome back</h4>
        <p className="text-accent mb-4 text-center text-sm">Sign in to your Smart Resume AI account</p>

        {searchParams.error === 'invalid' && (
          <div className="alert alert-danger">Invalid email or password.</div>
        )}
        {searchParams.registered && (
          <div className="alert alert-success">Registration successful. Please log in.</div>
        )}

        <form action={loginAction} className="space-y-3">
          <div>
            <label className="form-label" htmlFor="email">
              Email
            </label>
            <input id="email" name="email" type="email" className="form-control" required />
          </div>
          <div>
            <label className="form-label" htmlFor="password">
              Password
            </label>
            <input id="password" name="password" type="password" className="form-control" required />
          </div>
          <button type="submit" className="btn-gradient w-full py-2">
            <i className="fa-solid fa-right-to-bracket me-2" />
            Login
          </button>
        </form>
        <p className="text-accent mt-4 text-center text-sm">
          No account?{' '}
          <Link href="/register" className="underline">
            Register as candidate
          </Link>
        </p>
      </div>
    </div>
  );
}
