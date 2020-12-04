module.exports = {
  purge: {
    enabled: true,
    content: ['./*.html'],
  },
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
    filter: {
      // defaults to {}
      none: 'none',
      grayscale: 'grayscale(1)',
      invert: 'invert(1)',
      sepia: 'sepia(1)',
      blur: 'blur(5px)',
    },
    backdropFilter: {
      // defaults to {}
      none: 'none',
      blur: 'blur(20px)',
    },
  },
  variants: {
    extend: {},
    filter: ['responsive', 'hover'], // defaults to ['responsive']
    backdropFilter: ['responsive'], // defaults to ['responsive']
  },
  plugins: [require('tailwindcss-filters')],
};
