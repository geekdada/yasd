'use strict'

const CracoWorkboxPlugin = require('craco-workbox')
const pkg = require('./package.json')

process.env.REACT_APP_VERSION = pkg.version

module.exports = {
  plugins: [
    {
      plugin: CracoWorkboxPlugin,
    },
  ],
  style: {
    postcss: {
      plugins: [
        require('postcss-import'),
        require('tailwindcss'),
        require('autoprefixer'),
      ],
    },
  },
}
