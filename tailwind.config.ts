import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)',
        surface: 'var(--surface)',
        tint: 'var(--tint)',
        ink: 'var(--ink)',
        divider: 'var(--divider)',
        accent: {
          DEFAULT: 'var(--accent)',
          hover: 'var(--accent-hover)',
        },
        callout: {
          bg: 'var(--callout-bg)',
          border: 'var(--callout-border)',
        },
        node: {
          nginx: 'var(--node-nginx)',
          app: 'var(--node-app)',
          redis: 'var(--node-redis)',
          mongo: 'var(--node-mongo)',
          custom: 'var(--node-custom)',
          crashed: 'var(--node-crashed)',
          overloaded: 'var(--node-overloaded)',
          recovering: 'var(--node-recovering)',
        },
        traffic: {
          request: 'var(--traffic-request)',
          response: 'var(--traffic-response)',
          miss: 'var(--traffic-cache-miss)',
          invalidate: 'var(--traffic-invalidate)',
          blocked: 'var(--traffic-blocked)',
        },
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', '"Space Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        hard: '2px 2px 0px var(--ink)',
        'hard-sm': '1px 1px 0px var(--ink)',
        'hard-lg': '4px 4px 0px var(--ink)',
      },
    },
  },
  plugins: [],
} satisfies Config;
