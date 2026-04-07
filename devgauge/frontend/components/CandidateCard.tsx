import { getRankInfo, getRankProgress } from '../lib/ranks';
import { Github, Mail } from 'lucide-react';

interface Candidate {
  _id: string;
  fullName: string;
  email: string;
  rating: { score: number; rank: string };
  skills: string[];
  bio: string;
  github: string;
}

export default function CandidateCard({ candidate }: { candidate: Candidate }) {
  const info = getRankInfo(candidate.rating.rank);
  const progress = getRankProgress(candidate.rating.score, candidate.rating.rank);

  return (
    <div
      style={{ backgroundColor: '#0f0f0f', border: '1px solid #1a1a1a', padding: '20px', transition: 'border-color 0.2s' }}
      onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(232,255,0,0.15)')}
      onMouseLeave={e => (e.currentTarget.style.borderColor = '#1a1a1a')}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{ width: 38, height: 38, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', fontFamily: "'Bebas Neue', sans-serif", border: '1px solid #2a2a2a', backgroundColor: `${info.color}12`, color: info.color, flexShrink: 0 }}
          >
            {candidate.fullName.charAt(0).toUpperCase()}
          </div>
          <div>
            <div style={{ color: '#fff', fontSize: '14px', fontWeight: 600, lineHeight: 1.3 }}>{candidate.fullName}</div>
            <div style={{ color: '#444', fontSize: '10px', fontFamily: 'monospace', marginTop: '2px', maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {candidate.email}
            </div>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '22px', lineHeight: 1, color: info.color }}>
            {candidate.rating.score.toLocaleString()}
          </div>
          <div style={{ fontSize: '9px', fontFamily: 'monospace', color: info.color, marginTop: '2px', letterSpacing: '0.05em' }}>
            {candidate.rating.rank.toUpperCase()}
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ marginBottom: '14px' }}>
        <div style={{ height: '2px', backgroundColor: '#1a1a1a', borderRadius: '1px', overflow: 'hidden' }}>
          <div style={{ height: '100%', borderRadius: '1px', transition: 'width 0.5s', width: `${progress}%`, backgroundColor: info.color }} />
        </div>
        <div style={{ fontSize: '9px', fontFamily: 'monospace', color: '#333', marginTop: '4px' }}>{progress}% to next rank</div>
      </div>

      {/* Bio */}
      {candidate.bio && (
        <p style={{ color: '#555', fontSize: '11px', lineHeight: 1.6, marginBottom: '12px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {candidate.bio}
        </p>
      )}

      {/* Skills */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '16px' }}>
        {candidate.skills.slice(0, 4).map((skill) => (
          <span key={skill} style={{ fontSize: '10px', fontFamily: 'monospace', padding: '2px 6px', color: '#E8FF00', backgroundColor: 'rgba(232,255,0,0.05)', border: '1px solid rgba(232,255,0,0.15)', borderRadius: '2px' }}>
            {skill}
          </span>
        ))}
        {candidate.skills.length > 4 && (
          <span style={{ fontSize: '10px', fontFamily: 'monospace', padding: '2px 6px', color: '#444', backgroundColor: '#111', border: '1px solid #222', borderRadius: '2px' }}>
            +{candidate.skills.length - 4}
          </span>
        )}
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: '6px', paddingTop: '12px', borderTop: '1px solid #161616' }}>
        <a
          href={`mailto:${candidate.email}`}
          style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '8px', fontSize: '10px', fontFamily: 'monospace', fontWeight: 700, backgroundColor: '#E8FF00', color: '#000', textDecoration: 'none', borderRadius: '2px', transition: 'background-color 0.2s', letterSpacing: '0.05em' }}
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#d4e800')}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#E8FF00')}
        >
          <Mail size={11} /> REQUEST INTERVIEW
        </a>
        {candidate.github && (
          <a
            href={candidate.github} target="_blank" rel="noreferrer"
            style={{ padding: '8px 10px', border: '1px solid #2a2a2a', color: '#555', textDecoration: 'none', borderRadius: '2px', display: 'flex', alignItems: 'center', transition: 'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = 'rgba(232,255,0,0.2)'; }}
            onMouseLeave={e => { e.currentTarget.style.color = '#555'; e.currentTarget.style.borderColor = '#2a2a2a'; }}
          >
            <Github size={13} />
          </a>
        )}
      </div>
    </div>
  );
}
