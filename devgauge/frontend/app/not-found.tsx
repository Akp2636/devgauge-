import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#080808', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
      <div style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
        <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '180px', color: '#0f0f0f', lineHeight: 1, userSelect: 'none', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -55%)', whiteSpace: 'nowrap' }}>
          404
        </div>
        <div style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ fontSize: '10px', fontFamily: 'monospace', color: '#E8FF00', letterSpacing: '0.2em', marginBottom: '16px' }}>ERROR 404</div>
          <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '48px', color: '#fff', marginBottom: '12px' }}>PAGE NOT FOUND</h1>
          <p style={{ color: '#555', fontSize: '13px', marginBottom: '32px' }}>This page doesn't exist or has been moved.</p>
          <Link href="/" style={{ padding: '12px 28px', backgroundColor: '#E8FF00', color: '#000', fontSize: '12px', fontWeight: 700, fontFamily: 'monospace', textDecoration: 'none', borderRadius: '2px', letterSpacing: '0.05em' }}>
            GO HOME
          </Link>
        </div>
      </div>
    </div>
  );
}
