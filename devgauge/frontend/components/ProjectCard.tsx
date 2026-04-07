import { ExternalLink, Github, Cpu, Trash2, FileCode } from 'lucide-react';

interface Project {
  _id: string;
  title: string;
  description: string;
  skills: string[];
  repoUrl?: string;
  liveUrl?: string;
  aiAnalysis?: {
    complexity: string;
    scoreContribution: number;
    summary: string;
  };
  status: string;
  createdAt: string;
}

interface ProjectCardProps {
  project: Project;
  onDelete?: (id: string) => void;
  showDelete?: boolean;
}

const complexityStyles: Record<string, { color: string; bg: string; border: string }> = {
  High:   { color: '#f87171', bg: 'rgba(248,113,113,0.08)', border: 'rgba(248,113,113,0.2)' },
  Medium: { color: '#fbbf24', bg: 'rgba(251,191,36,0.08)',  border: 'rgba(251,191,36,0.2)'  },
  Low:    { color: '#34d399', bg: 'rgba(52,211,153,0.08)',  border: 'rgba(52,211,153,0.2)'  },
};

export default function ProjectCard({ project, onDelete, showDelete }: ProjectCardProps) {
  const cx = complexityStyles[project.aiAnalysis?.complexity || 'Medium'] || complexityStyles.Medium;

  return (
    <div
      className="group"
      style={{
        backgroundColor: '#0f0f0f',
        border: '1px solid #1a1a1a',
        padding: '20px',
        transition: 'border-color 0.2s',
      }}
      onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(232,255,0,0.15)')}
      onMouseLeave={e => (e.currentTarget.style.borderColor = '#1a1a1a')}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
          <div style={{ width: 32, height: 32, border: '1px solid #2a2a2a', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <FileCode size={13} style={{ color: '#E8FF00' }} />
          </div>
          <h3 style={{ color: '#fff', fontSize: '14px', fontWeight: 500, lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {project.title}
          </h3>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
          {project.aiAnalysis && (
            <span style={{ fontSize: '10px', fontFamily: 'monospace', padding: '2px 6px', color: cx.color, backgroundColor: cx.bg, border: `1px solid ${cx.border}`, borderRadius: '2px' }}>
              +{project.aiAnalysis.scoreContribution} pts
            </span>
          )}
          {project.repoUrl && (
            <a href={project.repoUrl} target="_blank" rel="noreferrer" style={{ padding: '4px', color: '#444', transition: 'color 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#fff')} onMouseLeave={e => (e.currentTarget.style.color = '#444')}>
              <Github size={13} />
            </a>
          )}
          {project.liveUrl && (
            <a href={project.liveUrl} target="_blank" rel="noreferrer" style={{ padding: '4px', color: '#444', transition: 'color 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#E8FF00')} onMouseLeave={e => (e.currentTarget.style.color = '#444')}>
              <ExternalLink size={13} />
            </a>
          )}
          {showDelete && onDelete && (
            <button onClick={() => onDelete(project._id)} style={{ padding: '4px', color: '#444', background: 'none', border: 'none', cursor: 'pointer', transition: 'color 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#f87171')} onMouseLeave={e => (e.currentTarget.style.color = '#444')}>
              <Trash2 size={13} />
            </button>
          )}
        </div>
      </div>

      {/* Description */}
      <p style={{ color: '#555', fontSize: '12px', lineHeight: 1.6, marginBottom: '12px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
        {project.description}
      </p>

      {/* AI Analysis bar */}
      {project.aiAnalysis?.summary && (
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', padding: '10px', backgroundColor: 'rgba(232,255,0,0.03)', border: '1px solid rgba(232,255,0,0.08)', marginBottom: '12px' }}>
          <Cpu size={12} style={{ color: '#E8FF00', flexShrink: 0, marginTop: '1px' }} />
          <p style={{ fontSize: '11px', color: '#555', lineHeight: 1.5, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical' }}>
            {project.aiAnalysis.summary}
          </p>
        </div>
      )}

      {/* Skills */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
        {project.skills.slice(0, 5).map((skill) => (
          <span key={skill} style={{ fontSize: '10px', fontFamily: 'monospace', padding: '2px 6px', color: '#E8FF00', backgroundColor: 'rgba(232,255,0,0.05)', border: '1px solid rgba(232,255,0,0.15)', borderRadius: '2px' }}>
            {skill}
          </span>
        ))}
        {project.skills.length > 5 && (
          <span style={{ fontSize: '10px', fontFamily: 'monospace', padding: '2px 6px', color: '#444', backgroundColor: '#111', border: '1px solid #222', borderRadius: '2px' }}>
            +{project.skills.length - 5}
          </span>
        )}
      </div>

      {/* Footer date */}
      <div style={{ marginTop: '12px', paddingTop: '10px', borderTop: '1px solid #161616' }}>
        <span style={{ fontSize: '10px', fontFamily: 'monospace', color: '#333' }}>
          {new Date(project.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </span>
      </div>
    </div>
  );
}
