// eslint-disable-next-line @typescript-eslint/no-var-requires
const pkg = require('./package.json')

process.env.REACT_APP_VERSION = pkg.version

/**
 * @type {import('@craco/types').CracoConfig}
 */
const config = {
  eslint: {
    enable: true,
    mode: 'file',
  },
  style: {
    postcss: {
      mode: 'file',
    },
  },
  webpack: {
    alias: {
      '@': `${__dirname}/src`,
    },
  },
  babel: {
    plugins: ['babel-plugin-macros', '@emotion/babel-plugin'],
    presets: [
      '@babel/preset-react',
      { runtime: 'automatic', importSource: '@emotion/react' },
    ],
  },
}

module.exports = config
