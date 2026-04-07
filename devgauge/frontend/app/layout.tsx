import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'DevGauge – Codeforces for Tech Recruitment',
  description: 'Stop hiring resumes. Start hiring skill. Get rated like a competitive programmer.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Bebas+Neue&family=IBM+Plex+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased" style={{ backgroundColor: '#080808', color: '#e5e5e5' }}>
        {children}
      </body>
    </html>
  );
}
