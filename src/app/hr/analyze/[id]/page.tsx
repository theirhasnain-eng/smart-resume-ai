import Link from 'next/link';
import { getSession, requireRole } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { analyzeJobAction } from '@/app/actions/hr';
import { ScoreBar } from '@/components/ScoreBar';
import { TableGlass } from '@/components/TableGlass';

export default async function AnalyzePage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { done?: string; error?: string; count?: string };
}) {
  const user = requireRole(await getSession(), ['hr']);
  const jobId = Number(params.id);

  const job = await prisma.job.findFirst({ where: { id: jobId, hrId: user.id } });
  if (!job) {
    return (
      <div className="site-container page-content py-8">
        <p>Job not found.</p>
      </div>
    );
  }

  const [matches, resumeCount, resumesWithText] = await Promise.all([
    prisma.match.findMany({
      where: { jobId: job.id },
      include: { resume: { include: { candidate: true } } },
      orderBy: { similarityScore: 'desc' },
    }),
    prisma.resume.count(),
    prisma.resume.count({
      where: {
        AND: [{ extractedText: { not: null } }, { NOT: { extractedText: '' } }],
      },
    }),
  ]);

  return (
    <div className="site-container page-content py-8">
      <Link href="/hr/dashboard" className="text-accent mb-4 inline-block text-sm underline">
        <i className="fa-solid fa-arrow-left me-1" />
        Back to jobs
      </Link>

      <div className="dashboard-header mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3>AI Analysis: {job.title}</h3>
          <p className="text-accent mb-0 whitespace-pre-line text-sm">{job.description}</p>
        </div>
        <span className="badge-role badge-role-hr">HR</span>
      </div>

      {searchParams.error === 'noresumes' && (
        <div className="alert alert-danger mb-4">
          No resumes in the database yet. Ask a candidate to register and upload a resume (.txt or .docx works
          best), then run analysis again.
        </div>
      )}

      {searchParams.done && (
        <div className="alert alert-success mb-4">
          AI matching complete — ranked {searchParams.count ?? matches.length} candidate(s) below.
        </div>
      )}

      <div className="glass-card mb-4 p-4">
        <p className="text-accent mb-2 text-sm">
          <i className="fa-solid fa-file-lines me-2" />
          Resumes in system: <strong className="text-white">{resumeCount}</strong>
          {resumeCount > 0 && (
            <>
              {' '}
              ({resumesWithText} with readable text)
            </>
          )}
        </p>
        {resumeCount === 0 ? (
          <p className="mb-0 text-sm text-amber-200">
            Waiting for candidates to upload. They must register and upload from the Candidate dashboard.
          </p>
        ) : (
          <form action={analyzeJobAction} className="mb-0">
            <input type="hidden" name="jobId" value={job.id} />
            <button type="submit" className="btn-gradient px-5 py-2">
              <i className="fa-solid fa-robot me-2" />
              Run AI matching
            </button>
          </form>
        )}
      </div>

      <div className="glass-card p-4">
        <h5 className="mb-3 font-semibold">Ranked candidates</h5>
        {!matches.length ? (
          <p className="text-accent mb-0">
            {resumeCount === 0
              ? 'No candidate resumes uploaded yet.'
              : 'Click “Run AI matching” above to rank uploaded resumes against this job.'}
          </p>
        ) : (
          <TableGlass>
            <thead>
              <tr>
                <th>#</th>
                <th>Candidate</th>
                <th>Email</th>
                <th>Resume</th>
                <th>Match</th>
                <th>Skill gap</th>
              </tr>
            </thead>
            <tbody>
              {matches.map((m, i) => (
                <tr key={m.id}>
                  <td className="cell-rank">{i + 1}</td>
                  <td>{m.resume.candidate.name}</td>
                  <td className="cell-muted">{m.resume.candidate.email}</td>
                  <td className="cell-muted">{m.resume.originalName}</td>
                  <td>
                    <ScoreBar score={Number(m.similarityScore)} />
                  </td>
                  <td className="cell-muted text-sm">{m.skillGap || '—'}</td>
                </tr>
              ))}
            </tbody>
          </TableGlass>
        )}
      </div>
    </div>
  );
}
