import Link from 'next/link';
import { registerAction } from '@/app/actions/auth';
import { SubmitButton } from '@/components/SubmitButton';

export default function RegisterPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  const err =
    searchParams.error === 'exists'
      ? 'Email already registered.'
      : searchParams.error === 'fields'
        ? 'Check all fields. Password min 6 chars and must match.'
        : null;

  return (
    <div className="auth-wrapper">
      <div className="auth-card glass-card p-4">
        <h4 className="mb-2 text-center font-bold">Create account</h4>
        <p className="text-accent mb-4 text-center text-sm">Candidates only — HR accounts are created by admin.</p>
        {err && <div className="alert alert-danger">{err}</div>}

        <form action={registerAction} className="space-y-3">
          <div>
            <label className="form-label" htmlFor="name">
              Full name
            </label>
            <input id="name" name="name" className="form-control" required />
          </div>
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
            <input id="password" name="password" type="password" className="form-control" required minLength={6} />
          </div>
          <div>
            <label className="form-label" htmlFor="confirm">
              Confirm password
            </label>
            <input id="confirm" name="confirm" type="password" className="form-control" required minLength={6} />
          </div>
          <SubmitButton>
            <i className="fa-solid fa-user-plus me-2" />
            Register
          </SubmitButton>
        </form>
        <p className="text-accent mt-4 text-center text-sm">
          <Link href="/login" className="underline">
            Back to login
          </Link>
        </p>
      </div>
    </div>
  );
}
