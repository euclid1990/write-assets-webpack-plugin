/* globals describe, beforeEach, it, __dirname */

import fs from 'fs';
import path from 'path';
import rimraf from 'rimraf';
import globby from 'globby';
import { expect } from 'chai';
import Compiler from 'webpack/lib/Compiler';
import NodeJsInputFileSystem from 'enhanced-resolve/lib/NodeJsInputFileSystem';

const WriteAssetsWebpackPlugin = require('./../dist/index');
const FIXTURE_DIR = path.join(__dirname, 'fixtures');
const ASSETS_DIR = path.join(__dirname, 'fixtures/assets');
const BUILD_DIR = path.join(__dirname, 'fixtures/build');

class MockCompiler extends Compiler {
  constructor(opts = {}) {
    let options = {
      context: FIXTURE_DIR,
      output: {
        path: opts.outputPath || BUILD_DIR
      },
      module: {
        defaultRules: [],
        rules: []
      }
    };
    Object.assign(options, opts);
    super(options.context);
    this.options = options;
    this.inputFileSystem = new NodeJsInputFileSystem();
  }
}

const stat = (inputFileSystem, path) => inputFileSystem.statSync(path);

const readFile = (inputFileSystem, path) => inputFileSystem.readFileSync(path);

// Ideally we pass in patterns and confirm the resulting assets
const run = (opts = { pluginOptions: { debug: false }, compilerOptions: {} }) => {
  return new Promise((resolve, reject) => {
    // Init self plugin
    const plugin = new WriteAssetsWebpackPlugin(opts.pluginOptions);

    // Get a mock compiler to pass to plugin apply(compiler) method
    const compiler = opts.compiler || new MockCompiler(opts.compilerOptions || {});

    // Call apply property by webpack compiler
    plugin.apply(compiler);

    // Define compilation and callback
    const params = compiler.newCompilationParams();
    const compilation = opts.compilation || compiler.newCompilation(params);

    // Fake assets data from fixtures
    let assetFiles = globby.sync('*/**', { cwd: ASSETS_DIR, onlyFiles: true });
    assetFiles.forEach(f => {
      let st = stat(compiler.inputFileSystem, path.resolve(ASSETS_DIR, f));
      let content = readFile(compiler.inputFileSystem, path.resolve(ASSETS_DIR, f));
      compilation.assets[f] = {
        size: function() {
          return st.size;
        },
        source: function() {
          return content;
        }
      };
    });

    // Callback when hooks event callAsync is called
    const cb = () => {};

    // Execute the functions in series
    return Promise.resolve()
      .then(() => compiler.hooks.emit.promise(compilation, cb).then(() => {
        return compilation;
      }))
      .then(compilation => compiler.hooks.afterEmit.promise(compilation, cb).then(() => {
        return compilation;
      }))
      .then(compilation => {
        if (opts.expectedErrors) {
          expect(compilation.errors).to.deep.equal(opts.expectedErrors);
        } else if (compilation.errors.length > 0) {
          throw compilation.errors[0];
        } else {
          expect(compilation.errors.join('\n')).to.equal('');
        }
        resolve(compilation);
      })
      .catch(reject);
  });
};

describe('WriteAssetsWebpackPlugin', function() {
  beforeEach(function(done) {
    rimraf(BUILD_DIR, done);
  });

  describe('#apply()', function() {
    it('create build directory', function(done) {
      run()
        .then(res => {
          expect(fs.existsSync(BUILD_DIR)).to.equal(true);
        })
        .then(done);
    });

    it('write all assets files to build directory', function(done) {
      run()
        .then(res => {
          let buildFiles = globby.sync('*/**', { cwd: BUILD_DIR, onlyFiles: true });
          let assetFiles = globby.sync('*/**', { cwd: ASSETS_DIR, onlyFiles: true });
          expect(buildFiles).to.be.an('array').that.have.same.members(assetFiles);
        })
        .then(done);
    });

    it('write only image files to build directory', function(done) {
      run({ pluginOptions: { debug: false, extension: ['png'] } })
        .then(res => {
          let buildFiles = globby.sync('*/**', { cwd: BUILD_DIR, onlyFiles: true });
          buildFiles.forEach(e => {
            expect(path.extname(e).substring(1)).to.equal('png');
          });
        })
        .then(done);
    });
  });
});
