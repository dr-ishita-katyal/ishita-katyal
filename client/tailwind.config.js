/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ivory: '#FAF7F2',
        cream: '#FFFDF9',
        sand: '#F1E7DA',
        linen: '#EFE5D8',
        ink: '#241811',
        cocoa: '#3D2A20',
        umber: '#6F4E3A',
        clay: '#7A5C46',
        gilt: '#A07A52',
        line: 'rgba(45, 33, 27, 0.14)',
        hairline: 'rgba(45, 33, 27, 0.08)',
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', 'Times New Roman', 'serif'],
        sans: ['Manrope', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
      },
      fontSize: {
        // A modular scale (~1.33) rather than Tailwind's defaults.
        '2xs': ['0.6875rem', { lineHeight: '1.4', letterSpacing: '0.14em' }],
        xs: ['0.75rem', { lineHeight: '1.5', letterSpacing: '0.1em' }],
        display: ['clamp(3rem, 11vw, 9.5rem)', { lineHeight: '0.88', letterSpacing: '-0.025em' }],
        title: ['clamp(2.25rem, 6vw, 4.75rem)', { lineHeight: '0.98', letterSpacing: '-0.02em' }],
        heading: ['clamp(1.75rem, 3.6vw, 3rem)', { lineHeight: '1.06', letterSpacing: '-0.015em' }],
        lede: ['clamp(1.0625rem, 1.5vw, 1.375rem)', { lineHeight: '1.6' }],
      },
      maxWidth: {
        measure: '62ch',
        shell: '86rem',
      },
      spacing: {
        gutter: 'clamp(1.25rem, 5vw, 5.5rem)',
        section: 'clamp(4.5rem, 11vw, 10rem)',
      },
      transitionTimingFunction: {
        silk: 'cubic-bezier(0.22, 1, 0.36, 1)',
        swift: 'cubic-bezier(0.65, 0, 0.35, 1)',
      },
      keyframes: {
        drawLine: { from: { transform: 'scaleY(0)' }, to: { transform: 'scaleY(1)' } },
      },
    },
  },
  plugins: [],
};
