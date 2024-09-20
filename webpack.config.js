const path = require("path");
const Dotenv = require("dotenv-webpack");

module.exports = {
  entry: "./src/main.js", // Adjust this to your entry file path
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
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
  plugins: [
    new Dotenv(), // Dotenv plugin for loading environment variables
  ],
  mode: "development", // Change this to 'production' for production builds
};
