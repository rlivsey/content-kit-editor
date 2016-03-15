'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _position = require('./position');

var _key = require('../key');

var Range = (function () {
  function Range(head) {
    var tail = arguments.length <= 1 || arguments[1] === undefined ? head : arguments[1];
    var direction = arguments.length <= 2 || arguments[2] === undefined ? _key.DIRECTION.FORWARD : arguments[2];
    return (function () {
      _classCallCheck(this, Range);

      this.head = head;
      this.tail = tail;
      this.direction = direction;
    }).apply(this, arguments);
  }

  _createClass(Range, [{
    key: 'trimTo',

    /**
     * @param {Markerable} section
     * @return {Range} A range that is constrained to only the part that
     * includes the section.
     * FIXME -- if the section isn't the head or tail, it's assumed to be
     * wholly contained. It's possible to call `trimTo` with a selection that is
     * outside of the range, though, which would invalidate that assumption.
     * There's no efficient way to determine if a section is within a range, yet.
     */
    value: function trimTo(section) {
      var length = section.length;

      var headOffset = section === this.head.section ? Math.min(this.head.offset, length) : 0;
      var tailOffset = section === this.tail.section ? Math.min(this.tail.offset, length) : length;

      return Range.create(section, headOffset, section, tailOffset);
    }
  }, {
    key: 'moveFocusedPosition',
    value: function moveFocusedPosition(direction) {
      switch (this.direction) {
        case _key.DIRECTION.FORWARD:
          return new Range(this.head, this.tail.move(direction), this.direction);
        case _key.DIRECTION.BACKWARD:
          return new Range(this.head.move(direction), this.tail, this.direction);
        default:
          return new Range(this.head, this.tail, direction).moveFocusedPosition(direction);
      }
    }
  }, {
    key: 'isEqual',
    value: function isEqual(other) {
      return this.head.isEqual(other.head) && this.tail.isEqual(other.tail);
    }
  }, {
    key: 'isBlank',
    get: function get() {
      return this.head.isBlank && this.tail.isBlank;
    }

    // "legacy" APIs
  }, {
    key: 'headSection',
    get: function get() {
      return this.head.section;
    }
  }, {
    key: 'tailSection',
    get: function get() {
      return this.tail.section;
    }
  }, {
    key: 'headSectionOffset',
    get: function get() {
      return this.head.offset;
    }
  }, {
    key: 'tailSectionOffset',
    get: function get() {
      return this.tail.offset;
    }
  }, {
    key: 'isCollapsed',
    get: function get() {
      return this.head.isEqual(this.tail);
    }
  }, {
    key: 'headMarker',
    get: function get() {
      return this.head.marker;
    }
  }, {
    key: 'tailMarker',
    get: function get() {
      return this.tail.marker;
    }
  }, {
    key: 'headMarkerOffset',
    get: function get() {
      return this.head.offsetInMarker;
    }
  }, {
    key: 'tailMarkerOffset',
    get: function get() {
      return this.tail.offsetInMarker;
    }
  }], [{
    key: 'create',
    value: function create(headSection, headOffset) {
      var tailSection = arguments.length <= 2 || arguments[2] === undefined ? headSection : arguments[2];
      var tailOffset = arguments.length <= 3 || arguments[3] === undefined ? headOffset : arguments[3];
      return (function () {
        return new Range(new _position['default'](headSection, headOffset), new _position['default'](tailSection, tailOffset));
      })();
    }
  }, {
    key: 'fromSection',
    value: function fromSection(section) {
      return new Range(section.headPosition(), section.tailPosition());
    }
  }, {
    key: 'blankRange',
    value: function blankRange() {
      return new Range(_position['default'].blankPosition(), _position['default'].blankPosition());
    }
  }]);

  return Range;
})();

exports['default'] = Range;