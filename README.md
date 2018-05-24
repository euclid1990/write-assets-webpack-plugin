[![npm][npm]][npm-url]
[![node][node]][node-url]
![npm][npm-download]
[![deps][deps]][deps-url]
[![tests][tests]][tests-url]

[npm]: https://img.shields.io/npm/v/write-assets-webpack-plugin.svg
[npm-url]: https://npmjs.com/package/write-assets-webpack-plugin
[npm-download]: https://img.shields.io/npm/dt/write-assets-webpack-plugin.svg

[node]: https://img.shields.io/node/v/write-assets-webpack-plugin.svg
[node-url]: https://nodejs.org

[deps]: https://david-dm.org/euclid1990/write-assets-webpack-plugin.svg
[deps-url]: https://david-dm.org/euclid1990/write-assets-webpack-plugin.svg

[tests]: http://img.shields.io/travis/euclid1990/write-assets-webpack-plugin.svg
[tests-url]: https://travis-ci.org/euclid1990/write-assets-webpack-plugin

<div align="center">
  <img width="200" height="200" src="https://worldvectorlogo.com/logos/html5.svg">
  <a href="https://github.com/webpack/webpack">
    <img width="200" height="200"
      src="https://webpack.js.org/assets/icon-square-big.svg">
  </a>
  <div>
    <img width="100" height="100" title="Webpack Plugin" src="http://michael-ciniawsky.github.io/postcss-load-plugins/logo.svg">
  </div>
  <h1>Write Assets Webpack Plugin</h1>
  <p>Force webpack-dev-server/webpack-dev-middleware/webpack-hot-middleware program to write bundle files to the file system.</p>
</div>

## Problem

The `webpack-dev-server` (even when you use `webpack-dev-middleware/webpack-hot-middleware`) doesn't write files to disk.

Relate issue on [webpack-dev-server repository](https://github.com/webpack/webpack-dev-server/issues/62) | [stackoverflow](https://stackoverflow.com/questions/33318457/bundle-js-file-output-and-webpack-dev-server).

If you want to force webpack-dev-server to write to the file system, you can use this plugin.

## Install

```bash
  npm i --save-dev write-assets-webpack-plugin
```
```bash
  yarn add --dev write-assets-webpack-plugin
```

## Usage

```js
const WriteAssetsWebpackPlugin = require('write-assets-webpack-plugin');
...
// Webpack configuration
module.exports = {
  entry: 'index.js',
  output: {
    path: __dirname + '/dist',
    filename: 'bundle.js'
  },
  ...
  plugins: [
    new WriteAssetsWebpackPlugin({ force: true })
  ]
}
```

See [Example](./example).

## Contribute

You're free to contribute to this project by submitting [issues](./issues) and/or [pull requests](./pulls).

### Dev guidelines

* Fork the repository and make changes on your fork in a feature branch.
* Commit messages must start with a capitalized and short summary.
* After every commit, make sure the test suite passes.
```bash
$ yarn run build:test
$ yarn run test
```
* To ensure consistency throughout the source code, keep these coding styles.
```bash
$ yarn run lint
```
* Or run development mode with eslint and babel auto transpiler
```bash
$ yarn run dev
```
* Before you submit your Pull Request (PR) consider the open or closed PR that relates to your submission.

### Test local package

You can testing this npm package before releasing it using [yarn link](https://yarnpkg.com/lang/en/docs/cli/link/) | [Verdaccio](https://github.com/verdaccio/verdaccio).
```bash
# Create verdaccio container
$ docker-compose up
# Register the first user for you
$ npm adduser --registry  http://localhost:4873
# Publishing the package locally
$ npm publish --registry http://localhost:4873
# Install package from locally registry
$ npm install write-assets-webpack-plugin --registry http://localhost:4873
```
