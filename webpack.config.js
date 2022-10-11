const { join } = require('path')
const TerserPlugin = require("terser-webpack-plugin")

module.exports = {
  devtool: 'source-map',
  entry: {
    index: join(__dirname, 'src', 'index.ts')
  },
  mode: 'production',
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()]
  },
  output: {
    filename: '[name].js',
    path: join(__dirname, 'dist')
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  },
  module: {
    rules: [
      {
        loader: 'ts-loader',
        test: /\.([cm]?ts|tsx)$/
      }
    ]
  }
}
