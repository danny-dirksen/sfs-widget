import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {
        'sfs-bg': '#2fb257',
        'sfs-accent': '#10a100',
        'sfs-accent-dark': '#0e9100',
        'sfs-dark': '#036e13',
        'sfs-darken': '#00000019'
        // 'sfs-bg': '#8DC63F',
        // 'sfs-accent': '#5da100',
        // 'sfs-accent-dark': '#528c00',
        // 'sfs-dark': '#3c6600',
        // 'sfs-darken': '#00000019'
      },
    },
  },
  plugins: [],
};
export default config;
