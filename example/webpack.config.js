const path = require('path');
const dotenv = require('dotenv').config(); /* eslint-disable-line no-unused-vars */
const beautify = require('js-beautify');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HotModuleReplacementPlugin = webpack.HotModuleReplacementPlugin;
const WriteAssetsWebpackPlugin = require('../dist/index');
const devMode = env('NODE_ENV') !== 'production';
const assetPath = env('ASSET_PATH', '/');

// Get environment variable function
function env(e, d = '') {
  if (typeof process.env[e] === 'undefined' || process.env[e] === '') return d;
  return process.env[e];
}

module.exports = () => {
  let imageLoader = {
    loader: devMode ? 'url-loader' : 'file-loader', // Return a DataURL when using webpack dev server & Fallback to File-loader on Production mode
    options: devMode ? {
      limit: 8192,
      name: 'img/[path][name].[ext]',
      context: path.resolve(__dirname, 'assets/src/images')
    } : {
      name: '[path][name].[ext]',
      outputPath: '/img/',
      publicPath: assetPath + '/img/',
      context: path.resolve(__dirname, 'assets/src/images')
    }
  };

  let fontLoader = {
    loader: devMode ? 'url-loader' : 'file-loader', // Return a DataURL when using webpack dev server & Fallback to File-loader on Production mode
    options: devMode ? {
      limit: 8192,
      name: 'fonts/[path][name].[ext]',
      context: path.resolve(__dirname, 'assets/src/fonts')
    } : {
      name: '[path][name].[ext]',
      outputPath: '/fonts/',
      publicPath: assetPath + '/fonts/',
      context: path.resolve(__dirname, 'assets/src/fonts')
    }
  };

  return {
    mode: env('NODE_ENV', 'development'),
    target: 'web',
    entry: [
      './assets/src/scripts/index.js'
    ],
    output: {
      filename: devMode ? 'js/[name].js' : 'js/[name].[hash].js',
      path: path.resolve(__dirname, 'assets/dist/'),
      publicPath: assetPath
    },
    devtool: devMode ? 'inline-source-map' : false,
    devServer: {
      contentBase: path.join(__dirname, 'assets/dist/'),
      compress: true,
      port: 8080
    },
    module: {
      rules: [
        {
          test: /\.(js)$/,
          loader: 'eslint-loader'
        },
        {
          test: /\.scss$/,
          use: [
            MiniCssExtractPlugin.loader,
            'css-loader',
            'sass-loader'
          ]
        },
        {
          test: /\.(png|svg|jpg|gif)$/,
          use: [
            imageLoader
          ]
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/,
          use: [
            fontLoader
          ]
        }
      ]
    },
    optimization: {
      splitChunks: {
        cacheGroups: {
          commons: {
            name: 'vendors',
            minChunks: 1,
            minSize: 1000,
            test: /[\\/]node_modules[\\/]/,
            chunks: 'all'
          }
        }
      }
    },
    plugins: [
      new CleanWebpackPlugin(['assets/dist']),
      new MiniCssExtractPlugin({ filename: devMode ? 'css/[name].css' : 'css/[name].[hash].css' }),
      new HtmlWebpackPlugin({
        template: 'assets/src/index.template.html',
        filename: 'index.html'
      }),
      new InjectHtmlWebpackPlugin(),
      new HotModuleReplacementPlugin(),
      new WriteAssetsWebpackPlugin({ force: true, debug: true })
    ]
  };
};

const pluginName = 'InjectHtmlWebpackPlugin';

class InjectHtmlWebpackPlugin {
  apply(compiler) {
    compiler.hooks.compilation.tap(pluginName, (compilation) => {
      compilation.hooks.htmlWebpackPluginAfterHtmlProcessing.tapAsync(pluginName, (data, cb) => {
        console.log('Trigger HTML Webpack Plugin After HTML Processing Event.');
        // Beautify html
        let options = {
          indent_size: 2,
          indent_with_tabs: false,
          html: {
            end_with_newline: true,
            indent_inner_html: true,
            preserve_newlines: true,
            extra_liners: ['{%']
          }
        };
        data.html = beautify.html(data.html, options);
        cb(null, data);
      });
    });
  }
}
