/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#43245A',
        text: '#232323',
        accent: '#B6A8C1',
        background: '#EBE2F2',
      },
      typography: {
        DEFAULT: {
          css: {
            color: '#232323',
            h1: {
              color: '#43245A',
              fontWeight: '700',
            },
            h2: {
              color: '#43245A',
              fontWeight: '600',
            },
            h3: {
              color: '#43245A',
              fontWeight: '600',
            },
            h4: {
              color: '#43245A',
              fontWeight: '600',
            },
            h5: {
              color: '#43245A',
              fontWeight: '600',
            },
            h6: {
              color: '#43245A',
              fontWeight: '600',
            },
            strong: {
              color: '#43245A',
            },
            a: {
              color: '#43245A',
              '&:hover': {
                color: '#B6A8C1',
              },
            },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
} 