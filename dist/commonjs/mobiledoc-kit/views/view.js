'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _utilsMixin = require('../utils/mixin');

var _utilsEventListener = require('../utils/event-listener');

var _utilsDomUtils = require('../utils/dom-utils');

var View = (function () {
  function View() {
    var _this = this;

    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, View);

    options.tagName = options.tagName || 'div';
    options.container = options.container || document.body;

    this.element = document.createElement(options.tagName);
    this.container = options.container;
    this.isShowing = false;

    var classNames = options.classNames || [];
    classNames.forEach(function (name) {
      return (0, _utilsDomUtils.addClassName)(_this.element, name);
    });
  }

  _createClass(View, [{
    key: 'show',
    value: function show() {
      if (!this.isShowing) {
        this.container.appendChild(this.element);
        this.isShowing = true;
        return true;
      }
    }
  }, {
    key: 'hide',
    value: function hide() {
      if (this.isShowing) {
        this.container.removeChild(this.element);
        this.isShowing = false;
        return true;
      }
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      this.removeAllEventListeners();
      this.hide();
      this._isDestroyed = true;
    }
  }]);

  return View;
})();

(0, _utilsMixin['default'])(View, _utilsEventListener['default']);

exports['default'] = View;