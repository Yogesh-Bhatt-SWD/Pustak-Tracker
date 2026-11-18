/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        body: ['Inter', 'ui-sans-serif', 'system-ui', 'Segoe UI', 'Roboto', 'Arial', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'ui-sans-serif', 'system-ui', 'Segoe UI', 'Roboto', 'Arial', 'sans-serif'],
      },
      colors: {
        // Base palette
        charcoal: '#0b1220',
        navy: '#071426',
        // Brand
        brandTeal: '#14b8a6',
        brandCyan: '#22d3ee',
        brandIndigo: '#6366f1',
        brandViolet: '#8b5cf6',
        // Semantic
        danger: '#fb7185',
        success: '#34d399',
        warning: '#fbbf24',
        // CSS-var-backed semantic tokens (for use in arbitrary values)
        surface: 'var(--surface-base)',
        surfacePanel: 'var(--surface-panel)',
        surfaceInput: 'var(--surface-input)',
        borderColor: 'var(--border)',
        textPrimary: 'var(--text-primary)',
        textSecondary: 'var(--text-secondary)',
        textMuted: 'var(--text-muted)',
      },
      boxShadow: {
        glowTeal: '0 0 0 1px rgba(20,184,166,.25), 0 0 28px rgba(34,211,238,.25)',
        glowIndigo: '0 0 0 1px rgba(99,102,241,.25), 0 0 28px rgba(139,92,246,.22)',
        panel: '0 4px 24px rgba(15,23,42,0.08)',
      },
      gridTemplateColumns: {
        14: 'repeat(14, minmax(0, 1fr))',
      },
      keyframes: {
        floaty: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        subtlePulse: {
          '0%, 100%': { opacity: '0.92' },
          '50%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
      },
      animation: {
        floaty: 'floaty 5.5s ease-in-out infinite',
        subtlePulse: 'subtlePulse 2.2s ease-in-out infinite',
        slideIn: 'slideIn 0.25s ease-out',
      },
    },
  },
  plugins: [],
}
