'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _modelsAtom = require('../models/atom');

var _modelsPost = require('../models/post');

var _modelsMarkupSection = require('../models/markup-section');

var _modelsListSection = require('../models/list-section');

var _modelsListItem = require('../models/list-item');

var _modelsImage = require('../models/image');

var _modelsMarker = require('../models/marker');

var _modelsMarkup = require('../models/markup');

var _modelsCard = require('../models/card');

var _utilsDomUtils = require('../utils/dom-utils');

var _utilsArrayUtils = require('../utils/array-utils');

var _modelsTypes = require('../models/types');

var _utilsAssert = require('../utils/assert');

function cacheKey(tagName, attributes) {
  return (0, _utilsDomUtils.normalizeTagName)(tagName) + '-' + (0, _utilsArrayUtils.objectToSortedKVArray)(attributes).join('-');
}

function addMarkupToCache(cache, markup) {
  cache[cacheKey(markup.tagName, markup.attributes)] = markup;
}

function findMarkupInCache(cache, tagName, attributes) {
  var key = cacheKey(tagName, attributes);
  return cache[key];
}

var PostNodeBuilder = (function () {
  function PostNodeBuilder() {
    _classCallCheck(this, PostNodeBuilder);

    this.markupCache = {};
  }

  _createClass(PostNodeBuilder, [{
    key: 'createPost',
    value: function createPost() {
      var sections = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];

      var post = new _modelsPost['default']();
      post.builder = this;

      sections.forEach(function (s) {
        return post.sections.append(s);
      });

      return post;
    }
  }, {
    key: 'createMarkerableSection',
    value: function createMarkerableSection(type, tagName) {
      var markers = arguments.length <= 2 || arguments[2] === undefined ? [] : arguments[2];

      switch (type) {
        case _modelsTypes.LIST_ITEM_TYPE:
          return this.createListItem(tagName, markers);
        case _modelsTypes.MARKUP_SECTION_TYPE:
          return this.createMarkupSection(tagName, markers);
        default:
          (0, _utilsAssert['default'])('Cannot create markerable section of type ' + type, false);
      }
    }
  }, {
    key: 'createMarkupSection',
    value: function createMarkupSection() {
      var tagName = arguments.length <= 0 || arguments[0] === undefined ? _modelsMarkupSection.DEFAULT_TAG_NAME : arguments[0];
      var markers = arguments.length <= 1 || arguments[1] === undefined ? [] : arguments[1];
      var isGenerated = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];

      tagName = (0, _utilsDomUtils.normalizeTagName)(tagName);
      var section = new _modelsMarkupSection['default'](tagName, markers);
      if (isGenerated) {
        section.isGenerated = true;
      }
      section.builder = this;
      return section;
    }
  }, {
    key: 'createListSection',
    value: function createListSection() {
      var tagName = arguments.length <= 0 || arguments[0] === undefined ? _modelsListSection.DEFAULT_TAG_NAME : arguments[0];
      var items = arguments.length <= 1 || arguments[1] === undefined ? [] : arguments[1];

      tagName = (0, _utilsDomUtils.normalizeTagName)(tagName);
      var section = new _modelsListSection['default'](tagName, items);
      section.builder = this;
      return section;
    }
  }, {
    key: 'createListItem',
    value: function createListItem() {
      var markers = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];

      var tagName = (0, _utilsDomUtils.normalizeTagName)('li');
      var item = new _modelsListItem['default'](tagName, markers);
      item.builder = this;
      return item;
    }
  }, {
    key: 'createImageSection',
    value: function createImageSection(url) {
      var section = new _modelsImage['default']();
      if (url) {
        section.src = url;
      }
      return section;
    }
  }, {
    key: 'createCardSection',
    value: function createCardSection(name) {
      var payload = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      var card = new _modelsCard['default'](name, payload);
      card.builder = this;
      return card;
    }
  }, {
    key: 'createMarker',
    value: function createMarker(value) {
      var markups = arguments.length <= 1 || arguments[1] === undefined ? [] : arguments[1];

      var marker = new _modelsMarker['default'](value, markups);
      marker.builder = this;
      return marker;
    }
  }, {
    key: 'createAtom',
    value: function createAtom(name) {
      var text = arguments.length <= 1 || arguments[1] === undefined ? '' : arguments[1];
      var payload = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
      var markups = arguments.length <= 3 || arguments[3] === undefined ? [] : arguments[3];

      var atom = new _modelsAtom['default'](name, text, payload, markups);
      atom.builder = this;
      return atom;
    }

    /**
     * @param {Object} attributes {key:value}
     */
  }, {
    key: 'createMarkup',
    value: function createMarkup(tagName) {
      var attributes = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      tagName = (0, _utilsDomUtils.normalizeTagName)(tagName);

      var markup = findMarkupInCache(this.markupCache, tagName, attributes);
      if (!markup) {
        markup = new _modelsMarkup['default'](tagName, attributes);
        markup.builder = this;
        addMarkupToCache(this.markupCache, markup);
      }

      return markup;
    }
  }]);

  return PostNodeBuilder;
})();

exports['default'] = PostNodeBuilder;