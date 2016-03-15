'use strict';

exports.registerGlobal = registerGlobal;

var _editorEditor = require('./editor/editor');

var _cardsImage = require('./cards/image');

var _utilsCursorRange = require('./utils/cursor/range');

var _utilsMobiledocError = require('./utils/mobiledoc-error');

var _version = require('./version');

var Mobiledoc = {
  Editor: _editorEditor['default'],
  ImageCard: _cardsImage['default'],
  Range: _utilsCursorRange['default'],
  Error: _utilsMobiledocError['default'],
  VERSION: _version['default']
};

function registerGlobal(global) {
  global.Mobiledoc = Mobiledoc;
}

exports.Editor = _editorEditor['default'];
exports['default'] = Mobiledoc;