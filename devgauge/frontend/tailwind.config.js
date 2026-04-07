/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Bebas Neue', 'sans-serif'],
        body: ['Space Grotesk', 'sans-serif'],
        mono: ['IBM Plex Mono', 'monospace'],
      },
      colors: {
        bg: {
          DEFAULT: '#080808',
          card: '#0f0f0f',
          hover: '#161616',
          border: '#222222',
        },
        accent: {
          DEFAULT: '#E8FF00',
          dim: 'rgba(232,255,0,0.08)',
          hover: '#d4e800',
        },
      },
      backgroundImage: {
        'dot-grid': "radial-gradient(circle, #2a2a2a 1px, transparent 1px)",
      },
      backgroundSize: {
        'dot': '28px 28px',
      },
    },
  },
  plugins: [],
};
