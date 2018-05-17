'use strict';

import fs from 'fs';
import path from 'path';
import mkdirp from 'mkdirp';

class NodeOutputFileSystem {
  constructor() {
    this.mkdirp = mkdirp;
    this.mkdir = fs.mkdir.bind(fs);
    this.rmdir = fs.rmdir.bind(fs);
    this.unlink = fs.unlink.bind(fs);
    this.writeFile = fs.writeFile.bind(fs);
    this.join = path.join.bind(path);
    this.dirname = path.dirname.bind(path);
  }
}

module.exports = NodeOutputFileSystem;
