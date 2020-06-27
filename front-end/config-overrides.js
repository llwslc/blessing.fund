const {
  override,
  addLessLoader,
  addDecoratorsLegacy,
  disableEsLint,
  overrideDevServer,
  watchAll
} = require('customize-cra');

module.exports = {
  webpack: override(
    addLessLoader({
      lessOptions: {
        modifyVars: {
          'hack': `true; @import "../../../src/antd.less";` // Override with less file
        },
        javascriptEnabled: true
      }
    }),
    addDecoratorsLegacy(),
    // usual webpack plugin
    disableEsLint()
  ),
  devServer: overrideDevServer(
    // dev server plugin
    watchAll()
  )
};
