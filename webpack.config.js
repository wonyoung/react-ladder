module.exports = {
  entry: ["./app.js"],
  output: {
    path: __dirname,
    filename: "./bundle.js"
  },
  module: {
    loaders: [
      {
        test: /\.css$/,
        loader: "style-loader!css-loader"
      },
      {
        test: /\.js$/,
        loader: "babel-loader",
        query: {
          presets: ["es2015" , "react"],
          compact: false
        }
      }
    ]
  }
};
