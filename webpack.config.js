const path = require("path");
const dotenv = require("dotenv");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const webpack = require("webpack");

// Manually load environment variables
dotenv.config();

module.exports = {
  entry: "./src/main.js",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname),
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
    new webpack.DefinePlugin({
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
      "process.env.NODE_ENV": JSON.stringify(
        process.env.NODE_ENV || "development"
      ),
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: "./index.html", to: "./" },
        { from: "./styles.css", to: "./" },
      ],
    }),
  ],
  mode: "development",
  devServer: {
    static: {
      directory: path.join(__dirname, "public"), // Serve files from the public folder
    },
    compress: true,
    port: 8080, // You can change the port if needed
  },
};
