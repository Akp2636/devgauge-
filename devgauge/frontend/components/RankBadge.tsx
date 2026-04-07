import { getRankInfo } from '../lib/ranks';

interface RankBadgeProps {
  rank: string;
  score?: number;
  size?: 'sm' | 'md' | 'lg';
}

export default function RankBadge({ rank, score, size = 'md' }: RankBadgeProps) {
  const info = getRankInfo(rank);
  const padding = size === 'lg' ? 'px-3 py-1 text-xs' : 'px-2 py-0.5 text-[10px]';

  return (
    <div className="flex items-center gap-2">
      <span
        className={`font-mono font-semibold border rounded-sm ${padding}`}
        style={{
          color: info.color,
          borderColor: `${info.color}35`,
          backgroundColor: `${info.color}12`,
          letterSpacing: '0.05em',
        }}
      >
        {rank}
      </span>
      {score !== undefined && (
        <span className="text-[11px] font-mono" style={{ color: '#555' }}>
          {score.toLocaleString()} pts
        </span>
      )}
    </div>
  );
}
