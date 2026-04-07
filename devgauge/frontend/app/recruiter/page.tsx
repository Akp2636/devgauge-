'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthProvider, useAuth } from '../../lib/auth';
import { api } from '../../lib/api';
import { RANKS } from '../../lib/ranks';
import { getRankInfo, getRankProgress } from '../../lib/ranks';
import Navbar from '../../components/Navbar';
import { Search, Filter, Users, Loader2, Mail, Github, ChevronLeft, ChevronRight, SlidersHorizontal } from 'lucide-react';

function RecruiterInner() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [candidates, setCandidates] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ skill: '', minScore: '', maxScore: '', rank: '' });
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    if (!authLoading) {
      if (!user) router.push('/auth');
      else if (user.role !== 'recruiter') router.push('/dashboard');
    }
  }, [user, authLoading, router]);

  const fetchCandidates = async (page = 1) => {
    setLoading(true);
    try {
      const params: Record<string, string> = { page: String(page) };
      if (filters.skill) params.skill = filters.skill;
      if (filters.minScore) params.minScore = filters.minScore;
      if (filters.maxScore) params.maxScore = filters.maxScore;
      if (filters.rank) params.rank = filters.rank;
      const res = await api.getCandidates(params);
      setCandidates(res.candidates);
      setPagination(res.pagination);
    } catch { router.push('/auth'); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    if (user?.role === 'recruiter') {
      fetchCandidates();
      api.getRecruiterStats().then(setStats).catch(() => {});
    }
  }, [user]);

  const handleSearch = (e: React.FormEvent) => { e.preventDefault(); fetchCandidates(1); };
  const clearFilters = () => { setFilters({ skill: '', minScore: '', maxScore: '', rank: '' }); fetchCandidates(1); };

  if (authLoading || (loading && !candidates.length)) return (
    <div className="min-h-screen bg-[#080808] flex items-center justify-center">
      <div className="flex flex-col items-center gap-3"><div className="spinner" /><p className="text-[#444] text-xs font-mono">LOADING TALENT POOL...</p></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#080808]">
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 md:px-16 pt-20 pb-16 relative z-content">

        {/* Header */}
        <div className="py-10 border-b border-[#161616] mb-8">
          <div className="text-[10px] font-mono text-[#E8FF00] uppercase tracking-widest mb-3">RECRUITER HUB</div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="font-display text-[52px] md:text-[72px] text-white leading-[0.9]">
                HIRE WITH<br />MATHEMATICAL<br />CERTAINTY.
              </h1>
            </div>
            {stats && (
              <div className="grid grid-cols-2 gap-px bg-[#161616] shrink-0">
                {stats.rankDistribution.filter((r: any) => r.count > 0).slice(0, 4).map((r: any) => {
                  const rd = RANKS.find((rk) => rk.name === r.rank);
                  return (
                    <div key={r.rank} className="bg-[#0f0f0f] px-5 py-3 text-center">
                      <div className="font-display text-2xl" style={{ color: rd?.color }}>{r.count}</div>
                      <div className="text-[9px] font-mono text-[#444] mt-0.5">{r.rank.toUpperCase()}</div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* LIVE SEARCH */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="bg-[#0f0f0f] border border-[#1e1e1e] p-1 flex gap-1">
            <div className="flex items-center gap-2 flex-1 px-3 py-2 border border-[#E8FF00]/10 bg-[#111]">
              <span className="text-[10px] font-mono text-[#444] whitespace-nowrap uppercase">LIVE SEARCH</span>
              <div className="w-px h-4 bg-[#222]" />
              <Search size={12} className="text-[#555] shrink-0" />
              <input
                value={filters.skill}
                onChange={e => setFilters({ ...filters, skill: e.target.value })}
                placeholder="Skill: TypeScript, React, Go..."
                className="flex-1 bg-transparent text-sm text-white placeholder-[#333] focus:outline-none font-mono"
              />
            </div>
            <button type="button" onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 border border-[#2a2a2a] text-[#555] hover:text-white text-xs font-mono transition-colors">
              <SlidersHorizontal size={12} /> FILTERS
            </button>
            <button type="submit" className="px-5 py-2 text-xs font-semibold font-mono rounded-sm" style={{ backgroundColor: '#E8FF00', color: '#000' }}>
              SEARCH
            </button>
          </div>

          {/* Advanced filters */}
          {showFilters && (
            <div className="bg-[#0f0f0f] border border-t-0 border-[#1e1e1e] p-4 flex flex-wrap gap-4 items-end">
              <div>
                <label className="block text-[10px] font-mono text-[#444] uppercase tracking-widest mb-1">Min Score</label>
                <input type="number" value={filters.minScore} onChange={e => setFilters({ ...filters, minScore: e.target.value })} placeholder="1000"
                  className="w-28 bg-[#111] border border-[#222] text-white text-xs px-3 py-2 focus:outline-none focus:border-[#E8FF00]/30 font-mono" />
              </div>
              <div>
                <label className="block text-[10px] font-mono text-[#444] uppercase tracking-widest mb-1">Max Score</label>
                <input type="number" value={filters.maxScore} onChange={e => setFilters({ ...filters, maxScore: e.target.value })} placeholder="3000"
                  className="w-28 bg-[#111] border border-[#222] text-white text-xs px-3 py-2 focus:outline-none focus:border-[#E8FF00]/30 font-mono" />
              </div>
              <div>
                <label className="block text-[10px] font-mono text-[#444] uppercase tracking-widest mb-1">Rank</label>
                <select value={filters.rank} onChange={e => setFilters({ ...filters, rank: e.target.value })}
                  className="bg-[#111] border border-[#222] text-white text-xs px-3 py-2 focus:outline-none focus:border-[#E8FF00]/30 font-mono">
                  <option value="">All Ranks</option>
                  {RANKS.map(r => <option key={r.name} value={r.name}>{r.name}</option>)}
                </select>
              </div>
              <button type="button" onClick={clearFilters} className="text-[10px] font-mono text-[#555] hover:text-white transition-colors py-2">CLEAR</button>
            </div>
          )}
        </form>

        {/* Results count */}
        <div className="flex items-center justify-between mb-5">
          <div className="text-[10px] font-mono text-[#444] uppercase">
            {pagination.total} CANDIDATE{pagination.total !== 1 ? 'S' : ''} FOUND
          </div>
          {loading && <div className="spinner" />}
        </div>

        {/* CANDIDATE GRID */}
        {candidates.length === 0 && !loading ? (
          <div className="text-center py-20 bg-[#0f0f0f] border border-dashed border-[#1e1e1e]">
            <Users size={32} className="text-[#2a2a2a] mx-auto mb-3" />
            <p className="text-[#444] text-xs font-mono">NO CANDIDATES MATCH YOUR FILTERS</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-px bg-[#161616]">
            {candidates.map((c) => {
              const ri = getRankInfo(c.rating.rank);
              const prog = getRankProgress(c.rating.score, c.rating.rank);
              return (
                <div key={c._id} className="bg-[#0f0f0f] p-5 hover:bg-[#111] transition-colors group">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 flex items-center justify-center text-sm font-display border border-[#2a2a2a]"
                        style={{ backgroundColor: `${ri.color}15`, color: ri.color }}>
                        {c.fullName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-white leading-tight">{c.fullName}</div>
                        <div className="text-[10px] text-[#444] font-mono mt-0.5 truncate max-w-[110px]">{c.email}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-display text-xl" style={{ color: ri.color }}>{c.rating.score.toLocaleString()}</div>
                      <div className="text-[10px] font-mono" style={{ color: ri.color }}>{c.rating.rank}</div>
                    </div>
                  </div>

                  {/* Progress */}
                  <div className="mb-4">
                    <div className="h-0.5 bg-[#1a1a1a] rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all" style={{ width: `${prog}%`, backgroundColor: ri.color }} />
                    </div>
                  </div>

                  {c.bio && <p className="text-[#555] text-[11px] mb-3 line-clamp-2 leading-relaxed">{c.bio}</p>}

                  {/* Skills */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {c.skills?.slice(0, 3).map((s: string) => (
                      <span key={s} className="text-[10px] px-1.5 py-0.5 border border-[#E8FF00]/20 bg-[#E8FF00]/5 text-[#E8FF00] font-mono">{s}</span>
                    ))}
                    {c.skills?.length > 3 && (
                      <span className="text-[10px] px-1.5 py-0.5 border border-[#2a2a2a] text-[#444] font-mono">+{c.skills.length - 3}</span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-3 border-t border-[#1a1a1a]">
                    <a href={`mailto:${c.email}`}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 text-[10px] font-semibold font-mono rounded-sm transition-all"
                      style={{ backgroundColor: '#E8FF00', color: '#000' }}>
                      <Mail size={10} /> REQUEST INTERVIEW
                    </a>
                    {c.github && (
                      <a href={c.github} target="_blank" rel="noreferrer"
                        className="px-3 py-2 border border-[#2a2a2a] text-[#555] hover:text-white hover:border-[#E8FF00]/20 transition-colors">
                        <Github size={12} />
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="flex items-center justify-center gap-4 mt-8">
            <button onClick={() => fetchCandidates(pagination.page - 1)} disabled={pagination.page === 1}
              className="p-2 border border-[#222] text-[#555] hover:text-white disabled:opacity-30 transition-colors">
              <ChevronLeft size={14} />
            </button>
            <span className="text-xs font-mono text-[#555]">PAGE {pagination.page} / {pagination.pages}</span>
            <button onClick={() => fetchCandidates(pagination.page + 1)} disabled={pagination.page === pagination.pages}
              className="p-2 border border-[#222] text-[#555] hover:text-white disabled:opacity-30 transition-colors">
              <ChevronRight size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function RecruiterPage() {
  return <AuthProvider><RecruiterInner /></AuthProvider>;
}
