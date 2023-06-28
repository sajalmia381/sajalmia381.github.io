/** @type {import('tailwindcss').Config} */
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
    extend: {
      colors: {
        primary: {
          DEFAULT: "#EEA1BE",
        },
        accent: "#420FE7", // base Bg
        warn: "#ff9966",

        light: {
          DEFAULT: "#F3F2F4", // Light or default font color
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