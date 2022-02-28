const { name, version, repository } = require('./package.json')
const { styles, theme } = require('./styleguide.styles')

module.exports = {
  title: `${name} v${version}`,
  ribbon: {
    url: repository,
    text: 'View on GitHub',
  },
  styles,
  theme,
  pagePerSection: true,
  sections: [
    {
      name: 'README',
      content: 'README.md',
    },
    {
      name: 'UI Components',
      components: 'src/components/**/[A-Z]*.js',
      exampleMode: 'collapse', // 'hide' | 'collapse' | 'expand'
      usageMode: 'collapse', // 'hide' | 'collapse' | 'expand'
    },
  ],
  webpackConfig: {
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          loader: 'babel-loader',
        },
      ],
    },
  },
}
