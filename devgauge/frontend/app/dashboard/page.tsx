'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthProvider, useAuth } from '../../lib/auth';
import { api } from '../../lib/api';
import { getRankInfo, getRankProgress, RANKS } from '../../lib/ranks';
import Navbar from '../../components/Navbar';
import { Plus, X, Github, Loader2, FolderOpen, Award, Cpu, TrendingUp, CheckCircle, Trash2, ExternalLink, LayoutDashboard, Settings, FileCode, ChevronUp, ChevronDown } from 'lucide-react';

interface ProfileData { user: any; projects: any[]; ratingHistory: any[]; }

const MOCK_CHART = [340, 280, 420, 380, 500, 460, 540, 510, 620, 580, 700, 680];
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

function MiniBar({ val, max, color }: { val: number; max: number; color: string }) {
  const h = Math.max(8, (val / max) * 72);
  return <div className="w-5 rounded-t-sm transition-all" style={{ height: h, backgroundColor: color, opacity: 0.85 }} />;
}

function DashboardInner() {
  const { user, loading: authLoading, refreshUser } = useAuth();
  const router = useRouter();
  const [data, setData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', repoUrl: '', liveUrl: '' });
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [profile, setProfile] = useState({ bio: '', github: '', skills: '' });
  const [activeNav, setActiveNav] = useState('dashboard');

  useEffect(() => {
    if (!authLoading && !user) router.push('/auth');
  }, [user, authLoading, router]);

  const fetchData = async () => {
    try {
      const d = await api.getProfile();
      setData(d);
      setProfile({ bio: d.user.bio || '', github: d.user.github || '', skills: (d.user.skills || []).join(', ') });
    } catch { router.push('/auth'); }
    finally { setLoading(false); }
  };

  useEffect(() => { if (user) fetchData(); }, [user]);

  const handleSubmitProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await api.submitProject(form);
      setToast({ msg: `Project analyzed! +${res.project?.aiAnalysis?.scoreContribution || '—'} pts · ${res.updatedRating?.rank}`, ok: true });
      setForm({ title: '', description: '', repoUrl: '', liveUrl: '' });
      setShowForm(false);
      await fetchData(); await refreshUser();
    } catch (err: any) {
      setToast({ msg: err.message, ok: false });
    } finally { setSubmitting(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this project?')) return;
    await api.deleteProject(id); fetchData();
  };

  const handleSaveProfile = async () => {
    await api.updateProfile({ bio: profile.bio, github: profile.github, skills: profile.skills.split(',').map((s: string) => s.trim()).filter(Boolean) });
    setEditMode(false); fetchData(); refreshUser();
  };

  if (authLoading || loading) return (
    <div className="min-h-screen bg-[#080808] flex items-center justify-center">
      <div className="flex flex-col items-center gap-3"><div className="spinner" /><p className="text-[#444] text-xs font-mono">LOADING DASHBOARD...</p></div>
    </div>
  );

  if (!user || !data) return null;

  const rankInfo = getRankInfo(user.rating.rank);
  const progress = getRankProgress(user.rating.score, user.rating.rank);
  const nextRank = RANKS[RANKS.findIndex(r => r.name === user.rating.rank) + 1];
  const maxChart = Math.max(...MOCK_CHART);

  const NAV_ITEMS = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'projects',  label: 'Projects',  icon: FileCode },
    { id: 'settings',  label: 'Settings',  icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#080808] flex">
      {/* SIDEBAR */}
      <aside className="hidden lg:flex flex-col w-56 border-r border-[#161616] pt-16 pb-6 px-4 shrink-0">
        <div className="mt-4 space-y-1">
          {NAV_ITEMS.map(n => (
            <button key={n.id} onClick={() => setActiveNav(n.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 text-xs font-mono rounded-sm transition-all ${activeNav === n.id ? 'bg-[#E8FF00]/10 text-[#E8FF00] border border-[#E8FF00]/20' : 'text-[#555] hover:text-white hover:bg-[#111]'}`}>
              <n.icon size={13} /> {n.label.toUpperCase()}
            </button>
          ))}
        </div>
        <div className="mt-auto">
          <div className="px-3 py-3 border border-[#1a1a1a] bg-[#0f0f0f]">
            <div className="text-[10px] font-mono text-[#444] mb-1">DEVGAUGE SCORE</div>
            <div className="font-display text-3xl" style={{ color: rankInfo.color }}>{user.rating.score.toLocaleString()}</div>
            <div className="text-[10px] font-mono mt-0.5" style={{ color: rankInfo.color }}>{user.rating.rank}</div>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />

        <main className="flex-1 pt-16 px-6 md:px-8 pb-12 relative z-content">
          {/* Toast */}
          {toast && (
            <div className={`fixed top-16 right-6 z-50 flex items-center gap-3 px-4 py-3 border text-xs font-mono rounded-sm shadow-xl ${toast.ok ? 'bg-[#0f0f0f] border-[#E8FF00]/30 text-[#E8FF00]' : 'bg-[#0f0f0f] border-red-500/30 text-red-400'}`}>
              {toast.msg}
              <button onClick={() => setToast(null)}><X size={12} /></button>
            </div>
          )}

          {/* TOP ROW */}
          <div className="grid lg:grid-cols-3 gap-5 mt-6 mb-6">

            {/* Profile */}
            <div className="lg:col-span-2 bg-[#0f0f0f] border border-[#1a1a1a] p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 flex items-center justify-center text-xl font-display border border-[#2a2a2a]"
                    style={{ backgroundColor: `${rankInfo.color}15`, color: rankInfo.color }}>
                    {user.fullName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h1 className="font-display text-2xl text-white">{user.fullName}</h1>
                    <p className="text-[#444] text-xs font-mono mt-0.5">{user.email}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-[10px] px-2 py-0.5 font-mono border rounded-sm" style={{ color: rankInfo.color, borderColor: `${rankInfo.color}40`, backgroundColor: `${rankInfo.color}10` }}>
                        {user.rating.rank}
                      </span>
                      <span className="text-[10px] text-[#444] font-mono">{user.rating.score.toLocaleString()} pts</span>
                    </div>
                  </div>
                </div>
                <button onClick={() => setEditMode(!editMode)} className="text-[10px] px-3 py-1.5 border border-[#222] text-[#555] hover:text-white hover:border-[#E8FF00]/30 font-mono transition-colors rounded-sm">
                  {editMode ? 'CANCEL' : 'EDIT PROFILE'}
                </button>
              </div>

              {editMode ? (
                <div className="mt-5 space-y-3">
                  <textarea value={profile.bio} onChange={e => setProfile({ ...profile, bio: e.target.value })} rows={2}
                    className="w-full bg-[#111] border border-[#222] rounded-sm px-3 py-2 text-xs text-white focus:outline-none focus:border-[#E8FF00]/30 resize-none placeholder-[#333]"
                    placeholder="Bio..." />
                  <input value={profile.github} onChange={e => setProfile({ ...profile, github: e.target.value })}
                    className="w-full bg-[#111] border border-[#222] rounded-sm px-3 py-2 text-xs text-white focus:outline-none focus:border-[#E8FF00]/30 placeholder-[#333]"
                    placeholder="GitHub URL" />
                  <input value={profile.skills} onChange={e => setProfile({ ...profile, skills: e.target.value })}
                    className="w-full bg-[#111] border border-[#222] rounded-sm px-3 py-2 text-xs text-white focus:outline-none focus:border-[#E8FF00]/30 placeholder-[#333]"
                    placeholder="Skills (comma separated)" />
                  <button onClick={handleSaveProfile} className="px-5 py-2 text-xs font-semibold font-mono rounded-sm" style={{ backgroundColor: '#E8FF00', color: '#000' }}>SAVE</button>
                </div>
              ) : (
                <div className="mt-4 space-y-3">
                  {user.bio && <p className="text-[#555] text-xs leading-relaxed">{user.bio}</p>}
                  {user.github && <a href={user.github} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-[#E8FF00] text-xs hover:underline"><Github size={12} /> {user.github}</a>}
                  {user.skills?.length > 0 && (
                    <div>
                      <div className="text-[10px] font-mono text-[#444] mb-2 uppercase tracking-widest">Verified Tech Stack</div>
                      <div className="flex flex-wrap gap-1.5">
                        {user.skills.map((s: string) => (
                          <span key={s} className="text-[10px] px-2 py-0.5 border border-[#E8FF00]/20 bg-[#E8FF00]/5 text-[#E8FF00] font-mono rounded-sm">{s}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Performance Velocity Chart */}
            <div className="bg-[#0f0f0f] border border-[#1a1a1a] p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-[10px] font-mono text-[#444] uppercase tracking-widest mb-1">Performance Velocity</div>
                  <div className="font-display text-3xl text-white">{user.rating.score.toLocaleString()}</div>
                </div>
                <div className="flex items-center gap-1 text-[#E8FF00] text-xs font-mono">
                  <TrendingUp size={12} /> +12%
                </div>
              </div>

              {/* Bar chart */}
              <div className="flex items-end gap-1 h-20 mb-2">
                {MOCK_CHART.map((v, i) => (
                  <MiniBar key={i} val={v} max={maxChart} color={i === MOCK_CHART.length - 1 ? '#E8FF00' : '#2a2a2a'} />
                ))}
              </div>
              <div className="flex justify-between text-[9px] font-mono text-[#333]">
                <span>{MONTHS[0]}</span><span>{MONTHS[5]}</span><span>{MONTHS[11]}</span>
              </div>

              {/* Rank progress */}
              <div className="mt-4 pt-4 border-t border-[#1a1a1a]">
                <div className="flex justify-between text-[10px] font-mono text-[#444] mb-1.5">
                  <span>{user.rating.rank}</span>
                  <span>{nextRank ? nextRank.name : 'MAX'}</span>
                </div>
                <div className="h-1 bg-[#1a1a1a] rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${progress}%`, backgroundColor: rankInfo.color }} />
                </div>
                <div className="text-[10px] font-mono text-[#444] mt-1">{progress}% to next rank</div>
              </div>
            </div>
          </div>

          {/* PROJECTS */}
          <div>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <h2 className="font-display text-2xl text-white">RECENT EVALUATIONS</h2>
                <span className="text-[10px] font-mono text-[#444] border border-[#222] px-2 py-0.5 rounded-sm">{data.projects.length}</span>
              </div>
              <button onClick={() => setShowForm(!showForm)}
                className="flex items-center gap-2 px-4 py-2 text-xs font-semibold font-mono rounded-sm transition-all"
                style={{ backgroundColor: showForm ? '#1a1a1a' : '#E8FF00', color: showForm ? '#888' : '#000', border: showForm ? '1px solid #2a2a2a' : 'none' }}>
                {showForm ? <><X size={12} /> CANCEL</> : <><Plus size={12} /> SUBMIT PROJECT</>}
              </button>
            </div>

            {/* Submit form */}
            {showForm && (
              <div className="mb-6 bg-[#0f0f0f] border border-[#E8FF00]/20 p-6 rounded-sm">
                <div className="flex items-center gap-2 mb-5">
                  <Cpu size={13} className="text-[#E8FF00]" />
                  <span className="text-xs font-mono text-[#E8FF00] uppercase tracking-widest">Submit New Project</span>
                </div>
                <form onSubmit={handleSubmitProject} className="space-y-3">
                  <div className="grid md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-mono text-[#444] uppercase tracking-widest mb-1">Project Title *</label>
                      <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required placeholder="My Awesome Project"
                        className="w-full bg-[#111] border border-[#222] rounded-sm px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#E8FF00]/30 placeholder-[#333]" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono text-[#444] uppercase tracking-widest mb-1">GitHub URL</label>
                      <input value={form.repoUrl} onChange={e => setForm({ ...form, repoUrl: e.target.value })} placeholder="https://github.com/user/repo"
                        className="w-full bg-[#111] border border-[#222] rounded-sm px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#E8FF00]/30 placeholder-[#333]" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-[#444] uppercase tracking-widest mb-1">Description * <span className="text-[#E8FF00]">(AI extracts skills from this)</span></label>
                    <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} required rows={3}
                      placeholder="Describe what you built, tech used (React, Node.js, PostgreSQL, Docker...), and challenges solved..."
                      className="w-full bg-[#111] border border-[#222] rounded-sm px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#E8FF00]/30 placeholder-[#333] resize-none" />
                  </div>
                  <button type="submit" disabled={submitting}
                    className="flex items-center gap-2 px-6 py-2.5 text-xs font-semibold font-mono disabled:opacity-50 rounded-sm"
                    style={{ backgroundColor: '#E8FF00', color: '#000' }}>
                    {submitting ? <><Loader2 size={12} className="animate-spin" /> ANALYZING...</> : 'VALIDATE & SUBMIT'}
                  </button>
                </form>
              </div>
            )}

            {/* Project list */}
            {data.projects.length === 0 ? (
              <div className="text-center py-16 bg-[#0f0f0f] border border-dashed border-[#1e1e1e]">
                <FolderOpen size={32} className="text-[#2a2a2a] mx-auto mb-3" />
                <p className="text-[#444] text-xs font-mono">NO PROJECTS YET — SUBMIT ONE TO GET EVALUATED</p>
              </div>
            ) : (
              <div className="space-y-px">
                {data.projects.map((p) => (
                  <div key={p._id} className="group flex items-center justify-between bg-[#0f0f0f] border border-[#1a1a1a] hover:border-[#E8FF00]/15 px-5 py-4 transition-all">
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="w-8 h-8 shrink-0 border border-[#2a2a2a] flex items-center justify-center">
                        <FileCode size={13} className="text-[#E8FF00]" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-sm font-medium text-white truncate">{p.title}</span>
                          <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-sm shrink-0 ${p.aiAnalysis?.complexity === 'High' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : p.aiAnalysis?.complexity === 'Medium' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' : 'bg-green-500/10 text-green-400 border border-green-500/20'}`}>
                            {p.aiAnalysis?.complexity || 'N/A'}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {p.skills?.slice(0, 4).map((s: string) => (
                            <span key={s} className="text-[10px] font-mono text-[#555]">{s}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 shrink-0 ml-4">
                      <div className="text-right hidden sm:block">
                        <div className="text-xs font-mono" style={{ color: '#E8FF00' }}>+{p.aiAnalysis?.scoreContribution || 0} pts</div>
                        <div className="text-[10px] text-[#444] font-mono">{new Date(p.createdAt).toLocaleDateString()}</div>
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {p.repoUrl && <a href={p.repoUrl} target="_blank" rel="noreferrer" className="p-1.5 text-[#444] hover:text-white"><Github size={13} /></a>}
                        {p.liveUrl && <a href={p.liveUrl} target="_blank" rel="noreferrer" className="p-1.5 text-[#444] hover:text-white"><ExternalLink size={13} /></a>}
                        <button onClick={() => handleDelete(p._id)} className="p-1.5 text-[#444] hover:text-red-400"><Trash2 size={13} /></button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return <AuthProvider><DashboardInner /></AuthProvider>;
}
