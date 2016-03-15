'use strict';

exports.validateExpansion = validateExpansion;
exports.findExpansion = findExpansion;

var _utilsKeycodes = require('../utils/keycodes');

var _utilsKey = require('../utils/key');

var _utilsArrayUtils = require('../utils/array-utils');

var _utilsCursorRange = require('../utils/cursor/range');

var SPACE = _utilsKeycodes['default'].SPACE;

function replaceWithListSection(editor, listTagName) {
  var section = editor.cursor.offsets.head.section;

  editor.run(function (postEditor) {
    var builder = postEditor.builder;

    var listItem = builder.createListItem();
    var listSection = builder.createListSection(listTagName, [listItem]);

    postEditor.replaceSection(section, listSection);
    postEditor.setRange(new _utilsCursorRange['default'](listSection.tailPosition()));
  });
}

function replaceWithHeaderSection(editor, headingTagName) {
  var section = editor.cursor.offsets.head.section;

  editor.run(function (postEditor) {
    var builder = postEditor.builder;

    var newSection = builder.createMarkupSection(headingTagName);

    postEditor.replaceSection(section, newSection);
    postEditor.setRange(new _utilsCursorRange['default'](newSection.tailPosition()));
  });
}

function validateExpansion(expansion) {
  return !!expansion.trigger && !!expansion.text && !!expansion.run;
}

var DEFAULT_TEXT_EXPANSIONS = [{
  trigger: SPACE,
  text: '*',
  run: function run(editor) {
    replaceWithListSection(editor, 'ul');
  }
}, {
  trigger: SPACE,
  text: '1',
  run: function run(editor) {
    replaceWithListSection(editor, 'ol');
  }
}, {
  trigger: SPACE,
  text: '1.',
  run: function run(editor) {
    replaceWithListSection(editor, 'ol');
  }
}, {
  trigger: SPACE,
  text: '##',
  run: function run(editor) {
    replaceWithHeaderSection(editor, 'h2');
  }
}, {
  trigger: SPACE,
  text: '###',
  run: function run(editor) {
    replaceWithHeaderSection(editor, 'h3');
  }
}];

exports.DEFAULT_TEXT_EXPANSIONS = DEFAULT_TEXT_EXPANSIONS;

function findExpansion(expansions, keyEvent, editor) {
  var key = _utilsKey['default'].fromEvent(keyEvent);
  if (!key.isPrintable()) {
    return;
  }

  var range = editor.range;

  if (!range.isCollapsed) {
    return;
  }

  var head = range.head;
  var section = range.head.section;

  if (head.isBlank) {
    return;
  }
  if (!section.isMarkupSection) {
    return;
  }

  var marker = head.marker;

  // Only fire expansions at start of section
  if (marker && marker.prev) {
    return;
  }

  var _text = marker && marker.value;

  return (0, _utilsArrayUtils.detect)(expansions, function (_ref) {
    var trigger = _ref.trigger;
    var text = _ref.text;

    return key.keyCode === trigger && _text === text;
  });
}