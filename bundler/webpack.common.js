const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCSSExtractPlugin = require("mini-css-extract-plugin");
const path = require("path");
const fs = require("fs");

const directories = fs.readdirSync(path.resolve(__dirname, "../src"));

// Create a config for all directories in /src
const configs = directories.map((directory) => ({
  name: directory,
  entry: path.resolve(__dirname, `../src/${directory}/script.js`),
  html: path.resolve(__dirname, `../src/${directory}/index.html`),
}));

module.exports = configs.map((config) => ({
  entry: config.entry,
  output: {
    hashFunction: "xxhash64",
    filename: `${config.name}/${config.name}.bundle.[contenthash].js`,
    path: path.resolve(__dirname, "../dist"),
  },
  devtool: "source-map",
  plugins: [
    new CopyWebpackPlugin({
      patterns: [{ from: path.resolve(__dirname, "../static") }],
    }),
    new HtmlWebpackPlugin({
      template: config.html,
      minify: true,
      filename: `${config.name}/index.html`,
    }),
    new MiniCSSExtractPlugin({
      filename: `${config.name}/style.css`,
    }),
  ],
  module: {
    rules: [
      // HTML
      {
        test: /\.(html)$/,
        use: ["html-loader"],
      },

      // JS
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ["babel-loader"],
      },

      // CSS
      {
        test: /\.css$/,
        use: [MiniCSSExtractPlugin.loader, "css-loader"],
      },

      // Images
      {
        test: /\.(jpg|png|gif|svg)$/,
        type: "asset/resource",
        generator: {
          filename: "assets/images/[hash][ext]",
        },
      },

      // Fonts
      {
        test: /\.(ttf|eot|woff|woff2)$/,
        type: "asset/resource",
        generator: {
          filename: "assets/fonts/[hash][ext]",
        },
      },
    ],
  },
}));
