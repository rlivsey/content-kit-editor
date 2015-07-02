/* jshint node:true */

var builder = require('broccoli-multi-builder');
var mergeTrees = require('broccoli-merge-trees');
var testTreeBuilder = require('broccoli-test-builder');
var styles = require('./broccoli/styles');
var demo = require('./broccoli/demo');

var vendoredModules = [
    {name: 'content-kit-compiler', options: {libDirName: 'src'}},
    {name: 'content-kit-utils', options: {libDirName: 'src'}}
];
var packageName = require('./package.json').name;

var buildOptions = {
  libDirName: 'src/js',
  vendoredModules: vendoredModules,
  packageName: packageName
};

module.exports = mergeTrees([
  builder.build('amd', buildOptions),
  builder.build('global', buildOptions),
  // FIXME Later we may want to bring back the commonjs build
  // builder.build('commonjs', buildOptions),
  styles(),
  demo(),
  testTreeBuilder.build()
]);