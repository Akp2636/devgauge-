'use client';
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../lib/auth';
import { AuthProvider } from '../../lib/auth';
import { Code2, Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react';

function AuthForm() {
  const router = useRouter();
  const params = useSearchParams();
  const { login, register, user } = useAuth();

  const [tab, setTab] = useState<'login' | 'signup'>(params.get('tab') === 'login' ? 'login' : 'signup');
  const [role, setRole] = useState<'candidate' | 'recruiter'>(params.get('role') === 'recruiter' ? 'recruiter' : 'candidate');
  const [form, setForm] = useState({ fullName: '', email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) router.push(user.role === 'recruiter' ? '/recruiter' : '/dashboard');
  }, [user, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (tab === 'login') await login(form.email, form.password);
      else await register({ ...form, role });
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080808] flex relative overflow-hidden">
      {/* Dot grid is from body::before */}

      {/* Left panel — decorative */}
      <div className="hidden lg:flex flex-col justify-between w-[45%] border-r border-[#181818] p-12 relative">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 bg-[#E8FF00] flex items-center justify-center">
            <Code2 size={13} className="text-black" />
          </div>
          <span className="font-display text-xl text-white">DevGauge</span>
        </Link>

        {/* Big background text */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
          <div className="font-display text-[180px] text-[#0f0f0f] leading-none tracking-tighter">
            AUTH<br />
            <span style={{ color: '#111' }}>0029</span>
          </div>
        </div>

        <div className="relative z-10">
          <blockquote className="text-[#333] text-sm leading-relaxed italic border-l-2 border-[#E8FF00]/30 pl-4">
            "DevGauge changed how we hire. We found our best engineer in 48 hours — someone we would have filtered out with a traditional resume screen."
          </blockquote>
          <div className="mt-4 text-[#444] text-xs font-mono">— CTO, Series B Startup</div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 relative z-10">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="lg:hidden mb-8 flex items-center gap-2">
            <div className="w-7 h-7 bg-[#E8FF00] flex items-center justify-center">
              <Code2 size={13} className="text-black" />
            </div>
            <span className="font-display text-xl text-white">DevGauge</span>
          </div>

          <h2 className="font-display text-4xl text-white mb-1">
            {tab === 'signup' ? 'CREATE ACCOUNT' : 'WELCOME BACK'}
          </h2>
          <p className="text-[#555] text-sm mb-8">
            {tab === 'signup' ? 'Showcase your skills to top companies' : 'Sign in to your DevGauge account'}
          </p>

          {/* Tab toggle */}
          <div className="flex border border-[#222] mb-7 rounded-sm overflow-hidden">
            {(['signup', 'login'] as const).map((t) => (
              <button
                key={t}
                onClick={() => { setTab(t); setError(''); }}
                className={`flex-1 py-2.5 text-xs font-semibold font-mono uppercase tracking-wider transition-all ${
                  tab === t ? 'text-black' : 'text-[#555] hover:text-white'
                }`}
                style={tab === t ? { backgroundColor: '#E8FF00' } : {}}
              >
                {t === 'signup' ? 'Candidate' : 'Sign In'}
              </button>
            ))}
          </div>

          {/* Role toggle for signup */}
          {tab === 'signup' && (
            <div className="mb-6">
              <div className="flex border border-[#1e1e1e] rounded-sm overflow-hidden">
                {(['candidate', 'recruiter'] as const).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={`flex-1 py-2 text-xs font-mono transition-all capitalize ${
                      role === r ? 'bg-[#1a1a1a] text-white border-b-2 border-[#E8FF00]' : 'text-[#555] hover:text-[#888]'
                    }`}
                  >
                    {r === 'recruiter' ? 'HR / Recruiter' : 'Candidate'}
                  </button>
                ))}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {tab === 'signup' && (
              <div>
                <label className="block text-[10px] font-mono text-[#555] uppercase tracking-widest mb-1.5">Full Name</label>
                <input
                  name="fullName"
                  type="text"
                  placeholder="Alex Johnson"
                  value={form.fullName}
                  onChange={handleChange}
                  required
                  className="w-full bg-[#0f0f0f] border border-[#222] text-white text-sm px-4 py-3 focus:outline-none focus:border-[#E8FF00]/40 transition-colors placeholder-[#333] rounded-sm"
                />
              </div>
            )}
            <div>
              <label className="block text-[10px] font-mono text-[#555] uppercase tracking-widest mb-1.5">Email</label>
              <input
                name="email"
                type="email"
                placeholder="you@company.com"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full bg-[#0f0f0f] border border-[#222] text-white text-sm px-4 py-3 focus:outline-none focus:border-[#E8FF00]/40 transition-colors placeholder-[#333] rounded-sm"
              />
            </div>
            <div>
              <label className="block text-[10px] font-mono text-[#555] uppercase tracking-widest mb-1.5">Password</label>
              <div className="relative">
                <input
                  name="password"
                  type={showPass ? 'text' : 'password'}
                  placeholder="Min 8 characters"
                  value={form.password}
                  onChange={handleChange}
                  required
                  minLength={8}
                  className="w-full bg-[#0f0f0f] border border-[#222] text-white text-sm px-4 py-3 pr-11 focus:outline-none focus:border-[#E8FF00]/40 transition-colors placeholder-[#333] rounded-sm"
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#444] hover:text-[#888] transition-colors">
                  {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-mono rounded-sm">
                <AlertCircle size={13} /> {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all rounded-sm mt-2"
              style={{ backgroundColor: '#E8FF00', color: '#000' }}
            >
              {loading
                ? <><Loader2 size={14} className="animate-spin" /> Processing...</>
                : tab === 'signup'
                ? `Create ${role === 'recruiter' ? 'Recruiter' : 'Candidate'} Account`
                : 'AUTHENTICATE'}
            </button>
          </form>

          <p className="text-center text-[#444] text-xs mt-6">
            {tab === 'signup' ? 'Already a member? ' : "Don't have an account? "}
            <button onClick={() => setTab(tab === 'signup' ? 'login' : 'signup')} className="text-[#E8FF00] hover:underline">
              {tab === 'signup' ? 'Sign In' : 'Sign Up'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <AuthProvider>
      <Suspense>
        <AuthForm />
      </Suspense>
    </AuthProvider>
  );
}
