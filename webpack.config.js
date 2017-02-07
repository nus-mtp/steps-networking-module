var webpack = require('webpack');
var path = require('path');

var config = {
  output: {
    filename: 'main.js',
    sourceMapFilename: 'main.js.map'
  },
  debug: true,
  devtool: 'source-map',
  module: {
    loaders: [
      {
        test: /\.js?$/,
        exclude: /node_modules/,
        loader: "babel",
        query:
          {
            presets: ['es2015', 'stage-0', 'react']
          }
      }
    ]
  }
};

module.exports = config;
