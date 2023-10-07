/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors');

module.exports = {
  content: [
    "./src/**/*.{html,scss,ts}",
  ],
  prefix: '',
  important: ':root',
  mode: 'jit',
  darkMode: 'class', // or 'media' or 'class'
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "15px",
        sm: "30px"
      },
    },
    screens: {
      sm: '576px',
      md: '768px',
      lg: '992px',
      xl: '1200px',
      xxl: '1440px'
    },
    // colors: {
    //   primary: colors.teal
    // },
    extend: {
      colors: {
        primary: {
          DEFAULT: "#2dd4bf",
        },
        accent: "#420FE7",
        warn: "#ff9966",

        light: {
          DEFAULT: "#F3F2F4" // Light or default font color
        }
      },
      spacing: {
        page: {
          DEFAULT: "1rem",
          xxl: "1.25rem"
        }
      }
    }
  },
  variants: {
    extend: {}
  },
  plugins: [],
}