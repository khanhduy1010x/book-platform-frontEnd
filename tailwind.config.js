/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}", "!./src/assets/**/*"],
  mode: 'jit',
  theme: {
    extend: {
      maxHeight: {
        'calc-30px': 'calc(100vh - 30px)',
      },
      maxWidth: {
        'calc-80px': 'calc(100vw - 100px)',
      },
      width: {
        'calc-80px': 'calc(100vw - 330px)',

      },
      animation: {
        blink: "blink 2s infinite", 
      },
      keyframes: {
        blink: {
          "0%": {
            opacity: "1", 
          },
          "50%": {
            opacity: "0.1", 
          },
          "100%": {
            opacity: "1", 
          },
        },
      },
      transitionProperty: {
        width: "width"
      },
      boxShadow: {
'black-top': '0px -4px 70px rgba(0, 0, 0, 0.8)',
'white-outline': '0 0 10px 2px rgba(255, 255, 255, 0.8)', 
'custom-sides': '6px 0 4px -4px #999, -6px 0 4px -4px #999',
},
      borderWidth: {
        '0.1': '0.1px',
      },
      fontFamily: {
        oswald: ["Oswald", "sans-serif"],
        rubik: ["Lexend", "sans-serif"],
        netflix:["Netflix Font", 'sans-serif']
      },
      scale: {
        '80': '0.8', 
        '85': '0.85', 
        '90': '0.9', 
      },
      colors: {
        orange: {
          500: '#f97316', 
        },
        'custom-white': 'rgba(255, 255, 255, 0.9)',
        'black-rgb': 'rgba(18, 18, 20, 0.9)',
        primary: {
          DEFAULT: "#00cec8",
           light: "#3B82F6",
          dark: "#1E40AF",
        },
      },
      backdropFilter: {
        'none': 'none',
        'blur': 'blur(20px)',
        'blur-50': 'blur(150px)',
      },
      backgroundColor: {
        "custom-modal-dark": "rgba(18, 18, 20, 0.3)",
        "custom-modal-dark-II": "rgba(24, 24, 27, 0.6)",
        "custom-modal-dark-III": "rgba(18, 18, 20, 0.2)",
        'dark-gradient': "rgba(18, 18, 20, 0.8)",
        "background-book": "rgba(18, 18, 20, 0.9)",
        "background-white": "hsla(0, 0%, 100%, 0.1);",
      },
      backgroundImage: {
        'slider-track': `linear-gradient(to right, var(--progress-color, #00cec8) 0%, var(--progress-color, #00cec8) var(--slider-progress, 50%), var(--remaining-color, #808080) var(--slider-progress, 50%), var(--remaining-color, #808080) 100%)`,
        'home-banner': 'linear-gradient(180deg, rgba(18, 18, 20, 0), #121214)',
        'red-to-pink': 'linear-gradient(180deg, #ff0000, #ff69b4)',  ////// tra phi
'orange-to-yellow': 'linear-gradient(45deg, #FFA500, #FFD700)', ///// thanh vien
'cyan-to-lightblue': 'linear-gradient(45deg, #00CEC8, #ADD8E6)', //Mien phi
'blur-bg-primary' : 'linear-gradient(180deg, #218f7d -16.8%, #000000 117.58%)'



      },
    },
  },
  plugins: [
    require('tailwindcss-filters'),
  ],
};
