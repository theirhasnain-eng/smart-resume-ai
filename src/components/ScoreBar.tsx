import { scoreBarClass } from '@/lib/matcher';

export function ScoreBar({ score, showLabel }: { score: number; showLabel?: boolean }) {
  const pct = Math.min(100, Math.max(0, score));
  return (
    <div className="score-cell">
      <div className="score-bar score-bar--inline">
        <div
          className={`score-bar__fill ${scoreBarClass(score)}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      {showLabel !== false && <span className="score-pct">{pct}% match</span>}
    </div>
  );
}
