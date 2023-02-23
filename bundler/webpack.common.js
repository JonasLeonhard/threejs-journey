const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
const fs = require("fs");

const directories = fs.readdirSync(path.resolve(__dirname, "../src"));

// Create a config for all directories in /src
const configs = directories.map((directory) => ({
  name: directory,
  entry: path.resolve(__dirname, `../src/${directory}/script.js`),
  html: path.resolve(__dirname, `../src/${directory}/index.html`),
}));

console.log("configs", configs);

module.exports = {
  entry: configs.reduce((acc, config) => {
    acc[config.name] = config.entry;
    return acc;
  }, {}),
  output: {
    hashFunction: "xxhash64",
    filename: `[name]/[name].bundle.[contenthash].js`,
    path: path.resolve(__dirname, "../dist"),
    clean: true,
  },
  devtool: "source-map",
  plugins: [
    new CopyWebpackPlugin({
      patterns: [{ from: path.resolve(__dirname, "../static") }],
    }),
    ...configs.map(
      (config) =>
        new HtmlWebpackPlugin({
          template: config.html,
          minify: true,
          filename: `${config.name}/index.html`,
          chunks: [config.name],
        })
    ),
  ],
  module: {
    rules: [
      // HTML
      {
        test: /\.(html)$/,
        exclude: configs.map((c) =>
          path.resolve(__dirname, `../src/${c.name}/index.html`)
        ), // let htmlwebpackplugin handle loading of this index files
        use: ["html-loader"],
      },

      // JS
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ["babel-loader"],
      },
      // GLSL
      {
        test: /\.glsl$/,
        loader: "webpack-glsl-loader",
      },

      // CSS
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
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
};
