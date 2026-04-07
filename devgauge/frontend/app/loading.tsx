export default function Loading() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#080808', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
        <div className="spinner" />
        <p style={{ color: '#333', fontSize: '11px', fontFamily: 'monospace', letterSpacing: '0.1em' }}>LOADING...</p>
      </div>
    </div>
  );
}
