const BLOG = require('./blog.config');
const { fontFamilies } = require('./lib/font');

module.exports = {
  content: ['./pages/**/*.js', './components/**/*.js', './layouts/**/*.js', './themes/**/*.js'],
  darkMode: BLOG.APPEARANCE === 'class' ? 'media' : 'class', // or 'media' or 'class'
  theme: {
    fontFamily: fontFamilies,
    extend: {
      colors: {
        day: {
          DEFAULT: BLOG.BACKGROUND_LIGHT || '#ffffff'
        },
        night: {
          DEFAULT: BLOG.BACKGROUND_DARK || '#111827'
        },
        lawn: {
          'background-gray': '#f5f5f5',
          'black-gray': '#101414',
          'light-gray': '#e5e5e5'
        }
      },
      backgroundImage: {
        'rainbow-divider-dark': 'linear-gradient(90deg, #101414 0%, #101414 50%, transparent 50%, transparent 100%)'
      },
      maxWidth: {
        side: '14rem',
        '9/10': '90%'
      }
    }
  },
  future: {
    hoverOnlyWhenSupported: true
  },
  variants: {
    extend: {}
  },
  plugins: []
};
