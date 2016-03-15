'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

exports.modifierMask = modifierMask;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _keycodes = require('./keycodes');

var _assert = require('./assert');

var DIRECTION = {
  FORWARD: 1,
  BACKWARD: -1
};
exports.DIRECTION = DIRECTION;
var MODIFIERS = {
  META: 1, // also called "command" on OS X
  CTRL: 2,
  SHIFT: 4,
  ALT: 8 // also called "option" on OS X
};

exports.MODIFIERS = MODIFIERS;

function modifierMask(event) {
  var metaKey = event.metaKey;
  var shiftKey = event.shiftKey;
  var ctrlKey = event.ctrlKey;
  var altKey = event.altKey;

  var modVal = function modVal(val, modifier) {
    return val && modifier || 0;
  };
  return modVal(metaKey, MODIFIERS.META) + modVal(shiftKey, MODIFIERS.SHIFT) + modVal(ctrlKey, MODIFIERS.CTRL) + modVal(altKey, MODIFIERS.ALT);
}

var SPECIAL_KEYS = {
  BACKSPACE: _keycodes['default'].BACKSPACE,
  TAB: _keycodes['default'].TAB,
  ENTER: _keycodes['default'].ENTER,
  ESC: _keycodes['default'].ESC,
  SPACE: _keycodes['default'].SPACE,
  PAGEUP: _keycodes['default'].PAGEUP,
  PAGEDOWN: _keycodes['default'].PAGEDOWN,
  END: _keycodes['default'].END,
  HOME: _keycodes['default'].HOME,
  LEFT: _keycodes['default'].LEFT,
  UP: _keycodes['default'].UP,
  RIGHT: _keycodes['default'].RIGHT,
  DOWN: _keycodes['default'].DOWN,
  INS: _keycodes['default'].INS,
  DEL: _keycodes['default'].DELETE
};

exports.SPECIAL_KEYS = SPECIAL_KEYS;
// heuristic for determining if `event` is a key event
function isKeyEvent(event) {
  return !!event.keyCode || !!event.metaKey || !!event.shiftKey || !!event.ctrlKey;
}

/**
 * An abstraction around a KeyEvent
 * that key listeners in the editor can use
 * to determine what sort of key was pressed
 */
var Key = (function () {
  function Key(event) {
    _classCallCheck(this, Key);

    this.keyCode = event.keyCode;
    this.event = event;
    this.modifierMask = modifierMask(event);
  }

  _createClass(Key, [{
    key: 'isEscape',
    value: function isEscape() {
      return this.keyCode === _keycodes['default'].ESC;
    }
  }, {
    key: 'isDelete',
    value: function isDelete() {
      return this.keyCode === _keycodes['default'].BACKSPACE || this.keyCode === _keycodes['default'].DELETE;
    }
  }, {
    key: 'isForwardDelete',
    value: function isForwardDelete() {
      return this.keyCode === _keycodes['default'].DELETE;
    }
  }, {
    key: 'isHorizontalArrow',
    value: function isHorizontalArrow() {
      return this.keyCode === _keycodes['default'].LEFT || this.keyCode === _keycodes['default'].RIGHT;
    }
  }, {
    key: 'isLeftArrow',
    value: function isLeftArrow() {
      return this.keyCode === _keycodes['default'].LEFT;
    }
  }, {
    key: 'isRightArrow',
    value: function isRightArrow() {
      return this.keyCode === _keycodes['default'].RIGHT;
    }
  }, {
    key: 'isSpace',
    value: function isSpace() {
      return this.keyCode === _keycodes['default'].SPACE;
    }
  }, {
    key: 'isTab',
    value: function isTab() {
      return this.keyCode === _keycodes['default'].TAB;
    }
  }, {
    key: 'isEnter',
    value: function isEnter() {
      return this.keyCode === _keycodes['default'].ENTER;
    }
  }, {
    key: 'isShift',
    value: function isShift() {
      return this.shiftKey;
    }
  }, {
    key: 'hasModifier',
    value: function hasModifier(modifier) {
      return modifier & this.modifierMask;
    }
  }, {
    key: 'hasAnyModifier',
    value: function hasAnyModifier() {
      return !!this.modifierMask;
    }
  }, {
    key: 'isChar',
    value: function isChar(string) {
      return this.keyCode === string.toUpperCase().charCodeAt(0);
    }

    /**
     * See https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/keyCode#Printable_keys_in_standard_position
     *   and http://stackoverflow.com/a/12467610/137784
     */
  }, {
    key: 'isPrintable',
    value: function isPrintable() {
      if (this.ctrlKey || this.metaKey) {
        return false;
      }

      var code = this.keyCode;

      return code >= _keycodes['default']['0'] && code <= _keycodes['default']['9'] || // number keys
      this.isSpace() || this.isTab() || this.isEnter() || code >= _keycodes['default'].A && code <= _keycodes['default'].Z || // letter keys
      code >= _keycodes['default'].NUMPAD_0 && code <= _keycodes['default'].NUMPAD_9 || // numpad keys
      code >= _keycodes['default'][';'] && code <= _keycodes['default']['`'] || // punctuation
      code >= _keycodes['default']['['] && code <= _keycodes['default']['"'] ||
      // FIXME the IME action seems to get lost when we issue an `editor.deleteSelection`
      // before it (in Chrome)
      code === _keycodes['default'].IME;
    }
  }, {
    key: 'direction',
    get: function get() {
      switch (true) {
        case this.isDelete():
          return this.isForwardDelete() ? DIRECTION.FORWARD : DIRECTION.BACKWARD;
        case this.isHorizontalArrow():
          return this.isRightArrow() ? DIRECTION.FORWARD : DIRECTION.BACKWARD;
      }
    }
  }, {
    key: 'ctrlKey',
    get: function get() {
      return MODIFIERS.CTRL & this.modifierMask;
    }
  }, {
    key: 'metaKey',
    get: function get() {
      return MODIFIERS.META & this.modifierMask;
    }
  }, {
    key: 'shiftKey',
    get: function get() {
      return MODIFIERS.SHIFT & this.modifierMask;
    }
  }, {
    key: 'altKey',
    get: function get() {
      return MODIFIERS.ALT & this.modifierMask;
    }
  }], [{
    key: 'fromEvent',
    value: function fromEvent(event) {
      (0, _assert['default'])('Must pass a Key event to Key.fromEvent', event && isKeyEvent(event));
      return new Key(event);
    }
  }]);

  return Key;
})();

exports['default'] = Key;