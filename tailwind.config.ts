import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // SIGAVERA + Figma Unified Design System Tokens
        primary: '#174A33',
        'on-primary': '#ffffff',
        ink: '#14221A',
        'ink-muted': '#455A4C',
        canvas: '#F7F5EF',
        'canvas-warm': '#FAF8F3',
        'inverse-canvas': '#103524',
        'inverse-ink': '#ffffff',
        'on-inverse-soft': '#ffffff',
        hairline: '#DCE4D8',
        'hairline-soft': '#E9EFE6',
        'surface-soft': '#F0ECE1',
        'block-lime': '#E1ECE0',
        'block-lilac': '#c5b0f4',
        'block-cream': '#EDE8DC',
        'block-pink': '#efd4d4',
        'block-mint': '#E4EFE3',
        'block-coral': '#EFE2D8',
        'block-navy': '#174A33',
        'accent-magenta': '#C2410C',
        'semantic-success': '#1ea64a',
        'overlay-scrim': '#000000',

        // Semantic compatibility aliases
        surface: '#ffffff',
        forest: '#174A33',
        'forest-hover': '#103A27',
        'forest-dark': '#0E2E1F',
        'moss-soft': '#E3EDE0',
        border: '#DCE4D8',
        'control-border': '#6B8070',
        danger: '#A62626',
        focus: '#174A33',
      },
      fontFamily: {
        sans: [
          '"DM Sans"',
          '"Public Sans"',
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          'sans-serif',
        ],
        heading: [
          '"Manrope"',
          '"Plus Jakarta Sans"',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          'sans-serif',
        ],
        mono: [
          '"JetBrains Mono"',
          '"SF Mono"',
          'Menlo',
          'Consolas',
          'monospace',
        ],
      },
      maxWidth: {
        container: '1280px',
        form: '640px',
        prose: '65ch',
      },
      borderRadius: {
        xs: '2px',
        sm: '4px',
        md: '8px',
        lg: '12px',
        xl: '16px',
        pill: '9999px',
        full: '9999px',
        control: '8px',
        panel: '8px',
        'panel-lg': '12px',
        card: '8px',
        block: '8px',
        'block-lg': '12px',
      },
      spacing: {
        hair: '1px',
        xxs: '4px',
        xs: '8px',
        sm: '12px',
        md: '16px',
        lg: '24px',
        xl: '32px',
        xxl: '48px',
        section: '96px',
      },
      keyframes: {
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-down': {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        'slide-up': 'slide-up 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-down': 'slide-down 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'fade-in': 'fade-in 0.2s ease-out forwards',
      },
    },
  },
  plugins: [],
};

export default config;

