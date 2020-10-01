'use strict';

const CracoWorkboxPlugin = require('craco-workbox');

module.exports = {
  plugins: [{
    plugin: CracoWorkboxPlugin
  }],
  style: {
    postcss: {
      plugins: [
        require('postcss-import'),
        require('tailwindcss'),
        require('autoprefixer'),
      ],
    },
  },
};
