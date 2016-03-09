/* eslint strict: 0 */
'use strict';

const path = require('path');

module.exports = {
  module: {
    loaders: [{
      test: /\.js?$/,
      loaders: ['babel-loader'],
      exclude: /node_modules/
    }]
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js',
    libraryTarget: 'commonjs2'
  },
  resolve: {
    extensions: ['', '.js', '.jsx'],
    packageMains: ['webpack', 'browser', 'web', 'browserify', ['jam', 'main'], 'main']
  },
  plugins: [
  ]
};
