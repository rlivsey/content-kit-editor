'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _viewsTooltip = require('../views/tooltip');

var _post = require('./post');

var _cardsImage = require('../cards/image');

var _utilsKey = require('../utils/key');

var _utilsEventEmitter = require('../utils/event-emitter');

var _parsersMobiledoc = require('../parsers/mobiledoc');

var _parsersHtml = require('../parsers/html');

var _parsersDom = require('../parsers/dom');

var _renderersEditorDom = require('../renderers/editor-dom');

var _modelsRenderTree = require('../models/render-tree');

var _renderersMobiledoc = require('../renderers/mobiledoc');

var _utilsMerge = require('../utils/merge');

var _utilsDomUtils = require('../utils/dom-utils');

var _utilsArrayUtils = require('../utils/array-utils');

var _utilsElementUtils = require('../utils/element-utils');

var _utilsMixin = require('../utils/mixin');

var _utilsEventListener = require('../utils/event-listener');

var _utilsCursor = require('../utils/cursor');

var _utilsCursorRange = require('../utils/cursor/range');

var _modelsPostNodeBuilder = require('../models/post-node-builder');

var _textExpansions = require('./text-expansions');

var _keyCommands = require('./key-commands');

var _utilsStringUtils = require('../utils/string-utils');

var _utilsLifecycleCallbacks = require('../utils/lifecycle-callbacks');

var _modelsCard = require('../models/card');

var _utilsPasteUtils = require('../utils/paste-utils');

var _utilsCharacters = require('../utils/characters');

var _utilsAssert = require('../utils/assert');

var _editorMutationHandler = require('../editor/mutation-handler');

var _editorEditHistory = require('../editor/edit-history');

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

    (0, _utilsAssert['default'])('editor create accepts an options object. For legacy usage passing an element for the first argument, consider the `html` option for loading DOM or HTML posts. For other cases call `editor.render(domNode)` after editor creation', options && !options.nodeType);
    this._elementListeners = [];
    this._views = [];
    this.isEditable = null;
    this._parserPlugins = options.parserPlugins || [];

    // FIXME: This should merge onto this.options
    (0, _utilsMerge.mergeWithOptions)(this, defaults, options);

    this.cards.push(_cardsImage['default']);

    _textExpansions.DEFAULT_TEXT_EXPANSIONS.forEach(function (e) {
      return _this.registerExpansion(e);
    });
    _keyCommands.DEFAULT_KEY_COMMANDS.forEach(function (kc) {
      return _this.registerKeyCommand(kc);
    });

    this._parser = new _parsersDom['default'](this.builder);
    this._renderer = new _renderersEditorDom['default'](this, this.cards, this.atoms, this.unknownCardHandler, this.unknownAtomHandler, this.cardOptions);

    this.post = this.loadPost();
    this._renderTree = new _modelsRenderTree['default'](this.post);

    this._editHistory = new _editorEditHistory['default'](this, this.undoDepth);
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
        return _parsersMobiledoc['default'].parse(this.builder, this.mobiledoc);
      } else if (this.html) {
        if (typeof this.html === 'string') {
          var options = { plugins: this._parserPlugins };
          return new _parsersHtml['default'](this.builder, options).parse(this.html);
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
        (0, _utilsAssert['default'])('Must call `render` before `rerender` can be called', this.hasRendered);
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
      (0, _utilsAssert['default'])('Cannot render an editor twice. Use `rerender` to update the ' + 'rendering of an existing editor instance.', !this.hasRendered);

      (0, _utilsDomUtils.addClassName)(element, EDITOR_ELEMENT_CLASS_NAME);
      element.spellcheck = this.spellcheck;

      (0, _utilsDomUtils.clearChildNodes)(element);

      this.element = element;
      this._mutationHandler = new _editorMutationHandler['default'](this);
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
      this.addView(new _viewsTooltip['default']({
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
      (0, _utilsAssert['default'])('Expansion is not valid', (0, _textExpansions.validateExpansion)(expansion));
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
      var keyCommand = (0, _keyCommands.buildKeyCommand)(rawKeyCommand);
      (0, _utilsAssert['default'])('Key Command is not valid', (0, _keyCommands.validateKeyCommand)(keyCommand));
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
          postEditor.setRange(new _utilsCursorRange['default'](nextPosition));
        });
      } else if (event) {
        (function () {
          var key = _utilsKey['default'].fromEvent(event);
          _this3.run(function (postEditor) {
            var nextPosition = postEditor.deleteFrom(range.head, key.direction);
            var newRange = new _utilsCursorRange['default'](nextPosition);
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
            postEditor.setRange(new _utilsCursorRange['default'](cursorSection.headPosition()));
            return;
          }
        }
        cursorSection = postEditor.splitSection(range.head)[1];
        postEditor.setRange(new _utilsCursorRange['default'](cursorSection.headPosition()));
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
        this.selectRange(new _utilsCursorRange['default'](headSection.headPosition(), tailSection.tailPosition()));
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
      (0, _utilsElementUtils.setData)(this.element, 'placeholder', placeholder);
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
      (0, _utilsArrayUtils.forEach)((0, _utilsArrayUtils.filter)(this.post.sections, function (s) {
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
      return (0, _utilsArrayUtils.detect)(markups, function (markup) {
        return markup.hasTag(markupTagName);
      });
    }
  }, {
    key: 'serialize',
    value: function serialize() {
      var version = arguments.length <= 0 || arguments[0] === undefined ? _renderersMobiledoc.MOBILEDOC_VERSION : arguments[0];

      return _renderersMobiledoc['default'].render(this.post, version);
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
      this._setCardMode(cardSection, _modelsCard.CARD_MODES.EDIT);
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
      this._setCardMode(cardSection, _modelsCard.CARD_MODES.DISPLAY);
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
      var postEditor = new _post['default'](this);
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

      if ((0, _utilsArrayUtils.contains)(ELEMENT_EVENTS, eventName)) {
        var element = args[0].target;

        if (!this.cursor.isAddressable(element)) {
          // abort handling this event
          return true;
        }
      }

      var methodName = 'handle' + (0, _utilsStringUtils.capitalize)(eventName);
      (0, _utilsAssert['default'])('No handler "' + methodName + '" for ' + eventName, !!this[methodName]);

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
        postEditor.setRange(_utilsCursorRange['default'].fromSection(section));
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

      var key = _utilsKey['default'].fromEvent(event);
      var range = undefined,
          nextPosition = undefined;

      switch (true) {
        case key.isHorizontalArrow():
          range = this.cursor.offsets;
          var position = range.tail;
          if (range.direction === _utilsKey.DIRECTION.BACKWARD) {
            position = range.head;
          }
          nextPosition = position.move(key.direction);
          if (position.section.isCardSection || position.marker && position.marker.isAtom || nextPosition && nextPosition.marker && nextPosition.marker.isAtom) {
            if (nextPosition) {
              var newRange = undefined;
              if (key.isShift()) {
                newRange = range.moveFocusedPosition(key.direction);
              } else {
                newRange = new _utilsCursorRange['default'](nextPosition);
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
              var toInsert = key.isTab() ? _utilsCharacters.TAB : _utilsCharacters.SPACE;
              shouldPreventDefault = true;
              didEdit = true;
              nextPosition = postEditor.insertText(nextPosition, toInsert);
            }

            if (nextPosition.marker && nextPosition.marker.isAtom) {
              didEdit = true;
              // ensure that the cursor is properly repositioned one character forward
              // after typing on either side of an atom
              _this8.addCallbackOnce(CALLBACK_QUEUES.DID_REPARSE, function () {
                var position = nextPosition.move(_utilsKey.DIRECTION.FORWARD);
                var nextRange = new _utilsCursorRange['default'](position);

                _this8.run(function (postEditor) {
                  return postEditor.setRange(nextRange);
                });
              });
            }
            if (nextPosition && nextPosition !== range.head) {
              didEdit = true;
              postEditor.setRange(new _utilsCursorRange['default'](nextPosition));
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
      var expansion = (0, _textExpansions.findExpansion)(this.expansions, keyEvent, this);
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
      var keyCommands = (0, _keyCommands.findKeyCommands)(this.keyCommands, event);
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

      (0, _utilsPasteUtils.setClipboardCopyData)(event, this);
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

      var pastedPost = (0, _utilsPasteUtils.parsePostFromPaste)(event, this.builder, this._parserPlugins);

      this.run(function (postEditor) {
        var nextPosition = postEditor.insertPost(position, pastedPost);
        postEditor.setRange(new _utilsCursorRange['default'](nextPosition));
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
        this._builder = new _modelsPostNodeBuilder['default']();
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
      return new _utilsCursor['default'](this);
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

(0, _utilsMixin['default'])(Editor, _utilsEventEmitter['default']);
(0, _utilsMixin['default'])(Editor, _utilsEventListener['default']);
(0, _utilsMixin['default'])(Editor, _utilsLifecycleCallbacks['default']);

exports['default'] = Editor;