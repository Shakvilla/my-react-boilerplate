const postcssConfig = require('./postcss.config')

const cracoAlias = require('craco-alias')

module.exports = {
  style: {
    postOptions: postcssConfig,
  },
  plugins: [
    {
      plugin: cracoAlias,
      options: {
        source: 'tsconfig',

        // baseUrl: './src', 

        tsConfigPath: './tsconfig.paths.json'
      },
    },
  ]
}