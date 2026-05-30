import { getSession, requireRole } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { uploadResumeAction, getCandidateMatches } from '@/app/actions/candidate';
import { ScoreBar } from '@/components/ScoreBar';
import { TableGlass } from '@/components/TableGlass';

export default async function CandidateDashboard({
  searchParams,
}: {
  searchParams: { success?: string; error?: string };
}) {
  const user = requireRole(await getSession(), ['candidate']);

  const uploadErr =
    searchParams.error === 'file'
      ? 'Please select a file.'
      : searchParams.error === 'type'
        ? 'Only PDF, DOCX, or TXT allowed (use .docx instead of old .doc).'
        : searchParams.error === 'doc'
          ? 'Old .doc format is not supported. Save as .docx or PDF in Word.'
          : searchParams.error === 'empty'
            ? 'File uploaded but no readable text was found. Try .txt or a text-based PDF.'
            : searchParams.error === 'read'
              ? 'Could not read file text. Try .txt, .docx, or a simple PDF (not a scanned image).'
              : null;

  const resumes = await prisma.resume.findMany({
    where: { candidateId: user.id },
    orderBy: { uploadedAt: 'desc' },
  });

  const { best, jobs } = await getCandidateMatches(user.id);

  return (
    <div className="site-container page-content py-8">
      <div className="dashboard-header mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3>Candidate Dashboard</h3>
          <p className="text-accent mb-0">Upload your resume and view AI job matches.</p>
        </div>
        <span className="badge-role badge-role-candidate">Candidate</span>
      </div>

      <div className="mb-4 grid gap-4 lg:grid-cols-2">
        <div className="glass-card p-4">
          <h5 className="mb-3 font-semibold">
            <i className="fa-solid fa-file-arrow-up me-2 text-indigo-300" />
            Upload resume
          </h5>
          {searchParams.success === 'upload' && (
            <div className="alert alert-success py-2">Resume uploaded successfully.</div>
          )}
          {uploadErr && <div className="alert alert-danger py-2">{uploadErr}</div>}
          <form action={uploadResumeAction}>
            <div className="mb-3">
              <label className="form-label">Resume file</label>
              <input type="file" name="resume" accept=".pdf,.docx,.txt" required className="form-control" />
              <p className="text-accent mt-2 text-xs">
                Best results: .txt or .docx. PDF must contain selectable text (not a photo scan).
              </p>
            </div>
            <button type="submit" className="btn-gradient w-full py-2">
              Upload
            </button>
          </form>
          {resumes.length > 0 && (
            <ul className="text-accent mt-4 space-y-1 border-t border-white/10 pt-3 text-sm">
              {resumes.map((r) => (
                <li key={r.id}>
                  <i className="fa-regular fa-file-lines me-2" />
                  {r.originalName}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="glass-card p-4">
          <h5 className="mb-3 font-semibold">
            <i className="fa-solid fa-star me-2 text-amber-300" />
            Best match
          </h5>
          {best ? (
            <>
              <p className="mb-1 font-semibold">{best.title}</p>
              <p className="text-accent mb-3 text-sm">{best.location ?? 'Remote'}</p>
              <ScoreBar score={best.score} />
              <p className="text-accent mt-3 text-sm">
                <strong>Skill gap:</strong> {best.skillGap || 'None major'}
              </p>
            </>
          ) : (
            <p className="text-accent mb-0">Upload a resume and wait for HR to post jobs.</p>
          )}
        </div>
      </div>

      {jobs.length > 0 && (
        <div className="glass-card p-4">
          <h5 className="mb-3 font-semibold">Matched jobs</h5>
          <TableGlass>
            <thead>
              <tr>
                <th>Title</th>
                <th>Location</th>
                <th>Match</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((j) => (
                <tr key={j.title + String(j.score)}>
                  <td>{j.title}</td>
                  <td className="cell-muted">{j.location ?? '—'}</td>
                  <td>
                    <ScoreBar score={j.score} />
                  </td>
                </tr>
              ))}
            </tbody>
          </TableGlass>
        </div>
      )}
    </div>
  );
}
