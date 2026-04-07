'use client';
import { useEffect, useState } from 'react';
import { AuthProvider } from '../../lib/auth';
import { api } from '../../lib/api';
import { getRankInfo } from '../../lib/ranks';
import Navbar from '../../components/Navbar';
import { Trophy, TrendingUp, Github, Medal } from 'lucide-react';

const MEDAL_COLORS = ['#E8FF00', '#9ca3af', '#92400e'];

function LeaderboardInner() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getLeaderboard()
      .then(d => setUsers(d.users))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#080808' }}>
      <div className="flex flex-col items-center gap-3">
        <div className="spinner" />
        <p style={{ color: '#444', fontSize: '12px', fontFamily: 'monospace' }}>LOADING RANKINGS...</p>
      </div>
    </div>
  );

  const top3 = users.slice(0, 3);
  const rest = users.slice(3);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#080808' }}>
      <Navbar />
      <div className="z-content relative" style={{ maxWidth: '900px', margin: '0 auto', padding: '80px 24px 64px' }}>

        {/* Header */}
        <div style={{ paddingTop: '40px', paddingBottom: '40px', borderBottom: '1px solid #161616', marginBottom: '40px' }}>
          <div style={{ fontSize: '10px', fontFamily: 'monospace', color: '#E8FF00', letterSpacing: '0.2em', marginBottom: '12px' }}>
            GLOBAL RANKINGS
          </div>
          <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(48px, 8vw, 80px)', color: '#fff', lineHeight: 0.9, marginBottom: '16px' }}>
            THE GRANDMASTER<br />LEADERBOARD.
          </h1>
          <p style={{ color: '#555', fontSize: '13px', maxWidth: '420px' }}>
            Ranked by verified DevGauge score. Every point earned through real code, real projects, real proof of skill.
          </p>
        </div>

        {/* Top 3 Podium */}
        {top3.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2px', marginBottom: '2px', backgroundColor: '#161616' }}>
            {[top3[1], top3[0], top3[2]].map((u, visualIdx) => {
              if (!u) return <div key={visualIdx} style={{ backgroundColor: '#0f0f0f' }} />;
              const rank = top3.indexOf(u);
              const info = getRankInfo(u.rating.rank);
              const isFirst = rank === 0;
              return (
                <div key={u._id} style={{
                  backgroundColor: '#0f0f0f',
                  padding: '24px 20px',
                  textAlign: 'center',
                  borderBottom: isFirst ? `2px solid #E8FF00` : `2px solid ${info.color}`,
                  position: 'relative',
                }}>
                  {isFirst && (
                    <div style={{ position: 'absolute', top: '12px', right: '12px' }}>
                      <Trophy size={14} style={{ color: '#E8FF00' }} />
                    </div>
                  )}
                  <div style={{ fontSize: '28px', fontFamily: "'Bebas Neue', sans-serif", color: MEDAL_COLORS[rank], marginBottom: '8px', lineHeight: 1 }}>
                    #{rank + 1}
                  </div>
                  <div style={{ width: 48, height: 48, margin: '0 auto 12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontFamily: "'Bebas Neue', sans-serif", border: '1px solid #2a2a2a', backgroundColor: `${info.color}15`, color: info.color }}>
                    {u.fullName.charAt(0).toUpperCase()}
                  </div>
                  <div style={{ color: '#fff', fontWeight: 600, fontSize: '14px', marginBottom: '4px' }}>{u.fullName}</div>
                  <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '28px', color: info.color, lineHeight: 1 }}>
                    {u.rating.score.toLocaleString()}
                  </div>
                  <div style={{ fontSize: '9px', fontFamily: 'monospace', color: info.color, marginTop: '2px', letterSpacing: '0.05em' }}>
                    {u.rating.rank.toUpperCase()}
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px', justifyContent: 'center', marginTop: '10px' }}>
                    {u.skills?.slice(0, 2).map((s: string) => (
                      <span key={s} style={{ fontSize: '9px', fontFamily: 'monospace', padding: '1px 5px', color: '#E8FF00', backgroundColor: 'rgba(232,255,0,0.05)', border: '1px solid rgba(232,255,0,0.15)' }}>
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Rest of leaderboard */}
        {rest.length > 0 && (
          <div style={{ backgroundColor: '#161616', display: 'flex', flexDirection: 'column', gap: '1px' }}>
            {rest.map((u, i) => {
              const info = getRankInfo(u.rating.rank);
              const position = i + 4;
              return (
                <div key={u._id}
                  style={{ backgroundColor: '#0f0f0f', display: 'flex', alignItems: 'center', padding: '14px 20px', gap: '16px', transition: 'background-color 0.15s', cursor: 'default' }}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#111')}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#0f0f0f')}
                >
                  <div style={{ width: '32px', fontFamily: 'monospace', fontSize: '12px', color: '#444', flexShrink: 0, textAlign: 'right' }}>
                    #{position}
                  </div>

                  <div style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Bebas Neue', sans-serif", fontSize: '14px', border: '1px solid #2a2a2a', backgroundColor: `${info.color}10`, color: info.color, flexShrink: 0 }}>
                    {u.fullName.charAt(0).toUpperCase()}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ color: '#e5e5e5', fontSize: '13px', fontWeight: 500 }}>{u.fullName}</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '4px' }}>
                      {u.skills?.slice(0, 3).map((s: string) => (
                        <span key={s} style={{ fontSize: '9px', fontFamily: 'monospace', color: '#555' }}>{s}</span>
                      ))}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '10px', fontFamily: 'monospace', padding: '2px 6px', color: info.color, border: `1px solid ${info.color}30`, backgroundColor: `${info.color}10` }}>
                      {u.rating.rank}
                    </span>
                    <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '22px', color: info.color, minWidth: '60px', textAlign: 'right' }}>
                      {u.rating.score.toLocaleString()}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {users.length === 0 && (
          <div style={{ textAlign: 'center', padding: '80px 0', backgroundColor: '#0f0f0f', border: '1px dashed #1e1e1e' }}>
            <Medal size={36} style={{ color: '#2a2a2a', margin: '0 auto 12px' }} />
            <p style={{ color: '#444', fontSize: '12px', fontFamily: 'monospace' }}>NO RANKED CANDIDATES YET</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function LeaderboardPage() {
  return <AuthProvider><LeaderboardInner /></AuthProvider>;
}
