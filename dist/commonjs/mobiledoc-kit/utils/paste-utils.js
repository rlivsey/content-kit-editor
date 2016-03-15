/* global JSON */
'use strict';

exports.setClipboardCopyData = setClipboardCopyData;
exports.parsePostFromPaste = parsePostFromPaste;

var _parsersMobiledoc = require('../parsers/mobiledoc');

var _parsersHtml = require('../parsers/html');

var _parsersText = require('../parsers/text');

var _mobiledocHtmlRenderer = require('mobiledoc-html-renderer');

var _mobiledocTextRenderer = require('mobiledoc-text-renderer');

var MOBILEDOC_REGEX = new RegExp(/data\-mobiledoc='(.*?)'>/);
var MIME_TEXT_PLAIN = 'text/plain';
exports.MIME_TEXT_PLAIN = MIME_TEXT_PLAIN;
var MIME_TEXT_HTML = 'text/html';

exports.MIME_TEXT_HTML = MIME_TEXT_HTML;
function parsePostFromHTML(html, builder, plugins) {
  var post = undefined;

  if (MOBILEDOC_REGEX.test(html)) {
    var mobiledocString = html.match(MOBILEDOC_REGEX)[1];
    var mobiledoc = JSON.parse(mobiledocString);
    post = _parsersMobiledoc['default'].parse(builder, mobiledoc);
  } else {
    post = new _parsersHtml['default'](builder, { plugins: plugins }).parse(html);
  }

  return post;
}

function parsePostFromText(text, builder, plugins) {
  var parser = new _parsersText['default'](builder, { plugins: plugins });
  var post = parser.parse(text);
  return post;
}

// Sets the clipboard data in a cross-browser way.
function setClipboardData(clipboardData, html, plain) {
  if (clipboardData && clipboardData.setData) {
    clipboardData.setData(MIME_TEXT_HTML, html);
    clipboardData.setData(MIME_TEXT_PLAIN, plain);
  } else if (window.clipboardData && window.clipboardData.setData) {
    // IE
    // The Internet Explorers (including Edge) have a non-standard way of interacting with the
    // Clipboard API (see http://caniuse.com/#feat=clipboard). In short, they expose a global window.clipboardData
    // object instead of the per-event event.clipboardData object on the other browsers.
    window.clipboardData.setData('Text', html);
  }
}

// Gets the clipboard data in a cross-browser way.
function getClipboardData(clipboardData) {
  var html = undefined;
  var text = undefined;

  if (clipboardData && clipboardData.getData) {
    html = clipboardData.getData(MIME_TEXT_HTML);

    if (!html || html.length === 0) {
      // Fallback to 'text/plain'
      text = clipboardData.getData(MIME_TEXT_PLAIN);
    }
  } else if (window.clipboardData && window.clipboardData.getData) {
    // IE
    // The Internet Explorers (including Edge) have a non-standard way of interacting with the
    // Clipboard API (see http://caniuse.com/#feat=clipboard). In short, they expose a global window.clipboardData
    // object instead of the per-event event.clipboardData object on the other browsers.
    html = window.clipboardData.getData('Text');
  }

  return { html: html, text: text };
}

/**
 * @param {Event} copyEvent
 * @param {Editor}
 * @return null
 */

function setClipboardCopyData(copyEvent, editor) {
  var range = editor.range;
  var post = editor.post;

  var mobiledoc = post.cloneRange(range);

  var unknownCardHandler = function unknownCardHandler() {}; // ignore unknown cards
  var unknownAtomHandler = function unknownAtomHandler() {}; // ignore unknown atoms

  var _render = new _mobiledocHtmlRenderer['default']({ unknownCardHandler: unknownCardHandler, unknownAtomHandler: unknownAtomHandler }).render(mobiledoc);

  var innerHTML = _render.result;

  var html = '<div data-mobiledoc=\'' + JSON.stringify(mobiledoc) + '\'>' + innerHTML + '</div>';

  var _render2 = new _mobiledocTextRenderer['default']({ unknownCardHandler: unknownCardHandler, unknownAtomHandler: unknownAtomHandler }).render(mobiledoc);

  var plain = _render2.result;

  setClipboardData(copyEvent.clipboardData, html, plain);
}

/**
 * @param {Event} pasteEvent
 * @param {PostNodeBuilder} builder
 * @param {Array} plugins parser plugins
 * @return {Post}
 */

function parsePostFromPaste(pasteEvent, builder) {
  var plugins = arguments.length <= 2 || arguments[2] === undefined ? [] : arguments[2];

  var post = undefined;

  var _getClipboardData = getClipboardData(pasteEvent.clipboardData);

  var html = _getClipboardData.html;
  var text = _getClipboardData.text;

  if (html && html.length > 0) {
    post = parsePostFromHTML(html, builder, plugins);
  } else if (text && text.length > 0) {
    post = parsePostFromText(text, builder, plugins);
  }

  return post;
}