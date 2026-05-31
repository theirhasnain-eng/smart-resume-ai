import { getSession, requireRole } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { createHrAction } from '@/app/actions/admin';
import { TableGlass } from '@/components/TableGlass';

export default async function AdminDashboard({
  searchParams,
}: {
  searchParams: { success?: string; error?: string };
}) {
  requireRole(await getSession(), ['admin']);

  const [hrUsers, resumes, jobs, contacts] = await Promise.all([
    prisma.user.findMany({ where: { role: 'hr' }, orderBy: { createdAt: 'desc' }, take: 25 }),
    prisma.resume.count(),
    prisma.job.count(),
    prisma.contactMessage.count(),
  ]);

  const stats = { resumes, jobs, contacts };

  return (
    <div className="site-container page-content py-8">
      <div className="dashboard-header mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3>Admin Analytics Dashboard</h3>
          <p className="text-accent mb-0">Monitor platform-wide usage, resumes, jobs, and AI performance.</p>
        </div>
        <span className="badge-role badge-role-admin">Admin</span>
      </div>

      {searchParams.success === 'hr' && <div className="alert alert-success">HR account created.</div>}
      {searchParams.error === 'hr-exists' && <div className="alert alert-danger">Email already in use.</div>}
      {searchParams.error === 'hr-fields' && (
        <div className="alert alert-danger">Enter name, email, and password (min 6).</div>
      )}

      <div className="mb-4 grid gap-4 md:grid-cols-3">
        {[
          ['Resumes', stats.resumes],
          ['Jobs', stats.jobs],
          ['Contact messages', stats.contacts],
        ].map(([label, val]) => (
          <div key={label} className="glass-card stat-card p-4">
            <p className="text-accent mb-1 text-sm">{label}</p>
            <p className="stat-value mb-0">{val}</p>
          </div>
        ))}
      </div>

      <div className="glass-card mb-4 p-4">
        <h5 className="mb-2 font-semibold">Hire HR</h5>
        <p className="text-accent mb-3 text-sm">HR cannot self-register. Create accounts here and share credentials.</p>
        <form action={createHrAction} className="grid gap-3 md:grid-cols-4 md:items-end">
          <div>
            <label className="form-label">Full name</label>
            <input name="name" className="form-control" required />
          </div>
          <div>
            <label className="form-label">Email</label>
            <input name="email" type="email" className="form-control" required />
          </div>
          <div>
            <label className="form-label">Password</label>
            <input name="password" type="password" className="form-control" required minLength={6} />
          </div>
          <button type="submit" className="btn-gradient py-2">
            <i className="fa-solid fa-user-tie me-1" />
            Add HR
          </button>
        </form>
      </div>

      <div className="glass-card p-4">
        <h5 className="mb-3 font-semibold">HR accounts</h5>
        <TableGlass>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {hrUsers.length === 0 ? (
              <tr>
                <td colSpan={2} className="cell-muted">
                  No HR users yet.
                </td>
              </tr>
            ) : (
              hrUsers.map((u) => (
                <tr key={u.id}>
                  <td>{u.name}</td>
                  <td className="cell-muted">{u.email}</td>
                </tr>
              ))
            )}
          </tbody>
        </TableGlass>
      </div>
    </div>
  );
}
