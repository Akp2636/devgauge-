'use client';

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#080808', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center', maxWidth: '400px', padding: '0 24px' }}>
        <div style={{ fontSize: '10px', fontFamily: 'monospace', color: '#f87171', letterSpacing: '0.2em', marginBottom: '16px' }}>RUNTIME ERROR</div>
        <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '48px', color: '#fff', marginBottom: '12px' }}>SOMETHING BROKE</h1>
        <p style={{ color: '#555', fontSize: '12px', fontFamily: 'monospace', marginBottom: '8px', wordBreak: 'break-all' }}>{error.message}</p>
        <p style={{ color: '#444', fontSize: '12px', marginBottom: '32px' }}>Try refreshing the page or going back.</p>
        <button onClick={reset}
          style={{ padding: '10px 24px', backgroundColor: '#E8FF00', color: '#000', fontSize: '12px', fontWeight: 700, fontFamily: 'monospace', border: 'none', cursor: 'pointer', borderRadius: '2px', marginRight: '12px' }}>
          TRY AGAIN
        </button>
      </div>
    </div>
  );
}
