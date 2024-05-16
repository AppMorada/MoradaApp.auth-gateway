const { resolve } = require("path")
const Webpack = require("webpack")
const TerserPlugin = require("terser-webpack-plugin")

module.exports = {
  mode: "production",
  entry: resolve(__dirname + "/functions/index.ts"),
  output: {
    path: resolve(__dirname + "/dist/functions"),
    filename: "index.js"
  },
  target: "node20",
  devtool: "source-map",
  resolve: {
    alias: {
      "@functions": resolve(__dirname + "/functions"),
      "@tests": resolve(__dirname + "/tests"),
      "@tools": resolve(__dirname + "/tools/js")
    },
    extensions: [".ts", ".js"]
  },
  plugins: [
    new Webpack.IgnorePlugin({ resourceRegExp: /^request$/ }),
    new Webpack.IgnorePlugin({ resourceRegExp: /^pg-native$/ }),
    new Webpack.DefinePlugin({
      NODE_ENV: "production"
    })
  ],
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()]
  },
  module: {
    rules: [
      {
        test: /\.(t|j)s$/,
        exclude: /node_modules/,
        use: "swc-loader"
      }
    ]
  },
  performance: {
    maxEntrypointSize: 6291456,
    maxAssetSize: 6291456
  }
}
