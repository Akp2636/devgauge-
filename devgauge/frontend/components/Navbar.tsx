'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '../lib/auth';
import { getRankInfo } from '../lib/ranks';
import { Code2, Menu, X, LogOut, LayoutDashboard, Users, Trophy } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = () => { logout(); router.push('/'); };
  const rankInfo = user ? getRankInfo(user.rating.rank) : null;

  const navLink = (href: string, label: string, active: boolean) => (
    <Link href={href}
      style={{ fontSize: '13px', color: active ? '#fff' : '#666', textDecoration: 'none', transition: 'color 0.15s' }}
      onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
      onMouseLeave={e => (e.currentTarget.style.color = active ? '#fff' : '#666')}
    >
      {label}
    </Link>
  );

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
      transition: 'all 0.3s',
      backgroundColor: scrolled ? 'rgba(8,8,8,0.95)' : 'transparent',
      backdropFilter: scrolled ? 'blur(8px)' : 'none',
      borderBottom: scrolled ? '1px solid #1a1a1a' : '1px solid transparent',
    }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '56px' }}>

        {/* Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
          <div style={{ width: 26, height: 26, backgroundColor: '#E8FF00', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Code2 size={13} style={{ color: '#000' }} />
          </div>
          <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '20px', color: '#fff', letterSpacing: '0.05em' }}>DevGauge</span>
        </Link>

        {/* Desktop center nav */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }} className="hidden md:flex">
          {navLink('/leaderboard', 'Leaderboard', pathname === '/leaderboard')}
          {!user && navLink('/#features', 'Features', false)}
          {user && navLink('/dashboard', 'Dashboard', pathname === '/dashboard')}
          {user?.role === 'recruiter' && navLink('/recruiter', 'Hire Talent', pathname === '/recruiter')}
        </div>

        {/* Desktop right */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }} className="hidden md:flex">
          {!user ? (
            <>
              <Link href="/auth?tab=login" style={{ fontSize: '13px', color: '#666', textDecoration: 'none', transition: 'color 0.15s' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                onMouseLeave={e => (e.currentTarget.style.color = '#666')}>
                Sign In
              </Link>
              <Link href="/auth?tab=signup" style={{ padding: '8px 16px', backgroundColor: '#E8FF00', color: '#000', fontSize: '12px', fontWeight: 700, fontFamily: 'monospace', textDecoration: 'none', borderRadius: '2px', transition: 'background-color 0.15s' }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#d4e800')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#E8FF00')}>
                GET STARTED
              </Link>
            </>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 12px', border: '1px solid #222', backgroundColor: '#0f0f0f' }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: rankInfo?.color }} />
                <span style={{ fontSize: '11px', fontFamily: 'monospace', color: rankInfo?.color }}>{user.rating.rank}</span>
                <span style={{ fontSize: '11px', fontFamily: 'monospace', color: '#444' }}>·</span>
                <span style={{ fontSize: '11px', fontFamily: 'monospace', color: '#888' }}>{user.rating.score.toLocaleString()}</span>
              </div>
              <button onClick={handleLogout} title="Logout"
                style={{ padding: '6px', color: '#555', background: 'none', border: 'none', cursor: 'pointer', transition: 'color 0.15s' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#f87171')}
                onMouseLeave={e => (e.currentTarget.style.color = '#555')}>
                <LogOut size={15} />
              </button>
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <button className="md:hidden" onClick={() => setOpen(!open)}
          style={{ padding: '6px', color: '#666', background: 'none', border: 'none', cursor: 'pointer' }}>
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden" style={{ backgroundColor: '#080808', borderTop: '1px solid #1a1a1a', padding: '16px 24px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <Link href="/leaderboard" style={{ color: '#888', fontSize: '13px', textDecoration: 'none' }} onClick={() => setOpen(false)}>Leaderboard</Link>
            {!user ? (
              <>
                <Link href="/auth?tab=login" style={{ color: '#888', fontSize: '13px', textDecoration: 'none' }} onClick={() => setOpen(false)}>Sign In</Link>
                <Link href="/auth?tab=signup" style={{ padding: '10px', backgroundColor: '#E8FF00', color: '#000', fontSize: '12px', fontWeight: 700, fontFamily: 'monospace', textDecoration: 'none', textAlign: 'center' }} onClick={() => setOpen(false)}>GET STARTED</Link>
              </>
            ) : (
              <>
                <Link href="/dashboard" style={{ color: '#888', fontSize: '13px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }} onClick={() => setOpen(false)}>
                  <LayoutDashboard size={14} /> Dashboard
                </Link>
                {user.role === 'recruiter' && (
                  <Link href="/recruiter" style={{ color: '#888', fontSize: '13px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }} onClick={() => setOpen(false)}>
                    <Users size={14} /> Hire Talent
                  </Link>
                )}
                <button onClick={handleLogout} style={{ color: '#f87171', fontSize: '13px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <LogOut size={14} /> Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
