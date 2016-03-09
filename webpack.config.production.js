/* eslint strict: 0 */
'use strict';

const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const webpackTargetElectronRenderer = require('webpack-target-electron-renderer');
const baseConfig = require('./webpack.config.base');


const config = Object.create(baseConfig);

config.devtool = 'source-map';

config.entry = './app/main';

config.output.publicPath = '../dist/';

config.module.loaders.push({
  test: /\.less$/,
  loader: 'style!css!less'
}, {
  test: /\.jpe?g$|\.gif$|\.png$|\.ico|\.svg(\?v\=.*)?$|\.woff(\?v\=.*)?$|\.ttf(\?v\=.*)?$|\.eot(\?v\=.*)?$|\.woff?2(\?v\=.*)?/, // eslint-disable-line max-len
  loader: 'file-loader?name=[path][name].[ext]'
});


config.plugins.push(
  new webpack.optimize.OccurenceOrderPlugin(),
  new webpack.DefinePlugin({
    __DEV__: false,
    'process.env': {
      NODE_ENV: JSON.stringify('production')
    }
  }),
  new webpack.optimize.UglifyJsPlugin({
    compressor: {
      screw_ie8: true,
      warnings: false
    }
  }),
  new ExtractTextPlugin('style.css', { allChunks: true })
);

config.target = webpackTargetElectronRenderer(config);

module.exports = config;
