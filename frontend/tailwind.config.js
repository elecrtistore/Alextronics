export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#1E3A5F', hover: '#15294A', light: '#E8EDF5' },
        charcoal: '#111827',
        surface: '#FFFFFF',
        background: '#F5F5F0',
        soft: '#6B7280',
        border: '#D4D4D4',
        accent: '#0D9488'
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        soft: '0 4px 20px rgba(15, 23, 42, 0.06)',
        card: '0 1px 3px rgba(15, 23, 42, 0.04)'
      },
      spacing: {
        18: '4.5rem',
        88: '22rem'
      }
    }
  },
  plugins: []
};
