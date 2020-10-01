module.exports = {
  purge: [
    './src/**/*.jsx',
  ],
  theme: {
    extend: {}
  },
  variants: {},
  plugins: [
    require('@tailwindcss/custom-forms')
  ]
}
