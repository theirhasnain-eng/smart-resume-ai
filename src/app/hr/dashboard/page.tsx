import Link from 'next/link';
import { getSession, requireRole } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { createJobAction } from '@/app/actions/hr';
import { TableGlass } from '@/components/TableGlass';

export default async function HrDashboard({
  searchParams,
}: {
  searchParams: { success?: string; error?: string };
}) {
  const user = requireRole(await getSession(), ['hr']);

  const jobs = await prisma.job.findMany({
    where: { hrId: user.id },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="site-container page-content py-8">
      <div className="dashboard-header mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3>HR Dashboard</h3>
          <p className="text-accent mb-0">Post jobs and run AI-powered candidate analysis.</p>
        </div>
        <span className="badge-role badge-role-hr">HR</span>
      </div>

      {searchParams.success === 'job' && <div className="alert alert-success">Job posted successfully.</div>}
      {searchParams.error === 'job' && (
        <div className="alert alert-danger">Title and description are required.</div>
      )}

      <div className="glass-card mb-4 p-4">
        <h5 className="mb-3 font-semibold">Post a new job</h5>
        <form action={createJobAction} className="space-y-3">
          <div>
            <label className="form-label">Job title</label>
            <input name="title" className="form-control" required />
          </div>
          <div>
            <label className="form-label">Location</label>
            <input name="location" className="form-control" placeholder="e.g. Remote, Karachi" />
          </div>
          <div>
            <label className="form-label">Description</label>
            <textarea name="description" className="form-control" rows={4} required />
          </div>
          <button type="submit" className="btn-gradient px-5 py-2">
            <i className="fa-solid fa-briefcase me-1" />
            Create job
          </button>
        </form>
      </div>

      <div className="glass-card p-4">
        <h5 className="mb-3 font-semibold">Your jobs</h5>
        <TableGlass>
          <thead>
            <tr>
              <th>Title</th>
              <th>Location</th>
              <th className="table-actions">Actions</th>
            </tr>
          </thead>
          <tbody>
            {jobs.length === 0 ? (
              <tr>
                <td colSpan={3} className="cell-muted">
                  No jobs posted yet.
                </td>
              </tr>
            ) : (
              jobs.map((j) => (
                <tr key={j.id}>
                  <td>{j.title}</td>
                  <td className="cell-muted">{j.location ?? '—'}</td>
                  <td>
                    <Link href={`/hr/analyze/${j.id}`} className="btn-gradient px-3 py-1 text-xs">
                      <i className="fa-solid fa-wand-magic-sparkles me-1" />
                      Analyze AI
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </TableGlass>
      </div>
    </div>
  );
}
