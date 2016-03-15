'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _assert = require('./assert');

var LifecycleCallbacksMixin = (function () {
  function LifecycleCallbacksMixin() {
    _classCallCheck(this, LifecycleCallbacksMixin);
  }

  _createClass(LifecycleCallbacksMixin, [{
    key: 'runCallbacks',
    value: function runCallbacks(queueName) {
      var args = arguments.length <= 1 || arguments[1] === undefined ? [] : arguments[1];

      this._callbacksForRemoval = [];
      var queue = this._getQueue(queueName);
      queue.forEach(function (cb) {
        return cb.apply(undefined, _toConsumableArray(args));
      });

      var toRemove = this._removalQueues[queueName] || [];
      toRemove.forEach(function (cb) {
        if (queue.indexOf(cb) !== -1) {
          queue.splice(queue.indexOf(cb), 1);
        }
      });

      this._removalQueues[queueName] = [];
    }
  }, {
    key: 'addCallback',
    value: function addCallback(queueName, callback) {
      this._getQueue(queueName).push(callback);
    }
  }, {
    key: '_scheduleCallbackForRemoval',
    value: function _scheduleCallbackForRemoval(queueName, callback) {
      if (!this._removalQueues[queueName]) {
        this._removalQueues[queueName] = [];
      }
      this._removalQueues[queueName].push(callback);
    }
  }, {
    key: 'addCallbackOnce',
    value: function addCallbackOnce(queueName, callback) {
      var queue = this._getQueue(queueName);
      if (queue.indexOf(callback) === -1) {
        queue.push(callback);
        this._scheduleCallbackForRemoval(queueName, callback);
      }
    }
  }, {
    key: '_getQueue',
    value: function _getQueue(queueName) {
      (0, _assert['default'])('Must pass queue name to runCallbacks', !!queueName);
      this.callbackQueues[queueName] = this.callbackQueues[queueName] || [];
      return this.callbackQueues[queueName];
    }
  }, {
    key: 'callbackQueues',
    get: function get() {
      this._callbackQueues = this._callbackQueues || {};
      return this._callbackQueues;
    }
  }, {
    key: '_removalQueues',
    get: function get() {
      if (!this.__removalQueues) {
        this.__removalQueues = {};
      }
      return this.__removalQueues;
    }
  }]);

  return LifecycleCallbacksMixin;
})();

exports['default'] = LifecycleCallbacksMixin;