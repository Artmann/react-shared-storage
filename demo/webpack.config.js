const HtmlWebpackPlugin = require('html-webpack-plugin')
const { join } = require('path')

module.exports = {
  devtool: 'eval',
  devServer: {
    compress: true,
    port: 9000,
    static: {
      directory: join(__dirname, 'public'),
    }
  },
  entry: join(__dirname, 'index.tsx'),
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.ts(x?)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'ts-loader'
          }
        ]
      },
      {
        enforce: 'pre',
        test: /\.js$/,
        loader: 'source-map-loader'
      }
    ]
  },
  output: {
    filename: 'app.[contenthash].js',
    path: join(__dirname, 'build'),
    publicPath: ''
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: join(__dirname, 'public', 'index.html')
    })
  ],
  resolve: {
    extensions: ['*', '.js', '.jsx', '.ts', '.tsx']
  }
};