'use strict';

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

function _toArray(arr) { return Array.isArray(arr) ? arr : Array.from(arr); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _arrayUtils = require('./array-utils');

var EventListenerMixin = (function () {
  function EventListenerMixin() {
    _classCallCheck(this, EventListenerMixin);
  }

  _createClass(EventListenerMixin, [{
    key: 'addEventListener',
    value: function addEventListener(context, eventName, listener) {
      if (!this._eventListeners) {
        this._eventListeners = [];
      }
      context.addEventListener(eventName, listener);
      this._eventListeners.push([context, eventName, listener]);
    }
  }, {
    key: 'removeAllEventListeners',
    value: function removeAllEventListeners() {
      var listeners = this._eventListeners || [];
      listeners.forEach(function (_ref) {
        var _ref2 = _toArray(_ref);

        var context = _ref2[0];

        var args = _ref2.slice(1);

        context.removeEventListener.apply(context, _toConsumableArray(args));
      });
    }

    // This is primarily useful for programmatically simulating events on the
    // editor from the tests.
  }, {
    key: 'triggerEvent',
    value: function triggerEvent(context, eventName, event) {
      var matches = (0, _arrayUtils.filter)(this._eventListeners, function (_ref3) {
        var _ref32 = _slicedToArray(_ref3, 2);

        var _context = _ref32[0];
        var _eventName = _ref32[1];

        return context === _context && eventName === _eventName;
      });
      matches.forEach(function (_ref4) {
        var _ref42 = _slicedToArray(_ref4, 3);

        var context = _ref42[0];
        var eventName = _ref42[1];
        var listener = _ref42[2];

        listener.call(context, event);
      });
    }
  }]);

  return EventListenerMixin;
})();

exports['default'] = EventListenerMixin;