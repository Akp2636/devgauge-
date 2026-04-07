'use client';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import { AuthProvider } from '../lib/auth';
import { ArrowRight, Zap, ChevronRight, FlaskConical, Star, Users, BarChart3, Code2, Shield, Cpu } from 'lucide-react';

const STEPS = [
  { icon: FlaskConical, label: 'Take Test', desc: 'Complete high-fidelity simulation challenges designed to test real problem-solving, not memorization.' },
  { icon: Star,         label: 'Get Rated',  desc: 'AI evaluates your code quality, performance optimization, and architectural decisions to assign a DevGauge rating.' },
  { icon: Users,        label: 'Get Hired',  desc: 'Recruiters discover you based on verified proof-of-skill, not keywords on a resume.' },
];

const FEATURES = [
  { icon: Cpu,    title: 'AI Skill Evaluation', desc: 'Deep-dive into relevant content, recognizing patterns and categorizing skill automatically.' },
  { icon: BarChart3, title: 'Live Rating System', desc: 'Performance updates in real-time. Developers compete for rank slots that recruiters actually trust.' },
  { icon: Users,  title: 'Recruiter Dashboard', desc: 'Powerful filtering by specific tech stacks, skills, and code performance to find perfect hires fast.' },
];

export default function Home() {
  return (
    <AuthProvider>
      <Navbar />
      <main className="relative min-h-screen z-content">

        {/* HERO */}
        <section className="relative min-h-screen flex items-center px-6 md:px-16 pt-20 pb-16 overflow-hidden">
          {/* Amber glow blob */}
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#E8FF00] opacity-[0.03] rounded-full blur-[120px] pointer-events-none" />

          <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-12 items-center">
            {/* Left */}
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-[#E8FF00]/10 border border-[#E8FF00]/20 text-[#E8FF00] text-xs font-mono mb-8 animate-fade-up">
                <Zap size={10} />
                CODEFORCES FOR TECH RECRUITMENT
              </div>

              <h1 className="font-display text-[72px] md:text-[96px] leading-[0.9] text-white mb-6 animate-fade-up animate-delay-100">
                STOP HIRING<br />
                RESUMES.<br />
                START HIRING{' '}
                <span style={{ color: '#E8FF00' }}>SKILL.</span>
              </h1>

              <p className="text-[#888] text-base leading-relaxed max-w-md mb-10 animate-fade-up animate-delay-200">
                DevGauge replaces the guesswork of technical recruiting with objective, live performance data. Validate engineering talent through real-time execution, not past titles.
              </p>

              <div className="flex flex-wrap gap-4 animate-fade-up animate-delay-300">
                <Link
                  href="/auth?tab=signup"
                  className="group inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold rounded-sm transition-all"
                  style={{ backgroundColor: '#E8FF00', color: '#000' }}
                >
                  Get Started
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/auth?tab=signup&role=recruiter"
                  className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold rounded-sm border border-[#333] text-[#ccc] hover:border-[#E8FF00]/40 hover:text-white transition-all"
                >
                  Explore Talent
                </Link>
              </div>
            </div>

            {/* Right — mock score card */}
            <div className="hidden lg:flex justify-end animate-fade-up animate-delay-300">
              <div className="w-[340px] bg-[#0f0f0f] border border-[#222] rounded-sm p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-[#1a1a1a] pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-[#E8FF00]/10 border border-[#E8FF00]/20 flex items-center justify-center text-xs font-bold text-[#E8FF00]">A</div>
                    <div>
                      <div className="text-xs font-semibold text-white">Alex Rivera</div>
                      <div className="text-[10px] text-[#555] font-mono">CANDIDATE MASTER</div>
                    </div>
                  </div>
                  <div className="text-xl font-display text-[#E8FF00]">2100</div>
                </div>
                {[
                  { skill: 'React & Next.js', pct: 92, label: 'Top 5%' },
                  { skill: 'System Design', pct: 78, label: 'Top 15%' },
                  { skill: 'TypeScript', pct: 88, label: 'Top 8%' },
                ].map((item) => (
                  <div key={item.skill}>
                    <div className="flex justify-between text-[11px] text-[#666] mb-1.5">
                      <span>{item.skill}</span>
                      <span className="text-[#E8FF00] font-mono">{item.label}</span>
                    </div>
                    <div className="h-1 bg-[#1a1a1a] rounded-full overflow-hidden">
                      <div className="h-full bg-[#E8FF00] rounded-full" style={{ width: `${item.pct}%` }} />
                    </div>
                  </div>
                ))}
                <div className="pt-2 flex gap-2">
                  <span className="text-[10px] px-2 py-1 bg-[#1a1a1a] border border-[#2a2a2a] rounded-sm text-[#E8FF00] font-mono">Verified ✓</span>
                  <span className="text-[10px] px-2 py-1 bg-[#1a1a1a] border border-[#2a2a2a] rounded-sm text-[#888] font-mono">React</span>
                  <span className="text-[10px] px-2 py-1 bg-[#1a1a1a] border border-[#2a2a2a] rounded-sm text-[#888] font-mono">Node.js</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* THE PIPELINE */}
        <section className="py-24 px-6 md:px-16 border-t border-[#161616]">
          <div className="max-w-7xl mx-auto">
            <h2 className="font-display text-[48px] md:text-[64px] text-white mb-16">
              THE TALENT PIPELINE,<br />REIMAGINED.
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {STEPS.map((s, i) => (
                <div key={s.label} className="bg-[#0f0f0f] border border-[#1e1e1e] p-6 hover:border-[#E8FF00]/20 transition-all group">
                  <div className="w-9 h-9 border border-[#2a2a2a] flex items-center justify-center mb-5 group-hover:border-[#E8FF00]/30 transition-colors">
                    <s.icon size={16} className="text-[#E8FF00]" />
                  </div>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-[10px] font-mono text-[#444]">0{i + 1}</span>
                    <h3 className="font-display text-2xl text-white">{s.label}</h3>
                  </div>
                  <p className="text-[#555] text-sm leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section className="py-24 px-6 md:px-16">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-start">
            <div>
              <span className="text-[10px] font-mono text-[#E8FF00] uppercase tracking-[0.2em] block mb-4">Platform Capabilities</span>
              <h2 className="font-display text-[48px] md:text-[60px] text-white mb-6 leading-[0.95]">
                BUILT FOR<br />PRECISION HIRING.
              </h2>
              <p className="text-[#555] text-sm leading-relaxed max-w-sm">
                Every feature is designed around one goal: removing subjective bias from technical hiring.
              </p>
            </div>
            <div className="space-y-px">
              {FEATURES.map((f) => (
                <div key={f.title} className="group flex gap-5 p-5 bg-[#0f0f0f] border border-[#1a1a1a] hover:border-[#E8FF00]/20 transition-all cursor-default">
                  <div className="w-8 h-8 shrink-0 border border-[#2a2a2a] flex items-center justify-center group-hover:border-[#E8FF00]/30 transition-colors mt-0.5">
                    <f.icon size={14} className="text-[#E8FF00]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-sm mb-1">{f.title}</h3>
                    <p className="text-[#555] text-xs leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 px-6 md:px-16 border-t border-[#161616]">
          <div className="max-w-7xl mx-auto bg-[#0f0f0f] border border-[#222] p-16 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[#E8FF00] opacity-[0.02]" />
            <div className="relative z-10">
              <h2 className="font-display text-[48px] md:text-[72px] text-white mb-4">
                READY TO REBUILD<br />YOUR TECH STACK?
              </h2>
              <p className="text-[#555] text-sm mb-10 max-w-md mx-auto">
                Join 1,000+ top-tier engineering teams who have optimized their hiring cycle by 40% using DevGauge verified credentials.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link
                  href="/auth?tab=signup&role=recruiter"
                  className="inline-flex items-center gap-2 px-7 py-3 text-sm font-semibold rounded-sm transition-all"
                  style={{ backgroundColor: '#E8FF00', color: '#000' }}
                >
                  Hire with DevGauge
                </Link>
                <Link
                  href="/auth?tab=signup"
                  className="inline-flex items-center gap-2 px-7 py-3 text-sm border border-[#333] text-[#888] hover:border-[#E8FF00]/30 hover:text-white rounded-sm transition-all"
                >
                  I'm a Developer <ChevronRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="border-t border-[#161616] py-12 px-6 md:px-16">
          <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-10">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 bg-[#E8FF00] flex items-center justify-center">
                  <Code2 size={12} className="text-black" />
                </div>
                <span className="font-display text-lg text-white">DevGauge</span>
              </div>
              <p className="text-[#444] text-xs leading-relaxed">
                The official benchmarking platform for high-performance engineering teams and elite developers.
              </p>
            </div>
            {[
              { title: 'Product', links: ['Features', 'Enterprise', 'Solutions', 'Pricing'] },
              { title: 'Company', links: ['About Us', 'Careers', 'Blog', 'Press'] },
            ].map((col) => (
              <div key={col.title}>
                <h4 className="text-[10px] font-mono text-[#444] uppercase tracking-widest mb-4">{col.title}</h4>
                <ul className="space-y-2">
                  {col.links.map((l) => (
                    <li key={l}><a href="#" className="text-[#666] hover:text-white text-xs transition-colors">{l}</a></li>
                  ))}
                </ul>
              </div>
            ))}
            <div>
              <h4 className="text-[10px] font-mono text-[#444] uppercase tracking-widest mb-4">Newsletter</h4>
              <p className="text-[#555] text-xs mb-3">Get technical hiring insights delivered weekly.</p>
              <div className="flex">
                <input className="flex-1 bg-[#161616] border border-[#2a2a2a] border-r-0 px-3 py-2 text-xs text-white placeholder-[#444] focus:outline-none focus:border-[#E8FF00]/30 rounded-l-sm" placeholder="you@company.com" />
                <button className="px-3 py-2 text-xs font-semibold rounded-r-sm" style={{ backgroundColor: '#E8FF00', color: '#000' }}>→</button>
              </div>
            </div>
          </div>
          <div className="max-w-7xl mx-auto mt-12 pt-6 border-t border-[#111] flex justify-between items-center">
            <p className="text-[#333] text-xs font-mono">© 2024 DevGauge. All rights reserved.</p>
            <p className="text-[#333] text-xs font-mono">Built for engineers, by engineers.</p>
          </div>
        </footer>
      </main>
    </AuthProvider>
  );
}
