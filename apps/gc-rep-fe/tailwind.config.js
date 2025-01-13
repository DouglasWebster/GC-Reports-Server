const { createGlobPatternsForDependencies } = require('@nx/angular/tailwind');
const { join } = require('path');

const defaultTheme = require('tailwindcss/defaultTheme')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    join(__dirname, 'src/**/!(*.stories|*.spec).{ts,html}'),
    ...createGlobPatternsForDependencies(__dirname),
    './node_modules/flowbite/**/*.js'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['InterVarialbe', ...defaultTheme.fontFamily.sans] 
      }
    },
  },
  plugins: [
    require('flowbite/plugin')({
      datatables: true
    })
  ],
};
