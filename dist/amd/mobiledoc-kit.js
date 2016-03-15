define('mobiledoc-html-renderer/cards/image', ['exports', 'mobiledoc-html-renderer/utils/render-type'], function (exports, _mobiledocHtmlRendererUtilsRenderType) {
  'use strict';

  exports['default'] = {
    name: 'image-card',
    type: _mobiledocHtmlRendererUtilsRenderType['default'],
    render: function render(_ref) {
      var env = _ref.env;
      var options = _ref.options;
      var payload = _ref.payload;

      if (payload.src) {
        return '<img src="' + payload.src + '">';
      }
    }
  };
});
define('mobiledoc-html-renderer', ['exports', 'mobiledoc-html-renderer/renderer-factory', 'mobiledoc-html-renderer/utils/render-type'], function (exports, _mobiledocHtmlRendererRendererFactory, _mobiledocHtmlRendererUtilsRenderType) {
  'use strict';

  exports.registerGlobal = registerGlobal;

  function registerGlobal(window) {
    window.MobiledocHTMLRenderer = _mobiledocHtmlRendererRendererFactory['default'];
  }

  exports.RENDER_TYPE = _mobiledocHtmlRendererUtilsRenderType['default'];
  exports['default'] = _mobiledocHtmlRendererRendererFactory['default'];
});
define('mobiledoc-html-renderer/renderer-factory', ['exports', 'mobiledoc-html-renderer/renderers/0-2', 'mobiledoc-html-renderer/renderers/0-3', 'mobiledoc-html-renderer/utils/render-type'], function (exports, _mobiledocHtmlRendererRenderers02, _mobiledocHtmlRendererRenderers03, _mobiledocHtmlRendererUtilsRenderType) {
  'use strict';

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  function validateCards(cards) {
    if (!Array.isArray(cards)) {
      throw new Error('`cards` must be passed as an array');
    }
    for (var i = 0; i < cards.length; i++) {
      var card = cards[i];
      if (card.type !== _mobiledocHtmlRendererUtilsRenderType['default']) {
        throw new Error('Card "' + card.name + '" must be of type "' + _mobiledocHtmlRendererUtilsRenderType['default'] + '", was "' + card.type + '"');
      }
      if (!card.render) {
        throw new Error('Card "' + card.name + '" must define `render`');
      }
    }
  }

  function validateAtoms(atoms) {
    if (!Array.isArray(atoms)) {
      throw new Error('`atoms` must be passed as an array');
    }
    for (var i = 0; i < atoms.length; i++) {
      var atom = atoms[i];
      if (atom.type !== _mobiledocHtmlRendererUtilsRenderType['default']) {
        throw new Error('Atom "' + atom.name + '" must be type "' + _mobiledocHtmlRendererUtilsRenderType['default'] + '", was "' + atom.type + '"');
      }
      if (!atom.render) {
        throw new Error('Atom "' + atom.name + '" must define `render`');
      }
    }
  }

  var RendererFactory = (function () {
    function RendererFactory() {
      var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      var cards = _ref.cards;
      var atoms = _ref.atoms;
      var cardOptions = _ref.cardOptions;
      var unknownCardHandler = _ref.unknownCardHandler;
      var unknownAtomHandler = _ref.unknownAtomHandler;
      var sectionElementRenderer = _ref.sectionElementRenderer;

      _classCallCheck(this, RendererFactory);

      cards = cards || [];
      validateCards(cards);
      atoms = atoms || [];
      validateAtoms(atoms);
      cardOptions = cardOptions || {};

      this.state = {
        cards: cards,
        atoms: atoms,
        cardOptions: cardOptions,
        unknownCardHandler: unknownCardHandler,
        unknownAtomHandler: unknownAtomHandler,
        sectionElementRenderer: sectionElementRenderer
      };
    }

    _createClass(RendererFactory, [{
      key: 'render',
      value: function render(mobiledoc) {
        var version = mobiledoc.version;

        switch (version) {
          case _mobiledocHtmlRendererRenderers02.MOBILEDOC_VERSION:
          case undefined:
          case null:
            return new _mobiledocHtmlRendererRenderers02['default'](mobiledoc, this.state).render();
          case _mobiledocHtmlRendererRenderers03.MOBILEDOC_VERSION:
            return new _mobiledocHtmlRendererRenderers03['default'](mobiledoc, this.state).render();
          default:
            throw new Error('Unexpected Mobiledoc version "' + version + '"');
        }
      }
    }]);

    return RendererFactory;
  })();

  exports['default'] = RendererFactory;
});
define('mobiledoc-html-renderer/renderers/0-2', ['exports', 'mobiledoc-html-renderer/utils/dom', 'mobiledoc-html-renderer/cards/image', 'mobiledoc-html-renderer/utils/render-type', 'mobiledoc-html-renderer/utils/section-types', 'mobiledoc-html-renderer/utils/tag-names'], function (exports, _mobiledocHtmlRendererUtilsDom, _mobiledocHtmlRendererCardsImage, _mobiledocHtmlRendererUtilsRenderType, _mobiledocHtmlRendererUtilsSectionTypes, _mobiledocHtmlRendererUtilsTagNames) {
  'use strict';

  var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  var MOBILEDOC_VERSION = '0.2.0';

  exports.MOBILEDOC_VERSION = MOBILEDOC_VERSION;
  /**
   * runtime HTML renderer
   * renders a mobiledoc to HTML
   *
   * input: mobiledoc
   * output: HTML
   */

  function createElementFromMarkerType() {
    var _ref = arguments.length <= 0 || arguments[0] === undefined ? ['', []] : arguments[0];

    var _ref2 = _slicedToArray(_ref, 2);

    var tagName = _ref2[0];
    var attributes = _ref2[1];

    var element = (0, _mobiledocHtmlRendererUtilsDom.createElement)(tagName);
    attributes = attributes || [];

    for (var i = 0, l = attributes.length; i < l; i = i + 2) {
      var propName = attributes[i],
          propValue = attributes[i + 1];
      (0, _mobiledocHtmlRendererUtilsDom.setAttribute)(element, propName, propValue);
    }
    return element;
  }

  function validateVersion(version) {
    if (version !== MOBILEDOC_VERSION) {
      throw new Error('Unexpected Mobiledoc version "' + version + '"');
    }
  }

  var Renderer = (function () {
    function Renderer(mobiledoc, state) {
      _classCallCheck(this, Renderer);

      var cards = state.cards;
      var cardOptions = state.cardOptions;
      var unknownCardHandler = state.unknownCardHandler;
      var sectionElementRenderer = state.sectionElementRenderer;
      var version = mobiledoc.version;
      var sectionData = mobiledoc.sections;

      validateVersion(version);

      var _sectionData = _slicedToArray(sectionData, 2);

      var markerTypes = _sectionData[0];
      var sections = _sectionData[1];

      this.root = (0, _mobiledocHtmlRendererUtilsDom.createDocumentFragment)();
      this.markerTypes = markerTypes;
      this.sections = sections;
      this.cards = cards;
      this.cardOptions = cardOptions;
      this.unknownCardHandler = unknownCardHandler || this._defaultUnknownCardHandler;

      this.sectionElementRenderer = {};
      if (sectionElementRenderer) {
        for (var key in sectionElementRenderer) {
          if (sectionElementRenderer.hasOwnProperty(key)) {
            this.sectionElementRenderer[key.toLowerCase()] = sectionElementRenderer[key];
          }
        }
      }

      this._teardownCallbacks = [];
    }

    _createClass(Renderer, [{
      key: 'render',
      value: function render() {
        var _this = this;

        this.sections.forEach(function (section) {
          var rendered = _this.renderSection(section);
          if (rendered) {
            (0, _mobiledocHtmlRendererUtilsDom.appendChild)(_this.root, rendered);
          }
        });

        return { result: this.root.toString(), teardown: function teardown() {
            return _this.teardown();
          } };
      }
    }, {
      key: 'teardown',
      value: function teardown() {
        for (var i = 0; i < this._teardownCallbacks.length; i++) {
          this._teardownCallbacks[i]();
        }
      }
    }, {
      key: 'renderSection',
      value: function renderSection(section) {
        var _section = _slicedToArray(section, 1);

        var type = _section[0];

        switch (type) {
          case _mobiledocHtmlRendererUtilsSectionTypes.MARKUP_SECTION_TYPE:
            return this.renderMarkupSection(section);
          case _mobiledocHtmlRendererUtilsSectionTypes.IMAGE_SECTION_TYPE:
            return this.renderImageSection(section);
          case _mobiledocHtmlRendererUtilsSectionTypes.LIST_SECTION_TYPE:
            return this.renderListSection(section);
          case _mobiledocHtmlRendererUtilsSectionTypes.CARD_SECTION_TYPE:
            return this.renderCardSection(section);
          default:
            throw new Error('Renderer cannot render type "' + type + '"');
        }
      }
    }, {
      key: 'renderListSection',
      value: function renderListSection(_ref3) {
        var _this2 = this;

        var _ref32 = _slicedToArray(_ref3, 3);

        var type = _ref32[0];
        var tagName = _ref32[1];
        var items = _ref32[2];

        if (!(0, _mobiledocHtmlRendererUtilsTagNames.isValidSectionTagName)(tagName, _mobiledocHtmlRendererUtilsSectionTypes.LIST_SECTION_TYPE)) {
          return;
        }
        var element = (0, _mobiledocHtmlRendererUtilsDom.createElement)(tagName);
        items.forEach(function (li) {
          (0, _mobiledocHtmlRendererUtilsDom.appendChild)(element, _this2.renderListItem(li));
        });
        return element;
      }
    }, {
      key: 'renderListItem',
      value: function renderListItem(markers) {
        var element = (0, _mobiledocHtmlRendererUtilsDom.createElement)('li');
        this._renderMarkersOnElement(element, markers);
        return element;
      }
    }, {
      key: 'renderImageSection',
      value: function renderImageSection(_ref4) {
        var _ref42 = _slicedToArray(_ref4, 2);

        var type = _ref42[0];
        var url = _ref42[1];

        var element = (0, _mobiledocHtmlRendererUtilsDom.createElement)('img');
        (0, _mobiledocHtmlRendererUtilsDom.setAttribute)(element, 'src', url);
        return element;
      }
    }, {
      key: 'findCard',
      value: function findCard(name) {
        for (var i = 0; i < this.cards.length; i++) {
          if (this.cards[i].name === name) {
            return this.cards[i];
          }
        }
        if (name === _mobiledocHtmlRendererCardsImage['default'].name) {
          return _mobiledocHtmlRendererCardsImage['default'];
        }
        return this._createUnknownCard(name);
      }
    }, {
      key: '_createUnknownCard',
      value: function _createUnknownCard(name) {
        return {
          name: name,
          type: _mobiledocHtmlRendererUtilsRenderType['default'],
          render: this.unknownCardHandler
        };
      }
    }, {
      key: 'renderCardSection',
      value: function renderCardSection(_ref5) {
        var _ref52 = _slicedToArray(_ref5, 3);

        var type = _ref52[0];
        var name = _ref52[1];
        var payload = _ref52[2];

        var card = this.findCard(name);

        var cardWrapper = this._createCardElement();
        var cardArg = this._createCardArgument(card, payload);
        var rendered = card.render(cardArg);

        this._validateCardRender(rendered, card.name);

        if (rendered) {
          (0, _mobiledocHtmlRendererUtilsDom.appendChild)(cardWrapper, rendered);
        }

        return cardWrapper;
      }
    }, {
      key: '_registerTeardownCallback',
      value: function _registerTeardownCallback(callback) {
        this._teardownCallbacks.push(callback);
      }
    }, {
      key: '_createCardArgument',
      value: function _createCardArgument(card) {
        var _this3 = this;

        var payload = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

        var env = {
          name: card.name,
          isInEditor: false,
          onTeardown: function onTeardown(callback) {
            return _this3._registerTeardownCallback(callback);
          }
        };

        var options = this.cardOptions;

        return { env: env, options: options, payload: payload };
      }
    }, {
      key: '_validateCardRender',
      value: function _validateCardRender(rendered, cardName) {
        if (!rendered) {
          return;
        }

        if (typeof rendered !== 'string') {
          throw new Error('Card "' + cardName + '" must render ' + _mobiledocHtmlRendererUtilsRenderType['default'] + ', but result was ' + typeof rendered + '"');
        }
      }
    }, {
      key: '_createCardElement',
      value: function _createCardElement() {
        return (0, _mobiledocHtmlRendererUtilsDom.createElement)('div');
      }
    }, {
      key: 'renderMarkupSection',
      value: function renderMarkupSection(_ref6) {
        var _ref62 = _slicedToArray(_ref6, 3);

        var type = _ref62[0];
        var tagName = _ref62[1];
        var markers = _ref62[2];

        if (!(0, _mobiledocHtmlRendererUtilsTagNames.isValidSectionTagName)(tagName, _mobiledocHtmlRendererUtilsSectionTypes.MARKUP_SECTION_TYPE)) {
          return;
        }
        var renderer = _mobiledocHtmlRendererUtilsDom.createElement;
        var lowerCaseTagName = tagName.toLowerCase();
        if (this.sectionElementRenderer[lowerCaseTagName]) {
          renderer = this.sectionElementRenderer[lowerCaseTagName];
        }
        var element = renderer(tagName);
        this._renderMarkersOnElement(element, markers);
        return element;
      }
    }, {
      key: '_renderMarkersOnElement',
      value: function _renderMarkersOnElement(element, markers) {
        var elements = [element];
        var currentElement = element;

        for (var i = 0, l = markers.length; i < l; i++) {
          var marker = markers[i];

          var _marker = _slicedToArray(marker, 3);

          var openTypes = _marker[0];
          var closeCount = _marker[1];
          var text = _marker[2];

          for (var j = 0, m = openTypes.length; j < m; j++) {
            var markerType = this.markerTypes[openTypes[j]];

            var _markerType = _slicedToArray(markerType, 1);

            var tagName = _markerType[0];

            if ((0, _mobiledocHtmlRendererUtilsTagNames.isValidMarkerType)(tagName)) {
              var openedElement = createElementFromMarkerType(markerType);
              (0, _mobiledocHtmlRendererUtilsDom.appendChild)(currentElement, openedElement);
              elements.push(openedElement);
              currentElement = openedElement;
            } else {
              closeCount--;
            }
          }

          (0, _mobiledocHtmlRendererUtilsDom.appendChild)(currentElement, (0, _mobiledocHtmlRendererUtilsDom.createTextNode)(text));

          for (var j = 0, m = closeCount; j < m; j++) {
            elements.pop();
            currentElement = elements[elements.length - 1];
          }
        }
      }
    }, {
      key: '_defaultUnknownCardHandler',
      get: function get() {
        return function (_ref7) {
          var name = _ref7.env.name;

          throw new Error('Card "' + name + '" not found but no unknownCardHandler was registered');
        };
      }
    }]);

    return Renderer;
  })();

  exports['default'] = Renderer;
});
define('mobiledoc-html-renderer/renderers/0-3', ['exports', 'mobiledoc-html-renderer/utils/dom', 'mobiledoc-html-renderer/cards/image', 'mobiledoc-html-renderer/utils/render-type', 'mobiledoc-html-renderer/utils/section-types', 'mobiledoc-html-renderer/utils/tag-names', 'mobiledoc-html-renderer/utils/marker-types'], function (exports, _mobiledocHtmlRendererUtilsDom, _mobiledocHtmlRendererCardsImage, _mobiledocHtmlRendererUtilsRenderType, _mobiledocHtmlRendererUtilsSectionTypes, _mobiledocHtmlRendererUtilsTagNames, _mobiledocHtmlRendererUtilsMarkerTypes) {
  'use strict';

  var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  var MOBILEDOC_VERSION = '0.3.0';

  exports.MOBILEDOC_VERSION = MOBILEDOC_VERSION;
  /**
   * runtime HTML renderer
   * renders a mobiledoc to HTML
   *
   * input: mobiledoc
   * output: HTML
   */

  function createElementFromMarkerType() {
    var _ref = arguments.length <= 0 || arguments[0] === undefined ? ['', []] : arguments[0];

    var _ref2 = _slicedToArray(_ref, 2);

    var tagName = _ref2[0];
    var attributes = _ref2[1];

    var element = (0, _mobiledocHtmlRendererUtilsDom.createElement)(tagName);
    attributes = attributes || [];

    for (var i = 0, l = attributes.length; i < l; i = i + 2) {
      var propName = attributes[i],
          propValue = attributes[i + 1];
      (0, _mobiledocHtmlRendererUtilsDom.setAttribute)(element, propName, propValue);
    }
    return element;
  }

  function validateVersion(version) {
    if (version !== MOBILEDOC_VERSION) {
      throw new Error('Unexpected Mobiledoc version "' + version + '"');
    }
  }

  var Renderer = (function () {
    function Renderer(mobiledoc, state) {
      _classCallCheck(this, Renderer);

      var cards = state.cards;
      var cardOptions = state.cardOptions;
      var atoms = state.atoms;
      var unknownCardHandler = state.unknownCardHandler;
      var unknownAtomHandler = state.unknownAtomHandler;
      var sectionElementRenderer = state.sectionElementRenderer;
      var version = mobiledoc.version;
      var sections = mobiledoc.sections;
      var atomTypes = mobiledoc.atoms;
      var cardTypes = mobiledoc.cards;
      var markerTypes = mobiledoc.markups;

      validateVersion(version);

      this.root = (0, _mobiledocHtmlRendererUtilsDom.createDocumentFragment)();
      this.sections = sections;
      this.atomTypes = atomTypes;
      this.cardTypes = cardTypes;
      this.markerTypes = markerTypes;
      this.cards = cards;
      this.atoms = atoms;
      this.cardOptions = cardOptions;
      this.unknownCardHandler = unknownCardHandler || this._defaultUnknownCardHandler;
      this.unknownAtomHandler = unknownAtomHandler || this._defaultUnknownAtomHandler;

      this.sectionElementRenderer = {};
      if (sectionElementRenderer) {
        for (var key in sectionElementRenderer) {
          if (sectionElementRenderer.hasOwnProperty(key)) {
            this.sectionElementRenderer[key.toLowerCase()] = sectionElementRenderer[key];
          }
        }
      }

      this._teardownCallbacks = [];
    }

    _createClass(Renderer, [{
      key: 'render',
      value: function render() {
        var _this = this;

        this.sections.forEach(function (section) {
          var rendered = _this.renderSection(section);
          if (rendered) {
            (0, _mobiledocHtmlRendererUtilsDom.appendChild)(_this.root, rendered);
          }
        });

        return { result: this.root.toString(), teardown: function teardown() {
            return _this.teardown();
          } };
      }
    }, {
      key: 'teardown',
      value: function teardown() {
        for (var i = 0; i < this._teardownCallbacks.length; i++) {
          this._teardownCallbacks[i]();
        }
      }
    }, {
      key: 'renderSection',
      value: function renderSection(section) {
        var _section = _slicedToArray(section, 1);

        var type = _section[0];

        switch (type) {
          case _mobiledocHtmlRendererUtilsSectionTypes.MARKUP_SECTION_TYPE:
            return this.renderMarkupSection(section);
          case _mobiledocHtmlRendererUtilsSectionTypes.IMAGE_SECTION_TYPE:
            return this.renderImageSection(section);
          case _mobiledocHtmlRendererUtilsSectionTypes.LIST_SECTION_TYPE:
            return this.renderListSection(section);
          case _mobiledocHtmlRendererUtilsSectionTypes.CARD_SECTION_TYPE:
            return this.renderCardSection(section);
          default:
            throw new Error('Renderer cannot render type "' + type + '"');
        }
      }
    }, {
      key: 'renderListSection',
      value: function renderListSection(_ref3) {
        var _this2 = this;

        var _ref32 = _slicedToArray(_ref3, 3);

        var type = _ref32[0];
        var tagName = _ref32[1];
        var items = _ref32[2];

        if (!(0, _mobiledocHtmlRendererUtilsTagNames.isValidSectionTagName)(tagName, _mobiledocHtmlRendererUtilsSectionTypes.LIST_SECTION_TYPE)) {
          return;
        }
        var element = (0, _mobiledocHtmlRendererUtilsDom.createElement)(tagName);
        items.forEach(function (li) {
          (0, _mobiledocHtmlRendererUtilsDom.appendChild)(element, _this2.renderListItem(li));
        });
        return element;
      }
    }, {
      key: 'renderListItem',
      value: function renderListItem(markers) {
        var element = (0, _mobiledocHtmlRendererUtilsDom.createElement)('li');
        this._renderMarkersOnElement(element, markers);
        return element;
      }
    }, {
      key: 'renderImageSection',
      value: function renderImageSection(_ref4) {
        var _ref42 = _slicedToArray(_ref4, 2);

        var type = _ref42[0];
        var url = _ref42[1];

        var element = (0, _mobiledocHtmlRendererUtilsDom.createElement)('img');
        (0, _mobiledocHtmlRendererUtilsDom.setAttribute)(element, 'src', url);
        return element;
      }
    }, {
      key: 'findCard',
      value: function findCard(name) {
        for (var i = 0; i < this.cards.length; i++) {
          if (this.cards[i].name === name) {
            return this.cards[i];
          }
        }
        if (name === _mobiledocHtmlRendererCardsImage['default'].name) {
          return _mobiledocHtmlRendererCardsImage['default'];
        }
        return this._createUnknownCard(name);
      }
    }, {
      key: '_findCardByIndex',
      value: function _findCardByIndex(index) {
        var cardType = this.cardTypes[index];
        if (!cardType) {
          throw new Error('No card definition found at index ' + index);
        }

        var _cardType = _slicedToArray(cardType, 2);

        var name = _cardType[0];
        var payload = _cardType[1];

        var card = this.findCard(name);

        return {
          card: card,
          payload: payload
        };
      }
    }, {
      key: '_createUnknownCard',
      value: function _createUnknownCard(name) {
        return {
          name: name,
          type: _mobiledocHtmlRendererUtilsRenderType['default'],
          render: this.unknownCardHandler
        };
      }
    }, {
      key: 'renderCardSection',
      value: function renderCardSection(_ref5) {
        var _ref52 = _slicedToArray(_ref5, 2);

        var type = _ref52[0];
        var index = _ref52[1];

        var _findCardByIndex2 = this._findCardByIndex(index);

        var card = _findCardByIndex2.card;
        var payload = _findCardByIndex2.payload;

        var cardWrapper = this._createCardElement();
        var cardArg = this._createCardArgument(card, payload);
        var rendered = card.render(cardArg);

        this._validateCardRender(rendered, card.name);

        if (rendered) {
          (0, _mobiledocHtmlRendererUtilsDom.appendChild)(cardWrapper, rendered);
        }

        return cardWrapper;
      }
    }, {
      key: '_registerTeardownCallback',
      value: function _registerTeardownCallback(callback) {
        this._teardownCallbacks.push(callback);
      }
    }, {
      key: '_createCardArgument',
      value: function _createCardArgument(card) {
        var _this3 = this;

        var payload = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

        var env = {
          name: card.name,
          isInEditor: false,
          onTeardown: function onTeardown(callback) {
            return _this3._registerTeardownCallback(callback);
          }
        };

        var options = this.cardOptions;

        return { env: env, options: options, payload: payload };
      }
    }, {
      key: '_validateCardRender',
      value: function _validateCardRender(rendered, cardName) {
        if (!rendered) {
          return;
        }

        if (typeof rendered !== 'string') {
          throw new Error('Card "' + cardName + '" must render ' + _mobiledocHtmlRendererUtilsRenderType['default'] + ', but result was ' + typeof rendered + '"');
        }
      }
    }, {
      key: '_createCardElement',
      value: function _createCardElement() {
        return (0, _mobiledocHtmlRendererUtilsDom.createElement)('div');
      }
    }, {
      key: 'renderMarkupSection',
      value: function renderMarkupSection(_ref6) {
        var _ref62 = _slicedToArray(_ref6, 3);

        var type = _ref62[0];
        var tagName = _ref62[1];
        var markers = _ref62[2];

        if (!(0, _mobiledocHtmlRendererUtilsTagNames.isValidSectionTagName)(tagName, _mobiledocHtmlRendererUtilsSectionTypes.MARKUP_SECTION_TYPE)) {
          return;
        }
        var renderer = _mobiledocHtmlRendererUtilsDom.createElement;
        var lowerCaseTagName = tagName.toLowerCase();
        if (this.sectionElementRenderer[lowerCaseTagName]) {
          renderer = this.sectionElementRenderer[lowerCaseTagName];
        }

        var element = renderer(tagName);
        this._renderMarkersOnElement(element, markers);
        return element;
      }
    }, {
      key: 'findAtom',
      value: function findAtom(name) {
        for (var i = 0; i < this.atoms.length; i++) {
          if (this.atoms[i].name === name) {
            return this.atoms[i];
          }
        }
        return this._createUnknownAtom(name);
      }
    }, {
      key: '_createUnknownAtom',
      value: function _createUnknownAtom(name) {
        return {
          name: name,
          type: _mobiledocHtmlRendererUtilsRenderType['default'],
          render: this.unknownAtomHandler
        };
      }
    }, {
      key: '_createAtomArgument',
      value: function _createAtomArgument(atom, value, payload) {
        var _this4 = this;

        var env = {
          name: atom.name,
          onTeardown: function onTeardown(callback) {
            return _this4._registerTeardownCallback(callback);
          }
        };

        var options = this.cardOptions;

        return { env: env, options: options, value: value, payload: payload };
      }
    }, {
      key: '_validateAtomRender',
      value: function _validateAtomRender(rendered, atomName) {
        if (!rendered) {
          return;
        }

        if (typeof rendered !== 'string') {
          throw new Error('Atom "' + atomName + '" must render ' + _mobiledocHtmlRendererUtilsRenderType['default'] + ', but result was ' + typeof rendered + '"');
        }
      }
    }, {
      key: '_findAtomByIndex',
      value: function _findAtomByIndex(index) {
        var atomType = this.atomTypes[index];
        if (!atomType) {
          throw new Error('No atom definition found at index ' + index);
        }

        var _atomType = _slicedToArray(atomType, 3);

        var name = _atomType[0];
        var value = _atomType[1];
        var payload = _atomType[2];

        var atom = this.findAtom(name);

        return {
          atom: atom,
          value: value,
          payload: payload
        };
      }
    }, {
      key: '_renderAtom',
      value: function _renderAtom(index) {
        var _findAtomByIndex2 = this._findAtomByIndex(index);

        var atom = _findAtomByIndex2.atom;
        var value = _findAtomByIndex2.value;
        var payload = _findAtomByIndex2.payload;

        var atomArg = this._createAtomArgument(atom, value, payload);
        var rendered = atom.render(atomArg);

        this._validateAtomRender(rendered, atom.name);

        return rendered || (0, _mobiledocHtmlRendererUtilsDom.createTextNode)('');
      }
    }, {
      key: '_renderMarkersOnElement',
      value: function _renderMarkersOnElement(element, markers) {
        var elements = [element];
        var currentElement = element;

        for (var i = 0, l = markers.length; i < l; i++) {
          var marker = markers[i];

          var _marker = _slicedToArray(marker, 4);

          var type = _marker[0];
          var openTypes = _marker[1];
          var closeCount = _marker[2];
          var value = _marker[3];

          for (var j = 0, m = openTypes.length; j < m; j++) {
            var markerType = this.markerTypes[openTypes[j]];

            var _markerType = _slicedToArray(markerType, 1);

            var tagName = _markerType[0];

            if ((0, _mobiledocHtmlRendererUtilsTagNames.isValidMarkerType)(tagName)) {
              var openedElement = createElementFromMarkerType(markerType);
              (0, _mobiledocHtmlRendererUtilsDom.appendChild)(currentElement, openedElement);
              elements.push(openedElement);
              currentElement = openedElement;
            } else {
              closeCount--;
            }
          }

          switch (type) {
            case _mobiledocHtmlRendererUtilsMarkerTypes.MARKUP_MARKER_TYPE:
              (0, _mobiledocHtmlRendererUtilsDom.appendChild)(currentElement, (0, _mobiledocHtmlRendererUtilsDom.createTextNode)(value));
              break;
            case _mobiledocHtmlRendererUtilsMarkerTypes.ATOM_MARKER_TYPE:
              (0, _mobiledocHtmlRendererUtilsDom.appendChild)(currentElement, this._renderAtom(value));
              break;
            default:
              throw new Error('Unknown markup type (' + type + ')');
          }

          for (var j = 0, m = closeCount; j < m; j++) {
            elements.pop();
            currentElement = elements[elements.length - 1];
          }
        }
      }
    }, {
      key: '_defaultUnknownCardHandler',
      get: function get() {
        return function (_ref7) {
          var name = _ref7.env.name;

          throw new Error('Card "' + name + '" not found but no unknownCardHandler was registered');
        };
      }
    }, {
      key: '_defaultUnknownAtomHandler',
      get: function get() {
        return function (_ref8) {
          var name = _ref8.env.name;

          throw new Error('Atom "' + name + '" not found but no unknownAtomHandler was registered');
        };
      }
    }]);

    return Renderer;
  })();

  exports['default'] = Renderer;
});
define('mobiledoc-html-renderer/utils/dom', ['exports'], function (exports) {
  'use strict';

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  exports.createElement = createElement;
  exports.appendChild = appendChild;
  exports.createTextNode = createTextNode;
  exports.setAttribute = setAttribute;
  exports.createDocumentFragment = createDocumentFragment;
  exports.normalizeTagName = normalizeTagName;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  var VOID_TAGS = 'area base br col command embed hr img input keygen link meta param source track wbr'.split(' ');

  var Element = (function () {
    function Element(tagName) {
      _classCallCheck(this, Element);

      this.tagName = tagName.toLowerCase();
      this.isVoid = VOID_TAGS.indexOf(this.tagName) !== -1;
      this.childNodes = [];
      this.attributes = [];
    }

    _createClass(Element, [{
      key: 'appendChild',
      value: function appendChild(element) {
        this.childNodes.push(element);
      }
    }, {
      key: 'setAttribute',
      value: function setAttribute(propName, propValue) {
        this.attributes.push(propName, propValue);
      }
    }, {
      key: 'toString',
      value: function toString() {
        var html = '<' + this.tagName;

        if (this.attributes.length) {
          for (var i = 0; i < this.attributes.length; i = i + 2) {
            var propName = this.attributes[i],
                propValue = this.attributes[i + 1];
            html += ' ' + propName + '="' + propValue + '"';
          }
        }
        html += '>';

        if (!this.isVoid) {
          for (var i = 0; i < this.childNodes.length; i++) {
            html += this.childNodes[i].toString();
          }
          html += '</' + this.tagName + '>';
        }

        return html;
      }
    }]);

    return Element;
  })();

  function addHTMLSpaces(text) {
    return text.replace(/  /g, ' &nbsp;');
  }

  var TextNode = (function () {
    function TextNode(value) {
      _classCallCheck(this, TextNode);

      this.value = value;
    }

    _createClass(TextNode, [{
      key: 'toString',
      value: function toString() {
        return addHTMLSpaces(this.value);
      }
    }]);

    return TextNode;
  })();

  function createElement(tagName) {
    return new Element(tagName);
  }

  function appendChild(target, child) {
    target.appendChild(child);
  }

  function createTextNode(text) {
    return new TextNode(text);
  }

  function setAttribute(element, propName, propValue) {
    element.setAttribute(propName, propValue);
  }

  function createDocumentFragment() {
    return createElement('div');
  }

  function normalizeTagName(name) {
    return name.toLowerCase();
  }
});
define("mobiledoc-html-renderer/utils/marker-types", ["exports"], function (exports) {
  "use strict";

  var MARKUP_MARKER_TYPE = 0;
  exports.MARKUP_MARKER_TYPE = MARKUP_MARKER_TYPE;
  var ATOM_MARKER_TYPE = 1;
  exports.ATOM_MARKER_TYPE = ATOM_MARKER_TYPE;
});
define('mobiledoc-html-renderer/utils/render-type', ['exports'], function (exports) {
  'use strict';

  exports['default'] = 'html';
});
define("mobiledoc-html-renderer/utils/section-types", ["exports"], function (exports) {
  "use strict";

  var MARKUP_SECTION_TYPE = 1;
  exports.MARKUP_SECTION_TYPE = MARKUP_SECTION_TYPE;
  var IMAGE_SECTION_TYPE = 2;
  exports.IMAGE_SECTION_TYPE = IMAGE_SECTION_TYPE;
  var LIST_SECTION_TYPE = 3;
  exports.LIST_SECTION_TYPE = LIST_SECTION_TYPE;
  var CARD_SECTION_TYPE = 10;
  exports.CARD_SECTION_TYPE = CARD_SECTION_TYPE;
});
define('mobiledoc-html-renderer/utils/tag-names', ['exports', 'mobiledoc-html-renderer/utils/section-types', 'mobiledoc-html-renderer/utils/dom'], function (exports, _mobiledocHtmlRendererUtilsSectionTypes, _mobiledocHtmlRendererUtilsDom) {
  'use strict';

  exports.isValidSectionTagName = isValidSectionTagName;
  exports.isValidMarkerType = isValidMarkerType;

  var MARKUP_SECTION_TAG_NAMES = ['p', 'h1', 'h2', 'h3', 'blockquote', 'pull-quote'].map(_mobiledocHtmlRendererUtilsDom.normalizeTagName);

  var LIST_SECTION_TAG_NAMES = ['ul', 'ol'].map(_mobiledocHtmlRendererUtilsDom.normalizeTagName);

  var MARKUP_TYPES = ['b', 'i', 'strong', 'em', 'a', 'u', 'sub', 'sup', 's'].map(_mobiledocHtmlRendererUtilsDom.normalizeTagName);

  function contains(array, item) {
    return array.indexOf(item) !== -1;
  }

  function isValidSectionTagName(tagName, sectionType) {
    tagName = (0, _mobiledocHtmlRendererUtilsDom.normalizeTagName)(tagName);

    switch (sectionType) {
      case _mobiledocHtmlRendererUtilsSectionTypes.MARKUP_SECTION_TYPE:
        return contains(MARKUP_SECTION_TAG_NAMES, tagName);
      case _mobiledocHtmlRendererUtilsSectionTypes.LIST_SECTION_TYPE:
        return contains(LIST_SECTION_TAG_NAMES, tagName);
      default:
        throw new Error('Cannot validate tagName for unknown section type "' + sectionType + '"');
    }
  }

  function isValidMarkerType(type) {
    type = (0, _mobiledocHtmlRendererUtilsDom.normalizeTagName)(type);
    return contains(MARKUP_TYPES, type);
  }
});
define('mobiledoc-kit/cards/image', ['exports', 'mobiledoc-kit/utils/placeholder-image-src'], function (exports, _mobiledocKitUtilsPlaceholderImageSrc) {
  'use strict';

  exports['default'] = {
    name: 'image',
    type: 'dom',

    render: function render(_ref) {
      var env = _ref.env;
      var options = _ref.options;
      var payload = _ref.payload;

      var img = document.createElement('img');
      img.src = payload.src || _mobiledocKitUtilsPlaceholderImageSrc['default'];
      return img;
    }
  };
});
define('mobiledoc-kit/editor/edit-history', ['exports', 'mobiledoc-kit/parsers/mobiledoc', 'mobiledoc-kit/utils/cursor/range', 'mobiledoc-kit/utils/cursor/position', 'mobiledoc-kit/utils/fixed-queue'], function (exports, _mobiledocKitParsersMobiledoc, _mobiledocKitUtilsCursorRange, _mobiledocKitUtilsCursorPosition, _mobiledocKitUtilsFixedQueue) {
  'use strict';

  var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  function findLeafSectionAtIndex(post, index) {
    var section = undefined;
    post.walkAllLeafSections(function (_section, _index) {
      if (index === _index) {
        section = _section;
      }
    });
    return section;
  }

  var Snapshot = (function () {
    function Snapshot(editor) {
      _classCallCheck(this, Snapshot);

      this.mobiledoc = editor.serialize();
      this.editor = editor;

      this.snapshotRange();
    }

    _createClass(Snapshot, [{
      key: 'snapshotRange',
      value: function snapshotRange() {
        var _editor = this.editor;
        var range = _editor.range;
        var cursor = _editor.cursor;

        if (cursor.hasCursor() && !range.isBlank) {
          var head = range.head;
          var tail = range.tail;

          this.range = {
            head: [head.leafSectionIndex, head.offset],
            tail: [tail.leafSectionIndex, tail.offset]
          };
        }
      }
    }, {
      key: 'getRange',
      value: function getRange(post) {
        if (this.range) {
          var _range = this.range;
          var head = _range.head;
          var tail = _range.tail;

          var _head = _slicedToArray(head, 2);

          var headLeafSectionIndex = _head[0];
          var headOffset = _head[1];

          var _tail = _slicedToArray(tail, 2);

          var tailLeafSectionIndex = _tail[0];
          var tailOffset = _tail[1];

          var headSection = findLeafSectionAtIndex(post, headLeafSectionIndex);
          var tailSection = findLeafSectionAtIndex(post, tailLeafSectionIndex);

          return new _mobiledocKitUtilsCursorRange['default'](new _mobiledocKitUtilsCursorPosition['default'](headSection, headOffset), new _mobiledocKitUtilsCursorPosition['default'](tailSection, tailOffset));
        }
      }
    }]);

    return Snapshot;
  })();

  exports.Snapshot = Snapshot;

  var EditHistory = (function () {
    function EditHistory(editor, queueLength) {
      _classCallCheck(this, EditHistory);

      this.editor = editor;
      this._undoStack = new _mobiledocKitUtilsFixedQueue['default'](queueLength);
      this._redoStack = new _mobiledocKitUtilsFixedQueue['default'](queueLength);

      this._pendingSnapshot = null;
    }

    _createClass(EditHistory, [{
      key: 'snapshot',
      value: function snapshot() {
        // update the current snapshot with the range read from DOM
        if (this._pendingSnapshot) {
          this._pendingSnapshot.snapshotRange();
        }
      }
    }, {
      key: 'storeSnapshot',
      value: function storeSnapshot() {
        // store pending snapshot
        if (this._pendingSnapshot) {
          this._undoStack.push(this._pendingSnapshot);
          this._redoStack.clear();
        }

        // take new pending snapshot to store next time `storeSnapshot` is called
        this._pendingSnapshot = new Snapshot(this.editor);
      }
    }, {
      key: 'stepBackward',
      value: function stepBackward(postEditor) {
        // Throw away the pending snapshot
        this._pendingSnapshot = null;

        var snapshot = this._undoStack.pop();
        if (snapshot) {
          this._redoStack.push(new Snapshot(this.editor));
          this._restoreFromSnapshot(snapshot, postEditor);
        }
      }
    }, {
      key: 'stepForward',
      value: function stepForward(postEditor) {
        var snapshot = this._redoStack.pop();
        if (snapshot) {
          this._undoStack.push(new Snapshot(this.editor));
          this._restoreFromSnapshot(snapshot, postEditor);
        }
        postEditor.cancelSnapshot();
      }
    }, {
      key: '_restoreFromSnapshot',
      value: function _restoreFromSnapshot(snapshot, postEditor) {
        var mobiledoc = snapshot.mobiledoc;
        var editor = this.editor;
        var builder = editor.builder;
        var post = editor.post;

        var restoredPost = _mobiledocKitParsersMobiledoc['default'].parse(builder, mobiledoc);

        postEditor.removeAllSections();
        postEditor.migrateSectionsFromPost(restoredPost);

        // resurrect snapshotted range if it exists
        var newRange = snapshot.getRange(post);
        if (newRange) {
          postEditor.setRange(newRange);
        }
      }
    }]);

    return EditHistory;
  })();

  exports['default'] = EditHistory;
});
define('mobiledoc-kit/editor/editor', ['exports', 'mobiledoc-kit/views/tooltip', 'mobiledoc-kit/editor/post', 'mobiledoc-kit/cards/image', 'mobiledoc-kit/utils/key', 'mobiledoc-kit/utils/event-emitter', 'mobiledoc-kit/parsers/mobiledoc', 'mobiledoc-kit/parsers/html', 'mobiledoc-kit/parsers/dom', 'mobiledoc-kit/renderers/editor-dom', 'mobiledoc-kit/models/render-tree', 'mobiledoc-kit/renderers/mobiledoc', 'mobiledoc-kit/utils/merge', 'mobiledoc-kit/utils/dom-utils', 'mobiledoc-kit/utils/array-utils', 'mobiledoc-kit/utils/element-utils', 'mobiledoc-kit/utils/mixin', 'mobiledoc-kit/utils/event-listener', 'mobiledoc-kit/utils/cursor', 'mobiledoc-kit/utils/cursor/range', 'mobiledoc-kit/models/post-node-builder', 'mobiledoc-kit/editor/text-expansions', 'mobiledoc-kit/editor/key-commands', 'mobiledoc-kit/utils/string-utils', 'mobiledoc-kit/utils/lifecycle-callbacks', 'mobiledoc-kit/models/card', 'mobiledoc-kit/utils/paste-utils', 'mobiledoc-kit/utils/characters', 'mobiledoc-kit/utils/assert', 'mobiledoc-kit/editor/mutation-handler', 'mobiledoc-kit/editor/edit-history'], function (exports, _mobiledocKitViewsTooltip, _mobiledocKitEditorPost, _mobiledocKitCardsImage, _mobiledocKitUtilsKey, _mobiledocKitUtilsEventEmitter, _mobiledocKitParsersMobiledoc, _mobiledocKitParsersHtml, _mobiledocKitParsersDom, _mobiledocKitRenderersEditorDom, _mobiledocKitModelsRenderTree, _mobiledocKitRenderersMobiledoc, _mobiledocKitUtilsMerge, _mobiledocKitUtilsDomUtils, _mobiledocKitUtilsArrayUtils, _mobiledocKitUtilsElementUtils, _mobiledocKitUtilsMixin, _mobiledocKitUtilsEventListener, _mobiledocKitUtilsCursor, _mobiledocKitUtilsCursorRange, _mobiledocKitModelsPostNodeBuilder, _mobiledocKitEditorTextExpansions, _mobiledocKitEditorKeyCommands, _mobiledocKitUtilsStringUtils, _mobiledocKitUtilsLifecycleCallbacks, _mobiledocKitModelsCard, _mobiledocKitUtilsPasteUtils, _mobiledocKitUtilsCharacters, _mobiledocKitUtilsAssert, _mobiledocKitEditorMutationHandler, _mobiledocKitEditorEditHistory) {
  'use strict';

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  var EDITOR_ELEMENT_CLASS_NAME = '__mobiledoc-editor';

  exports.EDITOR_ELEMENT_CLASS_NAME = EDITOR_ELEMENT_CLASS_NAME;
  var ELEMENT_EVENTS = ['keydown', 'keyup', 'cut', 'copy', 'paste'];
  var DOCUMENT_EVENTS = ['mouseup'];

  var defaults = {
    placeholder: 'Write here...',
    spellcheck: true,
    autofocus: true,
    undoDepth: 5,
    cards: [],
    atoms: [],
    cardOptions: {},
    unknownCardHandler: function unknownCardHandler(_ref) {
      var env = _ref.env;

      throw new Error('Unknown card encountered: ' + env.name);
    },
    unknownAtomHandler: function unknownAtomHandler(_ref2) {
      var env = _ref2.env;

      throw new Error('Unknown atom encountered: ' + env.name);
    },
    mobiledoc: null,
    html: null
  };

  var CALLBACK_QUEUES = {
    DID_UPDATE: 'didUpdate',
    WILL_RENDER: 'willRender',
    DID_RENDER: 'didRender',
    CURSOR_DID_CHANGE: 'cursorDidChange',
    DID_REPARSE: 'didReparse'
  };

  /**
   * @class Editor
   * An individual Editor
   * @param element `Element` node
   * @param options hash of options
   */

  var Editor = (function () {
    function Editor() {
      var _this = this;

      var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      _classCallCheck(this, Editor);

      (0, _mobiledocKitUtilsAssert['default'])('editor create accepts an options object. For legacy usage passing an element for the first argument, consider the `html` option for loading DOM or HTML posts. For other cases call `editor.render(domNode)` after editor creation', options && !options.nodeType);
      this._elementListeners = [];
      this._views = [];
      this.isEditable = null;
      this._parserPlugins = options.parserPlugins || [];

      // FIXME: This should merge onto this.options
      (0, _mobiledocKitUtilsMerge.mergeWithOptions)(this, defaults, options);

      this.cards.push(_mobiledocKitCardsImage['default']);

      _mobiledocKitEditorTextExpansions.DEFAULT_TEXT_EXPANSIONS.forEach(function (e) {
        return _this.registerExpansion(e);
      });
      _mobiledocKitEditorKeyCommands.DEFAULT_KEY_COMMANDS.forEach(function (kc) {
        return _this.registerKeyCommand(kc);
      });

      this._parser = new _mobiledocKitParsersDom['default'](this.builder);
      this._renderer = new _mobiledocKitRenderersEditorDom['default'](this, this.cards, this.atoms, this.unknownCardHandler, this.unknownAtomHandler, this.cardOptions);

      this.post = this.loadPost();
      this._renderTree = new _mobiledocKitModelsRenderTree['default'](this.post);

      this._editHistory = new _mobiledocKitEditorEditHistory['default'](this, this.undoDepth);
    }

    _createClass(Editor, [{
      key: 'addView',
      value: function addView(view) {
        this._views.push(view);
      }
    }, {
      key: 'loadPost',
      value: function loadPost() {
        if (this.mobiledoc) {
          return _mobiledocKitParsersMobiledoc['default'].parse(this.builder, this.mobiledoc);
        } else if (this.html) {
          if (typeof this.html === 'string') {
            var options = { plugins: this._parserPlugins };
            return new _mobiledocKitParsersHtml['default'](this.builder, options).parse(this.html);
          } else {
            var dom = this.html;
            return this._parser.parse(dom);
          }
        } else {
          return this.builder.createPost();
        }
      }
    }, {
      key: 'rerender',
      value: function rerender() {
        var _this2 = this;

        var postRenderNode = this.post.renderNode;

        // if we haven't rendered this post's renderNode before, mark it dirty
        if (!postRenderNode.element) {
          (0, _mobiledocKitUtilsAssert['default'])('Must call `render` before `rerender` can be called', this.hasRendered);
          postRenderNode.element = this.element;
          postRenderNode.markDirty();
        }

        this.runCallbacks(CALLBACK_QUEUES.WILL_RENDER);
        this._mutationHandler.suspendObservation(function () {
          _this2._renderer.render(_this2._renderTree);
        });
        this.runCallbacks(CALLBACK_QUEUES.DID_RENDER);
      }
    }, {
      key: 'render',
      value: function render(element) {
        (0, _mobiledocKitUtilsAssert['default'])('Cannot render an editor twice. Use `rerender` to update the ' + 'rendering of an existing editor instance.', !this.hasRendered);

        (0, _mobiledocKitUtilsDomUtils.addClassName)(element, EDITOR_ELEMENT_CLASS_NAME);
        element.spellcheck = this.spellcheck;

        (0, _mobiledocKitUtilsDomUtils.clearChildNodes)(element);

        this.element = element;
        this._mutationHandler = new _mobiledocKitEditorMutationHandler['default'](this);
        this._mutationHandler.startObserving();

        if (this.isEditable === null) {
          this.enableEditing();
        }

        this._addTooltip();

        // A call to `run` will trigger the didUpdatePostCallbacks hooks with a
        // postEditor.
        this.run(function () {});
        this.rerender();

        if (this.autofocus) {
          this.element.focus();
        }

        this._setupListeners();
      }
    }, {
      key: '_addTooltip',
      value: function _addTooltip() {
        this.addView(new _mobiledocKitViewsTooltip['default']({
          rootElement: this.element,
          showForTag: 'a'
        }));
      }
    }, {
      key: 'registerExpansion',

      /**
       * @method registerExpansion
       * @param {Object} expansion The text expansion to register. It must specify a
       * trigger character (e.g. the `<space>` character) and a text string that precedes
       * the trigger (e.g. "*"), and a `run` method that will be passed the
       * editor instance when the text expansion is invoked
       * @public
       */
      value: function registerExpansion(expansion) {
        (0, _mobiledocKitUtilsAssert['default'])('Expansion is not valid', (0, _mobiledocKitEditorTextExpansions.validateExpansion)(expansion));
        this.expansions.push(expansion);
      }

      /**
       * @method registerKeyCommand
       * @param {Object} keyCommand The key command to register. It must specify a
       * modifier key (meta, ctrl, etc), a string representing the ascii key, and
       * a `run` method that will be passed the editor instance when the key command
       * is invoked
       * @public
       */
    }, {
      key: 'registerKeyCommand',
      value: function registerKeyCommand(rawKeyCommand) {
        var keyCommand = (0, _mobiledocKitEditorKeyCommands.buildKeyCommand)(rawKeyCommand);
        (0, _mobiledocKitUtilsAssert['default'])('Key Command is not valid', (0, _mobiledocKitEditorKeyCommands.validateKeyCommand)(keyCommand));
        this.keyCommands.unshift(keyCommand);
      }

      /**
       * @param {KeyEvent} event optional
       * @private
       */
    }, {
      key: 'handleDeletion',
      value: function handleDeletion() {
        var _this3 = this;

        var event = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];
        var range = this.range;

        if (!range.isCollapsed) {
          this.run(function (postEditor) {
            var nextPosition = postEditor.deleteRange(range);
            postEditor.setRange(new _mobiledocKitUtilsCursorRange['default'](nextPosition));
          });
        } else if (event) {
          (function () {
            var key = _mobiledocKitUtilsKey['default'].fromEvent(event);
            _this3.run(function (postEditor) {
              var nextPosition = postEditor.deleteFrom(range.head, key.direction);
              var newRange = new _mobiledocKitUtilsCursorRange['default'](nextPosition);
              postEditor.setRange(newRange);
            });
          })();
        }
      }
    }, {
      key: 'handleNewline',
      value: function handleNewline(event) {
        if (!this.cursor.hasCursor()) {
          return;
        }

        event.preventDefault();

        var range = this.range;

        this.run(function (postEditor) {
          var cursorSection = undefined;
          if (!range.isCollapsed) {
            var nextPosition = postEditor.deleteRange(range);
            cursorSection = nextPosition.section;
            if (cursorSection && cursorSection.isBlank) {
              postEditor.setRange(new _mobiledocKitUtilsCursorRange['default'](cursorSection.headPosition()));
              return;
            }
          }
          cursorSection = postEditor.splitSection(range.head)[1];
          postEditor.setRange(new _mobiledocKitUtilsCursorRange['default'](cursorSection.headPosition()));
        });
      }
    }, {
      key: 'showPrompt',
      value: function showPrompt(message, defaultValue, callback) {
        callback(window.prompt(message, defaultValue));
      }
    }, {
      key: 'didUpdate',
      value: function didUpdate() {
        this.trigger('update');
      }
    }, {
      key: 'selectSections',
      value: function selectSections() {
        var sections = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];

        if (sections.length) {
          var headSection = sections[0],
              tailSection = sections[sections.length - 1];
          this.selectRange(new _mobiledocKitUtilsCursorRange['default'](headSection.headPosition(), tailSection.tailPosition()));
        } else {
          this.cursor.clearSelection();
        }
        this._reportSelectionState();
      }
    }, {
      key: 'selectRange',
      value: function selectRange(range) {
        this.range = range;
        this.renderRange();
      }

      // @private
    }, {
      key: 'renderRange',
      value: function renderRange() {
        if (this.range.isBlank) {
          this.cursor.clearSelection();
        } else {
          this.cursor.selectRange(this.range);
        }
        this._reportSelectionState();

        // ensure that the range is "cleaned"/un-cached after
        // rendering a cursor range
        this.range = null;
      }
    }, {
      key: 'setPlaceholder',
      value: function setPlaceholder(placeholder) {
        (0, _mobiledocKitUtilsElementUtils.setData)(this.element, 'placeholder', placeholder);
      }
    }, {
      key: '_reparsePost',
      value: function _reparsePost() {
        var post = this._parser.parse(this.element);
        this.run(function (postEditor) {
          postEditor.removeAllSections();
          postEditor.migrateSectionsFromPost(post);
        });

        this.runCallbacks(CALLBACK_QUEUES.DID_REPARSE);
        this.didUpdate();
      }
    }, {
      key: '_reparseSections',
      value: function _reparseSections() {
        var _this4 = this;

        var sections = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];

        var currentRange = undefined;
        sections.forEach(function (section) {
          _this4._parser.reparseSection(section, _this4._renderTree);
        });
        this._removeDetachedSections();

        if (this._renderTree.isDirty) {
          currentRange = this.range;
        }

        // force the current snapshot's range to remain the same rather than
        // rereading it from DOM after the new character is applied and the browser
        // updates the cursor position
        var range = this._editHistory._pendingSnapshot.range;
        this.run(function () {
          _this4._editHistory._pendingSnapshot.range = range;
        });
        this.rerender();
        if (currentRange) {
          this.selectRange(currentRange);
        }

        this.runCallbacks(CALLBACK_QUEUES.DID_REPARSE);
        this.didUpdate();
      }

      // FIXME this should be able to be removed now -- if any sections are detached,
      // it's due to a bug in the code.
    }, {
      key: '_removeDetachedSections',
      value: function _removeDetachedSections() {
        (0, _mobiledocKitUtilsArrayUtils.forEach)((0, _mobiledocKitUtilsArrayUtils.filter)(this.post.sections, function (s) {
          return !s.renderNode.isAttached();
        }), function (s) {
          return s.renderNode.scheduleForRemoval();
        });
      }

      /*
       * Returns the active sections. If the cursor selection is collapsed this will be
       * an array of 1 item. Else will return an array containing each section that is either
       * wholly or partly contained by the cursor selection.
       *
       * @return {array} The sections from the cursor's selection start to the selection end
       */
    }, {
      key: 'detectMarkupInRange',
      value: function detectMarkupInRange(range, markupTagName) {
        var markups = this.post.markupsInRange(range);
        return (0, _mobiledocKitUtilsArrayUtils.detect)(markups, function (markup) {
          return markup.hasTag(markupTagName);
        });
      }
    }, {
      key: 'serialize',
      value: function serialize() {
        var version = arguments.length <= 0 || arguments[0] === undefined ? _mobiledocKitRenderersMobiledoc.MOBILEDOC_VERSION : arguments[0];

        return _mobiledocKitRenderersMobiledoc['default'].render(this.post, version);
      }
    }, {
      key: 'removeAllViews',
      value: function removeAllViews() {
        this._views.forEach(function (v) {
          return v.destroy();
        });
        this._views = [];
      }
    }, {
      key: 'destroy',
      value: function destroy() {
        this._isDestroyed = true;
        if (this.cursor.hasCursor()) {
          this.cursor.clearSelection();
          this.element.blur();
        }
        if (this._mutationHandler) {
          this._mutationHandler.destroy();
        }
        this.removeAllEventListeners();
        this.removeAllViews();
        this._renderer.destroy();
      }

      /**
       * Keep the user from directly editing the post. Modification via the
       * programmatic API is still permitted.
       *
       * @method disableEditing
       * @public
       */
    }, {
      key: 'disableEditing',
      value: function disableEditing() {
        this.isEditable = false;
        if (this.element) {
          this.element.setAttribute('contentEditable', false);
          this.setPlaceholder('');
        }
      }

      /**
       * Allow the user to directly interact with editing a post via a cursor.
       *
       * @method enableEditing
       * @return undefined
       * @public
       */
    }, {
      key: 'enableEditing',
      value: function enableEditing() {
        this.isEditable = true;
        if (this.element) {
          this.element.setAttribute('contentEditable', true);
          this.setPlaceholder(this.placeholder);
        }
      }

      /**
       * Change a cardSection into edit mode
       * If called before the card has been rendered, it will be marked so that
       * it is rendered in edit mode when it gets rendered.
       * @param {CardSection} cardSection
       * @return undefined
       * @public
       */
    }, {
      key: 'editCard',
      value: function editCard(cardSection) {
        this._setCardMode(cardSection, _mobiledocKitModelsCard.CARD_MODES.EDIT);
      }

      /**
       * Change a cardSection into display mode
       * If called before the card has been rendered, it will be marked so that
       * it is rendered in display mode when it gets rendered.
       * @param {CardSection} cardSection
       * @return undefined
       * @public
       */
    }, {
      key: 'displayCard',
      value: function displayCard(cardSection) {
        this._setCardMode(cardSection, _mobiledocKitModelsCard.CARD_MODES.DISPLAY);
      }

      /**
       * Run a new post editing session. Yields a block with a new `postEditor`
       * instance. This instance can be used to interact with the post abstract,
       * and defers rendering until the end of all changes.
       *
       * Usage:
       *
       *     let markerRange = this.range;
       *     editor.run((postEditor) => {
       *       postEditor.deleteRange(markerRange);
       *       // editing surface not updated yet
       *       postEditor.schedule(() => {
       *         console.log('logs during rerender flush');
       *       });
       *       // logging not yet flushed
       *     });
       *     // editing surface now updated.
       *     // logging now flushed
       *
       * The return value of `run` is whatever was returned from the callback.
       *
       * @method run
       * @param {Function} callback Function to handle post editing with, provided the `postEditor` as an argument.
       * @return {} Whatever the return value of `callback` is.
       * @public
       */
    }, {
      key: 'run',
      value: function run(callback) {
        var postEditor = new _mobiledocKitEditorPost['default'](this);
        postEditor.begin();
        this._editHistory.snapshot();
        var result = callback(postEditor);
        this.runCallbacks(CALLBACK_QUEUES.DID_UPDATE, [postEditor]);
        postEditor.complete();
        if (postEditor._shouldCancelSnapshot) {
          this._editHistory._pendingSnapshot = null;
        }
        this._editHistory.storeSnapshot();
        return result;
      }

      /**
       * @method didUpdatePost
       * @param {Function} callback This callback will be called with `postEditor`
       *         argument when the post is updated
       * @public
       */
    }, {
      key: 'didUpdatePost',
      value: function didUpdatePost(callback) {
        this.addCallback(CALLBACK_QUEUES.DID_UPDATE, callback);
      }

      /**
       * @method willRender
       * @param {Function} callback This callback will be called before the editor
       *        is rendered.
       * @public
       */
    }, {
      key: 'willRender',
      value: function willRender(callback) {
        this.addCallback(CALLBACK_QUEUES.WILL_RENDER, callback);
      }

      /**
       * @method didRender
       * @param {Function} callback This callback will be called after the editor
       *        is rendered.
       * @public
       */
    }, {
      key: 'didRender',
      value: function didRender(callback) {
        this.addCallback(CALLBACK_QUEUES.DID_RENDER, callback);
      }

      /**
       * @method cursorDidChange
       * @param {Function} callback This callback will be called after the cursor
       *        position (or selection) changes.
       * @public
       */
    }, {
      key: 'cursorDidChange',
      value: function cursorDidChange(callback) {
        this.addCallback(CALLBACK_QUEUES.CURSOR_DID_CHANGE, callback);
      }
    }, {
      key: '_setupListeners',
      value: function _setupListeners() {
        var _this5 = this;

        ELEMENT_EVENTS.forEach(function (eventName) {
          _this5.addEventListener(_this5.element, eventName, function () {
            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
              args[_key] = arguments[_key];
            }

            return _this5.handleEvent.apply(_this5, [eventName].concat(args));
          });
        });

        DOCUMENT_EVENTS.forEach(function (eventName) {
          _this5.addEventListener(document, eventName, function () {
            for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
              args[_key2] = arguments[_key2];
            }

            return _this5.handleEvent.apply(_this5, [eventName].concat(args));
          });
        });
      }
    }, {
      key: 'handleEvent',
      value: function handleEvent(eventName) {
        for (var _len3 = arguments.length, args = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
          args[_key3 - 1] = arguments[_key3];
        }

        if ((0, _mobiledocKitUtilsArrayUtils.contains)(ELEMENT_EVENTS, eventName)) {
          var element = args[0].target;

          if (!this.cursor.isAddressable(element)) {
            // abort handling this event
            return true;
          }
        }

        var methodName = 'handle' + (0, _mobiledocKitUtilsStringUtils.capitalize)(eventName);
        (0, _mobiledocKitUtilsAssert['default'])('No handler "' + methodName + '" for ' + eventName, !!this[methodName]);

        this[methodName].apply(this, args);
      }
    }, {
      key: 'handleMouseup',
      value: function handleMouseup() {
        var _this6 = this;

        // mouseup does not correctly report a selection until the next tick
        setTimeout(function () {
          return _this6._reportSelectionState();
        }, 0);
      }
    }, {
      key: 'handleKeyup',
      value: function handleKeyup() {
        this._reportSelectionState();
      }

      /*
         The following events/sequences can create a selection and are handled:
           * mouseup -- can happen anywhere in document, must wait until next tick to read selection
           * keyup when key is a movement key and shift is pressed -- in editor element
           * keyup when key combo was cmd-A (alt-A) aka "select all"
           * keyup when key combo was cmd-Z (browser may restore selection)
         These cases can create a selection and are not handled:
           * ctrl-click -> context menu -> click "select all"
       */
    }, {
      key: '_reportSelectionState',
      value: function _reportSelectionState() {
        this.runCallbacks(CALLBACK_QUEUES.CURSOR_DID_CHANGE);
      }
    }, {
      key: '_insertEmptyMarkupSectionAtCursor',
      value: function _insertEmptyMarkupSectionAtCursor() {
        var _this7 = this;

        this.run(function (postEditor) {
          var section = postEditor.builder.createMarkupSection('p');
          postEditor.insertSectionBefore(_this7.post.sections, section);
          postEditor.setRange(_mobiledocKitUtilsCursorRange['default'].fromSection(section));
        });
      }
    }, {
      key: 'handleKeydown',
      value: function handleKeydown(event) {
        var _this8 = this;

        if (!this.isEditable || this.handleKeyCommand(event)) {
          return;
        }

        if (this.post.isBlank) {
          this._insertEmptyMarkupSectionAtCursor();
        }

        var key = _mobiledocKitUtilsKey['default'].fromEvent(event);
        var range = undefined,
            nextPosition = undefined;

        switch (true) {
          case key.isHorizontalArrow():
            range = this.cursor.offsets;
            var position = range.tail;
            if (range.direction === _mobiledocKitUtilsKey.DIRECTION.BACKWARD) {
              position = range.head;
            }
            nextPosition = position.move(key.direction);
            if (position.section.isCardSection || position.marker && position.marker.isAtom || nextPosition && nextPosition.marker && nextPosition.marker.isAtom) {
              if (nextPosition) {
                var newRange = undefined;
                if (key.isShift()) {
                  newRange = range.moveFocusedPosition(key.direction);
                } else {
                  newRange = new _mobiledocKitUtilsCursorRange['default'](nextPosition);
                }
                this.selectRange(newRange);
                event.preventDefault();
              }
            }
            break;
          case key.isDelete():
            this.handleDeletion(event);
            event.preventDefault();
            break;
          case key.isEnter():
            this.handleNewline(event);
            break;
          case key.isPrintable():
            range = this.range;
            var _range = range,
                isCollapsed = _range.isCollapsed;

            nextPosition = range.head;

            if (this.handleExpansion(event)) {
              event.preventDefault();
              break;
            }

            var shouldPreventDefault = isCollapsed && range.head.section.isCardSection;

            var didEdit = false;
            var isMarkerable = range.head.section.isMarkerable;
            var isVisibleWhitespace = isMarkerable && (key.isTab() || key.isSpace());

            this.run(function (postEditor) {
              if (!isCollapsed) {
                nextPosition = postEditor.deleteRange(range);
                didEdit = true;
              }

              if (isVisibleWhitespace) {
                var toInsert = key.isTab() ? _mobiledocKitUtilsCharacters.TAB : _mobiledocKitUtilsCharacters.SPACE;
                shouldPreventDefault = true;
                didEdit = true;
                nextPosition = postEditor.insertText(nextPosition, toInsert);
              }

              if (nextPosition.marker && nextPosition.marker.isAtom) {
                didEdit = true;
                // ensure that the cursor is properly repositioned one character forward
                // after typing on either side of an atom
                _this8.addCallbackOnce(CALLBACK_QUEUES.DID_REPARSE, function () {
                  var position = nextPosition.move(_mobiledocKitUtilsKey.DIRECTION.FORWARD);
                  var nextRange = new _mobiledocKitUtilsCursorRange['default'](position);

                  _this8.run(function (postEditor) {
                    return postEditor.setRange(nextRange);
                  });
                });
              }
              if (nextPosition && nextPosition !== range.head) {
                didEdit = true;
                postEditor.setRange(new _mobiledocKitUtilsCursorRange['default'](nextPosition));
              }

              if (!didEdit) {
                // this ensures we don't push an empty snapshot onto the undo stack
                postEditor.cancelSnapshot();
              }
            });
            if (shouldPreventDefault) {
              event.preventDefault();
            }
            break;
        }
      }

      /**
       * Finds and runs first matching text expansion for this event
       * @param {Event} event keyboard event
       * @return {Boolean} True when an expansion was found and run
       * @private
       */
    }, {
      key: 'handleExpansion',
      value: function handleExpansion(keyEvent) {
        var expansion = (0, _mobiledocKitEditorTextExpansions.findExpansion)(this.expansions, keyEvent, this);
        if (expansion) {
          expansion.run(this);
          return true;
        }
        return false;
      }

      /**
       * Finds and runs the first matching key command for the event
       *
       * If multiple commands are bound to a key combination, the
       * first matching one is run.
       *
       * If a command returns `false` then the next matching command
       * is run instead.
       *
       * @method handleKeyCommand
       * @param {Event} event The keyboard event triggered by the user
       * @return {Boolean} true when a command was successfully run
       * @private
       */
    }, {
      key: 'handleKeyCommand',
      value: function handleKeyCommand(event) {
        var keyCommands = (0, _mobiledocKitEditorKeyCommands.findKeyCommands)(this.keyCommands, event);
        for (var i = 0; i < keyCommands.length; i++) {
          var keyCommand = keyCommands[i];
          if (keyCommand.run(this) !== false) {
            event.preventDefault();
            return true;
          }
        }
        return false;
      }
    }, {
      key: 'handleCut',
      value: function handleCut(event) {
        event.preventDefault();

        this.handleCopy(event);
        this.handleDeletion();
      }
    }, {
      key: 'handleCopy',
      value: function handleCopy(event) {
        event.preventDefault();

        (0, _mobiledocKitUtilsPasteUtils.setClipboardCopyData)(event, this);
      }
    }, {
      key: 'handlePaste',
      value: function handlePaste(event) {
        event.preventDefault();

        var position = this.cursor.offsets.head;

        if (position.section.isCardSection) {
          return;
        }

        if (this.cursor.hasSelection()) {
          this.handleDeletion();
        }

        var pastedPost = (0, _mobiledocKitUtilsPasteUtils.parsePostFromPaste)(event, this.builder, this._parserPlugins);

        this.run(function (postEditor) {
          var nextPosition = postEditor.insertPost(position, pastedPost);
          postEditor.setRange(new _mobiledocKitUtilsCursorRange['default'](nextPosition));
        });
      }

      // @private
    }, {
      key: '_setCardMode',
      value: function _setCardMode(cardSection, mode) {
        var renderNode = cardSection.renderNode;
        if (renderNode && renderNode.isRendered) {
          var cardNode = renderNode.cardNode;
          cardNode[mode]();
        } else {
          cardSection.setInitialMode(mode);
        }
      }
    }, {
      key: 'builder',
      get: function get() {
        if (!this._builder) {
          this._builder = new _mobiledocKitModelsPostNodeBuilder['default']();
        }
        return this._builder;
      }
    }, {
      key: 'expansions',
      get: function get() {
        if (!this._expansions) {
          this._expansions = [];
        }
        return this._expansions;
      }
    }, {
      key: 'keyCommands',
      get: function get() {
        if (!this._keyCommands) {
          this._keyCommands = [];
        }
        return this._keyCommands;
      }
    }, {
      key: 'cursor',
      get: function get() {
        return new _mobiledocKitUtilsCursor['default'](this);
      }

      // "read" the range from dom unless it has been set explicitly
      // Any method that sets the range explicitly should ensure that
      // the range is rendered and cleaned later
    }, {
      key: 'range',
      get: function get() {
        return this._range || this.cursor.offsets;
      },
      set: function set(newRange) {
        this._range = newRange;
      }
    }, {
      key: 'activeSections',
      get: function get() {
        return this.cursor.activeSections;
      }
    }, {
      key: 'activeSection',
      get: function get() {
        var activeSections = this.activeSections;

        return activeSections[activeSections.length - 1];
      }
    }, {
      key: 'markupsInSelection',
      get: function get() {
        if (this.cursor.hasCursor()) {
          var range = this.range;

          return this.post.markupsInRange(range);
        } else {
          return [];
        }
      }
    }, {
      key: 'hasRendered',
      get: function get() {
        return !!this.element;
      }
    }]);

    return Editor;
  })();

  (0, _mobiledocKitUtilsMixin['default'])(Editor, _mobiledocKitUtilsEventEmitter['default']);
  (0, _mobiledocKitUtilsMixin['default'])(Editor, _mobiledocKitUtilsEventListener['default']);
  (0, _mobiledocKitUtilsMixin['default'])(Editor, _mobiledocKitUtilsLifecycleCallbacks['default']);

  exports['default'] = Editor;
});
define('mobiledoc-kit/editor/key-commands', ['exports', 'mobiledoc-kit/utils/key', 'mobiledoc-kit/utils/array-utils', 'mobiledoc-kit/utils/assert', 'mobiledoc-kit/utils/cursor/range', 'mobiledoc-kit/utils/browser'], function (exports, _mobiledocKitUtilsKey, _mobiledocKitUtilsArrayUtils, _mobiledocKitUtilsAssert, _mobiledocKitUtilsCursorRange, _mobiledocKitUtilsBrowser) {
  'use strict';

  exports.buildKeyCommand = buildKeyCommand;
  exports.validateKeyCommand = validateKeyCommand;
  exports.findKeyCommands = findKeyCommands;

  function _toArray(arr) { return Array.isArray(arr) ? arr : Array.from(arr); }

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
        range = new _mobiledocKitUtilsCursorRange['default'](range.head, range.head.section.tailPosition());
      }
      editor.run(function (postEditor) {
        var nextPosition = postEditor.deleteRange(range);
        postEditor.setRange(new _mobiledocKitUtilsCursorRange['default'](nextPosition));
      });
    }
  }, {
    str: 'CTRL+A',
    run: function run(editor) {
      if (!_mobiledocKitUtilsBrowser['default'].isMac) {
        return false;
      }
      var range = editor.range;
      var section = range.head.section;

      editor.run(function (postEditor) {
        postEditor.setRange(new _mobiledocKitUtilsCursorRange['default'](section.headPosition()));
      });
    }
  }, {
    str: 'CTRL+E',
    run: function run(editor) {
      if (!_mobiledocKitUtilsBrowser['default'].isMac) {
        return false;
      }
      var range = editor.range;
      var section = range.tail.section;

      editor.run(function (postEditor) {
        postEditor.setRange(new _mobiledocKitUtilsCursorRange['default'](section.tailPosition()));
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
      if (_mobiledocKitUtilsBrowser['default'].isMac) {
        return false;
      }
      editor.run(function (postEditor) {
        return postEditor.undoLastChange();
      });
    }
  }, {
    str: 'CTRL+SHIFT+Z',
    run: function run(editor) {
      if (_mobiledocKitUtilsBrowser['default'].isMac) {
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
    return (0, _mobiledocKitUtilsArrayUtils.reduce)(modiferNames, function (sum, name) {
      var modifier = _mobiledocKitUtilsKey.MODIFIERS[name.toUpperCase()];
      (0, _mobiledocKitUtilsAssert['default'])('No modifier named "' + name + '" found', !!modifier);
      return sum + modifier;
    }, defaultVal);
  }

  function characterToCode(character) {
    var upperCharacter = character.toUpperCase();
    var special = _mobiledocKitUtilsKey.SPECIAL_KEYS[upperCharacter];
    if (special) {
      return special;
    } else {
      (0, _mobiledocKitUtilsAssert['default'])('Only 1 character can be used in a key command str (got "' + character + '")', character.length === 1);
      return upperCharacter.charCodeAt(0);
    }
  }

  function buildKeyCommand(keyCommand) {
    var str = keyCommand.str;

    if (!str) {
      return keyCommand;
    }
    (0, _mobiledocKitUtilsAssert['default'])('[deprecation] Key commands no longer use the `modifier` property', !keyCommand.modifier);

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
    var key = _mobiledocKitUtilsKey['default'].fromEvent(keyEvent);

    return (0, _mobiledocKitUtilsArrayUtils.filter)(keyCommands, function (_ref) {
      var modifierMask = _ref.modifierMask;
      var code = _ref.code;

      return key.keyCode === code && key.modifierMask === modifierMask;
    });
  }
});
define('mobiledoc-kit/editor/mutation-handler', ['exports', 'mobiledoc-kit/utils/set', 'mobiledoc-kit/utils/array-utils', 'mobiledoc-kit/utils/assert', 'mobiledoc-kit/utils/dom-utils', 'mobiledoc-kit/renderers/editor-dom'], function (exports, _mobiledocKitUtilsSet, _mobiledocKitUtilsArrayUtils, _mobiledocKitUtilsAssert, _mobiledocKitUtilsDomUtils, _mobiledocKitRenderersEditorDom) {
  'use strict';

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  var MUTATION = {
    NODES_CHANGED: 'childList',
    CHARACTER_DATA: 'characterData'
  };

  var MutationHandler = (function () {
    function MutationHandler(editor) {
      var _this = this;

      _classCallCheck(this, MutationHandler);

      this.editor = editor;
      this.renderTree = null;
      this._isObserving = false;

      this._observer = new MutationObserver(function (mutations) {
        _this._handleMutations(mutations);
      });
    }

    _createClass(MutationHandler, [{
      key: 'destroy',
      value: function destroy() {
        this.stopObserving();
        this._observer = null;
      }
    }, {
      key: 'suspendObservation',
      value: function suspendObservation(callback) {
        this.stopObserving();
        callback();
        this.startObserving();
      }
    }, {
      key: 'stopObserving',
      value: function stopObserving() {
        if (this._isObserving) {
          this._isObserving = false;
          this._observer.disconnect();
        }
      }
    }, {
      key: 'startObserving',
      value: function startObserving() {
        if (!this._isObserving) {
          var editor = this.editor;

          (0, _mobiledocKitUtilsAssert['default'])('Cannot observe un-rendered editor', editor.hasRendered);

          this._isObserving = true;
          this.renderTree = editor._renderTree;

          this._observer.observe(editor.element, {
            characterData: true,
            childList: true,
            subtree: true
          });
        }
      }
    }, {
      key: 'reparsePost',
      value: function reparsePost() {
        this.editor._reparsePost();
      }
    }, {
      key: 'reparseSections',
      value: function reparseSections(sections) {
        this.editor._reparseSections(sections);
      }

      /**
       * for each mutation:
       *   * find the target nodes:
       *     * if nodes changed, target nodes are:
       *        * added nodes
       *        * the target from which removed nodes were removed
       *     * if character data changed
       *       * target node is the mutation event's target (text node)
       *     * filter out nodes that are no longer attached (parentNode is null)
       *   * for each remaining node:
       *   *  find its section, add to sections-to-reparse
       *   *  if no section, reparse all (and break)
       */
    }, {
      key: '_handleMutations',
      value: function _handleMutations(mutations) {
        var reparsePost = false;
        var sections = new _mobiledocKitUtilsSet['default']();

        for (var i = 0; i < mutations.length; i++) {
          if (reparsePost) {
            break;
          }

          var nodes = this._findTargetNodes(mutations[i]);

          for (var j = 0; j < nodes.length; j++) {
            var node = nodes[j];
            var renderNode = this._findSectionRenderNodeFromNode(node);
            if (renderNode) {
              if (renderNode.reparsesMutationOfChildNode(node)) {
                sections.add(renderNode.postNode);
              }
            } else {
              reparsePost = true;
              break;
            }
          }
        }

        if (reparsePost) {
          this.reparsePost();
        } else if (sections.length) {
          this.reparseSections(sections.toArray());
        }
      }
    }, {
      key: '_findTargetNodes',
      value: function _findTargetNodes(mutation) {
        var nodes = [];

        switch (mutation.type) {
          case MUTATION.CHARACTER_DATA:
            nodes.push(mutation.target);
            break;
          case MUTATION.NODES_CHANGED:
            (0, _mobiledocKitUtilsArrayUtils.forEach)(mutation.addedNodes, function (n) {
              return nodes.push(n);
            });
            if (mutation.removedNodes.length) {
              nodes.push(mutation.target);
            }
            break;
        }

        var element = this.editor.element;
        var atomClass = '.' + _mobiledocKitRenderersEditorDom.ATOM_CLASS_NAME;
        var attachedNodes = (0, _mobiledocKitUtilsArrayUtils.filter)(nodes, function (node) {
          return (0, _mobiledocKitUtilsDomUtils.containsNode)(element, node) && !(0, _mobiledocKitUtilsDomUtils.closest)(node, atomClass, true);
        });
        return attachedNodes;
      }
    }, {
      key: '_findSectionRenderNodeFromNode',
      value: function _findSectionRenderNodeFromNode(node) {
        return this.renderTree.findRenderNodeFromElement(node, function (rn) {
          return rn.postNode.isSection;
        });
      }
    }]);

    return MutationHandler;
  })();

  exports['default'] = MutationHandler;
});
define('mobiledoc-kit/editor/post/post-inserter', ['exports', 'mobiledoc-kit/utils/assert', 'mobiledoc-kit/models/types', 'mobiledoc-kit/utils/cursor/range'], function (exports, _mobiledocKitUtilsAssert, _mobiledocKitModelsTypes, _mobiledocKitUtilsCursorRange) {
  'use strict';

  var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  var MARKERABLE = 'markerable',
      NESTED_MARKERABLE = 'nested_markerable',
      NON_MARKERABLE = 'non_markerable';

  var Visitor = (function () {
    function Visitor(inserter, cursorPosition) {
      _classCallCheck(this, Visitor);

      var postEditor = inserter.postEditor;
      var post = inserter.post;

      this.postEditor = postEditor;
      this._post = post;
      this.cursorPosition = cursorPosition;
      this.builder = this.postEditor.builder;

      this._hasInsertedFirstLeafSection = false;
    }

    _createClass(Visitor, [{
      key: 'visit',
      value: function visit(node) {
        var method = node.type;
        (0, _mobiledocKitUtilsAssert['default'])('Cannot visit node of type ' + node.type, !!this[method]);
        this[method](node);
      }
    }, {
      key: '_canMergeSection',
      value: function _canMergeSection(section) {
        if (this._hasInsertedFirstLeafSection) {
          return false;
        } else {
          return this._isMarkerable && section.isMarkerable;
        }
      }
    }, {
      key: _mobiledocKitModelsTypes.POST_TYPE,
      value: function value(node) {
        var _this = this;

        if (this.cursorSection.isBlank && !this._isNested) {
          // replace blank section with entire post
          var newSections = node.sections.map(function (s) {
            return s.clone();
          });
          this._replaceSection(this.cursorSection, newSections);
          this.cursorPosition = newSections[newSections.length - 1].tailPosition();
        } else {
          node.sections.forEach(function (section) {
            return _this.visit(section);
          });
        }
      }
    }, {
      key: _mobiledocKitModelsTypes.MARKUP_SECTION_TYPE,
      value: function value(node) {
        this[MARKERABLE](node);
      }
    }, {
      key: _mobiledocKitModelsTypes.LIST_SECTION_TYPE,
      value: function value(node) {
        var _this2 = this;

        var hasNext = !!node.next;
        node.items.forEach(function (item) {
          return _this2.visit(item);
        });

        if (this._isNested && hasNext) {
          this._breakNestedAtCursor();
        }
      }
    }, {
      key: _mobiledocKitModelsTypes.LIST_ITEM_TYPE,
      value: function value(node) {
        this[NESTED_MARKERABLE](node);
      }
    }, {
      key: _mobiledocKitModelsTypes.CARD_TYPE,
      value: function value(node) {
        this[NON_MARKERABLE](node);
      }
    }, {
      key: _mobiledocKitModelsTypes.IMAGE_SECTION_TYPE,
      value: function value(node) {
        this[NON_MARKERABLE](node);
      }
    }, {
      key: NON_MARKERABLE,
      value: function value(section) {
        if (this._isNested) {
          this._breakNestedAtCursor();
        } else if (!this.cursorSection.isBlank) {
          this._breakAtCursor();
        }

        this._insertLeafSection(section);
      }
    }, {
      key: MARKERABLE,
      value: function value(section) {
        if (this._canMergeSection(section)) {
          this._mergeSection(section);
        } else {
          this._breakAtCursor();
          this._insertLeafSection(section);
        }
      }
    }, {
      key: NESTED_MARKERABLE,
      value: function value(section) {
        if (this._canMergeSection(section)) {
          this._mergeSection(section);
          return;
        }

        section = this._isNested ? section : this._wrapNestedSection(section);
        this._breakAtCursor();
        this._insertLeafSection(section);
      }

      // break out of a nested cursor position
    }, {
      key: '_breakNestedAtCursor',
      value: function _breakNestedAtCursor() {
        (0, _mobiledocKitUtilsAssert['default'])('Cannot call _breakNestedAtCursor if not nested', this._isNested);

        var parent = this.cursorSection.parent,
            cursorAtEndOfList = this.cursorPosition.isEqual(parent.tailPosition());

        if (cursorAtEndOfList) {
          var blank = this.builder.createMarkupSection();
          this._insertSectionAfter(blank, parent);
          this.cursorPosition = blank.headPosition();
        } else {
          var _breakListAtCursor2 = this._breakListAtCursor();

          var _breakListAtCursor22 = _slicedToArray(_breakListAtCursor2, 3);

          var pre = _breakListAtCursor22[0];
          var blank = _breakListAtCursor22[1];
          var post = _breakListAtCursor22[2];
          // jshint ignore:line
          this.cursorPosition = blank.headPosition();
        }
      }
    }, {
      key: '_breakListAtCursor',
      value: function _breakListAtCursor() {
        (0, _mobiledocKitUtilsAssert['default'])('Cannot _splitParentSection if cursor position is not nested', this._isNested);

        var list = this.cursorSection.parent,
            position = this.cursorPosition,
            blank = this.builder.createMarkupSection();

        var _postEditor$_splitListAtPosition = this.postEditor._splitListAtPosition(list, position);

        var _postEditor$_splitListAtPosition2 = _slicedToArray(_postEditor$_splitListAtPosition, 2);

        var pre = _postEditor$_splitListAtPosition2[0];
        var post = _postEditor$_splitListAtPosition2[1];

        var collection = this._post.sections,
            reference = post;
        this.postEditor.insertSectionBefore(collection, blank, reference);
        return [pre, blank, post];
      }
    }, {
      key: '_insertSectionAfter',
      value: function _insertSectionAfter(section, parent) {
        (0, _mobiledocKitUtilsAssert['default'])('Cannot _insertSectionAfter nested section', !parent.isNested);
        var reference = parent.next;
        var collection = this._post.sections;
        this.postEditor.insertSectionBefore(collection, section, reference);
      }
    }, {
      key: '_wrapNestedSection',
      value: function _wrapNestedSection(section) {
        var tagName = section.parent.tagName;
        var parent = this.builder.createListSection(tagName);
        parent.items.append(section.clone());
        return parent;
      }
    }, {
      key: '_mergeSection',
      value: function _mergeSection(section) {
        (0, _mobiledocKitUtilsAssert['default'])('Can only merge markerable sections', this._isMarkerable && section.isMarkerable);
        this._hasInsertedFirstLeafSection = true;

        var markers = section.markers.map(function (m) {
          return m.clone();
        });
        var position = this.postEditor.insertMarkers(this.cursorPosition, markers);

        this.cursorPosition = position;
      }

      // Can be called to add a line break when in a nested section or a parent
      // section.
    }, {
      key: '_breakAtCursor',
      value: function _breakAtCursor() {
        if (this.cursorSection.isBlank) {
          return;
        } else if (this._isMarkerable) {
          this._breakMarkerableAtCursor();
        } else {
          this._breakNonMarkerableAtCursor();
        }
      }

      // Inserts a blank section before/after the cursor,
      // depending on cursor position.
    }, {
      key: '_breakNonMarkerableAtCursor',
      value: function _breakNonMarkerableAtCursor() {
        var collection = this._post.sections,
            blank = this.builder.createMarkupSection(),
            reference = this.cursorPosition.isHead() ? this.cursorSection : this.cursorSection.next;
        this.postEditor.insertSectionBefore(collection, blank, reference);
        this.cursorPosition = blank.tailPosition();
      }
    }, {
      key: '_breakMarkerableAtCursor',
      value: function _breakMarkerableAtCursor() {
        var _postEditor$splitSection = // jshint ignore:line
        this.postEditor.splitSection(this.cursorPosition);

        var _postEditor$splitSection2 = _slicedToArray(_postEditor$splitSection, 2);

        var pre = _postEditor$splitSection2[0];
        var post = _postEditor$splitSection2[1];

        this.cursorPosition = pre.tailPosition();
      }
    }, {
      key: '_replaceSection',
      value: function _replaceSection(section, newSections) {
        var _this3 = this;

        (0, _mobiledocKitUtilsAssert['default'])('Cannot replace section that does not have parent.sections', section.parent && section.parent.sections);
        (0, _mobiledocKitUtilsAssert['default'])('Must pass enumerable to _replaceSection', !!newSections.forEach);

        var collection = section.parent.sections,
            reference = section.next;
        this.postEditor.removeSection(section);
        newSections.forEach(function (_newSection) {
          _this3.postEditor.insertSectionBefore(collection, _newSection, reference);
        });
      }
    }, {
      key: '_insertLeafSection',
      value: function _insertLeafSection(section) {
        (0, _mobiledocKitUtilsAssert['default'])('Can only _insertLeafSection when cursor is at end of section', this.cursorPosition.isTail());

        this._hasInsertedFirstLeafSection = true;
        section = section.clone();

        if (this.cursorSection.isBlank) {
          (0, _mobiledocKitUtilsAssert['default'])('Cannot insert leaf non-markerable section when cursor is nested', !(section.isMarkerable && this._isNested));
          this._replaceSection(this.cursorSection, [section]);
        } else if (this.cursorSection.next && this.cursorSection.next.isBlank) {
          this._replaceSection(this.cursorSection.next, [section]);
        } else {
          var reference = this.cursorSection.next;
          var collection = this.cursorSection.parent.sections;
          this.postEditor.insertSectionBefore(collection, section, reference);
        }

        this.cursorPosition = section.tailPosition();
      }
    }, {
      key: 'cursorPosition',
      get: function get() {
        return this._cursorPosition;
      },
      set: function set(position) {
        this._cursorPosition = position;
        this.postEditor.setRange(new _mobiledocKitUtilsCursorRange['default'](position));
      }
    }, {
      key: '_isMarkerable',
      get: function get() {
        return this.cursorSection.isMarkerable;
      }
    }, {
      key: 'cursorSection',
      get: function get() {
        return this.cursorPosition.section;
      }
    }, {
      key: 'cursorOffset',
      get: function get() {
        return this.cursorPosition.offset;
      }
    }, {
      key: '_isNested',
      get: function get() {
        return this.cursorSection.isNested;
      }
    }]);

    return Visitor;
  })();

  var Inserter = (function () {
    function Inserter(postEditor, post) {
      _classCallCheck(this, Inserter);

      this.postEditor = postEditor;
      this.post = post;
    }

    _createClass(Inserter, [{
      key: 'insert',
      value: function insert(cursorPosition, newPost) {
        var visitor = new Visitor(this, cursorPosition);
        visitor.visit(newPost);
        return visitor.cursorPosition;
      }
    }]);

    return Inserter;
  })();

  exports['default'] = Inserter;
});
define('mobiledoc-kit/editor/post', ['exports', 'mobiledoc-kit/utils/cursor/position', 'mobiledoc-kit/utils/array-utils', 'mobiledoc-kit/utils/key', 'mobiledoc-kit/utils/lifecycle-callbacks', 'mobiledoc-kit/utils/mixin', 'mobiledoc-kit/utils/assert', 'mobiledoc-kit/utils/dom-utils', 'mobiledoc-kit/utils/cursor/range', 'mobiledoc-kit/editor/post/post-inserter'], function (exports, _mobiledocKitUtilsCursorPosition, _mobiledocKitUtilsArrayUtils, _mobiledocKitUtilsKey, _mobiledocKitUtilsLifecycleCallbacks, _mobiledocKitUtilsMixin, _mobiledocKitUtilsAssert, _mobiledocKitUtilsDomUtils, _mobiledocKitUtilsCursorRange, _mobiledocKitEditorPostPostInserter) {
  'use strict';

  var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  function isListSectionTagName(tagName) {
    return tagName === 'ul' || tagName === 'ol';
  }

  var CALLBACK_QUEUES = {
    BEFORE_COMPLETE: 'beforeComplete',
    COMPLETE: 'complete',
    AFTER_COMPLETE: 'afterComplete'
  };

  var PostEditor = (function () {
    function PostEditor(editor) {
      var _this = this;

      _classCallCheck(this, PostEditor);

      this.editor = editor;
      this.builder = this.editor.builder;

      this._didScheduleRerender = false;
      this._didScheduleUpdate = false;
      this._didComplete = false;

      this._renderRange = function () {
        return _this.editor.renderRange();
      };
    }

    _createClass(PostEditor, [{
      key: 'begin',
      value: function begin() {
        // mark the editor's range as "dirty"
        // this forces the editor to cache its range so that
        // it doesn't try to read from DOM while we are modifying the post abstract
        this.editor.range = this.editor.cursor.offsets;
      }
    }, {
      key: 'setRange',
      value: function setRange(range) {
        // TODO validate that the range is valid (does not contain marked-for-removal head or tail sections?)
        this.editor.range = range;
        this.addCallbackOnce(CALLBACK_QUEUES.AFTER_COMPLETE, this._renderRange);
      }

      /**
       * Remove a range from the post
       *
       * Usage:
       *
       *     let { range } = editor;
       *     editor.run((postEditor) => {
       *       postEditor.deleteRange(range);
       *     });
       *
       * @method deleteRange
       * @param {Range} range Cursor Range object with head and tail Positions
       * @return {Position} The position where the cursor would go after deletion
       * @public
       */
    }, {
      key: 'deleteRange',
      value: function deleteRange(range) {
        var _this2 = this;

        // types of selection deletion:
        //   * a selection starts at the beginning of a section
        //     -- cursor should end up at the beginning of that section
        //     -- if the section not longer has markers, add a blank one for the cursor to focus on
        //   * a selection is entirely within a section
        //     -- split the markers with the selection, remove those new markers from their section
        //     -- cursor goes at end of the marker before the selection start, or if the
        //     -- selection was at the start of the section, cursor goes at section start
        //   * a selection crosses multiple sections
        //     -- remove all the sections that are between (exclusive) selection start and end
        //     -- join the start and end sections
        //     -- mark the end section for removal
        //     -- cursor goes at end of marker before the selection start

        var _range$head = range.head;
        var headSection = _range$head.section;
        var headSectionOffset = _range$head.offset;
        var _range$tail = range.tail;
        var tailSection = _range$tail.section;
        var tailSectionOffset = _range$tail.offset;
        var post = this.editor.post;

        var nextPosition = undefined;

        if (headSection === tailSection) {
          nextPosition = this.cutSection(headSection, headSectionOffset, tailSectionOffset);
        } else {
          (function () {
            var removedSections = post.sectionsContainedBy(range);
            var appendSection = headSection;

            post.walkLeafSections(range, function (section) {
              switch (section) {
                case headSection:
                  if (section.isCardSection) {
                    appendSection = _this2.builder.createMarkupSection();

                    if (headSectionOffset === 0) {
                      removedSections.push(section);
                      nextPosition = appendSection.headPosition();
                    } else {
                      nextPosition = section.tailPosition();
                    }
                  } else {
                    nextPosition = _this2.cutSection(section, headSectionOffset, section.length);
                  }
                  break;
                case tailSection:
                  if (section.isCardSection) {
                    if (tailSectionOffset === 1) {
                      removedSections.push(section);
                    }
                  } else {
                    section.markersFor(tailSectionOffset, section.text.length).forEach(function (m) {
                      appendSection.markers.append(m);
                    });
                    _this2._markDirty(headSection); // May have added nodes
                    removedSections.push(section);
                  }
                  break;
                default:
                  if (removedSections.indexOf(section) === -1) {
                    removedSections.push(section);
                  }
              }
            });
            if (headSection !== appendSection) {
              _this2.insertSectionBefore(post.sections, appendSection, headSection.next);
            }
            removedSections.forEach(function (section) {
              return _this2.removeSection(section);
            });
          })();
        }

        return nextPosition;
      }

      /**
       * @return {Position}
       */
    }, {
      key: 'cutSection',
      value: function cutSection(section, headSectionOffset, tailSectionOffset) {
        if (section.isBlank || headSectionOffset === tailSectionOffset) {
          return new _mobiledocKitUtilsCursorPosition['default'](section, headSectionOffset);
        }
        if (section.isCardSection) {
          var newSection = this.builder.createMarkupSection();
          this.replaceSection(section, newSection);
          return newSection.headPosition();
        }

        var adjustedHead = 0,
            marker = section.markers.head,
            adjustedTail = marker.length;

        // Walk to the first node inside the headSectionOffset, splitting
        // a marker if needed. Leave marker as the first node inside.
        while (marker) {
          if (adjustedTail >= headSectionOffset) {
            var splitOffset = headSectionOffset - adjustedHead;

            var _splitMarker = this.splitMarker(marker, splitOffset);

            var afterMarker = _splitMarker.afterMarker;

            adjustedHead = adjustedHead + splitOffset;
            // FIXME: That these two loops cannot agree on adjustedTail being
            // incremented at the start or end seems prime for refactoring.
            adjustedTail = adjustedHead;
            marker = afterMarker;
            break;
          }
          adjustedHead += marker.length;
          marker = marker.next;
          if (marker) {
            adjustedTail += marker.length;
          }
        }

        // Walk each marker inside, removing it if needed. when the last is
        // reached split it and remove the part inside the tailSectionOffset
        while (marker) {
          adjustedTail += marker.length;
          if (adjustedTail >= tailSectionOffset) {
            var splitOffset = marker.length - (adjustedTail - tailSectionOffset);

            var _splitMarker2 = this.splitMarker(marker, splitOffset);

            var beforeMarker = _splitMarker2.beforeMarker;

            if (beforeMarker) {
              this.removeMarker(beforeMarker);
            }
            break;
          }
          adjustedHead += marker.length;
          var nextMarker = marker.next;
          this.removeMarker(marker);
          marker = nextMarker;
        }

        return new _mobiledocKitUtilsCursorPosition['default'](section, headSectionOffset);
      }
    }, {
      key: '_coalesceMarkers',
      value: function _coalesceMarkers(section) {
        if (section.isMarkerable) {
          this._removeBlankMarkers(section);
          this._joinSimilarMarkers(section);
        }
      }
    }, {
      key: '_removeBlankMarkers',
      value: function _removeBlankMarkers(section) {
        var _this3 = this;

        (0, _mobiledocKitUtilsArrayUtils.forEach)((0, _mobiledocKitUtilsArrayUtils.filter)(section.markers, function (m) {
          return m.isBlank;
        }), function (m) {
          return _this3.removeMarker(m);
        });
      }

      // joins markers that have identical markups
    }, {
      key: '_joinSimilarMarkers',
      value: function _joinSimilarMarkers(section) {
        var marker = section.markers.head;
        var nextMarker = undefined;
        while (marker && marker.next) {
          nextMarker = marker.next;

          if (marker.canJoin(nextMarker)) {
            nextMarker.value = marker.value + nextMarker.value;
            this._markDirty(nextMarker);
            this.removeMarker(marker);
          }

          marker = nextMarker;
        }
      }
    }, {
      key: 'removeMarker',
      value: function removeMarker(marker) {
        this._scheduleForRemoval(marker);
        if (marker.section) {
          this._markDirty(marker.section);
          marker.section.markers.remove(marker);
        }
      }
    }, {
      key: '_scheduleForRemoval',
      value: function _scheduleForRemoval(postNode) {
        var _this4 = this;

        if (postNode.renderNode) {
          postNode.renderNode.scheduleForRemoval();

          this.scheduleRerender();
          this.scheduleDidUpdate();
        }
        var removedAdjacentToList = postNode.prev && postNode.prev.isListSection || postNode.next && postNode.next.isListSection;
        if (removedAdjacentToList) {
          this.addCallback(CALLBACK_QUEUES.BEFORE_COMPLETE, function () {
            return _this4._joinContiguousListSections();
          });
        }
      }
    }, {
      key: '_joinContiguousListSections',
      value: function _joinContiguousListSections() {
        var _this5 = this;

        var _editor = this.editor;
        var post = _editor.post;
        var range = _editor.range;

        var prev = undefined;
        var groups = [];
        var currentGroup = undefined;

        // FIXME do we need to force a re-render of the range if changed sections
        // are contained within the range?
        var updatedHead = null;
        (0, _mobiledocKitUtilsArrayUtils.forEach)(post.sections, function (section) {
          if (prev && prev.isListSection && section.isListSection && prev.tagName === section.tagName) {

            currentGroup = currentGroup || [prev];
            currentGroup.push(section);
          } else {
            if (currentGroup) {
              groups.push(currentGroup);
            }
            currentGroup = null;
          }
          prev = section;
        });

        if (currentGroup) {
          groups.push(currentGroup);
        }

        (0, _mobiledocKitUtilsArrayUtils.forEach)(groups, function (group) {
          var list = group[0];
          (0, _mobiledocKitUtilsArrayUtils.forEach)(group, function (listSection) {
            if (listSection !== list) {
              var currentHead = range.head;
              var prevPosition = undefined;
              // FIXME is there a currentHead if there is no range?
              // is the current head a list item in the section
              if (currentHead.section.isListItem && currentHead.section.parent === listSection) {
                prevPosition = list.tailPosition();
              }
              _this5._joinListSections(list, listSection);
              if (prevPosition) {
                updatedHead = prevPosition.moveRight();
              }
            }
          });
        });

        if (updatedHead) {
          this.setRange(new _mobiledocKitUtilsCursorRange['default'](updatedHead, updatedHead, range.direction));
        }
      }
    }, {
      key: '_joinListSections',
      value: function _joinListSections(baseList, nextList) {
        baseList.join(nextList);
        this._markDirty(baseList);
        this.removeSection(nextList);
      }
    }, {
      key: '_markDirty',
      value: function _markDirty(postNode) {
        var _this6 = this;

        if (postNode.renderNode) {
          postNode.renderNode.markDirty();

          this.scheduleRerender();
          this.scheduleDidUpdate();
        }
        if (postNode.section) {
          this._markDirty(postNode.section);
        }
        if (postNode.isMarkerable) {
          this.addCallback(CALLBACK_QUEUES.BEFORE_COMPLETE, function () {
            return _this6._coalesceMarkers(postNode);
          });
        }
      }

      /**
       * Remove a character from a {marker, offset} position, in either
       * forward or backward (default) direction.
       *
       * Usage:
       *
       *     let marker = editor.post.sections.head.markers.head;
       *     // marker has text of "Howdy!"
       *     editor.run((postEditor) => {
       *       postEditor.deleteFrom({section, offset: 3});
       *     });
       *     // marker has text of "Hody!"
       *
       * `deleteFrom` may remove a character from a different marker or join the
       * marker's section with the previous/next section (depending on the
       * deletion direction) if direction is `BACKWARD` and the offset is 0,
       * or direction is `FORWARD` and the offset is equal to the length of the
       * marker.
       *
       * @method deleteFrom
       * @param {Position} position object with {section, offset} the marker and offset to delete from
       * @param {Number} direction The direction to delete in (default is BACKWARD)
       * @return {Position} for positioning the cursor
       * @public
       */
    }, {
      key: 'deleteFrom',
      value: function deleteFrom(position) {
        var direction = arguments.length <= 1 || arguments[1] === undefined ? _mobiledocKitUtilsKey.DIRECTION.BACKWARD : arguments[1];

        if (direction === _mobiledocKitUtilsKey.DIRECTION.BACKWARD) {
          return this._deleteBackwardFrom(position);
        } else {
          return this._deleteForwardFrom(position);
        }
      }
    }, {
      key: '_joinPositionToPreviousSection',
      value: function _joinPositionToPreviousSection(position) {
        var section = position.section;

        var nextPosition = position.clone();

        (0, _mobiledocKitUtilsAssert['default'])('Cannot join non-markerable section to previous section', section.isMarkerable);

        if (section.isListItem) {
          var markupSection = this._changeSectionFromListItem(section, 'p');
          nextPosition = markupSection.headPosition();
        } else {
          var prevSection = section.previousLeafSection();

          if (prevSection) {
            if (prevSection.isCardSection) {
              if (section.isBlank) {
                this.removeSection(section);
              }
              nextPosition = prevSection.tailPosition();
            } else {
              var _prevSection$join = prevSection.join(section);

              var beforeMarker = _prevSection$join.beforeMarker;

              this._markDirty(prevSection);
              this.removeSection(section);

              nextPosition.section = prevSection;
              nextPosition.offset = beforeMarker ? prevSection.offsetOfMarker(beforeMarker, beforeMarker.length) : 0;
            }
          }
        }

        return nextPosition;
      }

      /**
       * delete 1 character in the FORWARD direction from the given position
       * @method _deleteForwardFrom
       * @param {Position} position
       * @private
       */
    }, {
      key: '_deleteForwardFrom',
      value: function _deleteForwardFrom(position) {
        var _position = position;
        var section = _position.section;

        if (section.isBlank) {
          // remove this section, focus on start of next markerable section
          var next = section.immediatelyNextMarkerableSection();
          if (next) {
            this.removeSection(section);
            position = next.headPosition();
          }
          return position;
        } else if (position.isTail()) {
          if (section.isCardSection) {
            if (section.next && section.next.isBlank) {
              this.removeSection(section.next);
            }
            return position;
          } else {
            // join next markerable section to this one
            return this._joinPositionToNextSection(position);
          }
        } else {
          if (section.isCardSection && position.isHead()) {
            var newSection = this.builder.createMarkupSection();
            this.replaceSection(section, newSection);
            return newSection.headPosition();
          } else {
            return this._deleteForwardFromMarkerPosition(position.markerPosition);
          }
        }
      }
    }, {
      key: '_joinPositionToNextSection',
      value: function _joinPositionToNextSection(position) {
        var section = position.section;

        (0, _mobiledocKitUtilsAssert['default'])('Cannot join non-markerable section to next section', section.isMarkerable);

        var next = section.immediatelyNextMarkerableSection();
        if (next) {
          section.join(next);
          this._markDirty(section);
          this.removeSection(next);
        }

        return position;
      }

      /**
       * delete 1 character forward from the markerPosition
       *
       * @method _deleteForwardFromMarkerPosition
       * @param {Object} markerPosition {marker, offset}
       * @return {Position} The position the cursor should be put after this deletion
       * @private
       */
    }, {
      key: '_deleteForwardFromMarkerPosition',
      value: function _deleteForwardFromMarkerPosition(markerPosition) {
        var marker = markerPosition.marker;
        var offset = markerPosition.offset;
        var section = marker.section;

        var nextPosition = new _mobiledocKitUtilsCursorPosition['default'](section, section.offsetOfMarker(marker, offset));

        if (offset === marker.length) {
          var nextMarker = marker.next;

          if (nextMarker) {
            var nextMarkerPosition = { marker: nextMarker, offset: 0 };
            return this._deleteForwardFromMarkerPosition(nextMarkerPosition);
          } else {
            var nextSection = marker.section.next;
            if (nextSection && nextSection.isMarkupSection) {
              var currentSection = marker.section;

              currentSection.join(nextSection);
              this._markDirty(currentSection);

              this.removeSection(nextSection);
            }
          }
        } else if (marker.isAtom) {
          // atoms are deleted "atomically"
          this.removeMarker(marker);
        } else {
          marker.deleteValueAtOffset(offset);
          this._markDirty(marker);
        }

        return nextPosition;
      }

      /**
       * delete 1 character in the BACKWARD direction from the given position
       * @method _deleteBackwardFrom
       * @param {Position} position
       * @return {Position} The position the cursor should be put after this deletion
       * @private
       */
    }, {
      key: '_deleteBackwardFrom',
      value: function _deleteBackwardFrom(position) {
        var section = position.section;

        if (position.isHead()) {
          if (section.isCardSection) {
            if (section.prev && section.prev.isBlank) {
              this.removeSection(section.prev);
            }
            return position;
          } else {
            return this._joinPositionToPreviousSection(position);
          }
        }

        // if position is end of a card, replace the card with a blank markup section
        if (section.isCardSection) {
          var newSection = this.builder.createMarkupSection();
          this.replaceSection(section, newSection);
          return newSection.headPosition();
        }

        var nextPosition = position.moveLeft();

        var _position$markerPosition = position.markerPosition;
        var marker = _position$markerPosition.marker;
        var markerOffset = _position$markerPosition.offset;

        var offsetToDeleteAt = markerOffset - 1;

        if (marker.isAtom) {
          this.removeMarker(marker);
        } else {
          marker.deleteValueAtOffset(offsetToDeleteAt);
          this._markDirty(marker);
        }

        return nextPosition;
      }

      /**
       * Split markers at two positions, once at the head, and if necessary once
       * at the tail. This method is designed to accept a range
       * (e.g. `editor.range`) as an argument.
       *
       * Usage:
       *
       *     let markerRange = this.cursor.offsets;
       *     editor.run((postEditor) => {
       *       postEditor.splitMarkers(markerRange);
       *     });
       *
       * The return value will be marker object completely inside the offsets
       * provided. Markers on the outside of the split may also have been modified.
       *
       * @method splitMarkers
       * @param {Range} markerRange
       * @return {Array} of markers that are inside the split
       * @private
       */
    }, {
      key: 'splitMarkers',
      value: function splitMarkers(range) {
        var post = this.editor.post;
        var head = range.head;
        var tail = range.tail;

        this.splitSectionMarkerAtOffset(head.section, head.offset);
        this.splitSectionMarkerAtOffset(tail.section, tail.offset);

        return post.markersContainedByRange(range);
      }
    }, {
      key: 'splitSectionMarkerAtOffset',
      value: function splitSectionMarkerAtOffset(section, offset) {
        var _this7 = this;

        var edit = section.splitMarkerAtOffset(offset);
        edit.removed.forEach(function (m) {
          return _this7.removeMarker(m);
        });
      }
    }, {
      key: 'splitMarker',
      value: function splitMarker(marker, offset) {
        var beforeMarker = undefined,
            afterMarker = undefined;

        if (offset === 0) {
          beforeMarker = marker.prev;
          afterMarker = marker;
        } else if (offset === marker.length) {
          beforeMarker = marker;
          afterMarker = marker.next;
        } else {
          var builder = this.editor.builder;
          var section = marker.section;

          beforeMarker = builder.createMarker(marker.value.substring(0, offset), marker.markups);
          afterMarker = builder.createMarker(marker.value.substring(offset, marker.length), marker.markups);
          section.markers.splice(marker, 1, [beforeMarker, afterMarker]);

          this.removeMarker(marker);
          this._markDirty(section);
        }

        return { beforeMarker: beforeMarker, afterMarker: afterMarker };
      }

      /**
       * Split the section at the position.
       *
       * Usage:
       *
       *     let position = editor.cursor.offsets.head;
       *     editor.run((postEditor) => {
       *       postEditor.splitSection(position);
       *     });
       *     // Will result in the creation of two new sections
       *     // replacing the old one at the cursor position
       *
       * The return value will be the two new sections. One or both of these
       * sections can be blank (contain only a blank marker), for example if the
       * headMarkerOffset is 0.
       *
       * @method splitSection
       * @param {Position} position
       * @return {Array} new sections, one for the first half and one for the second
       * @public
       */
    }, {
      key: 'splitSection',
      value: function splitSection(position) {
        var _this8 = this;

        var section = position.section;

        if (section.isCardSection) {
          return this._splitCardSection(section, position);
        } else if (section.isListItem) {
          var isLastAndBlank = section.isBlank && !section.next;
          if (isLastAndBlank) {
            // if is last, replace the item with a blank markup section
            var _parent = section.parent;
            var collection = this.editor.post.sections;
            var blank = this.builder.createMarkupSection();
            this.removeSection(section);
            this.insertSectionBefore(collection, blank, _parent.next);

            return [null, blank];
          } else {
            var _splitListItem2 = this._splitListItem(section, position);

            var _splitListItem22 = _slicedToArray(_splitListItem2, 2);

            var pre = _splitListItem22[0];
            var post = _splitListItem22[1];

            return [pre, post];
          }
        } else {
          var splitSections = section.splitAtPosition(position);
          splitSections.forEach(function (s) {
            return _this8._coalesceMarkers(s);
          });
          this._replaceSection(section, splitSections);

          return splitSections;
        }
      }

      /**
       * @method _splitCardSection
       * @param {Section} cardSection
       * @param {Position} position to split at
       * @return {Array} pre and post-split sections
       * @private
       */
    }, {
      key: '_splitCardSection',
      value: function _splitCardSection(cardSection, position) {
        var offset = position.offset;

        (0, _mobiledocKitUtilsAssert['default'])('Cards section must be split at offset 0 or 1', offset === 0 || offset === 1);

        var newSection = this.builder.createMarkupSection();
        var nextSection = undefined;
        var surroundingSections = undefined;

        if (offset === 0) {
          nextSection = cardSection;
          surroundingSections = [newSection, cardSection];
        } else {
          nextSection = cardSection.next;
          surroundingSections = [cardSection, newSection];
        }

        var collection = this.editor.post.sections;
        this.insertSectionBefore(collection, newSection, nextSection);

        return surroundingSections;
      }

      /**
       * @method replaceSection
       * @param {Section} section
       * @param {Section} newSection
       * @return null
       * @public
       */
    }, {
      key: 'replaceSection',
      value: function replaceSection(section, newSection) {
        if (!section) {
          // The section may be undefined if the user used the embed intent
          // ("+" icon) to insert a new "ul" section in a blank post
          this.insertSectionBefore(this.editor.post.sections, newSection, null);
        } else {
          this._replaceSection(section, [newSection]);
        }
      }
    }, {
      key: 'moveSectionBefore',
      value: function moveSectionBefore(collection, renderedSection, beforeSection) {
        var newSection = renderedSection.clone();
        this.removeSection(renderedSection);
        this.insertSectionBefore(collection, newSection, beforeSection);
        return newSection;
      }

      /**
       * @method moveSectionUp
       * @param {Section} section A section that is already in DOM
       * @public
       */
    }, {
      key: 'moveSectionUp',
      value: function moveSectionUp(renderedSection) {
        var isFirst = !renderedSection.prev;
        if (isFirst) {
          return renderedSection;
        }

        var collection = renderedSection.parent.sections;
        var beforeSection = renderedSection.prev;
        return this.moveSectionBefore(collection, renderedSection, beforeSection);
      }

      /**
       * @method moveSectionDown
       * @param {Section} section A section that is already in DOM
       * @public
       */
    }, {
      key: 'moveSectionDown',
      value: function moveSectionDown(renderedSection) {
        var isLast = !renderedSection.next;
        if (isLast) {
          return renderedSection;
        }

        var beforeSection = renderedSection.next.next;
        var collection = renderedSection.parent.sections;
        return this.moveSectionBefore(collection, renderedSection, beforeSection);
      }
    }, {
      key: 'insertMarkers',
      value: function insertMarkers(position, markers) {
        var _this9 = this;

        var section = position.section;
        var offset = position.offset;

        (0, _mobiledocKitUtilsAssert['default'])('Cannot insert markers at non-markerable position', section.isMarkerable);

        var edit = section.splitMarkerAtOffset(offset);
        edit.removed.forEach(function (marker) {
          return _this9._scheduleForRemoval(marker);
        });

        var prevMarker = section.markerBeforeOffset(offset);
        markers.forEach(function (marker) {
          section.markers.insertAfter(marker, prevMarker);
          offset += marker.length;
          prevMarker = marker;
        });

        this._coalesceMarkers(section);
        this._markDirty(section);

        var nextPosition = new _mobiledocKitUtilsCursorPosition['default'](position.section, offset);
        this.setRange(new _mobiledocKitUtilsCursorRange['default'](nextPosition));
        return nextPosition;
      }
    }, {
      key: 'insertText',
      value: function insertText(position, text) {
        var section = position.section;

        if (!section.isMarkerable) {
          return;
        }

        var markups = position.marker && position.marker.markups;
        markups = markups || [];
        var marker = this.builder.createMarker(text, markups.slice());
        return this.insertMarkers(position, [marker]);
      }
    }, {
      key: '_replaceSection',
      value: function _replaceSection(section, newSections) {
        var _this10 = this;

        var nextSection = section.next;
        var collection = section.parent.sections;

        var nextNewSection = newSections[0];
        if (nextNewSection.isMarkupSection && section.isListItem) {
          // put the new section after the ListSection (section.parent)
          // instead of after the ListItem
          collection = section.parent.parent.sections;
          nextSection = section.parent.next;
        }

        newSections.forEach(function (s) {
          return _this10.insertSectionBefore(collection, s, nextSection);
        });
        this.removeSection(section);
      }

      /**
       * Given a markerRange (for example `editor.range`) mark all markers
       * inside it as a given markup. The markup must be provided as a post
       * abstract node.
       *
       * Usage:
       *
       *     let range = editor.range;
       *     let strongMarkup = editor.builder.createMarkup('strong');
       *     editor.run((postEditor) => {
       *       postEditor.addMarkupToRange(range, strongMarkup);
       *     });
       *     // Will result some markers possibly being split, and the markup
       *     // being applied to all markers between the split.
       *
       * The return value will be all markers between the split, the same return
       * value as `splitMarkers`.
       *
       * @method addMarkupToRange
       * @param {Range} range
       * @param {Markup} markup A markup post abstract node
       * @public
       */
    }, {
      key: 'addMarkupToRange',
      value: function addMarkupToRange(range, markup) {
        var _this11 = this;

        if (range.isCollapsed) {
          return;
        }
        this.splitMarkers(range).forEach(function (marker) {
          marker.addMarkup(markup);
          _this11._markDirty(marker);
        });
      }

      /**
       * Given a markerRange (for example `editor.range`) remove the given
       * markup from all contained markers.
       *
       * Usage:
       *
       *     let { range } = editor;
       *     let markup = markerRange.headMarker.markups[0];
       *     editor.run(postEditor => {
       *       postEditor.removeMarkupFromRange(range, markup);
       *     });
       *     // Will result in some markers possibly being split, and the markup
       *     // being removed from all markers between the split.
       *
       * @method removeMarkupFromRange
       * @param {Range} range Object with offsets
       * @param {Markup|Function} markupOrCallback A markup post abstract node or
       * a function that returns true when passed a markup that should be removed
       * @private
       */
    }, {
      key: 'removeMarkupFromRange',
      value: function removeMarkupFromRange(range, markupOrMarkupCallback) {
        var _this12 = this;

        if (range.isCollapsed) {
          return;
        }
        this.splitMarkers(range).forEach(function (marker) {
          marker.removeMarkup(markupOrMarkupCallback);
          _this12._markDirty(marker);
        });
      }

      /**
       * Toggle the given markup on the current selection. If anything in the current
       * selection has the markup, the markup will be removed from it. If nothing in the selection
       * has the markup, the markup will be added to everything in the selection.
       *
       * Usage:
       *
       * // Remove any 'strong' markup if it exists in the selection, otherwise
       * // make it all 'strong'
       * editor.run(postEditor => postEditor.toggleMarkup('strong'));
       *
       * // add/remove a link to 'bustle.com' to the selection
       * editor.run(postEditor => {
       *   const linkMarkup = postEditor.builder.createMarkup('a', {href: 'http://bustle.com'});
       *   postEditor.toggleMarkup(linkMarkup);
       * });
       *
       * @method toggleMarkup
       * @param {Markup|String} markupOrString Either a markup object created using
       * the builder (useful when adding a markup with attributes, like an 'a' markup),
       * or, if a string, the tag name of the markup (e.g. 'strong', 'em') to toggle.
       * @param {Range} range in which to toggle, defaults to current editor range
       * @public
       */
    }, {
      key: 'toggleMarkup',
      value: function toggleMarkup(markupOrMarkupString) {
        var range = arguments.length <= 1 || arguments[1] === undefined ? this.editor.range : arguments[1];

        var markup = typeof markupOrMarkupString === 'string' ? this.builder.createMarkup(markupOrMarkupString) : markupOrMarkupString;

        var hasMarkup = this.editor.detectMarkupInRange(range, markup.tagName);
        // FIXME: This implies only a single markup in a range. This may not be
        // true for links (which are not the same object instance like multiple
        // strong tags would be).
        if (hasMarkup) {
          this.removeMarkupFromRange(range, hasMarkup);
        } else {
          this.addMarkupToRange(range, markup);
        }

        this.setRange(range);
      }

      /**
       * @method toggleSection
       *
       * Toggles the active section or sections.
       * If every section has the tag name, they will all be reset to default sections.
       * Otherwise, every section will be changed to the requested type
       *
       * @param {String} sectionTagName A valid markup section or list section tag name (e.g. 'blockquote', 'h2', 'ul')
       * @param {Range} range The range over which to toggle. Defaults to the current editor's offsets
       * a list section
       * @public
       */
    }, {
      key: 'toggleSection',
      value: function toggleSection(sectionTagName) {
        var _this13 = this;

        var range = arguments.length <= 1 || arguments[1] === undefined ? this.editor.range : arguments[1];

        sectionTagName = (0, _mobiledocKitUtilsDomUtils.normalizeTagName)(sectionTagName);
        var post = this.editor.post;

        var nextRange = range;

        var everySectionHasTagName = true;
        post.walkMarkerableSections(range, function (section) {
          if (!_this13._isSameSectionType(section, sectionTagName)) {
            everySectionHasTagName = false;
          }
        });

        var tagName = everySectionHasTagName ? 'p' : sectionTagName;
        var firstChanged = undefined;
        post.walkMarkerableSections(range, function (section) {
          var changedSection = _this13.changeSectionTagName(section, tagName);
          firstChanged = firstChanged || changedSection;
        });

        if (firstChanged) {
          nextRange = new _mobiledocKitUtilsCursorRange['default'](firstChanged.headPosition());
        }
        this.setRange(nextRange);
      }
    }, {
      key: '_isSameSectionType',
      value: function _isSameSectionType(section, sectionTagName) {
        return section.isListItem ? section.parent.tagName === sectionTagName : section.tagName === sectionTagName;
      }

      /**
       * @param {Markerable} section
       * @private
       */
    }, {
      key: 'changeSectionTagName',
      value: function changeSectionTagName(section, newTagName) {
        (0, _mobiledocKitUtilsAssert['default'])('Cannot pass non-markerable section to `changeSectionTagName`', section.isMarkerable);

        if (isListSectionTagName(newTagName)) {
          return this._changeSectionToListItem(section, newTagName);
        } else if (section.isListItem) {
          return this._changeSectionFromListItem(section, newTagName);
        } else {
          section.tagName = newTagName;
          this._markDirty(section);
          return section;
        }
      }

      /**
       * Splits the item at the position given.
       * If thse position is at the start or end of the item, the pre- or post-item
       * will contain a single empty ("") marker.
       * @return {Array} the pre-item and post-item on either side of the split
       */
    }, {
      key: '_splitListItem',
      value: function _splitListItem(item, position) {
        var section = position.section;
        var offset = position.offset;

        (0, _mobiledocKitUtilsAssert['default'])('Cannot split list item at position that does not include item', item === section);

        item.splitMarkerAtOffset(offset);
        var prevMarker = item.markerBeforeOffset(offset);
        var preItem = this.builder.createListItem(),
            postItem = this.builder.createListItem();

        var currentItem = preItem;
        item.markers.forEach(function (marker) {
          currentItem.markers.append(marker.clone());
          if (marker === prevMarker) {
            currentItem = postItem;
          }
        });
        this._replaceSection(item, [preItem, postItem]);
        return [preItem, postItem];
      }

      /**
       * Splits the list at the position given.
       * @return {Array} pre-split list and post-split list, either of which could
       * be blank (0-item list) if the position is at the start or end of the list.
       *
       * Note: Contiguous list sections will be joined in the before_complete queue
       * of the postEditor.
       */
    }, {
      key: '_splitListAtPosition',
      value: function _splitListAtPosition(list, position) {
        var _this14 = this;

        (0, _mobiledocKitUtilsAssert['default'])('Cannot split list at position not in list', position.section.parent === list);

        var positionIsMiddle = !position.isHead() && !position.isTail();
        if (positionIsMiddle) {
          var item = position.section;

          var _splitListItem3 = // jshint ignore:line
          this._splitListItem(item, position);

          var _splitListItem32 = _slicedToArray(_splitListItem3, 2);

          var pre = _splitListItem32[0];
          var post = _splitListItem32[1];

          position = pre.tailPosition();
        }

        var positionIsStart = position.isEqual(list.headPosition()),
            positionIsEnd = position.isEqual(list.tailPosition());

        if (positionIsStart || positionIsEnd) {
          var blank = this.builder.createListSection(list.tagName);
          var reference = position.isEqual(list.headPosition()) ? list : list.next;
          var collection = this.editor.post.sections;
          this.insertSectionBefore(collection, blank, reference);

          var lists = positionIsStart ? [blank, list] : [list, blank];
          return lists;
        } else {
          var _ret2 = (function () {
            var preList = _this14.builder.createListSection(list.tagName),
                postList = _this14.builder.createListSection(list.tagName);
            var preItem = position.section;
            var currentList = preList;
            list.items.forEach(function (item) {
              currentList.items.append(item.clone());
              if (item === preItem) {
                currentList = postList;
              }
            });

            _this14._replaceSection(list, [preList, postList]);
            return {
              v: [preList, postList]
            };
          })();

          if (typeof _ret2 === 'object') return _ret2.v;
        }
      }

      /**
       * @return Array of [prev, mid, next] lists. `prev` and `next` can
       *         be blank, depending on the position of `item`. `mid` will always
       *         be a 1-item list containing `item`. `prev` and `next` will be
       *         removed in the before_complete queue if they are blank
       *         (and still attached).
       * @private
       */
    }, {
      key: '_splitListAtItem',
      value: function _splitListAtItem(list, item) {
        var _this15 = this;

        var next = list;
        var prev = this.builder.createListSection(next.tagName);
        var mid = this.builder.createListSection(next.tagName);

        var addToPrev = true;
        // must turn the LinkedList into an array so that we can remove items
        // as we iterate through it
        var items = next.items.toArray();
        items.forEach(function (i) {
          var listToAppend = undefined;
          if (i === item) {
            addToPrev = false;
            listToAppend = mid;
          } else if (addToPrev) {
            listToAppend = prev;
          } else {
            return; // break after iterating prev and mid parts of the list
          }
          listToAppend.join(i);
          _this15.removeSection(i);
        });
        var found = !addToPrev;
        (0, _mobiledocKitUtilsAssert['default'])('Cannot split list at item that is not present in the list', found);

        var collection = this.editor.post.sections;
        this.insertSectionBefore(collection, mid, next);
        this.insertSectionBefore(collection, prev, mid);

        // Remove possibly blank prev/next lists
        this.addCallback(CALLBACK_QUEUES.BEFORE_COMPLETE, function () {
          [prev, next].forEach(function (_list) {
            var isAttached = !!_list.parent;
            if (_list.isBlank && isAttached) {
              _this15.removeSection(_list);
            }
          });
        });

        return [prev, mid, next];
      }
    }, {
      key: '_changeSectionFromListItem',
      value: function _changeSectionFromListItem(section, newTagName) {
        (0, _mobiledocKitUtilsAssert['default'])('Must pass list item to `_changeSectionFromListItem`', section.isListItem);

        var listSection = section.parent;
        var markupSection = this.builder.createMarkupSection(newTagName);
        markupSection.join(section);

        var _splitListAtItem2 = this._splitListAtItem(listSection, section);

        var _splitListAtItem22 = _slicedToArray(_splitListAtItem2, 3);

        var prev = _splitListAtItem22[0];
        var mid = _splitListAtItem22[1];
        var next = _splitListAtItem22[2];
        // jshint ignore:line
        this.replaceSection(mid, markupSection);
        return markupSection;
      }
    }, {
      key: '_changeSectionToListItem',
      value: function _changeSectionToListItem(section, newTagName) {
        var isAlreadyCorrectListItem = section.isListItem && section.parent.tagName === newTagName;

        if (isAlreadyCorrectListItem) {
          return section;
        }

        var listSection = this.builder.createListSection(newTagName);
        listSection.join(section);

        var sectionToReplace = undefined;
        if (section.isListItem) {
          var _splitListAtItem3 = this._splitListAtItem(section.parent, section);

          var _splitListAtItem32 = _slicedToArray(_splitListAtItem3, 3);

          var prev = _splitListAtItem32[0];
          var mid = _splitListAtItem32[1];
          var next = _splitListAtItem32[2];
          // jshint ignore:line
          sectionToReplace = mid;
        } else {
          sectionToReplace = section;
        }
        this.replaceSection(sectionToReplace, listSection);
        return listSection;
      }

      /**
       * Insert a given section before another one, updating the post abstract
       * and the rendered UI.
       *
       * Usage:
       *
       *     let markerRange = editor.range;
       *     let sectionWithCursor = markerRange.headMarker.section;
       *     let section = editor.builder.createCardSection('my-image');
       *     let collection = sectionWithCursor.parent.sections;
       *     editor.run((postEditor) => {
       *       postEditor.insertSectionBefore(collection, section, sectionWithCursor);
       *     });
       *
       * @method insertSectionBefore
       * @param {LinkedList} collection The list of sections to insert into
       * @param {Object} section The new section
       * @param {Object} beforeSection Optional The section "before" is relative to,
       * if falsy the new section will be appended to the collection
       * @public
       */
    }, {
      key: 'insertSectionBefore',
      value: function insertSectionBefore(collection, section, beforeSection) {
        collection.insertBefore(section, beforeSection);
        this._markDirty(section.parent);
      }

      /**
       * Insert the given section after the current active section, or, if no
       * section is active, at the end of the document.
       * @method insertSection
       * @param {Section} section
       * @public
       */
    }, {
      key: 'insertSection',
      value: function insertSection(section) {
        var activeSection = this.editor.activeSection;
        var nextSection = activeSection && activeSection.next;

        var collection = this.editor.post.sections;
        this.insertSectionBefore(collection, section, nextSection);
      }

      /**
       * Insert the given section at the end of the document.
       * @method insertSectionAtEnd
       * @param {Section} section
       * @public
       */
    }, {
      key: 'insertSectionAtEnd',
      value: function insertSectionAtEnd(section) {
        this.insertSectionBefore(this.editor.post.sections, section, null);
      }

      /**
       * @method insertPost
       * @param {Position} position
       * @param {Post} post
       * @private
       */
    }, {
      key: 'insertPost',
      value: function insertPost(position, newPost) {
        var post = this.editor.post;
        var inserter = new _mobiledocKitEditorPostPostInserter['default'](this, post);
        var nextPosition = inserter.insert(position, newPost);
        return nextPosition;
      }

      /**
       * Remove a given section from the post abstract and the rendered UI.
       *
       * Usage:
       *
       *     let { range } = editor;
       *     let sectionWithCursor = range.head.section;
       *     editor.run((postEditor) => {
       *       postEditor.removeSection(sectionWithCursor);
       *     });
       *
       * @method removeSection
       * @param {Object} section The section to remove
       * @public
       */
    }, {
      key: 'removeSection',
      value: function removeSection(section) {
        var parent = section.parent;
        this._scheduleForRemoval(section);
        parent.sections.remove(section);

        if (parent.isListSection) {
          this._scheduleListRemovalIfEmpty(parent);
        }
      }
    }, {
      key: 'removeAllSections',
      value: function removeAllSections() {
        var _this16 = this;

        this.editor.post.sections.toArray().forEach(function (section) {
          _this16.removeSection(section);
        });
      }
    }, {
      key: 'migrateSectionsFromPost',
      value: function migrateSectionsFromPost(post) {
        var _this17 = this;

        post.sections.toArray().forEach(function (section) {
          post.sections.remove(section);
          _this17.insertSectionBefore(_this17.editor.post.sections, section, null);
        });
      }
    }, {
      key: '_scheduleListRemovalIfEmpty',
      value: function _scheduleListRemovalIfEmpty(listSection) {
        var _this18 = this;

        this.addCallback(CALLBACK_QUEUES.BEFORE_COMPLETE, function () {
          // if the list is attached and blank after we do other rendering stuff,
          // remove it
          var isAttached = !!listSection.parent;
          if (isAttached && listSection.isBlank) {
            _this18.removeSection(listSection);
          }
        });
      }

      /**
       * A method for adding work the deferred queue
       *
       * @method schedule
       * @param {Function} callback to run during completion
       * @public
       */
    }, {
      key: 'schedule',
      value: function schedule(callback) {
        (0, _mobiledocKitUtilsAssert['default'])('Work can only be scheduled before a post edit has completed', !this._didComplete);
        this.addCallback(CALLBACK_QUEUES.COMPLETE, callback);
      }

      /**
       * Add a rerender job to the queue
       *
       * @method scheduleRerender
       * @public
       */
    }, {
      key: 'scheduleRerender',
      value: function scheduleRerender() {
        var _this19 = this;

        if (this._didScheduleRerender) {
          return;
        }

        this.schedule(function () {
          return _this19.editor.rerender();
        });
        this._didScheduleRerender = true;
      }

      /**
       * Add a didUpdate job to the queue
       *
       * @method scheduleDidUpdate
       * @public
       */
    }, {
      key: 'scheduleDidUpdate',
      value: function scheduleDidUpdate() {
        var _this20 = this;

        if (this._didScheduleUpdate) {
          return;
        }

        this.schedule(function () {
          return _this20.editor.didUpdate();
        });
        this._didScheduleUpdate = true;
      }
    }, {
      key: 'scheduleAfterRender',
      value: function scheduleAfterRender(callback) {
        this.addCallback(CALLBACK_QUEUES.AFTER_COMPLETE, callback);
      }

      /**
       * Flush any work on the queue. `editor.run` already does this. Calling this
       * method directly should not be needed outside `editor.run`.
       *
       * @method complete
       * @private
       */
    }, {
      key: 'complete',
      value: function complete() {
        (0, _mobiledocKitUtilsAssert['default'])('Post editing can only be completed once', !this._didComplete);

        this.runCallbacks(CALLBACK_QUEUES.BEFORE_COMPLETE);
        this._didComplete = true;
        this.runCallbacks(CALLBACK_QUEUES.COMPLETE);
        this.runCallbacks(CALLBACK_QUEUES.AFTER_COMPLETE);

        // "clean" the editor's range so that subsequent reads of it
        // will read the dom
        this.editor.range = null;
      }
    }, {
      key: 'undoLastChange',
      value: function undoLastChange() {
        this.editor._editHistory.stepBackward(this);
      }
    }, {
      key: 'redoLastChange',
      value: function redoLastChange() {
        this.editor._editHistory.stepForward(this);
      }
    }, {
      key: 'cancelSnapshot',
      value: function cancelSnapshot() {
        this._shouldCancelSnapshot = true;
      }
    }]);

    return PostEditor;
  })();

  (0, _mobiledocKitUtilsMixin['default'])(PostEditor, _mobiledocKitUtilsLifecycleCallbacks['default']);

  exports['default'] = PostEditor;
});
define('mobiledoc-kit/editor/text-expansions', ['exports', 'mobiledoc-kit/utils/keycodes', 'mobiledoc-kit/utils/key', 'mobiledoc-kit/utils/array-utils', 'mobiledoc-kit/utils/cursor/range'], function (exports, _mobiledocKitUtilsKeycodes, _mobiledocKitUtilsKey, _mobiledocKitUtilsArrayUtils, _mobiledocKitUtilsCursorRange) {
  'use strict';

  exports.validateExpansion = validateExpansion;
  exports.findExpansion = findExpansion;
  var SPACE = _mobiledocKitUtilsKeycodes['default'].SPACE;

  function replaceWithListSection(editor, listTagName) {
    var section = editor.cursor.offsets.head.section;

    editor.run(function (postEditor) {
      var builder = postEditor.builder;

      var listItem = builder.createListItem();
      var listSection = builder.createListSection(listTagName, [listItem]);

      postEditor.replaceSection(section, listSection);
      postEditor.setRange(new _mobiledocKitUtilsCursorRange['default'](listSection.tailPosition()));
    });
  }

  function replaceWithHeaderSection(editor, headingTagName) {
    var section = editor.cursor.offsets.head.section;

    editor.run(function (postEditor) {
      var builder = postEditor.builder;

      var newSection = builder.createMarkupSection(headingTagName);

      postEditor.replaceSection(section, newSection);
      postEditor.setRange(new _mobiledocKitUtilsCursorRange['default'](newSection.tailPosition()));
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
    var key = _mobiledocKitUtilsKey['default'].fromEvent(keyEvent);
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

    return (0, _mobiledocKitUtilsArrayUtils.detect)(expansions, function (_ref) {
      var trigger = _ref.trigger;
      var text = _ref.text;

      return key.keyCode === trigger && _text === text;
    });
  }
});
define('mobiledoc-kit', ['exports', 'mobiledoc-kit/editor/editor', 'mobiledoc-kit/cards/image', 'mobiledoc-kit/utils/cursor/range', 'mobiledoc-kit/utils/mobiledoc-error', 'mobiledoc-kit/version'], function (exports, _mobiledocKitEditorEditor, _mobiledocKitCardsImage, _mobiledocKitUtilsCursorRange, _mobiledocKitUtilsMobiledocError, _mobiledocKitVersion) {
  'use strict';

  exports.registerGlobal = registerGlobal;

  var Mobiledoc = {
    Editor: _mobiledocKitEditorEditor['default'],
    ImageCard: _mobiledocKitCardsImage['default'],
    Range: _mobiledocKitUtilsCursorRange['default'],
    Error: _mobiledocKitUtilsMobiledocError['default'],
    VERSION: _mobiledocKitVersion['default']
  };

  function registerGlobal(global) {
    global.Mobiledoc = Mobiledoc;
  }

  exports.Editor = _mobiledocKitEditorEditor['default'];
  exports['default'] = Mobiledoc;
});
define('mobiledoc-kit/models/_markerable', ['exports', 'mobiledoc-kit/utils/array-utils', 'mobiledoc-kit/utils/set', 'mobiledoc-kit/utils/linked-list', 'mobiledoc-kit/models/_section', 'mobiledoc-kit/utils/assert'], function (exports, _mobiledocKitUtilsArrayUtils, _mobiledocKitUtilsSet, _mobiledocKitUtilsLinkedList, _mobiledocKitModels_section, _mobiledocKitUtilsAssert) {
  'use strict';

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  var _get = function get(_x5, _x6, _x7) { var _again = true; _function: while (_again) { var object = _x5, property = _x6, receiver = _x7; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x5 = parent; _x6 = property; _x7 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

  function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

  function _toArray(arr) { return Array.isArray(arr) ? arr : Array.from(arr); }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

  var Markerable = (function (_Section) {
    _inherits(Markerable, _Section);

    function Markerable(type, tagName) {
      var _this = this;

      var markers = arguments.length <= 2 || arguments[2] === undefined ? [] : arguments[2];

      _classCallCheck(this, Markerable);

      _get(Object.getPrototypeOf(Markerable.prototype), 'constructor', this).call(this, type);
      this.isMarkerable = true;
      this.tagName = tagName;
      this.markers = new _mobiledocKitUtilsLinkedList['default']({
        adoptItem: function adoptItem(m) {
          (0, _mobiledocKitUtilsAssert['default'])('Can only insert markers and atoms into markerable (was: ' + m.type + ')', m.isMarker || m.isAtom);
          m.section = m.parent = _this;
        },
        freeItem: function freeItem(m) {
          return m.section = m.parent = null;
        }
      });

      markers.forEach(function (m) {
        return _this.markers.append(m);
      });
    }

    _createClass(Markerable, [{
      key: 'canJoin',
      value: function canJoin(other) {
        return other.isMarkerable && other.type === this.type && other.tagName === this.tagName;
      }
    }, {
      key: 'clone',
      value: function clone() {
        var newMarkers = this.markers.map(function (m) {
          return m.clone();
        });
        return this.builder.createMarkerableSection(this.type, this.tagName, newMarkers);
      }
    }, {
      key: 'offsetOfMarker',

      /**
       * @param {Marker}
       * @param {Number} markerOffset The offset relative to the start of the marker
       *
       * @return {Number} The offset relative to the start of this section
       */
      value: function offsetOfMarker(marker) {
        var markerOffset = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

        (0, _mobiledocKitUtilsAssert['default'])('Cannot get offsetOfMarker for marker that is not child of this', marker.section === this);

        // FIXME it is possible, when we get a cursor position before having finished reparsing,
        // for markerOffset to be > marker.length. We shouldn't rely on this functionality.

        var offset = 0;
        var currentMarker = this.markers.head;
        while (currentMarker && currentMarker !== marker.next) {
          var _length = currentMarker === marker ? markerOffset : currentMarker.length;
          offset += _length;
          currentMarker = currentMarker.next;
        }

        return offset;
      }

      /**
       * Splits the marker at the offset, filters empty markers from the result,
       * and replaces this marker with the new non-empty ones
       * @param {Marker} marker the marker to split
       * @return {Array} the new markers that replaced `marker`
       */
    }, {
      key: 'splitMarker',
      value: function splitMarker(marker, offset) {
        var endOffset = arguments.length <= 2 || arguments[2] === undefined ? marker.length : arguments[2];
        return (function () {
          var newMarkers = (0, _mobiledocKitUtilsArrayUtils.filter)(marker.split(offset, endOffset), function (m) {
            return !m.isBlank;
          });
          this.markers.splice(marker, 1, newMarkers);
          return newMarkers;
        }).apply(this, arguments);
      }

      // puts clones of this.markers into beforeSection and afterSection,
      // all markers before the marker/offset split go in beforeSection, and all
      // after the marker/offset split go in afterSection
      // @return {Array} [beforeSection, afterSection], two new sections
    }, {
      key: '_redistributeMarkers',
      value: function _redistributeMarkers(beforeSection, afterSection, marker) {
        var offset = arguments.length <= 3 || arguments[3] === undefined ? 0 : arguments[3];

        var currentSection = beforeSection;
        (0, _mobiledocKitUtilsArrayUtils.forEach)(this.markers, function (m) {
          if (m === marker) {
            var _marker$split = marker.split(offset);

            var _marker$split2 = _toArray(_marker$split);

            var beforeMarker = _marker$split2[0];

            var afterMarkers = _marker$split2.slice(1);

            beforeSection.markers.append(beforeMarker);
            (0, _mobiledocKitUtilsArrayUtils.forEach)(afterMarkers, function (_m) {
              return afterSection.markers.append(_m);
            });
            currentSection = afterSection;
          } else {
            currentSection.markers.append(m.clone());
          }
        });

        return [beforeSection, afterSection];
      }
    }, {
      key: 'splitAtMarker',
      value: function splitAtMarker() /*marker, offset=0*/{
        (0, _mobiledocKitUtilsAssert['default'])('splitAtMarker must be implemented by sub-class', false);
      }

      /**
       * Split this section's marker (if any) at the given offset, so that
       * there is now a marker boundary at that offset (useful for later applying
       * a markup to a range)
       * @param {Number} sectionOffset The offset relative to start of this section
       * @return {EditObject} An edit object with 'removed' and 'added' keys with arrays of Markers. The added markers may be blank.
       * After calling `splitMarkerAtOffset(offset)`, there will always be a valid
       * result returned from `markerBeforeOffset(offset)`.
       */
    }, {
      key: 'splitMarkerAtOffset',
      value: function splitMarkerAtOffset(sectionOffset) {
        (0, _mobiledocKitUtilsAssert['default'])('Cannot splitMarkerAtOffset when offset is > length', sectionOffset <= this.length);
        var markerOffset = undefined;
        var len = 0;
        var currentMarker = this.markers.head;
        var edit = { added: [], removed: [] };

        if (!currentMarker) {
          var blankMarker = this.builder.createMarker();
          this.markers.prepend(blankMarker);
          edit.added.push(blankMarker);
        } else {
          while (currentMarker) {
            len += currentMarker.length;
            if (len === sectionOffset) {
              // nothing to do, there is a gap at the requested offset
              break;
            } else if (len > sectionOffset) {
              var _edit$added;

              markerOffset = currentMarker.length - (len - sectionOffset);
              var newMarkers = currentMarker.splitAtOffset(markerOffset);
              (_edit$added = edit.added).push.apply(_edit$added, _toConsumableArray(newMarkers));
              edit.removed.push(currentMarker);
              this.markers.splice(currentMarker, 1, newMarkers);
              break;
            } else {
              currentMarker = currentMarker.next;
            }
          }
        }

        return edit;
      }
    }, {
      key: 'splitAtPosition',
      value: function splitAtPosition(position) {
        var marker = position.marker;
        var offsetInMarker = position.offsetInMarker;

        return this.splitAtMarker(marker, offsetInMarker);
      }

      // returns the marker just before this offset.
      // It is an error to call this method with an offset that is in the middle
      // of a marker.
    }, {
      key: 'markerBeforeOffset',
      value: function markerBeforeOffset(sectionOffset) {
        var len = 0;
        var currentMarker = this.markers.head;

        while (currentMarker) {
          len += currentMarker.length;
          if (len === sectionOffset) {
            return currentMarker;
          } else {
            (0, _mobiledocKitUtilsAssert['default'])('markerBeforeOffset called with sectionOffset not between markers', len < sectionOffset);
            currentMarker = currentMarker.next;
          }
        }
      }
    }, {
      key: 'markerPositionAtOffset',
      value: function markerPositionAtOffset(offset) {
        var currentOffset = 0;
        var currentMarker = undefined;
        var remaining = offset;
        this.markers.detect(function (marker) {
          currentOffset = Math.min(remaining, marker.length);
          remaining -= currentOffset;
          if (remaining === 0) {
            currentMarker = marker;
            return true; // break out of detect
          }
        });

        return { marker: currentMarker, offset: currentOffset };
      }
    }, {
      key: 'textUntil',
      value: function textUntil(offset) {
        return this.text.slice(0, offset);
      }
    }, {
      key: 'markersFor',

      /**
       * @return {Array} New markers that match the boundaries of the
       * range. Does not change the existing markers in this section.
       */
      value: function markersFor(headOffset, tailOffset) {
        var range = { head: { section: this, offset: headOffset },
          tail: { section: this, offset: tailOffset } };

        var markers = [];
        this._markersInRange(range, function (marker, _ref) {
          var markerHead = _ref.markerHead;
          var markerTail = _ref.markerTail;
          var isContained = _ref.isContained;

          var cloned = marker.clone();
          if (!isContained) {
            // cannot do marker.value.slice if the marker is an atom -- this breaks the atom's "atomic" value
            // If a marker is an atom `isContained` should always be true so
            // we shouldn't hit this code path. FIXME add tests
            cloned.value = marker.value.slice(markerHead, markerTail);
          }
          markers.push(cloned);
        });
        return markers;
      }
    }, {
      key: 'markupsInRange',
      value: function markupsInRange(range) {
        var markups = new _mobiledocKitUtilsSet['default']();
        this._markersInRange(range, function (marker) {
          marker.markups.forEach(function (m) {
            return markups.add(m);
          });
        });
        return markups.toArray();
      }

      // calls the callback with (marker, {markerHead, markerTail, isContained})
      // for each marker that is wholly or partially contained in the range.
    }, {
      key: '_markersInRange',
      value: function _markersInRange(range, callback) {
        var head = range.head;
        var tail = range.tail;

        (0, _mobiledocKitUtilsAssert['default'])('Cannot call #_markersInRange if range expands beyond this section', head.section === this && tail.section === this);
        var headOffset = head.offset;var tailOffset = tail.offset;

        var currentHead = 0,
            currentTail = 0,
            currentMarker = this.markers.head;

        while (currentMarker) {
          currentTail += currentMarker.length;

          if (currentTail > headOffset && currentHead < tailOffset) {
            var markerHead = Math.max(headOffset - currentHead, 0);
            var markerTail = currentMarker.length - Math.max(currentTail - tailOffset, 0);
            var isContained = markerHead === 0 && markerTail === currentMarker.length;

            callback(currentMarker, { markerHead: markerHead, markerTail: markerTail, isContained: isContained });
          }

          currentHead += currentMarker.length;
          currentMarker = currentMarker.next;

          if (currentHead > tailOffset) {
            break;
          }
        }
      }

      // mutates this by appending the other section's (cloned) markers to it
    }, {
      key: 'join',
      value: function join(otherSection) {
        var _this2 = this;

        var beforeMarker = this.markers.tail;
        var afterMarker = null;

        otherSection.markers.forEach(function (m) {
          if (!m.isBlank) {
            m = m.clone();
            _this2.markers.append(m);
            if (!afterMarker) {
              afterMarker = m;
            }
          }
        });

        return { beforeMarker: beforeMarker, afterMarker: afterMarker };
      }
    }, {
      key: 'isBlank',
      get: function get() {
        if (!this.markers.length) {
          return true;
        }
        return this.markers.every(function (m) {
          return m.isBlank;
        });
      }
    }, {
      key: 'text',
      get: function get() {
        return (0, _mobiledocKitUtilsArrayUtils.reduce)(this.markers, function (prev, m) {
          return prev + m.value;
        }, '');
      }
    }, {
      key: 'length',
      get: function get() {
        return (0, _mobiledocKitUtilsArrayUtils.reduce)(this.markers, function (prev, m) {
          return prev + m.length;
        }, 0);
      }
    }]);

    return Markerable;
  })(_mobiledocKitModels_section['default']);

  exports['default'] = Markerable;
});
define('mobiledoc-kit/models/_section', ['exports', 'mobiledoc-kit/utils/dom-utils', 'mobiledoc-kit/utils/linked-item', 'mobiledoc-kit/utils/assert', 'mobiledoc-kit/utils/cursor/position'], function (exports, _mobiledocKitUtilsDomUtils, _mobiledocKitUtilsLinkedItem, _mobiledocKitUtilsAssert, _mobiledocKitUtilsCursorPosition) {
  'use strict';

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

  function unimplementedMethod(methodName, me) {
    (0, _mobiledocKitUtilsAssert['default'])('`' + methodName + '()` must be implemented by ' + me.constructor.name, false);
  }

  var Section = (function (_LinkedItem) {
    _inherits(Section, _LinkedItem);

    function Section(type) {
      _classCallCheck(this, Section);

      _get(Object.getPrototypeOf(Section.prototype), 'constructor', this).call(this);
      (0, _mobiledocKitUtilsAssert['default'])('Cannot create section without type', !!type);
      this.type = type;
      this.isSection = true;
      this.isMarkerable = false;
      this.isNested = false;
      this.isSection = true;
      this.isLeafSection = true;
    }

    _createClass(Section, [{
      key: 'isValidTagName',
      value: function isValidTagName() /* normalizedTagName */{
        unimplementedMethod('isValidTagName', this);
      }
    }, {
      key: 'clone',
      value: function clone() {
        unimplementedMethod('clone', this);
      }
    }, {
      key: 'canJoin',
      value: function canJoin() /* otherSection */{
        unimplementedMethod('canJoin', this);
      }
    }, {
      key: 'headPosition',
      value: function headPosition() {
        return new _mobiledocKitUtilsCursorPosition['default'](this, 0);
      }
    }, {
      key: 'tailPosition',
      value: function tailPosition() {
        (0, _mobiledocKitUtilsAssert['default'])('Cannot determine tailPosition without length', this.length !== undefined && this.length !== null);
        return new _mobiledocKitUtilsCursorPosition['default'](this, this.length);
      }
    }, {
      key: 'join',
      value: function join() {
        unimplementedMethod('join', this);
      }

      /**
       * Markerable sections should override this method
       */
    }, {
      key: 'splitMarkerAtOffset',
      value: function splitMarkerAtOffset() {
        var blankEdit = { added: [], removed: [] };
        return blankEdit;
      }
    }, {
      key: 'nextLeafSection',
      value: function nextLeafSection() {
        var next = this.next;
        if (next) {
          if (!!next.items) {
            return next.items.head;
          } else {
            return next;
          }
        } else {
          if (this.isNested) {
            return this.parent.nextLeafSection();
          }
        }
      }
    }, {
      key: 'immediatelyNextMarkerableSection',
      value: function immediatelyNextMarkerableSection() {
        var next = this.nextLeafSection();
        while (next && !next.isMarkerable) {
          next = next.nextLeafSection();
        }
        return next;
      }
    }, {
      key: 'previousLeafSection',
      value: function previousLeafSection() {
        var prev = this.prev;

        if (prev) {
          if (!!prev.items) {
            return prev.items.tail;
          } else {
            return prev;
          }
        } else {
          if (this.isNested) {
            return this.parent.previousLeafSection();
          }
        }
      }
    }, {
      key: 'tagName',
      set: function set(val) {
        var normalizedTagName = (0, _mobiledocKitUtilsDomUtils.normalizeTagName)(val);
        (0, _mobiledocKitUtilsAssert['default'])('Cannot set section tagName to ' + val, this.isValidTagName(normalizedTagName));
        this._tagName = normalizedTagName;
      },
      get: function get() {
        return this._tagName;
      }
    }, {
      key: 'isBlank',
      get: function get() {
        unimplementedMethod('isBlank', this);
      }
    }]);

    return Section;
  })(_mobiledocKitUtilsLinkedItem['default']);

  exports['default'] = Section;
});
define('mobiledoc-kit/models/atom-node', ['exports', 'mobiledoc-kit/utils/assert'], function (exports, _mobiledocKitUtilsAssert) {
  'use strict';

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  var AtomNode = (function () {
    function AtomNode(editor, atom, model, element, atomOptions) {
      _classCallCheck(this, AtomNode);

      this.editor = editor;
      this.atom = atom;
      this.model = model;
      this.atomOptions = atomOptions;
      this.element = element;

      this._teardownCallback = null;
      this._rendered = null;
    }

    _createClass(AtomNode, [{
      key: 'render',
      value: function render() {
        this.teardown();

        var rendered = this.atom.render({
          options: this.atomOptions,
          env: this.env,
          value: this.model.value,
          payload: this.model.payload
        });

        this._validateAndAppendRenderResult(rendered);
      }
    }, {
      key: 'teardown',
      value: function teardown() {
        if (this._teardownCallback) {
          this._teardownCallback();
          this._teardownCallback = null;
        }
        if (this._rendered) {
          this.element.removeChild(this._rendered);
          this._rendered = null;
        }
      }
    }, {
      key: '_validateAndAppendRenderResult',
      value: function _validateAndAppendRenderResult(rendered) {
        if (!rendered) {
          return;
        }

        var name = this.atom.name;

        (0, _mobiledocKitUtilsAssert['default'])('Atom "' + name + '" must return a DOM node (returned value was: "' + rendered + '")', !!rendered.nodeType);
        this.element.appendChild(rendered);
        this._rendered = rendered;
      }
    }, {
      key: 'env',
      get: function get() {
        var _this = this;

        return {
          name: this.atom.name,
          onTeardown: function onTeardown(callback) {
            return _this._teardownCallback = callback;
          }
        };
      }
    }]);

    return AtomNode;
  })();

  exports['default'] = AtomNode;
});
define('mobiledoc-kit/models/atom', ['exports', 'mobiledoc-kit/models/types', 'mobiledoc-kit/utils/mixin', 'mobiledoc-kit/utils/markuperable', 'mobiledoc-kit/utils/linked-item', 'mobiledoc-kit/utils/assert'], function (exports, _mobiledocKitModelsTypes, _mobiledocKitUtilsMixin, _mobiledocKitUtilsMarkuperable, _mobiledocKitUtilsLinkedItem, _mobiledocKitUtilsAssert) {
  'use strict';

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  var _get = function get(_x4, _x5, _x6) { var _again = true; _function: while (_again) { var object = _x4, property = _x5, receiver = _x6; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x4 = parent; _x5 = property; _x6 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

  var ATOM_LENGTH = 1;

  var Atom = (function (_LinkedItem) {
    _inherits(Atom, _LinkedItem);

    function Atom(name, value, payload) {
      var _this = this;

      var markups = arguments.length <= 3 || arguments[3] === undefined ? [] : arguments[3];

      _classCallCheck(this, Atom);

      _get(Object.getPrototypeOf(Atom.prototype), 'constructor', this).call(this);
      this.name = name;
      this.value = value;
      (0, _mobiledocKitUtilsAssert['default'])('Atom must have value', value !== undefined && value !== null);
      this.payload = payload;
      this.type = _mobiledocKitModelsTypes.ATOM_TYPE;
      this.isMarker = false;
      this.isAtom = true;

      this.markups = [];
      markups.forEach(function (m) {
        return _this.addMarkup(m);
      });
    }

    _createClass(Atom, [{
      key: 'clone',
      value: function clone() {
        var clonedMarkups = this.markups.slice();
        return this.builder.createAtom(this.name, this.value, this.payload, clonedMarkups);
      }
    }, {
      key: 'canJoin',
      value: function canJoin() /* other */{
        return false;
      }
    }, {
      key: 'split',
      value: function split() {
        var offset = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];
        var endOffset = arguments.length <= 1 || arguments[1] === undefined ? offset : arguments[1];
        return (function () {
          var markers = [];

          if (endOffset === 0) {
            markers.push(this.builder.createMarker('', this.markups.slice()));
          }

          markers.push(this.clone());

          if (offset === ATOM_LENGTH) {
            markers.push(this.builder.createMarker('', this.markups.slice()));
          }

          return markers;
        }).apply(this, arguments);
      }
    }, {
      key: 'splitAtOffset',
      value: function splitAtOffset(offset) {
        (0, _mobiledocKitUtilsAssert['default'])('Cannot split a marker at an offset > its length', offset <= this.length);

        var builder = this.builder;

        var clone = this.clone();
        var blankMarker = builder.createMarker('');
        var pre = undefined,
            post = undefined;

        if (offset === 0) {
          pre = blankMarker;
          post = clone;
        } else if (offset === ATOM_LENGTH) {
          pre = clone;
          post = blankMarker;
        } else {
          (0, _mobiledocKitUtilsAssert['default'])('Invalid offset given to Atom#splitAtOffset: "' + offset + '"', false);
        }

        this.markups.forEach(function (markup) {
          pre.addMarkup(markup);
          post.addMarkup(markup);
        });
        return [pre, post];
      }
    }, {
      key: 'isBlank',
      get: function get() {
        return false;
      }
    }, {
      key: 'length',
      get: function get() {
        return ATOM_LENGTH;
      }
    }]);

    return Atom;
  })(_mobiledocKitUtilsLinkedItem['default']);

  (0, _mobiledocKitUtilsMixin['default'])(Atom, _mobiledocKitUtilsMarkuperable['default']);

  exports['default'] = Atom;
});
define('mobiledoc-kit/models/card-node', ['exports', 'mobiledoc-kit/utils/assert'], function (exports, _mobiledocKitUtilsAssert) {
  'use strict';

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  var CardNode = (function () {
    function CardNode(editor, card, section, element, options) {
      _classCallCheck(this, CardNode);

      this.editor = editor;
      this.card = card;
      this.section = section;
      this.element = element;
      this.options = options;

      this.mode = null;

      this._teardownCallback = null;
      this._rendered = null;
    }

    _createClass(CardNode, [{
      key: 'render',
      value: function render(mode) {
        if (this.mode === mode) {
          return;
        }

        this.teardown();

        this.mode = mode;

        var method = mode === 'display' ? 'render' : 'edit';

        var rendered = this.card[method]({
          env: this.env,
          options: this.options,
          payload: this.section.payload
        });

        this._validateAndAppendRenderResult(rendered);
      }
    }, {
      key: 'teardown',
      value: function teardown() {
        if (this._teardownCallback) {
          this._teardownCallback();
          this._teardownCallback = null;
        }
        if (this._rendered) {
          this.element.removeChild(this._rendered);
          this._rendered = null;
        }
      }
    }, {
      key: 'display',
      value: function display() {
        this.render('display');
      }
    }, {
      key: 'edit',
      value: function edit() {
        this.render('edit');
      }
    }, {
      key: 'remove',
      value: function remove() {
        var _this = this;

        this.editor.run(function (postEditor) {
          return postEditor.removeSection(_this.section);
        });
      }
    }, {
      key: '_validateAndAppendRenderResult',
      value: function _validateAndAppendRenderResult(rendered) {
        if (!rendered) {
          return;
        }

        var name = this.card.name;

        (0, _mobiledocKitUtilsAssert['default'])('Card "' + name + '" must render dom (render value was: "' + rendered + '")', !!rendered.nodeType);
        this.element.appendChild(rendered);
        this._rendered = rendered;
      }
    }, {
      key: 'env',
      get: function get() {
        var _this2 = this;

        return {
          name: this.card.name,
          isInEditor: true,
          onTeardown: function onTeardown(callback) {
            return _this2._teardownCallback = callback;
          },
          edit: function edit() {
            return _this2.edit();
          },
          save: function save(payload) {
            var transition = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];

            _this2.section.payload = payload;

            _this2.editor.didUpdate();
            if (transition) {
              _this2.display();
            }
          },
          cancel: function cancel() {
            return _this2.display();
          },
          remove: function remove() {
            return _this2.remove();
          },
          postModel: this.section
        };
      }
    }]);

    return CardNode;
  })();

  exports['default'] = CardNode;
});
define('mobiledoc-kit/models/card', ['exports', 'mobiledoc-kit/models/_section', 'mobiledoc-kit/models/types', 'mobiledoc-kit/utils/copy'], function (exports, _mobiledocKitModels_section, _mobiledocKitModelsTypes, _mobiledocKitUtilsCopy) {
  'use strict';

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

  var CARD_MODES = {
    DISPLAY: 'display',
    EDIT: 'edit'
  };

  exports.CARD_MODES = CARD_MODES;
  var CARD_LENGTH = 1;

  var DEFAULT_INITIAL_MODE = CARD_MODES.DISPLAY;

  var Card = (function (_Section) {
    _inherits(Card, _Section);

    function Card(name, payload) {
      _classCallCheck(this, Card);

      _get(Object.getPrototypeOf(Card.prototype), 'constructor', this).call(this, _mobiledocKitModelsTypes.CARD_TYPE);
      this.name = name;
      this.payload = payload;
      this.setInitialMode(DEFAULT_INITIAL_MODE);
      this.isCardSection = true;
    }

    _createClass(Card, [{
      key: 'canJoin',
      value: function canJoin() {
        return false;
      }
    }, {
      key: 'clone',
      value: function clone() {
        var payload = (0, _mobiledocKitUtilsCopy.shallowCopyObject)(this.payload);
        var card = this.builder.createCardSection(this.name, payload);
        // If this card is currently rendered, clone the mode it is
        // currently in as the default mode of the new card.
        var mode = this._initialMode;
        if (this.renderNode && this.renderNode.cardNode) {
          mode = this.renderNode.cardNode.mode;
        }
        card.setInitialMode(mode);
        return card;
      }

      /**
       * set the mode that this will be rendered into initially
       * @private
       */
    }, {
      key: 'setInitialMode',
      value: function setInitialMode(initialMode) {
        // TODO validate initialMode
        this._initialMode = initialMode;
      }
    }, {
      key: 'isBlank',
      get: function get() {
        return false;
      }
    }, {
      key: 'length',
      get: function get() {
        return CARD_LENGTH;
      }
    }]);

    return Card;
  })(_mobiledocKitModels_section['default']);

  exports['default'] = Card;
});
define('mobiledoc-kit/models/image', ['exports', 'mobiledoc-kit/models/types', 'mobiledoc-kit/models/_section'], function (exports, _mobiledocKitModelsTypes, _mobiledocKitModels_section) {
  'use strict';

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

  var Image = (function (_Section) {
    _inherits(Image, _Section);

    function Image() {
      _classCallCheck(this, Image);

      _get(Object.getPrototypeOf(Image.prototype), 'constructor', this).call(this, _mobiledocKitModelsTypes.IMAGE_SECTION_TYPE);
      this.src = null;
    }

    _createClass(Image, [{
      key: 'canJoin',
      value: function canJoin() {
        return false;
      }
    }, {
      key: 'length',
      get: function get() {
        return 1;
      }
    }]);

    return Image;
  })(_mobiledocKitModels_section['default']);

  exports['default'] = Image;
});
define('mobiledoc-kit/models/list-item', ['exports', 'mobiledoc-kit/models/_markerable', 'mobiledoc-kit/models/types', 'mobiledoc-kit/utils/dom-utils', 'mobiledoc-kit/utils/array-utils'], function (exports, _mobiledocKitModels_markerable, _mobiledocKitModelsTypes, _mobiledocKitUtilsDomUtils, _mobiledocKitUtilsArrayUtils) {
  'use strict';

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  var _get = function get(_x3, _x4, _x5) { var _again = true; _function: while (_again) { var object = _x3, property = _x4, receiver = _x5; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x3 = parent; _x4 = property; _x5 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

  var VALID_LIST_ITEM_TAGNAMES = ['li'].map(_mobiledocKitUtilsDomUtils.normalizeTagName);

  exports.VALID_LIST_ITEM_TAGNAMES = VALID_LIST_ITEM_TAGNAMES;

  var ListItem = (function (_Markerable) {
    _inherits(ListItem, _Markerable);

    function ListItem(tagName) {
      var markers = arguments.length <= 1 || arguments[1] === undefined ? [] : arguments[1];

      _classCallCheck(this, ListItem);

      _get(Object.getPrototypeOf(ListItem.prototype), 'constructor', this).call(this, _mobiledocKitModelsTypes.LIST_ITEM_TYPE, tagName, markers);
      this.isListItem = true;
      this.isNested = true;
    }

    _createClass(ListItem, [{
      key: 'isValidTagName',
      value: function isValidTagName(normalizedTagName) {
        return (0, _mobiledocKitUtilsArrayUtils.contains)(VALID_LIST_ITEM_TAGNAMES, normalizedTagName);
      }
    }, {
      key: 'splitAtMarker',
      value: function splitAtMarker(marker) {
        var offset = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

        // FIXME need to check if we are going to split into two list items
        // or a list item and a new markup section:
        var isLastItem = !this.next;
        var createNewSection = !marker && offset === 0 && isLastItem;

        var beforeSection = this.builder.createListItem();
        var afterSection = createNewSection ? this.builder.createMarkupSection() : this.builder.createListItem();

        return this._redistributeMarkers(beforeSection, afterSection, marker, offset);
      }
    }, {
      key: 'clone',
      value: function clone() {
        var item = this.builder.createListItem();
        this.markers.forEach(function (m) {
          return item.markers.append(m.clone());
        });
        return item;
      }
    }, {
      key: 'post',
      get: function get() {
        return this.section.post;
      }
    }]);

    return ListItem;
  })(_mobiledocKitModels_markerable['default']);

  exports['default'] = ListItem;
});
define('mobiledoc-kit/models/list-section', ['exports', 'mobiledoc-kit/utils/linked-list', 'mobiledoc-kit/utils/array-utils', 'mobiledoc-kit/models/types', 'mobiledoc-kit/models/_section', 'mobiledoc-kit/utils/dom-utils', 'mobiledoc-kit/utils/assert'], function (exports, _mobiledocKitUtilsLinkedList, _mobiledocKitUtilsArrayUtils, _mobiledocKitModelsTypes, _mobiledocKitModels_section, _mobiledocKitUtilsDomUtils, _mobiledocKitUtilsAssert) {
  'use strict';

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  var _get = function get(_x3, _x4, _x5) { var _again = true; _function: while (_again) { var object = _x3, property = _x4, receiver = _x5; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x3 = parent; _x4 = property; _x5 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

  var VALID_LIST_SECTION_TAGNAMES = ['ul', 'ol'].map(_mobiledocKitUtilsDomUtils.normalizeTagName);

  exports.VALID_LIST_SECTION_TAGNAMES = VALID_LIST_SECTION_TAGNAMES;
  var DEFAULT_TAG_NAME = VALID_LIST_SECTION_TAGNAMES[0];

  exports.DEFAULT_TAG_NAME = DEFAULT_TAG_NAME;

  var ListSection = (function (_Section) {
    _inherits(ListSection, _Section);

    function ListSection() {
      var _this = this;

      var tagName = arguments.length <= 0 || arguments[0] === undefined ? DEFAULT_TAG_NAME : arguments[0];
      var items = arguments.length <= 1 || arguments[1] === undefined ? [] : arguments[1];

      _classCallCheck(this, ListSection);

      _get(Object.getPrototypeOf(ListSection.prototype), 'constructor', this).call(this, _mobiledocKitModelsTypes.LIST_SECTION_TYPE);
      this.tagName = tagName;
      this.isListSection = true;
      this.isLeafSection = false;

      this.items = new _mobiledocKitUtilsLinkedList['default']({
        adoptItem: function adoptItem(i) {
          (0, _mobiledocKitUtilsAssert['default'])('Cannot insert non-list-item to list (is: ' + i.type + ')', i.isListItem);
          i.section = i.parent = _this;
        },
        freeItem: function freeItem(i) {
          return i.section = i.parent = null;
        }
      });
      this.sections = this.items;

      items.forEach(function (i) {
        return _this.items.append(i);
      });
    }

    _createClass(ListSection, [{
      key: 'canJoin',
      value: function canJoin() {
        return false;
      }
    }, {
      key: 'isValidTagName',
      value: function isValidTagName(normalizedTagName) {
        return (0, _mobiledocKitUtilsArrayUtils.contains)(VALID_LIST_SECTION_TAGNAMES, normalizedTagName);
      }
    }, {
      key: 'headPosition',
      value: function headPosition() {
        return this.items.head.headPosition();
      }
    }, {
      key: 'tailPosition',
      value: function tailPosition() {
        return this.items.tail.tailPosition();
      }
    }, {
      key: 'clone',
      value: function clone() {
        var newSection = this.builder.createListSection(this.tagName);
        (0, _mobiledocKitUtilsArrayUtils.forEach)(this.items, function (i) {
          return newSection.items.append(i.clone());
        });
        return newSection;
      }

      /**
       * Mutates this list
       * @param {ListSection|Markerable}
       * @return null
       */
    }, {
      key: 'join',
      value: function join(other) {
        var _this2 = this;

        if (other.isListSection) {
          other.items.forEach(function (i) {
            return _this2.join(i);
          });
        } else if (other.isMarkerable) {
          var item = this.builder.createListItem();
          item.join(other);
          this.items.append(item);
        }
      }
    }, {
      key: 'isBlank',
      get: function get() {
        return this.items.isEmpty;
      }
    }]);

    return ListSection;
  })(_mobiledocKitModels_section['default']);

  exports['default'] = ListSection;
});
define('mobiledoc-kit/models/marker', ['exports', 'mobiledoc-kit/models/types', 'mobiledoc-kit/utils/mixin', 'mobiledoc-kit/utils/markuperable', 'mobiledoc-kit/utils/linked-item', 'mobiledoc-kit/utils/assert', 'mobiledoc-kit/utils/array-utils'], function (exports, _mobiledocKitModelsTypes, _mobiledocKitUtilsMixin, _mobiledocKitUtilsMarkuperable, _mobiledocKitUtilsLinkedItem, _mobiledocKitUtilsAssert, _mobiledocKitUtilsArrayUtils) {
  'use strict';

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  var _get = function get(_x5, _x6, _x7) { var _again = true; _function: while (_again) { var object = _x5, property = _x6, receiver = _x7; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x5 = parent; _x6 = property; _x7 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

  // Unicode uses a pair of "surrogate" characters" (a high- and low-surrogate)
  // to encode characters outside the basic multilingual plane (like emoji and
  // some languages).
  // These values are the unicode code points for the start and end of the
  // high- and low-surrogate characters.
  // See "high surrogate" and "low surrogate" on
  // https://en.wikipedia.org/wiki/Unicode_block
  var HIGH_SURROGATE_RANGE = [0xD800, 0xDBFF];
  exports.HIGH_SURROGATE_RANGE = HIGH_SURROGATE_RANGE;
  var LOW_SURROGATE_RANGE = [0xDC00, 0xDFFF];

  exports.LOW_SURROGATE_RANGE = LOW_SURROGATE_RANGE;
  var Marker = (function (_LinkedItem) {
    _inherits(Marker, _LinkedItem);

    function Marker() {
      var _this = this;

      var value = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];
      var markups = arguments.length <= 1 || arguments[1] === undefined ? [] : arguments[1];

      _classCallCheck(this, Marker);

      _get(Object.getPrototypeOf(Marker.prototype), 'constructor', this).call(this);
      this.value = value;
      (0, _mobiledocKitUtilsAssert['default'])('Marker must have value', value !== undefined && value !== null);
      this.markups = [];
      this.type = _mobiledocKitModelsTypes.MARKER_TYPE;
      this.isMarker = true;
      this.isAtom = false;
      markups.forEach(function (m) {
        return _this.addMarkup(m);
      });
    }

    _createClass(Marker, [{
      key: 'clone',
      value: function clone() {
        var clonedMarkups = this.markups.slice();
        return this.builder.createMarker(this.value, clonedMarkups);
      }
    }, {
      key: 'deleteValueAtOffset',

      // delete the character at this offset,
      // update the value with the new value
      value: function deleteValueAtOffset(offset) {
        (0, _mobiledocKitUtilsAssert['default'])('Cannot delete value at offset outside bounds', offset >= 0 && offset <= this.length);

        var width = 1;
        var code = this.value.charCodeAt(offset);
        if (code >= HIGH_SURROGATE_RANGE[0] && code <= HIGH_SURROGATE_RANGE[1]) {
          width = 2;
        } else if (code >= LOW_SURROGATE_RANGE[0] && code <= LOW_SURROGATE_RANGE[1]) {
          width = 2;
          offset = offset - 1;
        }

        var left = this.value.slice(0, offset);
        var right = this.value.slice(offset + width);

        this.value = left + right;

        return width;
      }
    }, {
      key: 'canJoin',
      value: function canJoin(other) {
        return other && other.isMarker && (0, _mobiledocKitUtilsArrayUtils.isArrayEqual)(this.markups, other.markups);
      }
    }, {
      key: 'split',
      value: function split() {
        var offset = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];
        var endOffset = arguments.length <= 1 || arguments[1] === undefined ? this.length : arguments[1];

        var markers = [this.builder.createMarker(this.value.substring(0, offset)), this.builder.createMarker(this.value.substring(offset, endOffset)), this.builder.createMarker(this.value.substring(endOffset))];

        this.markups.forEach(function (mu) {
          return markers.forEach(function (m) {
            return m.addMarkup(mu);
          });
        });
        return markers;
      }

      /**
       * @return {Array} 2 markers either or both of which could be blank
       */
    }, {
      key: 'splitAtOffset',
      value: function splitAtOffset(offset) {
        (0, _mobiledocKitUtilsAssert['default'])('Cannot split a marker at an offset > its length', offset <= this.length);
        var value = this.value;
        var builder = this.builder;

        var pre = builder.createMarker(value.substring(0, offset));
        var post = builder.createMarker(value.substring(offset));

        this.markups.forEach(function (markup) {
          pre.addMarkup(markup);
          post.addMarkup(markup);
        });

        return [pre, post];
      }
    }, {
      key: 'isEmpty',
      get: function get() {
        return this.isBlank;
      }
    }, {
      key: 'isBlank',
      get: function get() {
        return this.length === 0;
      }
    }, {
      key: 'length',
      get: function get() {
        return this.value.length;
      }
    }]);

    return Marker;
  })(_mobiledocKitUtilsLinkedItem['default']);

  (0, _mobiledocKitUtilsMixin['default'])(Marker, _mobiledocKitUtilsMarkuperable['default']);

  exports['default'] = Marker;
});
define('mobiledoc-kit/models/markup-section', ['exports', 'mobiledoc-kit/models/_markerable', 'mobiledoc-kit/utils/dom-utils', 'mobiledoc-kit/utils/array-utils', 'mobiledoc-kit/models/types'], function (exports, _mobiledocKitModels_markerable, _mobiledocKitUtilsDomUtils, _mobiledocKitUtilsArrayUtils, _mobiledocKitModelsTypes) {
  'use strict';

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  var _get = function get(_x4, _x5, _x6) { var _again = true; _function: while (_again) { var object = _x4, property = _x5, receiver = _x6; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x4 = parent; _x5 = property; _x6 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

  // valid values of `tagName` for a MarkupSection
  var VALID_MARKUP_SECTION_TAGNAMES = ['p', 'h3', 'h2', 'h1', 'blockquote', 'pull-quote'].map(_mobiledocKitUtilsDomUtils.normalizeTagName);

  exports.VALID_MARKUP_SECTION_TAGNAMES = VALID_MARKUP_SECTION_TAGNAMES;
  // valid element names for a MarkupSection. A MarkupSection with a tagName
  // not in this will be rendered as a div with a className matching the
  // tagName
  var MARKUP_SECTION_ELEMENT_NAMES = ['p', 'h3', 'h2', 'h1', 'blockquote'].map(_mobiledocKitUtilsDomUtils.normalizeTagName);
  exports.MARKUP_SECTION_ELEMENT_NAMES = MARKUP_SECTION_ELEMENT_NAMES;
  var DEFAULT_TAG_NAME = VALID_MARKUP_SECTION_TAGNAMES[0];

  exports.DEFAULT_TAG_NAME = DEFAULT_TAG_NAME;
  var MarkupSection = (function (_Markerable) {
    _inherits(MarkupSection, _Markerable);

    function MarkupSection() {
      var tagName = arguments.length <= 0 || arguments[0] === undefined ? DEFAULT_TAG_NAME : arguments[0];
      var markers = arguments.length <= 1 || arguments[1] === undefined ? [] : arguments[1];

      _classCallCheck(this, MarkupSection);

      _get(Object.getPrototypeOf(MarkupSection.prototype), 'constructor', this).call(this, _mobiledocKitModelsTypes.MARKUP_SECTION_TYPE, tagName, markers);
      this.isMarkupSection = true;
    }

    _createClass(MarkupSection, [{
      key: 'isValidTagName',
      value: function isValidTagName(normalizedTagName) {
        return (0, _mobiledocKitUtilsArrayUtils.contains)(VALID_MARKUP_SECTION_TAGNAMES, normalizedTagName);
      }
    }, {
      key: 'splitAtMarker',
      value: function splitAtMarker(marker) {
        var offset = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];
        var beforeSection = this.builder.createMarkupSection(this.tagName, []);
        var afterSection = this.builder.createMarkupSection();

        return this._redistributeMarkers(beforeSection, afterSection, marker, offset);
      }
    }]);

    return MarkupSection;
  })(_mobiledocKitModels_markerable['default']);

  exports['default'] = MarkupSection;
});
define('mobiledoc-kit/models/markup', ['exports', 'mobiledoc-kit/utils/dom-utils', 'mobiledoc-kit/utils/array-utils', 'mobiledoc-kit/models/types', 'mobiledoc-kit/utils/assert'], function (exports, _mobiledocKitUtilsDomUtils, _mobiledocKitUtilsArrayUtils, _mobiledocKitModelsTypes, _mobiledocKitUtilsAssert) {
  'use strict';

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  var VALID_MARKUP_TAGNAMES = ['b', 'i', 'strong', 'em', 'a', 'u', 'sub', // subscript
  'sup', // superscript
  's' // strikethrough
  ].map(_mobiledocKitUtilsDomUtils.normalizeTagName);

  exports.VALID_MARKUP_TAGNAMES = VALID_MARKUP_TAGNAMES;
  var VALID_ATTRIBUTES = ['href', 'ref'];

  exports.VALID_ATTRIBUTES = VALID_ATTRIBUTES;

  var Markup = (function () {
    /*
     * @param {Object} attributes key-values
     */

    function Markup(tagName) {
      var attributes = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      _classCallCheck(this, Markup);

      this.tagName = (0, _mobiledocKitUtilsDomUtils.normalizeTagName)(tagName);

      (0, _mobiledocKitUtilsAssert['default'])('Must use attributes object param (not array) for Markup', !Array.isArray(attributes));

      this.attributes = (0, _mobiledocKitUtilsArrayUtils.filterObject)(attributes, VALID_ATTRIBUTES);
      this.type = _mobiledocKitModelsTypes.MARKUP_TYPE;

      (0, _mobiledocKitUtilsAssert['default'])('Cannot create markup of tagName ' + tagName, VALID_MARKUP_TAGNAMES.indexOf(this.tagName) !== -1);
    }

    _createClass(Markup, [{
      key: 'hasTag',
      value: function hasTag(tagName) {
        return this.tagName === (0, _mobiledocKitUtilsDomUtils.normalizeTagName)(tagName);
      }
    }, {
      key: 'getAttribute',
      value: function getAttribute(name) {
        return this.attributes[name];
      }
    }], [{
      key: 'isValidElement',
      value: function isValidElement(element) {
        var tagName = (0, _mobiledocKitUtilsDomUtils.normalizeTagName)(element.tagName);
        return VALID_MARKUP_TAGNAMES.indexOf(tagName) !== -1;
      }
    }]);

    return Markup;
  })();

  exports['default'] = Markup;
});
define('mobiledoc-kit/models/post-node-builder', ['exports', 'mobiledoc-kit/models/atom', 'mobiledoc-kit/models/post', 'mobiledoc-kit/models/markup-section', 'mobiledoc-kit/models/list-section', 'mobiledoc-kit/models/list-item', 'mobiledoc-kit/models/image', 'mobiledoc-kit/models/marker', 'mobiledoc-kit/models/markup', 'mobiledoc-kit/models/card', 'mobiledoc-kit/utils/dom-utils', 'mobiledoc-kit/utils/array-utils', 'mobiledoc-kit/models/types', 'mobiledoc-kit/utils/assert'], function (exports, _mobiledocKitModelsAtom, _mobiledocKitModelsPost, _mobiledocKitModelsMarkupSection, _mobiledocKitModelsListSection, _mobiledocKitModelsListItem, _mobiledocKitModelsImage, _mobiledocKitModelsMarker, _mobiledocKitModelsMarkup, _mobiledocKitModelsCard, _mobiledocKitUtilsDomUtils, _mobiledocKitUtilsArrayUtils, _mobiledocKitModelsTypes, _mobiledocKitUtilsAssert) {
  'use strict';

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  function cacheKey(tagName, attributes) {
    return (0, _mobiledocKitUtilsDomUtils.normalizeTagName)(tagName) + '-' + (0, _mobiledocKitUtilsArrayUtils.objectToSortedKVArray)(attributes).join('-');
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

        var post = new _mobiledocKitModelsPost['default']();
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
          case _mobiledocKitModelsTypes.LIST_ITEM_TYPE:
            return this.createListItem(tagName, markers);
          case _mobiledocKitModelsTypes.MARKUP_SECTION_TYPE:
            return this.createMarkupSection(tagName, markers);
          default:
            (0, _mobiledocKitUtilsAssert['default'])('Cannot create markerable section of type ' + type, false);
        }
      }
    }, {
      key: 'createMarkupSection',
      value: function createMarkupSection() {
        var tagName = arguments.length <= 0 || arguments[0] === undefined ? _mobiledocKitModelsMarkupSection.DEFAULT_TAG_NAME : arguments[0];
        var markers = arguments.length <= 1 || arguments[1] === undefined ? [] : arguments[1];
        var isGenerated = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];

        tagName = (0, _mobiledocKitUtilsDomUtils.normalizeTagName)(tagName);
        var section = new _mobiledocKitModelsMarkupSection['default'](tagName, markers);
        if (isGenerated) {
          section.isGenerated = true;
        }
        section.builder = this;
        return section;
      }
    }, {
      key: 'createListSection',
      value: function createListSection() {
        var tagName = arguments.length <= 0 || arguments[0] === undefined ? _mobiledocKitModelsListSection.DEFAULT_TAG_NAME : arguments[0];
        var items = arguments.length <= 1 || arguments[1] === undefined ? [] : arguments[1];

        tagName = (0, _mobiledocKitUtilsDomUtils.normalizeTagName)(tagName);
        var section = new _mobiledocKitModelsListSection['default'](tagName, items);
        section.builder = this;
        return section;
      }
    }, {
      key: 'createListItem',
      value: function createListItem() {
        var markers = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];

        var tagName = (0, _mobiledocKitUtilsDomUtils.normalizeTagName)('li');
        var item = new _mobiledocKitModelsListItem['default'](tagName, markers);
        item.builder = this;
        return item;
      }
    }, {
      key: 'createImageSection',
      value: function createImageSection(url) {
        var section = new _mobiledocKitModelsImage['default']();
        if (url) {
          section.src = url;
        }
        return section;
      }
    }, {
      key: 'createCardSection',
      value: function createCardSection(name) {
        var payload = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

        var card = new _mobiledocKitModelsCard['default'](name, payload);
        card.builder = this;
        return card;
      }
    }, {
      key: 'createMarker',
      value: function createMarker(value) {
        var markups = arguments.length <= 1 || arguments[1] === undefined ? [] : arguments[1];

        var marker = new _mobiledocKitModelsMarker['default'](value, markups);
        marker.builder = this;
        return marker;
      }
    }, {
      key: 'createAtom',
      value: function createAtom(name) {
        var text = arguments.length <= 1 || arguments[1] === undefined ? '' : arguments[1];
        var payload = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
        var markups = arguments.length <= 3 || arguments[3] === undefined ? [] : arguments[3];

        var atom = new _mobiledocKitModelsAtom['default'](name, text, payload, markups);
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

        tagName = (0, _mobiledocKitUtilsDomUtils.normalizeTagName)(tagName);

        var markup = findMarkupInCache(this.markupCache, tagName, attributes);
        if (!markup) {
          markup = new _mobiledocKitModelsMarkup['default'](tagName, attributes);
          markup.builder = this;
          addMarkupToCache(this.markupCache, markup);
        }

        return markup;
      }
    }]);

    return PostNodeBuilder;
  })();

  exports['default'] = PostNodeBuilder;
});
define('mobiledoc-kit/models/post', ['exports', 'mobiledoc-kit/models/types', 'mobiledoc-kit/utils/linked-list', 'mobiledoc-kit/utils/array-utils', 'mobiledoc-kit/utils/set', 'mobiledoc-kit/renderers/mobiledoc', 'mobiledoc-kit/utils/cursor/range', 'mobiledoc-kit/utils/cursor/position'], function (exports, _mobiledocKitModelsTypes, _mobiledocKitUtilsLinkedList, _mobiledocKitUtilsArrayUtils, _mobiledocKitUtilsSet, _mobiledocKitRenderersMobiledoc, _mobiledocKitUtilsCursorRange, _mobiledocKitUtilsCursorPosition) {
  'use strict';

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  var Post = (function () {
    function Post() {
      var _this = this;

      _classCallCheck(this, Post);

      this.type = _mobiledocKitModelsTypes.POST_TYPE;
      this.sections = new _mobiledocKitUtilsLinkedList['default']({
        adoptItem: function adoptItem(s) {
          return s.post = s.parent = _this;
        },
        freeItem: function freeItem(s) {
          return s.post = s.parent = null;
        }
      });
    }

    _createClass(Post, [{
      key: 'headPosition',
      value: function headPosition() {
        if (this.isBlank) {
          return _mobiledocKitUtilsCursorPosition['default'].blankPosition();
        } else {
          return this.sections.head.headPosition();
        }
      }
    }, {
      key: 'tailPosition',
      value: function tailPosition() {
        if (this.isBlank) {
          return _mobiledocKitUtilsCursorPosition['default'].blankPosition();
        } else {
          return this.sections.tail.tailPosition();
        }
      }
    }, {
      key: 'markersContainedByRange',

      /**
       * @param {Range} range
       * @return {Array} markers that are completely contained by the range
       */
      value: function markersContainedByRange(range) {
        var markers = [];

        this.walkMarkerableSections(range, function (section) {
          section._markersInRange(range.trimTo(section), function (m, _ref) {
            var isContained = _ref.isContained;
            if (isContained) {
              markers.push(m);
            }
          });
        });

        return markers;
      }
    }, {
      key: 'cutMarkers',
      value: function cutMarkers(markers) {
        var firstSection = markers.length && markers[0].section,
            lastSection = markers.length && markers[markers.length - 1].section;

        var currentSection = firstSection;
        var removedSections = [],
            changedSections = (0, _mobiledocKitUtilsArrayUtils.compact)([firstSection, lastSection]);

        if (markers.length !== 0) {
          markers.forEach(function (marker) {
            if (marker.section !== currentSection) {
              // this marker is in a section we haven't seen yet
              if (marker.section !== firstSection && marker.section !== lastSection) {
                // section is wholly contained by markers, and can be removed
                removedSections.push(marker.section);
              }
            }

            currentSection = marker.section;
            currentSection.markers.remove(marker);
          });

          if (firstSection !== lastSection) {
            firstSection.join(lastSection);
            removedSections.push(lastSection);
          }
        }

        return { changedSections: changedSections, removedSections: removedSections };
      }

      /**
       * Invoke `callbackFn` for all markers between the headMarker and tailMarker (inclusive),
       * across sections
       */
    }, {
      key: 'markersFrom',
      value: function markersFrom(headMarker, tailMarker, callbackFn) {
        var currentMarker = headMarker;
        while (currentMarker) {
          callbackFn(currentMarker);

          if (currentMarker === tailMarker) {
            currentMarker = null;
          } else if (currentMarker.next) {
            currentMarker = currentMarker.next;
          } else {
            var nextSection = this._nextMarkerableSection(currentMarker.section);
            // FIXME: This will fail across cards
            currentMarker = nextSection && nextSection.markers.head;
          }
        }
      }
    }, {
      key: 'markupsInRange',
      value: function markupsInRange(range) {
        var markups = new _mobiledocKitUtilsSet['default']();

        this.walkMarkerableSections(range, function (section) {
          (0, _mobiledocKitUtilsArrayUtils.forEach)(section.markupsInRange(range.trimTo(section)), function (m) {
            return markups.add(m);
          });
        });

        return markups.toArray();
      }
    }, {
      key: 'walkAllLeafSections',
      value: function walkAllLeafSections(callback) {
        var range = new _mobiledocKitUtilsCursorRange['default'](this.sections.head.headPosition(), this.sections.tail.tailPosition());
        return this.walkLeafSections(range, callback);
      }
    }, {
      key: 'walkLeafSections',
      value: function walkLeafSections(range, callback) {
        var head = range.head;
        var tail = range.tail;

        var index = 0;
        var nextSection = undefined,
            shouldStop = undefined;
        var currentSection = head.section;

        while (currentSection) {
          nextSection = this._nextLeafSection(currentSection);
          shouldStop = currentSection === tail.section;

          callback(currentSection, index);
          index++;

          if (shouldStop) {
            break;
          } else {
            currentSection = nextSection;
          }
        }
      }
    }, {
      key: 'walkMarkerableSections',
      value: function walkMarkerableSections(range, callback) {
        this.walkLeafSections(range, function (section) {
          if (section.isMarkerable) {
            callback(section);
          }
        });
      }

      // return an array of all top-level sections (direct children of `post`)
      // that are wholly contained by the range.
    }, {
      key: 'sectionsContainedBy',
      value: function sectionsContainedBy(range) {
        var head = range.head;
        var tail = range.tail;

        var containedSections = [];

        var findParent = function findParent(child, conditionFn) {
          while (child) {
            if (conditionFn(child)) {
              return child;
            }
            child = child.parent;
          }
        };

        var headTopLevelSection = findParent(head.section, function (s) {
          return s.parent === s.post;
        });
        var tailTopLevelSection = findParent(tail.section, function (s) {
          return s.parent === s.post;
        });

        if (headTopLevelSection === tailTopLevelSection) {
          return containedSections;
        }

        var currentSection = headTopLevelSection.next;
        while (currentSection && currentSection !== tailTopLevelSection) {
          containedSections.push(currentSection);
          currentSection = currentSection.next;
        }

        return containedSections;
      }
    }, {
      key: '_nextMarkerableSection',
      value: function _nextMarkerableSection(section) {
        var nextSection = this._nextLeafSection(section);

        while (nextSection && !nextSection.isMarkerable) {
          nextSection = this._nextLeafSection(nextSection);
        }

        return nextSection;
      }

      // return the next section that has markers after this one,
      // possibly skipping non-markerable sections
    }, {
      key: '_nextLeafSection',
      value: function _nextLeafSection(section) {
        if (!section) {
          return null;
        }
        var hasChildren = function hasChildren(s) {
          return !!s.items;
        };
        var firstChild = function firstChild(s) {
          return s.items.head;
        };

        // FIXME this can be refactored to use `isLeafSection`
        var next = section.next;
        if (next) {
          if (hasChildren(next)) {
            // e.g. a ListSection
            return firstChild(next);
          } else {
            return next;
          }
        } else if (section.isNested) {
          // if there is no section after this, but this section is a child
          // (e.g. a ListItem inside a ListSection), check for a markerable
          // section after its parent
          return this._nextLeafSection(section.parent);
        }
      }

      /**
       * @param {Range} range
       * @return {Mobiledoc} A mobiledoc representation of the range (JSON)
       */
    }, {
      key: 'cloneRange',
      value: function cloneRange(range) {
        var post = this.builder.createPost();
        var builder = this.builder;

        var sectionParent = post,
            listParent = null;
        this.walkLeafSections(range, function (section) {
          var newSection = undefined;
          if (section.isMarkerable) {
            if (section.isListItem) {
              if (listParent) {
                sectionParent = null;
              } else {
                listParent = builder.createListSection(section.parent.tagName);
                post.sections.append(listParent);
                sectionParent = null;
              }
              newSection = builder.createListItem();
              listParent.items.append(newSection);
            } else {
              listParent = null;
              sectionParent = post;
              newSection = builder.createMarkupSection(section.tagName);
            }

            var currentRange = range.trimTo(section);
            (0, _mobiledocKitUtilsArrayUtils.forEach)(section.markersFor(currentRange.headSectionOffset, currentRange.tailSectionOffset), function (m) {
              return newSection.markers.append(m);
            });
          } else {
            newSection = section.clone();
          }
          if (sectionParent) {
            sectionParent.sections.append(newSection);
          }
        });
        return _mobiledocKitRenderersMobiledoc['default'].render(post);
      }
    }, {
      key: 'isBlank',
      get: function get() {
        return this.sections.isEmpty;
      }
    }]);

    return Post;
  })();

  exports['default'] = Post;
});
define('mobiledoc-kit/models/render-node', ['exports', 'mobiledoc-kit/utils/linked-item', 'mobiledoc-kit/utils/linked-list', 'mobiledoc-kit/utils/dom-utils', 'mobiledoc-kit/utils/assert'], function (exports, _mobiledocKitUtilsLinkedItem, _mobiledocKitUtilsLinkedList, _mobiledocKitUtilsDomUtils, _mobiledocKitUtilsAssert) {
  'use strict';

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

  var RenderNode = (function (_LinkedItem) {
    _inherits(RenderNode, _LinkedItem);

    function RenderNode(postNode, renderTree) {
      _classCallCheck(this, RenderNode);

      _get(Object.getPrototypeOf(RenderNode.prototype), 'constructor', this).call(this);
      this.parent = null;
      this.isDirty = true;
      this.isRemoved = false;
      this.postNode = postNode;
      this._childNodes = null;
      this._element = null;
      this.renderTree = renderTree;

      // RenderNodes for Markers keep track of their markupElement
      this.markupElement = null;

      // RenderNodes for Atoms use these properties
      this.headTextNode = null;
      this.tailTextNode = null;
      this.atomNode = null;

      // RenderNodes for cards use this property
      this.cardNode = null;
    }

    _createClass(RenderNode, [{
      key: 'isAttached',
      value: function isAttached() {
        (0, _mobiledocKitUtilsAssert['default'])('Cannot check if a renderNode is attached without an element.', !!this.element);
        return (0, _mobiledocKitUtilsDomUtils.containsNode)(this.renderTree.rootElement, this.element);
      }
    }, {
      key: 'scheduleForRemoval',
      value: function scheduleForRemoval() {
        this.isRemoved = true;
        if (this.parent) {
          this.parent.markDirty();
        }
      }
    }, {
      key: 'markDirty',
      value: function markDirty() {
        this.isDirty = true;
        if (this.parent) {
          this.parent.markDirty();
        }
      }
    }, {
      key: 'markClean',
      value: function markClean() {
        this.isDirty = false;
      }
    }, {
      key: 'destroy',
      value: function destroy() {
        this.element = null;
        this.parent = null;
        this.postNode = null;
        this.renderTree = null;
      }
    }, {
      key: 'reparsesMutationOfChildNode',
      value: function reparsesMutationOfChildNode(node) {
        if (this.postNode.isCardSection) {
          return !(0, _mobiledocKitUtilsDomUtils.containsNode)(this.cardNode.element, node);
        }
        return true;
      }
    }, {
      key: 'childNodes',
      get: function get() {
        var _this = this;

        if (!this._childNodes) {
          this._childNodes = new _mobiledocKitUtilsLinkedList['default']({
            adoptItem: function adoptItem(item) {
              return item.parent = _this;
            },
            freeItem: function freeItem(item) {
              return item.destroy();
            }
          });
        }
        return this._childNodes;
      }
    }, {
      key: 'isRendered',
      get: function get() {
        return !!this.element;
      }
    }, {
      key: 'element',
      set: function set(element) {
        var currentElement = this._element;
        this._element = element;

        if (currentElement) {
          this.renderTree.removeElementRenderNode(currentElement);
        }

        if (element) {
          this.renderTree.setElementRenderNode(element, this);
        }
      },
      get: function get() {
        return this._element;
      }
    }]);

    return RenderNode;
  })(_mobiledocKitUtilsLinkedItem['default']);

  exports['default'] = RenderNode;
});
define('mobiledoc-kit/models/render-tree', ['exports', 'mobiledoc-kit/models/render-node', 'mobiledoc-kit/utils/element-map'], function (exports, _mobiledocKitModelsRenderNode, _mobiledocKitUtilsElementMap) {
  'use strict';

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  var RenderTree = (function () {
    function RenderTree(rootPostNode) {
      _classCallCheck(this, RenderTree);

      this._rootNode = this.buildRenderNode(rootPostNode);
      this._elements = new _mobiledocKitUtilsElementMap['default']();
    }

    /*
     * @return {RenderNode} The root render node in this tree
     */

    _createClass(RenderTree, [{
      key: 'getElementRenderNode',

      /*
       * @param {DOMNode} element
       * @return {RenderNode} The renderNode for this element, if any
       */
      value: function getElementRenderNode(element) {
        return this._elements.get(element);
      }
    }, {
      key: 'setElementRenderNode',
      value: function setElementRenderNode(element, renderNode) {
        this._elements.set(element, renderNode);
      }
    }, {
      key: 'removeElementRenderNode',
      value: function removeElementRenderNode(element) {
        this._elements.remove(element);
      }

      /**
       * @param {DOMNode} element
       * Walk up from the dom element until we find a renderNode element
       */
    }, {
      key: 'findRenderNodeFromElement',
      value: function findRenderNodeFromElement(element) {
        var conditionFn = arguments.length <= 1 || arguments[1] === undefined ? function () {
          return true;
        } : arguments[1];

        var renderNode = undefined;
        while (element) {
          renderNode = this.getElementRenderNode(element);
          if (renderNode && conditionFn(renderNode)) {
            return renderNode;
          }

          // continue loop
          element = element.parentNode;

          // stop if we are at the root element
          if (element === this.rootElement) {
            if (conditionFn(this.rootNode)) {
              return this.rootNode;
            } else {
              return;
            }
          }
        }
      }
    }, {
      key: 'buildRenderNode',
      value: function buildRenderNode(postNode) {
        var renderNode = new _mobiledocKitModelsRenderNode['default'](postNode, this);
        postNode.renderNode = renderNode;
        return renderNode;
      }
    }, {
      key: 'rootNode',
      get: function get() {
        return this._rootNode;
      }

      /**
       * @return {Boolean}
       */
    }, {
      key: 'isDirty',
      get: function get() {
        return this.rootNode && this.rootNode.isDirty;
      }

      /*
       * @return {DOMNode} The root DOM element in this tree
       */
    }, {
      key: 'rootElement',
      get: function get() {
        return this.rootNode.element;
      }
    }]);

    return RenderTree;
  })();

  exports['default'] = RenderTree;
});
define('mobiledoc-kit/models/types', ['exports'], function (exports) {
  'use strict';

  var MARKUP_SECTION_TYPE = 'markup-section';
  exports.MARKUP_SECTION_TYPE = MARKUP_SECTION_TYPE;
  var LIST_SECTION_TYPE = 'list-section';
  exports.LIST_SECTION_TYPE = LIST_SECTION_TYPE;
  var MARKUP_TYPE = 'markup';
  exports.MARKUP_TYPE = MARKUP_TYPE;
  var MARKER_TYPE = 'marker';
  exports.MARKER_TYPE = MARKER_TYPE;
  var POST_TYPE = 'post';
  exports.POST_TYPE = POST_TYPE;
  var LIST_ITEM_TYPE = 'list-item';
  exports.LIST_ITEM_TYPE = LIST_ITEM_TYPE;
  var CARD_TYPE = 'card-section';
  exports.CARD_TYPE = CARD_TYPE;
  var IMAGE_SECTION_TYPE = 'image-section';
  exports.IMAGE_SECTION_TYPE = IMAGE_SECTION_TYPE;
  var ATOM_TYPE = 'atom';
  exports.ATOM_TYPE = ATOM_TYPE;
});
define('mobiledoc-kit/parsers/dom', ['exports', 'mobiledoc-kit/renderers/editor-dom', 'mobiledoc-kit/models/types', 'mobiledoc-kit/utils/dom-utils', 'mobiledoc-kit/utils/array-utils', 'mobiledoc-kit/utils/characters', 'mobiledoc-kit/parsers/section', 'mobiledoc-kit/models/markup'], function (exports, _mobiledocKitRenderersEditorDom, _mobiledocKitModelsTypes, _mobiledocKitUtilsDomUtils, _mobiledocKitUtilsArrayUtils, _mobiledocKitUtilsCharacters, _mobiledocKitParsersSection, _mobiledocKitModelsMarkup) {
  'use strict';

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  exports.transformHTMLText = transformHTMLText;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  var GOOGLE_DOCS_CONTAINER_ID_REGEX = /^docs\-internal\-guid/;

  var NO_BREAK_SPACE_REGEX = new RegExp(_mobiledocKitRenderersEditorDom.NO_BREAK_SPACE, 'g');
  var TAB_CHARACTER_REGEX = new RegExp(_mobiledocKitRenderersEditorDom.TAB_CHARACTER, 'g');

  function transformHTMLText(textContent) {
    var text = textContent;
    text = text.replace(NO_BREAK_SPACE_REGEX, ' ');
    text = text.replace(TAB_CHARACTER_REGEX, _mobiledocKitUtilsCharacters.TAB);
    return text;
  }

  function isGoogleDocsContainer(element) {
    return !(0, _mobiledocKitUtilsDomUtils.isTextNode)(element) && !(0, _mobiledocKitUtilsDomUtils.isCommentNode)(element) && (0, _mobiledocKitUtilsDomUtils.normalizeTagName)(element.tagName) === (0, _mobiledocKitUtilsDomUtils.normalizeTagName)('b') && GOOGLE_DOCS_CONTAINER_ID_REGEX.test(element.id);
  }

  function detectRootElement(element) {
    var childNodes = element.childNodes || [];
    var googleDocsContainer = (0, _mobiledocKitUtilsArrayUtils.detect)(childNodes, isGoogleDocsContainer);

    if (googleDocsContainer) {
      return googleDocsContainer;
    } else {
      return element;
    }
  }

  var TAG_REMAPPING = {
    'b': 'strong',
    'i': 'em'
  };

  function remapTagName(tagName) {
    var normalized = (0, _mobiledocKitUtilsDomUtils.normalizeTagName)(tagName);
    var remapped = TAG_REMAPPING[normalized];
    return remapped || normalized;
  }

  function trim(str) {
    return str.replace(/^\s+/, '').replace(/\s+$/, '');
  }

  function walkMarkerableNodes(parent, callback) {
    var currentNode = parent;

    if ((0, _mobiledocKitUtilsDomUtils.isTextNode)(currentNode) || (0, _mobiledocKitUtilsDomUtils.isElementNode)(currentNode) && currentNode.classList.contains(_mobiledocKitRenderersEditorDom.ATOM_CLASS_NAME)) {
      callback(currentNode);
    } else {
      currentNode = currentNode.firstChild;
      while (currentNode) {
        walkMarkerableNodes(currentNode, callback);
        currentNode = currentNode.nextSibling;
      }
    }
  }

  /**
   * Parses DOM element -> Post
   */

  var DOMParser = (function () {
    function DOMParser(builder) {
      var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      _classCallCheck(this, DOMParser);

      this.builder = builder;
      this.sectionParser = new _mobiledocKitParsersSection['default'](this.builder, options);
    }

    _createClass(DOMParser, [{
      key: 'parse',
      value: function parse(element) {
        var _this = this;

        var post = this.builder.createPost();
        var rootElement = detectRootElement(element);

        this._eachChildNode(rootElement, function (child) {
          var sections = _this.parseSections(child);
          _this.appendSections(post, sections);
        });

        return post;
      }
    }, {
      key: 'appendSections',
      value: function appendSections(post, sections) {
        var _this2 = this;

        (0, _mobiledocKitUtilsArrayUtils.forEach)(sections, function (section) {
          return _this2.appendSection(post, section);
        });
      }
    }, {
      key: 'appendSection',
      value: function appendSection(post, section) {
        if (section.isBlank || section.isMarkerable && trim(section.text) === '') {
          return;
        }

        var lastSection = post.sections.tail;
        if (lastSection && lastSection._inferredTagName && section._inferredTagName && lastSection.tagName === section.tagName) {
          lastSection.join(section);
        } else {
          post.sections.append(section);
        }
      }
    }, {
      key: '_eachChildNode',
      value: function _eachChildNode(element, callback) {
        var nodes = (0, _mobiledocKitUtilsDomUtils.isTextNode)(element) ? [element] : element.childNodes;
        (0, _mobiledocKitUtilsArrayUtils.forEach)(nodes, function (node) {
          return callback(node);
        });
      }
    }, {
      key: 'parseSections',
      value: function parseSections(element) {
        return this.sectionParser.parse(element);
      }

      // walk up from the textNode until the rootNode, converting each
      // parentNode into a markup
    }, {
      key: 'collectMarkups',
      value: function collectMarkups(textNode, rootNode) {
        var markups = [];
        var currentNode = textNode.parentNode;
        while (currentNode && currentNode !== rootNode) {
          var markup = this.markupFromNode(currentNode);
          if (markup) {
            markups.push(markup);
          }

          currentNode = currentNode.parentNode;
        }
        return markups;
      }

      // Turn an element node into a markup
    }, {
      key: 'markupFromNode',
      value: function markupFromNode(node) {
        if (_mobiledocKitModelsMarkup['default'].isValidElement(node)) {
          var tagName = remapTagName(node.tagName);
          var attributes = (0, _mobiledocKitUtilsDomUtils.getAttributes)(node);
          return this.builder.createMarkup(tagName, attributes);
        }
      }

      // FIXME should move to the section parser?
      // FIXME the `collectMarkups` logic could simplify the section parser?
    }, {
      key: 'reparseSection',
      value: function reparseSection(section, renderTree) {
        switch (section.type) {
          case _mobiledocKitModelsTypes.LIST_SECTION_TYPE:
            return this.reparseListSection(section, renderTree);
          case _mobiledocKitModelsTypes.LIST_ITEM_TYPE:
            return this.reparseListItem(section, renderTree);
          case _mobiledocKitModelsTypes.MARKUP_SECTION_TYPE:
            return this.reparseMarkupSection(section, renderTree);
          default:
            return; // can only parse the above types
        }
      }
    }, {
      key: 'reparseMarkupSection',
      value: function reparseMarkupSection(section, renderTree) {
        return this._reparseSectionContainingMarkers(section, renderTree);
      }
    }, {
      key: 'reparseListItem',
      value: function reparseListItem(listItem, renderTree) {
        return this._reparseSectionContainingMarkers(listItem, renderTree);
      }
    }, {
      key: 'reparseListSection',
      value: function reparseListSection(listSection, renderTree) {
        var _this3 = this;

        listSection.items.forEach(function (li) {
          return _this3.reparseListItem(li, renderTree);
        });
      }
    }, {
      key: '_reparseSectionContainingMarkers',
      value: function _reparseSectionContainingMarkers(section, renderTree) {
        var _this4 = this;

        var element = section.renderNode.element;
        var seenRenderNodes = [];
        var previousMarker = undefined;

        walkMarkerableNodes(element, function (node) {
          var marker = undefined;
          var renderNode = renderTree.getElementRenderNode(node);
          if (renderNode) {
            if (renderNode.postNode.isMarker) {
              var text = transformHTMLText(node.textContent);
              var markups = _this4.collectMarkups(node, element);
              if (text.length) {
                marker = renderNode.postNode;
                marker.value = text;
                marker.markups = markups;
              } else {
                renderNode.scheduleForRemoval();
              }
            } else if (renderNode.postNode.isAtom) {
              var _renderNode = renderNode;
              var headTextNode = _renderNode.headTextNode;
              var tailTextNode = _renderNode.tailTextNode;

              if (headTextNode.textContent !== _mobiledocKitRenderersEditorDom.ZWNJ) {
                var value = headTextNode.textContent.replace(new RegExp(_mobiledocKitRenderersEditorDom.ZWNJ, 'g'), '');
                headTextNode.textContent = _mobiledocKitRenderersEditorDom.ZWNJ;
                if (previousMarker && previousMarker.isMarker) {
                  previousMarker.value += value;
                  if (previousMarker.renderNode) {
                    previousMarker.renderNode.markDirty();
                  }
                } else {
                  var postNode = renderNode.postNode;
                  var newMarkups = postNode.markups.slice();
                  var newPreviousMarker = _this4.builder.createMarker(value, newMarkups);
                  section.markers.insertBefore(newPreviousMarker, postNode);

                  var newPreviousRenderNode = renderTree.buildRenderNode(newPreviousMarker);
                  newPreviousRenderNode.markDirty();
                  section.renderNode.markDirty();

                  seenRenderNodes.push(newPreviousRenderNode);
                  section.renderNode.childNodes.insertBefore(newPreviousRenderNode, renderNode);
                }
              }
              if (tailTextNode.textContent !== _mobiledocKitRenderersEditorDom.ZWNJ) {
                var value = tailTextNode.textContent.replace(new RegExp(_mobiledocKitRenderersEditorDom.ZWNJ, 'g'), '');
                tailTextNode.textContent = _mobiledocKitRenderersEditorDom.ZWNJ;

                if (renderNode.postNode.next && renderNode.postNode.next.isMarker) {
                  var nextMarker = renderNode.postNode.next;

                  if (nextMarker.renderNode) {
                    var nextValue = nextMarker.renderNode.element.textContent;
                    nextMarker.renderNode.element.textContent = value + nextValue;
                  } else {
                    var nextValue = value + nextMarker.value;
                    nextMarker.value = nextValue;
                  }
                } else {
                  var postNode = renderNode.postNode;
                  var newMarkups = postNode.markups.slice();
                  var newMarker = _this4.builder.createMarker(value, newMarkups);

                  section.markers.insertAfter(newMarker, postNode);

                  var newRenderNode = renderTree.buildRenderNode(newMarker);
                  seenRenderNodes.push(newRenderNode);

                  newRenderNode.markDirty();
                  section.renderNode.markDirty();

                  section.renderNode.childNodes.insertAfter(newRenderNode, renderNode);
                }
              }
              if (renderNode) {
                marker = renderNode.postNode;
              }
            }
          } else if ((0, _mobiledocKitUtilsDomUtils.isTextNode)(node)) {
            var text = transformHTMLText(node.textContent);
            var markups = _this4.collectMarkups(node, element);
            marker = _this4.builder.createMarker(text, markups);

            renderNode = renderTree.buildRenderNode(marker);
            renderNode.element = node;
            renderNode.markClean();
            section.renderNode.markDirty();

            var previousRenderNode = previousMarker && previousMarker.renderNode;
            section.markers.insertAfter(marker, previousMarker);
            section.renderNode.childNodes.insertAfter(renderNode, previousRenderNode);
          }

          if (renderNode) {
            seenRenderNodes.push(renderNode);
          }
          previousMarker = marker;
        });

        var renderNode = section.renderNode.childNodes.head;
        while (renderNode) {
          if (seenRenderNodes.indexOf(renderNode) === -1) {
            renderNode.scheduleForRemoval();
          }
          renderNode = renderNode.next;
        }
      }
    }]);

    return DOMParser;
  })();

  exports['default'] = DOMParser;
});
define('mobiledoc-kit/parsers/html', ['exports', 'mobiledoc-kit/utils/dom-utils', 'mobiledoc-kit/utils/assert', 'mobiledoc-kit/parsers/dom'], function (exports, _mobiledocKitUtilsDomUtils, _mobiledocKitUtilsAssert, _mobiledocKitParsersDom) {
  'use strict';

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  var HTMLParser = (function () {
    function HTMLParser(builder) {
      var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      _classCallCheck(this, HTMLParser);

      (0, _mobiledocKitUtilsAssert['default'])('Must pass builder to HTMLParser', builder);
      this.builder = builder;
      this.options = options;
    }

    /**
     * @param {String} html to parse
     * @return {Post} A post abstract
     */

    _createClass(HTMLParser, [{
      key: 'parse',
      value: function parse(html) {
        var dom = (0, _mobiledocKitUtilsDomUtils.parseHTML)(html);
        var parser = new _mobiledocKitParsersDom['default'](this.builder, this.options);
        return parser.parse(dom);
      }
    }]);

    return HTMLParser;
  })();

  exports['default'] = HTMLParser;
});
define('mobiledoc-kit/parsers/mobiledoc/0-2', ['exports', 'mobiledoc-kit/renderers/mobiledoc/0-2', 'mobiledoc-kit/utils/array-utils', 'mobiledoc-kit/utils/assert'], function (exports, _mobiledocKitRenderersMobiledoc02, _mobiledocKitUtilsArrayUtils, _mobiledocKitUtilsAssert) {
  'use strict';

  var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  /*
   * Parses from mobiledoc -> post
   */

  var MobiledocParser = (function () {
    function MobiledocParser(builder) {
      _classCallCheck(this, MobiledocParser);

      this.builder = builder;
    }

    /**
     * @method parse
     * @param {Mobiledoc}
     * @return {Post}
     */

    _createClass(MobiledocParser, [{
      key: 'parse',
      value: function parse(_ref) {
        var version = _ref.version;
        var sectionData = _ref.sections;

        try {
          var markerTypes = sectionData[0];
          var sections = sectionData[1];

          var post = this.builder.createPost();

          this.markups = [];
          this.markerTypes = this.parseMarkerTypes(markerTypes);
          this.parseSections(sections, post);

          return post;
        } catch (e) {
          (0, _mobiledocKitUtilsAssert['default'])('Unable to parse mobiledoc: ' + e.message, false);
        }
      }
    }, {
      key: 'parseMarkerTypes',
      value: function parseMarkerTypes(markerTypes) {
        var _this = this;

        return markerTypes.map(function (markerType) {
          return _this.parseMarkerType(markerType);
        });
      }
    }, {
      key: 'parseMarkerType',
      value: function parseMarkerType(_ref2) {
        var _ref22 = _slicedToArray(_ref2, 2);

        var tagName = _ref22[0];
        var attributesArray = _ref22[1];

        var attributesObject = (0, _mobiledocKitUtilsArrayUtils.kvArrayToObject)(attributesArray || []);
        return this.builder.createMarkup(tagName, attributesObject);
      }
    }, {
      key: 'parseSections',
      value: function parseSections(sections, post) {
        var _this2 = this;

        sections.forEach(function (section) {
          return _this2.parseSection(section, post);
        });
      }
    }, {
      key: 'parseSection',
      value: function parseSection(section, post) {
        var _section = _slicedToArray(section, 1);

        var type = _section[0];

        switch (type) {
          case _mobiledocKitRenderersMobiledoc02.MOBILEDOC_MARKUP_SECTION_TYPE:
            this.parseMarkupSection(section, post);
            break;
          case _mobiledocKitRenderersMobiledoc02.MOBILEDOC_IMAGE_SECTION_TYPE:
            this.parseImageSection(section, post);
            break;
          case _mobiledocKitRenderersMobiledoc02.MOBILEDOC_CARD_SECTION_TYPE:
            this.parseCardSection(section, post);
            break;
          case _mobiledocKitRenderersMobiledoc02.MOBILEDOC_LIST_SECTION_TYPE:
            this.parseListSection(section, post);
            break;
          default:
            (0, _mobiledocKitUtilsAssert['default'])('Unexpected section type ' + type, false);
        }
      }
    }, {
      key: 'parseCardSection',
      value: function parseCardSection(_ref3, post) {
        var _ref32 = _slicedToArray(_ref3, 3);

        var type = _ref32[0];
        var name = _ref32[1];
        var payload = _ref32[2];

        var section = this.builder.createCardSection(name, payload);
        post.sections.append(section);
      }
    }, {
      key: 'parseImageSection',
      value: function parseImageSection(_ref4, post) {
        var _ref42 = _slicedToArray(_ref4, 2);

        var type = _ref42[0];
        var src = _ref42[1];

        var section = this.builder.createImageSection(src);
        post.sections.append(section);
      }
    }, {
      key: 'parseMarkupSection',
      value: function parseMarkupSection(_ref5, post) {
        var _ref52 = _slicedToArray(_ref5, 3);

        var type = _ref52[0];
        var tagName = _ref52[1];
        var markers = _ref52[2];

        var section = this.builder.createMarkupSection(tagName);
        post.sections.append(section);
        this.parseMarkers(markers, section);
        // Strip blank markers after they have been created. This ensures any
        // markup they include has been correctly populated.
        (0, _mobiledocKitUtilsArrayUtils.filter)(section.markers, function (m) {
          return m.isBlank;
        }).forEach(function (m) {
          section.markers.remove(m);
        });
      }
    }, {
      key: 'parseListSection',
      value: function parseListSection(_ref6, post) {
        var _ref62 = _slicedToArray(_ref6, 3);

        var type = _ref62[0];
        var tagName = _ref62[1];
        var items = _ref62[2];

        var section = this.builder.createListSection(tagName);
        post.sections.append(section);
        this.parseListItems(items, section);
      }
    }, {
      key: 'parseListItems',
      value: function parseListItems(items, section) {
        var _this3 = this;

        items.forEach(function (i) {
          return _this3.parseListItem(i, section);
        });
      }
    }, {
      key: 'parseListItem',
      value: function parseListItem(markers, section) {
        var item = this.builder.createListItem();
        this.parseMarkers(markers, item);
        section.items.append(item);
      }
    }, {
      key: 'parseMarkers',
      value: function parseMarkers(markers, parent) {
        var _this4 = this;

        markers.forEach(function (m) {
          return _this4.parseMarker(m, parent);
        });
      }
    }, {
      key: 'parseMarker',
      value: function parseMarker(_ref7, parent) {
        var _this5 = this;

        var _ref72 = _slicedToArray(_ref7, 3);

        var markerTypeIndexes = _ref72[0];
        var closeCount = _ref72[1];
        var value = _ref72[2];

        markerTypeIndexes.forEach(function (index) {
          _this5.markups.push(_this5.markerTypes[index]);
        });
        var marker = this.builder.createMarker(value, this.markups.slice());
        parent.markers.append(marker);
        this.markups = this.markups.slice(0, this.markups.length - closeCount);
      }
    }]);

    return MobiledocParser;
  })();

  exports['default'] = MobiledocParser;
});
define('mobiledoc-kit/parsers/mobiledoc/0-3', ['exports', 'mobiledoc-kit/renderers/mobiledoc/0-3', 'mobiledoc-kit/utils/array-utils', 'mobiledoc-kit/utils/assert'], function (exports, _mobiledocKitRenderersMobiledoc03, _mobiledocKitUtilsArrayUtils, _mobiledocKitUtilsAssert) {
  'use strict';

  var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  /*
   * Parses from mobiledoc -> post
   */

  var MobiledocParser = (function () {
    function MobiledocParser(builder) {
      _classCallCheck(this, MobiledocParser);

      this.builder = builder;
    }

    /**
     * @method parse
     * @param {Mobiledoc}
     * @return {Post}
     */

    _createClass(MobiledocParser, [{
      key: 'parse',
      value: function parse(_ref) {
        var version = _ref.version;
        var sections = _ref.sections;
        var markerTypes = _ref.markups;
        var cardTypes = _ref.cards;
        var atomTypes = _ref.atoms;

        try {
          var post = this.builder.createPost();

          this.markups = [];
          this.markerTypes = this.parseMarkerTypes(markerTypes);
          this.cardTypes = this.parseCardTypes(cardTypes);
          this.atomTypes = this.parseAtomTypes(atomTypes);
          this.parseSections(sections, post);

          return post;
        } catch (e) {
          throw new Error('Unable to parse mobiledoc: ' + e.message);
        }
      }
    }, {
      key: 'parseMarkerTypes',
      value: function parseMarkerTypes(markerTypes) {
        var _this = this;

        return markerTypes.map(function (markerType) {
          return _this.parseMarkerType(markerType);
        });
      }
    }, {
      key: 'parseMarkerType',
      value: function parseMarkerType(_ref2) {
        var _ref22 = _slicedToArray(_ref2, 2);

        var tagName = _ref22[0];
        var attributesArray = _ref22[1];

        var attributesObject = (0, _mobiledocKitUtilsArrayUtils.kvArrayToObject)(attributesArray || []);
        return this.builder.createMarkup(tagName, attributesObject);
      }
    }, {
      key: 'parseCardTypes',
      value: function parseCardTypes(cardTypes) {
        var _this2 = this;

        return cardTypes.map(function (cardType) {
          return _this2.parseCardType(cardType);
        });
      }
    }, {
      key: 'parseCardType',
      value: function parseCardType(_ref3) {
        var _ref32 = _slicedToArray(_ref3, 2);

        var cardName = _ref32[0];
        var cardPayload = _ref32[1];

        return [cardName, cardPayload];
      }
    }, {
      key: 'parseAtomTypes',
      value: function parseAtomTypes(atomTypes) {
        var _this3 = this;

        return atomTypes.map(function (atomType) {
          return _this3.parseAtomType(atomType);
        });
      }
    }, {
      key: 'parseAtomType',
      value: function parseAtomType(_ref4) {
        var _ref42 = _slicedToArray(_ref4, 3);

        var atomName = _ref42[0];
        var atomValue = _ref42[1];
        var atomPayload = _ref42[2];

        return [atomName, atomValue, atomPayload];
      }
    }, {
      key: 'parseSections',
      value: function parseSections(sections, post) {
        var _this4 = this;

        sections.forEach(function (section) {
          return _this4.parseSection(section, post);
        });
      }
    }, {
      key: 'parseSection',
      value: function parseSection(section, post) {
        var _section = _slicedToArray(section, 1);

        var type = _section[0];

        switch (type) {
          case _mobiledocKitRenderersMobiledoc03.MOBILEDOC_MARKUP_SECTION_TYPE:
            this.parseMarkupSection(section, post);
            break;
          case _mobiledocKitRenderersMobiledoc03.MOBILEDOC_IMAGE_SECTION_TYPE:
            this.parseImageSection(section, post);
            break;
          case _mobiledocKitRenderersMobiledoc03.MOBILEDOC_CARD_SECTION_TYPE:
            this.parseCardSection(section, post);
            break;
          case _mobiledocKitRenderersMobiledoc03.MOBILEDOC_LIST_SECTION_TYPE:
            this.parseListSection(section, post);
            break;
          default:
            (0, _mobiledocKitUtilsAssert['default'])('Unexpected section type ${type}', false);
        }
      }
    }, {
      key: 'getAtomTypeFromIndex',
      value: function getAtomTypeFromIndex(index) {
        var atomType = this.atomTypes[index];
        (0, _mobiledocKitUtilsAssert['default'])('No atom definition found at index ' + index, !!atomType);
        return atomType;
      }
    }, {
      key: 'getCardTypeFromIndex',
      value: function getCardTypeFromIndex(index) {
        var cardType = this.cardTypes[index];
        (0, _mobiledocKitUtilsAssert['default'])('No card definition found at index ' + index, !!cardType);
        return cardType;
      }
    }, {
      key: 'parseCardSection',
      value: function parseCardSection(_ref5, post) {
        var _ref52 = _slicedToArray(_ref5, 2);

        var type = _ref52[0];
        var cardIndex = _ref52[1];

        var _getCardTypeFromIndex = this.getCardTypeFromIndex(cardIndex);

        var _getCardTypeFromIndex2 = _slicedToArray(_getCardTypeFromIndex, 2);

        var name = _getCardTypeFromIndex2[0];
        var payload = _getCardTypeFromIndex2[1];

        var section = this.builder.createCardSection(name, payload);
        post.sections.append(section);
      }
    }, {
      key: 'parseImageSection',
      value: function parseImageSection(_ref6, post) {
        var _ref62 = _slicedToArray(_ref6, 2);

        var type = _ref62[0];
        var src = _ref62[1];

        var section = this.builder.createImageSection(src);
        post.sections.append(section);
      }
    }, {
      key: 'parseMarkupSection',
      value: function parseMarkupSection(_ref7, post) {
        var _ref72 = _slicedToArray(_ref7, 3);

        var type = _ref72[0];
        var tagName = _ref72[1];
        var markers = _ref72[2];

        var section = this.builder.createMarkupSection(tagName);
        post.sections.append(section);
        this.parseMarkers(markers, section);
        // Strip blank markers after they have been created. This ensures any
        // markup they include has been correctly populated.
        (0, _mobiledocKitUtilsArrayUtils.filter)(section.markers, function (m) {
          return m.isBlank;
        }).forEach(function (m) {
          section.markers.remove(m);
        });
      }
    }, {
      key: 'parseListSection',
      value: function parseListSection(_ref8, post) {
        var _ref82 = _slicedToArray(_ref8, 3);

        var type = _ref82[0];
        var tagName = _ref82[1];
        var items = _ref82[2];

        var section = this.builder.createListSection(tagName);
        post.sections.append(section);
        this.parseListItems(items, section);
      }
    }, {
      key: 'parseListItems',
      value: function parseListItems(items, section) {
        var _this5 = this;

        items.forEach(function (i) {
          return _this5.parseListItem(i, section);
        });
      }
    }, {
      key: 'parseListItem',
      value: function parseListItem(markers, section) {
        var item = this.builder.createListItem();
        this.parseMarkers(markers, item);
        section.items.append(item);
      }
    }, {
      key: 'parseMarkers',
      value: function parseMarkers(markers, parent) {
        var _this6 = this;

        markers.forEach(function (m) {
          return _this6.parseMarker(m, parent);
        });
      }
    }, {
      key: 'parseMarker',
      value: function parseMarker(_ref9, parent) {
        var _this7 = this;

        var _ref92 = _slicedToArray(_ref9, 4);

        var type = _ref92[0];
        var markerTypeIndexes = _ref92[1];
        var closeCount = _ref92[2];
        var value = _ref92[3];

        markerTypeIndexes.forEach(function (index) {
          _this7.markups.push(_this7.markerTypes[index]);
        });

        var marker = this.buildMarkerType(type, value);
        parent.markers.append(marker);

        this.markups = this.markups.slice(0, this.markups.length - closeCount);
      }
    }, {
      key: 'buildMarkerType',
      value: function buildMarkerType(type, value) {
        switch (type) {
          case _mobiledocKitRenderersMobiledoc03.MOBILEDOC_MARKUP_MARKER_TYPE:
            return this.builder.createMarker(value, this.markups.slice());
          case _mobiledocKitRenderersMobiledoc03.MOBILEDOC_ATOM_MARKER_TYPE:
            var _getAtomTypeFromIndex = this.getAtomTypeFromIndex(value),
                _getAtomTypeFromIndex2 = _slicedToArray(_getAtomTypeFromIndex, 3),
                atomName = _getAtomTypeFromIndex2[0],
                atomValue = _getAtomTypeFromIndex2[1],
                atomPayload = _getAtomTypeFromIndex2[2];

            return this.builder.createAtom(atomName, atomValue, atomPayload, this.markups.slice());
          default:
            (0, _mobiledocKitUtilsAssert['default'])('Unexpected marker type ' + type, false);
        }
      }
    }]);

    return MobiledocParser;
  })();

  exports['default'] = MobiledocParser;
});
define('mobiledoc-kit/parsers/mobiledoc', ['exports', 'mobiledoc-kit/parsers/mobiledoc/0-2', 'mobiledoc-kit/parsers/mobiledoc/0-3', 'mobiledoc-kit/renderers/mobiledoc/0-2', 'mobiledoc-kit/renderers/mobiledoc/0-3', 'mobiledoc-kit/utils/assert'], function (exports, _mobiledocKitParsersMobiledoc02, _mobiledocKitParsersMobiledoc03, _mobiledocKitRenderersMobiledoc02, _mobiledocKitRenderersMobiledoc03, _mobiledocKitUtilsAssert) {
  'use strict';

  function parseVersion(mobiledoc) {
    return mobiledoc.version;
  }

  exports['default'] = {
    parse: function parse(builder, mobiledoc) {
      var version = parseVersion(mobiledoc);
      switch (version) {
        case _mobiledocKitRenderersMobiledoc02.MOBILEDOC_VERSION:
          return new _mobiledocKitParsersMobiledoc02['default'](builder).parse(mobiledoc);
        case _mobiledocKitRenderersMobiledoc03.MOBILEDOC_VERSION:
          return new _mobiledocKitParsersMobiledoc03['default'](builder).parse(mobiledoc);
        default:
          (0, _mobiledocKitUtilsAssert['default'])('Unknown version of mobiledoc parser requested: ' + version, false);
      }
    }
  };
});
define('mobiledoc-kit/parsers/section', ['exports', 'mobiledoc-kit/models/markup-section', 'mobiledoc-kit/models/list-section', 'mobiledoc-kit/models/list-item', 'mobiledoc-kit/models/types', 'mobiledoc-kit/models/markup', 'mobiledoc-kit/utils/dom-utils', 'mobiledoc-kit/utils/array-utils', 'mobiledoc-kit/parsers/dom', 'mobiledoc-kit/utils/assert'], function (exports, _mobiledocKitModelsMarkupSection, _mobiledocKitModelsListSection, _mobiledocKitModelsListItem, _mobiledocKitModelsTypes, _mobiledocKitModelsMarkup, _mobiledocKitUtilsDomUtils, _mobiledocKitUtilsArrayUtils, _mobiledocKitParsersDom, _mobiledocKitUtilsAssert) {
  'use strict';

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  var SKIPPABLE_ELEMENT_TAG_NAMES = ['style', 'head', 'title', 'meta'].map(_mobiledocKitUtilsDomUtils.normalizeTagName);

  /**
   * parses an element into a section, ignoring any non-markup
   * elements contained within
   * @return {Array} sections
   */

  var SectionParser = (function () {
    function SectionParser(builder) {
      var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      _classCallCheck(this, SectionParser);

      this.builder = builder;
      this.plugins = options.plugins || [];
    }

    _createClass(SectionParser, [{
      key: 'parse',
      value: function parse(element) {
        var _this = this;

        if (this._isSkippable(element)) {
          return [];
        }
        this.sections = [];
        this.state = {};

        this._updateStateFromElement(element);

        var childNodes = (0, _mobiledocKitUtilsDomUtils.isTextNode)(element) ? [element] : element.childNodes;

        if (this.state.section.isListSection) {
          this.parseListItems(childNodes);
        } else {
          (0, _mobiledocKitUtilsArrayUtils.forEach)(childNodes, function (el) {
            _this.parseNode(el);
          });
        }

        this._closeCurrentSection();

        return this.sections;
      }
    }, {
      key: 'parseListItems',
      value: function parseListItems(childNodes) {
        var _this2 = this;

        var state = this.state;

        (0, _mobiledocKitUtilsArrayUtils.forEach)(childNodes, function (el) {
          var parsed = new _this2.constructor(_this2.builder).parse(el);
          var li = parsed[0];
          if (li && li.isListItem) {
            state.section.items.append(li);
          }
        });
      }
    }, {
      key: 'runPlugins',
      value: function runPlugins(node) {
        var _this3 = this;

        var isNodeFinished = false;
        var env = {
          addSection: function addSection(section) {
            _this3._closeCurrentSection();
            _this3.sections.push(section);
          },
          addMarkerable: function addMarkerable(marker) {
            var state = _this3.state;
            var section = state.section;

            (0, _mobiledocKitUtilsAssert['default'])('Markerables can only be appended to markup sections and list item sections', section && section.isMarkerable);
            if (state.text) {
              _this3._createMarker();
            }
            section.markers.append(marker);
          },
          nodeFinished: function nodeFinished() {
            isNodeFinished = true;
          }
        };
        for (var i = 0; i < this.plugins.length; i++) {
          var plugin = this.plugins[i];
          plugin(node, this.builder, env);
          if (isNodeFinished) {
            return true;
          }
        }
        return false;
      }
    }, {
      key: 'parseNode',
      value: function parseNode(node) {
        if (!this.state.section) {
          this._updateStateFromElement(node);
        }

        var nodeFinished = this.runPlugins(node);
        if (nodeFinished) {
          return;
        }

        switch (node.nodeType) {
          case _mobiledocKitUtilsDomUtils.NODE_TYPES.TEXT:
            this.parseTextNode(node);
            break;
          case _mobiledocKitUtilsDomUtils.NODE_TYPES.ELEMENT:
            this.parseElementNode(node);
            break;
        }
      }
    }, {
      key: 'parseElementNode',
      value: function parseElementNode(element) {
        var _state$markups,
            _this4 = this;

        var state = this.state;

        var markups = this._markupsFromElement(element);
        if (markups.length && state.text.length) {
          this._createMarker();
        }
        (_state$markups = state.markups).push.apply(_state$markups, _toConsumableArray(markups));

        (0, _mobiledocKitUtilsArrayUtils.forEach)(element.childNodes, function (node) {
          _this4.parseNode(node);
        });

        if (markups.length && state.text.length) {
          // create the marker started for this node
          this._createMarker();
        }

        // pop the current markups from the stack
        state.markups.splice(-markups.length, markups.length);
      }
    }, {
      key: 'parseTextNode',
      value: function parseTextNode(textNode) {
        var state = this.state;

        state.text += textNode.textContent;
      }
    }, {
      key: '_updateStateFromElement',
      value: function _updateStateFromElement(element) {
        var state = this.state;

        state.section = this._createSectionFromElement(element);
        state.markups = this._markupsFromElement(element);
        state.text = '';
      }
    }, {
      key: '_closeCurrentSection',
      value: function _closeCurrentSection() {
        var sections = this.sections;
        var state = this.state;

        if (!state.section) {
          return;
        }

        // close a trailing text node if it exists
        if (state.text.length) {
          this._createMarker();
        }

        sections.push(state.section);
        state.section = null;
      }
    }, {
      key: '_markupsFromElement',
      value: function _markupsFromElement(element) {
        var builder = this.builder;

        var markups = [];
        if ((0, _mobiledocKitUtilsDomUtils.isTextNode)(element)) {
          return markups;
        }

        var tagName = (0, _mobiledocKitUtilsDomUtils.normalizeTagName)(element.tagName);
        if (this._isValidMarkupForElement(tagName, element)) {
          markups.push(builder.createMarkup(tagName, (0, _mobiledocKitUtilsDomUtils.getAttributes)(element)));
        }

        this._markupsFromElementStyle(element).forEach(function (markup) {
          return markups.push(markup);
        });

        return markups;
      }
    }, {
      key: '_isValidMarkupForElement',
      value: function _isValidMarkupForElement(tagName, element) {
        if (_mobiledocKitModelsMarkup.VALID_MARKUP_TAGNAMES.indexOf(tagName) === -1) {
          return false;
        } else if (tagName === 'b') {
          // google docs add a <b style="font-weight: normal;"> that should not
          // create a "b" markup
          return element.style.fontWeight !== 'normal';
        }
        return true;
      }
    }, {
      key: '_markupsFromElementStyle',
      value: function _markupsFromElementStyle(element) {
        var builder = this.builder;

        var markups = [];
        var _element$style = element.style;
        var fontStyle = _element$style.fontStyle;
        var fontWeight = _element$style.fontWeight;

        if (fontStyle === 'italic') {
          markups.push(builder.createMarkup('em'));
        }
        if (fontWeight === 'bold' || fontWeight === '700') {
          markups.push(builder.createMarkup('strong'));
        }
        return markups;
      }
    }, {
      key: '_createMarker',
      value: function _createMarker() {
        var state = this.state;

        var text = (0, _mobiledocKitParsersDom.transformHTMLText)(state.text);
        var marker = this.builder.createMarker(text, state.markups);
        state.section.markers.append(marker);
        state.text = '';
      }
    }, {
      key: '_getSectionDetails',
      value: function _getSectionDetails(element) {
        var sectionType = undefined,
            tagName = undefined,
            inferredTagName = false;
        if ((0, _mobiledocKitUtilsDomUtils.isTextNode)(element)) {
          tagName = _mobiledocKitModelsMarkupSection.DEFAULT_TAG_NAME;
          sectionType = _mobiledocKitModelsTypes.MARKUP_SECTION_TYPE;
          inferredTagName = true;
        } else {
          tagName = (0, _mobiledocKitUtilsDomUtils.normalizeTagName)(element.tagName);

          if ((0, _mobiledocKitUtilsArrayUtils.contains)(_mobiledocKitModelsListSection.VALID_LIST_SECTION_TAGNAMES, tagName)) {
            sectionType = _mobiledocKitModelsTypes.LIST_SECTION_TYPE;
          } else if ((0, _mobiledocKitUtilsArrayUtils.contains)(_mobiledocKitModelsListItem.VALID_LIST_ITEM_TAGNAMES, tagName)) {
            sectionType = _mobiledocKitModelsTypes.LIST_ITEM_TYPE;
          } else if ((0, _mobiledocKitUtilsArrayUtils.contains)(_mobiledocKitModelsMarkupSection.VALID_MARKUP_SECTION_TAGNAMES, tagName)) {
            sectionType = _mobiledocKitModelsTypes.MARKUP_SECTION_TYPE;
          } else {
            sectionType = _mobiledocKitModelsTypes.MARKUP_SECTION_TYPE;
            tagName = _mobiledocKitModelsMarkupSection.DEFAULT_TAG_NAME;
            inferredTagName = true;
          }
        }

        return { sectionType: sectionType, tagName: tagName, inferredTagName: inferredTagName };
      }
    }, {
      key: '_createSectionFromElement',
      value: function _createSectionFromElement(element) {
        var builder = this.builder;

        var section = undefined;

        var _getSectionDetails2 = this._getSectionDetails(element);

        var tagName = _getSectionDetails2.tagName;
        var sectionType = _getSectionDetails2.sectionType;
        var inferredTagName = _getSectionDetails2.inferredTagName;

        switch (sectionType) {
          case _mobiledocKitModelsTypes.LIST_SECTION_TYPE:
            section = builder.createListSection(tagName);
            break;
          case _mobiledocKitModelsTypes.LIST_ITEM_TYPE:
            section = builder.createListItem();
            break;
          case _mobiledocKitModelsTypes.MARKUP_SECTION_TYPE:
            section = builder.createMarkupSection(tagName);
            section._inferredTagName = inferredTagName;
            break;
          default:
            (0, _mobiledocKitUtilsAssert['default'])('Cannot parse section from element', false);
        }

        return section;
      }
    }, {
      key: '_isSkippable',
      value: function _isSkippable(element) {
        return (0, _mobiledocKitUtilsDomUtils.isCommentNode)(element) || element.nodeType === _mobiledocKitUtilsDomUtils.NODE_TYPES.ELEMENT && (0, _mobiledocKitUtilsArrayUtils.contains)(SKIPPABLE_ELEMENT_TAG_NAMES, (0, _mobiledocKitUtilsDomUtils.normalizeTagName)(element.tagName));
      }
    }]);

    return SectionParser;
  })();

  exports['default'] = SectionParser;
});
define('mobiledoc-kit/parsers/text', ['exports', 'mobiledoc-kit/utils/assert', 'mobiledoc-kit/models/types', 'mobiledoc-kit/models/markup-section'], function (exports, _mobiledocKitUtilsAssert, _mobiledocKitModelsTypes, _mobiledocKitModelsMarkupSection) {
  'use strict';

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  var UL_LI_REGEX = /^\* (.*)$/;
  var OL_LI_REGEX = /^\d\.? (.*)$/;
  var CR = '\r';
  var LF = '\n';
  var CR_REGEX = new RegExp(CR, 'g');
  var CR_LF_REGEX = new RegExp(CR + LF, 'g');

  var SECTION_BREAK = LF;

  exports.SECTION_BREAK = SECTION_BREAK;
  function normalizeLindEndings(text) {
    return text.replace(CR_LF_REGEX, LF).replace(CR_REGEX, LF);
  }

  var TextParser = (function () {
    function TextParser(builder, options) {
      _classCallCheck(this, TextParser);

      this.builder = builder;
      this.options = options;

      this.post = this.builder.createPost();
      this.prevSection = null;
    }

    /**
     * @param {String} text to parse
     * @return {Post} a post abstract
     */

    _createClass(TextParser, [{
      key: 'parse',
      value: function parse(text) {
        var _this = this;

        text = normalizeLindEndings(text);
        text.split(SECTION_BREAK).forEach(function (text) {
          var section = _this._parseSection(text);
          _this._appendSection(section);
        });

        return this.post;
      }
    }, {
      key: '_parseSection',
      value: function _parseSection(text) {
        var tagName = _mobiledocKitModelsMarkupSection.DEFAULT_TAG_NAME,
            type = _mobiledocKitModelsTypes.MARKUP_SECTION_TYPE,
            section = undefined;

        if (UL_LI_REGEX.test(text)) {
          tagName = 'ul';
          type = _mobiledocKitModelsTypes.LIST_SECTION_TYPE;
          text = text.match(UL_LI_REGEX)[1];
        } else if (OL_LI_REGEX.test(text)) {
          tagName = 'ol';
          type = _mobiledocKitModelsTypes.LIST_SECTION_TYPE;
          text = text.match(OL_LI_REGEX)[1];
        }

        var markers = [this.builder.createMarker(text)];

        switch (type) {
          case _mobiledocKitModelsTypes.LIST_SECTION_TYPE:
            var item = this.builder.createListItem(markers);
            var list = this.builder.createListSection(tagName, [item]);
            section = list;
            break;
          case _mobiledocKitModelsTypes.MARKUP_SECTION_TYPE:
            section = this.builder.createMarkupSection(tagName, markers);
            break;
          default:
            (0, _mobiledocKitUtilsAssert['default'])('Unknown type encountered ' + type, false);
        }

        return section;
      }
    }, {
      key: '_appendSection',
      value: function _appendSection(section) {
        var _this2 = this;

        var isSameListSection = section.isListSection && this.prevSection && this.prevSection.isListSection && this.prevSection.tagName === section.tagName;

        if (isSameListSection) {
          section.items.forEach(function (item) {
            _this2.prevSection.items.append(item.clone());
          });
        } else {
          this.post.sections.insertAfter(section, this.prevSection);
          this.prevSection = section;
        }
      }
    }]);

    return TextParser;
  })();

  exports['default'] = TextParser;
});
define('mobiledoc-kit/renderers/editor-dom', ['exports', 'mobiledoc-kit/models/card-node', 'mobiledoc-kit/utils/array-utils', 'mobiledoc-kit/models/atom-node', 'mobiledoc-kit/models/types', 'mobiledoc-kit/utils/string-utils', 'mobiledoc-kit/utils/dom-utils', 'mobiledoc-kit/models/markup-section', 'mobiledoc-kit/utils/assert', 'mobiledoc-kit/utils/characters'], function (exports, _mobiledocKitModelsCardNode, _mobiledocKitUtilsArrayUtils, _mobiledocKitModelsAtomNode, _mobiledocKitModelsTypes, _mobiledocKitUtilsStringUtils, _mobiledocKitUtilsDomUtils, _mobiledocKitModelsMarkupSection, _mobiledocKitUtilsAssert, _mobiledocKitUtilsCharacters) {
  'use strict';

  var _destroyHooks;

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  var CARD_ELEMENT_CLASS_NAME = '__mobiledoc-card';
  exports.CARD_ELEMENT_CLASS_NAME = CARD_ELEMENT_CLASS_NAME;
  var NO_BREAK_SPACE = ' ';
  exports.NO_BREAK_SPACE = NO_BREAK_SPACE;
  var TAB_CHARACTER = ' ';
  exports.TAB_CHARACTER = TAB_CHARACTER;
  var SPACE = ' ';
  exports.SPACE = SPACE;
  var ZWNJ = '‌';
  exports.ZWNJ = ZWNJ;
  var ATOM_CLASS_NAME = '-mobiledoc-kit__atom';

  exports.ATOM_CLASS_NAME = ATOM_CLASS_NAME;
  function createElementFromMarkup(doc, markup) {
    var element = doc.createElement(markup.tagName);
    Object.keys(markup.attributes).forEach(function (k) {
      element.setAttribute(k, markup.attributes[k]);
    });
    return element;
  }

  var TWO_SPACES = '' + SPACE + SPACE;
  var SPACE_AND_NO_BREAK = '' + SPACE + NO_BREAK_SPACE;
  var SPACES_REGEX = new RegExp(TWO_SPACES, 'g');
  var TAB_REGEX = new RegExp(_mobiledocKitUtilsCharacters.TAB, 'g');
  var endsWithSpace = function endsWithSpace(text) {
    return (0, _mobiledocKitUtilsStringUtils.endsWith)(text, SPACE);
  };
  var startsWithSpace = function startsWithSpace(text) {
    return (0, _mobiledocKitUtilsStringUtils.startsWith)(text, SPACE);
  };

  // FIXME: This can be done more efficiently with a single pass
  // building a correct string based on the original.
  function renderHTMLText(marker) {
    var text = marker.value;
    text = text.replace(SPACES_REGEX, SPACE_AND_NO_BREAK).replace(TAB_REGEX, TAB_CHARACTER);

    // If the first marker has a leading space or the last marker has a
    // trailing space, the browser will collapse the space when we position
    // the cursor.
    // See https://github.com/bustlelabs/mobiledoc-kit/issues/68
    //   and https://github.com/bustlelabs/mobiledoc-kit/issues/75
    if (marker.isMarker && endsWithSpace(text) && !marker.next) {
      text = text.substr(0, text.length - 1) + NO_BREAK_SPACE;
    }
    if (marker.isMarker && startsWithSpace(text) && (!marker.prev || marker.prev.isMarker && endsWithSpace(marker.prev.value))) {
      text = NO_BREAK_SPACE + text.substr(1);
    }
    return text;
  }

  // ascends from element upward, returning the last parent node that is not
  // parentElement
  function penultimateParentOf(element, parentElement) {
    while (parentElement && element.parentNode !== parentElement && element.parentNode !== document.body // ensure the while loop stops
    ) {
      element = element.parentNode;
    }
    return element;
  }

  function renderMarkupSection(section) {
    var element = undefined;
    if (_mobiledocKitModelsMarkupSection.MARKUP_SECTION_ELEMENT_NAMES.indexOf(section.tagName) !== -1) {
      element = document.createElement(section.tagName);
    } else {
      element = document.createElement('div');
      (0, _mobiledocKitUtilsDomUtils.addClassName)(element, section.tagName);
    }

    return element;
  }

  function renderListSection(section) {
    return document.createElement(section.tagName);
  }

  function renderListItem() {
    return document.createElement('li');
  }

  function renderCursorPlaceholder() {
    return document.createElement('br');
  }

  function renderInlineCursorPlaceholder() {
    return document.createTextNode(ZWNJ);
  }

  function renderCard() {
    var wrapper = document.createElement('div');
    var cardElement = document.createElement('div');
    cardElement.contentEditable = false;
    (0, _mobiledocKitUtilsDomUtils.addClassName)(cardElement, CARD_ELEMENT_CLASS_NAME);
    wrapper.appendChild(renderInlineCursorPlaceholder());
    wrapper.appendChild(cardElement);
    wrapper.appendChild(renderInlineCursorPlaceholder());
    return { wrapper: wrapper, cardElement: cardElement };
  }

  /**
   * Wrap the element in all of the opened markups
   * @return {DOMElement} the wrapped element
   */
  function wrapElement(element, openedMarkups) {
    var wrappedElement = element;

    for (var i = openedMarkups.length - 1; i >= 0; i--) {
      var markup = openedMarkups[i];
      var openedElement = createElementFromMarkup(document, markup);
      openedElement.appendChild(wrappedElement);
      wrappedElement = openedElement;
    }

    return wrappedElement;
  }

  // Attach the element to its parent element at the correct position based on the
  // previousRenderNode
  function attachElementToParent(element, parentElement) {
    var previousRenderNode = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];

    if (previousRenderNode) {
      var previousSibling = previousRenderNode.element;
      var previousSiblingPenultimate = penultimateParentOf(previousSibling, parentElement);
      parentElement.insertBefore(element, previousSiblingPenultimate.nextSibling);
    } else {
      parentElement.insertBefore(element, parentElement.firstChild);
    }
  }

  function renderAtom(atom, element, previousRenderNode) {
    var atomElement = document.createElement('span');
    atomElement.contentEditable = false;

    var wrapper = document.createElement('span');
    (0, _mobiledocKitUtilsDomUtils.addClassName)(wrapper, ATOM_CLASS_NAME);
    var headTextNode = renderInlineCursorPlaceholder();
    var tailTextNode = renderInlineCursorPlaceholder();

    wrapper.appendChild(headTextNode);
    wrapper.appendChild(atomElement);
    wrapper.appendChild(tailTextNode);

    var wrappedElement = wrapElement(wrapper, atom.openedMarkups);
    attachElementToParent(wrappedElement, element, previousRenderNode);

    return {
      markupElement: wrappedElement,
      wrapper: wrapper,
      atomElement: atomElement,
      headTextNode: headTextNode,
      tailTextNode: tailTextNode
    };
  }

  function getNextMarkerElement(renderNode) {
    var element = renderNode.element.parentNode;
    var marker = renderNode.postNode;
    var closedCount = marker.closedMarkups.length;

    while (closedCount--) {
      element = element.parentNode;
    }
    return element;
  }

  /**
   * Render the marker
   * @param {Marker} marker the marker to render
   * @param {DOMNode} element the element to attach the rendered marker to
   * @param {RenderNode} [previousRenderNode] The render node before this one, which
   *        affects the determination of where to insert this rendered marker.
   * @return {element, markupElement} The element (textNode) that has the text for
   *         this marker, and the outermost rendered element. If the marker has no
   *         markups, element and markupElement will be the same textNode
   */
  function renderMarker(marker, parentElement, previousRenderNode) {
    var text = renderHTMLText(marker);

    var element = document.createTextNode(text);
    var markupElement = wrapElement(element, marker.openedMarkups);
    attachElementToParent(markupElement, parentElement, previousRenderNode);

    return { element: element, markupElement: markupElement };
  }

  // Attach the render node's element to the DOM,
  // replacing the originalElement if it exists
  function attachRenderNodeElementToDOM(renderNode) {
    var originalElement = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

    var element = renderNode.element;
    var hasRendered = !!originalElement;

    if (hasRendered) {
      var parentElement = renderNode.parent.element;
      parentElement.replaceChild(element, originalElement);
    } else {
      var parentElement = undefined,
          nextSiblingElement = undefined;
      if (renderNode.prev) {
        var previousElement = renderNode.prev.element;
        parentElement = previousElement.parentNode;
        nextSiblingElement = previousElement.nextSibling;
      } else {
        parentElement = renderNode.parent.element;
        nextSiblingElement = parentElement.firstChild;
      }
      parentElement.insertBefore(element, nextSiblingElement);
    }
  }

  function removeRenderNodeSectionFromParent(renderNode, section) {
    var parent = renderNode.parent.postNode;
    parent.sections.remove(section);
  }

  function removeRenderNodeElementFromParent(renderNode) {
    if (renderNode.element && renderNode.element.parentNode) {
      renderNode.element.parentNode.removeChild(renderNode.element);
    }
  }

  function validateCards() {
    var cards = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];

    (0, _mobiledocKitUtilsArrayUtils.forEach)(cards, function (card) {
      (0, _mobiledocKitUtilsAssert['default'])('Card "' + card.name + '" must define type "dom", has: "' + card.type + '"', card.type === 'dom');
      (0, _mobiledocKitUtilsAssert['default'])('Card "' + card.name + '" must define `render` method', !!card.render);
    });
    return cards;
  }

  function validateAtoms() {
    var atoms = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];

    (0, _mobiledocKitUtilsArrayUtils.forEach)(atoms, function (atom) {
      (0, _mobiledocKitUtilsAssert['default'])('Atom "' + atom.name + '" must define type "dom", has: "' + atom.type + '"', atom.type === 'dom');
      (0, _mobiledocKitUtilsAssert['default'])('Atom "' + atom.name + '" must define `render` method', !!atom.render);
    });
    return atoms;
  }

  var Visitor = (function () {
    function Visitor(editor, cards, atoms, unknownCardHandler, unknownAtomHandler, options) {
      _classCallCheck(this, Visitor);

      this.editor = editor;
      this.cards = validateCards(cards);
      this.atoms = validateAtoms(atoms);
      this.unknownCardHandler = unknownCardHandler;
      this.unknownAtomHandler = unknownAtomHandler;
      this.options = options;
    }

    _createClass(Visitor, [{
      key: '_findCard',
      value: function _findCard(cardName) {
        var card = (0, _mobiledocKitUtilsArrayUtils.detect)(this.cards, function (card) {
          return card.name === cardName;
        });
        return card || this._createUnknownCard(cardName);
      }
    }, {
      key: '_createUnknownCard',
      value: function _createUnknownCard(cardName) {
        (0, _mobiledocKitUtilsAssert['default'])('Unknown card "' + cardName + '" found, but no unknownCardHandler is defined', !!this.unknownCardHandler);

        return {
          name: cardName,
          type: 'dom',
          render: this.unknownCardHandler,
          edit: this.unknownCardHandler
        };
      }
    }, {
      key: '_findAtom',
      value: function _findAtom(atomName) {
        var atom = (0, _mobiledocKitUtilsArrayUtils.detect)(this.atoms, function (atom) {
          return atom.name === atomName;
        });
        return atom || this._createUnknownAtom(atomName);
      }
    }, {
      key: '_createUnknownAtom',
      value: function _createUnknownAtom(atomName) {
        (0, _mobiledocKitUtilsAssert['default'])('Unknown atom "' + atomName + '" found, but no unknownAtomHandler is defined', !!this.unknownAtomHandler);

        return {
          name: atomName,
          type: 'dom',
          render: this.unknownAtomHandler
        };
      }
    }, {
      key: _mobiledocKitModelsTypes.POST_TYPE,
      value: function value(renderNode, post, visit) {
        if (!renderNode.element) {
          renderNode.element = document.createElement('div');
        }
        visit(renderNode, post.sections);
      }
    }, {
      key: _mobiledocKitModelsTypes.MARKUP_SECTION_TYPE,
      value: function value(renderNode, section, visit) {
        var originalElement = renderNode.element;

        // Always rerender the section -- its tag name or attributes may have changed.
        // TODO make this smarter, only rerendering and replacing the element when necessary
        renderNode.element = renderMarkupSection(section);
        attachRenderNodeElementToDOM(renderNode, originalElement);

        if (section.isBlank) {
          renderNode.element.appendChild(renderCursorPlaceholder());
        } else {
          var visitAll = true;
          visit(renderNode, section.markers, visitAll);
        }
      }
    }, {
      key: _mobiledocKitModelsTypes.LIST_SECTION_TYPE,
      value: function value(renderNode, section, visit) {
        var originalElement = renderNode.element;

        renderNode.element = renderListSection(section);
        attachRenderNodeElementToDOM(renderNode, originalElement);

        var visitAll = true;
        visit(renderNode, section.items, visitAll);
      }
    }, {
      key: _mobiledocKitModelsTypes.LIST_ITEM_TYPE,
      value: function value(renderNode, item, visit) {
        // FIXME do we need to do anything special for rerenders?
        renderNode.element = renderListItem();
        attachRenderNodeElementToDOM(renderNode, null);

        if (item.isBlank) {
          renderNode.element.appendChild(renderCursorPlaceholder());
        } else {
          var visitAll = true;
          visit(renderNode, item.markers, visitAll);
        }
      }
    }, {
      key: _mobiledocKitModelsTypes.MARKER_TYPE,
      value: function value(renderNode, marker) {
        var parentElement = undefined;

        if (renderNode.prev) {
          parentElement = getNextMarkerElement(renderNode.prev);
        } else {
          parentElement = renderNode.parent.element;
        }

        var _renderMarker = renderMarker(marker, parentElement, renderNode.prev);

        var element = _renderMarker.element;
        var markupElement = _renderMarker.markupElement;

        renderNode.element = element;
        renderNode.markupElement = markupElement;
      }
    }, {
      key: _mobiledocKitModelsTypes.IMAGE_SECTION_TYPE,
      value: function value(renderNode, section) {
        if (renderNode.element) {
          if (renderNode.element.src !== section.src) {
            renderNode.element.src = section.src;
          }
        } else {
          var element = document.createElement('img');
          element.src = section.src;
          if (renderNode.prev) {
            var previousElement = renderNode.prev.element;
            var nextElement = previousElement.nextSibling;
            if (nextElement) {
              nextElement.parentNode.insertBefore(element, nextElement);
            }
          }
          if (!element.parentNode) {
            renderNode.parent.element.appendChild(element);
          }
          renderNode.element = element;
        }
      }
    }, {
      key: _mobiledocKitModelsTypes.CARD_TYPE,
      value: function value(renderNode, section) {
        var originalElement = renderNode.element;
        var editor = this.editor;
        var options = this.options;

        var card = this._findCard(section.name);

        var _renderCard = renderCard();

        var wrapper = _renderCard.wrapper;
        var cardElement = _renderCard.cardElement;

        renderNode.element = wrapper;
        attachRenderNodeElementToDOM(renderNode, originalElement);

        var cardNode = new _mobiledocKitModelsCardNode['default'](editor, card, section, cardElement, options);
        renderNode.cardNode = cardNode;

        var initialMode = section._initialMode;
        cardNode[initialMode]();
      }
    }, {
      key: _mobiledocKitModelsTypes.ATOM_TYPE,
      value: function value(renderNode, atomModel) {
        var parentElement = undefined;

        if (renderNode.prev) {
          parentElement = getNextMarkerElement(renderNode.prev);
        } else {
          parentElement = renderNode.parent.element;
        }

        var editor = this.editor;
        var options = this.options;

        var _renderAtom = renderAtom(atomModel, parentElement, renderNode.prev);

        var wrapper = _renderAtom.wrapper;
        var markupElement = _renderAtom.markupElement;
        var atomElement = _renderAtom.atomElement;
        var headTextNode = _renderAtom.headTextNode;
        var tailTextNode = _renderAtom.tailTextNode;

        var atom = this._findAtom(atomModel.name);

        var atomNode = new _mobiledocKitModelsAtomNode['default'](editor, atom, atomModel, atomElement, options);

        atomNode.render();

        renderNode.atomNode = atomNode;
        renderNode.element = wrapper;
        renderNode.headTextNode = headTextNode;
        renderNode.tailTextNode = tailTextNode;
        renderNode.markupElement = markupElement;
      }
    }]);

    return Visitor;
  })();

  var destroyHooks = (_destroyHooks = {}, _defineProperty(_destroyHooks, _mobiledocKitModelsTypes.POST_TYPE, function () /*renderNode, post*/{
    (0, _mobiledocKitUtilsAssert['default'])('post destruction is not supported by the renderer', false);
  }), _defineProperty(_destroyHooks, _mobiledocKitModelsTypes.MARKUP_SECTION_TYPE, function (renderNode, section) {
    removeRenderNodeSectionFromParent(renderNode, section);
    removeRenderNodeElementFromParent(renderNode);
  }), _defineProperty(_destroyHooks, _mobiledocKitModelsTypes.LIST_SECTION_TYPE, function (renderNode, section) {
    removeRenderNodeSectionFromParent(renderNode, section);
    removeRenderNodeElementFromParent(renderNode);
  }), _defineProperty(_destroyHooks, _mobiledocKitModelsTypes.LIST_ITEM_TYPE, function (renderNode, li) {
    removeRenderNodeSectionFromParent(renderNode, li);
    removeRenderNodeElementFromParent(renderNode);
  }), _defineProperty(_destroyHooks, _mobiledocKitModelsTypes.MARKER_TYPE, function (renderNode, marker) {
    // FIXME before we render marker, should delete previous renderNode's element
    // and up until the next marker element

    var markupElement = renderNode.markupElement;

    if (marker.section) {
      marker.section.markers.remove(marker);
    }

    if (markupElement.parentNode) {
      // if no parentNode, the browser already removed this element
      markupElement.parentNode.removeChild(markupElement);
    }
  }), _defineProperty(_destroyHooks, _mobiledocKitModelsTypes.IMAGE_SECTION_TYPE, function (renderNode, section) {
    removeRenderNodeSectionFromParent(renderNode, section);
    removeRenderNodeElementFromParent(renderNode);
  }), _defineProperty(_destroyHooks, _mobiledocKitModelsTypes.CARD_TYPE, function (renderNode, section) {
    if (renderNode.cardNode) {
      renderNode.cardNode.teardown();
    }
    removeRenderNodeSectionFromParent(renderNode, section);
    removeRenderNodeElementFromParent(renderNode);
  }), _defineProperty(_destroyHooks, _mobiledocKitModelsTypes.ATOM_TYPE, function (renderNode, atom) {
    if (renderNode.atomNode) {
      renderNode.atomNode.teardown();
    }

    // an atom is a kind of marker so just call its destroy hook vs copying here
    destroyHooks[_mobiledocKitModelsTypes.MARKER_TYPE](renderNode, atom);
  }), _destroyHooks);

  // removes children from parentNode (a RenderNode) that are scheduled for removal
  function removeDestroyedChildren(parentNode) {
    var forceRemoval = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

    var child = parentNode.childNodes.head;
    var nextChild = undefined,
        method = undefined;
    while (child) {
      nextChild = child.next;
      if (child.isRemoved || forceRemoval) {
        removeDestroyedChildren(child, true);
        method = child.postNode.type;
        (0, _mobiledocKitUtilsAssert['default'])('editor-dom cannot destroy "' + method + '"', !!destroyHooks[method]);
        destroyHooks[method](child, child.postNode);
        parentNode.childNodes.remove(child);
      }
      child = nextChild;
    }
  }

  // Find an existing render node for the given postNode, or
  // create one, insert it into the tree, and return it
  function lookupNode(renderTree, parentNode, postNode, previousNode) {
    if (postNode.renderNode) {
      return postNode.renderNode;
    } else {
      var renderNode = renderTree.buildRenderNode(postNode);
      parentNode.childNodes.insertAfter(renderNode, previousNode);
      return renderNode;
    }
  }

  var Renderer = (function () {
    function Renderer(editor, cards, atoms, unknownCardHandler, unknownAtomHandler, options) {
      _classCallCheck(this, Renderer);

      this.editor = editor;
      this.visitor = new Visitor(editor, cards, atoms, unknownCardHandler, unknownAtomHandler, options);
      this.nodes = [];
      this.hasRendered = false;
    }

    _createClass(Renderer, [{
      key: 'destroy',
      value: function destroy() {
        if (!this.hasRendered) {
          return;
        }
        var renderNode = this.renderTree.rootNode;
        var force = true;
        removeDestroyedChildren(renderNode, force);
      }
    }, {
      key: 'visit',
      value: function visit(renderTree, parentNode, postNodes) {
        var _this = this;

        var visitAll = arguments.length <= 3 || arguments[3] === undefined ? false : arguments[3];

        var previousNode = undefined;
        postNodes.forEach(function (postNode) {
          var node = lookupNode(renderTree, parentNode, postNode, previousNode);
          if (node.isDirty || visitAll) {
            _this.nodes.push(node);
          }
          previousNode = node;
        });
      }
    }, {
      key: 'render',
      value: function render(renderTree) {
        var _this2 = this;

        this.hasRendered = true;
        this.renderTree = renderTree;
        var renderNode = renderTree.rootNode;
        var method = undefined,
            postNode = undefined;

        while (renderNode) {
          removeDestroyedChildren(renderNode);
          postNode = renderNode.postNode;

          method = postNode.type;
          (0, _mobiledocKitUtilsAssert['default'])('EditorDom visitor cannot handle type ' + method, !!this.visitor[method]);
          // jshint -W083
          this.visitor[method](renderNode, postNode, function () {
            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
              args[_key] = arguments[_key];
            }

            return _this2.visit.apply(_this2, [renderTree].concat(args));
          });
          // jshint +W083
          renderNode.markClean();
          renderNode = this.nodes.shift();
        }
      }
    }]);

    return Renderer;
  })();

  exports['default'] = Renderer;
});
define('mobiledoc-kit/renderers/mobiledoc/0-2', ['exports', 'mobiledoc-kit/utils/compiler', 'mobiledoc-kit/utils/array-utils', 'mobiledoc-kit/models/types'], function (exports, _mobiledocKitUtilsCompiler, _mobiledocKitUtilsArrayUtils, _mobiledocKitModelsTypes) {
  'use strict';

  var _visitor;

  function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  var MOBILEDOC_VERSION = '0.2.0';
  exports.MOBILEDOC_VERSION = MOBILEDOC_VERSION;
  var MOBILEDOC_MARKUP_SECTION_TYPE = 1;
  exports.MOBILEDOC_MARKUP_SECTION_TYPE = MOBILEDOC_MARKUP_SECTION_TYPE;
  var MOBILEDOC_IMAGE_SECTION_TYPE = 2;
  exports.MOBILEDOC_IMAGE_SECTION_TYPE = MOBILEDOC_IMAGE_SECTION_TYPE;
  var MOBILEDOC_LIST_SECTION_TYPE = 3;
  exports.MOBILEDOC_LIST_SECTION_TYPE = MOBILEDOC_LIST_SECTION_TYPE;
  var MOBILEDOC_CARD_SECTION_TYPE = 10;

  exports.MOBILEDOC_CARD_SECTION_TYPE = MOBILEDOC_CARD_SECTION_TYPE;
  var visitor = (_visitor = {}, _defineProperty(_visitor, _mobiledocKitModelsTypes.POST_TYPE, function (node, opcodes) {
    opcodes.push(['openPost']);
    (0, _mobiledocKitUtilsCompiler.visitArray)(visitor, node.sections, opcodes);
  }), _defineProperty(_visitor, _mobiledocKitModelsTypes.MARKUP_SECTION_TYPE, function (node, opcodes) {
    opcodes.push(['openMarkupSection', node.tagName]);
    (0, _mobiledocKitUtilsCompiler.visitArray)(visitor, node.markers, opcodes);
  }), _defineProperty(_visitor, _mobiledocKitModelsTypes.LIST_SECTION_TYPE, function (node, opcodes) {
    opcodes.push(['openListSection', node.tagName]);
    (0, _mobiledocKitUtilsCompiler.visitArray)(visitor, node.items, opcodes);
  }), _defineProperty(_visitor, _mobiledocKitModelsTypes.LIST_ITEM_TYPE, function (node, opcodes) {
    opcodes.push(['openListItem']);
    (0, _mobiledocKitUtilsCompiler.visitArray)(visitor, node.markers, opcodes);
  }), _defineProperty(_visitor, _mobiledocKitModelsTypes.IMAGE_SECTION_TYPE, function (node, opcodes) {
    opcodes.push(['openImageSection', node.src]);
  }), _defineProperty(_visitor, _mobiledocKitModelsTypes.CARD_TYPE, function (node, opcodes) {
    opcodes.push(['openCardSection', node.name, node.payload]);
  }), _defineProperty(_visitor, _mobiledocKitModelsTypes.MARKER_TYPE, function (node, opcodes) {
    opcodes.push(['openMarker', node.closedMarkups.length, node.value]);
    (0, _mobiledocKitUtilsCompiler.visitArray)(visitor, node.openedMarkups, opcodes);
  }), _defineProperty(_visitor, _mobiledocKitModelsTypes.MARKUP_TYPE, function (node, opcodes) {
    opcodes.push(['openMarkup', node.tagName, (0, _mobiledocKitUtilsArrayUtils.objectToSortedKVArray)(node.attributes)]);
  }), _visitor);

  var postOpcodeCompiler = {
    openMarker: function openMarker(closeCount, value) {
      this.markupMarkerIds = [];
      this.markers.push([this.markupMarkerIds, closeCount, value || '']);
    },
    openMarkupSection: function openMarkupSection(tagName) {
      this.markers = [];
      this.sections.push([MOBILEDOC_MARKUP_SECTION_TYPE, tagName, this.markers]);
    },
    openListSection: function openListSection(tagName) {
      this.items = [];
      this.sections.push([MOBILEDOC_LIST_SECTION_TYPE, tagName, this.items]);
    },
    openListItem: function openListItem() {
      this.markers = [];
      this.items.push(this.markers);
    },
    openImageSection: function openImageSection(url) {
      this.sections.push([MOBILEDOC_IMAGE_SECTION_TYPE, url]);
    },
    openCardSection: function openCardSection(name, payload) {
      this.sections.push([MOBILEDOC_CARD_SECTION_TYPE, name, payload]);
    },
    openPost: function openPost() {
      this.markerTypes = [];
      this.sections = [];
      this.result = {
        version: MOBILEDOC_VERSION,
        sections: [this.markerTypes, this.sections]
      };
    },
    openMarkup: function openMarkup(tagName, attributes) {
      var index = this._findOrAddMarkerTypeIndex(tagName, attributes);
      this.markupMarkerIds.push(index);
    },
    _findOrAddMarkerTypeIndex: function _findOrAddMarkerTypeIndex(tagName, attributesArray) {
      if (!this._markerTypeCache) {
        this._markerTypeCache = {};
      }
      var key = tagName + '-' + attributesArray.join('-');

      var index = this._markerTypeCache[key];
      if (index === undefined) {
        var markerType = [tagName];
        if (attributesArray.length) {
          markerType.push(attributesArray);
        }
        this.markerTypes.push(markerType);

        index = this.markerTypes.length - 1;
        this._markerTypeCache[key] = index;
      }

      return index;
    }
  };

  /**
   * Render from post -> mobiledoc
   */
  exports['default'] = {
    /**
     * @method render
     * @param {Post}
     * @return {Mobiledoc}
     */
    render: function render(post) {
      var opcodes = [];
      (0, _mobiledocKitUtilsCompiler.visit)(visitor, post, opcodes);
      var compiler = Object.create(postOpcodeCompiler);
      (0, _mobiledocKitUtilsCompiler.compile)(compiler, opcodes);
      return compiler.result;
    }
  };
});
define('mobiledoc-kit/renderers/mobiledoc/0-3', ['exports', 'mobiledoc-kit/utils/compiler', 'mobiledoc-kit/utils/array-utils', 'mobiledoc-kit/models/types'], function (exports, _mobiledocKitUtilsCompiler, _mobiledocKitUtilsArrayUtils, _mobiledocKitModelsTypes) {
  'use strict';

  var _visitor;

  function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  var MOBILEDOC_VERSION = '0.3.0';
  exports.MOBILEDOC_VERSION = MOBILEDOC_VERSION;
  var MOBILEDOC_MARKUP_SECTION_TYPE = 1;
  exports.MOBILEDOC_MARKUP_SECTION_TYPE = MOBILEDOC_MARKUP_SECTION_TYPE;
  var MOBILEDOC_IMAGE_SECTION_TYPE = 2;
  exports.MOBILEDOC_IMAGE_SECTION_TYPE = MOBILEDOC_IMAGE_SECTION_TYPE;
  var MOBILEDOC_LIST_SECTION_TYPE = 3;
  exports.MOBILEDOC_LIST_SECTION_TYPE = MOBILEDOC_LIST_SECTION_TYPE;
  var MOBILEDOC_CARD_SECTION_TYPE = 10;

  exports.MOBILEDOC_CARD_SECTION_TYPE = MOBILEDOC_CARD_SECTION_TYPE;
  var MOBILEDOC_MARKUP_MARKER_TYPE = 0;
  exports.MOBILEDOC_MARKUP_MARKER_TYPE = MOBILEDOC_MARKUP_MARKER_TYPE;
  var MOBILEDOC_ATOM_MARKER_TYPE = 1;

  exports.MOBILEDOC_ATOM_MARKER_TYPE = MOBILEDOC_ATOM_MARKER_TYPE;
  var visitor = (_visitor = {}, _defineProperty(_visitor, _mobiledocKitModelsTypes.POST_TYPE, function (node, opcodes) {
    opcodes.push(['openPost']);
    (0, _mobiledocKitUtilsCompiler.visitArray)(visitor, node.sections, opcodes);
  }), _defineProperty(_visitor, _mobiledocKitModelsTypes.MARKUP_SECTION_TYPE, function (node, opcodes) {
    opcodes.push(['openMarkupSection', node.tagName]);
    (0, _mobiledocKitUtilsCompiler.visitArray)(visitor, node.markers, opcodes);
  }), _defineProperty(_visitor, _mobiledocKitModelsTypes.LIST_SECTION_TYPE, function (node, opcodes) {
    opcodes.push(['openListSection', node.tagName]);
    (0, _mobiledocKitUtilsCompiler.visitArray)(visitor, node.items, opcodes);
  }), _defineProperty(_visitor, _mobiledocKitModelsTypes.LIST_ITEM_TYPE, function (node, opcodes) {
    opcodes.push(['openListItem']);
    (0, _mobiledocKitUtilsCompiler.visitArray)(visitor, node.markers, opcodes);
  }), _defineProperty(_visitor, _mobiledocKitModelsTypes.IMAGE_SECTION_TYPE, function (node, opcodes) {
    opcodes.push(['openImageSection', node.src]);
  }), _defineProperty(_visitor, _mobiledocKitModelsTypes.CARD_TYPE, function (node, opcodes) {
    opcodes.push(['openCardSection', node.name, node.payload]);
  }), _defineProperty(_visitor, _mobiledocKitModelsTypes.MARKER_TYPE, function (node, opcodes) {
    opcodes.push(['openMarker', node.closedMarkups.length, node.value]);
    (0, _mobiledocKitUtilsCompiler.visitArray)(visitor, node.openedMarkups, opcodes);
  }), _defineProperty(_visitor, _mobiledocKitModelsTypes.MARKUP_TYPE, function (node, opcodes) {
    opcodes.push(['openMarkup', node.tagName, (0, _mobiledocKitUtilsArrayUtils.objectToSortedKVArray)(node.attributes)]);
  }), _defineProperty(_visitor, _mobiledocKitModelsTypes.ATOM_TYPE, function (node, opcodes) {
    opcodes.push(['openAtom', node.closedMarkups.length, node.name, node.value, node.payload]);
    (0, _mobiledocKitUtilsCompiler.visitArray)(visitor, node.openedMarkups, opcodes);
  }), _visitor);

  var postOpcodeCompiler = {
    openMarker: function openMarker(closeCount, value) {
      this.markupMarkerIds = [];
      this.markers.push([MOBILEDOC_MARKUP_MARKER_TYPE, this.markupMarkerIds, closeCount, value || '']);
    },
    openMarkupSection: function openMarkupSection(tagName) {
      this.markers = [];
      this.sections.push([MOBILEDOC_MARKUP_SECTION_TYPE, tagName, this.markers]);
    },
    openListSection: function openListSection(tagName) {
      this.items = [];
      this.sections.push([MOBILEDOC_LIST_SECTION_TYPE, tagName, this.items]);
    },
    openListItem: function openListItem() {
      this.markers = [];
      this.items.push(this.markers);
    },
    openImageSection: function openImageSection(url) {
      this.sections.push([MOBILEDOC_IMAGE_SECTION_TYPE, url]);
    },
    openCardSection: function openCardSection(name, payload) {
      var index = this._addCardTypeIndex(name, payload);
      this.sections.push([MOBILEDOC_CARD_SECTION_TYPE, index]);
    },
    openAtom: function openAtom(closeCount, name, value, payload) {
      var index = this._addAtomTypeIndex(name, value, payload);
      this.markupMarkerIds = [];
      this.markers.push([MOBILEDOC_ATOM_MARKER_TYPE, this.markupMarkerIds, closeCount, index]);
    },
    openPost: function openPost() {
      this.atomTypes = [];
      this.cardTypes = [];
      this.markerTypes = [];
      this.sections = [];
      this.result = {
        version: MOBILEDOC_VERSION,
        atoms: this.atomTypes,
        cards: this.cardTypes,
        markups: this.markerTypes,
        sections: this.sections
      };
    },
    openMarkup: function openMarkup(tagName, attributes) {
      var index = this._findOrAddMarkerTypeIndex(tagName, attributes);
      this.markupMarkerIds.push(index);
    },
    _addCardTypeIndex: function _addCardTypeIndex(cardName, payload) {
      var cardType = [cardName, payload];
      this.cardTypes.push(cardType);
      return this.cardTypes.length - 1;
    },
    _addAtomTypeIndex: function _addAtomTypeIndex(atomName, atomValue, payload) {
      var atomType = [atomName, atomValue, payload];
      this.atomTypes.push(atomType);
      return this.atomTypes.length - 1;
    },
    _findOrAddMarkerTypeIndex: function _findOrAddMarkerTypeIndex(tagName, attributesArray) {
      if (!this._markerTypeCache) {
        this._markerTypeCache = {};
      }
      var key = tagName + '-' + attributesArray.join('-');

      var index = this._markerTypeCache[key];
      if (index === undefined) {
        var markerType = [tagName];
        if (attributesArray.length) {
          markerType.push(attributesArray);
        }
        this.markerTypes.push(markerType);

        index = this.markerTypes.length - 1;
        this._markerTypeCache[key] = index;
      }

      return index;
    }
  };

  /**
   * Render from post -> mobiledoc
   */
  exports['default'] = {
    /**
     * @method render
     * @param {Post}
     * @return {Mobiledoc}
     */
    render: function render(post) {
      var opcodes = [];
      (0, _mobiledocKitUtilsCompiler.visit)(visitor, post, opcodes);
      var compiler = Object.create(postOpcodeCompiler);
      (0, _mobiledocKitUtilsCompiler.compile)(compiler, opcodes);
      return compiler.result;
    }
  };
});
define('mobiledoc-kit/renderers/mobiledoc', ['exports', 'mobiledoc-kit/renderers/mobiledoc/0-2', 'mobiledoc-kit/renderers/mobiledoc/0-3', 'mobiledoc-kit/utils/assert'], function (exports, _mobiledocKitRenderersMobiledoc02, _mobiledocKitRenderersMobiledoc03, _mobiledocKitUtilsAssert) {
  'use strict';

  var MOBILEDOC_VERSION = _mobiledocKitRenderersMobiledoc03.MOBILEDOC_VERSION;

  exports.MOBILEDOC_VERSION = MOBILEDOC_VERSION;
  exports['default'] = {
    render: function render(post, version) {
      switch (version) {
        case _mobiledocKitRenderersMobiledoc02.MOBILEDOC_VERSION:
          return _mobiledocKitRenderersMobiledoc02['default'].render(post);
        case undefined:
        case null:
        case _mobiledocKitRenderersMobiledoc03.MOBILEDOC_VERSION:
          return _mobiledocKitRenderersMobiledoc03['default'].render(post);
        default:
          (0, _mobiledocKitUtilsAssert['default'])('Unknown version of mobiledoc renderer requested: ' + version, false);
      }
    }
  };
});
define("mobiledoc-kit/utils/array-utils", ["exports"], function (exports) {
  "use strict";

  function detect(enumerable, callback) {
    if (enumerable.detect) {
      return enumerable.detect(callback);
    } else {
      for (var i = 0; i < enumerable.length; i++) {
        if (callback(enumerable[i])) {
          return enumerable[i];
        }
      }
    }
  }

  function any(enumerable, callback) {
    if (enumerable.any) {
      return enumerable.any(callback);
    }

    for (var i = 0; i < enumerable.length; i++) {
      if (callback(enumerable[i])) {
        return true;
      }
    }

    return false;
  }

  function every(enumerable, callback) {
    if (enumerable.every) {
      return enumerable.every(callback);
    }

    for (var i = 0; i < enumerable.length; i++) {
      if (!callback(enumerable[i])) {
        return false;
      }
    }
    return true;
  }

  function toArray(arrayLike) {
    return Array.prototype.slice.call(arrayLike);
  }

  /**
   * Useful for array-like things that aren't
   * actually arrays, like NodeList
   */
  function forEach(enumerable, callback) {
    if (enumerable.forEach) {
      enumerable.forEach(callback);
    } else {
      for (var i = 0; i < enumerable.length; i++) {
        callback(enumerable[i], i);
      }
    }
  }

  function filter(enumerable, conditionFn) {
    var filtered = [];
    forEach(enumerable, function (i) {
      if (conditionFn(i)) {
        filtered.push(i);
      }
    });
    return filtered;
  }

  /**
   * @return {Integer} the number of items that are the same, starting from the 0th index, in a and b
   */
  function commonItemLength(listA, listB) {
    var offset = 0;
    while (offset < listA.length && offset < listB.length) {
      if (listA[offset] !== listB[offset]) {
        break;
      }
      offset++;
    }
    return offset;
  }

  // return new array without falsy items like ruby's `compact`
  function compact(enumerable) {
    return filter(enumerable, function (i) {
      return !!i;
    });
  }

  function reduce(enumerable, callback, initialValue) {
    var previousValue = initialValue;
    forEach(enumerable, function (val, index) {
      previousValue = callback(previousValue, val, index);
    });
    return previousValue;
  }

  /**
   * @param {Array} array of key1,value1,key2,value2,...
   * @return {Object} {key1:value1, key2:value2, ...}
   */
  function kvArrayToObject(array) {
    var obj = {};
    for (var i = 0; i < array.length; i += 2) {
      var key = array[i];
      var value = array[i + 1];

      obj[key] = value;
    }
    return obj;
  }

  function objectToSortedKVArray(obj) {
    var keys = Object.keys(obj).sort();
    var result = [];
    keys.forEach(function (k) {
      result.push(k);
      result.push(obj[k]);
    });
    return result;
  }

  // check shallow equality of two non-nested arrays
  function isArrayEqual(arr1, arr2) {
    var l1 = arr1.length,
        l2 = arr2.length;
    if (l1 !== l2) {
      return false;
    }

    for (var i = 0; i < l1; i++) {
      if (arr1[i] !== arr2[i]) {
        return false;
      }
    }
    return true;
  }

  // return an object with only the valid keys
  function filterObject(object) {
    var validKeys = arguments.length <= 1 || arguments[1] === undefined ? [] : arguments[1];

    var result = {};
    forEach(filter(Object.keys(object), function (key) {
      return validKeys.indexOf(key) !== -1;
    }), function (key) {
      return result[key] = object[key];
    });
    return result;
  }

  function contains(array, item) {
    return array.indexOf(item) !== -1;
  }

  exports.detect = detect;
  exports.forEach = forEach;
  exports.any = any;
  exports.every = every;
  exports.filter = filter;
  exports.commonItemLength = commonItemLength;
  exports.compact = compact;
  exports.reduce = reduce;
  exports.objectToSortedKVArray = objectToSortedKVArray;
  exports.kvArrayToObject = kvArrayToObject;
  exports.isArrayEqual = isArrayEqual;
  exports.toArray = toArray;
  exports.filterObject = filterObject;
  exports.contains = contains;
});
define('mobiledoc-kit/utils/assert', ['exports', 'mobiledoc-kit/utils/mobiledoc-error'], function (exports, _mobiledocKitUtilsMobiledocError) {
  'use strict';

  exports['default'] = function (message, conditional) {
    if (!conditional) {
      throw new _mobiledocKitUtilsMobiledocError['default'](message);
    }
  };
});
define("mobiledoc-kit/utils/browser", ["exports"], function (exports) {
  "use strict";

  exports["default"] = {
    isMac: /Mac/.test(navigator.platform)
  };
});
define('mobiledoc-kit/utils/characters', ['exports'], function (exports) {
  'use strict';

  var TAB = '\t';
  exports.TAB = TAB;
  var ENTER = '\n';
  exports.ENTER = ENTER;
  var SPACE = ' ';
  exports.SPACE = SPACE;
});
define('mobiledoc-kit/utils/compiler', ['exports', 'mobiledoc-kit/utils/array-utils', 'mobiledoc-kit/utils/assert'], function (exports, _mobiledocKitUtilsArrayUtils, _mobiledocKitUtilsAssert) {
  'use strict';

  exports.visit = visit;
  exports.compile = compile;
  exports.visitArray = visitArray;

  function _toArray(arr) { return Array.isArray(arr) ? arr : Array.from(arr); }

  function visit(visitor, node, opcodes) {
    var method = node.type;
    (0, _mobiledocKitUtilsAssert['default'])('Cannot visit unknown type ' + method, !!visitor[method]);
    visitor[method](node, opcodes);
  }

  function compile(compiler, opcodes) {
    for (var i = 0, l = opcodes.length; i < l; i++) {
      var _opcodes$i = _toArray(opcodes[i]);

      var method = _opcodes$i[0];

      var params = _opcodes$i.slice(1);

      var _length = params.length;
      if (_length === 0) {
        compiler[method].call(compiler);
      } else if (_length === 1) {
        compiler[method].call(compiler, params[0]);
      } else if (_length === 2) {
        compiler[method].call(compiler, params[0], params[1]);
      } else {
        compiler[method].apply(compiler, params);
      }
    }
  }

  function visitArray(visitor, nodes, opcodes) {
    if (!nodes || nodes.length === 0) {
      return;
    }
    (0, _mobiledocKitUtilsArrayUtils.forEach)(nodes, function (node) {
      visit(visitor, node, opcodes);
    });
  }
});
define("mobiledoc-kit/utils/copy", ["exports"], function (exports) {
  "use strict";

  function shallowCopyObject(object) {
    var copy = {};
    Object.keys(object).forEach(function (key) {
      copy[key] = object[key];
    });
    return copy;
  }

  exports.shallowCopyObject = shallowCopyObject;
});
define('mobiledoc-kit/utils/cursor/position', ['exports', 'mobiledoc-kit/utils/dom-utils', 'mobiledoc-kit/utils/key', 'mobiledoc-kit/utils/assert', 'mobiledoc-kit/models/marker'], function (exports, _mobiledocKitUtilsDomUtils, _mobiledocKitUtilsKey, _mobiledocKitUtilsAssert, _mobiledocKitModelsMarker) {
  'use strict';

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  function findParentSectionFromNode(renderTree, node) {
    var renderNode = renderTree.findRenderNodeFromElement(node, function (renderNode) {
      return renderNode.postNode.isSection;
    });

    return renderNode && renderNode.postNode;
  }

  function findOffsetInMarkerable(markerable, node, offset) {
    var offsetInSection = 0;
    var marker = markerable.markers.head;
    while (marker) {
      var markerNode = marker.renderNode.element;
      if (markerNode === node) {
        return offsetInSection + offset;
      } else if (marker.isAtom) {
        if (marker.renderNode.headTextNode === node) {
          return offsetInSection;
        } else if (marker.renderNode.tailTextNode === node) {
          return offsetInSection + 1;
        }
      }

      offsetInSection += marker.length;
      marker = marker.next;
    }

    return offsetInSection;
  }

  function findOffsetInSection(section, node, offset) {
    if (section.isMarkerable) {
      return findOffsetInMarkerable(section, node, offset);
    } else {
      (0, _mobiledocKitUtilsAssert['default'])('findOffsetInSection must be called with markerable or card section', section.isCardSection);

      var wrapperNode = section.renderNode.element;
      var endTextNode = wrapperNode.lastChild;
      if (node === endTextNode) {
        return 1;
      }
      return 0;
    }
  }

  var Position = (function () {
    function Position(section) {
      var offset = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

      _classCallCheck(this, Position);

      (0, _mobiledocKitUtilsAssert['default'])('Position must have a section that is addressable by the cursor', section && section.isLeafSection);
      (0, _mobiledocKitUtilsAssert['default'])('Position must have numeric offset', offset !== null && offset !== undefined);

      this.section = section;
      this.offset = offset;
      this.isBlank = false;
    }

    _createClass(Position, [{
      key: 'clone',
      value: function clone() {
        return new Position(this.section, this.offset);
      }
    }, {
      key: 'isEqual',
      value: function isEqual(position) {
        return this.section === position.section && this.offset === position.offset;
      }
    }, {
      key: 'isHead',
      value: function isHead() {
        return this.isEqual(this.section.headPosition());
      }
    }, {
      key: 'isTail',
      value: function isTail() {
        return this.isEqual(this.section.tailPosition());
      }

      /**
       * This method returns a new Position instance, it does not modify
       * this instance.
       *
       * @param {Direction} direction to move
       * @return {Position|null} Return the position one unit in the given
       * direction, or null if it is not possible to move that direction
       */
    }, {
      key: 'move',
      value: function move(direction) {
        switch (direction) {
          case _mobiledocKitUtilsKey.DIRECTION.BACKWARD:
            return this.moveLeft();
          case _mobiledocKitUtilsKey.DIRECTION.FORWARD:
            return this.moveRight();
          default:
            (0, _mobiledocKitUtilsAssert['default'])('Must pass a valid direction to Position.move', false);
        }
      }

      /**
       * @return {Position|null}
       */
    }, {
      key: 'moveLeft',
      value: function moveLeft() {
        if (this.isHead()) {
          var prev = this.section.previousLeafSection();
          return prev && prev.tailPosition();
        } else {
          var offset = this.offset - 1;
          if (this.isMarkerable && this.marker) {
            var code = this.marker.value.charCodeAt(offset);
            if (code >= _mobiledocKitModelsMarker.LOW_SURROGATE_RANGE[0] && code <= _mobiledocKitModelsMarker.LOW_SURROGATE_RANGE[1]) {
              offset = offset - 1;
            }
          }
          return new Position(this.section, offset);
        }
      }

      /**
       * @return {Position|null}
       */
    }, {
      key: 'moveRight',
      value: function moveRight() {
        if (this.isTail()) {
          var next = this.section.nextLeafSection();
          return next && next.headPosition();
        } else {
          var offset = this.offset + 1;
          if (this.isMarkerable && this.marker) {
            var code = this.marker.value.charCodeAt(offset - 1);
            if (code >= _mobiledocKitModelsMarker.HIGH_SURROGATE_RANGE[0] && code <= _mobiledocKitModelsMarker.HIGH_SURROGATE_RANGE[1]) {
              offset = offset + 1;
            }
          }
          return new Position(this.section, offset);
        }
      }
    }, {
      key: 'leafSectionIndex',
      get: function get() {
        var _this = this;

        var post = this.section.post;
        var leafSectionIndex = undefined;
        post.walkAllLeafSections(function (section, index) {
          if (section === _this.section) {
            leafSectionIndex = index;
          }
        });
        return leafSectionIndex;
      }
    }, {
      key: 'isMarkerable',
      get: function get() {
        return this.section && this.section.isMarkerable;
      }
    }, {
      key: 'marker',
      get: function get() {
        return this.isMarkerable && this.markerPosition.marker;
      }
    }, {
      key: 'offsetInMarker',
      get: function get() {
        return this.markerPosition.offset;
      }
    }, {
      key: 'markerPosition',

      /**
       * @private
       */
      get: function get() {
        (0, _mobiledocKitUtilsAssert['default'])('Cannot get markerPosition without a section', !!this.section);
        (0, _mobiledocKitUtilsAssert['default'])('cannot get markerPosition of a non-markerable', !!this.section.isMarkerable);
        return this.section.markerPositionAtOffset(this.offset);
      }
    }], [{
      key: 'blankPosition',
      value: function blankPosition() {
        return {
          section: null,
          offset: 0,
          marker: null,
          offsetInTextNode: 0,
          isBlank: true,
          isEqual: function isEqual(other) {
            return other.isBlank;
          },
          markerPosition: {}
        };
      }
    }, {
      key: 'fromNode',
      value: function fromNode(renderTree, node, offset) {
        if ((0, _mobiledocKitUtilsDomUtils.isTextNode)(node)) {
          return Position.fromTextNode(renderTree, node, offset);
        } else {
          return Position.fromElementNode(renderTree, node, offset);
        }
      }
    }, {
      key: 'fromTextNode',
      value: function fromTextNode(renderTree, textNode, offsetInNode) {
        var renderNode = renderTree.getElementRenderNode(textNode);
        var section = undefined,
            offsetInSection = undefined;

        if (renderNode) {
          var marker = renderNode.postNode;
          section = marker.section;

          (0, _mobiledocKitUtilsAssert['default'])('Could not find parent section for mapped text node "' + textNode.textContent + '"', !!section);
          offsetInSection = section.offsetOfMarker(marker, offsetInNode);
        } else {
          // all text nodes should be rendered by markers except:
          //   * text nodes inside cards
          //   * text nodes created by the browser during text input
          // both of these should have rendered parent sections, though
          section = findParentSectionFromNode(renderTree, textNode);
          (0, _mobiledocKitUtilsAssert['default'])('Could not find parent section for un-mapped text node "' + textNode.textContent + '"', !!section);

          offsetInSection = findOffsetInSection(section, textNode, offsetInNode);
        }

        return new Position(section, offsetInSection);
      }
    }, {
      key: 'fromElementNode',
      value: function fromElementNode(renderTree, elementNode, offset) {
        var position = undefined;

        // The browser may change the reported selection to equal the editor's root
        // element if the user clicks an element that is immediately removed,
        // which can happen when clicking to remove a card.
        if (elementNode === renderTree.rootElement) {
          var post = renderTree.rootNode.postNode;
          position = offset === 0 ? post.headPosition() : post.tailPosition();
        } else {
          var section = findParentSectionFromNode(renderTree, elementNode);
          (0, _mobiledocKitUtilsAssert['default'])('Could not find parent section from element node', !!section);

          if (section.isCardSection) {
            // Selections in cards are usually made on a text node
            // containing a &zwnj;  on one side or the other of the card but
            // some scenarios (Firefox) will result in selecting the
            // card's wrapper div. If the offset is 2 we've selected
            // the final zwnj and should consider the cursor at the
            // end of the card (offset 1). Otherwise,  the cursor is at
            // the start of the card
            position = offset < 2 ? section.headPosition() : section.tailPosition();
          } else {

            // In Firefox it is possible for the cursor to be on an atom's wrapper
            // element. (In Chrome/Safari, the browser corrects this to be on
            // one of the text nodes surrounding the wrapper).
            // This code corrects for when the browser reports the cursor position
            // to be on the wrapper element itself
            var renderNode = renderTree.getElementRenderNode(elementNode);
            var postNode = renderNode && renderNode.postNode;
            if (postNode && postNode.isAtom) {
              var sectionOffset = section.offsetOfMarker(postNode);
              if (offset > 1) {
                // we are on the tail side of the atom
                sectionOffset += postNode.length;
              }
              position = new Position(section, sectionOffset);
            } else {
              // The offset is 0 if the cursor is on a non-atom-wrapper element node
              // (e.g., a <br> tag in a blank markup section)
              position = section.headPosition();
            }
          }
        }

        return position;
      }
    }]);

    return Position;
  })();

  exports['default'] = Position;
});
define('mobiledoc-kit/utils/cursor/range', ['exports', 'mobiledoc-kit/utils/cursor/position', 'mobiledoc-kit/utils/key'], function (exports, _mobiledocKitUtilsCursorPosition, _mobiledocKitUtilsKey) {
  'use strict';

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  var Range = (function () {
    function Range(head) {
      var tail = arguments.length <= 1 || arguments[1] === undefined ? head : arguments[1];
      var direction = arguments.length <= 2 || arguments[2] === undefined ? _mobiledocKitUtilsKey.DIRECTION.FORWARD : arguments[2];
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
          case _mobiledocKitUtilsKey.DIRECTION.FORWARD:
            return new Range(this.head, this.tail.move(direction), this.direction);
          case _mobiledocKitUtilsKey.DIRECTION.BACKWARD:
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
          return new Range(new _mobiledocKitUtilsCursorPosition['default'](headSection, headOffset), new _mobiledocKitUtilsCursorPosition['default'](tailSection, tailOffset));
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
        return new Range(_mobiledocKitUtilsCursorPosition['default'].blankPosition(), _mobiledocKitUtilsCursorPosition['default'].blankPosition());
      }
    }]);

    return Range;
  })();

  exports['default'] = Range;
});
define('mobiledoc-kit/utils/cursor', ['exports', 'mobiledoc-kit/utils/selection-utils', 'mobiledoc-kit/utils/dom-utils', 'mobiledoc-kit/utils/cursor/position', 'mobiledoc-kit/utils/cursor/range', 'mobiledoc-kit/utils/key'], function (exports, _mobiledocKitUtilsSelectionUtils, _mobiledocKitUtilsDomUtils, _mobiledocKitUtilsCursorPosition, _mobiledocKitUtilsCursorRange, _mobiledocKitUtilsKey) {
  'use strict';

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  exports.Position = _mobiledocKitUtilsCursorPosition['default'];
  exports.Range = _mobiledocKitUtilsCursorRange['default'];

  var Cursor = (function () {
    function Cursor(editor) {
      _classCallCheck(this, Cursor);

      this.editor = editor;
      this.renderTree = editor._renderTree;
      this.post = editor.post;
    }

    _createClass(Cursor, [{
      key: 'clearSelection',
      value: function clearSelection() {
        (0, _mobiledocKitUtilsSelectionUtils.clearSelection)();
      }

      /**
       * @return {Boolean} true when there is either a collapsed cursor in the
       * editor's element or a selection that is contained in the editor's element
       */
    }, {
      key: 'hasCursor',
      value: function hasCursor() {
        return this.editor.hasRendered && (this._hasCollapsedSelection() || this._hasSelection());
      }
    }, {
      key: 'hasSelection',
      value: function hasSelection() {
        return this.editor.hasRendered && this._hasSelection();
      }

      /**
       * @return {Boolean} Can the cursor be on this element?
       */
    }, {
      key: 'isAddressable',
      value: function isAddressable(element) {
        var renderTree = this.renderTree;

        var renderNode = renderTree.findRenderNodeFromElement(element);
        if (renderNode && renderNode.postNode.isCardSection) {
          var renderedElement = renderNode.element;

          // card sections have addressable text nodes containing &zwnj;
          // as their first and last child
          if (element !== renderedElement && element !== renderedElement.firstChild && element !== renderedElement.lastChild) {
            return false;
          }
        }

        return !!renderNode;
      }

      /*
       * @return {Range} Cursor#Range object
       */
    }, {
      key: '_findNodeForPosition',
      value: function _findNodeForPosition(position) {
        var section = position.section;

        var node = undefined,
            offset = undefined;
        if (section.isCardSection) {
          offset = 0;
          if (position.offset === 0) {
            node = section.renderNode.element.firstChild;
          } else {
            node = section.renderNode.element.lastChild;
          }
        } else if (section.isBlank) {
          node = section.renderNode.element;
          offset = 0;
        } else {
          var marker = position.marker;
          var offsetInMarker = position.offsetInMarker;

          if (marker.isAtom) {
            if (offsetInMarker > 0) {
              // FIXME -- if there is a next marker, focus on it?
              offset = 0;
              node = marker.renderNode.tailTextNode;
            } else {
              offset = 0;
              node = marker.renderNode.headTextNode;
            }
          } else {
            node = marker.renderNode.element;
            offset = offsetInMarker;
          }
        }

        return { node: node, offset: offset };
      }
    }, {
      key: 'selectRange',
      value: function selectRange(range) {
        var head = range.head;
        var tail = range.tail;
        var direction = range.direction;

        var _findNodeForPosition2 = this._findNodeForPosition(head);

        var headNode = _findNodeForPosition2.node;
        var headOffset = _findNodeForPosition2.offset;

        var _findNodeForPosition3 = this._findNodeForPosition(tail);

        var tailNode = _findNodeForPosition3.node;
        var tailOffset = _findNodeForPosition3.offset;

        this._moveToNode(headNode, headOffset, tailNode, tailOffset, direction);
      }
    }, {
      key: 'selectedText',
      value: function selectedText() {
        return this.selection.toString();
      }

      /**
       * @param {textNode} node
       * @param {integer} offset
       * @param {textNode} endNode
       * @param {integer} endOffset
       * @param {integer} direction forward or backward, default forward
       * @private
       */
    }, {
      key: '_moveToNode',
      value: function _moveToNode(node, offset, endNode, endOffset) {
        var direction = arguments.length <= 4 || arguments[4] === undefined ? _mobiledocKitUtilsKey.DIRECTION.FORWARD : arguments[4];

        this.clearSelection();

        if (direction === _mobiledocKitUtilsKey.DIRECTION.BACKWARD) {
          var _ref = [endNode, endOffset, node, offset];
          node = _ref[0];
          offset = _ref[1];
          endNode = _ref[2];
          endOffset = _ref[3];
        }

        var range = document.createRange();
        range.setStart(node, offset);
        if (direction === _mobiledocKitUtilsKey.DIRECTION.BACKWARD && !!this.selection.extend) {
          this.selection.addRange(range);
          this.selection.extend(endNode, endOffset);
        } else {
          range.setEnd(endNode, endOffset);
          this.selection.addRange(range);
        }
      }
    }, {
      key: '_hasSelection',
      value: function _hasSelection() {
        var element = this.editor.element;
        var _selectionRange = this._selectionRange;

        if (!_selectionRange || _selectionRange.collapsed) {
          return false;
        }

        return (0, _mobiledocKitUtilsDomUtils.containsNode)(element, this.selection.anchorNode) && (0, _mobiledocKitUtilsDomUtils.containsNode)(element, this.selection.focusNode);
      }
    }, {
      key: '_hasCollapsedSelection',
      value: function _hasCollapsedSelection() {
        var _selectionRange = this._selectionRange;

        if (!_selectionRange) {
          return false;
        }

        var element = this.editor.element;
        return (0, _mobiledocKitUtilsDomUtils.containsNode)(element, this.selection.anchorNode);
      }
    }, {
      key: 'offsets',
      get: function get() {
        if (!this.hasCursor()) {
          return _mobiledocKitUtilsCursorRange['default'].blankRange();
        }

        var selection = this.selection;
        var renderTree = this.renderTree;

        var _comparePosition = (0, _mobiledocKitUtilsSelectionUtils.comparePosition)(selection);

        var headNode = _comparePosition.headNode;
        var headOffset = _comparePosition.headOffset;
        var tailNode = _comparePosition.tailNode;
        var tailOffset = _comparePosition.tailOffset;
        var direction = _comparePosition.direction;

        var headPosition = _mobiledocKitUtilsCursorPosition['default'].fromNode(renderTree, headNode, headOffset);
        var tailPosition = _mobiledocKitUtilsCursorPosition['default'].fromNode(renderTree, tailNode, tailOffset);

        return new _mobiledocKitUtilsCursorRange['default'](headPosition, tailPosition, direction);
      }
    }, {
      key: 'activeSections',
      get: function get() {
        if (!this.hasCursor()) {
          return [];
        }

        var _offsets = this.offsets;
        var head = _offsets.head;
        var tail = _offsets.tail;

        return this.post.sections.readRange(head.section, tail.section);
      }
    }, {
      key: 'selection',
      get: function get() {
        return window.getSelection();
      }
    }, {
      key: '_selectionRange',
      get: function get() {
        var selection = this.selection;

        if (selection.rangeCount === 0) {
          return null;
        }
        return selection.getRangeAt(0);
      }
    }]);

    return Cursor;
  })();

  exports['default'] = Cursor;
});
define('mobiledoc-kit/utils/dom-utils', ['exports', 'mobiledoc-kit/utils/array-utils'], function (exports, _mobiledocKitUtilsArrayUtils) {
  'use strict';

  var NODE_TYPES = {
    ELEMENT: 1,
    TEXT: 3,
    COMMENT: 8
  };

  exports.NODE_TYPES = NODE_TYPES;
  function isTextNode(node) {
    return node.nodeType === NODE_TYPES.TEXT;
  }

  function isCommentNode(node) {
    return node.nodeType === NODE_TYPES.COMMENT;
  }

  function isElementNode(node) {
    return node.nodeType === NODE_TYPES.ELEMENT;
  }

  // perform a pre-order tree traversal of the dom, calling `callbackFn(node)`
  // for every node for which `conditionFn(node)` is true
  function walkDOM(topNode) {
    var callbackFn = arguments.length <= 1 || arguments[1] === undefined ? function () {} : arguments[1];
    var conditionFn = arguments.length <= 2 || arguments[2] === undefined ? function () {
      return true;
    } : arguments[2];

    var currentNode = topNode;

    if (conditionFn(currentNode)) {
      callbackFn(currentNode);
    }

    currentNode = currentNode.firstChild;

    while (currentNode) {
      walkDOM(currentNode, callbackFn, conditionFn);
      currentNode = currentNode.nextSibling;
    }
  }

  function walkTextNodes(topNode) {
    var callbackFn = arguments.length <= 1 || arguments[1] === undefined ? function () {} : arguments[1];

    var conditionFn = function conditionFn(node) {
      return isTextNode(node);
    };
    walkDOM(topNode, callbackFn, conditionFn);
  }

  function clearChildNodes(element) {
    while (element.childNodes.length) {
      element.removeChild(element.childNodes[0]);
    }
  }

  /**
   * @return {Boolean} true when the child node is contained or the same as
   * (e.g., inclusive containment)  the parent node
   *  see https://github.com/webmodules/node-contains/blob/master/index.js
   *  Mimics the behavior of `Node.contains`, which is broken in IE 10
   */
  function containsNode(parentNode, childNode) {
    if (parentNode === childNode) {
      return true;
    }
    var position = parentNode.compareDocumentPosition(childNode);
    return !!(position & Node.DOCUMENT_POSITION_CONTAINED_BY);
  }

  /**
   * converts the element's NamedNodeMap of attrs into
   * an object with key-value pairs
   * @param {DOMNode} element
   * @return {Object} key-value pairs
   */
  function getAttributes(element) {
    var result = {};
    if (element.hasAttributes()) {
      (0, _mobiledocKitUtilsArrayUtils.forEach)(element.attributes, function (_ref) {
        var name = _ref.name;
        var value = _ref.value;

        result[name] = value;
      });
    }
    return result;
  }

  function addClassName(element, className) {
    // FIXME-IE IE10+
    element.classList.add(className);
  }

  function normalizeTagName(tagName) {
    return tagName.toLowerCase();
  }

  function parseHTML(html) {
    var div = document.createElement('div');
    div.innerHTML = html;
    return div;
  }

  function closest(el, selector) {
    var contentOnly = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];

    if (isTextNode(el)) {
      el = el.parentElement;
    }
    var matchesSelector = el.matches || el.webkitMatchesSelector || el.mozMatchesSelector || el.msMatchesSelector;

    if (contentOnly && matchesSelector.call(el, selector)) {
      return null;
    }

    while (el) {
      if (matchesSelector.call(el, selector)) {
        break;
      }
      el = el.parentElement;
    }
    return el;
  }

  exports.containsNode = containsNode;
  exports.clearChildNodes = clearChildNodes;
  exports.getAttributes = getAttributes;
  exports.walkDOM = walkDOM;
  exports.walkTextNodes = walkTextNodes;
  exports.addClassName = addClassName;
  exports.normalizeTagName = normalizeTagName;
  exports.isTextNode = isTextNode;
  exports.isCommentNode = isCommentNode;
  exports.isElementNode = isElementNode;
  exports.parseHTML = parseHTML;
  exports.closest = closest;
});
define('mobiledoc-kit/utils/element-map', ['exports', 'mobiledoc-kit/utils/assert'], function (exports, _mobiledocKitUtilsAssert) {
  'use strict';

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  // start at one to make the falsy semantics easier
  var uuidGenerator = 1;

  var ElementMap = (function () {
    function ElementMap() {
      _classCallCheck(this, ElementMap);

      this._map = {};
    }

    _createClass(ElementMap, [{
      key: 'set',
      value: function set(key, value) {
        var uuid = key._uuid;
        if (!uuid) {
          key._uuid = uuid = '' + uuidGenerator++;
        }
        this._map[uuid] = value;
      }
    }, {
      key: 'get',
      value: function get(key) {
        if (key._uuid) {
          return this._map[key._uuid];
        }
        return null;
      }
    }, {
      key: 'remove',
      value: function remove(key) {
        (0, _mobiledocKitUtilsAssert['default'])('tried to fetch a value for an element not seen before', !!key._uuid);
        delete this._map[key._uuid];
      }
    }]);

    return ElementMap;
  })();

  exports['default'] = ElementMap;
});
define('mobiledoc-kit/utils/element-utils', ['exports', 'mobiledoc-kit/utils/string-utils', 'mobiledoc-kit/utils/dom-utils'], function (exports, _mobiledocKitUtilsStringUtils, _mobiledocKitUtilsDomUtils) {
  'use strict';

  function getEventTargetMatchingTag(tagName, target, container) {
    tagName = (0, _mobiledocKitUtilsDomUtils.normalizeTagName)(tagName);
    // Traverses up DOM from an event target to find the node matching specifed tag
    while (target && target !== container) {
      if ((0, _mobiledocKitUtilsDomUtils.normalizeTagName)(target.tagName) === tagName) {
        return target;
      }
      target = target.parentNode;
    }
  }

  function getElementRelativeOffset(element) {
    var offset = { left: 0, top: -window.pageYOffset };
    var offsetParent = element.offsetParent;
    var offsetParentPosition = window.getComputedStyle(offsetParent).position;
    var offsetParentRect;

    if (offsetParentPosition === 'relative') {
      offsetParentRect = offsetParent.getBoundingClientRect();
      offset.left = offsetParentRect.left;
      offset.top = offsetParentRect.top;
    }
    return offset;
  }

  function getElementComputedStyleNumericProp(element, prop) {
    return parseFloat(window.getComputedStyle(element)[prop]);
  }

  function positionElementToRect(element, rect, topOffset, leftOffset) {
    var relativeOffset = getElementRelativeOffset(element);
    var style = element.style;
    var round = Math.round;
    var left, top;

    topOffset = topOffset || 0;
    leftOffset = leftOffset || 0;
    left = round(rect.left - relativeOffset.left - leftOffset);
    top = round(rect.top - relativeOffset.top - topOffset);
    style.left = left + 'px';
    style.top = top + 'px';
    return { left: left, top: top };
  }

  function positionElementHorizontallyCenteredToRect(element, rect, topOffset) {
    var horizontalCenter = element.offsetWidth / 2 - rect.width / 2;
    return positionElementToRect(element, rect, topOffset, horizontalCenter);
  }

  function positionElementCenteredBelow(element, belowElement) {
    var elementMargin = getElementComputedStyleNumericProp(element, 'marginTop');
    return positionElementHorizontallyCenteredToRect(element, belowElement.getBoundingClientRect(), -element.offsetHeight - elementMargin);
  }

  function setData(element, name, value) {
    if (element.dataset) {
      element.dataset[name] = value;
    } else {
      var dataName = (0, _mobiledocKitUtilsStringUtils.dasherize)(name);
      return element.setAttribute(dataName, value);
    }
  }

  exports.setData = setData;
  exports.getEventTargetMatchingTag = getEventTargetMatchingTag;
  exports.getElementRelativeOffset = getElementRelativeOffset;
  exports.getElementComputedStyleNumericProp = getElementComputedStyleNumericProp;
  exports.positionElementToRect = positionElementToRect;
  exports.positionElementHorizontallyCenteredToRect = positionElementHorizontallyCenteredToRect;
  exports.positionElementCenteredBelow = positionElementCenteredBelow;
});
define("mobiledoc-kit/utils/event-emitter", ["exports"], function (exports) {
  // Based on https://github.com/jeromeetienne/microevent.js/blob/master/microevent.js
  // See also: https://github.com/allouis/minivents/blob/master/minivents.js

  "use strict";

  var EventEmitter = {
    on: function on(type, handler) {
      var events = this.__events = this.__events || {};
      events[type] = events[type] || [];
      events[type].push(handler);
    },
    off: function off(type, handler) {
      var events = this.__events = this.__events || {};
      if (type in events) {
        events[type].splice(events[type].indexOf(handler), 1);
      }
    },
    trigger: function trigger(type) {
      var events = this.__events = this.__events || {};
      var eventForTypeCount, i;
      if (type in events) {
        eventForTypeCount = events[type].length;
        for (i = 0; i < eventForTypeCount; i++) {
          events[type][i].apply(this, Array.prototype.slice.call(arguments, 1));
        }
      }
    }
  };

  exports["default"] = EventEmitter;
});
define('mobiledoc-kit/utils/event-listener', ['exports', 'mobiledoc-kit/utils/array-utils'], function (exports, _mobiledocKitUtilsArrayUtils) {
  'use strict';

  var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

  function _toArray(arr) { return Array.isArray(arr) ? arr : Array.from(arr); }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

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
        var matches = (0, _mobiledocKitUtilsArrayUtils.filter)(this._eventListeners, function (_ref3) {
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
});
define("mobiledoc-kit/utils/fixed-queue", ["exports"], function (exports) {
  "use strict";

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  var FixedQueue = (function () {
    function FixedQueue() {
      var length = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];

      _classCallCheck(this, FixedQueue);

      this._maxLength = length;
      this._items = [];
    }

    _createClass(FixedQueue, [{
      key: "pop",
      value: function pop() {
        return this._items.pop();
      }
    }, {
      key: "push",
      value: function push(item) {
        this._items.push(item);
        if (this.length > this._maxLength) {
          this._items.shift();
        }
      }
    }, {
      key: "clear",
      value: function clear() {
        this._items = [];
      }
    }, {
      key: "toArray",
      value: function toArray() {
        return this._items;
      }
    }, {
      key: "length",
      get: function get() {
        return this._items.length;
      }
    }]);

    return FixedQueue;
  })();

  exports["default"] = FixedQueue;
});
define('mobiledoc-kit/utils/key', ['exports', 'mobiledoc-kit/utils/keycodes', 'mobiledoc-kit/utils/assert'], function (exports, _mobiledocKitUtilsKeycodes, _mobiledocKitUtilsAssert) {
  'use strict';

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  exports.modifierMask = modifierMask;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

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
    BACKSPACE: _mobiledocKitUtilsKeycodes['default'].BACKSPACE,
    TAB: _mobiledocKitUtilsKeycodes['default'].TAB,
    ENTER: _mobiledocKitUtilsKeycodes['default'].ENTER,
    ESC: _mobiledocKitUtilsKeycodes['default'].ESC,
    SPACE: _mobiledocKitUtilsKeycodes['default'].SPACE,
    PAGEUP: _mobiledocKitUtilsKeycodes['default'].PAGEUP,
    PAGEDOWN: _mobiledocKitUtilsKeycodes['default'].PAGEDOWN,
    END: _mobiledocKitUtilsKeycodes['default'].END,
    HOME: _mobiledocKitUtilsKeycodes['default'].HOME,
    LEFT: _mobiledocKitUtilsKeycodes['default'].LEFT,
    UP: _mobiledocKitUtilsKeycodes['default'].UP,
    RIGHT: _mobiledocKitUtilsKeycodes['default'].RIGHT,
    DOWN: _mobiledocKitUtilsKeycodes['default'].DOWN,
    INS: _mobiledocKitUtilsKeycodes['default'].INS,
    DEL: _mobiledocKitUtilsKeycodes['default'].DELETE
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
        return this.keyCode === _mobiledocKitUtilsKeycodes['default'].ESC;
      }
    }, {
      key: 'isDelete',
      value: function isDelete() {
        return this.keyCode === _mobiledocKitUtilsKeycodes['default'].BACKSPACE || this.keyCode === _mobiledocKitUtilsKeycodes['default'].DELETE;
      }
    }, {
      key: 'isForwardDelete',
      value: function isForwardDelete() {
        return this.keyCode === _mobiledocKitUtilsKeycodes['default'].DELETE;
      }
    }, {
      key: 'isHorizontalArrow',
      value: function isHorizontalArrow() {
        return this.keyCode === _mobiledocKitUtilsKeycodes['default'].LEFT || this.keyCode === _mobiledocKitUtilsKeycodes['default'].RIGHT;
      }
    }, {
      key: 'isLeftArrow',
      value: function isLeftArrow() {
        return this.keyCode === _mobiledocKitUtilsKeycodes['default'].LEFT;
      }
    }, {
      key: 'isRightArrow',
      value: function isRightArrow() {
        return this.keyCode === _mobiledocKitUtilsKeycodes['default'].RIGHT;
      }
    }, {
      key: 'isSpace',
      value: function isSpace() {
        return this.keyCode === _mobiledocKitUtilsKeycodes['default'].SPACE;
      }
    }, {
      key: 'isTab',
      value: function isTab() {
        return this.keyCode === _mobiledocKitUtilsKeycodes['default'].TAB;
      }
    }, {
      key: 'isEnter',
      value: function isEnter() {
        return this.keyCode === _mobiledocKitUtilsKeycodes['default'].ENTER;
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

        return code >= _mobiledocKitUtilsKeycodes['default']['0'] && code <= _mobiledocKitUtilsKeycodes['default']['9'] || // number keys
        this.isSpace() || this.isTab() || this.isEnter() || code >= _mobiledocKitUtilsKeycodes['default'].A && code <= _mobiledocKitUtilsKeycodes['default'].Z || // letter keys
        code >= _mobiledocKitUtilsKeycodes['default'].NUMPAD_0 && code <= _mobiledocKitUtilsKeycodes['default'].NUMPAD_9 || // numpad keys
        code >= _mobiledocKitUtilsKeycodes['default'][';'] && code <= _mobiledocKitUtilsKeycodes['default']['`'] || // punctuation
        code >= _mobiledocKitUtilsKeycodes['default']['['] && code <= _mobiledocKitUtilsKeycodes['default']['"'] ||
        // FIXME the IME action seems to get lost when we issue an `editor.deleteSelection`
        // before it (in Chrome)
        code === _mobiledocKitUtilsKeycodes['default'].IME;
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
        (0, _mobiledocKitUtilsAssert['default'])('Must pass a Key event to Key.fromEvent', event && isKeyEvent(event));
        return new Key(event);
      }
    }]);

    return Key;
  })();

  exports['default'] = Key;
});
define('mobiledoc-kit/utils/keycodes', ['exports'], function (exports) {
  'use strict';

  exports['default'] = {
    BACKSPACE: 8,
    SPACE: 32,
    ENTER: 13,
    ESC: 27,
    DELETE: 46,
    '0': 48,
    '9': 57,
    A: 65,
    Z: 90,
    'NUMPAD_0': 186,
    'NUMPAD_9': 111,
    ';': 186,
    '.': 190,
    '`': 192,
    '[': 219,
    '"': 222,

    // Input Method Editor uses multiple keystrokes to display characters.
    // Example on mac: press option-i then i. This fires 2 key events in Chrome
    // with keyCode 229 and displays ˆ and then î.
    // See http://lists.w3.org/Archives/Public/www-dom/2010JulSep/att-0182/keyCode-spec.html#fixed-virtual-key-codes
    IME: 229,

    TAB: 9,
    PAGEUP: 33,
    PAGEDOWN: 34,
    END: 35,
    HOME: 36,
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40,
    INS: 45
  };
});
define('mobiledoc-kit/utils/lifecycle-callbacks', ['exports', 'mobiledoc-kit/utils/assert'], function (exports, _mobiledocKitUtilsAssert) {
  'use strict';

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

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
        (0, _mobiledocKitUtilsAssert['default'])('Must pass queue name to runCallbacks', !!queueName);
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
});
define("mobiledoc-kit/utils/linked-item", ["exports"], function (exports) {
  "use strict";

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  var LinkedItem = function LinkedItem() {
    _classCallCheck(this, LinkedItem);

    this.next = null;
    this.prev = null;
  };

  exports["default"] = LinkedItem;
});
define('mobiledoc-kit/utils/linked-list', ['exports', 'mobiledoc-kit/utils/assert'], function (exports, _mobiledocKitUtilsAssert) {
  'use strict';

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  var PARENT_PROP = '__parent';

  var LinkedList = (function () {
    function LinkedList(options) {
      _classCallCheck(this, LinkedList);

      this.head = null;
      this.tail = null;
      this.length = 0;

      if (options) {
        var adoptItem = options.adoptItem;
        var freeItem = options.freeItem;

        this._adoptItem = adoptItem;
        this._freeItem = freeItem;
      }
    }

    _createClass(LinkedList, [{
      key: 'adoptItem',
      value: function adoptItem(item) {
        item[PARENT_PROP] = this;
        this.length++;
        if (this._adoptItem) {
          this._adoptItem(item);
        }
      }
    }, {
      key: 'freeItem',
      value: function freeItem(item) {
        item[PARENT_PROP] = null;
        this.length--;
        if (this._freeItem) {
          this._freeItem(item);
        }
      }
    }, {
      key: 'prepend',
      value: function prepend(item) {
        this.insertBefore(item, this.head);
      }
    }, {
      key: 'append',
      value: function append(item) {
        this.insertBefore(item, null);
      }
    }, {
      key: 'insertAfter',
      value: function insertAfter(item, prevItem) {
        var nextItem = prevItem ? prevItem.next : this.head;
        this.insertBefore(item, nextItem);
      }
    }, {
      key: '_ensureItemIsNotAlreadyInList',
      value: function _ensureItemIsNotAlreadyInList(item) {
        (0, _mobiledocKitUtilsAssert['default'])('Cannot insert an item into a list if it is already in a list', !item.next && !item.prev && this.head !== item);
      }
    }, {
      key: 'insertBefore',
      value: function insertBefore(item, nextItem) {
        this._ensureItemIsNotInList(item);
        this.adoptItem(item);

        var insertPos = undefined;
        if (nextItem && nextItem.prev) {
          insertPos = 'middle';
        } else if (nextItem) {
          insertPos = 'start';
        } else {
          insertPos = 'end';
        }

        switch (insertPos) {
          case 'start':
            if (this.head) {
              item.next = this.head;
              this.head.prev = item;
            }
            this.head = item;

            break;
          case 'middle':
            var prevItem = nextItem.prev;
            item.next = nextItem;
            item.prev = prevItem;
            nextItem.prev = item;
            prevItem.next = item;

            break;
          case 'end':
            var tail = this.tail;
            item.prev = tail;

            if (tail) {
              tail.next = item;
            } else {
              this.head = item;
            }
            this.tail = item;

            break;
        }
      }
    }, {
      key: 'remove',
      value: function remove(item) {
        if (!item[PARENT_PROP]) {
          return;
        }
        this._ensureItemIsInThisList(item);
        this.freeItem(item);

        var prev = item.prev;
        var next = item.next;

        item.prev = null;
        item.next = null;

        if (prev) {
          prev.next = next;
        } else {
          this.head = next;
        }

        if (next) {
          next.prev = prev;
        } else {
          this.tail = prev;
        }
      }
    }, {
      key: 'forEach',
      value: function forEach(callback) {
        var item = this.head;
        var index = 0;
        while (item) {
          callback(item, index++);
          item = item.next;
        }
      }
    }, {
      key: 'map',
      value: function map(callback) {
        var result = [];
        this.forEach(function (i) {
          return result.push(callback(i));
        });
        return result;
      }
    }, {
      key: 'walk',
      value: function walk(startItem, endItem, callback) {
        var item = startItem || this.head;
        while (item) {
          callback(item);
          if (item === endItem) {
            break;
          }
          item = item.next;
        }
      }
    }, {
      key: 'readRange',
      value: function readRange(startItem, endItem) {
        var items = [];
        this.walk(startItem, endItem, function (item) {
          items.push(item);
        });
        return items;
      }
    }, {
      key: 'toArray',
      value: function toArray() {
        return this.readRange();
      }
    }, {
      key: 'detect',
      value: function detect(callback) {
        var item = arguments.length <= 1 || arguments[1] === undefined ? this.head : arguments[1];

        while (item) {
          if (callback(item)) {
            return item;
          }
          item = item.next;
        }
      }
    }, {
      key: 'any',
      value: function any(callback) {
        return !!this.detect(callback);
      }
    }, {
      key: 'every',
      value: function every(callback) {
        var item = this.head;
        while (item) {
          if (!callback(item)) {
            return false;
          }
          item = item.next;
        }
        return true;
      }
    }, {
      key: 'objectAt',
      value: function objectAt(targetIndex) {
        var index = -1;
        return this.detect(function () {
          index++;
          return targetIndex === index;
        });
      }
    }, {
      key: 'splice',
      value: function splice(targetItem, removalCount, newItems) {
        var _this = this;

        var item = targetItem;
        var nextItem = item.next;
        var count = 0;
        while (item && count < removalCount) {
          count++;
          nextItem = item.next;
          this.remove(item);
          item = nextItem;
        }
        newItems.forEach(function (newItem) {
          _this.insertBefore(newItem, nextItem);
        });
      }
    }, {
      key: 'removeBy',
      value: function removeBy(conditionFn) {
        var item = this.head;
        while (item) {
          var nextItem = item.next;

          if (conditionFn(item)) {
            this.remove(item);
          }

          item = nextItem;
        }
      }
    }, {
      key: '_ensureItemIsNotInList',
      value: function _ensureItemIsNotInList(item) {
        (0, _mobiledocKitUtilsAssert['default'])('Cannot insert an item into a list if it is already in a list', !item[PARENT_PROP]);
      }
    }, {
      key: '_ensureItemIsInThisList',
      value: function _ensureItemIsInThisList(item) {
        (0, _mobiledocKitUtilsAssert['default'])('Cannot remove item that is in another list', item[PARENT_PROP] === this);
      }
    }, {
      key: 'isEmpty',
      get: function get() {
        return this.length === 0;
      }
    }]);

    return LinkedList;
  })();

  exports['default'] = LinkedList;
});
define('mobiledoc-kit/utils/markuperable', ['exports', 'mobiledoc-kit/utils/dom-utils', 'mobiledoc-kit/utils/array-utils'], function (exports, _mobiledocKitUtilsDomUtils, _mobiledocKitUtilsArrayUtils) {
  'use strict';

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  var Markerupable = (function () {
    function Markerupable() {
      _classCallCheck(this, Markerupable);
    }

    _createClass(Markerupable, [{
      key: 'clearMarkups',
      value: function clearMarkups() {
        this.markups = [];
      }
    }, {
      key: 'addMarkup',
      value: function addMarkup(markup) {
        this.markups.push(markup);
      }
    }, {
      key: 'removeMarkup',
      value: function removeMarkup(markupOrMarkupCallback) {
        var _this = this;

        var callback = undefined;
        if (typeof markupOrMarkupCallback === 'function') {
          callback = markupOrMarkupCallback;
        } else {
          (function () {
            var markup = markupOrMarkupCallback;
            callback = function (_markup) {
              return _markup === markup;
            };
          })();
        }

        (0, _mobiledocKitUtilsArrayUtils.forEach)((0, _mobiledocKitUtilsArrayUtils.filter)(this.markups, callback), function (m) {
          return _this._removeMarkup(m);
        });
      }
    }, {
      key: '_removeMarkup',
      value: function _removeMarkup(markup) {
        var index = this.markups.indexOf(markup);
        if (index !== -1) {
          this.markups.splice(index, 1);
        }
      }
    }, {
      key: 'hasMarkup',
      value: function hasMarkup(tagNameOrMarkup) {
        return !!this.getMarkup(tagNameOrMarkup);
      }
    }, {
      key: 'getMarkup',
      value: function getMarkup(tagNameOrMarkup) {
        var _this2 = this;

        if (typeof tagNameOrMarkup === 'string') {
          var _ret2 = (function () {
            var tagName = (0, _mobiledocKitUtilsDomUtils.normalizeTagName)(tagNameOrMarkup);
            return {
              v: (0, _mobiledocKitUtilsArrayUtils.detect)(_this2.markups, function (markup) {
                return markup.tagName === tagName;
              })
            };
          })();

          if (typeof _ret2 === 'object') return _ret2.v;
        } else {
          var _ret3 = (function () {
            var targetMarkup = tagNameOrMarkup;
            return {
              v: (0, _mobiledocKitUtilsArrayUtils.detect)(_this2.markups, function (markup) {
                return markup === targetMarkup;
              })
            };
          })();

          if (typeof _ret3 === 'object') return _ret3.v;
        }
      }
    }, {
      key: 'openedMarkups',
      get: function get() {
        var count = 0;
        if (this.prev) {
          count = (0, _mobiledocKitUtilsArrayUtils.commonItemLength)(this.markups, this.prev.markups);
        }

        return this.markups.slice(count);
      }
    }, {
      key: 'closedMarkups',
      get: function get() {
        var count = 0;
        if (this.next) {
          count = (0, _mobiledocKitUtilsArrayUtils.commonItemLength)(this.markups, this.next.markups);
        }

        return this.markups.slice(count);
      }
    }]);

    return Markerupable;
  })();

  exports['default'] = Markerupable;
});
define("mobiledoc-kit/utils/merge", ["exports"], function (exports) {
  "use strict";

  function mergeWithOptions(original, updates, options) {
    options = options || {};
    for (var prop in updates) {
      if (options.hasOwnProperty(prop)) {
        original[prop] = options[prop];
      } else if (updates.hasOwnProperty(prop)) {
        original[prop] = updates[prop];
      }
    }
    return original;
  }

  /**
   * Merges properties of one object into another
   */
  function merge(original, updates) {
    return mergeWithOptions(original, updates);
  }

  exports.mergeWithOptions = mergeWithOptions;
  exports.merge = merge;
});
define('mobiledoc-kit/utils/mixin', ['exports'], function (exports) {
  'use strict';

  exports['default'] = mixin;
  var CONSTRUCTOR_FN_NAME = 'constructor';

  function mixin(target, source) {
    target = target.prototype;
    // Fallback to just `source` to allow mixing in a plain object (pojo)
    source = source.prototype || source;

    Object.getOwnPropertyNames(source).forEach(function (name) {
      if (name !== CONSTRUCTOR_FN_NAME) {
        var descriptor = Object.getOwnPropertyDescriptor(source, name);

        Object.defineProperty(target, name, descriptor);
      }
    });
  }
});
define('mobiledoc-kit/utils/mobiledoc-error', ['exports'], function (exports) {
  'use strict';

  var errorProps = ['description', 'fileName', 'lineNumber', 'message', 'name', 'number', 'stack'];

  function MobiledocError() {
    var tmp = Error.apply(this, arguments);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
    // Unfortunately errors are not enumerable in Chrome (at least), so `for prop in tmp` doesn't work.
    for (var idx = 0; idx < errorProps.length; idx++) {
      this[errorProps[idx]] = tmp[errorProps[idx]];
    }
  }

  MobiledocError.prototype = Object.create(Error.prototype);

  exports['default'] = MobiledocError;
});
define('mobiledoc-kit/utils/paste-utils', ['exports', 'mobiledoc-kit/parsers/mobiledoc', 'mobiledoc-kit/parsers/html', 'mobiledoc-kit/parsers/text', 'mobiledoc-html-renderer', 'mobiledoc-text-renderer'], function (exports, _mobiledocKitParsersMobiledoc, _mobiledocKitParsersHtml, _mobiledocKitParsersText, _mobiledocHtmlRenderer, _mobiledocTextRenderer) {
  /* global JSON */
  'use strict';

  exports.setClipboardCopyData = setClipboardCopyData;
  exports.parsePostFromPaste = parsePostFromPaste;

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
      post = _mobiledocKitParsersMobiledoc['default'].parse(builder, mobiledoc);
    } else {
      post = new _mobiledocKitParsersHtml['default'](builder, { plugins: plugins }).parse(html);
    }

    return post;
  }

  function parsePostFromText(text, builder, plugins) {
    var parser = new _mobiledocKitParsersText['default'](builder, { plugins: plugins });
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
});
define("mobiledoc-kit/utils/placeholder-image-src", ["exports"], function (exports) {
  "use strict";

  var placeholderImageSrc = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAMFBMVEXp7vG6vsHm6+63u77Hy868wMPe4+bO09bh5unr8fTR1djAxMfM0NPX3N/c4eTBxcjXRf5TAAACh0lEQVR4nO3b6ZKqMBSFUSQMYZL3f9tbBq/NEEDiqUqOfusn1ZXKbjcQlGQZAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACC6RkbsGHuabChEtHmiGYfS3EQYM+Sxw/gMQvmcNnYaj6oTDHi73WPn2eqnj9B8zo3TJXcq5uNjXmVff86VwSR3JtryMa1BYqi7S1hJDCVpSigyLcGhJJEwzlCSNtPKrbVhVwsdCfOhH7uuaG3ARV9DwsaOzxt3N1yPqCHhvXytTUz92VDpmE/LLhZwl++R6Sds6sUa/PL6K/2E2fIhw1xdRKefsFolrPc+xNx/N0k/4fpBsdhL2HfeiN+TsDCms8dDpeRyS3P3QDl6Iqaf8L0rTf+80m6Lmn7Ct+4Wxf+/2RY1/YRv3PHz/u+fsCmqgoTnq7Z+8SGviqoh4dnKu1ieqauiakh4/PQ0r6ivqDoSHj0B97eNRVG1JNxV+L4bnxdVecJtRTdFVZ7QU9F1UXUn9FZ0VVRlCav5ob2KLouqKmFjy676u2HsVnRRVFUJq3J+8KCi86IqSthMvyl209Hjijqm3RsqAZ5pNfa5PJ2KelJRjQmr1/r7cfy0ouoSNvOfvbvhvKLaEr4qOin9kTQnrN7LpDZhE/Zmhp6Eq4p+YcKgiipKGFhRRQkDK6ooYfgLbiSMioQkJGF8P5XwHv4O+7AaKiXzaeXh1kMl5AffTUxiKEm/krD94BR8Gdxl1fceSlR58ZhXKbEpyD2amNiBtmrJLTMHL1LF8/rpXkSZXEmz8K8uvAFFNm6Iq0aBLUFOmeCuJ6exrcCmoLpN7kYx891bSAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgh/wDdr8peyRHLogAAAAASUVORK5CYII=";

  exports["default"] = placeholderImageSrc;
});
define('mobiledoc-kit/utils/selection-utils', ['exports', 'mobiledoc-kit/utils/key'], function (exports, _mobiledocKitUtilsKey) {
  'use strict';

  function clearSelection() {
    // FIXME-IE ensure this works on IE 9. It works on IE10.
    window.getSelection().removeAllRanges();
  }

  function comparePosition(_x) {
    var _again = true;

    _function: while (_again) {
      var selection = _x;
      _again = false;
      var anchorNode = selection.anchorNode;
      var focusNode = selection.focusNode;
      var anchorOffset = selection.anchorOffset;
      var focusOffset = selection.focusOffset;

      var headNode = undefined,
          tailNode = undefined,
          headOffset = undefined,
          tailOffset = undefined,
          direction = undefined;

      var position = anchorNode.compareDocumentPosition(focusNode);

      // IE may select return focus and anchor nodes far up the DOM tree instead of
      // picking the deepest, most specific possible node. For example in
      //
      //     <div><span>abc</span><span>def</span></div>
      //
      // with a cursor between c and d, IE might say the focusNode is <div> with
      // an offset of 1. However the anchorNode for a selection might still be
      // <span> 2 if there was a selection.
      //
      // This code walks down the DOM tree until a good comparison of position can be
      // made.
      //
      if (position & Node.DOCUMENT_POSITION_CONTAINS) {
        _x = {
          focusNode: focusNode.childNodes[focusOffset],
          focusOffset: 0,
          anchorNode: anchorNode, anchorOffset: anchorOffset
        };
        _again = true;
        anchorNode = focusNode = anchorOffset = focusOffset = headNode = tailNode = headOffset = tailOffset = direction = position = undefined;
        continue _function;
      } else if (position & Node.DOCUMENT_POSITION_CONTAINED_BY) {
        var offset = anchorOffset - 1;
        if (offset < 0) {
          offset = 0;
        }
        _x = {
          anchorNode: anchorNode.childNodes[offset],
          anchorOffset: 0,
          focusNode: focusNode, focusOffset: focusOffset
        };
        _again = true;
        anchorNode = focusNode = anchorOffset = focusOffset = headNode = tailNode = headOffset = tailOffset = direction = position = offset = undefined;
        continue _function;

        // The meat of translating anchor and focus nodes to head and tail nodes
      } else if (position & Node.DOCUMENT_POSITION_FOLLOWING) {
          headNode = anchorNode;tailNode = focusNode;
          headOffset = anchorOffset;tailOffset = focusOffset;
          direction = _mobiledocKitUtilsKey.DIRECTION.FORWARD;
        } else if (position & Node.DOCUMENT_POSITION_PRECEDING) {
          headNode = focusNode;tailNode = anchorNode;
          headOffset = focusOffset;tailOffset = anchorOffset;
          direction = _mobiledocKitUtilsKey.DIRECTION.BACKWARD;
        } else {
          // same node
          headNode = tailNode = anchorNode;
          headOffset = anchorOffset;
          tailOffset = focusOffset;
          if (tailOffset < headOffset) {
            // Swap the offset order
            headOffset = focusOffset;
            tailOffset = anchorOffset;
            direction = _mobiledocKitUtilsKey.DIRECTION.BACKWARD;
          } else if (headOffset < tailOffset) {
            direction = _mobiledocKitUtilsKey.DIRECTION.FORWARD;
          } else {
            direction = null;
          }
        }

      return { headNode: headNode, headOffset: headOffset, tailNode: tailNode, tailOffset: tailOffset, direction: direction };
    }
  }

  exports.clearSelection = clearSelection;
  exports.comparePosition = comparePosition;
});
define("mobiledoc-kit/utils/set", ["exports"], function (exports) {
  "use strict";

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  var Set = (function () {
    function Set() {
      var _this = this;

      var items = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];

      _classCallCheck(this, Set);

      this.items = [];
      items.forEach(function (i) {
        return _this.add(i);
      });
    }

    _createClass(Set, [{
      key: "add",
      value: function add(item) {
        if (!this.has(item)) {
          this.items.push(item);
        }
      }
    }, {
      key: "has",
      value: function has(item) {
        return this.items.indexOf(item) !== -1;
      }
    }, {
      key: "toArray",
      value: function toArray() {
        return this.items;
      }
    }, {
      key: "length",
      get: function get() {
        return this.items.length;
      }
    }]);

    return Set;
  })();

  exports["default"] = Set;
});
define('mobiledoc-kit/utils/string-utils', ['exports'], function (exports) {
  /*
   * @param {String} string
   * @return {String} a dasherized string. 'modelIndex' -> 'model-index', etc
   */
  'use strict';

  exports.dasherize = dasherize;
  exports.capitalize = capitalize;
  exports.startsWith = startsWith;
  exports.endsWith = endsWith;

  function dasherize(string) {
    return string.replace(/[A-Z]/g, function (match, offset) {
      var lower = match.toLowerCase();

      return offset === 0 ? lower : '-' + lower;
    });
  }

  function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  function startsWith(string, character) {
    return string.charAt(0) === character;
  }

  function endsWith(string, character) {
    return string.charAt(string.length - 1) === character;
  }
});
define('mobiledoc-kit/version', ['exports'], function (exports) {
  'use strict';

  exports['default'] = '0.8.5';
});
define('mobiledoc-kit/views/tooltip', ['exports', 'mobiledoc-kit/views/view', 'mobiledoc-kit/utils/element-utils'], function (exports, _mobiledocKitViewsView, _mobiledocKitUtilsElementUtils) {
  'use strict';

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

  var DELAY = 200;

  var Tooltip = (function (_View) {
    _inherits(Tooltip, _View);

    function Tooltip(options) {
      var _this = this;

      _classCallCheck(this, Tooltip);

      var rootElement = options.rootElement;

      var timeout = undefined;
      options.classNames = ['__mobiledoc-tooltip'];
      _get(Object.getPrototypeOf(Tooltip.prototype), 'constructor', this).call(this, options);

      this.addEventListener(rootElement, 'mouseover', function (e) {
        var target = (0, _mobiledocKitUtilsElementUtils.getEventTargetMatchingTag)(options.showForTag, e.target, rootElement);
        if (target && target.isContentEditable) {
          timeout = setTimeout(function () {
            _this.showLink(target.href, target);
          }, DELAY);
        }
      });

      this.addEventListener(rootElement, 'mouseout', function (e) {
        clearTimeout(timeout);
        var toElement = e.toElement || e.relatedTarget;
        if (toElement && toElement.className !== _this.element.className) {
          _this.hide();
        }
      });
    }

    _createClass(Tooltip, [{
      key: 'showMessage',
      value: function showMessage(message, element) {
        var tooltipElement = this.element;
        tooltipElement.innerHTML = message;
        this.show();
        (0, _mobiledocKitUtilsElementUtils.positionElementCenteredBelow)(tooltipElement, element);
      }
    }, {
      key: 'showLink',
      value: function showLink(link, element) {
        var message = '<a href="' + link + '" target="_blank">' + link + '</a>';
        this.showMessage(message, element);
      }
    }]);

    return Tooltip;
  })(_mobiledocKitViewsView['default']);

  exports['default'] = Tooltip;
});
define('mobiledoc-kit/views/view', ['exports', 'mobiledoc-kit/utils/mixin', 'mobiledoc-kit/utils/event-listener', 'mobiledoc-kit/utils/dom-utils'], function (exports, _mobiledocKitUtilsMixin, _mobiledocKitUtilsEventListener, _mobiledocKitUtilsDomUtils) {
  'use strict';

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

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
        return (0, _mobiledocKitUtilsDomUtils.addClassName)(_this.element, name);
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

  (0, _mobiledocKitUtilsMixin['default'])(View, _mobiledocKitUtilsEventListener['default']);

  exports['default'] = View;
});
define('mobiledoc-text-renderer/cards/image', ['exports'], function (exports) {
  'use strict';

  exports['default'] = {
    name: 'image-card',
    type: 'text',
    render: function render() {}
  };
});
define('mobiledoc-text-renderer', ['exports', 'mobiledoc-text-renderer/renderer-factory', 'mobiledoc-text-renderer/utils/render-type'], function (exports, _mobiledocTextRendererRendererFactory, _mobiledocTextRendererUtilsRenderType) {
  'use strict';

  exports.registerGlobal = registerGlobal;

  function registerGlobal(window) {
    window.MobiledocTextRenderer = _mobiledocTextRendererRendererFactory['default'];
  }

  exports.RENDER_TYPE = _mobiledocTextRendererUtilsRenderType['default'];
  exports['default'] = _mobiledocTextRendererRendererFactory['default'];
});
define('mobiledoc-text-renderer/renderer-factory', ['exports', 'mobiledoc-text-renderer/renderers/0-2', 'mobiledoc-text-renderer/renderers/0-3', 'mobiledoc-text-renderer/utils/render-type'], function (exports, _mobiledocTextRendererRenderers02, _mobiledocTextRendererRenderers03, _mobiledocTextRendererUtilsRenderType) {
  'use strict';

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  /**
   * runtime Text renderer
   * renders a mobiledoc to Text
   *
   * input: mobiledoc
   * output: Text (string)
   */

  function validateCards(cards) {
    if (!Array.isArray(cards)) {
      throw new Error('`cards` must be passed as an array');
    }
    for (var i = 0; i < cards.length; i++) {
      var card = cards[i];
      if (card.type !== _mobiledocTextRendererUtilsRenderType['default']) {
        throw new Error('Card "' + card.name + '" must be type "' + _mobiledocTextRendererUtilsRenderType['default'] + '", was "' + card.type + '"');
      }
      if (!card.render) {
        throw new Error('Card "' + card.name + '" must define `render`');
      }
    }
  }

  function validateAtoms(atoms) {
    if (!Array.isArray(atoms)) {
      throw new Error('`atoms` must be passed as an array');
    }
    for (var i = 0; i < atoms.length; i++) {
      var atom = atoms[i];
      if (atom.type !== _mobiledocTextRendererUtilsRenderType['default']) {
        throw new Error('Atom "' + atom.name + '" must be type "' + _mobiledocTextRendererUtilsRenderType['default'] + '", was "' + atom.type + '"');
      }
      if (!atom.render) {
        throw new Error('Atom "' + atom.name + '" must define `render`');
      }
    }
  }

  var RendererFactory = (function () {
    function RendererFactory() {
      var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      var cards = _ref.cards;
      var atoms = _ref.atoms;
      var cardOptions = _ref.cardOptions;
      var unknownCardHandler = _ref.unknownCardHandler;
      var unknownAtomHandler = _ref.unknownAtomHandler;

      _classCallCheck(this, RendererFactory);

      cards = cards || [];
      validateCards(cards);
      atoms = atoms || [];
      validateAtoms(atoms);
      cardOptions = cardOptions || {};

      this.state = { cards: cards, atoms: atoms, cardOptions: cardOptions, unknownCardHandler: unknownCardHandler, unknownAtomHandler: unknownAtomHandler };
    }

    _createClass(RendererFactory, [{
      key: 'render',
      value: function render(mobiledoc) {
        var version = mobiledoc.version;

        switch (version) {
          case _mobiledocTextRendererRenderers02.MOBILEDOC_VERSION:
          case undefined:
          case null:
            return new _mobiledocTextRendererRenderers02['default'](mobiledoc, this.state).render();
          case _mobiledocTextRendererRenderers03.MOBILEDOC_VERSION:
            return new _mobiledocTextRendererRenderers03['default'](mobiledoc, this.state).render();
          default:
            throw new Error('Unexpected Mobiledoc version "' + version + '"');
        }
      }
    }]);

    return RendererFactory;
  })();

  exports['default'] = RendererFactory;
});
define('mobiledoc-text-renderer/renderers/0-2', ['exports', 'mobiledoc-text-renderer/cards/image', 'mobiledoc-text-renderer/utils/render-type', 'mobiledoc-text-renderer/utils/section-types'], function (exports, _mobiledocTextRendererCardsImage, _mobiledocTextRendererUtilsRenderType, _mobiledocTextRendererUtilsSectionTypes) {
  /**
   * runtime Text renderer
   * renders a mobiledoc to Text
   *
   * input: mobiledoc
   * output: Text (string)
   */
  'use strict';

  var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  var LINE_BREAK = '\n';

  var MOBILEDOC_VERSION = '0.2.0';

  exports.MOBILEDOC_VERSION = MOBILEDOC_VERSION;
  function validateVersion(version) {
    if (version !== MOBILEDOC_VERSION) {
      throw new Error('Unexpected Mobiledoc version "' + version + '"');
    }
  }

  var Renderer = (function () {
    function Renderer(mobiledoc, state) {
      _classCallCheck(this, Renderer);

      var cards = state.cards;
      var cardOptions = state.cardOptions;
      var atoms = state.atoms;
      var unknownCardHandler = state.unknownCardHandler;
      var version = mobiledoc.version;
      var sectionData = mobiledoc.sections;

      validateVersion(version);

      var _sectionData = _slicedToArray(sectionData, 2);

      var sections = _sectionData[1];

      this.root = [];
      this.sections = sections;
      this.cards = cards;
      this.atoms = atoms;
      this.cardOptions = cardOptions;
      this.unknownCardHandler = unknownCardHandler || this._defaultUnknownCardHandler;

      this._teardownCallbacks = [];
    }

    _createClass(Renderer, [{
      key: 'render',
      value: function render() {
        var _this = this;

        this.sections.forEach(function (section) {
          _this.root.push(_this.renderSection(section));
        });

        var result = this.root.join(LINE_BREAK);
        return { result: result, teardown: function teardown() {
            return _this.teardown();
          } };
      }
    }, {
      key: 'teardown',
      value: function teardown() {
        for (var i = 0; i < this._teardownCallbacks.length; i++) {
          this._teardownCallbacks[i]();
        }
      }
    }, {
      key: 'renderSection',

      // for the text renderer, a missing card is a no-op
      value: function renderSection(section) {
        var _section = _slicedToArray(section, 1);

        var type = _section[0];

        switch (type) {
          case _mobiledocTextRendererUtilsSectionTypes.MARKUP_SECTION_TYPE:
            return this.renderMarkupSection(section);
          case _mobiledocTextRendererUtilsSectionTypes.IMAGE_SECTION_TYPE:
            return this.renderImageSection(section);
          case _mobiledocTextRendererUtilsSectionTypes.LIST_SECTION_TYPE:
            return this.renderListSection(section);
          case _mobiledocTextRendererUtilsSectionTypes.CARD_SECTION_TYPE:
            return this.renderCardSection(section);
          default:
            throw new Error('Unimplemented renderer for type ' + type);
        }
      }
    }, {
      key: 'renderImageSection',
      value: function renderImageSection() {
        return '';
      }
    }, {
      key: 'renderListSection',
      value: function renderListSection(_ref) {
        var _this2 = this;

        var _ref2 = _slicedToArray(_ref, 3);

        var type = _ref2[0];
        var tagName = _ref2[1];
        var items = _ref2[2];

        return items.map(function (li) {
          return _this2.renderListItem(li);
        }).join(LINE_BREAK);
      }
    }, {
      key: 'renderListItem',
      value: function renderListItem(markers) {
        return this.renderMarkers(markers);
      }
    }, {
      key: 'findCard',
      value: function findCard(name) {
        for (var i = 0; i < this.cards.length; i++) {
          if (this.cards[i].name === name) {
            return this.cards[i];
          }
        }
        if (name === _mobiledocTextRendererCardsImage['default'].name) {
          return _mobiledocTextRendererCardsImage['default'];
        }
        return this._createUnknownCard(name);
      }
    }, {
      key: '_createUnknownCard',
      value: function _createUnknownCard(name) {
        return {
          name: name,
          type: _mobiledocTextRendererUtilsRenderType['default'],
          render: this.unknownCardHandler
        };
      }
    }, {
      key: 'renderCardSection',
      value: function renderCardSection(_ref3) {
        var _ref32 = _slicedToArray(_ref3, 3);

        var type = _ref32[0];
        var name = _ref32[1];
        var payload = _ref32[2];

        var card = this.findCard(name);

        var cardArg = this._createCardArgument(card, payload);
        var rendered = card.render(cardArg);

        this._validateCardRender(rendered, card.name);

        return rendered || '';
      }
    }, {
      key: '_validateCardRender',
      value: function _validateCardRender(rendered, cardName) {
        if (!rendered) {
          return;
        }

        if (typeof rendered !== 'string') {
          throw new Error('Card "' + cardName + '" must render ' + _mobiledocTextRendererUtilsRenderType['default'] + ', but result was ' + typeof rendered + '"');
        }
      }
    }, {
      key: '_registerTeardownCallback',
      value: function _registerTeardownCallback(callback) {
        this._teardownCallbacks.push(callback);
      }
    }, {
      key: '_createCardArgument',
      value: function _createCardArgument(card) {
        var _this3 = this;

        var payload = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

        var env = {
          name: card.name,
          isInEditor: false,
          onTeardown: function onTeardown(callback) {
            return _this3._registerTeardownCallback(callback);
          }
        };

        var options = this.cardOptions;

        return { env: env, options: options, payload: payload };
      }
    }, {
      key: 'renderMarkupSection',
      value: function renderMarkupSection(_ref4) {
        var _ref42 = _slicedToArray(_ref4, 3);

        var type = _ref42[0];
        var tagName = _ref42[1];
        var markers = _ref42[2];

        return this.renderMarkers(markers);
      }
    }, {
      key: 'renderMarkers',
      value: function renderMarkers(markers) {
        var str = '';
        markers.forEach(function (m) {
          var _m = _slicedToArray(m, 3);

          var text = _m[2];

          str += text;
        });
        return str;
      }
    }, {
      key: '_defaultUnknownCardHandler',
      get: function get() {
        return function () {};
      }
    }]);

    return Renderer;
  })();

  exports['default'] = Renderer;
});
define('mobiledoc-text-renderer/renderers/0-3', ['exports', 'mobiledoc-text-renderer/cards/image', 'mobiledoc-text-renderer/utils/render-type', 'mobiledoc-text-renderer/utils/section-types', 'mobiledoc-text-renderer/utils/marker-types'], function (exports, _mobiledocTextRendererCardsImage, _mobiledocTextRendererUtilsRenderType, _mobiledocTextRendererUtilsSectionTypes, _mobiledocTextRendererUtilsMarkerTypes) {
  /**
   * runtime Text renderer
   * renders a mobiledoc to Text
   *
   * input: mobiledoc
   * output: Text (string)
   */
  'use strict';

  var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  var LINE_BREAK = '\n';

  var MOBILEDOC_VERSION = '0.3.0';

  exports.MOBILEDOC_VERSION = MOBILEDOC_VERSION;
  function validateVersion(version) {
    if (version !== MOBILEDOC_VERSION) {
      throw new Error('Unexpected Mobiledoc version "' + version + '"');
    }
  }

  var Renderer = (function () {
    function Renderer(mobiledoc, state) {
      _classCallCheck(this, Renderer);

      var cards = state.cards;
      var cardOptions = state.cardOptions;
      var atoms = state.atoms;
      var unknownCardHandler = state.unknownCardHandler;
      var unknownAtomHandler = state.unknownAtomHandler;
      var version = mobiledoc.version;
      var sections = mobiledoc.sections;
      var atomTypes = mobiledoc.atoms;
      var cardTypes = mobiledoc.cards;

      validateVersion(version);

      this.root = [];
      this.sections = sections;
      this.atomTypes = atomTypes;
      this.cardTypes = cardTypes;
      this.cards = cards;
      this.atoms = atoms;
      this.cardOptions = cardOptions;
      this.unknownCardHandler = unknownCardHandler || this._defaultUnknownCardHandler;
      this.unknownAtomHandler = unknownAtomHandler || this._defaultUnknownAtomHandler;

      this._teardownCallbacks = [];
    }

    _createClass(Renderer, [{
      key: 'render',
      value: function render() {
        var _this = this;

        this.sections.forEach(function (section) {
          _this.root.push(_this.renderSection(section));
        });

        var result = this.root.join(LINE_BREAK);
        return { result: result, teardown: function teardown() {
            return _this.teardown();
          } };
      }
    }, {
      key: 'teardown',
      value: function teardown() {
        for (var i = 0; i < this._teardownCallbacks.length; i++) {
          this._teardownCallbacks[i]();
        }
      }
    }, {
      key: 'renderSection',
      value: function renderSection(section) {
        var _section = _slicedToArray(section, 1);

        var type = _section[0];

        switch (type) {
          case _mobiledocTextRendererUtilsSectionTypes.MARKUP_SECTION_TYPE:
            return this.renderMarkupSection(section);
          case _mobiledocTextRendererUtilsSectionTypes.IMAGE_SECTION_TYPE:
            return this.renderImageSection(section);
          case _mobiledocTextRendererUtilsSectionTypes.LIST_SECTION_TYPE:
            return this.renderListSection(section);
          case _mobiledocTextRendererUtilsSectionTypes.CARD_SECTION_TYPE:
            return this.renderCardSection(section);
          default:
            throw new Error('Unimplemented renderer for type ' + type);
        }
      }
    }, {
      key: 'renderImageSection',
      value: function renderImageSection() {
        return '';
      }
    }, {
      key: 'renderListSection',
      value: function renderListSection(_ref) {
        var _this2 = this;

        var _ref2 = _slicedToArray(_ref, 3);

        var type = _ref2[0];
        var tagName = _ref2[1];
        var items = _ref2[2];

        return items.map(function (li) {
          return _this2.renderListItem(li);
        }).join(LINE_BREAK);
      }
    }, {
      key: 'renderListItem',
      value: function renderListItem(markers) {
        return this.renderMarkers(markers);
      }
    }, {
      key: 'findCard',
      value: function findCard(name) {
        for (var i = 0; i < this.cards.length; i++) {
          if (this.cards[i].name === name) {
            return this.cards[i];
          }
        }
        if (name === _mobiledocTextRendererCardsImage['default'].name) {
          return _mobiledocTextRendererCardsImage['default'];
        }
        return this._createUnknownCard(name);
      }
    }, {
      key: '_findCardByIndex',
      value: function _findCardByIndex(index) {
        var cardType = this.cardTypes[index];
        if (!cardType) {
          throw new Error('No card definition found at index ' + index);
        }

        var _cardType = _slicedToArray(cardType, 2);

        var name = _cardType[0];
        var payload = _cardType[1];

        var card = this.findCard(name);

        return {
          card: card,
          payload: payload
        };
      }
    }, {
      key: '_createUnknownCard',
      value: function _createUnknownCard(name) {
        return {
          name: name,
          type: _mobiledocTextRendererUtilsRenderType['default'],
          render: this.unknownCardHandler
        };
      }
    }, {
      key: 'renderCardSection',
      value: function renderCardSection(_ref3) {
        var _ref32 = _slicedToArray(_ref3, 2);

        var type = _ref32[0];
        var index = _ref32[1];

        var _findCardByIndex2 = this._findCardByIndex(index);

        var card = _findCardByIndex2.card;
        var payload = _findCardByIndex2.payload;

        var cardArg = this._createCardArgument(card, payload);
        var rendered = card.render(cardArg);

        this._validateCardRender(rendered, card.name);

        return rendered || '';
      }
    }, {
      key: '_validateCardRender',
      value: function _validateCardRender(rendered, cardName) {
        if (!rendered) {
          return;
        }

        if (typeof rendered !== 'string') {
          throw new Error('Card "' + cardName + '" must render ' + _mobiledocTextRendererUtilsRenderType['default'] + ', but result was ' + typeof rendered + '"');
        }
      }
    }, {
      key: '_registerTeardownCallback',
      value: function _registerTeardownCallback(callback) {
        this._teardownCallbacks.push(callback);
      }
    }, {
      key: '_createCardArgument',
      value: function _createCardArgument(card) {
        var _this3 = this;

        var payload = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

        var env = {
          name: card.name,
          isInEditor: false,
          onTeardown: function onTeardown(callback) {
            return _this3._registerTeardownCallback(callback);
          }
        };

        var options = this.cardOptions;

        return { env: env, options: options, payload: payload };
      }
    }, {
      key: 'renderMarkupSection',
      value: function renderMarkupSection(_ref4) {
        var _ref42 = _slicedToArray(_ref4, 3);

        var type = _ref42[0];
        var tagName = _ref42[1];
        var markers = _ref42[2];

        return this.renderMarkers(markers);
      }
    }, {
      key: 'findAtom',
      value: function findAtom(name) {
        for (var i = 0; i < this.atoms.length; i++) {
          if (this.atoms[i].name === name) {
            return this.atoms[i];
          }
        }
        return this._createUnknownAtom(name);
      }
    }, {
      key: '_createUnknownAtom',
      value: function _createUnknownAtom(name) {
        return {
          name: name,
          type: _mobiledocTextRendererUtilsRenderType['default'],
          render: this.unknownAtomHandler
        };
      }
    }, {
      key: '_createAtomArgument',
      value: function _createAtomArgument(atom, value, payload) {
        var _this4 = this;

        var env = {
          name: atom.name,
          onTeardown: function onTeardown(callback) {
            return _this4._registerTeardownCallback(callback);
          }
        };

        var options = this.cardOptions;

        return { env: env, options: options, value: value, payload: payload };
      }
    }, {
      key: '_validateAtomRender',
      value: function _validateAtomRender(rendered, atomName) {
        if (!rendered) {
          return;
        }

        if (typeof rendered !== 'string') {
          throw new Error('Atom "' + atomName + '" must render ' + _mobiledocTextRendererUtilsRenderType['default'] + ', but result was ' + typeof rendered + '"');
        }
      }
    }, {
      key: '_findAtomByIndex',
      value: function _findAtomByIndex(index) {
        var atomType = this.atomTypes[index];
        if (!atomType) {
          throw new Error('No atom definition found at index ' + index);
        }

        var _atomType = _slicedToArray(atomType, 3);

        var name = _atomType[0];
        var value = _atomType[1];
        var payload = _atomType[2];

        var atom = this.findAtom(name);

        return {
          atom: atom,
          value: value,
          payload: payload
        };
      }
    }, {
      key: '_renderAtom',
      value: function _renderAtom(index) {
        var _findAtomByIndex2 = this._findAtomByIndex(index);

        var atom = _findAtomByIndex2.atom;
        var value = _findAtomByIndex2.value;
        var payload = _findAtomByIndex2.payload;

        var atomArg = this._createAtomArgument(atom, value, payload);
        var rendered = atom.render(atomArg);

        this._validateAtomRender(rendered, atom.name);

        return rendered || '';
      }
    }, {
      key: 'renderMarkers',
      value: function renderMarkers(markers) {
        var _this5 = this;

        var str = '';
        markers.forEach(function (m) {
          var _m = _slicedToArray(m, 4);

          var type = _m[0];
          var value = _m[3];

          switch (type) {
            case _mobiledocTextRendererUtilsMarkerTypes.MARKUP_MARKER_TYPE:
              str += value;
              break;
            case _mobiledocTextRendererUtilsMarkerTypes.ATOM_MARKER_TYPE:
              str += _this5._renderAtom(value);
              break;
            default:
              throw new Error('Unknown markup type (' + type + ')');
          }
        });
        return str;
      }
    }, {
      key: '_defaultUnknownCardHandler',
      get: function get() {
        return function () {
          // for the text renderer, a missing card is a no-op
        };
      }
    }, {
      key: '_defaultUnknownAtomHandler',
      get: function get() {
        return function (_ref5) {
          var value = _ref5.value;

          return value || '';
        };
      }
    }]);

    return Renderer;
  })();

  exports['default'] = Renderer;
});
define("mobiledoc-text-renderer/utils/marker-types", ["exports"], function (exports) {
  "use strict";

  var MARKUP_MARKER_TYPE = 0;
  exports.MARKUP_MARKER_TYPE = MARKUP_MARKER_TYPE;
  var ATOM_MARKER_TYPE = 1;
  exports.ATOM_MARKER_TYPE = ATOM_MARKER_TYPE;
});
define('mobiledoc-text-renderer/utils/render-type', ['exports'], function (exports) {
  'use strict';

  exports['default'] = 'text';
});
define("mobiledoc-text-renderer/utils/section-types", ["exports"], function (exports) {
  "use strict";

  var MARKUP_SECTION_TYPE = 1;
  exports.MARKUP_SECTION_TYPE = MARKUP_SECTION_TYPE;
  var IMAGE_SECTION_TYPE = 2;
  exports.IMAGE_SECTION_TYPE = IMAGE_SECTION_TYPE;
  var LIST_SECTION_TYPE = 3;
  exports.LIST_SECTION_TYPE = LIST_SECTION_TYPE;
  var CARD_SECTION_TYPE = 10;
  exports.CARD_SECTION_TYPE = CARD_SECTION_TYPE;
});//# sourceMappingURL=mobiledoc-kit.map