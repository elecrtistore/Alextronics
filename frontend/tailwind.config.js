export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#F97316', hover: '#EA580C', light: '#FFF7ED' },
        charcoal: '#111827',
        surface: '#FFFFFF',
        background: '#F8FAFC',
        soft: '#6B7280',
        border: '#E5E7EB',
        accent: '#10B981'
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
