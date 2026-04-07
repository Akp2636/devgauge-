export const RANKS = [
  { name: 'Newbie',           minScore: 0,    color: '#6b7280', bg: 'bg-gray-500/20',   text: 'text-gray-400' },
  { name: 'Pupil',            minScore: 800,  color: '#22c55e', bg: 'bg-green-500/20',  text: 'text-green-400' },
  { name: 'Apprentice',       minScore: 1200, color: '#10b981', bg: 'bg-emerald-500/20',text: 'text-emerald-400' },
  { name: 'Specialist',       minScore: 1400, color: '#06b6d4', bg: 'bg-cyan-500/20',   text: 'text-cyan-400' },
  { name: 'Expert',           minScore: 1600, color: '#60a5fa', bg: 'bg-blue-500/20',   text: 'text-blue-400' },
  { name: 'Candidate Master', minScore: 1900, color: '#a78bfa', bg: 'bg-violet-500/20', text: 'text-violet-400' },
  { name: 'Master',           minScore: 2100, color: '#c084fc', bg: 'bg-purple-500/20', text: 'text-purple-400' },
  { name: 'Grandmaster',      minScore: 2400, color: '#f87171', bg: 'bg-red-500/20',    text: 'text-red-400' },
];

export const getRankInfo = (rank: string) => RANKS.find(r => r.name === rank) || RANKS[0];

export const getRankProgress = (score: number, rank: string) => {
  const current = RANKS.find(r => r.name === rank);
  const idx = RANKS.indexOf(current!);
  const next = RANKS[idx + 1];
  if (!next) return 100;
  return Math.min(Math.round(((score - current!.minScore) / (next.minScore - current!.minScore)) * 100), 100);
};

export const formatScore = (score: number) => score.toLocaleString();
