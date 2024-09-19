const path = require("path");
const Dotenv = require("dotenv-webpack");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const webpack = require("webpack"); // Add this to require webpack

module.exports = {
  entry: "./src/main.js",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
  plugins: [
    new Dotenv(),
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify(
        process.env.NODE_ENV || "development"
      ),
      "process.env.IMGUR_CLIENT_ID": JSON.stringify(
        process.env.IMGUR_CLIENT_ID
      ),
      "process.env.IMGUR_CLIENT_SECRET": JSON.stringify(
        process.env.IMGUR_CLIENT_SECRET
      ),
      "process.env.IMGUR_ALBUM_ID": JSON.stringify(process.env.IMGUR_ALBUM_ID),
      "process.env.IMGUR_AUTHORIZATION_CODE": JSON.stringify(
        process.env.IMGUR_AUTHORIZATION_CODE
      ),
      "process.env.IMGUR_REFRESH_TOKEN": JSON.stringify(
        process.env.IMGUR_REFRESH_TOKEN
      ),
      "process.env.SPOONACULAR_API_KEY": JSON.stringify(
        process.env.SPOONACULAR_API_KEY
      ),
      "process.env.GOOGLE_API_KEY": JSON.stringify(process.env.GOOGLE_API_KEY),
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: "./index.html", to: "./" }, // Copy index.html to dist folder
        { from: "./styles.css", to: "./" }, // Copy styles.css to dist folder
      ],
    }),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
    ],
  },
  mode: "development",
};
