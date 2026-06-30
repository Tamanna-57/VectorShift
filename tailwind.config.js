/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        vs: {
          bg: '#0D1117',
          surface: '#161B22',
          card: '#1C2333',
          border: '#30363D',
          accent: '#7C3AED',
          'accent-light': '#A78BFA',
          'accent-glow': '#7C3AED33',
          text: '#E6EDF3',
          muted: '#8B949E',
          input: '#10B981',
          output: '#F59E0B',
          llm: '#7C3AED',
          textnode: '#3B82F6',
          filter: '#EF4444',
          memory: '#06B6D4',
          prompt: '#EC4899',
          router: '#84CC16',
          transform: '#F97316',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'node': '0 0 0 1px rgba(124,58,237,0.3), 0 4px 24px rgba(0,0,0,0.4)',
        'node-hover': '0 0 0 1px rgba(124,58,237,0.6), 0 8px 32px rgba(124,58,237,0.2)',
        'node-selected': '0 0 0 2px #7C3AED, 0 8px 32px rgba(124,58,237,0.3)',
      }
    },
  },
  plugins: [],
}
