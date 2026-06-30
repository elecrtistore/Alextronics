export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#F97316',
        charcoal: '#1F2937',
        accent: '#10B981',
        surface: '#ffffff',
        background: '#F8FAFC'
      },
      boxShadow: {
        soft: '0 12px 30px rgba(15, 23, 42, 0.08)'
      },
      borderRadius: {
        soft: '1rem'
      }
    }
  },
  plugins: []
};
