module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      //height
      spacing: {
        '100vh': '100vh',
        '500px': '500px',
        '280px': '280px',
        '160px': '160px',
        '3px' : '3px',
        '1px': '1px',
        '19rem': '19rem'
      },
      width: {
        '600': '600px',
        'post': '550px',
        '400': '400px',
        '300': '300px',
      },
      screens: {
        'min-sm': '640px',
        // => @media (min-width: 640px) { ... }
  
        'min-md': '768px',
        // => @media (min-width: 768px) { ... }
  
        'min-lg': '1024px',
        // => @media (min-width: 1024px) { ... }
  
        'min-xl': '1280px',
        // => @media (min-width: 1280px) { ... }
  
        'min-2xl': '1536px',
        // => @media (min-width: 1536px) { ... }


        'max-2xl': {'max': '1535px'},
        // => @media (max-width: 1535px) { ... }

        'max-xl': {'max': '1279px'},
        // => @media (max-width: 1279px) { ... }

        'max-lg': {'max': '1023px'},
        // => @media (max-width: 1023px) { ... }

        'max-md': {'max': '767px'},
        // => @media (max-width: 767px) { ... }

        'max-sm': {'max': '639px'},
        // => @media (max-width: 639px) { ... }
      },

      gridTemplateRows: {
        'story': '200px',
      }
    },
  },
  plugins: [
    require('@tailwindcss/line-clamp'),
  ],
}
