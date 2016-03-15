'use strict';

exports.buildKeyCommand = buildKeyCommand;
exports.validateKeyCommand = validateKeyCommand;
exports.findKeyCommands = findKeyCommands;

function _toArray(arr) { return Array.isArray(arr) ? arr : Array.from(arr); }

var _utilsKey = require('../utils/key');

var _utilsArrayUtils = require('../utils/array-utils');

var _utilsAssert = require('../utils/assert');

var _utilsCursorRange = require('../utils/cursor/range');

var _utilsBrowser = require('../utils/browser');

var DEFAULT_KEY_COMMANDS = [{
  str: 'META+B',
  run: function run(editor) {
    if (editor.range.isCollapsed) {
      document.execCommand('bold', false, null);
    } else {
      editor.run(function (postEditor) {
        return postEditor.toggleMarkup('strong');
      });
    }
  }
}, {
  str: 'CTRL+B',
  run: function run(editor) {
    if (editor.range.isCollapsed) {
      document.execCommand('bold', false, null);
    } else {
      editor.run(function (postEditor) {
        return postEditor.toggleMarkup('strong');
      });
    }
  }
}, {
  str: 'META+I',
  run: function run(editor) {
    if (editor.range.isCollapsed) {
      document.execCommand('italic', false, null);
    } else {
      editor.run(function (postEditor) {
        return postEditor.toggleMarkup('em');
      });
    }
  }
}, {
  str: 'CTRL+I',
  run: function run(editor) {
    if (editor.range.isCollapsed) {
      document.execCommand('italic', false, null);
    } else {
      editor.run(function (postEditor) {
        return postEditor.toggleMarkup('em');
      });
    }
  }
}, {
  str: 'CTRL+K',
  run: function run(editor) {
    var range = editor.range;

    if (range.isCollapsed) {
      range = new _utilsCursorRange['default'](range.head, range.head.section.tailPosition());
    }
    editor.run(function (postEditor) {
      var nextPosition = postEditor.deleteRange(range);
      postEditor.setRange(new _utilsCursorRange['default'](nextPosition));
    });
  }
}, {
  str: 'CTRL+A',
  run: function run(editor) {
    if (!_utilsBrowser['default'].isMac) {
      return false;
    }
    var range = editor.range;
    var section = range.head.section;

    editor.run(function (postEditor) {
      postEditor.setRange(new _utilsCursorRange['default'](section.headPosition()));
    });
  }
}, {
  str: 'CTRL+E',
  run: function run(editor) {
    if (!_utilsBrowser['default'].isMac) {
      return false;
    }
    var range = editor.range;
    var section = range.tail.section;

    editor.run(function (postEditor) {
      postEditor.setRange(new _utilsCursorRange['default'](section.tailPosition()));
    });
  }
}, {
  str: 'META+K',
  run: function run(editor) {
    if (editor.range.isCollapsed) {
      return;
    }

    var selectedText = editor.cursor.selectedText();
    var defaultUrl = '';
    if (selectedText.indexOf('http') !== -1) {
      defaultUrl = selectedText;
    }

    var range = editor.range;

    var hasLink = editor.detectMarkupInRange(range, 'a');

    if (hasLink) {
      editor.run(function (postEditor) {
        return postEditor.toggleMarkup('a');
      });
    } else {
      editor.showPrompt('Enter a URL', defaultUrl, function (url) {
        if (!url) {
          return;
        }

        editor.run(function (postEditor) {
          var markup = postEditor.builder.createMarkup('a', { href: url });
          postEditor.toggleMarkup(markup);
        });
      });
    }
  }
}, {
  str: 'META+Z',
  run: function run(editor) {
    editor.run(function (postEditor) {
      postEditor.undoLastChange();
    });
  }
}, {
  str: 'META+SHIFT+Z',
  run: function run(editor) {
    editor.run(function (postEditor) {
      postEditor.redoLastChange();
    });
  }
}, {
  str: 'CTRL+Z',
  run: function run(editor) {
    if (_utilsBrowser['default'].isMac) {
      return false;
    }
    editor.run(function (postEditor) {
      return postEditor.undoLastChange();
    });
  }
}, {
  str: 'CTRL+SHIFT+Z',
  run: function run(editor) {
    if (_utilsBrowser['default'].isMac) {
      return false;
    }
    editor.run(function (postEditor) {
      return postEditor.redoLastChange();
    });
  }
}];

exports.DEFAULT_KEY_COMMANDS = DEFAULT_KEY_COMMANDS;
function modifierNamesToMask(modiferNames) {
  var defaultVal = 0;
  return (0, _utilsArrayUtils.reduce)(modiferNames, function (sum, name) {
    var modifier = _utilsKey.MODIFIERS[name.toUpperCase()];
    (0, _utilsAssert['default'])('No modifier named "' + name + '" found', !!modifier);
    return sum + modifier;
  }, defaultVal);
}

function characterToCode(character) {
  var upperCharacter = character.toUpperCase();
  var special = _utilsKey.SPECIAL_KEYS[upperCharacter];
  if (special) {
    return special;
  } else {
    (0, _utilsAssert['default'])('Only 1 character can be used in a key command str (got "' + character + '")', character.length === 1);
    return upperCharacter.charCodeAt(0);
  }
}

function buildKeyCommand(keyCommand) {
  var str = keyCommand.str;

  if (!str) {
    return keyCommand;
  }
  (0, _utilsAssert['default'])('[deprecation] Key commands no longer use the `modifier` property', !keyCommand.modifier);

  var _str$split$reverse = str.split('+').reverse();

  var _str$split$reverse2 = _toArray(_str$split$reverse);

  var character = _str$split$reverse2[0];

  var modifierNames = _str$split$reverse2.slice(1);

  keyCommand.modifierMask = modifierNamesToMask(modifierNames);
  keyCommand.code = characterToCode(character);

  return keyCommand;
}

function validateKeyCommand(keyCommand) {
  return !!keyCommand.code && !!keyCommand.run;
}

function findKeyCommands(keyCommands, keyEvent) {
  var key = _utilsKey['default'].fromEvent(keyEvent);

  return (0, _utilsArrayUtils.filter)(keyCommands, function (_ref) {
    var modifierMask = _ref.modifierMask;
    var code = _ref.code;

    return key.keyCode === code && key.modifierMask === modifierMask;
  });
}