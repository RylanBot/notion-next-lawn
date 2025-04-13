const BLOG = require('./blog.config');

module.exports = {
  content: ['./pages/**/*.js', './plugins/**/*.js', './themes/**/*.js'],
  safelist: ['font-sans, font-serif'],
  darkMode: 'class',
  theme: {
    fontFamily: {
      sans: BLOG.FONT_SANS,
      serif: BLOG.FONT_SERIF,
      // oleo: ['Oleo Script', 'Times New Roman'],
      times: ['Times New Roman']
    },
    extend: {
      colors: {
        day: {
          DEFAULT: BLOG.BACKGROUND_LIGHT || '#070505'
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
