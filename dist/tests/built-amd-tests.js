define('tests/acceptance/basic-editor-test', ['exports', 'mobiledoc-kit', '../test-helpers', 'mobiledoc-kit/utils/cursor/range', 'mobiledoc-kit/utils/cursor/position', 'mobiledoc-kit/utils/characters', '../helpers/browsers'], function (exports, _mobiledocKit, _testHelpers, _mobiledocKitUtilsCursorRange, _mobiledocKitUtilsCursorPosition, _mobiledocKitUtilsCharacters, _helpersBrowsers) {
  'use strict';

  var test = _testHelpers['default'].test;
  var _module = _testHelpers['default'].module;

  var cards = [{
    name: 'my-card',
    type: 'dom',
    render: function render() {},
    edit: function edit() {}
  }];

  var editor = undefined,
      editorElement = undefined;

  _module('Acceptance: editor: basic', {
    beforeEach: function beforeEach() {
      editorElement = $('#editor')[0];
    },
    afterEach: function afterEach() {
      if (editor) {
        editor.destroy();
      }
    }
  });

  test('sets element as contenteditable', function (assert) {
    editor = new _mobiledocKit.Editor();
    editor.render(editorElement);

    assert.equal(editorElement.getAttribute('contenteditable'), 'true', 'element is contenteditable');
  });

  test('#disableEditing before render is meaningful', function (assert) {
    editor = new _mobiledocKit.Editor();
    editor.disableEditing();
    editor.render(editorElement);

    assert.ok(!editorElement.hasAttribute('contenteditable'), 'element is not contenteditable');
    editor.enableEditing();
    assert.equal(editorElement.getAttribute('contenteditable'), 'true', 'element is contenteditable');
  });

  test('when editing is disabled, the placeholder is not shown', function (assert) {
    editor = new _mobiledocKit.Editor({ placeholder: 'the placeholder' });
    editor.disableEditing();
    editor.render(editorElement);

    assert.ok(!$('#editor').data('placeholder'), 'no placeholder when disabled');
    editor.enableEditing();
    assert.equal($('#editor').data('placeholder'), 'the placeholder', 'placeholder is shown when editable');
  });

  test('#disableEditing and #enableEditing toggle contenteditable', function (assert) {
    editor = new _mobiledocKit.Editor();
    editor.render(editorElement);

    assert.equal(editorElement.getAttribute('contenteditable'), 'true', 'element is contenteditable');
    editor.disableEditing();
    assert.equal(editorElement.getAttribute('contenteditable'), 'false', 'element is not contenteditable');
    editor.enableEditing();
    assert.equal(editorElement.getAttribute('contenteditable'), 'true', 'element is contenteditable');
  });

  test('clicking outside the editor does not raise an error', function (assert) {
    var done = assert.async();
    editor = new _mobiledocKit.Editor({ autofocus: false });
    editor.render(editorElement);

    var secondEditorElement = document.createElement('div');
    document.body.appendChild(secondEditorElement);

    var secondEditor = new _mobiledocKit.Editor(); // This editor will be focused
    secondEditor.render(secondEditorElement);

    _testHelpers['default'].dom.triggerEvent(editorElement, 'click');

    // Embed intent uses setTimeout, so this assertion must
    // setTimeout after it to catch the exception during failure
    // cases.
    setTimeout(function () {
      assert.ok(true, 'can click external item without error');
      secondEditor.destroy();
      document.body.removeChild(secondEditorElement);

      done();
    });
  });

  test('typing in empty post correctly adds a section to it', function (assert) {
    var mobiledoc = _testHelpers['default'].mobiledoc.build(function (_ref) {
      var post = _ref.post;
      return post();
    });
    editor = new _mobiledocKit.Editor({ mobiledoc: mobiledoc });
    editor.render(editorElement);

    assert.hasElement('#editor');
    assert.hasNoElement('#editor p');

    _testHelpers['default'].dom.moveCursorTo(editorElement);
    _testHelpers['default'].dom.insertText(editor, 'X');
    assert.hasElement('#editor p:contains(X)');
    _testHelpers['default'].dom.insertText(editor, 'Y');
    assert.hasElement('#editor p:contains(XY)', 'inserts text at correct spot');
  });

  test('typing when on the end of a card is blocked', function (assert) {
    var mobiledoc = _testHelpers['default'].mobiledoc.build(function (_ref2) {
      var post = _ref2.post;
      var cardSection = _ref2.cardSection;

      return post([cardSection('my-card')]);
    });
    editor = new _mobiledocKit.Editor({ mobiledoc: mobiledoc, cards: cards });
    editor.render(editorElement);

    var endingZWNJ = $('#editor')[0].firstChild.lastChild;
    _testHelpers['default'].dom.moveCursorTo(endingZWNJ, 0);
    _testHelpers['default'].dom.insertText(editor, 'X');
    assert.hasNoElement('#editor div:contains(X)');
    _testHelpers['default'].dom.moveCursorTo(endingZWNJ, 1);
    _testHelpers['default'].dom.insertText(editor, 'Y');
    assert.hasNoElement('#editor div:contains(Y)');
  });

  test('typing when on the start of a card is blocked', function (assert) {
    var mobiledoc = _testHelpers['default'].mobiledoc.build(function (_ref3) {
      var post = _ref3.post;
      var cardSection = _ref3.cardSection;

      return post([cardSection('my-card')]);
    });
    editor = new _mobiledocKit.Editor({ mobiledoc: mobiledoc, cards: cards });
    editor.render(editorElement);

    var startingZWNJ = $('#editor')[0].firstChild.firstChild;
    _testHelpers['default'].dom.moveCursorTo(startingZWNJ, 0);
    _testHelpers['default'].dom.insertText(editor, 'X');
    assert.hasNoElement('#editor div:contains(X)');
    _testHelpers['default'].dom.moveCursorTo(startingZWNJ, 1);
    _testHelpers['default'].dom.insertText(editor, 'Y');
    assert.hasNoElement('#editor div:contains(Y)');
  });

  if (!(0, _helpersBrowsers.detectIE11)()) {
    // TODO: Make this test pass on IE11
    test('typing tab enters a tab character', function (assert) {
      var done = assert.async();
      var mobiledoc = _testHelpers['default'].mobiledoc.build(function (_ref4) {
        var post = _ref4.post;
        return post();
      });
      editor = new _mobiledocKit.Editor({ mobiledoc: mobiledoc });
      editor.render(editorElement);

      assert.hasElement('#editor');
      assert.hasNoElement('#editor p');

      _testHelpers['default'].dom.moveCursorTo($('#editor')[0]);
      _testHelpers['default'].dom.insertText(editor, _mobiledocKitUtilsCharacters.TAB);
      _testHelpers['default'].dom.insertText(editor, 'Y');
      window.setTimeout(function () {
        var expectedPost = _testHelpers['default'].postAbstract.build(function (_ref5) {
          var post = _ref5.post;
          var markupSection = _ref5.markupSection;
          var marker = _ref5.marker;

          return post([markupSection('p', [marker(_mobiledocKitUtilsCharacters.TAB + 'Y')])]);
        });
        assert.postIsSimilar(editor.post, expectedPost);
        done();
      }, 0);
    });
  }

  // see https://github.com/bustlelabs/mobiledoc-kit/issues/215
  test('select-all and type text works ok', function (assert) {
    var done = assert.async();
    var mobiledoc = _testHelpers['default'].mobiledoc.build(function (_ref6) {
      var post = _ref6.post;
      var markupSection = _ref6.markupSection;
      var marker = _ref6.marker;

      return post([markupSection('p', [marker('abc')])]);
    });
    editor = new _mobiledocKit.Editor({ mobiledoc: mobiledoc, cards: cards });
    editor.render(editorElement);

    _testHelpers['default'].dom.moveCursorTo(editorElement.firstChild, 0);
    document.execCommand('selectAll');

    assert.selectedText('abc', 'precond - abc is selected');
    assert.hasElement('#editor p:contains(abc)', 'precond - renders p');

    _testHelpers['default'].dom.insertText(editor, 'X');
    setTimeout(function () {
      assert.hasNoElement('#editor p:contains(abc)', 'replaces existing text');
      assert.hasElement('#editor p:contains(X)', 'inserts text');
      done();
    }, 0);
  });

  test('typing enter splits lines, sets cursor', function (assert) {
    var done = assert.async();
    var mobiledoc = _testHelpers['default'].mobiledoc.build(function (_ref7) {
      var post = _ref7.post;
      var markupSection = _ref7.markupSection;
      var marker = _ref7.marker;

      return post([markupSection('p', [marker('hihey')])]);
    });
    editor = new _mobiledocKit.Editor({ mobiledoc: mobiledoc });
    editor.render(editorElement);

    assert.hasElement('#editor p');

    _testHelpers['default'].dom.moveCursorTo($('#editor p')[0].firstChild, 2);
    _testHelpers['default'].dom.insertText(editor, _mobiledocKitUtilsCharacters.ENTER);
    window.setTimeout(function () {
      var expectedPost = _testHelpers['default'].postAbstract.build(function (_ref8) {
        var post = _ref8.post;
        var markupSection = _ref8.markupSection;
        var marker = _ref8.marker;

        return post([markupSection('p', [marker('hi')]), markupSection('p', [marker('hey')])]);
      });
      assert.postIsSimilar(editor.post, expectedPost, 'correctly encoded');
      var expectedRange = new _mobiledocKitUtilsCursorRange['default'](new _mobiledocKitUtilsCursorPosition['default'](editor.post.sections.tail, 0));
      assert.ok(expectedRange.isEqual(editor.range), 'range is at start of new section');
      done();
    }, 0);
  });

  // see https://github.com/bustlelabs/mobiledoc-kit/issues/306
  test('adding/removing bold text between two bold markers works', function (assert) {
    editor = _testHelpers['default'].mobiledoc.renderInto(editorElement, function (_ref9) {
      var post = _ref9.post;
      var markupSection = _ref9.markupSection;
      var marker = _ref9.marker;
      var markup = _ref9.markup;

      return post([markupSection('p', [marker('abc', [markup('b')]), marker('123', []), marker('def', [markup('b')])])]);
    });

    // preconditions
    assert.hasElement('#editor b:contains(abc)');
    assert.hasElement('#editor b:contains(def)');
    assert.hasNoElement('#editor b:contains(123)');

    _testHelpers['default'].dom.selectText('123', editorElement);
    editor.run(function (postEditor) {
      return postEditor.toggleMarkup('b');
    });

    assert.hasElement('#editor b:contains(abc123def)', 'adds B to selection');

    assert.equal(_testHelpers['default'].dom.getSelectedText(), '123', '123 still selected');

    editor.run(function (postEditor) {
      return postEditor.toggleMarkup('b');
    });

    assert.hasElement('#editor b:contains(abc)', 'removes B from middle, leaves abc');
    assert.hasElement('#editor b:contains(def)', 'removes B from middle, leaves def');
    assert.hasNoElement('#editor b:contains(123)', 'removes B from middle');
  });
});
define('tests/acceptance/cursor-movement-test', ['exports', 'mobiledoc-kit', '../test-helpers', 'mobiledoc-kit/utils/key', '../helpers/browsers', 'mobiledoc-kit/utils/cursor/range'], function (exports, _mobiledocKit, _testHelpers, _mobiledocKitUtilsKey, _helpersBrowsers, _mobiledocKitUtilsCursorRange) {
  'use strict';

  var test = _testHelpers['default'].test;
  var _module = _testHelpers['default'].module;

  var cards = [{
    name: 'my-card',
    type: 'dom',
    render: function render() {},
    edit: function edit() {}
  }];

  var atoms = [{
    name: 'my-atom',
    type: 'dom',
    render: function render() {
      return document.createTextNode('my-atom');
    }
  }];

  var editor = undefined,
      editorElement = undefined;
  var editorOptions = { cards: cards, atoms: atoms };

  _module('Acceptance: Cursor Movement', {
    beforeEach: function beforeEach() {
      editorElement = $('#editor')[0];
    },

    afterEach: function afterEach() {
      if (editor) {
        editor.destroy();
      }
    }
  });

  test('left arrow when at the end of a card moves the cursor across the card', function (assert) {
    var mobiledoc = _testHelpers['default'].mobiledoc.build(function (_ref) {
      var post = _ref.post;
      var cardSection = _ref.cardSection;

      return post([cardSection('my-card')]);
    });
    editor = new _mobiledocKit.Editor({ mobiledoc: mobiledoc, cards: cards });
    editor.render(editorElement);
    var cardHead = editor.post.sections.head.headPosition();

    // Before zwnj
    _testHelpers['default'].dom.moveCursorTo(editorElement.firstChild.lastChild, 0);
    _testHelpers['default'].dom.triggerLeftArrowKey(editor);
    var _editor = editor;
    var range = _editor.range;

    assert.positionIsEqual(range.head, cardHead);
    assert.positionIsEqual(range.tail, cardHead);

    // After zwnj
    _testHelpers['default'].dom.moveCursorTo(editorElement.firstChild.lastChild, 1);
    _testHelpers['default'].dom.triggerLeftArrowKey(editor);
    range = editor.range;

    assert.positionIsEqual(range.head, cardHead);
    assert.positionIsEqual(range.tail, cardHead);

    // On wrapper
    _testHelpers['default'].dom.moveCursorTo(editorElement.firstChild, 2);
    _testHelpers['default'].dom.triggerLeftArrowKey(editor);
    range = editor.range;

    assert.positionIsEqual(range.head, cardHead);
    assert.positionIsEqual(range.tail, cardHead);
  });

  test('left arrow when at the start of a card moves the cursor to the previous section', function (assert) {
    var mobiledoc = _testHelpers['default'].mobiledoc.build(function (_ref2) {
      var post = _ref2.post;
      var markupSection = _ref2.markupSection;
      var cardSection = _ref2.cardSection;

      return post([markupSection('p'), cardSection('my-card')]);
    });
    editor = new _mobiledocKit.Editor({ mobiledoc: mobiledoc, cards: cards });
    editor.render(editorElement);
    var sectionTail = editor.post.sections.head.tailPosition();

    // Before zwnj
    var sectionElement = editor.post.sections.tail.renderNode.element;
    _testHelpers['default'].dom.moveCursorTo(sectionElement.firstChild, 0);
    _testHelpers['default'].dom.triggerLeftArrowKey(editor);
    var _editor2 = editor;
    var range = _editor2.range;

    assert.positionIsEqual(range.head, sectionTail);
    assert.positionIsEqual(range.tail, sectionTail);

    // After zwnj
    _testHelpers['default'].dom.moveCursorTo(sectionElement.firstChild, 1);
    _testHelpers['default'].dom.triggerLeftArrowKey(editor);
    range = editor.range;

    assert.positionIsEqual(range.head, sectionTail);
    assert.positionIsEqual(range.tail, sectionTail);
  });

  test('left arrow when at the start of a card moves to previous list item', function (assert) {
    var mobiledoc = _testHelpers['default'].mobiledoc.build(function (_ref3) {
      var post = _ref3.post;
      var listSection = _ref3.listSection;
      var listItem = _ref3.listItem;
      var marker = _ref3.marker;
      var cardSection = _ref3.cardSection;

      return post([listSection('ul', [listItem([marker('abc')])]), cardSection('my-card')]);
    });
    editor = new _mobiledocKit.Editor({ mobiledoc: mobiledoc, cards: cards });
    editor.render(editorElement);
    var itemTail = editor.post.sections.head.items.head.tailPosition();

    // Before zwnj
    var sectionElement = editor.post.sections.tail.renderNode.element;
    _testHelpers['default'].dom.moveCursorTo(sectionElement.firstChild, 0);
    _testHelpers['default'].dom.triggerLeftArrowKey(editor);
    var _editor3 = editor;
    var range = _editor3.range;

    assert.positionIsEqual(range.head, itemTail);
    assert.positionIsEqual(range.tail, itemTail);

    // After zwnj
    sectionElement = editor.post.sections.tail.renderNode.element;
    _testHelpers['default'].dom.moveCursorTo(sectionElement.firstChild, 1);
    _testHelpers['default'].dom.triggerLeftArrowKey(editor);
    range = editor.range;

    assert.positionIsEqual(range.head, itemTail);
    assert.positionIsEqual(range.tail, itemTail);
  });

  test('right arrow at start of card moves the cursor across the card', function (assert) {
    var mobiledoc = _testHelpers['default'].mobiledoc.build(function (_ref4) {
      var post = _ref4.post;
      var cardSection = _ref4.cardSection;

      return post([cardSection('my-card')]);
    });
    editor = new _mobiledocKit.Editor({ mobiledoc: mobiledoc, cards: cards });
    editor.render(editorElement);
    var cardTail = editor.post.sections.head.tailPosition();

    // Before zwnj
    _testHelpers['default'].dom.moveCursorTo(editorElement.firstChild.firstChild, 0);
    _testHelpers['default'].dom.triggerRightArrowKey(editor);
    var _editor4 = editor;
    var range = _editor4.range;

    assert.positionIsEqual(range.head, cardTail);
    assert.positionIsEqual(range.tail, cardTail);

    // After zwnj
    _testHelpers['default'].dom.moveCursorTo(editorElement.firstChild.firstChild, 1);
    _testHelpers['default'].dom.triggerRightArrowKey(editor);
    range = editor.range;

    assert.positionIsEqual(range.head, cardTail);
    assert.positionIsEqual(range.tail, cardTail);
  });

  test('right arrow at end of card moves cursor to next section', function (assert) {
    var mobiledoc = _testHelpers['default'].mobiledoc.build(function (_ref5) {
      var post = _ref5.post;
      var markupSection = _ref5.markupSection;
      var cardSection = _ref5.cardSection;

      return post([cardSection('my-card'), markupSection('p')]);
    });
    editor = new _mobiledocKit.Editor({ mobiledoc: mobiledoc, cards: cards });
    editor.render(editorElement);
    var sectionHead = editor.post.sections.tail.headPosition();

    // Before zwnj
    var sectionElement = editor.post.sections.head.renderNode.element;
    _testHelpers['default'].dom.moveCursorTo(sectionElement.lastChild, 0);
    _testHelpers['default'].dom.triggerRightArrowKey(editor);
    var _editor5 = editor;
    var range = _editor5.range;

    assert.positionIsEqual(range.head, sectionHead);
    assert.positionIsEqual(range.tail, sectionHead);

    // After zwnj
    _testHelpers['default'].dom.moveCursorTo(sectionElement.lastChild, 1);
    _testHelpers['default'].dom.triggerRightArrowKey(editor);
    range = editor.range;

    // On wrapper
    _testHelpers['default'].dom.moveCursorTo(editorElement.firstChild, 2);
    _testHelpers['default'].dom.triggerRightArrowKey(editor);
    range = editor.range;

    assert.positionIsEqual(range.head, sectionHead);
    assert.positionIsEqual(range.tail, sectionHead);
  });

  test('right arrow at end of card moves cursor to next list item', function (assert) {
    var mobiledoc = _testHelpers['default'].mobiledoc.build(function (_ref6) {
      var post = _ref6.post;
      var listSection = _ref6.listSection;
      var listItem = _ref6.listItem;
      var marker = _ref6.marker;
      var cardSection = _ref6.cardSection;

      return post([cardSection('my-card'), listSection('ul', [listItem([marker('abc')])])]);
    });
    editor = new _mobiledocKit.Editor({ mobiledoc: mobiledoc, cards: cards });
    editor.render(editorElement);
    var itemHead = editor.post.sections.tail.items.head.headPosition();

    // Before zwnj
    var sectionElement = editor.post.sections.head.renderNode.element;
    _testHelpers['default'].dom.moveCursorTo(sectionElement.lastChild, 0);
    _testHelpers['default'].dom.triggerRightArrowKey(editor);
    var _editor6 = editor;
    var range = _editor6.range;

    assert.positionIsEqual(range.head, itemHead);
    assert.positionIsEqual(range.tail, itemHead);

    // After zwnj
    _testHelpers['default'].dom.moveCursorTo(sectionElement.lastChild, 1);
    _testHelpers['default'].dom.triggerRightArrowKey(editor);
    range = editor.range;

    assert.positionIsEqual(range.head, itemHead);
    assert.positionIsEqual(range.tail, itemHead);
  });

  test('left arrow when at the head of an atom moves the cursor left off the atom', function (assert) {
    var mobiledoc = _testHelpers['default'].mobiledoc.build(function (_ref7) {
      var post = _ref7.post;
      var markupSection = _ref7.markupSection;
      var marker = _ref7.marker;
      var atom = _ref7.atom;

      return post([markupSection('p', [marker('aa'), atom('my-atom'), marker('cc')])]);
      // TODO just make 0.3.0 default
    }, '0.3.0');
    editor = new _mobiledocKit.Editor({ mobiledoc: mobiledoc, atoms: atoms });
    editor.render(editorElement);

    var atomWrapper = editor.post.sections.head.markers.objectAt(1).renderNode.element;

    // Before zwnj, assert moving left
    _testHelpers['default'].dom.moveCursorTo(atomWrapper.lastChild, 0);
    _testHelpers['default'].dom.triggerLeftArrowKey(editor);
    var range = editor.range;

    assert.ok(range.head.section === editor.post.sections.head, 'Cursor is positioned on first section');
    assert.equal(range.head.offset, 2, 'Cursor is positioned at offset 2');

    // After zwnj, assert moving left
    _testHelpers['default'].dom.moveCursorTo(atomWrapper.lastChild, 1);
    _testHelpers['default'].dom.triggerLeftArrowKey(editor);
    range = editor.range;

    assert.ok(range.head.section === editor.post.sections.head, 'Cursor is positioned on first section');
    assert.equal(range.head.offset, 2, 'Cursor is positioned at offset 2');

    // On wrapper, assert moving left
    _testHelpers['default'].dom.moveCursorTo(atomWrapper, 3);
    _testHelpers['default'].dom.triggerLeftArrowKey(editor);
    range = editor.range;

    assert.ok(range.head.section === editor.post.sections.head, 'Cursor is positioned on first section');
    assert.equal(range.head.offset, 2, 'Cursor is positioned at offset 2');

    // After wrapper, asseat moving left
    _testHelpers['default'].dom.moveCursorTo(atomWrapper.nextSibling, 0);
    _testHelpers['default'].dom.triggerLeftArrowKey(editor);
    range = editor.range;

    assert.ok(range.head.section === editor.post.sections.head, 'Cursor is positioned on first section');
    assert.equal(range.head.offset, 2, 'Cursor is positioned at offset 2');
  });

  test('right arrow when at the head of an atom moves the cursor across the atom', function (assert) {
    var mobiledoc = _testHelpers['default'].mobiledoc.build(function (_ref8) {
      var post = _ref8.post;
      var markupSection = _ref8.markupSection;
      var marker = _ref8.marker;
      var atom = _ref8.atom;

      return post([markupSection('p', [marker('aa'), atom('my-atom'), marker('cc')])]);
      // TODO just make 0.3.0 default
    }, '0.3.0');
    editor = new _mobiledocKit.Editor({ mobiledoc: mobiledoc, atoms: atoms });
    editor.render(editorElement);

    var atomWrapper = editor.post.sections.head.markers.objectAt(1).renderNode.element;

    // Before zwnj, assert moving right
    _testHelpers['default'].dom.moveCursorTo(atomWrapper.firstChild, 0);
    _testHelpers['default'].dom.triggerRightArrowKey(editor);
    var range = editor.range;

    assert.ok(range.head.section === editor.post.sections.head, 'Cursor is positioned on first section');
    assert.equal(range.head.offset, 3, 'Cursor is positioned at offset 3');

    // After zwnj, assert moving right
    _testHelpers['default'].dom.moveCursorTo(atomWrapper.firstChild, 1);
    _testHelpers['default'].dom.triggerRightArrowKey(editor);
    range = editor.range;

    assert.ok(range.head.section === editor.post.sections.head, 'Cursor is positioned on first section');
    assert.equal(range.head.offset, 3, 'Cursor is positioned at offset 3');

    // On wrapper, assert moving right
    _testHelpers['default'].dom.moveCursorTo(atomWrapper, 1);
    _testHelpers['default'].dom.triggerRightArrowKey(editor);
    range = editor.range;

    assert.ok(range.head.section === editor.post.sections.head, 'Cursor is positioned on first section');
    assert.equal(range.head.offset, 3, 'Cursor is positioned at offset 3');

    // After wrapper, assert moving right
    _testHelpers['default'].dom.moveCursorTo(atomWrapper.previousSibling, 2);
    _testHelpers['default'].dom.triggerRightArrowKey(editor);
    range = editor.range;

    assert.ok(range.head.section === editor.post.sections.head, 'Cursor is positioned on first section');
    assert.equal(range.head.offset, 3, 'Cursor is positioned at offset 3');
  });

  test('left/right arrows moves cursor l-to-r and r-to-l across atom', function (assert) {
    editor = _testHelpers['default'].mobiledoc.renderInto(editorElement, function (_ref9) {
      var post = _ref9.post;
      var markupSection = _ref9.markupSection;
      var marker = _ref9.marker;
      var atom = _ref9.atom;

      return post([markupSection('p', [atom('my-atom', 'first')])]);
    }, editorOptions);

    editor.selectRange(new _mobiledocKitUtilsCursorRange['default'](editor.post.tailPosition()));
    _testHelpers['default'].dom.triggerLeftArrowKey(editor);
    assert.positionIsEqual(editor.range.head, editor.post.headPosition());
    assert.positionIsEqual(editor.range.tail, editor.post.headPosition());

    editor.selectRange(new _mobiledocKitUtilsCursorRange['default'](editor.post.headPosition()));
    _testHelpers['default'].dom.triggerRightArrowKey(editor);
    assert.positionIsEqual(editor.range.head, editor.post.tailPosition());
    assert.positionIsEqual(editor.range.tail, editor.post.tailPosition());
  });

  test('left arrow at start atom moves to end of prev section', function (assert) {
    editor = _testHelpers['default'].mobiledoc.renderInto(editorElement, function (_ref10) {
      var post = _ref10.post;
      var markupSection = _ref10.markupSection;
      var marker = _ref10.marker;
      var atom = _ref10.atom;

      return post([markupSection('p', [marker('abc')]), markupSection('p', [atom('my-atom', 'first')])]);
    }, editorOptions);

    editor.selectRange(new _mobiledocKitUtilsCursorRange['default'](editor.post.sections.tail.headPosition()));
    _testHelpers['default'].dom.triggerLeftArrowKey(editor);
    assert.positionIsEqual(editor.range.head, editor.post.sections.head.tailPosition());
  });

  test('right arrow at end of end atom moves to start of next section', function (assert) {
    editor = _testHelpers['default'].mobiledoc.renderInto(editorElement, function (_ref11) {
      var post = _ref11.post;
      var markupSection = _ref11.markupSection;
      var marker = _ref11.marker;
      var atom = _ref11.atom;

      return post([markupSection('p', [atom('my-atom', 'first')]), markupSection('p', [marker('abc')])]);
    }, editorOptions);

    editor.selectRange(new _mobiledocKitUtilsCursorRange['default'](editor.post.sections.head.tailPosition()));
    _testHelpers['default'].dom.triggerRightArrowKey(editor);
    assert.positionIsEqual(editor.range.head, editor.post.sections.tail.headPosition());
  });

  _module('Acceptance: Cursor Movement w/ shift', {
    beforeEach: function beforeEach() {
      editorElement = $('#editor')[0];
    },

    afterEach: function afterEach() {
      if (editor) {
        editor.destroy();
      }
    }
  });

  if ((0, _helpersBrowsers.supportsSelectionExtend)()) {
    // FIXME: Older versions of IE do not support `extends` on selection
    // objects, and thus cannot support highlighting left until we implement
    // selections without native APIs.
    test('left arrow when at the end of a card moves the selection across the card', function (assert) {
      var mobiledoc = _testHelpers['default'].mobiledoc.build(function (_ref12) {
        var post = _ref12.post;
        var cardSection = _ref12.cardSection;

        return post([cardSection('my-card')]);
      });
      editor = new _mobiledocKit.Editor({ mobiledoc: mobiledoc, cards: cards });
      editor.render(editorElement);

      var cardHead = editor.post.sections.head.headPosition();
      var cardTail = editor.post.sections.head.tailPosition();

      // Before zwnj
      _testHelpers['default'].dom.moveCursorTo(editorElement.firstChild.lastChild, 0);
      _testHelpers['default'].dom.triggerLeftArrowKey(editor, _mobiledocKitUtilsKey.MODIFIERS.SHIFT);
      var _editor7 = editor;
      var range = _editor7.range;

      assert.positionIsEqual(range.head, cardHead);
      assert.positionIsEqual(range.tail, cardTail);

      // After zwnj
      _testHelpers['default'].dom.moveCursorTo(editorElement.firstChild.lastChild, 1);
      _testHelpers['default'].dom.triggerLeftArrowKey(editor, _mobiledocKitUtilsKey.MODIFIERS.SHIFT);
      range = editor.range;

      assert.positionIsEqual(range.head, cardHead);
      assert.positionIsEqual(range.tail, cardTail);

      // On wrapper
      _testHelpers['default'].dom.moveCursorTo(editorElement.firstChild, 2);
      _testHelpers['default'].dom.triggerLeftArrowKey(editor, _mobiledocKitUtilsKey.MODIFIERS.SHIFT);
      range = editor.range;

      assert.positionIsEqual(range.head, cardHead);
      assert.positionIsEqual(range.tail, cardTail);
    });

    test('left arrow at start of card moves selection to prev section', function (assert) {
      var mobiledoc = _testHelpers['default'].mobiledoc.build(function (_ref13) {
        var post = _ref13.post;
        var markupSection = _ref13.markupSection;
        var marker = _ref13.marker;
        var cardSection = _ref13.cardSection;

        return post([markupSection('p', [marker('abc')]), cardSection('my-card')]);
      });
      editor = new _mobiledocKit.Editor({ mobiledoc: mobiledoc, cards: cards });
      editor.render(editorElement);

      var cardHead = editor.post.sections.tail.headPosition();
      var sectionTail = editor.post.sections.head.tailPosition();

      // Before zwnj
      _testHelpers['default'].dom.moveCursorTo(editorElement.lastChild.firstChild, 0);
      _testHelpers['default'].dom.triggerLeftArrowKey(editor, _mobiledocKitUtilsKey.MODIFIERS.SHIFT);
      var _editor8 = editor;
      var range = _editor8.range;

      assert.positionIsEqual(range.head, sectionTail);
      assert.positionIsEqual(range.tail, cardHead);

      // After zwnj
      _testHelpers['default'].dom.moveCursorTo(editorElement.lastChild.firstChild, 1);
      _testHelpers['default'].dom.triggerLeftArrowKey(editor, _mobiledocKitUtilsKey.MODIFIERS.SHIFT);
      range = editor.range;

      assert.positionIsEqual(range.head, sectionTail);
      assert.positionIsEqual(range.tail, cardHead);
    });

    test('left arrow at start of card moves selection to prev list item', function (assert) {
      var mobiledoc = _testHelpers['default'].mobiledoc.build(function (_ref14) {
        var post = _ref14.post;
        var listSection = _ref14.listSection;
        var listItem = _ref14.listItem;
        var marker = _ref14.marker;
        var cardSection = _ref14.cardSection;

        return post([listSection('ul', [listItem([marker('abc')])]), cardSection('my-card')]);
      });
      editor = new _mobiledocKit.Editor({ mobiledoc: mobiledoc, cards: cards });
      editor.render(editorElement);

      var cardHead = editor.post.sections.tail.headPosition();
      var sectionTail = editor.post.sections.head.items.head.tailPosition();

      // Before zwnj
      _testHelpers['default'].dom.moveCursorTo(editorElement.lastChild.firstChild, 0);
      _testHelpers['default'].dom.triggerLeftArrowKey(editor, _mobiledocKitUtilsKey.MODIFIERS.SHIFT);
      var _editor9 = editor;
      var range = _editor9.range;

      assert.positionIsEqual(range.head, sectionTail);
      assert.positionIsEqual(range.tail, cardHead);

      // After zwnj
      _testHelpers['default'].dom.moveCursorTo(editorElement.lastChild.firstChild, 1);
      _testHelpers['default'].dom.triggerLeftArrowKey(editor, _mobiledocKitUtilsKey.MODIFIERS.SHIFT);
      range = editor.range;

      assert.positionIsEqual(range.head, sectionTail);
      assert.positionIsEqual(range.tail, cardHead);
    });

    test('right arrow at start of card moves the cursor across the card', function (assert) {
      var mobiledoc = _testHelpers['default'].mobiledoc.build(function (_ref15) {
        var post = _ref15.post;
        var cardSection = _ref15.cardSection;

        return post([cardSection('my-card')]);
      });
      editor = new _mobiledocKit.Editor({ mobiledoc: mobiledoc, cards: cards });
      editor.render(editorElement);

      var cardHead = editor.post.sections.head.headPosition();
      var cardTail = editor.post.sections.head.tailPosition();

      // Before zwnj
      _testHelpers['default'].dom.moveCursorTo(editorElement.firstChild.firstChild, 0);
      _testHelpers['default'].dom.triggerRightArrowKey(editor, _mobiledocKitUtilsKey.MODIFIERS.SHIFT);
      var _editor10 = editor;
      var range = _editor10.range;

      assert.positionIsEqual(range.head, cardHead);
      assert.positionIsEqual(range.tail, cardTail);

      // After zwnj
      _testHelpers['default'].dom.moveCursorTo(editorElement.firstChild.firstChild, 1);
      _testHelpers['default'].dom.triggerRightArrowKey(editor, _mobiledocKitUtilsKey.MODIFIERS.SHIFT);
      range = editor.range;

      assert.positionIsEqual(range.head, cardHead);
      assert.positionIsEqual(range.tail, cardTail);
    });

    test('right arrow at end of card moves to next section', function (assert) {
      var mobiledoc = _testHelpers['default'].mobiledoc.build(function (_ref16) {
        var post = _ref16.post;
        var markupSection = _ref16.markupSection;
        var marker = _ref16.marker;
        var cardSection = _ref16.cardSection;

        return post([cardSection('my-card'), markupSection('p', [marker('abc')])]);
      });
      editor = new _mobiledocKit.Editor({ mobiledoc: mobiledoc, cards: cards });
      editor.render(editorElement);

      var cardTail = editor.post.sections.head.tailPosition();
      var sectionHead = editor.post.sections.tail.headPosition();

      // Before zwnj
      _testHelpers['default'].dom.moveCursorTo(editorElement.firstChild.lastChild, 0);
      _testHelpers['default'].dom.triggerRightArrowKey(editor, _mobiledocKitUtilsKey.MODIFIERS.SHIFT);
      var _editor11 = editor;
      var range = _editor11.range;

      assert.positionIsEqual(range.head, cardTail);
      assert.positionIsEqual(range.tail, sectionHead);

      // After zwnj
      _testHelpers['default'].dom.moveCursorTo(editorElement.firstChild.lastChild, 1);
      _testHelpers['default'].dom.triggerRightArrowKey(editor, _mobiledocKitUtilsKey.MODIFIERS.SHIFT);
      range = editor.range;

      assert.positionIsEqual(range.head, cardTail);
      assert.positionIsEqual(range.tail, sectionHead);
    });

    test('right arrow at end of card moves to next list item', function (assert) {
      var mobiledoc = _testHelpers['default'].mobiledoc.build(function (_ref17) {
        var post = _ref17.post;
        var listSection = _ref17.listSection;
        var listItem = _ref17.listItem;
        var marker = _ref17.marker;
        var cardSection = _ref17.cardSection;

        return post([cardSection('my-card'), listSection('ul', [listItem([marker('abc')])])]);
      });
      editor = new _mobiledocKit.Editor({ mobiledoc: mobiledoc, cards: cards });
      editor.render(editorElement);

      var cardTail = editor.post.sections.head.tailPosition();
      var itemHead = editor.post.sections.tail.items.head.headPosition();

      // Before zwnj
      _testHelpers['default'].dom.moveCursorTo(editorElement.firstChild.lastChild, 0);
      _testHelpers['default'].dom.triggerRightArrowKey(editor, _mobiledocKitUtilsKey.MODIFIERS.SHIFT);
      var _editor12 = editor;
      var range = _editor12.range;

      assert.positionIsEqual(range.head, cardTail);
      assert.positionIsEqual(range.tail, itemHead);

      // After zwnj
      _testHelpers['default'].dom.moveCursorTo(editorElement.firstChild.lastChild, 1);
      _testHelpers['default'].dom.triggerRightArrowKey(editor, _mobiledocKitUtilsKey.MODIFIERS.SHIFT);
      range = editor.range;

      assert.positionIsEqual(range.head, cardTail);
      assert.positionIsEqual(range.tail, itemHead);
    });

    test('left/right arrows move selection l-to-r and r-to-l across atom', function (assert) {
      editor = _testHelpers['default'].mobiledoc.renderInto(editorElement, function (_ref18) {
        var post = _ref18.post;
        var markupSection = _ref18.markupSection;
        var marker = _ref18.marker;
        var atom = _ref18.atom;

        return post([markupSection('p', [atom('my-atom', 'first')])]);
      }, editorOptions);

      editor.selectRange(new _mobiledocKitUtilsCursorRange['default'](editor.post.tailPosition()));
      _testHelpers['default'].dom.triggerLeftArrowKey(editor, _mobiledocKitUtilsKey.MODIFIERS.SHIFT);
      assert.positionIsEqual(editor.range.head, editor.post.headPosition());
      assert.positionIsEqual(editor.range.tail, editor.post.tailPosition());

      editor.selectRange(new _mobiledocKitUtilsCursorRange['default'](editor.post.headPosition()));
      _testHelpers['default'].dom.triggerRightArrowKey(editor, _mobiledocKitUtilsKey.MODIFIERS.SHIFT);
      assert.positionIsEqual(editor.range.head, editor.post.headPosition());
      assert.positionIsEqual(editor.range.tail, editor.post.tailPosition());
    });
  }
});
define('tests/acceptance/cursor-position-test', ['exports', 'mobiledoc-kit', '../test-helpers', 'mobiledoc-kit/utils/cursor/position'], function (exports, _mobiledocKit, _testHelpers, _mobiledocKitUtilsCursorPosition) {
  'use strict';

  var test = _testHelpers['default'].test;
  var _module = _testHelpers['default'].module;

  var cards = [{
    name: 'my-card',
    type: 'dom',
    render: function render() {},
    edit: function edit() {}
  }];

  var atoms = [{
    name: 'my-atom',
    type: 'dom',
    render: function render() {
      return document.createTextNode('my-atom');
    }
  }];

  var editor = undefined,
      editorElement = undefined;

  _module('Acceptance: Cursor Position', {
    beforeEach: function beforeEach() {
      editorElement = $('#editor')[0];
    },

    afterEach: function afterEach() {
      if (editor) {
        editor.destroy();
      }
    }
  });

  test('cursor in a markup section reports its position correctly', function (assert) {
    var mobiledoc = _testHelpers['default'].mobiledoc.build(function (_ref) {
      var post = _ref.post;
      var markupSection = _ref.markupSection;
      var marker = _ref.marker;

      return post([markupSection('p', [marker('abc')])]);
    });
    editor = new _mobiledocKit.Editor({ mobiledoc: mobiledoc });
    editor.render(editorElement);

    _testHelpers['default'].dom.moveCursorTo(editorElement.firstChild.firstChild, 1);
    var _editor = editor;
    var range = _editor.range;

    assert.ok(range.head.section === editor.post.sections.head, 'Cursor is positioned on first section');
    assert.equal(range.head.offset, 1, 'Cursor is positioned at offset 1');
  });

  test('cursor blank section reports its position correctly', function (assert) {
    var mobiledoc = _testHelpers['default'].mobiledoc.build(function (_ref2) {
      var post = _ref2.post;
      var markupSection = _ref2.markupSection;

      return post([markupSection('p')]);
    });
    editor = new _mobiledocKit.Editor({ mobiledoc: mobiledoc });
    editor.render(editorElement);

    _testHelpers['default'].dom.moveCursorTo(editorElement.firstChild.firstChild, 0);
    var _editor2 = editor;
    var range = _editor2.range;

    assert.positionIsEqual(range.head, editor.post.sections.head.headPosition());
  });

  test('cursor moved left from section after card is reported as on the card with offset 1', function (assert) {
    // Cannot actually move a cursor, so just emulate what things looks like after
    // the arrow key is pressed
    var mobiledoc = _testHelpers['default'].mobiledoc.build(function (_ref3) {
      var post = _ref3.post;
      var markupSection = _ref3.markupSection;
      var cardSection = _ref3.cardSection;

      return post([cardSection('my-card'), markupSection('p')]);
    });
    editor = new _mobiledocKit.Editor({ mobiledoc: mobiledoc, cards: cards });
    editor.render(editorElement);

    _testHelpers['default'].dom.moveCursorTo(editorElement.firstChild.lastChild, 1);
    var _editor3 = editor;
    var range = _editor3.range;

    assert.positionIsEqual(range.head, new _mobiledocKitUtilsCursorPosition['default'](editor.post.sections.head, 1));
  });

  test('cursor moved up from end of section after card is reported as on the card with offset 1', function (assert) {
    // Cannot actually move a cursor, so just emulate what things looks like after
    // the arrow key is pressed
    var mobiledoc = _testHelpers['default'].mobiledoc.build(function (_ref4) {
      var post = _ref4.post;
      var markupSection = _ref4.markupSection;
      var cardSection = _ref4.cardSection;

      return post([cardSection('my-card'), markupSection('p')]);
    });
    editor = new _mobiledocKit.Editor({ mobiledoc: mobiledoc, cards: cards });
    editor.render(editorElement);

    _testHelpers['default'].dom.moveCursorTo(editorElement.firstChild.lastChild, 0);
    var _editor4 = editor;
    var range = _editor4.range;

    assert.positionIsEqual(range.head, editor.post.sections.head.tailPosition());
  });

  test('cursor moved right from end of section before card is reported as on the card with offset 0', function (assert) {
    // Cannot actually move a cursor, so just emulate what things looks like after
    // the arrow key is pressed
    var mobiledoc = _testHelpers['default'].mobiledoc.build(function (_ref5) {
      var post = _ref5.post;
      var markupSection = _ref5.markupSection;
      var cardSection = _ref5.cardSection;

      return post([markupSection('p'), cardSection('my-card')]);
    });
    editor = new _mobiledocKit.Editor({ mobiledoc: mobiledoc, cards: cards });
    editor.render(editorElement);

    _testHelpers['default'].dom.moveCursorTo(editorElement.lastChild.firstChild, 0);
    var _editor5 = editor;
    var range = _editor5.range;

    assert.positionIsEqual(range.head, editor.post.sections.tail.headPosition());
  });

  test('cursor moved right from end of section before card is reported as on the card with offset 0', function (assert) {
    // Cannot actually move a cursor, so just emulate what things looks like after
    // the arrow key is pressed
    var mobiledoc = _testHelpers['default'].mobiledoc.build(function (_ref6) {
      var post = _ref6.post;
      var markupSection = _ref6.markupSection;
      var cardSection = _ref6.cardSection;

      return post([markupSection('p'), cardSection('my-card')]);
    });
    editor = new _mobiledocKit.Editor({ mobiledoc: mobiledoc, cards: cards });
    editor.render(editorElement);

    _testHelpers['default'].dom.moveCursorTo(editorElement.lastChild.firstChild, 1);
    var _editor6 = editor;
    var range = _editor6.range;

    assert.positionIsEqual(range.head, editor.post.sections.tail.headPosition());
  });

  test('cursor focused on card wrapper with 2 offset', function (assert) {
    // Cannot actually move a cursor, so just emulate what things looks like after
    // the arrow key is pressed
    var mobiledoc = _testHelpers['default'].mobiledoc.build(function (_ref7) {
      var post = _ref7.post;
      var markupSection = _ref7.markupSection;
      var cardSection = _ref7.cardSection;

      return post([markupSection('p'), cardSection('my-card')]);
    });
    editor = new _mobiledocKit.Editor({ mobiledoc: mobiledoc, cards: cards });
    editor.render(editorElement);

    // We need to create a selection starting from the markup section's node
    // in order for the tail to end up focused on a div instead of a text node
    // This only happens in Firefox
    _testHelpers['default'].dom.moveCursorTo(editorElement.firstChild.firstChild, 0, editorElement.lastChild, 2);

    var _editor7 = editor;
    var range = _editor7.range;

    assert.positionIsEqual(range.tail, editor.post.sections.tail.tailPosition());
  });

  // This can happen when using arrow+shift keys to select left across a card
  test('cursor focused on card wrapper with 0 offset', function (assert) {
    // Cannot actually move a cursor, so just emulate what things looks like after
    // the arrow key is pressed
    var mobiledoc = _testHelpers['default'].mobiledoc.build(function (_ref8) {
      var post = _ref8.post;
      var markupSection = _ref8.markupSection;
      var cardSection = _ref8.cardSection;

      return post([markupSection('p'), cardSection('my-card')]);
    });
    editor = new _mobiledocKit.Editor({ mobiledoc: mobiledoc, cards: cards });
    editor.render(editorElement);

    // We need to create a selection starting from the markup section's node
    // in order for the tail to end up focused on a div instead of a text node
    _testHelpers['default'].dom.moveCursorTo(editorElement.firstChild.firstChild, 0, editorElement.lastChild, 0);
    var _editor8 = editor;
    var range = _editor8.range;

    assert.positionIsEqual(range.tail, editor.post.sections.tail.headPosition());
  });

  // see https://github.com/bustlelabs/mobiledoc-kit/issues/215
  test('selecting the entire editor element reports a selection range of the entire post', function (assert) {
    var mobiledoc = _testHelpers['default'].mobiledoc.build(function (_ref9) {
      var post = _ref9.post;
      var markupSection = _ref9.markupSection;
      var marker = _ref9.marker;

      return post([markupSection('p', [marker('abc')]), markupSection('p', [marker('1234')])]);
    });
    editor = new _mobiledocKit.Editor({ mobiledoc: mobiledoc });
    editor.render(editorElement);

    _testHelpers['default'].dom.moveCursorTo(editorElement, 0, editorElement, editorElement.childNodes.length);
    var _editor9 = editor;
    var range = _editor9.range;

    assert.positionIsEqual(range.head, editor.post.sections.head.headPosition());
    assert.positionIsEqual(range.tail, editor.post.sections.tail.tailPosition());
  });

  test('when at the head of an atom', function (assert) {
    var mobiledoc = _testHelpers['default'].mobiledoc.build(function (_ref10) {
      var post = _ref10.post;
      var markupSection = _ref10.markupSection;
      var marker = _ref10.marker;
      var atom = _ref10.atom;

      return post([markupSection('p', [marker('aa'), atom('my-atom'), marker('cc')])]);
    });
    editor = new _mobiledocKit.Editor({ mobiledoc: mobiledoc, atoms: atoms });
    editor.render(editorElement);

    var atomWrapper = editor.post.sections.head.markers.objectAt(1).renderNode.element;

    // Before zwnj
    //
    _testHelpers['default'].dom.moveCursorTo(atomWrapper.firstChild, 0);
    var range = editor.range;

    var positionBeforeAtom = new _mobiledocKitUtilsCursorPosition['default'](editor.post.sections.head, 'aa'.length);

    assert.positionIsEqual(range.head, positionBeforeAtom);

    // After zwnj
    //
    _testHelpers['default'].dom.moveCursorTo(atomWrapper.firstChild, 1);
    range = editor.range;

    assert.positionIsEqual(range.head, positionBeforeAtom);

    // On wrapper
    //
    [0, 1].forEach(function (index) {
      _testHelpers['default'].dom.moveCursorTo(atomWrapper, index);
      range = editor.range;

      assert.positionIsEqual(range.head, positionBeforeAtom);
    });

    // text node before wrapper
    _testHelpers['default'].dom.moveCursorTo(atomWrapper.previousSibling, 2);
    range = editor.range;

    assert.positionIsEqual(range.head, positionBeforeAtom);
  });

  test('when at the tail of an atom', function (assert) {
    var mobiledoc = _testHelpers['default'].mobiledoc.build(function (_ref11) {
      var post = _ref11.post;
      var markupSection = _ref11.markupSection;
      var marker = _ref11.marker;
      var atom = _ref11.atom;

      return post([markupSection('p', [marker('aa'), atom('my-atom'), marker('cc')])]);
    });
    editor = new _mobiledocKit.Editor({ mobiledoc: mobiledoc, atoms: atoms });
    editor.render(editorElement);

    var atomWrapper = editor.post.sections.head.markers.objectAt(1).renderNode.element;
    var positionAfterAtom = new _mobiledocKitUtilsCursorPosition['default'](editor.post.sections.head, 'aa'.length + 1);

    // Before zwnj
    //
    _testHelpers['default'].dom.moveCursorTo(atomWrapper.lastChild, 0);
    var range = editor.range;

    assert.positionIsEqual(range.head, positionAfterAtom);

    // After zwnj
    //
    _testHelpers['default'].dom.moveCursorTo(atomWrapper.lastChild, 1);
    range = editor.range;

    assert.positionIsEqual(range.head, positionAfterAtom);

    // On wrapper
    //
    [2, 3].forEach(function (index) {
      _testHelpers['default'].dom.moveCursorTo(atomWrapper, index);
      range = editor.range;
      assert.positionIsEqual(range.head, positionAfterAtom);
    });

    // After wrapper
    //
    _testHelpers['default'].dom.moveCursorTo(atomWrapper.nextSibling, 0);
    range = editor.range;

    assert.positionIsEqual(range.head, positionAfterAtom);
  });
});
define('tests/acceptance/editor-atoms-test', ['exports', 'mobiledoc-kit', '../test-helpers', 'mobiledoc-kit/renderers/mobiledoc/0-3', 'mobiledoc-kit/utils/cursor/range', '../helpers/browsers'], function (exports, _mobiledocKit, _testHelpers, _mobiledocKitRenderersMobiledoc03, _mobiledocKitUtilsCursorRange, _helpersBrowsers) {
  'use strict';

  var test = _testHelpers['default'].test;
  var _module = _testHelpers['default'].module;

  var simpleAtom = {
    name: 'simple-atom',
    type: 'dom',
    render: function render(_ref) {
      var value = _ref.value;

      var element = document.createElement('span');
      element.setAttribute('id', 'simple-atom');
      element.appendChild(document.createTextNode(value));
      return element;
    }
  };

  var editor = undefined,
      editorElement = undefined;
  var mobiledocWithAtom = {
    version: _mobiledocKitRenderersMobiledoc03.MOBILEDOC_VERSION,
    atoms: [['simple-atom', 'Bob']],
    cards: [],
    markups: [],
    sections: [[1, "P", [[0, [], 0, "text before atom"], [1, [], 0, 0], [0, [], 0, "text after atom"]]]]
  };
  var editorOptions = { atoms: [simpleAtom] };

  _module('Acceptance: Atoms', {
    beforeEach: function beforeEach() {
      editorElement = $('#editor')[0];
    },

    afterEach: function afterEach() {
      if (editor) {
        editor.destroy();
        editor = null;
      }
    }
  });

  if (!(0, _helpersBrowsers.detectIE11)()) {
    // TODO: Make this test pass on IE11
    test('keystroke of character before starting atom inserts character', function (assert) {
      var done = assert.async();
      var expected = undefined;
      editor = _testHelpers['default'].mobiledoc.renderInto(editorElement, function (_ref2) {
        var post = _ref2.post;
        var atom = _ref2.atom;
        var markupSection = _ref2.markupSection;
        var marker = _ref2.marker;

        expected = post([markupSection('p', [marker('A'), atom('simple-atom', 'first')])]);
        return post([markupSection('p', [atom('simple-atom', 'first')])]);
      }, editorOptions);

      editor.selectRange(new _mobiledocKitUtilsCursorRange['default'](editor.post.headPosition()));
      _testHelpers['default'].dom.insertText(editor, 'A');

      setTimeout(function () {
        assert.postIsSimilar(editor.post, expected);
        assert.renderTreeIsEqual(editor._renderTree, expected);
        done();
      });
    });
  }

  if (!(0, _helpersBrowsers.detectIE11)()) {
    // TODO: Make this test pass on IE11
    test('keystroke of character before mid-text atom inserts character', function (assert) {
      var done = assert.async();
      var expected = undefined;
      editor = _testHelpers['default'].mobiledoc.renderInto(editorElement, function (_ref3) {
        var post = _ref3.post;
        var atom = _ref3.atom;
        var markupSection = _ref3.markupSection;
        var marker = _ref3.marker;

        expected = post([markupSection('p', [marker('ABC'), atom('simple-atom', 'first')])]);
        return post([markupSection('p', [marker('AB'), atom('simple-atom', 'first')])]);
      }, editorOptions);

      editor.selectRange(_mobiledocKitUtilsCursorRange['default'].create(editor.post.sections.head, 'AB'.length));
      _testHelpers['default'].dom.insertText(editor, 'C');

      setTimeout(function () {
        assert.postIsSimilar(editor.post, expected);
        assert.renderTreeIsEqual(editor._renderTree, expected);
        done();
      });
    });
  }

  if (!(0, _helpersBrowsers.detectIE11)()) {
    // TODO: Make this test pass on IE11
    test('keystroke of character after mid-text atom inserts character', function (assert) {
      var done = assert.async();
      var expected = undefined;
      editor = _testHelpers['default'].mobiledoc.renderInto(editorElement, function (_ref4) {
        var post = _ref4.post;
        var atom = _ref4.atom;
        var markupSection = _ref4.markupSection;
        var marker = _ref4.marker;

        expected = post([markupSection('p', [atom('simple-atom', 'first'), marker('ABC')])]);
        return post([markupSection('p', [atom('simple-atom', 'first'), marker('BC')])]);
      }, editorOptions);

      editor.selectRange(_mobiledocKitUtilsCursorRange['default'].create(editor.post.sections.head, 1));
      _testHelpers['default'].dom.insertText(editor, 'A');

      setTimeout(function () {
        assert.postIsSimilar(editor.post, expected);
        assert.renderTreeIsEqual(editor._renderTree, expected);
        done();
      });
    });
  }

  if (!(0, _helpersBrowsers.detectIE11)()) {
    // TODO: Make this test pass on IE11
    test('keystroke of character after end-text atom inserts character', function (assert) {
      var done = assert.async();
      var expected = undefined;
      editor = _testHelpers['default'].mobiledoc.renderInto(editorElement, function (_ref5) {
        var post = _ref5.post;
        var atom = _ref5.atom;
        var markupSection = _ref5.markupSection;
        var marker = _ref5.marker;

        expected = post([markupSection('p', [atom('simple-atom', 'first'), marker('A')])]);
        return post([markupSection('p', [atom('simple-atom', 'first')])]);
      }, editorOptions);

      editor.selectRange(_mobiledocKitUtilsCursorRange['default'].create(editor.post.sections.head, 1));
      _testHelpers['default'].dom.insertText(editor, 'A');

      setTimeout(function () {
        assert.postIsSimilar(editor.post, expected);
        assert.renderTreeIsEqual(editor._renderTree, expected);
        done();
      });
    });
  }

  test('keystroke of delete removes character after atom', function (assert) {
    editor = new _mobiledocKit.Editor({ mobiledoc: mobiledocWithAtom, atoms: [simpleAtom] });
    editor.render(editorElement);

    var pNode = $('#editor p')[0];
    _testHelpers['default'].dom.moveCursorTo(pNode.lastChild, 1);
    _testHelpers['default'].dom.triggerDelete(editor);

    assert.postIsSimilar(editor.post, _testHelpers['default'].postAbstract.build(function (_ref6) {
      var post = _ref6.post;
      var markupSection = _ref6.markupSection;
      var atom = _ref6.atom;
      var marker = _ref6.marker;

      return post([markupSection('p', [marker('text before atom'), atom('simple-atom', 'Bob'), marker('ext after atom')])]);
    }));
  });

  test('keystroke of delete removes atom', function (assert) {
    editor = new _mobiledocKit.Editor({ mobiledoc: mobiledocWithAtom, atoms: [simpleAtom] });
    editor.render(editorElement);

    var pNode = $('#editor p')[0];
    _testHelpers['default'].dom.moveCursorTo(pNode.lastChild, 0);
    _testHelpers['default'].dom.triggerDelete(editor);

    assert.postIsSimilar(editor.post, _testHelpers['default'].postAbstract.build(function (_ref7) {
      var post = _ref7.post;
      var markupSection = _ref7.markupSection;
      var atom = _ref7.atom;
      var marker = _ref7.marker;

      return post([markupSection('p', [marker('text before atomtext after atom')])]);
    }));
  });

  test('keystroke of forward delete removes atom', function (assert) {
    editor = new _mobiledocKit.Editor({ mobiledoc: mobiledocWithAtom, atoms: [simpleAtom] });
    editor.render(editorElement);

    var pNode = $('#editor p')[0];
    _testHelpers['default'].dom.moveCursorTo(pNode.firstChild, 16);
    _testHelpers['default'].dom.triggerForwardDelete(editor);

    assert.postIsSimilar(editor.post, _testHelpers['default'].postAbstract.build(function (_ref8) {
      var post = _ref8.post;
      var markupSection = _ref8.markupSection;
      var atom = _ref8.atom;
      var marker = _ref8.marker;

      return post([markupSection('p', [marker('text before atomtext after atom')])]);
    }));
  });

  test('keystroke of enter in section with atom creates new section', function (assert) {
    editor = new _mobiledocKit.Editor({ mobiledoc: mobiledocWithAtom, atoms: [simpleAtom] });
    editor.render(editorElement);

    var pNode = $('#editor p')[0];
    _testHelpers['default'].dom.moveCursorTo(pNode.lastChild, 1);
    _testHelpers['default'].dom.triggerEnter(editor);

    assert.postIsSimilar(editor.post, _testHelpers['default'].postAbstract.build(function (_ref9) {
      var post = _ref9.post;
      var markupSection = _ref9.markupSection;
      var atom = _ref9.atom;
      var marker = _ref9.marker;

      return post([markupSection('p', [marker('text before atom'), atom('simple-atom', 'Bob'), marker('t')]), markupSection('p', [marker('ext after atom')])]);
    }));
  });

  test('keystroke of enter after atom and before marker creates new section', function (assert) {
    editor = new _mobiledocKit.Editor({ mobiledoc: mobiledocWithAtom, atoms: [simpleAtom] });
    editor.render(editorElement);

    var pNode = $('#editor p')[0];
    _testHelpers['default'].dom.moveCursorTo(pNode.lastChild, 0);
    _testHelpers['default'].dom.triggerEnter(editor);

    assert.postIsSimilar(editor.post, _testHelpers['default'].postAbstract.build(function (_ref10) {
      var post = _ref10.post;
      var markupSection = _ref10.markupSection;
      var atom = _ref10.atom;
      var marker = _ref10.marker;

      return post([markupSection('p', [marker('text before atom'), atom('simple-atom', 'Bob')]), markupSection('p', [marker('text after atom')])]);
    }));
  });

  test('keystroke of enter before atom and after marker creates new section', function (assert) {
    editor = new _mobiledocKit.Editor({ mobiledoc: mobiledocWithAtom, atoms: [simpleAtom] });
    editor.render(editorElement);

    var pNode = $('#editor p')[0];
    _testHelpers['default'].dom.moveCursorTo(pNode.firstChild, 16);
    _testHelpers['default'].dom.triggerEnter(editor);

    assert.postIsSimilar(editor.post, _testHelpers['default'].postAbstract.build(function (_ref11) {
      var post = _ref11.post;
      var markupSection = _ref11.markupSection;
      var atom = _ref11.atom;
      var marker = _ref11.marker;

      return post([markupSection('p', [marker('text before atom')]), markupSection('p', [atom('simple-atom', 'Bob'), marker('text after atom')])]);
    }));
  });

  // see https://github.com/bustlelabs/mobiledoc-kit/issues/313
  test('keystroke of enter at markup section head before atom creates new section', function (assert) {
    var expected = undefined;
    editor = _testHelpers['default'].mobiledoc.renderInto(editorElement, function (_ref12) {
      var post = _ref12.post;
      var markupSection = _ref12.markupSection;
      var atom = _ref12.atom;

      expected = post([markupSection('p'), markupSection('p', [atom('simple-atom')])]);
      return post([markupSection('p', [atom('simple-atom')])]);
    }, editorOptions);

    editor.run(function (postEditor) {
      postEditor.setRange(new _mobiledocKitUtilsCursorRange['default'](editor.post.headPosition()));
    });
    _testHelpers['default'].dom.triggerEnter(editor);

    assert.postIsSimilar(editor.post, expected);
    assert.renderTreeIsEqual(editor._renderTree, expected);
    assert.positionIsEqual(editor.range.head, editor.post.sections.tail.headPosition());
  });

  // see https://github.com/bustlelabs/mobiledoc-kit/issues/313
  test('keystroke of enter at list item head before atom creates new section', function (assert) {
    var expected = undefined;
    editor = _testHelpers['default'].mobiledoc.renderInto(editorElement, function (_ref13) {
      var post = _ref13.post;
      var listSection = _ref13.listSection;
      var listItem = _ref13.listItem;
      var atom = _ref13.atom;
      var marker = _ref13.marker;

      var blankMarker = marker();
      expected = post([listSection('ul', [listItem([blankMarker]), listItem([atom('simple-atom', 'X')])])]);
      return post([listSection('ul', [listItem([atom('simple-atom', 'X')])])]);
    }, editorOptions);

    editor.run(function (postEditor) {
      postEditor.setRange(new _mobiledocKitUtilsCursorRange['default'](editor.post.headPosition()));
    });
    _testHelpers['default'].dom.triggerEnter(editor);

    assert.postIsSimilar(editor.post, expected);
    // FIXME the render tree does not have the blank marker render node
    // because ListItem#isBlank is true, so it simply renders a cursor-positioning
    // `<br>` tag instead of an empy marker, so the following render tree check
    // is not accurate:
    // assert.renderTreeIsEqual(editor._renderTree, expected);
    assert.positionIsEqual(editor.range.head, editor.post.sections.head.items.tail.headPosition());
  });

  test('marking atom with markup adds markup', function (assert) {
    editor = new _mobiledocKit.Editor({ mobiledoc: mobiledocWithAtom, atoms: [simpleAtom] });
    editor.render(editorElement);

    var pNode = $('#editor p')[0];
    _testHelpers['default'].dom.selectRange(pNode.firstChild, 16, pNode.lastChild, 0);
    editor.run(function (postEditor) {
      var markup = editor.builder.createMarkup('strong');
      postEditor.addMarkupToRange(editor.range, markup);
    });

    assert.postIsSimilar(editor.post, _testHelpers['default'].postAbstract.build(function (_ref14) {
      var post = _ref14.post;
      var markupSection = _ref14.markupSection;
      var atom = _ref14.atom;
      var marker = _ref14.marker;
      var markup = _ref14.markup;

      return post([markupSection('p', [marker('text before atom'), atom('simple-atom', 'Bob', {}, [markup('strong')]), marker('text after atom')])]);
    }));
  });

  if (!(0, _helpersBrowsers.detectIE11)()) {
    // TODO: Make this test pass on IE11
    test('typing between two atoms inserts character', function (assert) {
      var done = assert.async();
      var expected = undefined;
      editor = _testHelpers['default'].mobiledoc.renderInto(editorElement, function (_ref15) {
        var post = _ref15.post;
        var markupSection = _ref15.markupSection;
        var atom = _ref15.atom;
        var marker = _ref15.marker;

        expected = post([markupSection('p', [atom('simple-atom', 'first'), marker('A'), atom('simple-atom', 'last')])]);
        return post([markupSection('p', [atom('simple-atom', 'first'), atom('simple-atom', 'last')])]);
      }, editorOptions);

      editor.selectRange(_mobiledocKitUtilsCursorRange['default'].create(editor.post.sections.head, 1));

      _testHelpers['default'].dom.insertText(editor, 'A');

      setTimeout(function () {
        assert.postIsSimilar(editor.post, expected);
        assert.renderTreeIsEqual(editor._renderTree, expected);
        done();
      });
    });
  }

  test('delete selected text including atom deletes atom', function (assert) {
    var expected = undefined;
    editor = _testHelpers['default'].mobiledoc.renderInto(editorElement, function (_ref16) {
      var post = _ref16.post;
      var markupSection = _ref16.markupSection;
      var marker = _ref16.marker;
      var atom = _ref16.atom;

      expected = post([markupSection('p', [marker('abc')])]);
      return post([markupSection('p', [marker('ab'), atom('simple-atom', 'deleteme'), marker('c')])]);
    }, editorOptions);

    var section = editor.post.sections.head;
    editor.selectRange(_mobiledocKitUtilsCursorRange['default'].create(section, 'ab'.length, section, 'ab'.length + 1));

    _testHelpers['default'].dom.triggerDelete(editor);

    assert.postIsSimilar(editor.post, expected);
    assert.renderTreeIsEqual(editor._renderTree, expected);
  });

  test('delete selected text that ends between atoms deletes first atom', function (assert) {
    var expected = undefined;
    editor = _testHelpers['default'].mobiledoc.renderInto(editorElement, function (_ref17) {
      var post = _ref17.post;
      var markupSection = _ref17.markupSection;
      var marker = _ref17.marker;
      var atom = _ref17.atom;

      expected = post([markupSection('p', [marker('abd'), atom('simple-atom', 'keepme')])]);
      return post([markupSection('p', [marker('ab'), atom('simple-atom', 'deleteme'), marker('cd'), atom('simple-atom', 'keepme')])]);
    }, editorOptions);

    var section = editor.post.sections.head;
    editor.selectRange(_mobiledocKitUtilsCursorRange['default'].create(section, 'ab'.length, section, 'ab'.length + 1 + 'c'.length));

    _testHelpers['default'].dom.triggerDelete(editor);

    assert.postIsSimilar(editor.post, expected);
    assert.renderTreeIsEqual(editor._renderTree, expected);
  });
});
define('tests/acceptance/editor-cards-test', ['exports', 'mobiledoc-kit', 'mobiledoc-kit/utils/key', 'mobiledoc-kit/utils/cursor/range', '../test-helpers', 'mobiledoc-kit/models/card'], function (exports, _mobiledocKit, _mobiledocKitUtilsKey, _mobiledocKitUtilsCursorRange, _testHelpers, _mobiledocKitModelsCard) {
  'use strict';

  var test = _testHelpers['default'].test;
  var _module = _testHelpers['default'].module;

  var editor = undefined,
      editorElement = undefined;
  var cardText = 'card text';

  var mobiledoc = _testHelpers['default'].mobiledoc.build(function (_ref) {
    var post = _ref.post;
    var cardSection = _ref.cardSection;

    return post([cardSection('simple-card')]);
  });

  var simpleCard = {
    name: 'simple-card',
    type: 'dom',
    render: function render(_ref2) {
      var env = _ref2.env;

      var element = document.createElement('div');

      var button = document.createElement('button');
      button.setAttribute('id', 'display-button');
      element.appendChild(button);
      element.appendChild(document.createTextNode(cardText));
      button.onclick = env.edit;

      return element;
    },
    edit: function edit(_ref3) {
      var env = _ref3.env;

      var button = document.createElement('button');
      button.setAttribute('id', 'edit-button');
      button.onclick = env.save;
      return button;
    }
  };

  var positionCard = {
    name: 'simple-card',
    type: 'dom',
    render: function render() {
      return $('<div id="my-simple-card"></div>')[0];
    }
  };

  _module('Acceptance: editor: cards', {
    beforeEach: function beforeEach() {
      editorElement = $('#editor')[0];
    },
    afterEach: function afterEach() {
      if (editor) {
        editor.destroy();
      }
    }
  });

  test('changing to display state triggers update on editor', function (assert) {
    var cards = [simpleCard];
    editor = new _mobiledocKit.Editor({ mobiledoc: mobiledoc, cards: cards });
    editor.render(editorElement);

    var updateCount = 0,
        triggeredUpdate = function triggeredUpdate() {
      return updateCount++;
    };
    editor.on('update', triggeredUpdate);

    var displayButton = document.getElementById('display-button');
    assert.ok(!!displayButton, 'precond - display button is there');

    _testHelpers['default'].dom.triggerEvent(displayButton, 'click');

    var editButton = document.getElementById('edit-button');
    assert.ok(!!editButton, 'precond - edit button is there after clicking the display button');

    var currentUpdateCount = updateCount;

    _testHelpers['default'].dom.triggerEvent(editButton, 'click');

    assert.equal(updateCount, currentUpdateCount + 1, 'update is triggered after switching to display mode');
  });

  test('editor listeners are quieted for card actions', function (assert) {
    var done = assert.async();

    var cards = [simpleCard];
    editor = new _mobiledocKit.Editor({ mobiledoc: mobiledoc, cards: cards });
    editor.render(editorElement);

    _testHelpers['default'].dom.selectText(cardText, editorElement);
    _testHelpers['default'].dom.triggerEvent(document, 'mouseup');

    setTimeout(function () {
      // FIXME should have a better assertion here
      assert.ok(true, 'made it here with no javascript errors');
      done();
    });
  });

  test('removing last card from mobiledoc allows additional editing', function (assert) {
    var done = assert.async();
    var button = undefined;
    var cards = [{
      name: 'simple-card',
      type: 'dom',
      render: function render(_ref4) {
        var env = _ref4.env;

        button = $('<button>Click me</button>');
        button.on('click', env.remove);
        return button[0];
      }
    }];
    editor = new _mobiledocKit.Editor({ mobiledoc: mobiledoc, cards: cards });
    editor.render(editorElement);

    assert.hasElement('#editor button:contains(Click me)', 'precond - button');

    button.click();

    setTimeout(function () {
      assert.hasNoElement('#editor button:contains(Click me)', 'button is removed');
      assert.hasNoElement('#editor p');
      _testHelpers['default'].dom.moveCursorTo($('#editor')[0]);
      _testHelpers['default'].dom.insertText(editor, 'X');
      assert.hasElement('#editor p:contains(X)');

      done();
    });
  });

  test('delete when cursor is positioned at end of a card deletes card, replace with empty markup section', function (assert) {
    var mobiledoc = _testHelpers['default'].mobiledoc.build(function (_ref5) {
      var post = _ref5.post;
      var cardSection = _ref5.cardSection;

      return post([cardSection(positionCard.name)]);
    });

    editor = new _mobiledocKit.Editor({ mobiledoc: mobiledoc, cards: [positionCard] });
    editor.render(editorElement);

    assert.hasElement('#my-simple-card', 'precond - renders card');
    assert.hasNoElement('#editor p', 'precond - has no markup section');

    editor.selectRange(_mobiledocKitUtilsCursorRange['default'].create(editor.post.sections.head, 1));
    _testHelpers['default'].dom.triggerDelete(editor);

    assert.hasNoElement('#my-simple-card', 'removes card after delete');
    assert.hasElement('#editor p', 'has markup section after delete');
  });

  test('delete when cursor is at start of a card and prev section is blank deletes prev section', function (assert) {
    var mobiledoc = _testHelpers['default'].mobiledoc.build(function (_ref6) {
      var post = _ref6.post;
      var cardSection = _ref6.cardSection;
      var markupSection = _ref6.markupSection;

      return post([markupSection('p'), cardSection(positionCard.name)]);
    });

    editor = new _mobiledocKit.Editor({ mobiledoc: mobiledoc, cards: [positionCard] });
    editor.render(editorElement);

    assert.hasElement('#my-simple-card', 'precond - renders card');
    assert.hasElement('#editor p', 'precond - has blank markup section');

    editor.selectRange(_mobiledocKitUtilsCursorRange['default'].create(editor.post.sections.tail, 0));
    _testHelpers['default'].dom.triggerDelete(editor);

    assert.hasElement('#my-simple-card', 'card still exists after delete');
    assert.hasNoElement('#editor p', 'blank markup section deleted');
  });

  test('forward-delete when cursor is positioned at start of a card deletes card, replace with empty markup section', function (assert) {
    var mobiledoc = _testHelpers['default'].mobiledoc.build(function (_ref7) {
      var post = _ref7.post;
      var cardSection = _ref7.cardSection;

      return post([cardSection(positionCard.name)]);
    });

    editor = new _mobiledocKit.Editor({ mobiledoc: mobiledoc, cards: [positionCard] });
    editor.render(editorElement);

    assert.hasElement('#my-simple-card', 'precond - renders card');
    assert.hasNoElement('#editor p', 'precond - has no markup section');

    editor.selectRange(_mobiledocKitUtilsCursorRange['default'].create(editor.post.sections.head, 0));
    _testHelpers['default'].dom.triggerDelete(editor, _mobiledocKitUtilsKey.DIRECTION.FORWARD);

    assert.hasNoElement('#my-simple-card', 'removes card after delete');
    assert.hasElement('#editor p', 'has markup section after delete');
  });

  test('forward-delete when cursor is positioned at end of a card and next section is blank deletes next section', function (assert) {
    var mobiledoc = _testHelpers['default'].mobiledoc.build(function (_ref8) {
      var post = _ref8.post;
      var cardSection = _ref8.cardSection;
      var markupSection = _ref8.markupSection;

      return post([cardSection(positionCard.name), markupSection()]);
    });

    editor = new _mobiledocKit.Editor({ mobiledoc: mobiledoc, cards: [positionCard] });
    editor.render(editorElement);

    assert.hasElement('#my-simple-card', 'precond - renders card');
    assert.hasElement('#editor p', 'precond - has blank markup section');

    editor.selectRange(_mobiledocKitUtilsCursorRange['default'].create(editor.post.sections.head, 1));
    _testHelpers['default'].dom.triggerDelete(editor, _mobiledocKitUtilsKey.DIRECTION.FORWARD);

    assert.hasElement('#my-simple-card', 'still has card after delete');
    assert.hasNoElement('#editor p', 'deletes blank markup section');
  });

  test('selecting a card and deleting deletes the card', function (assert) {
    var mobiledoc = _testHelpers['default'].mobiledoc.build(function (_ref9) {
      var post = _ref9.post;
      var cardSection = _ref9.cardSection;

      return post([cardSection(positionCard.name)]);
    });

    editor = new _mobiledocKit.Editor({ mobiledoc: mobiledoc, cards: [positionCard] });
    editor.render(editorElement);

    assert.hasElement('#my-simple-card', 'precond - renders card');
    assert.hasNoElement('#editor p', 'precond - has no markup section');

    editor.selectSections([editor.post.sections.head]);
    _testHelpers['default'].dom.triggerDelete(editor);

    assert.hasNoElement('#my-simple-card', 'has no card after delete');
    assert.hasElement('#editor p', 'has blank markup section');
  });

  test('selecting a card and some text after and deleting deletes card and text', function (assert) {
    var mobiledoc = _testHelpers['default'].mobiledoc.build(function (_ref10) {
      var post = _ref10.post;
      var cardSection = _ref10.cardSection;
      var markupSection = _ref10.markupSection;
      var marker = _ref10.marker;

      return post([cardSection(positionCard.name), markupSection('p', [marker('abc')])]);
    });

    editor = new _mobiledocKit.Editor({ mobiledoc: mobiledoc, cards: [positionCard] });
    editor.render(editorElement);

    assert.hasElement('#my-simple-card', 'precond - renders card');
    assert.hasElement('#editor p:contains(abc)', 'precond - has markup section');

    _testHelpers['default'].dom.moveCursorTo(editorElement.firstChild.firstChild, 0, editorElement.lastChild.firstChild, 1);
    _testHelpers['default'].dom.triggerDelete(editor);

    assert.hasNoElement('#my-simple-card', 'has no card after delete');
    var p = $('#editor p');
    assert.equal(p.length, 1, 'only 1 paragraph');
    assert.equal(p.text(), 'bc', '"a" is deleted from markup section');
  });

  test('deleting at start of empty markup section with prev card deletes the markup section', function (assert) {
    var mobiledoc = _testHelpers['default'].mobiledoc.build(function (_ref11) {
      var post = _ref11.post;
      var cardSection = _ref11.cardSection;
      var markupSection = _ref11.markupSection;

      return post([cardSection(positionCard.name), markupSection('p')]);
    });

    editor = new _mobiledocKit.Editor({ mobiledoc: mobiledoc, cards: [positionCard] });
    editor.render(editorElement);

    assert.hasElement('#my-simple-card', 'precond - renders card');
    assert.hasElement('#editor p', 'precond - has blank markup section');

    editor.selectRange(_mobiledocKitUtilsCursorRange['default'].create(editor.post.sections.tail, 0));
    _testHelpers['default'].dom.triggerDelete(editor);

    assert.hasElement('#my-simple-card', 'has card after delete');
    assert.hasNoElement('#editor p', 'paragraph is gone');

    var _editor = editor;
    var range = _editor.range;

    assert.ok(range.head.section === editor.post.sections.head, 'correct cursor position');
    assert.equal(range.head.offset, 1, 'correct cursor offset');
  });

  test('press enter at end of card inserts section after card', function (assert) {
    var mobiledoc = _testHelpers['default'].mobiledoc.build(function (_ref12) {
      var post = _ref12.post;
      var cardSection = _ref12.cardSection;

      return post([cardSection(positionCard.name)]);
    });

    editor = new _mobiledocKit.Editor({ mobiledoc: mobiledoc, cards: [positionCard] });
    editor.render(editorElement);

    assert.hasElement('#my-simple-card', 'precond - renders card');
    assert.hasNoElement('#editor p', 'precond - has no markup section');

    editor.selectRange(_mobiledocKitUtilsCursorRange['default'].create(editor.post.sections.tail, 1));
    _testHelpers['default'].dom.triggerEnter(editor);

    assert.hasElement('#my-simple-card', 'has card after enter');
    assert.hasElement('#editor p', 'markup section is added');

    var _editor2 = editor;
    var range = _editor2.range;

    assert.ok(!editor.post.sections.tail.isCardSection, 'markup section (not card secton) is at end of post abstract');
    assert.ok(range.head.section === editor.post.sections.tail, 'correct cursor position');
    assert.equal(range.head.offset, 0, 'correct cursor offset');
  });

  test('press enter at start of card inserts section before card', function (assert) {
    var mobiledoc = _testHelpers['default'].mobiledoc.build(function (_ref13) {
      var post = _ref13.post;
      var cardSection = _ref13.cardSection;

      return post([cardSection(positionCard.name)]);
    });

    editor = new _mobiledocKit.Editor({ mobiledoc: mobiledoc, cards: [positionCard] });
    editor.render(editorElement);

    assert.hasElement('#my-simple-card', 'precond - renders card');
    assert.hasNoElement('#editor p', 'precond - has no markup section');

    editor.selectRange(_mobiledocKitUtilsCursorRange['default'].create(editor.post.sections.tail, 0));
    _testHelpers['default'].dom.triggerEnter(editor);

    assert.hasElement('#my-simple-card', 'has card after enter');
    assert.hasElement('#editor p', 'markup section is added');

    var _editor3 = editor;
    var range = _editor3.range;

    assert.ok(editor.post.sections.head.isMarkerable, 'markup section at head of post');
    assert.ok(editor.post.sections.tail.isCardSection, 'card section at end of post');
    assert.ok(range.head.section === editor.post.sections.tail, 'correct cursor position');
    assert.equal(range.head.offset, 0, 'correct cursor offset');
  });

  test('editor ignores events when focus is inside a card', function (assert) {
    var mobiledoc = _testHelpers['default'].mobiledoc.build(function (_ref14) {
      var post = _ref14.post;
      var markupSection = _ref14.markupSection;
      var cardSection = _ref14.cardSection;

      return post([markupSection(), cardSection('simple-card')]);
    });

    var cards = [{
      name: 'simple-card',
      type: 'dom',
      render: function render() {
        return $('<input id="simple-card-input">')[0];
      }
    }];

    editor = new _mobiledocKit.Editor({ mobiledoc: mobiledoc, cards: cards });
    editor.render(editorElement);

    assert.hasElement('#simple-card-input', 'precond - renders card');

    var inputEvents = 0;
    editor.handleKeyup = function () {
      return inputEvents++;
    };

    var input = $('#simple-card-input')[0];
    _testHelpers['default'].dom.triggerEvent(input, 'keyup');

    assert.equal(inputEvents, 0, 'editor does not handle keyup event when in card');

    var p = $('#editor p')[0];
    _testHelpers['default'].dom.triggerEvent(p, 'keyup');

    assert.equal(inputEvents, 1, 'editor handles keyup event outside of card');
  });

  test('a moved card retains its inital editing mode', function (assert) {
    var mobiledoc = _testHelpers['default'].mobiledoc.build(function (_ref15) {
      var post = _ref15.post;
      var markupSection = _ref15.markupSection;
      var cardSection = _ref15.cardSection;

      var card = cardSection('simple-card');
      return post([markupSection(), card]);
    });

    editor = new _mobiledocKit.Editor({ mobiledoc: mobiledoc, cards: [simpleCard] });
    editor.post.sections.tail.setInitialMode(_mobiledocKitModelsCard.CARD_MODES.EDIT);
    editor.render(editorElement);

    assert.hasElement('#edit-button', 'precond - card is in edit mode');

    editor.run(function (postEditor) {
      var card = editor.post.sections.tail;
      postEditor.moveSectionUp(card);
    });

    assert.hasElement('#edit-button', 'card is still in edit mode');
  });

  test('a moved card retains its current editing mode', function (assert) {
    var mobiledoc = _testHelpers['default'].mobiledoc.build(function (_ref16) {
      var post = _ref16.post;
      var markupSection = _ref16.markupSection;
      var cardSection = _ref16.cardSection;

      return post([markupSection(), cardSection('simple-card')]);
    });

    editor = new _mobiledocKit.Editor({ mobiledoc: mobiledoc, cards: [simpleCard] });
    editor.render(editorElement);

    assert.hasNoElement('#edit-button', 'precond - card is not in edit mode');

    var card = editor.post.sections.tail;
    editor.editCard(card);

    assert.hasElement('#edit-button', 'precond - card is in edit mode');

    editor.run(function (postEditor) {
      var card = editor.post.sections.tail;
      postEditor.moveSectionUp(card);
    });

    assert.hasElement('#edit-button', 'card is still in edit mode');
  });
});
define('tests/acceptance/editor-copy-paste-test', ['exports', 'mobiledoc-kit', '../test-helpers', 'mobiledoc-kit/utils/cursor/range', '../helpers/browsers', 'mobiledoc-kit/utils/paste-utils'], function (exports, _mobiledocKit, _testHelpers, _mobiledocKitUtilsCursorRange, _helpersBrowsers, _mobiledocKitUtilsPasteUtils) {
  'use strict';

  var test = _testHelpers['default'].test;
  var _module = _testHelpers['default'].module;

  var cards = [{
    name: 'my-card',
    type: 'dom',
    render: function render() {},
    edit: function edit() {}
  }];

  var editor = undefined,
      editorElement = undefined;

  _module('Acceptance: editor: copy-paste', {
    beforeEach: function beforeEach() {
      editorElement = $('#editor')[0];
    },
    afterEach: function afterEach() {
      if (editor) {
        editor.destroy();
        editor = null;
      }
      _testHelpers['default'].dom.clearCopyData();
    }
  });

  if (!(0, _helpersBrowsers.detectIE11)()) {
    // These tests do not work in Sauce Labs on IE11 because access to the clipboard must be manually allowed.
    // TODO: Configure IE11 to automatically allow access to the clipboard.
    test('simple copy-paste at end of section works', function (assert) {
      var mobiledoc = _testHelpers['default'].mobiledoc.build(function (_ref) {
        var post = _ref.post;
        var markupSection = _ref.markupSection;
        var marker = _ref.marker;

        return post([markupSection('p', [marker('abc')])]);
      });
      editor = new _mobiledocKit.Editor({ mobiledoc: mobiledoc });
      editor.render(editorElement);

      _testHelpers['default'].dom.selectText('abc', editorElement);
      _testHelpers['default'].dom.triggerCopyEvent(editor);

      var textNode = $('#editor p')[0].childNodes[0];
      assert.equal(textNode.textContent, 'abc'); //precond
      _testHelpers['default'].dom.moveCursorTo(textNode, textNode.length);

      _testHelpers['default'].dom.triggerPasteEvent(editor);

      assert.hasElement('#editor p:contains(abcabc)', 'pastes the text');
    });

    test('paste plain text', function (assert) {
      var mobiledoc = _testHelpers['default'].mobiledoc.build(function (_ref2) {
        var post = _ref2.post;
        var markupSection = _ref2.markupSection;
        var marker = _ref2.marker;

        return post([markupSection('p', [marker('abc')])]);
      });
      editor = new _mobiledocKit.Editor({ mobiledoc: mobiledoc });
      editor.render(editorElement);

      var textNode = $('#editor p')[0].childNodes[0];
      assert.equal(textNode.textContent, 'abc'); //precond
      _testHelpers['default'].dom.moveCursorTo(textNode, textNode.length);

      _testHelpers['default'].dom.setCopyData(_mobiledocKitUtilsPasteUtils.MIME_TEXT_PLAIN, 'abc');
      _testHelpers['default'].dom.triggerPasteEvent(editor);

      assert.hasElement('#editor p:contains(abcabc)', 'pastes the text');
    });

    test('paste plain text with line breaks', function (assert) {
      var mobiledoc = _testHelpers['default'].mobiledoc.build(function (_ref3) {
        var post = _ref3.post;
        var markupSection = _ref3.markupSection;
        var marker = _ref3.marker;

        return post([markupSection('p', [marker('abc')])]);
      });
      editor = new _mobiledocKit.Editor({ mobiledoc: mobiledoc });
      editor.render(editorElement);

      var textNode = $('#editor p')[0].childNodes[0];
      assert.equal(textNode.textContent, 'abc'); //precond
      _testHelpers['default'].dom.moveCursorTo(textNode, textNode.length);

      _testHelpers['default'].dom.setCopyData(_mobiledocKitUtilsPasteUtils.MIME_TEXT_PLAIN, ['abc', 'def'].join('\n'));
      _testHelpers['default'].dom.triggerPasteEvent(editor);

      if ((0, _helpersBrowsers.supportsStandardClipboardAPI)()) {
        assert.hasElement('#editor p:contains(abcabc)', 'pastes the text');
        assert.hasElement('#editor p:contains(def)', 'second section is pasted');
        assert.equal($('#editor p').length, 2, 'adds a second section');
      } else {
        assert.hasElement('#editor p:contains(abcabc\ndef)', 'pastes the text');
        assert.equal($('#editor p').length, 1, 'adds a second section');
      }
    });

    test('paste plain text with list items', function (assert) {
      var mobiledoc = _testHelpers['default'].mobiledoc.build(function (_ref4) {
        var post = _ref4.post;
        var markupSection = _ref4.markupSection;
        var marker = _ref4.marker;

        return post([markupSection('p', [marker('abc')])]);
      });
      editor = new _mobiledocKit.Editor({ mobiledoc: mobiledoc });
      editor.render(editorElement);

      var textNode = $('#editor p')[0].childNodes[0];
      assert.equal(textNode.textContent, 'abc'); //precond
      _testHelpers['default'].dom.moveCursorTo(textNode, textNode.length);

      _testHelpers['default'].dom.setCopyData(_mobiledocKitUtilsPasteUtils.MIME_TEXT_PLAIN, ['* abc', '* def'].join('\n'));
      _testHelpers['default'].dom.triggerPasteEvent(editor);

      if ((0, _helpersBrowsers.supportsStandardClipboardAPI)()) {
        assert.hasElement('#editor p:contains(abcabc)', 'pastes the text');
        assert.hasElement('#editor ul li:contains(def)', 'list item is pasted');
      } else {
        assert.hasElement('#editor p:contains(abc* abc\n* def)', 'pastes the text');
      }
    });

    test('can cut and then paste content', function (assert) {
      var mobiledoc = _testHelpers['default'].mobiledoc.build(function (_ref5) {
        var post = _ref5.post;
        var markupSection = _ref5.markupSection;
        var marker = _ref5.marker;

        return post([markupSection('p', [marker('abc')])]);
      });
      editor = new _mobiledocKit.Editor({ mobiledoc: mobiledoc });
      editor.render(editorElement);

      assert.hasElement('#editor p:contains(abc)', 'precond - has p');

      _testHelpers['default'].dom.selectText('abc', editorElement);
      _testHelpers['default'].dom.triggerCutEvent(editor);

      assert.hasNoElement('#editor p:contains(abc)', 'content removed after cutting');

      var textNode = $('#editor p')[0].childNodes[0];
      _testHelpers['default'].dom.moveCursorTo(textNode, textNode.length);

      _testHelpers['default'].dom.triggerPasteEvent(editor);

      assert.hasElement('#editor p:contains(abc)', 'pastes the text');
    });

    test('paste when text is selected replaces that text', function (assert) {
      var mobiledoc = _testHelpers['default'].mobiledoc.build(function (_ref6) {
        var post = _ref6.post;
        var markupSection = _ref6.markupSection;
        var marker = _ref6.marker;

        return post([markupSection('p', [marker('abc')])]);
      });
      editor = new _mobiledocKit.Editor({ mobiledoc: mobiledoc });
      editor.render(editorElement);

      assert.hasElement('#editor p:contains(abc)', 'precond - has p');

      _testHelpers['default'].dom.selectText('bc', editorElement);
      _testHelpers['default'].dom.triggerCopyEvent(editor);

      _testHelpers['default'].dom.selectText('a', editorElement);

      _testHelpers['default'].dom.triggerPasteEvent(editor);

      assert.hasElement('#editor p:contains(bcbc)', 'pastes, replacing the selection');
    });

    test('simple copy-paste with markup at end of section works', function (assert) {
      var mobiledoc = _testHelpers['default'].mobiledoc.build(function (_ref7) {
        var post = _ref7.post;
        var markupSection = _ref7.markupSection;
        var marker = _ref7.marker;
        var markup = _ref7.markup;

        return post([markupSection('p', [marker('a', [markup('strong')]), marker('bc')])]);
      });
      editor = new _mobiledocKit.Editor({ mobiledoc: mobiledoc });
      editor.render(editorElement);

      _testHelpers['default'].dom.selectText('a', editorElement, 'b', editorElement);
      _testHelpers['default'].dom.triggerCopyEvent(editor);

      var textNode = $('#editor p')[0].childNodes[1];
      assert.equal(textNode.textContent, 'bc'); //precond
      _testHelpers['default'].dom.moveCursorTo(textNode, textNode.length);

      _testHelpers['default'].dom.triggerPasteEvent(editor);

      assert.hasElement('#editor p:contains(abcab)', 'pastes the text');
      assert.equal($('#editor p strong:contains(a)').length, 2, 'two bold As');
    });

    test('simple copy-paste in middle of section works', function (assert) {
      var mobiledoc = _testHelpers['default'].mobiledoc.build(function (_ref8) {
        var post = _ref8.post;
        var markupSection = _ref8.markupSection;
        var marker = _ref8.marker;

        return post([markupSection('p', [marker('abcd')])]);
      });
      editor = new _mobiledocKit.Editor({ mobiledoc: mobiledoc });
      editor.render(editorElement);

      _testHelpers['default'].dom.selectText('c', editorElement);
      _testHelpers['default'].dom.triggerCopyEvent(editor);

      var textNode = $('#editor p')[0].childNodes[0];
      assert.equal(textNode.textContent, 'abcd'); //precond
      _testHelpers['default'].dom.moveCursorTo(textNode, 1);

      _testHelpers['default'].dom.triggerPasteEvent(editor);

      assert.hasElement('#editor p:contains(acbcd)', 'pastes the text');
      _testHelpers['default'].dom.insertText(editor, 'X');
      assert.hasElement('#editor p:contains(acXbcd)', 'inserts text in right spot');
    });

    test('simple copy-paste at start of section works', function (assert) {
      var mobiledoc = _testHelpers['default'].mobiledoc.build(function (_ref9) {
        var post = _ref9.post;
        var markupSection = _ref9.markupSection;
        var marker = _ref9.marker;

        return post([markupSection('p', [marker('abcd')])]);
      });
      editor = new _mobiledocKit.Editor({ mobiledoc: mobiledoc });
      editor.render(editorElement);

      _testHelpers['default'].dom.selectText('c', editorElement);
      _testHelpers['default'].dom.triggerCopyEvent(editor);

      var textNode = $('#editor p')[0].childNodes[0];
      assert.equal(textNode.textContent, 'abcd'); //precond
      _testHelpers['default'].dom.moveCursorTo(textNode, 0);

      _testHelpers['default'].dom.triggerPasteEvent(editor);

      assert.hasElement('#editor p:contains(cabcd)', 'pastes the text');
      _testHelpers['default'].dom.insertText(editor, 'X');
      assert.hasElement('#editor p:contains(cXabcd)', 'inserts text in right spot');
    });

    test('copy-paste can copy cards', function (assert) {
      var mobiledoc = _testHelpers['default'].mobiledoc.build(function (_ref10) {
        var post = _ref10.post;
        var markupSection = _ref10.markupSection;
        var marker = _ref10.marker;
        var cardSection = _ref10.cardSection;

        return post([markupSection('p', [marker('abc')]), cardSection('test-card', { foo: 'bar' }), markupSection('p', [marker('123')])]);
      });
      var cards = [{
        name: 'test-card',
        type: 'dom',
        render: function render(_ref11) {
          var payload = _ref11.payload;

          return $('<div class=\'' + payload.foo + '\'>' + payload.foo + '</div>')[0];
        }
      }];
      editor = new _mobiledocKit.Editor({ mobiledoc: mobiledoc, cards: cards });
      editor.render(editorElement);

      assert.hasElement('#editor .bar', 'precond - renders card');

      var startEl = $('#editor p:eq(0)')[0],
          endEl = $('#editor p:eq(1)')[0];
      assert.equal(endEl.textContent, '123', 'precond - endEl has correct text');
      _testHelpers['default'].dom.selectText('c', startEl, '1', endEl);

      _testHelpers['default'].dom.triggerCopyEvent(editor);

      var textNode = $('#editor p')[1].childNodes[0];
      assert.equal(textNode.textContent, '123', 'precond - correct textNode');

      _testHelpers['default'].dom.moveCursorTo(textNode, 2); // '3'
      _testHelpers['default'].dom.triggerPasteEvent(editor);

      assert.equal($('#editor .bar').length, 2, 'renders a second card');
    });

    test('copy-paste can copy list sections', function (assert) {
      var mobiledoc = _testHelpers['default'].mobiledoc.build(function (_ref12) {
        var post = _ref12.post;
        var markupSection = _ref12.markupSection;
        var marker = _ref12.marker;
        var listSection = _ref12.listSection;
        var listItem = _ref12.listItem;

        return post([markupSection('p', [marker('abc')]), listSection('ul', [listItem([marker('list')])]), markupSection('p', [marker('123')])]);
      });
      editor = new _mobiledocKit.Editor({ mobiledoc: mobiledoc });
      editor.render(editorElement);

      _testHelpers['default'].dom.selectText('c', editor.element, '1', editor.element);

      _testHelpers['default'].dom.triggerCopyEvent(editor);

      var textNode = $('#editor p')[1].childNodes[0];
      assert.equal(textNode.textContent, '123', 'precond - correct textNode');

      _testHelpers['default'].dom.moveCursorTo(textNode, 3); // end of node
      _testHelpers['default'].dom.triggerPasteEvent(editor);

      assert.equal($('#editor ul').length, 2, 'pastes the list');
      assert.hasElement($('#editor ul:eq(0) li:contains(list)'));
    });

    test('copy sets html & text for pasting externally', function (assert) {
      var mobiledoc = _testHelpers['default'].mobiledoc.build(function (_ref13) {
        var post = _ref13.post;
        var markupSection = _ref13.markupSection;
        var marker = _ref13.marker;

        return post([markupSection('h1', [marker('h1 heading')]), markupSection('h2', [marker('h2 subheader')]), markupSection('p', [marker('The text')])]);
      });
      editor = new _mobiledocKit.Editor({ mobiledoc: mobiledoc });
      editor.render(editorElement);

      _testHelpers['default'].dom.selectText('heading', editor.element, 'The text', editor.element);

      _testHelpers['default'].dom.triggerCopyEvent(editor);

      var html = _testHelpers['default'].dom.getCopyData(_mobiledocKitUtilsPasteUtils.MIME_TEXT_HTML);
      if ((0, _helpersBrowsers.supportsStandardClipboardAPI)()) {
        var text = _testHelpers['default'].dom.getCopyData(_mobiledocKitUtilsPasteUtils.MIME_TEXT_PLAIN);
        assert.equal(text, ["heading", "h2 subheader", "The text"].join('\n'), 'gets plain text');
      }

      assert.ok(html.indexOf("<h1>heading") !== -1, 'html has h1');
      assert.ok(html.indexOf("<h2>h2 subheader") !== -1, 'html has h2');
      assert.ok(html.indexOf("<p>The text") !== -1, 'html has p');
    });

    test('pasting when on the end of a card is blocked', function (assert) {
      var mobiledoc = _testHelpers['default'].mobiledoc.build(function (_ref14) {
        var post = _ref14.post;
        var cardSection = _ref14.cardSection;
        var markupSection = _ref14.markupSection;
        var marker = _ref14.marker;

        return post([cardSection('my-card'), markupSection('p', [marker('abc')])]);
      });
      editor = new _mobiledocKit.Editor({ mobiledoc: mobiledoc, cards: cards });
      editor.render(editorElement);

      _testHelpers['default'].dom.selectText('abc', editorElement);
      _testHelpers['default'].dom.triggerCopyEvent(editor);

      editor.selectRange(new _mobiledocKitUtilsCursorRange['default'](editor.post.sections.head.headPosition()));
      _testHelpers['default'].dom.triggerPasteEvent(editor);

      assert.postIsSimilar(editor.post, _testHelpers['default'].postAbstract.build(function (_ref15) {
        var post = _ref15.post;
        var cardSection = _ref15.cardSection;
        var markupSection = _ref15.markupSection;
        var marker = _ref15.marker;

        return post([cardSection('my-card'), markupSection('p', [marker('abc')])]);
      }), 'no paste has occurred');

      editor.selectRange(new _mobiledocKitUtilsCursorRange['default'](editor.post.sections.head.tailPosition()));
      _testHelpers['default'].dom.triggerPasteEvent(editor);

      assert.postIsSimilar(editor.post, _testHelpers['default'].postAbstract.build(function (_ref16) {
        var post = _ref16.post;
        var cardSection = _ref16.cardSection;
        var markupSection = _ref16.markupSection;
        var marker = _ref16.marker;

        return post([cardSection('my-card'), markupSection('p', [marker('abc')])]);
      }), 'no paste has occurred');
    });

    // see https://github.com/bustlelabs/mobiledoc-kit/issues/249
    test('pasting when replacing a list item works', function (assert) {
      var mobiledoc = _testHelpers['default'].mobiledoc.build(function (_ref17) {
        var post = _ref17.post;
        var listSection = _ref17.listSection;
        var listItem = _ref17.listItem;
        var markupSection = _ref17.markupSection;
        var marker = _ref17.marker;

        return post([markupSection('p', [marker('X')]), listSection('ul', [listItem([marker('Y')])])]);
      });

      editor = new _mobiledocKit.Editor({ mobiledoc: mobiledoc, cards: cards });
      editor.render(editorElement);

      assert.hasElement('#editor li:contains(Y)', 'precond: has li with Y');

      _testHelpers['default'].dom.selectText('X', editorElement);
      _testHelpers['default'].dom.triggerCopyEvent(editor);

      _testHelpers['default'].dom.selectText('Y', editorElement);
      _testHelpers['default'].dom.triggerPasteEvent(editor);

      assert.hasElement('#editor li:contains(X)', 'replaces Y with X in li');
      assert.hasNoElement('#editor li:contains(Y)', 'li with Y is gone');
    });
  }
});
define('tests/acceptance/editor-key-commands-test', ['exports', 'mobiledoc-kit', 'mobiledoc-kit/utils/key', '../test-helpers', '../helpers/browsers'], function (exports, _mobiledocKit, _mobiledocKitUtilsKey, _testHelpers, _helpersBrowsers) {
  'use strict';

  var _module = _testHelpers['default'].module;
  var test = _testHelpers['default'].test;

  var editor = undefined,
      editorElement = undefined;

  _module('Acceptance: Editor: Key Commands', {
    beforeEach: function beforeEach() {
      editorElement = $('#editor')[0];
    },
    afterEach: function afterEach() {
      if (editor) {
        editor.destroy();
        editor = null;
      }
    }
  });

  function testStatefulCommand(_ref) {
    var modifier = _ref.modifier;
    var key = _ref.key;
    var command = _ref.command;
    var markupName = _ref.markupName;

    test(command + ' applies markup ' + markupName + ' to highlighted text', function (assert) {
      var initialText = 'something';
      var mobiledoc = _testHelpers['default'].mobiledoc.build(function (_ref2) {
        var post = _ref2.post;
        var markupSection = _ref2.markupSection;
        var marker = _ref2.marker;
        return post([markupSection('p', [marker(initialText)])]);
      });

      editor = new _mobiledocKit.Editor({ mobiledoc: mobiledoc });
      editor.render(editorElement);

      assert.hasNoElement('#editor ' + markupName, 'precond - no ' + markupName + ' text');
      _testHelpers['default'].dom.selectText(initialText, editorElement);
      _testHelpers['default'].dom.triggerKeyCommand(editor, key, modifier);

      assert.hasElement('#editor ' + markupName + ':contains(' + initialText + ')', 'text wrapped in ' + markupName);
    });

    if (!(0, _helpersBrowsers.detectIE)()) {
      // FIXME: IE does not respect the current typing styles (such as an
      // `execCommand('bold', false, null)`) when calling the `insertText`
      // command. Skip these tests in IE until we can implement non-parsing
      // text entry.
      test(command + ' applies ' + markupName + ' to next entered text', function (assert) {
        var done = assert.async();
        var initialText = 'something';
        var mobiledoc = _testHelpers['default'].mobiledoc.build(function (_ref3) {
          var post = _ref3.post;
          var markupSection = _ref3.markupSection;
          var marker = _ref3.marker;
          return post([markupSection('p', [marker(initialText)])]);
        });

        editor = new _mobiledocKit.Editor({ mobiledoc: mobiledoc });
        editor.render(editorElement);

        assert.hasNoElement('#editor ' + markupName, 'precond - no ' + markupName + ' text');
        _testHelpers['default'].dom.moveCursorTo(editor.post.sections.head.markers.head.renderNode.element, initialText.length);
        _testHelpers['default'].dom.triggerKeyCommand(editor, key, modifier);
        _testHelpers['default'].dom.insertText(editor, 'z');
        window.setTimeout(function () {
          var changedMobiledoc = editor.serialize();
          var expectedMobiledoc = _testHelpers['default'].mobiledoc.build(function (_ref4) {
            var post = _ref4.post;
            var markupSection = _ref4.markupSection;
            var marker = _ref4.marker;
            var buildMarkup = _ref4.markup;

            var markup = buildMarkup(markupName);
            return post([markupSection('p', [marker(initialText), marker('z', [markup])])]);
          });
          assert.deepEqual(changedMobiledoc, expectedMobiledoc);
          done();
        }, 0);
      });
    }
  }

  testStatefulCommand({
    modifier: _mobiledocKitUtilsKey.MODIFIERS.META,
    key: 'B',
    command: 'command-B',
    markupName: 'strong'
  });

  testStatefulCommand({
    modifier: _mobiledocKitUtilsKey.MODIFIERS.CTRL,
    key: 'B',
    command: 'command-B',
    markupName: 'strong'
  });

  testStatefulCommand({
    modifier: _mobiledocKitUtilsKey.MODIFIERS.META,
    key: 'I',
    command: 'command-I',
    markupName: 'em'
  });

  testStatefulCommand({
    modifier: _mobiledocKitUtilsKey.MODIFIERS.CTRL,
    key: 'I',
    command: 'command-I',
    markupName: 'em'
  });

  test('ctrl-k clears to the end of a line', function (assert) {
    var initialText = 'something';
    var mobiledoc = _testHelpers['default'].mobiledoc.build(function (_ref5) {
      var post = _ref5.post;
      var markupSection = _ref5.markupSection;
      var marker = _ref5.marker;
      return post([markupSection('p', [marker(initialText)])]);
    });

    editor = new _mobiledocKit.Editor({ mobiledoc: mobiledoc });
    editor.render(editorElement);

    var textElement = editor.post.sections.head.markers.head.renderNode.element;
    _testHelpers['default'].dom.moveCursorTo(textElement, 4);
    _testHelpers['default'].dom.triggerKeyCommand(editor, 'K', _mobiledocKitUtilsKey.MODIFIERS.CTRL);

    var changedMobiledoc = editor.serialize();
    var expectedMobiledoc = _testHelpers['default'].mobiledoc.build(function (_ref6) {
      var post = _ref6.post;
      var markupSection = _ref6.markupSection;
      var marker = _ref6.marker;

      return post([markupSection('p', [marker('some')])]);
    });
    assert.deepEqual(changedMobiledoc, expectedMobiledoc, 'mobiledoc updated appropriately');
  });

  test('ctrl-k clears selected text', function (assert) {
    var initialText = 'something';
    var mobiledoc = _testHelpers['default'].mobiledoc.build(function (_ref7) {
      var post = _ref7.post;
      var markupSection = _ref7.markupSection;
      var marker = _ref7.marker;
      return post([markupSection('p', [marker(initialText)])]);
    });

    editor = new _mobiledocKit.Editor({ mobiledoc: mobiledoc });
    editor.render(editorElement);

    var textElement = editor.post.sections.head.markers.head.renderNode.element;
    _testHelpers['default'].dom.moveCursorTo(textElement, 4, textElement, 8);
    _testHelpers['default'].dom.triggerKeyCommand(editor, 'K', _mobiledocKitUtilsKey.MODIFIERS.CTRL);

    var changedMobiledoc = editor.serialize();
    var expectedMobiledoc = _testHelpers['default'].mobiledoc.build(function (_ref8) {
      var post = _ref8.post;
      var markupSection = _ref8.markupSection;
      var marker = _ref8.marker;

      return post([markupSection('p', [marker('someg')])]);
    });
    assert.deepEqual(changedMobiledoc, expectedMobiledoc, 'mobiledoc updated appropriately');
  });

  test('cmd-k links selected text', function (assert) {
    assert.expect(2);

    var url = 'http://bustle.com';
    var mobiledoc = _testHelpers['default'].mobiledoc.build(function (_ref9) {
      var post = _ref9.post;
      var markupSection = _ref9.markupSection;
      var marker = _ref9.marker;
      return post([markupSection('p', [marker('something')])]);
    });
    editor = new _mobiledocKit.Editor({ mobiledoc: mobiledoc });
    editor.render(editorElement);
    editor.showPrompt = function (prompt, defaultUrl, callback) {
      assert.ok(true, 'calls showPrompt');
      callback(url);
    };

    _testHelpers['default'].dom.selectText('something', editorElement);
    _testHelpers['default'].dom.triggerKeyCommand(editor, 'K', _mobiledocKitUtilsKey.MODIFIERS.META);

    assert.hasElement('#editor a[href="' + url + '"]:contains(something)');
  });

  test('cmd-k unlinks selected text if it was already linked', function (assert) {
    assert.expect(3);

    var url = 'http://bustle.com';
    var mobiledoc = _testHelpers['default'].mobiledoc.build(function (_ref10) {
      var post = _ref10.post;
      var markupSection = _ref10.markupSection;
      var marker = _ref10.marker;
      var markup = _ref10.markup;
      return post([markupSection('p', [marker('something', [markup('a', { href: url })])])]);
    });
    editor = new _mobiledocKit.Editor({ mobiledoc: mobiledoc });
    editor.showPrompt = function () {
      assert.ok(false, 'should not call showPrompt');
    };
    editor.render(editorElement);
    assert.hasElement('#editor a[href="' + url + '"]:contains(something)', 'precond -- has link');

    _testHelpers['default'].dom.selectText('something', editorElement);
    _testHelpers['default'].dom.triggerKeyCommand(editor, 'K', _mobiledocKitUtilsKey.MODIFIERS.META);

    assert.hasNoElement('#editor a[href="' + url + '"]:contains(something)', 'removes linked text');
    assert.hasElement('#editor p:contains(something)', 'unlinked text remains');
  });

  test('new key commands can be registered', function (assert) {
    var mobiledoc = _testHelpers['default'].mobiledoc.build(function (_ref11) {
      var post = _ref11.post;
      var markupSection = _ref11.markupSection;
      var marker = _ref11.marker;
      return post([markupSection('p', [marker('something')])]);
    });

    var passedEditor = undefined;
    editor = new _mobiledocKit.Editor({ mobiledoc: mobiledoc });
    editor.registerKeyCommand({
      str: 'ctrl+x',
      run: function run(editor) {
        passedEditor = editor;
      }
    });
    editor.render(editorElement);

    _testHelpers['default'].dom.triggerKeyCommand(editor, 'Y', _mobiledocKitUtilsKey.MODIFIERS.CTRL);

    assert.ok(!passedEditor, 'incorrect key combo does not trigger key command');

    _testHelpers['default'].dom.triggerKeyCommand(editor, 'X', _mobiledocKitUtilsKey.MODIFIERS.CTRL);

    assert.ok(!!passedEditor && passedEditor === editor, 'run method is called');
  });

  test('new key commands can be registered without modifiers', function (assert) {
    var mobiledoc = _testHelpers['default'].mobiledoc.build(function (_ref12) {
      var post = _ref12.post;
      var markupSection = _ref12.markupSection;
      var marker = _ref12.marker;
      return post([markupSection('p', [marker('something')])]);
    });

    var passedEditor = undefined;
    editor = new _mobiledocKit.Editor({ mobiledoc: mobiledoc });
    editor.registerKeyCommand({
      str: 'X',
      run: function run(editor) {
        passedEditor = editor;
      }
    });
    editor.render(editorElement);

    _testHelpers['default'].dom.triggerKeyCommand(editor, 'Y', _mobiledocKitUtilsKey.MODIFIERS.CTRL);

    assert.ok(!passedEditor, 'incorrect key combo does not trigger key command');

    _testHelpers['default'].dom.triggerKeyCommand(editor, 'X', _mobiledocKitUtilsKey.MODIFIERS.CTRL);

    assert.ok(!passedEditor, 'key with modifier combo does not trigger key command');

    _testHelpers['default'].dom.triggerKeyCommand(editor, 'X');

    assert.ok(!!passedEditor && passedEditor === editor, 'run method is called');
  });

  test('duplicate key commands can be registered with the last registered winning', function (assert) {
    var mobiledoc = _testHelpers['default'].mobiledoc.build(function (_ref13) {
      var post = _ref13.post;
      var markupSection = _ref13.markupSection;
      var marker = _ref13.marker;
      return post([markupSection('p', [marker('something')])]);
    });

    var firstCommandRan = undefined,
        secondCommandRan = undefined;
    editor = new _mobiledocKit.Editor({ mobiledoc: mobiledoc });
    editor.registerKeyCommand({
      str: 'ctrl+x',
      run: function run() {
        firstCommandRan = true;
      }
    });
    editor.registerKeyCommand({
      str: 'ctrl+x',
      run: function run() {
        secondCommandRan = true;
      }
    });
    editor.render(editorElement);

    _testHelpers['default'].dom.triggerKeyCommand(editor, 'X', _mobiledocKitUtilsKey.MODIFIERS.CTRL);

    assert.ok(!firstCommandRan, 'first registered method not called');
    assert.ok(!!secondCommandRan, 'last registered method is called');
  });

  test('returning false from key command causes next match to run', function (assert) {
    var mobiledoc = _testHelpers['default'].mobiledoc.build(function (_ref14) {
      var post = _ref14.post;
      var markupSection = _ref14.markupSection;
      var marker = _ref14.marker;
      return post([markupSection('p', [marker('something')])]);
    });

    var firstCommandRan = undefined,
        secondCommandRan = undefined;
    editor = new _mobiledocKit.Editor({ mobiledoc: mobiledoc });
    editor.registerKeyCommand({
      str: 'ctrl+x',
      run: function run() {
        firstCommandRan = true;
      }
    });
    editor.registerKeyCommand({
      str: 'ctrl+x',
      run: function run() {
        secondCommandRan = true;
        return false;
      }
    });
    editor.render(editorElement);

    _testHelpers['default'].dom.triggerKeyCommand(editor, 'X', _mobiledocKitUtilsKey.MODIFIERS.CTRL);

    assert.ok(!!secondCommandRan, 'last registered method is called');
    assert.ok(!!firstCommandRan, 'first registered method is called');
  });

  test('key commands can override built-in functionality', function (assert) {
    var mobiledoc = _testHelpers['default'].mobiledoc.build(function (_ref15) {
      var post = _ref15.post;
      var markupSection = _ref15.markupSection;
      var marker = _ref15.marker;
      return post([markupSection('p', [marker('something')])]);
    });

    editor = new _mobiledocKit.Editor({ mobiledoc: mobiledoc });

    var passedEditor = undefined;
    editor.registerKeyCommand({
      str: 'enter',
      run: function run(editor) {
        passedEditor = editor;
      }
    });

    editor.render(editorElement);
    assert.equal($('#editor p').length, 1, 'has 1 paragraph to start');

    _testHelpers['default'].dom.moveCursorTo(editorElement.childNodes[0].childNodes[0], 5);
    _testHelpers['default'].dom.triggerEnter(editor);

    assert.ok(!!passedEditor && passedEditor === editor, 'run method is called');

    assert.equal($('#editor p').length, 1, 'still has just one paragraph');
  });

  test('returning false from key command still runs built-in functionality', function (assert) {
    var mobiledoc = _testHelpers['default'].mobiledoc.build(function (_ref16) {
      var post = _ref16.post;
      var markupSection = _ref16.markupSection;
      var marker = _ref16.marker;
      return post([markupSection('p', [marker('something')])]);
    });

    editor = new _mobiledocKit.Editor({ mobiledoc: mobiledoc });

    var passedEditor = undefined;
    editor.registerKeyCommand({
      str: 'enter',
      run: function run(editor) {
        passedEditor = editor;
        return false;
      }
    });

    editor.render(editorElement);
    assert.equal($('#editor p').length, 1, 'has 1 paragraph to start');

    _testHelpers['default'].dom.moveCursorTo(editorElement.childNodes[0].childNodes[0], 5);
    _testHelpers['default'].dom.triggerEnter(editor);

    assert.ok(!!passedEditor && passedEditor === editor, 'run method is called');

    assert.equal($('#editor p').length, 2, 'has added a new paragraph');
  });
});
define('tests/acceptance/editor-list-test', ['exports', 'mobiledoc-kit', '../test-helpers'], function (exports, _mobiledocKit, _testHelpers) {
  'use strict';

  var _module = _testHelpers['default'].module;
  var test = _testHelpers['default'].test;

  var editor = undefined,
      editorElement = undefined;

  function listMobileDoc() {
    return _testHelpers['default'].mobiledoc.build(function (_ref) {
      var post = _ref.post;
      var listSection = _ref.listSection;
      var listItem = _ref.listItem;
      var marker = _ref.marker;
      return post([listSection('ul', [listItem([marker('first item')]), listItem([marker('second item')])])]);
    });
  }

  function createEditorWithMobiledoc(mobiledoc) {
    editor = new _mobiledocKit.Editor({ mobiledoc: mobiledoc });
    editor.render(editorElement);
  }

  function createEditorWithListMobiledoc() {
    createEditorWithMobiledoc(listMobileDoc());
  }

  _module('Acceptance: Editor: Lists', {
    beforeEach: function beforeEach() {
      editorElement = $('#editor')[0];
    },
    afterEach: function afterEach() {
      if (editor) {
        editor.destroy();
      }
    }
  });

  test('can type in middle of a list item', function (assert) {
    createEditorWithListMobiledoc();

    var listItem = $('#editor li:contains(first item)')[0];
    assert.ok(!!listItem, 'precond - has li');

    _testHelpers['default'].dom.moveCursorTo(listItem.childNodes[0], 'first'.length);
    _testHelpers['default'].dom.insertText(editor, 'X');

    assert.hasElement('#editor li:contains(firstX item)', 'inserts text at right spot');
  });

  test('can type at end of a list item', function (assert) {
    createEditorWithListMobiledoc();

    var listItem = $('#editor li:contains(first item)')[0];
    assert.ok(!!listItem, 'precond - has li');

    _testHelpers['default'].dom.moveCursorTo(listItem.childNodes[0], 'first item'.length);
    _testHelpers['default'].dom.insertText(editor, 'X');

    assert.hasElement('#editor li:contains(first itemX)', 'inserts text at right spot');
  });

  test('can type at start of a list item', function (assert) {
    createEditorWithListMobiledoc();

    var listItem = $('#editor li:contains(first item)')[0];
    assert.ok(!!listItem, 'precond - has li');

    _testHelpers['default'].dom.moveCursorTo(listItem.childNodes[0], 0);
    _testHelpers['default'].dom.insertText(editor, 'X');

    assert.hasElement('#editor li:contains(Xfirst item)', 'inserts text at right spot');
  });

  test('can delete selection across list items', function (assert) {
    createEditorWithListMobiledoc();

    var listItem = $('#editor li:contains(first item)')[0];
    assert.ok(!!listItem, 'precond - has li1');

    var listItem2 = $('#editor li:contains(second item)')[0];
    assert.ok(!!listItem2, 'precond - has li2');

    _testHelpers['default'].dom.selectText(' item', listItem, 'secon', listItem2);
    _testHelpers['default'].dom.triggerDelete(editor);

    assert.hasElement('#editor li:contains(d item)', 'results in correct text');
    assert.equal($('#editor li').length, 1, 'only 1 remaining li');
  });

  test('can exit list section altogether by deleting', function (assert) {
    createEditorWithListMobiledoc();

    var listItem2 = $('#editor li:contains(second item)')[0];
    assert.ok(!!listItem2, 'precond - has listItem2');

    _testHelpers['default'].dom.moveCursorTo(listItem2.childNodes[0], 0);
    _testHelpers['default'].dom.triggerDelete(editor);

    assert.hasElement('#editor li:contains(first item)', 'still has first item');
    assert.hasNoElement('#editor li:contains(second item)', 'second li is gone');
    assert.hasElement('#editor p:contains(second item)', 'second li becomes p');

    _testHelpers['default'].dom.insertText(editor, 'X');

    assert.hasElement('#editor p:contains(Xsecond item)', 'new text is in right spot');
  });

  test('can split list item with <enter>', function (assert) {
    createEditorWithListMobiledoc();

    var li = $('#editor li:contains(first item)')[0];
    assert.ok(!!li, 'precond');

    _testHelpers['default'].dom.moveCursorTo(li.childNodes[0], 'fir'.length);
    _testHelpers['default'].dom.triggerEnter(editor);

    assert.hasNoElement('#editor li:contains(first item)', 'first item is split');
    assert.hasElement('#editor li:contains(fir)', 'has split "fir" li');
    assert.hasElement('#editor li:contains(st item)', 'has split "st item" li');
    assert.hasElement('#editor li:contains(second item)', 'has unchanged last li');
    assert.equal($('#editor li').length, 3, 'has 3 lis');

    // hitting enter can create the right DOM but put the AT out of sync with the
    // renderTree, so we must hit enter once more to fully test this

    li = $('#editor li:contains(fir)')[0];
    assert.ok(!!li, 'precond - has "fir"');
    _testHelpers['default'].dom.moveCursorTo(li.childNodes[0], 'fi'.length);
    _testHelpers['default'].dom.triggerEnter(editor);

    assert.hasNoElement('#editor li:contains(fir)');
    assert.hasElement('#editor li:contains(fi)', 'has split "fi" li');
    assert.hasElement('#editor li:contains(r)', 'has split "r" li');
    assert.equal($('#editor li').length, 4, 'has 4 lis');
  });

  test('can hit enter at end of list item to add new item', function (assert) {
    var done = assert.async();
    createEditorWithListMobiledoc();

    var li = $('#editor li:contains(first item)')[0];
    assert.ok(!!li, 'precond');

    _testHelpers['default'].dom.moveCursorTo(li.childNodes[0], 'first item'.length);
    _testHelpers['default'].dom.triggerEnter(editor);

    assert.equal($('#editor li').length, 3, 'adds a new li');
    var newLi = $('#editor li:eq(1)');
    assert.equal(newLi.text(), '', 'new li has no text');

    _testHelpers['default'].dom.insertText(editor, 'X');
    setTimeout(function () {
      assert.hasElement('#editor li:contains(X)', 'text goes in right spot');

      var liCount = $('#editor li').length;
      _testHelpers['default'].dom.triggerEnter(editor);
      _testHelpers['default'].dom.triggerEnter(editor);

      assert.equal($('#editor li').length, liCount + 2, 'adds two new empty list items');
      done();
    });
  });

  test('hitting enter to add list item, deleting to remove it, adding new list item, exiting list and typing', function (assert) {
    createEditorWithListMobiledoc();

    var li = $('#editor li:contains(first item)')[0];
    assert.ok(!!li, 'precond');

    _testHelpers['default'].dom.moveCursorTo(li.childNodes[0], 'first item'.length);
    _testHelpers['default'].dom.triggerEnter(editor);

    assert.equal($('#editor li').length, 3, 'adds a new li');

    _testHelpers['default'].dom.triggerDelete(editor);

    assert.equal($('#editor li').length, 2, 'removes middle, empty li after delete');
    assert.equal($('#editor p').length, 1, 'adds a new paragraph section where delete happened');

    li = $('#editor li:contains(first item)')[0];
    _testHelpers['default'].dom.moveCursorTo(li.childNodes[0], 'first item'.length);
    _testHelpers['default'].dom.triggerEnter(editor);

    assert.equal($('#editor li').length, 3, 'adds a new li after enter again');

    _testHelpers['default'].dom.triggerEnter(editor);

    assert.equal($('#editor li').length, 2, 'removes newly added li after enter on last list item');
    assert.equal($('#editor p').length, 2, 'adds a second p section');

    _testHelpers['default'].dom.insertText(editor, 'X');

    assert.hasElement('#editor p:eq(0):contains(X)', 'inserts text in right spot');
  });

  test('hitting enter at empty last list item exists list', function (assert) {
    createEditorWithListMobiledoc();

    assert.equal($('#editor p').length, 0, 'precond - no ps');

    var li = $('#editor li:contains(second item)')[0];
    assert.ok(!!li, 'precond');

    _testHelpers['default'].dom.moveCursorTo(li.childNodes[0], 'second item'.length);
    _testHelpers['default'].dom.triggerEnter(editor);

    assert.equal($('#editor li').length, 3, 'precond - adds a third li');

    _testHelpers['default'].dom.triggerEnter(editor);

    assert.equal($('#editor li').length, 2, 'removes empty li');
    assert.equal($('#editor p').length, 1, 'adds 1 new p');
    assert.equal($('#editor p').text(), '', 'p has no text');
    assert.hasNoElement('#editor ul p', 'does not nest p under ul');

    _testHelpers['default'].dom.insertText(editor, 'X');
    assert.hasElement('#editor p:contains(X)', 'text goes in right spot');
  });

  // https://github.com/bustlelabs/mobiledoc-kit/issues/117
  test('deleting at start of non-empty section after list item joins it with list item', function (assert) {
    var mobiledoc = _testHelpers['default'].mobiledoc.build(function (builder) {
      var post = builder.post;
      var markupSection = builder.markupSection;
      var marker = builder.marker;
      var listSection = builder.listSection;
      var listItem = builder.listItem;

      return post([listSection('ul', [listItem([marker('abc')])]), markupSection('p', [marker('def')])]);
    });
    createEditorWithMobiledoc(mobiledoc);

    var p = $('#editor p:contains(def)')[0];
    _testHelpers['default'].dom.moveCursorTo(p.childNodes[0], 0);
    _testHelpers['default'].dom.triggerDelete(editor);

    assert.hasNoElement('#editor p');
    assert.hasElement('#editor li:contains(abcdef)');
  });

  // https://github.com/bustlelabs/mobiledoc-kit/issues/117
  test('deleting at start of empty section after list item joins it with list item', function (assert) {
    var mobiledoc = _testHelpers['default'].mobiledoc.build(function (builder) {
      var post = builder.post;
      var markupSection = builder.markupSection;
      var marker = builder.marker;
      var listSection = builder.listSection;
      var listItem = builder.listItem;

      return post([listSection('ul', [listItem([marker('abc')])]), markupSection('p')]);
    });
    createEditorWithMobiledoc(mobiledoc);

    assert.hasElement('#editor p br', 'precond - br');
    var node = $('#editor p br')[0];
    _testHelpers['default'].dom.moveCursorTo(node, 0);
    _testHelpers['default'].dom.triggerDelete(editor);

    assert.hasNoElement('#editor p', 'removes p');

    _testHelpers['default'].dom.insertText(editor, 'X');

    assert.hasElement('#editor li:contains(abcX)', 'inserts text at right spot');
  });

  test('forward-delete in empty list item with nothing after it does nothing', function (assert) {
    var mobiledoc = _testHelpers['default'].mobiledoc.build(function (builder) {
      var post = builder.post;
      var listSection = builder.listSection;
      var listItem = builder.listItem;

      return post([listSection('ul', [listItem()])]);
    });
    createEditorWithMobiledoc(mobiledoc);

    assert.hasElement('#editor li br', 'precond - br');
    var node = $('#editor li br')[0];
    _testHelpers['default'].dom.moveCursorTo(node, 0);
    _testHelpers['default'].dom.triggerForwardDelete(editor);

    assert.hasElement('#editor li', 'li remains');

    _testHelpers['default'].dom.insertText(editor, 'X');

    assert.hasElement('#editor li:contains(X)', 'inserts text at right spot');
  });

  test('forward-delete in empty li with li after it joins with li', function (assert) {
    var mobiledoc = _testHelpers['default'].mobiledoc.build(function (builder) {
      var post = builder.post;
      var listSection = builder.listSection;
      var listItem = builder.listItem;
      var marker = builder.marker;

      return post([listSection('ul', [listItem(), listItem([marker('abc')])])]);
    });
    createEditorWithMobiledoc(mobiledoc);

    assert.equal($('#editor li').length, 2, 'precond - 2 lis');
    assert.hasElement('#editor li br', 'precond - br');
    var node = $('#editor li br')[0];
    _testHelpers['default'].dom.moveCursorTo(node, 0);
    _testHelpers['default'].dom.triggerForwardDelete(editor);

    assert.equal($('#editor li').length, 1, '1 li remains');
    assert.hasElement('#editor li:contains(abc)', 'correct li remains');

    _testHelpers['default'].dom.insertText(editor, 'X');

    assert.hasElement('#editor li:contains(Xabc)', 'inserts text at right spot');
  });

  test('forward-delete in empty li with markup section after it deletes li', function (assert) {
    var mobiledoc = _testHelpers['default'].mobiledoc.build(function (builder) {
      var post = builder.post;
      var listSection = builder.listSection;
      var listItem = builder.listItem;
      var markupSection = builder.markupSection;
      var marker = builder.marker;

      return post([listSection('ul', [listItem()]), markupSection('p', [marker('abc')])]);
    });
    createEditorWithMobiledoc(mobiledoc);

    assert.hasElement('#editor li br', 'precond - br');
    var node = $('#editor li br')[0];
    _testHelpers['default'].dom.moveCursorTo(node, 0);
    _testHelpers['default'].dom.triggerForwardDelete(editor);

    assert.hasNoElement('#editor li', 'li is removed');
    assert.hasElement('#editor p:contains(abc)', 'p remains');

    _testHelpers['default'].dom.insertText(editor, 'X');

    assert.hasElement('#editor p:contains(Xabc)', 'inserts text at right spot');
  });

  test('forward-delete end of li with nothing after', function (assert) {
    var mobiledoc = _testHelpers['default'].mobiledoc.build(function (builder) {
      var post = builder.post;
      var listSection = builder.listSection;
      var listItem = builder.listItem;
      var marker = builder.marker;

      return post([listSection('ul', [listItem([marker('abc')])])]);
    });
    createEditorWithMobiledoc(mobiledoc);

    var node = $('#editor li')[0].childNodes[0];
    _testHelpers['default'].dom.moveCursorTo(node, 'abc'.length);
    _testHelpers['default'].dom.triggerForwardDelete(editor);

    assert.hasElement('#editor li:contains(abc)', 'li remains');
    _testHelpers['default'].dom.insertText(editor, 'X');
    assert.hasElement('#editor li:contains(abcX)', 'inserts text at right spot');
  });

  test('forward-delete end of li with li after', function (assert) {
    var mobiledoc = _testHelpers['default'].mobiledoc.build(function (builder) {
      var post = builder.post;
      var listSection = builder.listSection;
      var listItem = builder.listItem;
      var marker = builder.marker;

      return post([listSection('ul', [listItem([marker('abc')]), listItem([marker('def')])])]);
    });
    createEditorWithMobiledoc(mobiledoc);

    assert.equal($('#editor li').length, 2, 'precond - 2 lis');
    var node = $('#editor li')[0].childNodes[0];
    _testHelpers['default'].dom.moveCursorTo(node, 'abc'.length);
    _testHelpers['default'].dom.triggerForwardDelete(editor);

    assert.hasElement('#editor li:contains(abcdef)', 'li is joined');
    assert.equal($('#editor li').length, 1, 'only 1 li');
    _testHelpers['default'].dom.insertText(editor, 'X');
    assert.hasElement('#editor li:contains(abcXdef)', 'inserts text at right spot');
  });

  test('forward-delete end of li with markup section after', function (assert) {
    var mobiledoc = _testHelpers['default'].mobiledoc.build(function (builder) {
      var post = builder.post;
      var listSection = builder.listSection;
      var listItem = builder.listItem;
      var marker = builder.marker;
      var markupSection = builder.markupSection;

      return post([listSection('ul', [listItem([marker('abc')])]), markupSection('p', [marker('def')])]);
    });
    createEditorWithMobiledoc(mobiledoc);

    var node = $('#editor li')[0].childNodes[0];
    _testHelpers['default'].dom.moveCursorTo(node, 'abc'.length);
    _testHelpers['default'].dom.triggerForwardDelete(editor);

    assert.hasElement('#editor li:contains(abcdef)', 'li is joined');
    assert.equal($('#editor li').length, 1, 'only 1 li');
    assert.hasNoElement('#editor p', 'p is removed');
    _testHelpers['default'].dom.insertText(editor, 'X');
    assert.hasElement('#editor li:contains(abcXdef)', 'inserts text at right spot');
  });

  // see https://github.com/bustlelabs/mobiledoc-kit/issues/130
  test('selecting empty list items does not cause error', function (assert) {
    var done = assert.async();
    var mobiledoc = _testHelpers['default'].mobiledoc.build(function (builder) {
      var post = builder.post;
      var listSection = builder.listSection;
      var listItem = builder.listItem;
      var marker = builder.marker;

      return post([listSection('ul', [listItem([marker('abc')]), listItem(), listItem([marker('def')])])]);
    });

    createEditorWithMobiledoc(mobiledoc);

    assert.equal($('#editor li').length, 3, 'precond - 3 lis');
    _testHelpers['default'].dom.moveCursorTo($('#editor li:eq(1)')[0], 0, $('#editor li:eq(2)')[0], 0);
    _testHelpers['default'].dom.triggerEvent(editor.element, 'click');
    setTimeout(function () {
      assert.ok(true, 'no error');

      _testHelpers['default'].dom.insertText(editor, 'X');
      assert.hasElement('#editor li:contains(Xdef)', 'insert text');
      assert.equal($('#editor li').length, 2, 'inserting text deletes selected li');
      done();
    });
  });

  // see https://github.com/bustlelabs/mobiledoc-kit/issues/128
  test('selecting list item and deleting leaves following section intact', function (assert) {
    var mobiledoc = _testHelpers['default'].mobiledoc.build(function (builder) {
      var post = builder.post;
      var markupSection = builder.markupSection;
      var listSection = builder.listSection;
      var listItem = builder.listItem;
      var marker = builder.marker;

      return post([listSection('ul', [listItem([marker('abc')]), listItem()]), markupSection('p', [marker('123')])]);
    });

    createEditorWithMobiledoc(mobiledoc);

    // precond
    assert.hasElement('#editor p:contains(123)');
    assert.hasElement('#editor li:contains(abc)');

    var liTextNode = $('#editor li:eq(0)')[0].childNodes[0];
    var emptyLiNode = $('#editor li:eq(1)')[0];
    assert.equal(liTextNode.textContent, 'abc'); // precond
    _testHelpers['default'].dom.moveCursorTo(liTextNode, 0, emptyLiNode, 0);
    _testHelpers['default'].dom.triggerDelete(editor);

    assert.hasElement('#editor p', 'does not delete p');
    _testHelpers['default'].dom.insertText(editor, 'X');
    assert.hasNoElement('#editor li:contains(abc)', 'li text is removed');
    assert.hasElement('#editor li:contains(X)', 'text is inserted');
  });
});
define('tests/acceptance/editor-post-editor-test', ['exports', 'mobiledoc-kit', '../test-helpers', 'mobiledoc-kit/utils/cursor/range'], function (exports, _mobiledocKit, _testHelpers, _mobiledocKitUtilsCursorRange) {
  'use strict';

  var _module = _testHelpers['default'].module;
  var test = _testHelpers['default'].test;

  var editor = undefined,
      editorElement = undefined;

  _module('Acceptance: Editor - PostEditor', {
    beforeEach: function beforeEach() {
      editorElement = $('#editor')[0];
    },
    afterEach: function afterEach() {
      if (editor) {
        editor.destroy();
      }
    }
  });

  test('#insertSectionAtEnd inserts the section at the end', function (assert) {
    var newSection = undefined;
    var mobiledoc = _testHelpers['default'].mobiledoc.build(function (_ref) {
      var post = _ref.post;
      var markupSection = _ref.markupSection;
      var marker = _ref.marker;

      newSection = markupSection('p', [marker('123')]);
      return post([markupSection('p', [marker('abc')])]);
    });
    editor = new _mobiledocKit.Editor({ mobiledoc: mobiledoc });
    editor.render(editorElement);

    //precond
    assert.hasElement('#editor p:contains(abc)');
    assert.hasNoElement('#editor p:contains(123)');

    editor.run(function (postEditor) {
      return postEditor.insertSectionAtEnd(newSection);
    });
    assert.hasElement('#editor p:eq(1):contains(123)', 'new section added at end');
  });

  test('#insertSection inserts after the cursor active section', function (assert) {
    var newSection = undefined;
    var mobiledoc = _testHelpers['default'].mobiledoc.build(function (_ref2) {
      var post = _ref2.post;
      var markupSection = _ref2.markupSection;
      var marker = _ref2.marker;

      newSection = markupSection('p', [marker('123')]);
      return post([markupSection('p', [marker('abc')]), markupSection('p', [marker('def')])]);
    });
    editor = new _mobiledocKit.Editor({ mobiledoc: mobiledoc });
    editor.render(editorElement);

    //precond
    assert.hasElement('#editor p:eq(0):contains(abc)');
    assert.hasElement('#editor p:eq(1):contains(def)');
    assert.hasNoElement('#editor p:contains(123)');

    _testHelpers['default'].dom.selectText('b', editorElement);

    editor.run(function (postEditor) {
      return postEditor.insertSection(newSection);
    });
    assert.hasElement('#editor p:eq(0):contains(abc)', 'still has 1st section');
    assert.hasElement('#editor p:eq(1):contains(123)', 'new section added after active section');
    assert.hasElement('#editor p:eq(2):contains(def)', '2nd section -> 3rd spot');
  });

  test('#insertSection inserts at end when no active cursor section', function (assert) {
    var newSection = undefined;
    var mobiledoc = _testHelpers['default'].mobiledoc.build(function (_ref3) {
      var post = _ref3.post;
      var markupSection = _ref3.markupSection;
      var marker = _ref3.marker;

      newSection = markupSection('p', [marker('123')]);
      return post([markupSection('p', [marker('abc')]), markupSection('p', [marker('def')])]);
    });
    editor = new _mobiledocKit.Editor({ mobiledoc: mobiledoc });
    editor.render(editorElement);

    //precond
    assert.hasElement('#editor p:eq(0):contains(abc)');
    assert.hasElement('#editor p:eq(1):contains(def)');
    assert.hasNoElement('#editor p:contains(123)');

    _testHelpers['default'].dom.clearSelection();
    editor.run(function (postEditor) {
      return postEditor.insertSection(newSection);
    });
    assert.hasElement('#editor p:eq(0):contains(abc)', 'still has 1st section');
    assert.hasElement('#editor p:eq(2):contains(123)', 'new section added at end');
    assert.hasElement('#editor p:eq(1):contains(def)', '2nd section -> same spot');
  });

  test('#insertSection can insert card, render it in display mode', function (assert) {
    var mobiledoc = _testHelpers['default'].mobiledoc.build(function (_ref4) {
      var post = _ref4.post;
      var markupSection = _ref4.markupSection;
      var marker = _ref4.marker;

      return post([markupSection('p', [marker('abc')])]);
    });

    var displayedCard = undefined,
        editedCard = undefined;
    var cards = [{
      name: 'sample-card',
      type: 'dom',
      render: function render() {
        displayedCard = true;
      },
      edit: function edit() {
        editedCard = true;
      }
    }];

    editor = new _mobiledocKit.Editor({ mobiledoc: mobiledoc, cards: cards });
    editor.render(editorElement);

    editor.run(function (postEditor) {
      var cardSection = postEditor.builder.createCardSection('sample-card');
      postEditor.insertSection(cardSection);
    });

    assert.ok(displayedCard, 'rendered card in display mode');
  });

  test('#insertSection inserts card, can render it in edit mode using #editCard', function (assert) {
    var mobiledoc = _testHelpers['default'].mobiledoc.build(function (_ref5) {
      var post = _ref5.post;
      var markupSection = _ref5.markupSection;
      var marker = _ref5.marker;

      return post([markupSection('p', [marker('abc')])]);
    });

    var displayedCard = undefined,
        editedCard = undefined;
    var cards = [{
      name: 'sample-card',
      type: 'dom',
      render: function render() {
        displayedCard = true;
      },
      edit: function edit() {
        editedCard = true;
      }
    }];

    editor = new _mobiledocKit.Editor({ mobiledoc: mobiledoc, cards: cards });
    editor.render(editorElement);

    editor.run(function (postEditor) {
      var cardSection = postEditor.builder.createCardSection('sample-card');
      postEditor.insertSection(cardSection);
      editor.editCard(cardSection);
    });

    assert.ok(editedCard, 'rendered card in edit mode');
    assert.ok(!displayedCard, 'did not render in display mode');
  });

  test('after inserting a section, can use editor#editCard to switch it to edit mode', function (assert) {
    var mobiledoc = _testHelpers['default'].mobiledoc.build(function (_ref6) {
      var post = _ref6.post;
      var cardSection = _ref6.cardSection;

      return post([cardSection('sample-card')]);
    });

    var displayedCard = undefined,
        editedCard = undefined;
    var cards = [{
      name: 'sample-card',
      type: 'dom',
      render: function render() {
        displayedCard = true;
      },
      edit: function edit() {
        editedCard = true;
      }
    }];

    editor = new _mobiledocKit.Editor({ mobiledoc: mobiledoc, cards: cards });
    editor.render(editorElement);
    assert.ok(displayedCard, 'called display#setup');
    assert.ok(!editedCard, 'did not call edit#setup yet');

    displayedCard = false;
    var card = editor.post.sections.head;
    editor.editCard(card);

    assert.ok(editedCard, 'called edit#setup');
    assert.ok(!displayedCard, 'did not call display#setup again');
  });

  test('can call editor#displayCard to switch card into display mode', function (assert) {
    var mobiledoc = _testHelpers['default'].mobiledoc.build(function (_ref7) {
      var post = _ref7.post;
      var cardSection = _ref7.cardSection;

      return post([cardSection('sample-card')]);
    });

    var displayedCard = undefined,
        editedCard = undefined;
    var cards = [{
      name: 'sample-card',
      type: 'dom',
      render: function render() {
        displayedCard = true;
      },
      edit: function edit() {
        editedCard = true;
      }
    }];

    editor = new _mobiledocKit.Editor({ mobiledoc: mobiledoc, cards: cards });
    editor.render(editorElement);

    assert.ok(displayedCard, 'precond - called display#setup');
    assert.ok(!editedCard, 'precond - did not call edit#setup yet');

    displayedCard = false;
    var card = editor.post.sections.head;
    editor.editCard(card);

    assert.ok(!displayedCard, 'card not in display mode');
    assert.ok(editedCard, 'card in edit mode');

    editedCard = false;

    editor.displayCard(card);

    assert.ok(displayedCard, 'card back in display mode');
    assert.ok(!editedCard, 'card not in edit mode');
  });

  test('#toggleMarkup adds markup by tag name', function (assert) {
    var mobiledoc = _testHelpers['default'].mobiledoc.build(function (_ref8) {
      var post = _ref8.post;
      var markupSection = _ref8.markupSection;
      var marker = _ref8.marker;

      return post([markupSection('p', [marker('abc'), marker('def')])]);
    });
    editor = new _mobiledocKit.Editor({ mobiledoc: mobiledoc });
    editor.render(editorElement);

    //precond
    assert.hasNoElement('#editor strong');

    _testHelpers['default'].dom.selectText('bc', editorElement, 'd', editorElement);
    editor.run(function (postEditor) {
      return postEditor.toggleMarkup('strong');
    });
    assert.hasElement('#editor strong:contains(bcd)');
  });

  test('#toggleMarkup removes markup by tag name', function (assert) {
    var mobiledoc = _testHelpers['default'].mobiledoc.build(function (_ref9) {
      var post = _ref9.post;
      var markupSection = _ref9.markupSection;
      var marker = _ref9.marker;
      var markup = _ref9.markup;

      var strong = markup('strong');
      return post([markupSection('p', [marker('a'), marker('bcde', [strong]), marker('f')])]);
    });
    editor = new _mobiledocKit.Editor({ mobiledoc: mobiledoc });
    editor.render(editorElement);

    //precond
    assert.hasElement('#editor strong:contains(bcde)');

    _testHelpers['default'].dom.selectText('bc', editorElement, 'd', editorElement);
    editor.run(function (postEditor) {
      return postEditor.toggleMarkup('strong');
    });
    assert.hasNoElement('#editor strong:contains(bcd)', 'markup removed from selection');
    assert.hasElement('#editor strong:contains(e)', 'unselected text still bold');
  });

  test('#toggleMarkup does nothing with an empty selection', function (assert) {
    var mobiledoc = _testHelpers['default'].mobiledoc.build(function (_ref10) {
      var post = _ref10.post;
      var markupSection = _ref10.markupSection;
      var marker = _ref10.marker;

      return post([markupSection('p', [marker('a')])]);
    });
    editor = new _mobiledocKit.Editor({ mobiledoc: mobiledoc });
    editor.render(editorElement);

    editor.run(function (postEditor) {
      return postEditor.toggleMarkup('strong');
    });

    assert.hasNoElement('#editor strong', 'strong not added, nothing selected');
  });

  test('postEditor reads editor range, sets it with #setRange', function (assert) {
    var mobiledoc = _testHelpers['default'].mobiledoc.build(function (_ref11) {
      var post = _ref11.post;
      var markupSection = _ref11.markupSection;
      var marker = _ref11.marker;

      return post([markupSection('p', [marker('abc')])]);
    });
    editor = new _mobiledocKit.Editor({ mobiledoc: mobiledoc });
    editor.render(editorElement);

    var _editor = editor;
    var post = _editor.post;

    _testHelpers['default'].dom.selectText('bc', editorElement);

    var range = undefined,
        originalRange = undefined,
        expectedRange = undefined;
    editor.run(function (postEditor) {
      originalRange = range = editor.range;
      expectedRange = _mobiledocKitUtilsCursorRange['default'].create(post.sections.head, 1, post.sections.head, 3);
      assert.ok(range.isEqual(expectedRange), 'postEditor.range is correct');

      expectedRange = _mobiledocKitUtilsCursorRange['default'].create(post.sections.head, 0, post.sections.head, 1);
      postEditor.setRange(expectedRange);
      range = editor.range;
      assert.ok(range.isEqual(expectedRange), 'postEditor.range is correct after set');

      assert.ok(!originalRange.isEqual(expectedRange), 'original range has diverged');
      assert.ok(editor.cursor.offsets.isEqual(originalRange), 'dom range is not changed');
    });

    assert.ok(editor.range.isEqual(expectedRange), 'range is set from postEditor.range after run');
  });
});
define('tests/acceptance/editor-reparse-test', ['exports', '../test-helpers', 'mobiledoc-kit/renderers/editor-dom'], function (exports, _testHelpers, _mobiledocKitRenderersEditorDom) {
  'use strict';

  var test = _testHelpers['default'].test;
  var _module = _testHelpers['default'].module;

  var simpleAtom = {
    name: 'simple-atom',
    type: 'dom',
    render: function render(_ref) {
      var value = _ref.value;

      var element = document.createElement('span');
      element.setAttribute('id', 'simple-atom');
      element.appendChild(document.createTextNode(value));
      return element;
    }
  };

  var editor = undefined,
      editorElement = undefined;
  var editorOptions = { atoms: [simpleAtom] };

  _module('Acceptance: Editor: Reparsing', {
    beforeEach: function beforeEach() {
      editorElement = $('#editor')[0];
    },
    afterEach: function afterEach() {
      if (editor) {
        editor.destroy();
      }
    }
  });

  test('changing text node content causes reparse of section', function (assert) {
    var done = assert.async();
    var expected = undefined;
    editor = _testHelpers['default'].mobiledoc.renderInto(editorElement, function (_ref2) {
      var post = _ref2.post;
      var markupSection = _ref2.markupSection;
      var marker = _ref2.marker;

      expected = post([markupSection('p', [marker('def')])]);

      return post([markupSection('p', [marker('abc')])]);
    });

    var section = editor.post.sections.head;
    var node = section.markers.head.renderNode.element;

    assert.equal(node.textContent, 'abc', 'precond - correct text node');
    assert.equal(section.text, 'abc', 'precond - correct section');

    node.textContent = 'def';

    setTimeout(function () {
      assert.equal(section.text, 'def', 'section reparsed correctly');
      assert.postIsSimilar(editor.post, expected);
      done();
    });
  });

  test('removing text node causes reparse of section', function (assert) {
    var done = assert.async();
    var expected = undefined;
    editor = _testHelpers['default'].mobiledoc.renderInto(editorElement, function (_ref3) {
      var post = _ref3.post;
      var markupSection = _ref3.markupSection;
      var marker = _ref3.marker;

      expected = post([markupSection('p', [marker('def')])]);

      return post([markupSection('p', [marker('abc'), marker('def')])]);
    });

    var section = editor.post.sections.head;
    var node = section.markers.head.renderNode.element;

    assert.equal(node.textContent, 'abc', 'precond - correct text node');
    assert.equal(section.text, 'abcdef', 'precond - correct section');

    node.parentNode.removeChild(node);

    setTimeout(function () {
      assert.equal(section.text, 'def', 'section reparsed correctly');
      assert.postIsSimilar(editor.post, expected);
      done();
    });
  });

  test('removing section node causes reparse of post', function (assert) {
    var done = assert.async();
    var expected = undefined;
    editor = _testHelpers['default'].mobiledoc.renderInto(editorElement, function (_ref4) {
      var post = _ref4.post;
      var markupSection = _ref4.markupSection;
      var marker = _ref4.marker;

      expected = post([markupSection('p', [marker('123')])]);

      return post([markupSection('p', [marker('abc')]), markupSection('p', [marker('123')])]);
    });

    var node = editor.post.sections.head.renderNode.element;
    assert.equal(node.innerHTML, 'abc', 'precond - correct node');

    node.parentNode.removeChild(node);

    setTimeout(function () {
      assert.postIsSimilar(editor.post, expected);
      done();
    });
  });

  test('inserting styled span in section causes section reparse', function (assert) {
    var done = assert.async();
    var expected = undefined;
    editor = _testHelpers['default'].mobiledoc.renderInto(editorElement, function (_ref5) {
      var post = _ref5.post;
      var markupSection = _ref5.markupSection;
      var marker = _ref5.marker;

      expected = post([markupSection('p', [marker('abc'), marker('def')])]);

      return post([markupSection('p', [marker('abc')])]);
    });

    var node = editor.post.sections.head.renderNode.element;
    assert.equal(node.innerHTML, 'abc', 'precond - correct node');

    var span = document.createElement('span');
    span.setAttribute('style', 'font-size: 24px; font-color: blue');
    span.appendChild(document.createTextNode('def'));
    node.appendChild(span);

    setTimeout(function () {
      assert.postIsSimilar(editor.post, expected);
      done();
    });
  });

  test('inserting new top-level node causes reparse of post', function (assert) {
    var done = assert.async();
    var expected = undefined;
    editor = _testHelpers['default'].mobiledoc.renderInto(editorElement, function (_ref6) {
      var post = _ref6.post;
      var markupSection = _ref6.markupSection;
      var marker = _ref6.marker;

      expected = post([markupSection('p', [marker('abc')]), markupSection('p', [marker('123')])]);

      return post([markupSection('p', [marker('abc')])]);
    });

    var span = document.createElement('span');
    span.appendChild(document.createTextNode('123'));
    editorElement.appendChild(span);

    setTimeout(function () {
      assert.postIsSimilar(editor.post, expected);
      done();
    });
  });

  test('inserting node into blank post causes reparse', function (assert) {
    var done = assert.async();
    var expected = undefined;

    editor = _testHelpers['default'].mobiledoc.renderInto(editorElement, function (_ref7) {
      var post = _ref7.post;
      var markupSection = _ref7.markupSection;
      var marker = _ref7.marker;

      expected = post([markupSection('p', [marker('123')])]);
      return post();
    });

    var span = document.createElement('span');
    span.appendChild(document.createTextNode('123'));
    editorElement.appendChild(span);

    setTimeout(function () {
      assert.postIsSimilar(editor.post, expected);
      done();
    });
  });

  test('after reparsing post, mutations still handled properly', function (assert) {
    var done = assert.async();
    var expected1 = undefined,
        expected2 = undefined;
    editor = _testHelpers['default'].mobiledoc.renderInto(editorElement, function (_ref8) {
      var post = _ref8.post;
      var markupSection = _ref8.markupSection;
      var marker = _ref8.marker;

      expected1 = post([markupSection('p', [marker('abc')]), markupSection('p', [marker('123')])]);

      expected2 = post([markupSection('p', [marker('def')]), markupSection('p', [marker('123')])]);

      return post([markupSection('p', [marker('abc')])]);
    });

    var span = document.createElement('span');
    span.appendChild(document.createTextNode('123'));
    editorElement.appendChild(span);

    setTimeout(function () {
      assert.postIsSimilar(editor.post, expected1);

      var node = editorElement.firstChild.firstChild;
      assert.equal(node.textContent, 'abc', 'precond - correct node');

      node.textContent = 'def';

      setTimeout(function () {
        assert.postIsSimilar(editor.post, expected2);

        done();
      });
    });
  });

  test('inserting text into text node on left/right of atom is reparsed correctly', function (assert) {
    var done = assert.async();
    var expected1 = undefined,
        expected2 = undefined;
    editor = _testHelpers['default'].mobiledoc.renderInto(editorElement, function (_ref9) {
      var post = _ref9.post;
      var markupSection = _ref9.markupSection;
      var marker = _ref9.marker;
      var atom = _ref9.atom;

      expected1 = post([markupSection('p', [atom('simple-atom', 'first'), marker('Z')])]);

      expected2 = post([markupSection('p', [marker('A'), atom('simple-atom', 'first'), marker('Z')])]);

      return post([markupSection('p', [atom('simple-atom', 'first')])]);
    }, editorOptions);

    var atom = editor.post.sections.head.markers.head;
    var rightCursorNode = atom.renderNode.tailTextNode;

    assert.ok(rightCursorNode && rightCursorNode.textContent === _mobiledocKitRenderersEditorDom.ZWNJ, 'precond - correct right cursor node');

    rightCursorNode.textContent = 'Z';
    setTimeout(function () {
      assert.postIsSimilar(editor.post, expected1);
      assert.renderTreeIsEqual(editor._renderTree, expected1);

      var leftCursorNode = atom.renderNode.headTextNode;
      assert.ok(leftCursorNode && leftCursorNode.textContent === _mobiledocKitRenderersEditorDom.ZWNJ, 'precond - correct left cursor node');
      leftCursorNode.textContent = 'A';

      setTimeout(function () {
        assert.postIsSimilar(editor.post, expected2);
        assert.renderTreeIsEqual(editor._renderTree, expected2);

        done();
      });
    });
  });

  test('mutation inside card element does not cause reparse', function (assert) {
    var done = assert.async();
    var parseCount = 0;
    var myCard = {
      name: 'my-card',
      type: 'dom',
      render: function render() {
        return document.createTextNode('howdy');
      }
    };

    editor = _testHelpers['default'].mobiledoc.renderInto(editorElement, function (_ref10) {
      var post = _ref10.post;
      var cardSection = _ref10.cardSection;

      return post([cardSection('my-card', {})]);
    }, {
      cards: [myCard]
    });

    editor.didUpdatePost(function () {
      parseCount++;
    });

    var textNode = _testHelpers['default'].dom.findTextNode(editorElement, 'howdy');
    textNode.textContent = 'adios';

    // Allow the mutation observer to fire then...
    setTimeout(function () {
      assert.equal(0, parseCount);
      done();
    }, 0);
  });
});
define('tests/acceptance/editor-sections-test', ['exports', 'mobiledoc-kit', '../test-helpers', 'mobiledoc-kit/renderers/mobiledoc/0-2', 'mobiledoc-kit/renderers/editor-dom'], function (exports, _mobiledocKit, _testHelpers, _mobiledocKitRenderersMobiledoc02, _mobiledocKitRenderersEditorDom) {
  'use strict';

  var test = _testHelpers['default'].test;
  var _module = _testHelpers['default'].module;

  var editor = undefined,
      editorElement = undefined;
  var mobileDocWith1Section = {
    version: _mobiledocKitRenderersMobiledoc02.MOBILEDOC_VERSION,
    sections: [[], [[1, "P", [[[], 0, "only section"]]]]]
  };
  var mobileDocWith2Sections = {
    version: _mobiledocKitRenderersMobiledoc02.MOBILEDOC_VERSION,
    sections: [[], [[1, "P", [[[], 0, "first section"]]], [1, "P", [[[], 0, "second section"]]]]]
  };
  var mobileDocWith3Sections = {
    version: _mobiledocKitRenderersMobiledoc02.MOBILEDOC_VERSION,
    sections: [[], [[1, "P", [[[], 0, "first section"]]], [1, "P", [[[], 0, "second section"]]], [1, "P", [[[], 0, "third section"]]]]]
  };

  var mobileDocWith2Markers = {
    version: _mobiledocKitRenderersMobiledoc02.MOBILEDOC_VERSION,
    sections: [[['b']], [[1, "P", [[[0], 1, "bold"], [[], 0, "plain"]]]]]
  };

  var mobileDocWith1Character = {
    version: _mobiledocKitRenderersMobiledoc02.MOBILEDOC_VERSION,
    sections: [[], [[1, "P", [[[], 0, "c"]]]]]
  };

  var mobileDocWithNoCharacter = {
    version: _mobiledocKitRenderersMobiledoc02.MOBILEDOC_VERSION,
    sections: [[], [[1, "P", [[[], 0, ""]]]]]
  };

  _module('Acceptance: Editor sections', {
    beforeEach: function beforeEach() {
      editorElement = $('#editor')[0];
    },

    afterEach: function afterEach() {
      if (editor) {
        editor.destroy();
        editor = null;
      }
    }
  });

  test('typing enter inserts new section', function (assert) {
    editor = new _mobiledocKit.Editor({ mobiledoc: mobileDocWith1Section });
    editor.render(editorElement);
    assert.equal($('#editor p').length, 1, 'has 1 paragraph to start');

    _testHelpers['default'].dom.moveCursorTo(editorElement.childNodes[0].childNodes[0], 5);
    _testHelpers['default'].dom.triggerEnter(editor);

    assert.equal($('#editor p').length, 2, 'has 2 paragraphs after typing return');
    assert.hasElement('#editor p:contains(only)', 'has correct first pargraph text');
    assert.hasElement('#editor p:contains(section)', 'has correct second paragraph text');
  });

  test('typing enter inserts new section from blank section', function (assert) {
    editor = new _mobiledocKit.Editor({ mobiledoc: mobileDocWithNoCharacter });
    editor.render(editorElement);
    assert.equal($('#editor p').length, 1, 'has 1 paragraph to start');

    _testHelpers['default'].dom.moveCursorTo(editorElement.childNodes[0].childNodes[0], 0);
    _testHelpers['default'].dom.triggerEnter(editor);

    assert.equal($('#editor p').length, 2, 'has 2 paragraphs after typing return');
  });

  test('hitting enter in first section splits it correctly', function (assert) {
    editor = new _mobiledocKit.Editor({ mobiledoc: mobileDocWith2Sections });
    editor.render(editorElement);
    assert.equal($('#editor p').length, 2, 'precond - has 2 paragraphs');

    _testHelpers['default'].dom.moveCursorTo(editorElement.childNodes[0].childNodes[0], 3);
    _testHelpers['default'].dom.triggerEnter(editor);

    assert.equal($('#editor p').length, 3, 'has 3 paragraphs after typing return');

    assert.equal($('#editor p:eq(0)').text(), 'fir', 'first para has correct text');
    assert.equal($('#editor p:eq(1)').text(), 'st section', 'second para has correct text');
    assert.equal($('#editor p:eq(2)').text(), 'second section', 'third para still has correct text');

    assert.deepEqual(_testHelpers['default'].dom.getCursorPosition(), { node: editorElement.childNodes[1].childNodes[0],
      offset: 0 });
  });

  test('hitting enter at start of a section creates empty section where cursor was', function (assert) {
    editor = new _mobiledocKit.Editor({ mobiledoc: mobileDocWith1Section });
    editor.render(editorElement);
    assert.equal($('#editor p').length, 1, 'has 1 paragraph to start');

    _testHelpers['default'].dom.moveCursorTo(editorElement.childNodes[0].childNodes[0], 0);
    _testHelpers['default'].dom.triggerEnter(editor);

    assert.equal($('#editor p').length, 2, 'has 2 paragraphs after typing return');

    var firstP = $('#editor p:eq(0)');
    assert.equal(firstP.text(), '', 'first para has no text');
    assert.hasElement('#editor p:eq(1):contains(only section)', 'has correct second paragraph text');

    assert.deepEqual(_testHelpers['default'].dom.getCursorPosition(), { node: editorElement.childNodes[1].childNodes[0],
      offset: 0 });
  });

  test('hitting enter at end of a section creates new empty section', function (assert) {
    editor = new _mobiledocKit.Editor({ mobiledoc: mobileDocWith1Section });
    editor.render(editorElement);
    assert.equal($('#editor p').length, 1, 'has 1 section to start');

    _testHelpers['default'].dom.moveCursorTo(editorElement.childNodes[0].childNodes[0], 'only section'.length);
    _testHelpers['default'].dom.triggerEnter(editor);

    assert.equal($('#editor p').length, 2, 'has 2 sections after typing return');
    assert.hasElement('#editor p:eq(0):contains(only section)', 'has same first section text');
    assert.hasElement('#editor p:eq(1):contains()', 'second section has no text');

    _testHelpers['default'].dom.insertText(editor, 'X');

    assert.hasElement('#editor p:eq(1):contains(X)', 'text is inserted in the new section');
  });

  test('hitting enter in a section creates a new basic section', function (assert) {
    var mobiledoc = _testHelpers['default'].mobiledoc.build(function (_ref) {
      var post = _ref.post;
      var markupSection = _ref.markupSection;
      var marker = _ref.marker;
      return post([markupSection('h2', [marker('abc')])]);
    });
    editor = new _mobiledocKit.Editor({ mobiledoc: mobiledoc });
    editor.render(editorElement);
    assert.hasElement('#editor h2:contains(abc)', 'precond - h2 is there');
    assert.hasNoElement('#editor p', 'precond - no p tag');

    _testHelpers['default'].dom.moveCursorTo($('#editor h2')[0].childNodes[0], 'abc'.length);
    _testHelpers['default'].dom.triggerEnter(editor);
    _testHelpers['default'].dom.insertText(editor, 'X');

    assert.hasElement('#editor h2:contains(abc)', 'h2 still there');
    assert.hasElement('#editor p:contains(X)', 'p tag instead of h2 generated');
  });

  test('deleting across 2 sections does nothing if editing is disabled', function (assert) {
    editor = new _mobiledocKit.Editor({ mobiledoc: mobileDocWith2Sections });
    editor.render(editorElement);
    editor.disableEditing();
    assert.equal($('#editor p').length, 2, 'precond - has 2 sections to start');

    var p0 = $('#editor p:eq(0)')[0],
        p1 = $('#editor p:eq(1)')[0];

    _testHelpers['default'].dom.selectText('tion', p0, 'sec', p1);
    _testHelpers['default'].dom.triggerDelete(editor);

    assert.equal($('#editor p').length, 2, 'still has 2 sections');
  });

  test('deleting across 2 sections merges them', function (assert) {
    editor = new _mobiledocKit.Editor({ mobiledoc: mobileDocWith2Sections });
    editor.render(editorElement);
    assert.equal($('#editor p').length, 2, 'precond - has 2 sections to start');

    var p0 = $('#editor p:eq(0)')[0],
        p1 = $('#editor p:eq(1)')[0];

    _testHelpers['default'].dom.selectText('tion', p0, 'sec', p1);
    _testHelpers['default'].dom.triggerDelete(editor);

    assert.equal($('#editor p').length, 1, 'has only 1 paragraph after deletion');
    assert.hasElement('#editor p:contains(first second section)', 'remaining paragraph has correct text');
  });

  test('deleting across 1 section removes it, joins the 2 boundary sections', function (assert) {
    editor = new _mobiledocKit.Editor({ mobiledoc: mobileDocWith3Sections });
    editor.render(editorElement);
    assert.equal($('#editor p').length, 3, 'precond - has 3 paragraphs to start');

    var p0 = $('#editor p:eq(0)')[0],
        p1 = $('#editor p:eq(1)')[0],
        p2 = $('#editor p:eq(2)')[0];
    assert.ok(p0 && p1 && p2, 'precond - paragraphs exist');

    _testHelpers['default'].dom.selectText('section', p0, 'third ', p2);
    _testHelpers['default'].dom.triggerDelete(editor);

    assert.equal($('#editor p').length, 1, 'has only 1 paragraph after deletion');
    assert.hasElement('#editor p:contains(first section)', 'remaining paragraph has correct text');
  });

  test('keystroke of delete removes that character', function (assert) {
    editor = new _mobiledocKit.Editor({ mobiledoc: mobileDocWith3Sections });
    editor.render(editorElement);
    var getFirstTextNode = function getFirstTextNode() {
      return editor.element.firstChild. // section
      firstChild; // marker
    };
    var textNode = getFirstTextNode();
    _testHelpers['default'].dom.moveCursorTo(textNode, 1);

    _testHelpers['default'].dom.triggerDelete(editor);

    assert.equal($('#editor p:eq(0)').html(), 'irst section', 'deletes first character');

    var newTextNode = getFirstTextNode();
    assert.deepEqual(_testHelpers['default'].dom.getCursorPosition(), { node: newTextNode, offset: 0 }, 'cursor is at start of new text node');
  });

  test('keystroke of delete removes emoji character', function (assert) {
    var monkey = 'monkey🙈';
    var mobiledoc = _testHelpers['default'].mobiledoc.build(function (_ref2) {
      var post = _ref2.post;
      var markupSection = _ref2.markupSection;
      var marker = _ref2.marker;

      return post([markupSection('p', [marker(monkey)])]);
    });
    editor = new _mobiledocKit.Editor({ mobiledoc: mobiledoc });
    editor.render(editorElement);
    var textNode = editorElement.firstChild. // section
    firstChild; // marker
    assert.equal(textNode.textContent, monkey, 'precond - correct text');

    _testHelpers['default'].dom.moveCursorTo(textNode, monkey.length);
    _testHelpers['default'].dom.triggerDelete(editor);

    assert.equal($('#editor p:eq(0)').text(), 'monkey', 'deletes the emoji');
  });

  test('keystroke of forward delete removes emoji character', function (assert) {
    var monkey = 'monkey🙈';
    var mobiledoc = _testHelpers['default'].mobiledoc.build(function (_ref3) {
      var post = _ref3.post;
      var markupSection = _ref3.markupSection;
      var marker = _ref3.marker;

      return post([markupSection('p', [marker(monkey)])]);
    });
    editor = new _mobiledocKit.Editor({ mobiledoc: mobiledoc });
    editor.render(editorElement);
    var textNode = editorElement.firstChild. // section
    firstChild; // marker
    assert.equal(textNode.textContent, monkey, 'precond - correct text');

    _testHelpers['default'].dom.moveCursorTo(textNode, 'monkey'.length);
    _testHelpers['default'].dom.triggerForwardDelete(editor);

    assert.equal($('#editor p:eq(0)').text(), 'monkey', 'deletes the emoji');
  });

  test('keystroke of delete when cursor is at beginning of marker removes character from previous marker', function (assert) {
    editor = new _mobiledocKit.Editor({ mobiledoc: mobileDocWith2Markers });
    editor.render(editorElement);
    var textNode = editor.element.firstChild. // section
    childNodes[1]; // plain marker

    assert.ok(!!textNode, 'gets text node');
    _testHelpers['default'].dom.moveCursorTo(textNode, 0);

    _testHelpers['default'].dom.triggerDelete(editor);

    assert.equal($('#editor p:eq(0)').html(), '<b>bol</b>plain', 'deletes last character of previous marker');

    var boldNode = editor.element.firstChild. // section
    firstChild; // bold marker
    var boldTextNode = boldNode.firstChild;

    assert.deepEqual(_testHelpers['default'].dom.getCursorPosition(), { node: boldTextNode, offset: 3 }, 'cursor moves to end of previous text node');
  });

  test('keystroke of delete when cursor is after only char in only marker of section removes character', function (assert) {
    editor = new _mobiledocKit.Editor({ mobiledoc: mobileDocWith1Character });
    editor.render(editorElement);
    var getTextNode = function getTextNode() {
      return editor.element.firstChild. // section
      firstChild;
    }; // c marker

    var textNode = getTextNode();
    assert.ok(!!textNode, 'gets text node');
    _testHelpers['default'].dom.moveCursorTo(textNode, 1);

    _testHelpers['default'].dom.triggerDelete(editor);

    assert.hasElement('#editor p:eq(0):contains()', 'first p is empty');

    _testHelpers['default'].dom.insertText(editor, 'X');
    assert.hasElement('#editor p:eq(0):contains(X)', 'text is added back to section');
  });

  test('keystroke of character in empty section adds character, moves cursor', function (assert) {
    editor = new _mobiledocKit.Editor({ mobiledoc: mobileDocWithNoCharacter });
    editor.render(editorElement);

    assert.hasElement('#editor p br', 'precond - br tag rendered for empty section');
    var pNode = $('#editor p')[0];

    // Firefox requires that the cursor be placed explicitly for this test to pass
    _testHelpers['default'].dom.moveCursorTo(pNode, 0);

    var letter = 'M';
    _testHelpers['default'].dom.insertText(editor, letter);

    assert.hasElement('#editor p:contains(' + letter + ')', 'adds char');

    var otherLetter = 'X';
    _testHelpers['default'].dom.insertText(editor, otherLetter);

    assert.hasElement('#editor p:contains(' + letter + otherLetter + ')', 'adds char in correct spot');
  });

  test('keystroke of delete at start of section joins with previous section', function (assert) {
    editor = new _mobiledocKit.Editor({ mobiledoc: mobileDocWith2Sections });
    editor.render(editorElement);

    var secondSectionTextNode = editor.element.childNodes[1].firstChild;

    assert.equal(secondSectionTextNode.textContent, 'second section', 'precond - section section text node');

    _testHelpers['default'].dom.moveCursorTo(secondSectionTextNode, 0);
    _testHelpers['default'].dom.triggerDelete(editor);

    assert.equal(editor.element.childNodes.length, 1, 'only 1 section remaining');

    var secondSectionNode = editor.element.firstChild;
    secondSectionTextNode = secondSectionNode.firstChild;
    assert.equal(secondSectionNode.textContent, 'first sectionsecond section', 'joins two sections');

    _testHelpers['default'].dom.insertText(editor, 'X');

    assert.hasElement('#editor p:contains(first sectionXsecond section)', 'inserts text at correct spot');
  });

  test('keystroke of delete at start of first section does nothing', function (assert) {
    editor = new _mobiledocKit.Editor({ mobiledoc: mobileDocWith2Sections });
    editor.render(editorElement);

    var firstSectionTextNode = editor.element.childNodes[0].firstChild;

    assert.equal(firstSectionTextNode.textContent, 'first section', 'finds first section text node');

    _testHelpers['default'].dom.moveCursorTo(firstSectionTextNode, 0);

    _testHelpers['default'].dom.triggerDelete(editor);

    assert.equal(editor.element.childNodes.length, 2, 'still 2 sections');
    firstSectionTextNode = editor.element.childNodes[0].firstChild;
    assert.equal(firstSectionTextNode.textContent, 'first section', 'first section still has same text content');

    assert.deepEqual(_testHelpers['default'].dom.getCursorPosition(), { node: firstSectionTextNode,
      offset: 0 }, 'cursor stays at start of first section');
  });

  test('when selection incorrectly contains P end tag, editor reports correct selection', function (assert) {
    var done = assert.async();

    editor = new _mobiledocKit.Editor({ mobiledoc: mobileDocWith2Sections });
    editor.render(editorElement);

    var secondSectionTextNode = editor.element.childNodes[1].firstChild;
    var firstSectionPNode = editor.element.childNodes[0];

    _testHelpers['default'].dom.moveCursorTo(firstSectionPNode, 0, secondSectionTextNode, 0);
    _testHelpers['default'].dom.triggerEvent(document, 'mouseup');

    setTimeout(function () {
      assert.ok(true, 'No error should occur');

      var _editor$range = editor.range;
      var headSection = _editor$range.headSection;
      var tailSection = _editor$range.tailSection;
      var headMarker = _editor$range.headMarker;
      var tailMarker = _editor$range.tailMarker;
      var headSectionOffset = _editor$range.headSectionOffset;
      var tailSectionOffset = _editor$range.tailSectionOffset;
      var headMarkerOffset = _editor$range.headMarkerOffset;
      var tailMarkerOffset = _editor$range.tailMarkerOffset;

      assert.ok(headSection === editor.post.sections.objectAt(0), 'returns first section head');
      assert.ok(tailSection === editor.post.sections.objectAt(1), 'returns second section tail');
      assert.ok(headMarker === editor.post.sections.objectAt(0).markers.head, 'returns first section marker head');
      assert.ok(tailMarker === editor.post.sections.objectAt(1).markers.head, 'returns second section marker tail');
      assert.equal(headMarkerOffset, 0, 'headMarkerOffset correct');
      assert.equal(tailMarkerOffset, 0, 'tailMarkerOffset correct');
      assert.equal(headSectionOffset, 0, 'headSectionOffset correct');
      assert.equal(tailSectionOffset, 0, 'tailSectionOffset correct');

      done();
    });
  });

  test('when selection incorrectly contains P start tag, editor reports correct selection', function (assert) {
    var done = assert.async();

    editor = new _mobiledocKit.Editor({ mobiledoc: mobileDocWith2Sections });
    editor.render(editorElement);

    var firstSectionTextNode = editor.element.childNodes[0].firstChild;
    var secondSectionPNode = editor.element.childNodes[1];

    _testHelpers['default'].dom.moveCursorTo(firstSectionTextNode, 0, secondSectionPNode, 0);
    _testHelpers['default'].dom.triggerEvent(document, 'mouseup');

    setTimeout(function () {
      assert.ok(true, 'No error should occur');

      var _editor$range2 = editor.range;
      var headSection = _editor$range2.headSection;
      var tailSection = _editor$range2.tailSection;
      var headMarker = _editor$range2.headMarker;
      var tailMarker = _editor$range2.tailMarker;
      var headSectionOffset = _editor$range2.headSectionOffset;
      var tailSectionOffset = _editor$range2.tailSectionOffset;
      var headMarkerOffset = _editor$range2.headMarkerOffset;
      var tailMarkerOffset = _editor$range2.tailMarkerOffset;

      assert.equal(headSection, editor.post.sections.objectAt(0), 'returns first section head');
      assert.equal(tailSection, editor.post.sections.objectAt(1), 'returns second section tail');
      assert.equal(headMarker, editor.post.sections.objectAt(0).markers.head, 'returns first section marker head');
      assert.equal(tailMarker, editor.post.sections.objectAt(1).markers.head, 'returns second section marker tail');
      assert.equal(headMarkerOffset, 0, 'headMarkerOffset correct');
      assert.equal(tailMarkerOffset, 0, 'tailMarkerOffset correct');
      assert.equal(headSectionOffset, 0, 'headSectionOffset correct');
      assert.equal(tailSectionOffset, 0, 'tailSectionOffset correct');

      done();
    });
  });

  test('deleting when after deletion there is a trailing space positions cursor at end of selection', function (assert) {
    var done = assert.async();

    editor = new _mobiledocKit.Editor({ mobiledoc: mobileDocWith2Sections });
    editor.render(editorElement);

    var firstSectionTextNode = editor.element.childNodes[0].firstChild;
    _testHelpers['default'].dom.moveCursorTo(firstSectionTextNode, 'first section'.length);

    var count = 'ection'.length;
    while (count--) {
      _testHelpers['default'].dom.triggerDelete(editor);
    }

    assert.equal($('#editor p:eq(0)').text(), 'first s', 'precond - correct section text after initial deletions');

    _testHelpers['default'].dom.triggerDelete(editor);

    assert.equal($('#editor p:eq(0)').text(), 'first' + _mobiledocKitRenderersEditorDom.NO_BREAK_SPACE, 'precond - correct text after deleting last char before space');

    var text = 'e';
    _testHelpers['default'].dom.insertText(editor, text);

    setTimeout(function () {
      assert.equal(editor.post.sections.head.text, 'first ' + text, 'character is placed after space');

      done();
    });
  });

  test('deleting when after deletion there is a leading space positions cursor at start of selection', function (assert) {
    var done = assert.async();

    editor = new _mobiledocKit.Editor({ mobiledoc: mobileDocWith2Sections });
    editor.render(editorElement);

    _testHelpers['default'].dom.selectText('second', editorElement);
    _testHelpers['default'].dom.triggerDelete(editor);

    assert.equal($('#editor p:eq(1)').text(), _mobiledocKitRenderersEditorDom.NO_BREAK_SPACE + 'section', 'correct text after deletion');
    var text = 'e';
    _testHelpers['default'].dom.insertText(editor, text);

    setTimeout(function () {
      assert.equal(editor.post.sections.tail.text, text + ' section', 'correct text after insertion');
      done();
    });
  });

  test('inserting multiple spaces renders them with nbsps', function (assert) {
    var mobiledoc = _testHelpers['default'].mobiledoc.build(function (_ref4) {
      var post = _ref4.post;
      var markupSection = _ref4.markupSection;

      return post([markupSection()]);
    });
    editor = new _mobiledocKit.Editor({ mobiledoc: mobiledoc });
    editor.render(editorElement);

    _testHelpers['default'].dom.insertText(editor, '   ');
    assert.equal($('#editor p:eq(0)').text(), '' + _mobiledocKitRenderersEditorDom.NO_BREAK_SPACE + _mobiledocKitRenderersEditorDom.NO_BREAK_SPACE + _mobiledocKitRenderersEditorDom.NO_BREAK_SPACE, 'correct nbsps in text');
  });

  test('deleting when the previous section is also blank', function (assert) {
    editor = new _mobiledocKit.Editor({ mobiledoc: mobileDocWithNoCharacter });
    editor.render(editorElement);

    _testHelpers['default'].dom.moveCursorTo(editorElement.childNodes[0].childNodes[0], 0);
    _testHelpers['default'].dom.triggerEnter(editor);

    assert.equal($('#editor p').length, 2, 'has 2 paragraphs after typing return');

    _testHelpers['default'].dom.triggerDelete(editor);

    assert.equal($('#editor p').length, 1, 'has 1 paragraphs after typing delete');
  });

  // test: deleting at start of section when previous section is a non-markup section
});
define('tests/acceptance/editor-selections-test', ['exports', 'mobiledoc-kit', '../test-helpers', 'mobiledoc-kit/renderers/mobiledoc/0-2'], function (exports, _mobiledocKit, _testHelpers, _mobiledocKitRenderersMobiledoc02) {
  'use strict';

  var test = _testHelpers['default'].test;
  var _module = _testHelpers['default'].module;

  var editor = undefined,
      editorElement = undefined;

  var mobileDocWithSection = {
    version: _mobiledocKitRenderersMobiledoc02.MOBILEDOC_VERSION,
    sections: [[], [[1, "P", [[[], 0, "one trick pony"]]]]]
  };

  var mobileDocWith2Sections = {
    version: _mobiledocKitRenderersMobiledoc02.MOBILEDOC_VERSION,
    sections: [[], [[1, "P", [[[], 0, "first section"]]], [1, "P", [[[], 0, "second section"]]]]]
  };

  _module('Acceptance: Editor Selections', {
    beforeEach: function beforeEach() {
      editorElement = $('#editor')[0];
    },

    afterEach: function afterEach() {
      if (editor) {
        editor.destroy();
      }
    }
  });

  test('selecting across sections is possible', function (assert) {
    editor = new _mobiledocKit.Editor({ mobiledoc: mobileDocWith2Sections });
    editor.render(editorElement);

    var firstSection = $('p:contains(first section)')[0];
    var secondSection = $('p:contains(second section)')[0];

    _testHelpers['default'].dom.selectText('section', firstSection, 'second', secondSection);

    _testHelpers['default'].dom.triggerEvent(document, 'mouseup');
    assert.equal(editor.activeSections.length, 2, 'selects 2 sections');
  });

  test('selecting an entire section and deleting removes it', function (assert) {
    editor = new _mobiledocKit.Editor({ mobiledoc: mobileDocWith2Sections });
    editor.render(editorElement);

    _testHelpers['default'].dom.selectText('second section', editorElement);
    _testHelpers['default'].dom.triggerDelete(editor);

    assert.hasElement('#editor p:contains(first section)');
    assert.hasNoElement('#editor p:contains(second section)', 'deletes contents of second section');
    assert.equal($('#editor p').length, 2, 'still has 2 sections');

    _testHelpers['default'].dom.insertText(editor, 'X');

    assert.hasElement('#editor p:eq(1):contains(X)', 'inserts text in correct spot');
  });

  test('selecting text in a section and deleting deletes it', function (assert) {
    editor = new _mobiledocKit.Editor({ mobiledoc: mobileDocWith2Sections });
    editor.render(editorElement);

    _testHelpers['default'].dom.selectText('cond sec', editorElement);
    _testHelpers['default'].dom.triggerDelete(editor);

    assert.hasElement('#editor p:contains(first section)', 'first section unchanged');
    assert.hasNoElement('#editor p:contains(second section)', 'second section is no longer there');
    assert.hasElement('#editor p:contains(setion)', 'second section has correct text');

    _testHelpers['default'].dom.insertText(editor, 'Z');
    assert.hasElement('#editor p:contains(seZtion)', 'text inserted correctly');
  });

  test('selecting text across sections and deleting joins sections', function (assert) {
    editor = new _mobiledocKit.Editor({ mobiledoc: mobileDocWith2Sections });
    editor.render(editorElement);

    var firstSection = $('#editor p')[0],
        secondSection = $('#editor p')[1];

    _testHelpers['default'].dom.selectText('t section', firstSection, 'second s', secondSection);
    _testHelpers['default'].dom.triggerDelete(editor);

    assert.hasElement('p:contains(firsection)');
    assert.hasNoElement('p:contains(first section)');
    assert.hasNoElement('p:contains(second section)');
    assert.equal($('#editor p').length, 1, 'only 1 section after deleting to join');
  });

  test('selecting text across markers and deleting joins markers', function (assert) {

    editor = new _mobiledocKit.Editor({ mobiledoc: mobileDocWith2Sections });
    editor.render(editorElement);

    _testHelpers['default'].dom.selectText('rst sect', editorElement);
    editor.run(function (postEditor) {
      return postEditor.toggleMarkup('strong');
    });

    var firstTextNode = editorElement.childNodes[0] // p
    .childNodes[1] // b
    .childNodes[0]; // textNode containing "rst sect"
    var secondTextNode = editorElement.childNodes[0] // p
    .childNodes[2]; // textNode containing "ion"

    assert.equal(firstTextNode.textContent, 'rst sect', 'correct first text node');
    assert.equal(secondTextNode.textContent, 'ion', 'correct second text node');
    _testHelpers['default'].dom.selectText('t sect', firstTextNode, 'ion', secondTextNode);
    _testHelpers['default'].dom.triggerDelete(editor);

    assert.hasElement('p:contains(firs)', 'deletes across markers');
    assert.hasElement('strong:contains(rs)', 'maintains bold text');

    firstTextNode = editorElement.childNodes[0] // p
    .childNodes[1] // b
    .childNodes[0]; // textNode now containing "rs"

    assert.deepEqual(_testHelpers['default'].dom.getCursorPosition(), { node: firstTextNode, offset: 2 });
  });

  test('select text and apply markup multiple times', function (assert) {
    editor = new _mobiledocKit.Editor({ mobiledoc: mobileDocWith2Sections });
    editor.render(editorElement);

    _testHelpers['default'].dom.selectText('t sect', editorElement);
    _testHelpers['default'].dom.triggerEvent(document, 'mouseup');

    editor.run(function (postEditor) {
      return postEditor.toggleMarkup('strong');
    });

    _testHelpers['default'].dom.selectText('fir', editorElement);
    editor.run(function (postEditor) {
      return postEditor.toggleMarkup('strong');
    });
    _testHelpers['default'].dom.triggerEvent(document, 'mouseup');

    editor.run(function (postEditor) {
      return postEditor.toggleMarkup('strong');
    });

    assert.hasElement('p:contains(first section)', 'correct first section');
    assert.hasElement('strong:contains(fir)', 'strong "fir"');
    assert.hasElement('strong:contains(t sect)', 'strong "t sect"');
  });

  test('selecting text across markers deletes intermediary markers', function (assert) {
    var mobiledoc = _testHelpers['default'].mobiledoc.build(function (_ref) {
      var post = _ref.post;
      var markupSection = _ref.markupSection;
      var marker = _ref.marker;
      var markup = _ref.markup;

      return post([markupSection('p', [marker('abc'), marker('123', [markup('strong')]), marker('def')])]);
    });
    editor = new _mobiledocKit.Editor({ mobiledoc: mobiledoc });
    editor.render(editorElement);

    var textNode1 = editorElement.childNodes[0].childNodes[0],
        textNode2 = editorElement.childNodes[0].childNodes[2];

    assert.equal(textNode1.textContent, 'abc', 'precond - text node 1');
    assert.equal(textNode2.textContent, 'def', 'precond - text node 2');
    _testHelpers['default'].dom.selectText('b', textNode1, 'e', textNode2);

    _testHelpers['default'].dom.triggerDelete(editor);

    assert.hasElement('p:contains(af)', 'has remaining first section');

    _testHelpers['default'].dom.insertText(editor, 'X');
    assert.hasElement('p:contains(aXf)', 'inserts text at correct place');
  });

  test('deleting text across markers preserves node after', function (assert) {
    var mobiledoc = _testHelpers['default'].mobiledoc.build(function (_ref2) {
      var post = _ref2.post;
      var markupSection = _ref2.markupSection;
      var marker = _ref2.marker;
      var markup = _ref2.markup;

      return post([markupSection('p', [marker('abc'), marker('123', [markup('strong')]), marker('def')])]);
    });
    editor = new _mobiledocKit.Editor({ mobiledoc: mobiledoc });
    editor.render(editorElement);

    var textNode1 = editorElement.childNodes[0].childNodes[0],
        textNode2 = editorElement.childNodes[0].childNodes[1];
    assert.equal(textNode1.textContent, 'abc', 'precond -text node 1');
    assert.equal(textNode2.textContent, '123', 'precond -text node 2');

    _testHelpers['default'].dom.selectText('b', editorElement, '2', editorElement);

    _testHelpers['default'].dom.triggerDelete(editor);

    assert.equal(editorElement.childNodes[0].textContent, 'a3def', 'has remaining first section');
    _testHelpers['default'].dom.insertText(editor, 'X');
    assert.equal(editorElement.childNodes[0].textContent, 'aX3def', 'inserts text at correct spot');
  });

  test('selecting text across sections and hitting enter deletes and moves cursor to last selected section', function (assert) {
    editor = new _mobiledocKit.Editor({ mobiledoc: mobileDocWith2Sections });
    editor.render(editorElement);

    var firstSection = $('#editor p:eq(0)')[0],
        secondSection = $('#editor p:eq(1)')[0];

    _testHelpers['default'].dom.selectText(' section', firstSection, 'second ', secondSection);

    _testHelpers['default'].dom.triggerEnter(editor);

    assert.equal($('#editor p').length, 2, 'still 2 sections');
    assert.equal($('#editor p:eq(0)').text(), 'first', 'correct text in 1st section');
    assert.equal($('#editor p:eq(1)').text(), 'section', 'correct text in 2nd section');

    var secondSectionTextNode = editor.element.childNodes[1].childNodes[0];
    assert.deepEqual(_testHelpers['default'].dom.getCursorPosition(), { node: secondSectionTextNode, offset: 0 }, 'cursor is at start of second section');
  });

  test('keystroke of printable character while text is selected deletes the text', function (assert) {
    editor = new _mobiledocKit.Editor({ mobiledoc: mobileDocWith2Sections });
    editor.render(editorElement);

    _testHelpers['default'].dom.selectText('first section', editorElement);

    editor.run(function (postEditor) {
      editor.activeSections.forEach(function (section) {
        postEditor.changeSectionTagName(section, 'h2');
      });
    });

    assert.ok($('#editor h2:contains(first section)').length, 'first section is a heading');

    var firstSectionTextNode = editorElement.childNodes[0].childNodes[0];
    var secondSectionTextNode = editorElement.childNodes[1].childNodes[0];
    _testHelpers['default'].dom.selectText('section', firstSectionTextNode, 'secon', secondSectionTextNode);

    _testHelpers['default'].dom.insertText(editor, 'X');

    assert.ok($('#editor h2:contains(first Xd section)').length, 'updates the section');
  });

  test('selecting text bounded by space and typing replaces it', function (assert) {
    var done = assert.async();
    editor = new _mobiledocKit.Editor({ mobiledoc: mobileDocWithSection });
    editor.render(editorElement);

    _testHelpers['default'].dom.selectText('trick', editorElement);
    _testHelpers['default'].dom.insertText(editor, 'X');
    window.setTimeout(function () {
      assert.equal(editor.post.sections.head.text, 'one X pony', 'new text present');

      _testHelpers['default'].dom.insertText(editor, 'Y');
      window.setTimeout(function () {
        assert.equal(editor.post.sections.head.text, 'one XY pony', 'further new text present');
        done();
      }, 0);
    }, 0);
  });

  test('selecting all text across sections and hitting enter deletes and moves cursor to empty section', function (assert) {
    editor = new _mobiledocKit.Editor({ mobiledoc: mobileDocWith2Sections });
    editor.render(editorElement);

    var firstSection = $('#editor p:eq(0)')[0],
        secondSection = $('#editor p:eq(1)')[0];

    _testHelpers['default'].dom.selectText('first section', firstSection, 'second section', secondSection);

    _testHelpers['default'].dom.triggerEnter(editor);

    assert.equal($('#editor p').length, 1, 'single section');
    assert.equal($('#editor p:eq(0)').text(), '', 'blank text');

    assert.deepEqual(_testHelpers['default'].dom.getCursorPosition(), { node: $('#editor p')[0], offset: 0 }, 'cursor is at start of second section');
  });

  test('selecting text across markup and list sections', function (assert) {
    var build = _testHelpers['default'].mobiledoc.build;
    var mobiledoc = build(function (_ref3) {
      var post = _ref3.post;
      var markupSection = _ref3.markupSection;
      var listSection = _ref3.listSection;
      var listItem = _ref3.listItem;
      var marker = _ref3.marker;
      return post([markupSection('p', [marker('abc')]), listSection('ul', [listItem([marker('123')]), listItem([marker('456')])])]);
    });
    editor = new _mobiledocKit.Editor({ mobiledoc: mobiledoc });
    editor.render(editorElement);

    _testHelpers['default'].dom.selectText('bc', editorElement, '12', editorElement);

    _testHelpers['default'].dom.triggerDelete(editor);

    assert.hasElement('#editor p:contains(a3)', 'combines partially-selected list item onto markup section');

    assert.hasNoElement('#editor p:contains(bc)', 'deletes selected text "bc"');
    assert.hasNoElement('#editor p:contains(12)', 'deletes selected text "12"');

    assert.hasElement('#editor li:contains(6)', 'leaves remaining text in list item');
  });

  test('selecting text that covers a list section', function (assert) {
    var build = _testHelpers['default'].mobiledoc.build;
    var mobiledoc = build(function (_ref4) {
      var post = _ref4.post;
      var markupSection = _ref4.markupSection;
      var listSection = _ref4.listSection;
      var listItem = _ref4.listItem;
      var marker = _ref4.marker;
      return post([markupSection('p', [marker('abc')]), listSection('ul', [listItem([marker('123')]), listItem([marker('456')])]), markupSection('p', [marker('def')])]);
    });
    editor = new _mobiledocKit.Editor({ mobiledoc: mobiledoc });
    editor.render(editorElement);

    _testHelpers['default'].dom.selectText('bc', editorElement, 'de', editorElement);
    _testHelpers['default'].dom.triggerEvent(document, 'mouseup');

    _testHelpers['default'].dom.triggerDelete(editor);

    assert.hasElement('#editor p:contains(af)', 'combines sides of selection');

    assert.hasNoElement('#editor li:contains(123)', 'deletes li 1');
    assert.hasNoElement('#editor li:contains(456)', 'deletes li 2');
    assert.hasNoElement('#editor ul', 'removes ul');
  });

  test('selecting text that starts in a list item and ends in a markup section', function (assert) {
    var build = _testHelpers['default'].mobiledoc.build;
    var mobiledoc = build(function (_ref5) {
      var post = _ref5.post;
      var markupSection = _ref5.markupSection;
      var listSection = _ref5.listSection;
      var listItem = _ref5.listItem;
      var marker = _ref5.marker;
      return post([listSection('ul', [listItem([marker('123')]), listItem([marker('456')])]), markupSection('p', [marker('def')])]);
    });
    editor = new _mobiledocKit.Editor({ mobiledoc: mobiledoc });
    editor.render(editorElement);

    _testHelpers['default'].dom.selectText('23', editorElement, 'de', editorElement);
    _testHelpers['default'].dom.triggerEvent(document, 'mouseup');
    _testHelpers['default'].dom.triggerDelete(editor);

    assert.hasElement('#editor li:contains(1f)', 'combines sides of selection');

    assert.hasNoElement('#editor li:contains(123)', 'deletes li 1');
    assert.hasNoElement('#editor li:contains(456)', 'deletes li 2');
    assert.hasNoElement('#editor p:contains(def)', 'deletes p content');
    assert.hasNoElement('#editor p', 'removes p entirely');
  });

  test('selecting text that includes a card section and deleting deletes card section', function (assert) {
    var build = _testHelpers['default'].mobiledoc.build;
    var mobiledoc = build(function (_ref6) {
      var post = _ref6.post;
      var markupSection = _ref6.markupSection;
      var cardSection = _ref6.cardSection;
      var marker = _ref6.marker;
      return post([markupSection('p', [marker('abc')]), cardSection('simple-card'), markupSection('p', [marker('def')])]);
    });
    var cards = [{
      name: 'simple-card',
      type: 'dom',
      render: function render() {
        return $('<span id="card-el"></span>')[0];
      }
    }];
    editor = new _mobiledocKit.Editor({ mobiledoc: mobiledoc, cards: cards });
    editor.render(editorElement);

    assert.hasElement('#card-el', 'precond - card el is rendered');

    _testHelpers['default'].dom.selectText('bc', editorElement, 'de', editorElement);
    _testHelpers['default'].dom.triggerEvent(document, 'mouseup');

    _testHelpers['default'].dom.triggerDelete(editor);

    assert.hasElement('#editor p:contains(af)', 'combines sides of selection');

    assert.hasNoElement('#editor span#card-el', 'card el is removed');
    assert.hasNoElement('#editor p:contains(abc)', 'previous section 1 is removed');
    assert.hasNoElement('#editor p:contains(def)', 'previous section 2 is removed');
  });

  test('selecting text that touches bold text should not be considered bold', function (assert) {

    var mobiledoc = _testHelpers['default'].mobiledoc.build(function (_ref7) {
      var post = _ref7.post;
      var markupSection = _ref7.markupSection;
      var marker = _ref7.marker;

      return post([markupSection('p', [marker('abc')])]);
    });
    editor = new _mobiledocKit.Editor({ mobiledoc: mobiledoc });
    editor.render(editorElement);

    _testHelpers['default'].dom.selectText('b', editorElement);
    _testHelpers['default'].dom.triggerEvent(document, 'mouseup');

    editor.run(function (postEditor) {
      return postEditor.toggleMarkup('strong');
    });

    assert.hasElement('#editor strong:contains(b)', 'precond - bold text');

    _testHelpers['default'].dom.selectText('c', editorElement);
    _testHelpers['default'].dom.triggerEvent(document, 'mouseup');

    var bold = editor.builder.createMarkup('strong');
    assert.ok(editor.markupsInSelection.indexOf(bold) === -1, 'strong is not in selection');
  });

  // https://github.com/bustlelabs/mobiledoc-kit/issues/121
  test('selecting text that includes a 1-character marker and unbolding it', function (assert) {
    var mobiledoc = _testHelpers['default'].mobiledoc.build(function (_ref8) {
      var post = _ref8.post;
      var markupSection = _ref8.markupSection;
      var marker = _ref8.marker;
      var markup = _ref8.markup;

      var b = markup('strong');
      return post([markupSection('p', [marker('a'), marker('b', [b]), marker('c')])]);
    });
    editor = new _mobiledocKit.Editor({ mobiledoc: mobiledoc });
    editor.render(editorElement);

    assert.hasElement('#editor strong:contains(b)', 'precond - bold');

    _testHelpers['default'].dom.selectText('b', editorElement, 'c', editorElement);

    var bold = editor.builder.createMarkup('strong');
    assert.ok(editor.markupsInSelection.indexOf(bold) !== -1, 'strong is in selection');

    editor.run(function (postEditor) {
      return postEditor.toggleMarkup('strong');
    });

    assert.hasNoElement('#editor strong', 'bold text is unboldened');
  });

  // see https://github.com/bustlelabs/mobiledoc-kit/issues/128
  test('selecting text that includes an empty section and applying markup to it', function (assert) {
    var mobiledoc = _testHelpers['default'].mobiledoc.build(function (_ref9) {
      var post = _ref9.post;
      var markupSection = _ref9.markupSection;
      var marker = _ref9.marker;

      return post([markupSection('p', [marker('abc')]), markupSection('p')]);
    });
    editor = new _mobiledocKit.Editor({ mobiledoc: mobiledoc });
    editor.render(editorElement);

    // precond
    assert.hasElement('#editor p:contains(abc)');
    assert.ok($('#editor p:eq(1)').text() === '', 'no text in second p');
    var t1 = $('#editor p:eq(0)')[0].childNodes[0];
    assert.equal(t1.textContent, 'abc', 'correct text node');
    var p2 = $('#editor p:eq(1)')[0];

    _testHelpers['default'].dom.moveCursorTo(t1, 0, p2, 0);

    editor.run(function (postEditor) {
      return postEditor.toggleMarkup('strong');
    });

    assert.hasElement('#editor p strong:contains(abc)', 'bold is applied to text');
  });

  // see https://github.com/bustlelabs/mobiledoc-kit/issues/155
  test('editor#selectSections works when given an empty array', function (assert) {
    var mobiledoc = _testHelpers['default'].mobiledoc.build(function (_ref10) {
      var post = _ref10.post;
      var markupSection = _ref10.markupSection;
      var marker = _ref10.marker;

      return post([markupSection('p', [marker('abc')])]);
    });
    editor = new _mobiledocKit.Editor({ mobiledoc: mobiledoc });
    editor.render(editorElement);

    assert.selectedText('', 'precond - no text selected');

    var section = editor.post.sections.head;
    editor.selectSections([section]);

    assert.selectedText('abc', 'section is selected');
    editor.selectSections([]);
    assert.selectedText(null, 'no text selected after selecting no sections');
  });

  test('placing cursor inside a strong section should cause markupsInSelection to contain "strong"', function (assert) {
    var mobiledoc = _testHelpers['default'].mobiledoc.build(function (_ref11) {
      var post = _ref11.post;
      var markupSection = _ref11.markupSection;
      var marker = _ref11.marker;
      var markup = _ref11.markup;

      var b = markup('strong');
      return post([markupSection('p', [marker('before'), marker('loud', [b]), marker('after')])]);
    });
    editor = new _mobiledocKit.Editor({ mobiledoc: mobiledoc });
    editor.render(editorElement);

    _testHelpers['default'].dom.moveCursorTo($('#editor strong')[0].firstChild, 1);

    var bold = editor.builder.createMarkup('strong');
    assert.ok(editor.markupsInSelection.indexOf(bold) !== -1, 'strong is in selection');

    _testHelpers['default'].dom.moveCursorTo($('#editor')[0].childNodes[0], 1);

    assert.ok(editor.markupsInSelection.indexOf(bold) === -1, 'strong is not in selection');
  });
});
define('tests/acceptance/editor-text-expansions-test', ['exports', 'mobiledoc-kit', '../test-helpers', 'mobiledoc-kit/utils/cursor/range', 'mobiledoc-kit/renderers/editor-dom'], function (exports, _mobiledocKit, _testHelpers, _mobiledocKitUtilsCursorRange, _mobiledocKitRenderersEditorDom) {
  'use strict';

  var _module = _testHelpers['default'].module;
  var test = _testHelpers['default'].test;

  var editor = undefined,
      editorElement = undefined;

  _module('Acceptance: Editor: Text Expansions', {
    beforeEach: function beforeEach() {
      editorElement = $('#editor')[0];
    },
    afterEach: function afterEach() {
      if (editor) {
        editor.destroy();
      }
    }
  });

  function renderMobiledoc(builderFn) {
    var mobiledoc = _testHelpers['default'].mobiledoc.build(builderFn);
    editor = new _mobiledocKit.Editor({ mobiledoc: mobiledoc });
    editor.render(editorElement);
    editor.selectRange(new _mobiledocKitUtilsCursorRange['default'](editor.post.sections.head.tailPosition()));
  }

  test('typing "## " converts to h2', function (assert) {
    renderMobiledoc(function (_ref) {
      var post = _ref.post;
      var markupSection = _ref.markupSection;
      var marker = _ref.marker;

      return post([markupSection('p', [marker('##')])]);
    });

    _testHelpers['default'].dom.insertText(editor, ' ');
    assert.hasNoElement('#editor p', 'p is gone');
    assert.hasElement('#editor h2', 'p -> h2');

    _testHelpers['default'].dom.insertText(editor, 'X');
    assert.hasElement('#editor h2:contains(X)', 'text is inserted correctly');
  });

  test('space is required to trigger "## " expansion', function (assert) {
    renderMobiledoc(function (_ref2) {
      var post = _ref2.post;
      var markupSection = _ref2.markupSection;
      var marker = _ref2.marker;

      return post([markupSection('p', [marker('##')])]);
    });

    _testHelpers['default'].dom.insertText(editor, 'X');
    assert.hasElement('#editor p:contains(##X)', 'text is inserted , no expansion');
  });

  test('typing "### " converts to h3', function (assert) {
    renderMobiledoc(function (_ref3) {
      var post = _ref3.post;
      var markupSection = _ref3.markupSection;
      var marker = _ref3.marker;

      return post([markupSection('p', [marker('###')])]);
    });

    _testHelpers['default'].dom.insertText(editor, ' ');
    assert.hasNoElement('#editor p', 'p is gone');
    assert.hasElement('#editor h3', 'p -> h3');

    _testHelpers['default'].dom.insertText(editor, 'X');
    assert.hasElement('#editor h3:contains(X)', 'text is inserted correctly');
  });

  test('typing "* " converts to ul > li', function (assert) {
    renderMobiledoc(function (_ref4) {
      var post = _ref4.post;
      var markupSection = _ref4.markupSection;
      var marker = _ref4.marker;

      return post([markupSection('p', [marker('*')])]);
    });

    _testHelpers['default'].dom.insertText(editor, ' ');
    assert.hasNoElement('#editor p', 'p is gone');
    assert.hasElement('#editor ul > li', 'p -> "ul > li"');

    _testHelpers['default'].dom.insertText(editor, 'X');
    assert.hasElement('#editor ul > li:contains(X)', 'text is inserted correctly');
  });

  // see https://github.com/bustlelabs/mobiledoc-kit/issues/280
  test('typing "* " at start of markup section does not remove it', function (assert) {
    renderMobiledoc(function (_ref5) {
      var post = _ref5.post;
      var markupSection = _ref5.markupSection;
      var marker = _ref5.marker;

      return post([markupSection('p', [marker('*abc')])]);
    });

    var position = editor.post.sections.head.headPosition();
    position.offset = 1;
    editor.selectRange(new _mobiledocKitUtilsCursorRange['default'](position));

    _testHelpers['default'].dom.insertText(editor, ' ');
    assert.hasElement('#editor p:contains(* abc)', 'p is still there');
  });

  test('typing "* " inside of a list section does not create a new list section', function (assert) {
    renderMobiledoc(function (_ref6) {
      var post = _ref6.post;
      var listSection = _ref6.listSection;
      var listItem = _ref6.listItem;
      var marker = _ref6.marker;

      return post([listSection('ul', [listItem([marker('*')])])]);
    });
    var position = editor.post.sections.head.items.head.tailPosition();
    editor.selectRange(new _mobiledocKitUtilsCursorRange['default'](position));

    assert.hasElement('#editor ul > li:contains(*)', 'precond - has li');

    _testHelpers['default'].dom.insertText(editor, ' ');
    // note: the actual text is "*&nbsp;", so only check that the "*" is there,
    assert.hasElement('#editor ul > li', 'still has li');
    var el = $('#editor ul > li')[0];
    assert.equal(el.textContent, '*' + _mobiledocKitRenderersEditorDom.NO_BREAK_SPACE);
  });

  test('typing "1 " converts to ol > li', function (assert) {
    renderMobiledoc(function (_ref7) {
      var post = _ref7.post;
      var markupSection = _ref7.markupSection;
      var marker = _ref7.marker;

      return post([markupSection('p', [marker('1')])]);
    });
    _testHelpers['default'].dom.insertText(editor, ' ');
    assert.hasNoElement('#editor p', 'p is gone');
    assert.hasElement('#editor ol > li', 'p -> "ol > li"');
    _testHelpers['default'].dom.insertText(editor, 'X');

    assert.hasElement('#editor li:contains(X)', 'text is inserted correctly');
  });

  test('typing "1. " converts to ol > li', function (assert) {
    renderMobiledoc(function (_ref8) {
      var post = _ref8.post;
      var markupSection = _ref8.markupSection;
      var marker = _ref8.marker;

      return post([markupSection('p', [marker('1.')])]);
    });
    _testHelpers['default'].dom.insertText(editor, ' ');
    assert.hasNoElement('#editor p', 'p is gone');
    assert.hasElement('#editor ol > li', 'p -> "ol > li"');
    _testHelpers['default'].dom.insertText(editor, 'X');

    assert.hasElement('#editor li:contains(X)', 'text is inserted correctly');
  });

  test('a new expansion can be registered', function (assert) {
    renderMobiledoc(function (_ref9) {
      var post = _ref9.post;
      var markupSection = _ref9.markupSection;
      var marker = _ref9.marker;

      return post([markupSection('p', [marker('quote')])]);
    });

    var didExpand = false;
    editor.registerExpansion({
      trigger: ' '.charCodeAt(0),
      text: 'quote',
      run: function run() {
        return didExpand = true;
      }
    });
    _testHelpers['default'].dom.insertText(editor, ' ');
    assert.ok(didExpand, 'expansion was run');
  });
});
define('tests/acceptance/editor-undo-redo-test', ['exports', 'mobiledoc-kit/utils/key', '../test-helpers', 'mobiledoc-kit/utils/cursor/position', '../helpers/browsers'], function (exports, _mobiledocKitUtilsKey, _testHelpers, _mobiledocKitUtilsCursorPosition, _helpersBrowsers) {
  'use strict';

  var _module = _testHelpers['default'].module;
  var test = _testHelpers['default'].test;

  var editor = undefined,
      editorElement = undefined;

  function undo(editor) {
    _testHelpers['default'].dom.triggerKeyCommand(editor, 'Z', [_mobiledocKitUtilsKey.MODIFIERS.META]);
  }

  function redo(editor) {
    _testHelpers['default'].dom.triggerKeyCommand(editor, 'Z', [_mobiledocKitUtilsKey.MODIFIERS.META, _mobiledocKitUtilsKey.MODIFIERS.SHIFT]);
  }

  _module('Acceptance: Editor: Undo/Redo', {
    beforeEach: function beforeEach() {
      editorElement = $('#editor')[0];
    },
    afterEach: function afterEach() {
      if (editor) {
        editor.destroy();
        editor = null;
      }
    }
  });

  if (!(0, _helpersBrowsers.detectIE11)()) {
    // TODO: Make this test pass on IE11
    test('undo/redo the insertion of a character', function (assert) {
      var done = assert.async();
      var expectedBeforeUndo = undefined,
          expectedAfterUndo = undefined;
      editor = _testHelpers['default'].mobiledoc.renderInto(editorElement, function (_ref) {
        var post = _ref.post;
        var markupSection = _ref.markupSection;
        var marker = _ref.marker;

        expectedBeforeUndo = post([markupSection('p', [marker('abcD')])]);
        expectedAfterUndo = post([markupSection('p', [marker('abc')])]);
        return expectedAfterUndo;
      });

      var textNode = _testHelpers['default'].dom.findTextNode(editorElement, 'abc');
      _testHelpers['default'].dom.moveCursorTo(textNode, 'abc'.length);

      _testHelpers['default'].dom.insertText(editor, 'D');

      setTimeout(function () {
        assert.postIsSimilar(editor.post, expectedBeforeUndo); // precond
        undo(editor);
        assert.postIsSimilar(editor.post, expectedAfterUndo);
        assert.renderTreeIsEqual(editor._renderTree, expectedAfterUndo);

        var position = editor.range.head;
        assert.positionIsEqual(position, editor.post.sections.head.tailPosition());

        redo(editor);

        assert.postIsSimilar(editor.post, expectedBeforeUndo);
        assert.renderTreeIsEqual(editor._renderTree, expectedBeforeUndo);

        position = editor.range.head;
        assert.positionIsEqual(position, editor.post.sections.head.tailPosition());

        done();
      });
    });
  }

  if (!(0, _helpersBrowsers.detectIE11)()) {
    // TODO: Make this test pass on IE11

    // Test to ensure that we don't push empty snapshots on the undo stack
    // when typing characters
    test('undo/redo the insertion of multiple characters', function (assert) {
      var done = assert.async();
      var beforeUndo = undefined,
          afterUndo1 = undefined,
          afterUndo2 = undefined;
      editor = _testHelpers['default'].mobiledoc.renderInto(editorElement, function (_ref2) {
        var post = _ref2.post;
        var markupSection = _ref2.markupSection;
        var marker = _ref2.marker;

        beforeUndo = post([markupSection('p', [marker('abcDE')])]);
        afterUndo1 = post([markupSection('p', [marker('abcD')])]);
        afterUndo2 = post([markupSection('p', [marker('abc')])]);
        return afterUndo2;
      });

      var textNode = _testHelpers['default'].dom.findTextNode(editorElement, 'abc');
      _testHelpers['default'].dom.moveCursorTo(textNode, 'abc'.length);

      _testHelpers['default'].dom.insertText(editor, 'D');

      setTimeout(function () {
        _testHelpers['default'].dom.insertText(editor, 'E');

        setTimeout(function () {
          assert.postIsSimilar(editor.post, beforeUndo); // precond

          undo(editor);
          assert.postIsSimilar(editor.post, afterUndo1);

          undo(editor);
          assert.postIsSimilar(editor.post, afterUndo2);

          redo(editor);
          assert.postIsSimilar(editor.post, afterUndo1);

          redo(editor);
          assert.postIsSimilar(editor.post, beforeUndo);
          done();
        });
      });
    });
  }

  test('undo the deletion of a character', function (assert) {
    var expectedBeforeUndo = undefined,
        expectedAfterUndo = undefined;
    editor = _testHelpers['default'].mobiledoc.renderInto(editorElement, function (_ref3) {
      var post = _ref3.post;
      var markupSection = _ref3.markupSection;
      var marker = _ref3.marker;

      expectedBeforeUndo = post([markupSection('p', [marker('abc')])]);
      expectedAfterUndo = post([markupSection('p', [marker('abcD')])]);
      return expectedAfterUndo;
    });

    var textNode = _testHelpers['default'].dom.findTextNode(editorElement, 'abcD');
    _testHelpers['default'].dom.moveCursorTo(textNode, 'abcD'.length);

    _testHelpers['default'].dom.triggerDelete(editor);

    assert.postIsSimilar(editor.post, expectedBeforeUndo); // precond

    undo(editor);
    assert.postIsSimilar(editor.post, expectedAfterUndo);
    assert.renderTreeIsEqual(editor._renderTree, expectedAfterUndo);
    var position = editor.range.head;
    assert.positionIsEqual(position, editor.post.sections.head.tailPosition());

    redo(editor);
    assert.postIsSimilar(editor.post, expectedBeforeUndo);
    assert.renderTreeIsEqual(editor._renderTree, expectedBeforeUndo);
    position = editor.range.head;
    assert.positionIsEqual(position, editor.post.sections.head.tailPosition());
  });

  test('undo the deletion of a range', function (assert) {
    var expectedBeforeUndo = undefined,
        expectedAfterUndo = undefined;
    editor = _testHelpers['default'].mobiledoc.renderInto(editorElement, function (_ref4) {
      var post = _ref4.post;
      var markupSection = _ref4.markupSection;
      var marker = _ref4.marker;

      expectedBeforeUndo = post([markupSection('p', [marker('ad')])]);
      expectedAfterUndo = post([markupSection('p', [marker('abcd')])]);
      return expectedAfterUndo;
    });

    _testHelpers['default'].dom.selectText('bc', editorElement);
    _testHelpers['default'].dom.triggerDelete(editor);

    assert.postIsSimilar(editor.post, expectedBeforeUndo); // precond

    undo(editor);
    assert.postIsSimilar(editor.post, expectedAfterUndo);
    assert.renderTreeIsEqual(editor._renderTree, expectedAfterUndo);
    var _editor$range = editor.range;
    var head = _editor$range.head;
    var tail = _editor$range.tail;

    var section = editor.post.sections.head;
    assert.positionIsEqual(head, new _mobiledocKitUtilsCursorPosition['default'](section, 'a'.length));
    assert.positionIsEqual(tail, new _mobiledocKitUtilsCursorPosition['default'](section, 'abc'.length));

    redo(editor);
    assert.postIsSimilar(editor.post, expectedBeforeUndo);
    assert.renderTreeIsEqual(editor._renderTree, expectedBeforeUndo);
    head = editor.range.head;
    tail = editor.range.tail;
    section = editor.post.sections.head;
    assert.positionIsEqual(head, new _mobiledocKitUtilsCursorPosition['default'](section, 'a'.length));
    assert.positionIsEqual(tail, new _mobiledocKitUtilsCursorPosition['default'](section, 'a'.length));
  });

  if (!(0, _helpersBrowsers.detectIE11)()) {
    // TODO: Make this test pass on IE11
    test('undo insertion of character to a list item', function (assert) {
      var done = assert.async();
      var expectedBeforeUndo = undefined,
          expectedAfterUndo = undefined;
      editor = _testHelpers['default'].mobiledoc.renderInto(editorElement, function (_ref5) {
        var post = _ref5.post;
        var listSection = _ref5.listSection;
        var listItem = _ref5.listItem;
        var marker = _ref5.marker;

        expectedBeforeUndo = post([listSection('ul', [listItem([marker('abcD')])])]);
        expectedAfterUndo = post([listSection('ul', [listItem([marker('abc')])])]);
        return expectedAfterUndo;
      });

      var textNode = _testHelpers['default'].dom.findTextNode(editorElement, 'abc');
      _testHelpers['default'].dom.moveCursorTo(textNode, 'abc'.length);
      _testHelpers['default'].dom.insertText(editor, 'D');

      setTimeout(function () {
        assert.postIsSimilar(editor.post, expectedBeforeUndo); // precond

        undo(editor);
        assert.postIsSimilar(editor.post, expectedAfterUndo);
        assert.renderTreeIsEqual(editor._renderTree, expectedAfterUndo);
        var _editor$range2 = editor.range;
        var head = _editor$range2.head;
        var tail = _editor$range2.tail;

        var section = editor.post.sections.head.items.head;
        assert.positionIsEqual(head, new _mobiledocKitUtilsCursorPosition['default'](section, 'abc'.length));
        assert.positionIsEqual(tail, new _mobiledocKitUtilsCursorPosition['default'](section, 'abc'.length));

        redo(editor);
        assert.postIsSimilar(editor.post, expectedBeforeUndo);
        assert.renderTreeIsEqual(editor._renderTree, expectedBeforeUndo);
        head = editor.range.head;
        tail = editor.range.tail;
        section = editor.post.sections.head.items.head;
        assert.positionIsEqual(head, new _mobiledocKitUtilsCursorPosition['default'](section, 'abcD'.length));
        assert.positionIsEqual(tail, new _mobiledocKitUtilsCursorPosition['default'](section, 'abcD'.length));

        done();
      }, 0);
    });
  }

  if (!(0, _helpersBrowsers.detectIE11)()) {
    // TODO: Make this test pass on IE11
    test('undo stack length can be configured (depth 1)', function (assert) {
      var done = assert.async();
      var editorOptions = { undoDepth: 1 };

      var beforeUndo = undefined,
          afterUndo = undefined;
      editor = _testHelpers['default'].mobiledoc.renderInto(editorElement, function (_ref6) {
        var post = _ref6.post;
        var markupSection = _ref6.markupSection;
        var marker = _ref6.marker;

        beforeUndo = post([markupSection('p', [marker('abcDE')])]);
        afterUndo = post([markupSection('p', [marker('abcD')])]);
        return post([markupSection('p', [marker('abc')])]);
      }, editorOptions);

      var textNode = _testHelpers['default'].dom.findTextNode(editorElement, 'abc');
      _testHelpers['default'].dom.moveCursorTo(textNode, 'abc'.length);
      _testHelpers['default'].dom.insertText(editor, 'D');

      setTimeout(function () {
        _testHelpers['default'].dom.insertText(editor, 'E');

        setTimeout(function () {
          assert.postIsSimilar(editor.post, beforeUndo); // precond

          undo(editor);
          assert.postIsSimilar(editor.post, afterUndo);
          assert.renderTreeIsEqual(editor._renderTree, afterUndo);
          assert.positionIsEqual(editor.range.head, editor.post.sections.head.tailPosition());

          undo(editor);
          assert.postIsSimilar(editor.post, afterUndo, 'second undo does not change post');
          assert.renderTreeIsEqual(editor._renderTree, afterUndo);
          assert.positionIsEqual(editor.range.head, editor.post.sections.head.tailPosition());

          done();
        }, 0);
      });
    });
  }

  if (!(0, _helpersBrowsers.detectIE11)()) {
    // TODO: Make this test pass on IE11
    test('undo stack length can be configured (depth 0)', function (assert) {
      var done = assert.async();
      var editorOptions = { undoDepth: 0 };

      var beforeUndo = undefined;
      editor = _testHelpers['default'].mobiledoc.renderInto(editorElement, function (_ref7) {
        var post = _ref7.post;
        var markupSection = _ref7.markupSection;
        var marker = _ref7.marker;

        beforeUndo = post([markupSection('p', [marker('abcDE')])]);
        return post([markupSection('p', [marker('abc')])]);
      }, editorOptions);

      var textNode = _testHelpers['default'].dom.findTextNode(editorElement, 'abc');
      _testHelpers['default'].dom.moveCursorTo(textNode, 'abc'.length);
      _testHelpers['default'].dom.insertText(editor, 'D');

      setTimeout(function () {
        _testHelpers['default'].dom.insertText(editor, 'E');

        setTimeout(function () {
          assert.postIsSimilar(editor.post, beforeUndo); // precond

          undo(editor);
          assert.postIsSimilar(editor.post, beforeUndo, 'nothing is undone');
          assert.renderTreeIsEqual(editor._renderTree, beforeUndo);
          assert.positionIsEqual(editor.range.head, editor.post.sections.head.tailPosition());

          done();
        }, 0);
      });
    });
  }

  test('taking and restoring a snapshot with no cursor', function (assert) {
    var beforeUndo = undefined,
        afterUndo = undefined;
    editor = _testHelpers['default'].mobiledoc.renderInto(editorElement, function (_ref8) {
      var post = _ref8.post;
      var markupSection = _ref8.markupSection;
      var marker = _ref8.marker;

      beforeUndo = post([markupSection('p', [marker('abc')])]);
      afterUndo = post([markupSection('p', [])]);
      return afterUndo;
    }, { autofocus: false });

    assert.ok(!editor.cursor.hasCursor(), 'precond - no cursor');
    editor.run(function (postEditor) {
      postEditor.insertText(editor.post.headPosition(), 'abc');
    });
    assert.postIsSimilar(editor.post, beforeUndo, 'precond - text is added');

    undo(editor);
    assert.postIsSimilar(editor.post, afterUndo, 'text is removed');
  });

  test('take and undo a snapshot based on drag/dropping of text', function (assert) {
    var done = assert.async();
    var text = 'abc';
    var beforeUndo = undefined,
        afterUndo = undefined;
    editor = _testHelpers['default'].mobiledoc.renderInto(editorElement, function (_ref9) {
      var post = _ref9.post;
      var markupSection = _ref9.markupSection;
      var marker = _ref9.marker;

      beforeUndo = post([markupSection('p', [marker(text)])]);
      afterUndo = post([markupSection('p', [marker('a')])]);
      return afterUndo;
    });

    var textNode = _testHelpers['default'].dom.findTextNode(editorElement, 'a');
    textNode.textContent = text;

    // Allow the mutation observer to fire, then...
    setTimeout(function () {
      assert.postIsSimilar(editor.post, beforeUndo, 'precond - text is added');
      undo(editor);
      assert.postIsSimilar(editor.post, afterUndo, 'text is removed');
      done();
    }, 0);
  });

  test('take and undo a snapshot when adding a card', function (assert) {
    var text = 'abc';
    var myCard = {
      name: 'my-card',
      type: 'dom',
      render: function render() {
        return document.createTextNode('card contents');
      }
    };

    var beforeUndo = undefined,
        afterUndo = undefined;
    editor = _testHelpers['default'].mobiledoc.renderInto(editorElement, function (_ref10) {
      var post = _ref10.post;
      var markupSection = _ref10.markupSection;
      var marker = _ref10.marker;
      var cardSection = _ref10.cardSection;

      beforeUndo = post([markupSection('p', [marker(text)]), cardSection('my-card', {})]);
      afterUndo = post([markupSection('p', [marker(text)])]);
      return afterUndo;
    }, {
      cards: [myCard]
    });

    editor.run(function (postEditor) {
      var card = editor.builder.createCardSection('my-card', {});
      postEditor.insertSectionBefore(editor.post.sections, card, null);
    });

    assert.postIsSimilar(editor.post, beforeUndo, 'precond - card is added');
    undo(editor);
    assert.postIsSimilar(editor.post, afterUndo, 'card is removed');
  });

  test('take and undo a snapshot when removing an atom', function (assert) {
    var text = 'abc';
    var myAtom = {
      name: 'my-atom',
      type: 'dom',
      render: function render() {
        return document.createTextNode('atom contents');
      }
    };

    var beforeUndo = undefined,
        afterUndo = undefined;
    editor = _testHelpers['default'].mobiledoc.renderInto(editorElement, function (_ref11) {
      var post = _ref11.post;
      var markupSection = _ref11.markupSection;
      var marker = _ref11.marker;
      var atom = _ref11.atom;

      beforeUndo = post([markupSection('p', [marker(text)])]);
      afterUndo = post([markupSection('p', [marker(text), atom('my-atom', 'content', {})])]);
      return afterUndo;
    }, {
      atoms: [myAtom]
    });

    editor.run(function (postEditor) {
      postEditor.removeMarker(editor.post.sections.head.markers.tail);
    });

    assert.postIsSimilar(editor.post, beforeUndo, 'precond - atom is removed');
    undo(editor);
    assert.postIsSimilar(editor.post, afterUndo, 'atom is restored');
  });
});
define('tests/fixtures/google-docs', ['exports'], function (exports) {
  'use strict';

  exports['default'] = {
    'simple paragraph as span': {
      expected: "<p>simple paragraph</p>",
      raw: '<meta charset=\'utf-8\'><meta charset="utf-8"><b style="font-weight:normal;" id="docs-internal-guid-d75a90f6-8c07-deca-96cb-4b79c9ad7a7f"><span style="font-size:14.666666666666666px;font-family:Arial;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre-wrap;">simple paragraph</span></b>'
    },
    'simple paragraph as span (Chrome - Windows)': {
      expected: "<p>simple paragraph</p>",
      raw: '<html><body><!--StartFragment--><meta charset="utf-8"><b style="font-weight:normal;" id="docs-internal-guid-af1f8f2c-cacc-6998-07a1-89da38d9c501"><span style="font-size:14.666666666666666px;font-family:Arial;color:#222222;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre-wrap;">simple paragraph</span></b><!--EndFragment--></body></html>'
    },

    // when selecting a line without including the end of the line, the html represention
    // includes a <span> or series of <span>s
    'paragraph with bold as span': {
      expected: "<p>paragraph with <strong>bold</strong></p>",
      raw: '<meta charset=\'utf-8\'><meta charset="utf-8"><b style="font-weight:normal;" id="docs-internal-guid-d75a90f6-8c09-8dc9-fb2f-f7eb880e143d"><span style="font-size:14.666666666666666px;font-family:Arial;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre-wrap;">paragraph with </span><span style="font-size:14.666666666666666px;font-family:Arial;color:#000000;background-color:transparent;font-weight:700;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre-wrap;">bold</span></b>'
    },
    'paragraph with bold as span (Chrome - Windows)': {
      expected: "<p>paragraph with <strong>bold</strong></p>",
      raw: '<html><body><!--StartFragment--><meta charset="utf-8"><b style="font-weight:normal;" id="docs-internal-guid-af1f8f2c-cacd-c884-b763-ee9510747969"><span style="font-size:14.666666666666666px;font-family:Arial;color:#222222;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre-wrap;">paragraph with </span><span style="font-size:14.666666666666666px;font-family:Arial;color:#222222;background-color:transparent;font-weight:700;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre-wrap;">bold</span></b><!--EndFragment--></body></html>'
    },

    // when selecting a line that includes the end (using, e.g., shift+up to selection the entire line),
    // the html representation includes a <p> tag
    'paragraph with bold as p': {
      expected: "<p>A <strong>bold</strong> paragraph.<p>",
      raw: '<meta charset=\'utf-8\'><meta charset="utf-8"><b style="font-weight:normal;" id="docs-internal-guid-e8f29cd6-9031-bb09-1958-dcc3dd34c237"><p dir="ltr" style="line-height:1.38;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:14.666666666666666px;font-family:Arial;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre-wrap;">A </span><span style="font-size:14.666666666666666px;font-family:Arial;color:#000000;background-color:transparent;font-weight:700;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre-wrap;">bold</span><span style="font-size:14.666666666666666px;font-family:Arial;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre-wrap;"> paragraph.</span></p></b><br class="Apple-interchange-newline">'
    },
    'paragraph with italic as span': {
      expected: "<p>paragraph with <em>italic</em></p>",
      raw: '<meta charset=\'utf-8\'><meta charset="utf-8"><b style="font-weight:normal;" id="docs-internal-guid-d75a90f6-8c15-20cb-c8cd-59f592dc8402"><span style="font-size:14.666666666666666px;font-family:Arial;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre-wrap;">paragraph with </span><span style="font-size:14.666666666666666px;font-family:Arial;color:#000000;background-color:transparent;font-weight:400;font-style:italic;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre-wrap;">italic</span></b>'
    },
    'paragraph with bold + italic as p': {
      expected: "<p>And a second <strong>bold</strong> <em>italic</em> paragraph.",
      raw: '<meta charset=\'utf-8\'><meta charset="utf-8"><b style="font-weight:normal;" id="docs-internal-guid-e8f29cd6-9038-f59a-421c-1c5303efdaf6"><p dir="ltr" style="line-height:1.38;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:14.666666666666666px;font-family:Arial;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre-wrap;">And a second </span><span style="font-size:14.666666666666666px;font-family:Arial;color:#000000;background-color:transparent;font-weight:700;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre-wrap;">bold</span><span style="font-size:14.666666666666666px;font-family:Arial;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre-wrap;"> </span><span style="font-size:14.666666666666666px;font-family:Arial;color:#000000;background-color:transparent;font-weight:400;font-style:italic;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre-wrap;">italic</span><span style="font-size:14.666666666666666px;font-family:Arial;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre-wrap;"> paragraph.</span></p></b><br class="Apple-interchange-newline">'
    },
    '2 paragraphs as p': {
      expected: "<p>Paragraph 1</p><p>Paragraph 2</p>",
      raw: '<meta charset=\'utf-8\'><meta charset="utf-8"><b style="font-weight:normal;" id="docs-internal-guid-d75a90f6-8c66-10b0-1c99-0210f64abe05"><p dir="ltr" style="line-height:1.38;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:14.666666666666666px;font-family:Arial;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre-wrap;">Paragraph 1</span></p><br><span style="font-size:14.666666666666666px;font-family:Arial;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre-wrap;">Paragraph 2</span></b>'
    },
    'h1 with h1 tag': {
      expected: "<h1>h1 text</h1>",
      raw: '<meta charset=\'utf-8\'><meta charset="utf-8"><b style="font-weight:normal;" id="docs-internal-guid-2f095724-903a-1280-b377-a2b08d38ffaa"><h1 dir="ltr" style="line-height:1.38;margin-top:20pt;margin-bottom:6pt;"><span style="font-size:26.666666666666664px;font-family:Arial;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre-wrap;">h1 text</span></h1></b>'
    },
    'paragraph with link as span': {
      expected: "<p>link to <a href='http://bustle.com'>bustle</a></p>",
      raw: '<meta charset=\'utf-8\'><meta charset="utf-8"><b style="font-weight:normal;" id="docs-internal-guid-e8f29cd6-903c-08a3-cc9c-7841d9aa3871"><span style="font-size:14.666666666666666px;font-family:Arial;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre-wrap;">link to </span><a href="http://bustle.com" style="text-decoration:none;"><span style="font-size:14.666666666666666px;font-family:Arial;color:#1155cc;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:underline;vertical-align:baseline;white-space:pre-wrap;">bustle</span></a></b>'
    },
    'paragraph with link as p': {
      expected: "<p>link to <a href='http://bustle.com'>bustle</a></p>",
      raw: '<meta charset=\'utf-8\'><meta charset="utf-8"><b style="font-weight:normal;" id="docs-internal-guid-e8f29cd6-903b-12a4-6455-23c68a9eae95"><p dir="ltr" style="line-height:1.38;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:14.666666666666666px;font-family:Arial;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre-wrap;">link to </span><a href="http://bustle.com" style="text-decoration:none;"><span style="font-size:14.666666666666666px;font-family:Arial;color:#1155cc;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:underline;vertical-align:baseline;white-space:pre-wrap;">bustle</span></a></p></b><br class="Apple-interchange-newline">'
    },
    'img in span': {
      expected: "<p><img src='https://placehold.it/100x100'></p>",
      raw: '<meta charset=\'utf-8\'><meta charset="utf-8"><b style="font-weight:normal;" id="docs-internal-guid-7a3c9f90-a5c3-d3b6-425c-75b28c50bd7e"><span style="font-size:14.666666666666666px;font-family:Arial;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre-wrap;"><img src="https://placehold.it/100x100" width="500px;" height="374px;" style="border: none; transform: rotate(0.00rad); -webkit-transform: rotate(0.00rad);"/></span></b>'
    }
  };
});
define('tests/helpers/assertions', ['exports', './dom', 'mobiledoc-kit/renderers/mobiledoc', 'mobiledoc-kit/models/types'], function (exports, _dom, _mobiledocKitRenderersMobiledoc, _mobiledocKitModelsTypes) {
  /* global QUnit, $ */

  'use strict';

  exports['default'] = registerAssertions;

  /*jshint latedef: false */
  function compareMarkers(actual, expected, assert, path, deepCompare) {
    if (actual.value !== expected.value) {
      assert.equal(actual.value, expected.value, 'wrong value at ' + path);
    }
    if (actual.markups.length !== expected.markups.length) {
      assert.equal(actual.markups.length, expected.markups.length, 'wrong markups at ' + path);
    }
    if (deepCompare) {
      actual.markups.forEach(function (markup, index) {
        comparePostNode(markup, expected.markups[index], assert, path + ':' + index, deepCompare);
      });
    }
  }

  function comparePostNode(actual, expected, assert) {
    var path = arguments.length <= 3 || arguments[3] === undefined ? 'root' : arguments[3];
    var deepCompare = arguments.length <= 4 || arguments[4] === undefined ? false : arguments[4];

    if (!actual || !expected) {
      assert.ok(!!actual, 'missing actual post node at ' + path);
      assert.ok(!!expected, 'missing expected post node at ' + path);
      return;
    }
    if (actual.type !== expected.type) {
      assert.push(false, actual.type, expected.type, 'wrong type at ' + path);
    }

    switch (actual.type) {
      case _mobiledocKitModelsTypes.POST_TYPE:
        if (actual.sections.length !== expected.sections.length) {
          assert.equal(actual.sections.length, expected.sections.length, 'wrong sections for post');
        }
        if (deepCompare) {
          actual.sections.forEach(function (section, index) {
            comparePostNode(section, expected.sections.objectAt(index), assert, path + ':' + index, deepCompare);
          });
        }
        break;
      case _mobiledocKitModelsTypes.ATOM_TYPE:
        if (actual.name !== expected.name) {
          assert.equal(actual.name, expected.name, 'wrong atom name at ' + path);
        }
        compareMarkers(actual, expected, assert, path, deepCompare);
        break;
      case _mobiledocKitModelsTypes.MARKER_TYPE:
        compareMarkers(actual, expected, assert, path, deepCompare);
        break;
      case _mobiledocKitModelsTypes.MARKUP_SECTION_TYPE:
      case _mobiledocKitModelsTypes.LIST_ITEM_TYPE:
        if (actual.tagName !== expected.tagName) {
          assert.equal(actual.tagName, expected.tagName, 'wrong tagName at ' + path);
        }
        if (actual.markers.length !== expected.markers.length) {
          assert.equal(actual.markers.length, expected.markers.length, 'wrong markers at ' + path);
        }
        if (deepCompare) {
          actual.markers.forEach(function (marker, index) {
            comparePostNode(marker, expected.markers.objectAt(index), assert, path + ':' + index, deepCompare);
          });
        }
        break;
      case _mobiledocKitModelsTypes.CARD_TYPE:
        if (actual.name !== expected.name) {
          assert.equal(actual.name, expected.name, 'wrong card name at ' + path);
        }
        if (!QUnit.equiv(actual.payload, expected.payload)) {
          assert.deepEqual(actual.payload, expected.payload, 'wrong card payload at ' + path);
        }
        break;
      case _mobiledocKitModelsTypes.LIST_SECTION_TYPE:
        if (actual.items.length !== expected.items.length) {
          assert.equal(actual.items.length, expected.items.length, 'wrong items at ' + path);
        }
        if (deepCompare) {
          actual.items.forEach(function (item, index) {
            comparePostNode(item, expected.items.objectAt(index), assert, path + ':' + index, deepCompare);
          });
        }
        break;
      case _mobiledocKitModelsTypes.IMAGE_SECTION_TYPE:
        if (actual.src !== expected.src) {
          assert.equal(actual.src, expected.src, 'wrong image src at ' + path);
        }
        break;
      case _mobiledocKitModelsTypes.MARKUP_TYPE:
        if (actual.tagName !== expected.tagName) {
          assert.equal(actual.tagName, expected.tagName, 'wrong tagName at ' + path);
        }
        if (!QUnit.equiv(actual.attributes, expected.attributes)) {
          assert.deepEqual(actual.attributes, expected.attributes, 'wrong attributes at ' + path);
        }
        break;
      default:
        throw new Error('wrong type :' + actual.type);
    }
  }

  function registerAssertions() {
    QUnit.assert.hasElement = function (selector) {
      var message = arguments.length <= 1 || arguments[1] === undefined ? 'hasElement "' + selector + '"' : arguments[1];
      return (function () {
        var found = $(selector);
        this.push(found.length > 0, found.length, selector, message);
        return found;
      }).apply(this, arguments);
    };

    QUnit.assert.hasNoElement = function (selector) {
      var message = arguments.length <= 1 || arguments[1] === undefined ? 'hasNoElement "' + selector + '"' : arguments[1];
      return (function () {
        var found = $(selector);
        this.push(found.length === 0, found.length, selector, message);
        return found;
      }).apply(this, arguments);
    };

    QUnit.assert.selectedText = function (text) {
      var message = arguments.length <= 1 || arguments[1] === undefined ? 'selectedText "' + text + '"' : arguments[1];
      return (function () {
        var selected = _dom['default'].getSelectedText();
        this.push(selected === text, selected, text, message);
      }).apply(this, arguments);
    };

    QUnit.assert.inArray = function (element, array) {
      var message = arguments.length <= 2 || arguments[2] === undefined ? 'has "' + element + '" in "' + array + '"' : arguments[2];
      return (function () {
        QUnit.assert.ok(array.indexOf(element) !== -1, message);
      })();
    };

    QUnit.assert.postIsSimilar = function (post, expected) {
      var postName = arguments.length <= 2 || arguments[2] === undefined ? 'post' : arguments[2];

      comparePostNode(post, expected, this, postName, true);
      var mobiledoc = _mobiledocKitRenderersMobiledoc['default'].render(post),
          expectedMobiledoc = _mobiledocKitRenderersMobiledoc['default'].render(expected);
      this.deepEqual(mobiledoc, expectedMobiledoc, postName + ' is similar to expected');
    };

    QUnit.assert.renderTreeIsEqual = function (renderTree, expectedPost) {
      var _this = this;

      if (renderTree.rootNode.isDirty) {
        this.ok(false, 'renderTree is dirty');
        return;
      }

      expectedPost.sections.forEach(function (section, index) {
        var renderNode = renderTree.rootNode.childNodes.objectAt(index);
        var path = 'post:' + index;

        var compareChildren = function compareChildren(parentPostNode, parentRenderNode, path) {
          var children = parentPostNode.markers || parentPostNode.items || [];

          if (children.length !== parentRenderNode.childNodes.length) {
            _this.equal(parentRenderNode.childNodes.length, children.length, 'wrong child render nodes at ' + path);
            return;
          }

          children.forEach(function (child, index) {
            var renderNode = parentRenderNode.childNodes.objectAt(index);

            comparePostNode(child, renderNode && renderNode.postNode, _this, path + ':' + index, false);
            compareChildren(child, renderNode, path + ':' + index);
          });
        };

        comparePostNode(section, renderNode.postNode, _this, path, false);
        compareChildren(section, renderNode, path);
      });

      this.ok(true, 'renderNode is similar');
    };

    QUnit.assert.positionIsEqual = function (position, expected) {
      var message = arguments.length <= 2 || arguments[2] === undefined ? 'position is equal' : arguments[2];

      if (position.section !== expected.section) {
        this.push(false, position.section.type + ':' + position.section.tagName, expected.section.type + ':' + expected.section.tagName, 'incorrect position section (' + message + ')');
      } else if (position.offset !== expected.offset) {
        this.push(false, position.offset, expected.offset, 'incorrect position offset (' + message + ')');
      } else {
        this.push(true, position, expected, message);
      }
    };
  }
});
define("tests/helpers/browsers", ["exports"], function (exports) {
  "use strict";

  exports.detectIE = detectIE;
  exports.detectIE11 = detectIE11;
  exports.supportsSelectionExtend = supportsSelectionExtend;
  exports.supportsStandardClipboardAPI = supportsStandardClipboardAPI;

  function detectIE() {
    var userAgent = navigator.userAgent;
    return userAgent.indexOf("MSIE ") !== -1 || userAgent.indexOf("Trident/") !== -1 || userAgent.indexOf('Edge/') !== -1;
  }

  function detectIE11() {
    return detectIE() && navigator.userAgent.indexOf("rv:11.0") !== -1;
  }

  function supportsSelectionExtend() {
    var selection = window.getSelection();
    return !!selection.extend;
  }

  // See http://caniuse.com/#feat=clipboard
  // This rules out the Internet Explorers.

  function supportsStandardClipboardAPI() {
    return !window.clipboardData;
  }
});
define('tests/helpers/dom', ['exports', 'mobiledoc-kit/utils/selection-utils', 'mobiledoc-kit/utils/array-utils', 'mobiledoc-kit/utils/keycodes', 'mobiledoc-kit/utils/key', 'mobiledoc-kit/utils/dom-utils', 'mobiledoc-kit/utils/merge', './browsers'], function (exports, _mobiledocKitUtilsSelectionUtils, _mobiledocKitUtilsArrayUtils, _mobiledocKitUtilsKeycodes, _mobiledocKitUtilsKey, _mobiledocKitUtilsDomUtils, _mobiledocKitUtilsMerge, _browsers) {
  'use strict';

  // walks DOWN the dom from node to childNodes, returning the element
  // for which `conditionFn(element)` is true
  function walkDOMUntil(topNode) {
    var conditionFn = arguments.length <= 1 || arguments[1] === undefined ? function () {} : arguments[1];

    if (!topNode) {
      throw new Error('Cannot call walkDOMUntil without a node');
    }
    var stack = [topNode];
    var currentElement = undefined;

    while (stack.length) {
      currentElement = stack.pop();

      if (conditionFn(currentElement)) {
        return currentElement;
      }

      // jshint -W083
      (0, _mobiledocKitUtilsArrayUtils.forEach)(currentElement.childNodes, function (el) {
        return stack.push(el);
      });
      // jshint +W083
    }
  }

  function selectRange(startNode, startOffset, endNode, endOffset) {
    (0, _mobiledocKitUtilsSelectionUtils.clearSelection)();

    var range = document.createRange();
    range.setStart(startNode, startOffset);
    range.setEnd(endNode, endOffset);

    var selection = window.getSelection();
    selection.addRange(range);
  }

  function selectText(startText, startContainingElement) {
    var endText = arguments.length <= 2 || arguments[2] === undefined ? startText : arguments[2];
    var endContainingElement = arguments.length <= 3 || arguments[3] === undefined ? startContainingElement : arguments[3];
    return (function () {
      var findTextNode = function findTextNode(text) {
        return function (el) {
          return (0, _mobiledocKitUtilsDomUtils.isTextNode)(el) && el.textContent.indexOf(text) !== -1;
        };
      };
      var startTextNode = walkDOMUntil(startContainingElement, findTextNode(startText));
      var endTextNode = walkDOMUntil(endContainingElement, findTextNode(endText));

      if (!startTextNode) {
        throw new Error('Could not find a starting textNode containing "' + startText + '"');
      }
      if (!endTextNode) {
        throw new Error('Could not find an ending textNode containing "' + endText + '"');
      }

      var startOffset = startTextNode.textContent.indexOf(startText),
          endOffset = endTextNode.textContent.indexOf(endText) + endText.length;
      selectRange(startTextNode, startOffset, endTextNode, endOffset);
    })();
  }

  function moveCursorTo(node) {
    var offset = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];
    var endNode = arguments.length <= 2 || arguments[2] === undefined ? node : arguments[2];
    var endOffset = arguments.length <= 3 || arguments[3] === undefined ? offset : arguments[3];
    return (function () {
      if (!node) {
        throw new Error('Cannot moveCursorTo node without node');
      }
      selectRange(node, offset, endNode, endOffset);
    })();
  }

  function triggerEvent(node, eventType) {
    if (!node) {
      throw new Error('Attempted to trigger event "' + eventType + '" on undefined node');
    }

    var clickEvent = document.createEvent('MouseEvents');
    clickEvent.initEvent(eventType, true, true);
    return node.dispatchEvent(clickEvent);
  }

  function _buildDOM(tagName) {
    var attributes = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
    var children = arguments.length <= 2 || arguments[2] === undefined ? [] : arguments[2];

    var el = document.createElement(tagName);
    Object.keys(attributes).forEach(function (k) {
      return el.setAttribute(k, attributes[k]);
    });
    children.forEach(function (child) {
      return el.appendChild(child);
    });
    return el;
  }

  _buildDOM.text = function (string) {
    return document.createTextNode(string);
  };

  /**
   * Usage:
   * build(t =>
   *   t('div', attributes={}, children=[
   *     t('b', {}, [
   *       t.text('I am a bold text node')
   *     ])
   *   ])
   * );
   */
  function build(tree) {
    return tree(_buildDOM);
  }

  function getSelectedText() {
    var selection = window.getSelection();
    if (selection.rangeCount === 0) {
      return null;
    } else if (selection.rangeCount > 1) {
      // FIXME?
      throw new Error('Unable to get selected text for multiple ranges');
    } else {
      return selection.toString();
    }
  }

  // returns the node and the offset that the cursor is on
  function getCursorPosition() {
    var selection = window.getSelection();
    return {
      node: selection.anchorNode,
      offset: selection.anchorOffset
    };
  }

  function createMockEvent(eventName, element) {
    var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

    var event = {
      type: eventName,
      preventDefault: function preventDefault() {},
      target: element
    };
    (0, _mobiledocKitUtilsMerge.merge)(event, options);
    return event;
  }

  function triggerDelete(editor) {
    var direction = arguments.length <= 1 || arguments[1] === undefined ? _mobiledocKitUtilsKey.DIRECTION.BACKWARD : arguments[1];

    if (!editor) {
      throw new Error('Must pass `editor` to `triggerDelete`');
    }
    var keyCode = direction === _mobiledocKitUtilsKey.DIRECTION.BACKWARD ? _mobiledocKitUtilsKeycodes['default'].BACKSPACE : _mobiledocKitUtilsKeycodes['default'].DELETE;
    var event = createMockEvent('keydown', editor.element, {
      keyCode: keyCode
    });
    editor.triggerEvent(editor.element, 'keydown', event);
  }

  function triggerForwardDelete(editor) {
    return triggerDelete(editor, _mobiledocKitUtilsKey.DIRECTION.FORWARD);
  }

  function triggerEnter(editor) {
    if (!editor) {
      throw new Error('Must pass `editor` to `triggerEnter`');
    }
    var event = createMockEvent('keydown', editor.element, { keyCode: _mobiledocKitUtilsKeycodes['default'].ENTER });
    editor.triggerEvent(editor.element, 'keydown', event);
  }

  // IE11 and earlier cannot exec the `insertText` command. This version
  // check takes the place of actually detecting support for the
  // functionality, which would be very difficult.
  var canExecCommandInsertText = (function () {
    var userAgent = navigator.userAgent;
    return userAgent.indexOf("MSIE ") === -1 && userAgent.indexOf("Trident/") === -1;
  })();

  // keyCodes and charCodes are similar but not the same.;
  function keyCodeForChar(letter) {
    var keyCode = undefined;
    switch (letter) {
      case '.':
        keyCode = _mobiledocKitUtilsKeycodes['default']['.'];
        break;
      case '\n':
        keyCode = _mobiledocKitUtilsKeycodes['default'].ENTER;
        break;
      default:
        keyCode = letter.charCodeAt(0);
    }
    return keyCode;
  }

  function _insertTextIntoDOM(letter) {
    if (canExecCommandInsertText) {
      document.execCommand('insertText', false, letter);
    } else {
      // Without execCommand('insertText'), creating a text node and inserting
      // it manually is used instead. First find the current cursor location and
      // append a textNode to it.
      var selection = window.getSelection();
      var range = selection.getRangeAt(0);
      var textNode = document.createTextNode(letter);
      range.insertNode(textNode);
      selection.removeAllRanges();
      // Next move the cursor forward to the next position, as if the user was
      // typing normally.
      var nextCursorRange = document.createRange();
      nextCursorRange.setStart(textNode, textNode.length);
      selection.addRange(nextCursorRange);
    }
  }

  function insertText(editor, string) {
    if (!string && editor) {
      throw new Error('Must pass `editor` to `insertText`');
    }

    string.split('').forEach(function (letter) {
      var stop = false;
      var keyCode = keyCodeForChar(letter);
      var keydown = createMockEvent('keydown', editor.element, {
        keyCode: keyCode,
        preventDefault: function preventDefault() {
          stop = true;
        }
      });
      var keyup = createMockEvent('keyup', editor.element, {
        keyCode: keyCode,
        preventDefault: function preventDefault() {
          stop = true;
        }
      });
      var input = createMockEvent('input', editor.element, {
        preventDefault: function preventDefault() {
          stop = true;
        }
      });

      editor.triggerEvent(editor.element, 'keydown', keydown);
      if (stop) {
        return;
      }
      _insertTextIntoDOM(letter);
      editor.triggerEvent(editor.element, 'input', input);
      if (stop) {
        return;
      }
      editor.triggerEvent(editor.element, 'keyup', keyup);
    });
  }

  // triggers a key sequence like cmd-B on the editor, to test out
  // registered keyCommands
  function triggerKeyCommand(editor, string) {
    var modifiers = arguments.length <= 2 || arguments[2] === undefined ? [] : arguments[2];

    if (typeof modifiers === "number") {
      modifiers = [modifiers]; // convert singular to array
    }
    var keyEvent = createMockEvent('keydown', editor.element, {
      keyCode: string.toUpperCase().charCodeAt(0),
      shiftKey: (0, _mobiledocKitUtilsArrayUtils.contains)(modifiers, _mobiledocKitUtilsKey.MODIFIERS.SHIFT),
      metaKey: (0, _mobiledocKitUtilsArrayUtils.contains)(modifiers, _mobiledocKitUtilsKey.MODIFIERS.META),
      ctrlKey: (0, _mobiledocKitUtilsArrayUtils.contains)(modifiers, _mobiledocKitUtilsKey.MODIFIERS.CTRL)
    });
    editor.triggerEvent(editor.element, 'keydown', keyEvent);
  }

  function triggerRightArrowKey(editor, modifier) {
    if (!editor) {
      throw new Error('Must pass editor to triggerRightArrowKey');
    }
    var keydown = createMockEvent('keydown', editor.element, {
      keyCode: _mobiledocKitUtilsKeycodes['default'].RIGHT,
      shiftKey: modifier === _mobiledocKitUtilsKey.MODIFIERS.SHIFT
    });
    var keyup = createMockEvent('keyup', editor.element, {
      keyCode: _mobiledocKitUtilsKeycodes['default'].RIGHT,
      shiftKey: modifier === _mobiledocKitUtilsKey.MODIFIERS.SHIFT
    });
    editor.triggerEvent(editor.element, 'keydown', keydown);
    editor.triggerEvent(editor.element, 'keyup', keyup);
  }

  function triggerLeftArrowKey(editor, modifier) {
    if (!editor) {
      throw new Error('Must pass editor to triggerLeftArrowKey');
    }
    var keydown = createMockEvent('keydown', editor.element, {
      keyCode: _mobiledocKitUtilsKeycodes['default'].LEFT,
      shiftKey: modifier === _mobiledocKitUtilsKey.MODIFIERS.SHIFT
    });
    var keyup = createMockEvent('keyup', editor.element, {
      keyCode: _mobiledocKitUtilsKeycodes['default'].LEFT,
      shiftKey: modifier === _mobiledocKitUtilsKey.MODIFIERS.SHIFT
    });
    editor.triggerEvent(editor.element, 'keydown', keydown);
    editor.triggerEvent(editor.element, 'keyup', keyup);
  }

  // Allows our fake copy and paste events to communicate with each other.
  var lastCopyData = {};
  function triggerCopyEvent(editor) {
    var eventData = {};

    if ((0, _browsers.supportsStandardClipboardAPI)()) {
      eventData = {
        clipboardData: {
          setData: function setData(type, value) {
            lastCopyData[type] = value;
          }
        }
      };
    }

    var event = createMockEvent('copy', editor.element, eventData);
    editor.triggerEvent(editor.element, 'copy', event);
  }

  function triggerCutEvent(editor) {
    var event = createMockEvent('copy', editor.element, {
      clipboardData: {
        setData: function setData(type, value) {
          lastCopyData[type] = value;
        }
      }
    });
    editor.triggerEvent(editor.element, 'cut', event);
  }

  function triggerPasteEvent(editor) {
    var eventData = {};

    if ((0, _browsers.supportsStandardClipboardAPI)()) {
      eventData = {
        clipboardData: {
          getData: function getData(type) {
            return lastCopyData[type];
          }
        }
      };
    }

    var event = createMockEvent('copy', editor.element, eventData);
    editor.triggerEvent(editor.element, 'paste', event);
  }

  function getCopyData(type) {
    if ((0, _browsers.supportsStandardClipboardAPI)()) {
      return lastCopyData[type];
    } else {
      return window.clipboardData.getData('Text');
    }
  }

  function setCopyData(type, value) {
    if ((0, _browsers.supportsStandardClipboardAPI)()) {
      lastCopyData[type] = value;
    } else {
      window.clipboardData.setData('Text', value);
    }
  }

  function clearCopyData() {
    Object.keys(lastCopyData).forEach(function (key) {
      delete lastCopyData[key];
    });
  }

  function fromHTML(html) {
    html = $.trim(html);
    var div = document.createElement('div');
    div.innerHTML = html;
    return div;
  }

  function findTextNode(parentElement, text) {
    return walkDOMUntil(parentElement, function (node) {
      return (0, _mobiledocKitUtilsDomUtils.isTextNode)(node) && node.textContent.indexOf(text) !== -1;
    });
  }

  var DOMHelper = {
    moveCursorTo: moveCursorTo,
    selectRange: selectRange,
    selectText: selectText,
    clearSelection: _mobiledocKitUtilsSelectionUtils.clearSelection,
    triggerEvent: triggerEvent,
    build: build,
    fromHTML: fromHTML,
    KEY_CODES: _mobiledocKitUtilsKeycodes['default'],
    getCursorPosition: getCursorPosition,
    getSelectedText: getSelectedText,
    triggerDelete: triggerDelete,
    triggerForwardDelete: triggerForwardDelete,
    triggerEnter: triggerEnter,
    insertText: insertText,
    triggerKeyCommand: triggerKeyCommand,
    triggerRightArrowKey: triggerRightArrowKey,
    triggerLeftArrowKey: triggerLeftArrowKey,
    triggerCopyEvent: triggerCopyEvent,
    triggerCutEvent: triggerCutEvent,
    triggerPasteEvent: triggerPasteEvent,
    getCopyData: getCopyData,
    setCopyData: setCopyData,
    clearCopyData: clearCopyData,
    createMockEvent: createMockEvent,
    findTextNode: findTextNode
  };

  exports.triggerEvent = triggerEvent;
  exports['default'] = DOMHelper;
});
define('tests/helpers/mobiledoc', ['exports', './post-abstract', 'mobiledoc-kit/renderers/mobiledoc', 'mobiledoc-kit/renderers/mobiledoc/0-2', 'mobiledoc-kit/renderers/mobiledoc/0-3', 'mobiledoc-kit/editor/editor', 'mobiledoc-kit/utils/merge'], function (exports, _postAbstract, _mobiledocKitRenderersMobiledoc, _mobiledocKitRenderersMobiledoc02, _mobiledocKitRenderersMobiledoc03, _mobiledocKitEditorEditor, _mobiledocKitUtilsMerge) {
  'use strict';

  /*
   * usage:
   *  build(({post, section, marker, markup}) =>
   *    post([
   *      section('P', [
   *        marker('some text', [markup('B')])
   *      ])
   *    })
   *  )
   */
  function build(treeFn, version) {
    var post = _postAbstract['default'].build(treeFn);
    switch (version) {
      case _mobiledocKitRenderersMobiledoc02.MOBILEDOC_VERSION:
        return _mobiledocKitRenderersMobiledoc02['default'].render(post);
      case _mobiledocKitRenderersMobiledoc03.MOBILEDOC_VERSION:
        return _mobiledocKitRenderersMobiledoc03['default'].render(post);
      case undefined:
      case null:
        return _mobiledocKitRenderersMobiledoc['default'].render(post);
      default:
        throw new Error('Unknown version of mobiledoc renderer requested: ' + version);
    }
  }

  function renderInto(element, treeFn) {
    var editorOptions = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

    var mobiledoc = build(treeFn);
    (0, _mobiledocKitUtilsMerge.mergeWithOptions)(editorOptions, { mobiledoc: mobiledoc });
    var editor = new _mobiledocKitEditorEditor['default'](editorOptions);
    editor.render(element);
    return editor;
  }

  exports['default'] = {
    build: build,
    renderInto: renderInto
  };
});
define('tests/helpers/post-abstract', ['exports', 'mobiledoc-kit/models/post-node-builder'], function (exports, _mobiledocKitModelsPostNodeBuilder) {
  'use strict';

  /*
   * usage:
   *  makeMD(({post, section, marker, markup}) =>
   *    post([
   *      section('P', [
   *        marker('some text', [markup('B')])
   *      ])
   *    })
   *  )
   */
  function build(treeFn) {
    var builder = new _mobiledocKitModelsPostNodeBuilder['default']();

    var simpleBuilder = {
      post: function post() {
        return builder.createPost.apply(builder, arguments);
      },
      markupSection: function markupSection() {
        return builder.createMarkupSection.apply(builder, arguments);
      },
      markup: function markup() {
        return builder.createMarkup.apply(builder, arguments);
      },
      marker: function marker() {
        return builder.createMarker.apply(builder, arguments);
      },
      listSection: function listSection() {
        return builder.createListSection.apply(builder, arguments);
      },
      listItem: function listItem() {
        return builder.createListItem.apply(builder, arguments);
      },
      cardSection: function cardSection() {
        return builder.createCardSection.apply(builder, arguments);
      },
      atom: function atom() {
        return builder.createAtom.apply(builder, arguments);
      }
    };

    return treeFn(simpleBuilder);
  }

  exports['default'] = {
    build: build
  };
});
QUnit.module('JSHint - tests/jshint/acceptance');
QUnit.test('tests/jshint/acceptance/basic-editor-test.js should pass jshint', function(assert) { 
  assert.ok(true, 'tests/jshint/acceptance/basic-editor-test.js should pass jshint.'); 
});

QUnit.module('JSHint - tests/jshint/acceptance');
QUnit.test('tests/jshint/acceptance/cursor-movement-test.js should pass jshint', function(assert) { 
  assert.ok(true, 'tests/jshint/acceptance/cursor-movement-test.js should pass jshint.'); 
});

QUnit.module('JSHint - tests/jshint/acceptance');
QUnit.test('tests/jshint/acceptance/cursor-position-test.js should pass jshint', function(assert) { 
  assert.ok(true, 'tests/jshint/acceptance/cursor-position-test.js should pass jshint.'); 
});

QUnit.module('JSHint - tests/jshint/acceptance');
QUnit.test('tests/jshint/acceptance/editor-atoms-test.js should pass jshint', function(assert) { 
  assert.ok(true, 'tests/jshint/acceptance/editor-atoms-test.js should pass jshint.'); 
});

QUnit.module('JSHint - tests/jshint/acceptance');
QUnit.test('tests/jshint/acceptance/editor-cards-test.js should pass jshint', function(assert) { 
  assert.ok(true, 'tests/jshint/acceptance/editor-cards-test.js should pass jshint.'); 
});

QUnit.module('JSHint - tests/jshint/acceptance');
QUnit.test('tests/jshint/acceptance/editor-copy-paste-test.js should pass jshint', function(assert) { 
  assert.ok(true, 'tests/jshint/acceptance/editor-copy-paste-test.js should pass jshint.'); 
});

QUnit.module('JSHint - tests/jshint/acceptance');
QUnit.test('tests/jshint/acceptance/editor-key-commands-test.js should pass jshint', function(assert) { 
  assert.ok(true, 'tests/jshint/acceptance/editor-key-commands-test.js should pass jshint.'); 
});

QUnit.module('JSHint - tests/jshint/acceptance');
QUnit.test('tests/jshint/acceptance/editor-list-test.js should pass jshint', function(assert) { 
  assert.ok(true, 'tests/jshint/acceptance/editor-list-test.js should pass jshint.'); 
});

QUnit.module('JSHint - tests/jshint/acceptance');
QUnit.test('tests/jshint/acceptance/editor-post-editor-test.js should pass jshint', function(assert) { 
  assert.ok(true, 'tests/jshint/acceptance/editor-post-editor-test.js should pass jshint.'); 
});

QUnit.module('JSHint - tests/jshint/acceptance');
QUnit.test('tests/jshint/acceptance/editor-reparse-test.js should pass jshint', function(assert) { 
  assert.ok(true, 'tests/jshint/acceptance/editor-reparse-test.js should pass jshint.'); 
});

QUnit.module('JSHint - tests/jshint/acceptance');
QUnit.test('tests/jshint/acceptance/editor-sections-test.js should pass jshint', function(assert) { 
  assert.ok(true, 'tests/jshint/acceptance/editor-sections-test.js should pass jshint.'); 
});

QUnit.module('JSHint - tests/jshint/acceptance');
QUnit.test('tests/jshint/acceptance/editor-selections-test.js should pass jshint', function(assert) { 
  assert.ok(true, 'tests/jshint/acceptance/editor-selections-test.js should pass jshint.'); 
});

QUnit.module('JSHint - tests/jshint/acceptance');
QUnit.test('tests/jshint/acceptance/editor-text-expansions-test.js should pass jshint', function(assert) { 
  assert.ok(true, 'tests/jshint/acceptance/editor-text-expansions-test.js should pass jshint.'); 
});

QUnit.module('JSHint - tests/jshint/acceptance');
QUnit.test('tests/jshint/acceptance/editor-undo-redo-test.js should pass jshint', function(assert) { 
  assert.ok(true, 'tests/jshint/acceptance/editor-undo-redo-test.js should pass jshint.'); 
});

QUnit.module('JSHint - tests/jshint/fixtures');
QUnit.test('tests/jshint/fixtures/google-docs.js should pass jshint', function(assert) { 
  assert.ok(true, 'tests/jshint/fixtures/google-docs.js should pass jshint.'); 
});

QUnit.module('JSHint - tests/jshint/helpers');
QUnit.test('tests/jshint/helpers/assertions.js should pass jshint', function(assert) { 
  assert.ok(true, 'tests/jshint/helpers/assertions.js should pass jshint.'); 
});

QUnit.module('JSHint - tests/jshint/helpers');
QUnit.test('tests/jshint/helpers/browsers.js should pass jshint', function(assert) { 
  assert.ok(true, 'tests/jshint/helpers/browsers.js should pass jshint.'); 
});

QUnit.module('JSHint - tests/jshint/helpers');
QUnit.test('tests/jshint/helpers/dom.js should pass jshint', function(assert) { 
  assert.ok(true, 'tests/jshint/helpers/dom.js should pass jshint.'); 
});

QUnit.module('JSHint - tests/jshint/helpers');
QUnit.test('tests/jshint/helpers/mobiledoc.js should pass jshint', function(assert) { 
  assert.ok(true, 'tests/jshint/helpers/mobiledoc.js should pass jshint.'); 
});

QUnit.module('JSHint - tests/jshint/helpers');
QUnit.test('tests/jshint/helpers/post-abstract.js should pass jshint', function(assert) { 
  assert.ok(true, 'tests/jshint/helpers/post-abstract.js should pass jshint.'); 
});

QUnit.module('JSHint - tests/jshint/js/cards');
QUnit.test('tests/jshint/js/cards/image.js should pass jshint', function(assert) { 
  assert.ok(true, 'tests/jshint/js/cards/image.js should pass jshint.'); 
});

QUnit.module('JSHint - tests/jshint/js/editor');
QUnit.test('tests/jshint/js/editor/edit-history.js should pass jshint', function(assert) { 
  assert.ok(true, 'tests/jshint/js/editor/edit-history.js should pass jshint.'); 
});

QUnit.module('JSHint - tests/jshint/js/editor');
QUnit.test('tests/jshint/js/editor/editor.js should pass jshint', function(assert) { 
  assert.ok(true, 'tests/jshint/js/editor/editor.js should pass jshint.'); 
});

QUnit.module('JSHint - tests/jshint/js/editor');
QUnit.test('tests/jshint/js/editor/key-commands.js should pass jshint', function(assert) { 
  assert.ok(true, 'tests/jshint/js/editor/key-commands.js should pass jshint.'); 
});

QUnit.module('JSHint - tests/jshint/js/editor');
QUnit.test('tests/jshint/js/editor/mutation-handler.js should pass jshint', function(assert) { 
  assert.ok(true, 'tests/jshint/js/editor/mutation-handler.js should pass jshint.'); 
});

QUnit.module('JSHint - tests/jshint/js/editor');
QUnit.test('tests/jshint/js/editor/post.js should pass jshint', function(assert) { 
  assert.ok(true, 'tests/jshint/js/editor/post.js should pass jshint.'); 
});

QUnit.module('JSHint - tests/jshint/js/editor/post');
QUnit.test('tests/jshint/js/editor/post/post-inserter.js should pass jshint', function(assert) { 
  assert.ok(true, 'tests/jshint/js/editor/post/post-inserter.js should pass jshint.'); 
});

QUnit.module('JSHint - tests/jshint/js/editor');
QUnit.test('tests/jshint/js/editor/text-expansions.js should pass jshint', function(assert) { 
  assert.ok(true, 'tests/jshint/js/editor/text-expansions.js should pass jshint.'); 
});

QUnit.module('JSHint - tests/jshint/js');
QUnit.test('tests/jshint/js/index.js should pass jshint', function(assert) { 
  assert.ok(true, 'tests/jshint/js/index.js should pass jshint.'); 
});

QUnit.module('JSHint - tests/jshint/js/models');
QUnit.test('tests/jshint/js/models/_markerable.js should pass jshint', function(assert) { 
  assert.ok(true, 'tests/jshint/js/models/_markerable.js should pass jshint.'); 
});

QUnit.module('JSHint - tests/jshint/js/models');
QUnit.test('tests/jshint/js/models/_section.js should pass jshint', function(assert) { 
  assert.ok(true, 'tests/jshint/js/models/_section.js should pass jshint.'); 
});

QUnit.module('JSHint - tests/jshint/js/models');
QUnit.test('tests/jshint/js/models/atom-node.js should pass jshint', function(assert) { 
  assert.ok(true, 'tests/jshint/js/models/atom-node.js should pass jshint.'); 
});

QUnit.module('JSHint - tests/jshint/js/models');
QUnit.test('tests/jshint/js/models/atom.js should pass jshint', function(assert) { 
  assert.ok(true, 'tests/jshint/js/models/atom.js should pass jshint.'); 
});

QUnit.module('JSHint - tests/jshint/js/models');
QUnit.test('tests/jshint/js/models/card-node.js should pass jshint', function(assert) { 
  assert.ok(true, 'tests/jshint/js/models/card-node.js should pass jshint.'); 
});

QUnit.module('JSHint - tests/jshint/js/models');
QUnit.test('tests/jshint/js/models/card.js should pass jshint', function(assert) { 
  assert.ok(true, 'tests/jshint/js/models/card.js should pass jshint.'); 
});

QUnit.module('JSHint - tests/jshint/js/models');
QUnit.test('tests/jshint/js/models/image.js should pass jshint', function(assert) { 
  assert.ok(true, 'tests/jshint/js/models/image.js should pass jshint.'); 
});

QUnit.module('JSHint - tests/jshint/js/models');
QUnit.test('tests/jshint/js/models/list-item.js should pass jshint', function(assert) { 
  assert.ok(true, 'tests/jshint/js/models/list-item.js should pass jshint.'); 
});

QUnit.module('JSHint - tests/jshint/js/models');
QUnit.test('tests/jshint/js/models/list-section.js should pass jshint', function(assert) { 
  assert.ok(true, 'tests/jshint/js/models/list-section.js should pass jshint.'); 
});

QUnit.module('JSHint - tests/jshint/js/models');
QUnit.test('tests/jshint/js/models/marker.js should pass jshint', function(assert) { 
  assert.ok(true, 'tests/jshint/js/models/marker.js should pass jshint.'); 
});

QUnit.module('JSHint - tests/jshint/js/models');
QUnit.test('tests/jshint/js/models/markup-section.js should pass jshint', function(assert) { 
  assert.ok(true, 'tests/jshint/js/models/markup-section.js should pass jshint.'); 
});

QUnit.module('JSHint - tests/jshint/js/models');
QUnit.test('tests/jshint/js/models/markup.js should pass jshint', function(assert) { 
  assert.ok(true, 'tests/jshint/js/models/markup.js should pass jshint.'); 
});

QUnit.module('JSHint - tests/jshint/js/models');
QUnit.test('tests/jshint/js/models/post-node-builder.js should pass jshint', function(assert) { 
  assert.ok(true, 'tests/jshint/js/models/post-node-builder.js should pass jshint.'); 
});

QUnit.module('JSHint - tests/jshint/js/models');
QUnit.test('tests/jshint/js/models/post.js should pass jshint', function(assert) { 
  assert.ok(true, 'tests/jshint/js/models/post.js should pass jshint.'); 
});

QUnit.module('JSHint - tests/jshint/js/models');
QUnit.test('tests/jshint/js/models/render-node.js should pass jshint', function(assert) { 
  assert.ok(true, 'tests/jshint/js/models/render-node.js should pass jshint.'); 
});

QUnit.module('JSHint - tests/jshint/js/models');
QUnit.test('tests/jshint/js/models/render-tree.js should pass jshint', function(assert) { 
  assert.ok(true, 'tests/jshint/js/models/render-tree.js should pass jshint.'); 
});

QUnit.module('JSHint - tests/jshint/js/models');
QUnit.test('tests/jshint/js/models/types.js should pass jshint', function(assert) { 
  assert.ok(true, 'tests/jshint/js/models/types.js should pass jshint.'); 
});

QUnit.module('JSHint - tests/jshint/js/parsers');
QUnit.test('tests/jshint/js/parsers/dom.js should pass jshint', function(assert) { 
  assert.ok(true, 'tests/jshint/js/parsers/dom.js should pass jshint.'); 
});

QUnit.module('JSHint - tests/jshint/js/parsers');
QUnit.test('tests/jshint/js/parsers/html.js should pass jshint', function(assert) { 
  assert.ok(true, 'tests/jshint/js/parsers/html.js should pass jshint.'); 
});

QUnit.module('JSHint - tests/jshint/js/parsers/mobiledoc');
QUnit.test('tests/jshint/js/parsers/mobiledoc/0-2.js should pass jshint', function(assert) { 
  assert.ok(true, 'tests/jshint/js/parsers/mobiledoc/0-2.js should pass jshint.'); 
});

QUnit.module('JSHint - tests/jshint/js/parsers/mobiledoc');
QUnit.test('tests/jshint/js/parsers/mobiledoc/0-3.js should pass jshint', function(assert) { 
  assert.ok(true, 'tests/jshint/js/parsers/mobiledoc/0-3.js should pass jshint.'); 
});

QUnit.module('JSHint - tests/jshint/js/parsers/mobiledoc');
QUnit.test('tests/jshint/js/parsers/mobiledoc/index.js should pass jshint', function(assert) { 
  assert.ok(true, 'tests/jshint/js/parsers/mobiledoc/index.js should pass jshint.'); 
});

QUnit.module('JSHint - tests/jshint/js/parsers');
QUnit.test('tests/jshint/js/parsers/section.js should pass jshint', function(assert) { 
  assert.ok(true, 'tests/jshint/js/parsers/section.js should pass jshint.'); 
});

QUnit.module('JSHint - tests/jshint/js/parsers');
QUnit.test('tests/jshint/js/parsers/text.js should pass jshint', function(assert) { 
  assert.ok(true, 'tests/jshint/js/parsers/text.js should pass jshint.'); 
});

QUnit.module('JSHint - tests/jshint/js/renderers');
QUnit.test('tests/jshint/js/renderers/editor-dom.js should pass jshint', function(assert) { 
  assert.ok(true, 'tests/jshint/js/renderers/editor-dom.js should pass jshint.'); 
});

QUnit.module('JSHint - tests/jshint/js/renderers/mobiledoc');
QUnit.test('tests/jshint/js/renderers/mobiledoc/0-2.js should pass jshint', function(assert) { 
  assert.ok(true, 'tests/jshint/js/renderers/mobiledoc/0-2.js should pass jshint.'); 
});

QUnit.module('JSHint - tests/jshint/js/renderers/mobiledoc');
QUnit.test('tests/jshint/js/renderers/mobiledoc/0-3.js should pass jshint', function(assert) { 
  assert.ok(true, 'tests/jshint/js/renderers/mobiledoc/0-3.js should pass jshint.'); 
});

QUnit.module('JSHint - tests/jshint/js/renderers/mobiledoc');
QUnit.test('tests/jshint/js/renderers/mobiledoc/index.js should pass jshint', function(assert) { 
  assert.ok(true, 'tests/jshint/js/renderers/mobiledoc/index.js should pass jshint.'); 
});

QUnit.module('JSHint - tests/jshint/js/utils');
QUnit.test('tests/jshint/js/utils/array-utils.js should pass jshint', function(assert) { 
  assert.ok(true, 'tests/jshint/js/utils/array-utils.js should pass jshint.'); 
});

QUnit.module('JSHint - tests/jshint/js/utils');
QUnit.test('tests/jshint/js/utils/assert.js should pass jshint', function(assert) { 
  assert.ok(true, 'tests/jshint/js/utils/assert.js should pass jshint.'); 
});

QUnit.module('JSHint - tests/jshint/js/utils');
QUnit.test('tests/jshint/js/utils/browser.js should pass jshint', function(assert) { 
  assert.ok(true, 'tests/jshint/js/utils/browser.js should pass jshint.'); 
});

QUnit.module('JSHint - tests/jshint/js/utils');
QUnit.test('tests/jshint/js/utils/characters.js should pass jshint', function(assert) { 
  assert.ok(true, 'tests/jshint/js/utils/characters.js should pass jshint.'); 
});

QUnit.module('JSHint - tests/jshint/js/utils');
QUnit.test('tests/jshint/js/utils/compiler.js should pass jshint', function(assert) { 
  assert.ok(true, 'tests/jshint/js/utils/compiler.js should pass jshint.'); 
});

QUnit.module('JSHint - tests/jshint/js/utils');
QUnit.test('tests/jshint/js/utils/copy.js should pass jshint', function(assert) { 
  assert.ok(true, 'tests/jshint/js/utils/copy.js should pass jshint.'); 
});

QUnit.module('JSHint - tests/jshint/js/utils');
QUnit.test('tests/jshint/js/utils/cursor.js should pass jshint', function(assert) { 
  assert.ok(true, 'tests/jshint/js/utils/cursor.js should pass jshint.'); 
});

QUnit.module('JSHint - tests/jshint/js/utils/cursor');
QUnit.test('tests/jshint/js/utils/cursor/position.js should pass jshint', function(assert) { 
  assert.ok(true, 'tests/jshint/js/utils/cursor/position.js should pass jshint.'); 
});

QUnit.module('JSHint - tests/jshint/js/utils/cursor');
QUnit.test('tests/jshint/js/utils/cursor/range.js should pass jshint', function(assert) { 
  assert.ok(true, 'tests/jshint/js/utils/cursor/range.js should pass jshint.'); 
});

QUnit.module('JSHint - tests/jshint/js/utils');
QUnit.test('tests/jshint/js/utils/dom-utils.js should pass jshint', function(assert) { 
  assert.ok(true, 'tests/jshint/js/utils/dom-utils.js should pass jshint.'); 
});

QUnit.module('JSHint - tests/jshint/js/utils');
QUnit.test('tests/jshint/js/utils/element-map.js should pass jshint', function(assert) { 
  assert.ok(true, 'tests/jshint/js/utils/element-map.js should pass jshint.'); 
});

QUnit.module('JSHint - tests/jshint/js/utils');
QUnit.test('tests/jshint/js/utils/element-utils.js should pass jshint', function(assert) { 
  assert.ok(true, 'tests/jshint/js/utils/element-utils.js should pass jshint.'); 
});

QUnit.module('JSHint - tests/jshint/js/utils');
QUnit.test('tests/jshint/js/utils/event-emitter.js should pass jshint', function(assert) { 
  assert.ok(true, 'tests/jshint/js/utils/event-emitter.js should pass jshint.'); 
});

QUnit.module('JSHint - tests/jshint/js/utils');
QUnit.test('tests/jshint/js/utils/event-listener.js should pass jshint', function(assert) { 
  assert.ok(true, 'tests/jshint/js/utils/event-listener.js should pass jshint.'); 
});

QUnit.module('JSHint - tests/jshint/js/utils');
QUnit.test('tests/jshint/js/utils/fixed-queue.js should pass jshint', function(assert) { 
  assert.ok(true, 'tests/jshint/js/utils/fixed-queue.js should pass jshint.'); 
});

QUnit.module('JSHint - tests/jshint/js/utils');
QUnit.test('tests/jshint/js/utils/key.js should pass jshint', function(assert) { 
  assert.ok(true, 'tests/jshint/js/utils/key.js should pass jshint.'); 
});

QUnit.module('JSHint - tests/jshint/js/utils');
QUnit.test('tests/jshint/js/utils/keycodes.js should pass jshint', function(assert) { 
  assert.ok(true, 'tests/jshint/js/utils/keycodes.js should pass jshint.'); 
});

QUnit.module('JSHint - tests/jshint/js/utils');
QUnit.test('tests/jshint/js/utils/lifecycle-callbacks.js should pass jshint', function(assert) { 
  assert.ok(true, 'tests/jshint/js/utils/lifecycle-callbacks.js should pass jshint.'); 
});

QUnit.module('JSHint - tests/jshint/js/utils');
QUnit.test('tests/jshint/js/utils/linked-item.js should pass jshint', function(assert) { 
  assert.ok(true, 'tests/jshint/js/utils/linked-item.js should pass jshint.'); 
});

QUnit.module('JSHint - tests/jshint/js/utils');
QUnit.test('tests/jshint/js/utils/linked-list.js should pass jshint', function(assert) { 
  assert.ok(true, 'tests/jshint/js/utils/linked-list.js should pass jshint.'); 
});

QUnit.module('JSHint - tests/jshint/js/utils');
QUnit.test('tests/jshint/js/utils/markuperable.js should pass jshint', function(assert) { 
  assert.ok(true, 'tests/jshint/js/utils/markuperable.js should pass jshint.'); 
});

QUnit.module('JSHint - tests/jshint/js/utils');
QUnit.test('tests/jshint/js/utils/merge.js should pass jshint', function(assert) { 
  assert.ok(true, 'tests/jshint/js/utils/merge.js should pass jshint.'); 
});

QUnit.module('JSHint - tests/jshint/js/utils');
QUnit.test('tests/jshint/js/utils/mixin.js should pass jshint', function(assert) { 
  assert.ok(true, 'tests/jshint/js/utils/mixin.js should pass jshint.'); 
});

QUnit.module('JSHint - tests/jshint/js/utils');
QUnit.test('tests/jshint/js/utils/mobiledoc-error.js should pass jshint', function(assert) { 
  assert.ok(true, 'tests/jshint/js/utils/mobiledoc-error.js should pass jshint.'); 
});

QUnit.module('JSHint - tests/jshint/js/utils');
QUnit.test('tests/jshint/js/utils/paste-utils.js should pass jshint', function(assert) { 
  assert.ok(true, 'tests/jshint/js/utils/paste-utils.js should pass jshint.'); 
});

QUnit.module('JSHint - tests/jshint/js/utils');
QUnit.test('tests/jshint/js/utils/placeholder-image-src.js should pass jshint', function(assert) { 
  assert.ok(true, 'tests/jshint/js/utils/placeholder-image-src.js should pass jshint.'); 
});

QUnit.module('JSHint - tests/jshint/js/utils');
QUnit.test('tests/jshint/js/utils/selection-utils.js should pass jshint', function(assert) { 
  assert.ok(true, 'tests/jshint/js/utils/selection-utils.js should pass jshint.'); 
});

QUnit.module('JSHint - tests/jshint/js/utils');
QUnit.test('tests/jshint/js/utils/set.js should pass jshint', function(assert) { 
  assert.ok(true, 'tests/jshint/js/utils/set.js should pass jshint.'); 
});

QUnit.module('JSHint - tests/jshint/js/utils');
QUnit.test('tests/jshint/js/utils/string-utils.js should pass jshint', function(assert) { 
  assert.ok(true, 'tests/jshint/js/utils/string-utils.js should pass jshint.'); 
});

QUnit.module('JSHint - tests/jshint/js');
QUnit.test('tests/jshint/js/version.js should pass jshint', function(assert) { 
  assert.ok(true, 'tests/jshint/js/version.js should pass jshint.'); 
});

QUnit.module('JSHint - tests/jshint/js/views');
QUnit.test('tests/jshint/js/views/tooltip.js should pass jshint', function(assert) { 
  assert.ok(true, 'tests/jshint/js/views/tooltip.js should pass jshint.'); 
});

QUnit.module('JSHint - tests/jshint/js/views');
QUnit.test('tests/jshint/js/views/view.js should pass jshint', function(assert) { 
  assert.ok(true, 'tests/jshint/js/views/view.js should pass jshint.'); 
});

QUnit.module('JSHint - tests/jshint');
QUnit.test('tests/jshint/test-helpers.js should pass jshint', function(assert) { 
  assert.ok(true, 'tests/jshint/test-helpers.js should pass jshint.'); 
});

QUnit.module('JSHint - tests/jshint/unit/editor');
QUnit.test('tests/jshint/unit/editor/atom-lifecycle-test.js should pass jshint', function(assert) { 
  assert.ok(true, 'tests/jshint/unit/editor/atom-lifecycle-test.js should pass jshint.'); 
});

QUnit.module('JSHint - tests/jshint/unit/editor');
QUnit.test('tests/jshint/unit/editor/card-lifecycle-test.js should pass jshint', function(assert) { 
  assert.ok(true, 'tests/jshint/unit/editor/card-lifecycle-test.js should pass jshint.'); 
});

QUnit.module('JSHint - tests/jshint/unit/editor');
QUnit.test('tests/jshint/unit/editor/editor-events-test.js should pass jshint', function(assert) { 
  assert.ok(true, 'tests/jshint/unit/editor/editor-events-test.js should pass jshint.'); 
});

QUnit.module('JSHint - tests/jshint/unit/editor');
QUnit.test('tests/jshint/unit/editor/editor-test.js should pass jshint', function(assert) { 
  assert.ok(true, 'tests/jshint/unit/editor/editor-test.js should pass jshint.'); 
});

QUnit.module('JSHint - tests/jshint/unit/editor');
QUnit.test('tests/jshint/unit/editor/key-commands-test.js should pass jshint', function(assert) { 
  assert.ok(true, 'tests/jshint/unit/editor/key-commands-test.js should pass jshint.'); 
});

QUnit.module('JSHint - tests/jshint/unit/editor');
QUnit.test('tests/jshint/unit/editor/post-test.js should pass jshint', function(assert) { 
  assert.ok(true, 'tests/jshint/unit/editor/post-test.js should pass jshint.'); 
});

QUnit.module('JSHint - tests/jshint/unit/editor/post');
QUnit.test('tests/jshint/unit/editor/post/insert-post-test.js should pass jshint', function(assert) { 
  assert.ok(true, 'tests/jshint/unit/editor/post/insert-post-test.js should pass jshint.'); 
});

QUnit.module('JSHint - tests/jshint/unit/models');
QUnit.test('tests/jshint/unit/models/atom-test.js should pass jshint', function(assert) { 
  assert.ok(true, 'tests/jshint/unit/models/atom-test.js should pass jshint.'); 
});

QUnit.module('JSHint - tests/jshint/unit/models');
QUnit.test('tests/jshint/unit/models/card-test.js should pass jshint', function(assert) { 
  assert.ok(true, 'tests/jshint/unit/models/card-test.js should pass jshint.'); 
});

QUnit.module('JSHint - tests/jshint/unit/models');
QUnit.test('tests/jshint/unit/models/list-section-test.js should pass jshint', function(assert) { 
  assert.ok(true, 'tests/jshint/unit/models/list-section-test.js should pass jshint.'); 
});

QUnit.module('JSHint - tests/jshint/unit/models');
QUnit.test('tests/jshint/unit/models/marker-test.js should pass jshint', function(assert) { 
  assert.ok(true, 'tests/jshint/unit/models/marker-test.js should pass jshint.'); 
});

QUnit.module('JSHint - tests/jshint/unit/models');
QUnit.test('tests/jshint/unit/models/markup-section-test.js should pass jshint', function(assert) { 
  assert.ok(true, 'tests/jshint/unit/models/markup-section-test.js should pass jshint.'); 
});

QUnit.module('JSHint - tests/jshint/unit/models');
QUnit.test('tests/jshint/unit/models/post-node-builder-test.js should pass jshint', function(assert) { 
  assert.ok(true, 'tests/jshint/unit/models/post-node-builder-test.js should pass jshint.'); 
});

QUnit.module('JSHint - tests/jshint/unit/models');
QUnit.test('tests/jshint/unit/models/post-test.js should pass jshint', function(assert) { 
  assert.ok(true, 'tests/jshint/unit/models/post-test.js should pass jshint.'); 
});

QUnit.module('JSHint - tests/jshint/unit/parsers');
QUnit.test('tests/jshint/unit/parsers/dom-test.js should pass jshint', function(assert) { 
  assert.ok(true, 'tests/jshint/unit/parsers/dom-test.js should pass jshint.'); 
});

QUnit.module('JSHint - tests/jshint/unit/parsers');
QUnit.test('tests/jshint/unit/parsers/html-google-docs-test.js should pass jshint', function(assert) { 
  assert.ok(true, 'tests/jshint/unit/parsers/html-google-docs-test.js should pass jshint.'); 
});

QUnit.module('JSHint - tests/jshint/unit/parsers');
QUnit.test('tests/jshint/unit/parsers/html-google-sheets-test.js should pass jshint', function(assert) { 
  assert.ok(true, 'tests/jshint/unit/parsers/html-google-sheets-test.js should pass jshint.'); 
});

QUnit.module('JSHint - tests/jshint/unit/parsers');
QUnit.test('tests/jshint/unit/parsers/html-test.js should pass jshint', function(assert) { 
  assert.ok(true, 'tests/jshint/unit/parsers/html-test.js should pass jshint.'); 
});

QUnit.module('JSHint - tests/jshint/unit/parsers');
QUnit.test('tests/jshint/unit/parsers/mobiledoc-test.js should pass jshint', function(assert) { 
  assert.ok(true, 'tests/jshint/unit/parsers/mobiledoc-test.js should pass jshint.'); 
});

QUnit.module('JSHint - tests/jshint/unit/parsers/mobiledoc');
QUnit.test('tests/jshint/unit/parsers/mobiledoc/0-2-test.js should pass jshint', function(assert) { 
  assert.ok(true, 'tests/jshint/unit/parsers/mobiledoc/0-2-test.js should pass jshint.'); 
});

QUnit.module('JSHint - tests/jshint/unit/parsers/mobiledoc');
QUnit.test('tests/jshint/unit/parsers/mobiledoc/0-3-test.js should pass jshint', function(assert) { 
  assert.ok(true, 'tests/jshint/unit/parsers/mobiledoc/0-3-test.js should pass jshint.'); 
});

QUnit.module('JSHint - tests/jshint/unit/parsers');
QUnit.test('tests/jshint/unit/parsers/section-test.js should pass jshint', function(assert) { 
  assert.ok(true, 'tests/jshint/unit/parsers/section-test.js should pass jshint.'); 
});

QUnit.module('JSHint - tests/jshint/unit/parsers');
QUnit.test('tests/jshint/unit/parsers/text-test.js should pass jshint', function(assert) { 
  assert.ok(true, 'tests/jshint/unit/parsers/text-test.js should pass jshint.'); 
});

QUnit.module('JSHint - tests/jshint/unit/renderers');
QUnit.test('tests/jshint/unit/renderers/editor-dom-test.js should pass jshint', function(assert) { 
  assert.ok(true, 'tests/jshint/unit/renderers/editor-dom-test.js should pass jshint.'); 
});

QUnit.module('JSHint - tests/jshint/unit/renderers');
QUnit.test('tests/jshint/unit/renderers/mobiledoc-test.js should pass jshint', function(assert) { 
  assert.ok(true, 'tests/jshint/unit/renderers/mobiledoc-test.js should pass jshint.'); 
});

QUnit.module('JSHint - tests/jshint/unit/renderers/mobiledoc');
QUnit.test('tests/jshint/unit/renderers/mobiledoc/0-2-test.js should pass jshint', function(assert) { 
  assert.ok(true, 'tests/jshint/unit/renderers/mobiledoc/0-2-test.js should pass jshint.'); 
});

QUnit.module('JSHint - tests/jshint/unit/renderers/mobiledoc');
QUnit.test('tests/jshint/unit/renderers/mobiledoc/0-3-test.js should pass jshint', function(assert) { 
  assert.ok(true, 'tests/jshint/unit/renderers/mobiledoc/0-3-test.js should pass jshint.'); 
});

QUnit.module('JSHint - tests/jshint/unit/utils');
QUnit.test('tests/jshint/unit/utils/array-utils-test.js should pass jshint', function(assert) { 
  assert.ok(true, 'tests/jshint/unit/utils/array-utils-test.js should pass jshint.'); 
});

QUnit.module('JSHint - tests/jshint/unit/utils');
QUnit.test('tests/jshint/unit/utils/assert-test.js should pass jshint', function(assert) { 
  assert.ok(true, 'tests/jshint/unit/utils/assert-test.js should pass jshint.'); 
});

QUnit.module('JSHint - tests/jshint/unit/utils');
QUnit.test('tests/jshint/unit/utils/copy-test.js should pass jshint', function(assert) { 
  assert.ok(true, 'tests/jshint/unit/utils/copy-test.js should pass jshint.'); 
});

QUnit.module('JSHint - tests/jshint/unit/utils');
QUnit.test('tests/jshint/unit/utils/cursor-position-test.js should pass jshint', function(assert) { 
  assert.ok(true, 'tests/jshint/unit/utils/cursor-position-test.js should pass jshint.'); 
});

QUnit.module('JSHint - tests/jshint/unit/utils');
QUnit.test('tests/jshint/unit/utils/cursor-range-test.js should pass jshint', function(assert) { 
  assert.ok(true, 'tests/jshint/unit/utils/cursor-range-test.js should pass jshint.'); 
});

QUnit.module('JSHint - tests/jshint/unit/utils');
QUnit.test('tests/jshint/unit/utils/fixed-queue-test.js should pass jshint', function(assert) { 
  assert.ok(true, 'tests/jshint/unit/utils/fixed-queue-test.js should pass jshint.'); 
});

QUnit.module('JSHint - tests/jshint/unit/utils');
QUnit.test('tests/jshint/unit/utils/key-test.js should pass jshint', function(assert) { 
  assert.ok(true, 'tests/jshint/unit/utils/key-test.js should pass jshint.'); 
});

QUnit.module('JSHint - tests/jshint/unit/utils');
QUnit.test('tests/jshint/unit/utils/lifecycle-callbacks-test.js should pass jshint', function(assert) { 
  assert.ok(true, 'tests/jshint/unit/utils/lifecycle-callbacks-test.js should pass jshint.'); 
});

QUnit.module('JSHint - tests/jshint/unit/utils');
QUnit.test('tests/jshint/unit/utils/linked-list-test.js should pass jshint', function(assert) { 
  assert.ok(true, 'tests/jshint/unit/utils/linked-list-test.js should pass jshint.'); 
});

QUnit.module('JSHint - tests/jshint/unit/utils');
QUnit.test('tests/jshint/unit/utils/selection-utils-test.js should pass jshint', function(assert) { 
  assert.ok(true, 'tests/jshint/unit/utils/selection-utils-test.js should pass jshint.'); 
});

define('tests/test-helpers', ['exports', './helpers/assertions', './helpers/dom', './helpers/mobiledoc', './helpers/post-abstract'], function (exports, _helpersAssertions, _helpersDom, _helpersMobiledoc, _helpersPostAbstract) {
  'use strict';

  (0, _helpersAssertions['default'])();

  var _QUnit = QUnit;
  var qunitTest = _QUnit.test;
  var _module = _QUnit.module;

  QUnit.config.urlConfig.push({
    id: 'debugTest',
    label: 'Debug Test'
  });

  var test = function test(msg, callback) {
    var originalCallback = callback;
    callback = function () {
      if (QUnit.config.debugTest) {
        debugger; // jshint ignore:line
      }
      originalCallback.apply(undefined, arguments);
    };
    qunitTest(msg, callback);
  };

  QUnit.testStart(function () {
    // The fixture is cleared between tests, clearing this
    $('<div id="editor"></div>').appendTo('#qunit-fixture');
  });

  exports['default'] = {
    dom: _helpersDom['default'],
    mobiledoc: _helpersMobiledoc['default'],
    postAbstract: _helpersPostAbstract['default'],
    test: test,
    module: _module
  };
});
define('tests/unit/editor/atom-lifecycle-test', ['exports', '../../test-helpers', 'mobiledoc-kit', 'mobiledoc-kit/renderers/mobiledoc/0-3'], function (exports, _testHelpers, _mobiledocKit, _mobiledocKitRenderersMobiledoc03) {
  'use strict';

  var editorElement = undefined,
      editor = undefined;

  var _module = _testHelpers['default'].module;
  var test = _testHelpers['default'].test;

  _module('Unit: Editor: Atom Lifecycle', {
    beforeEach: function beforeEach() {
      editorElement = $('#editor')[0];
    },
    afterEach: function afterEach() {
      if (editor) {
        try {
          editor.destroy();
        } catch (e) {}
        editor = null;
      }
    }
  });

  function makeEl(id) {
    var el = document.createElement('span');
    el.id = id;
    return el;
  }

  // Default version is 0.2 for the moment
  function build(fn) {
    return _testHelpers['default'].mobiledoc.build(fn, _mobiledocKitRenderersMobiledoc03.MOBILEDOC_VERSION);
  }

  function assertRenderArguments(assert, args, expected) {
    var env = args.env;
    var options = args.options;
    var payload = args.payload;

    assert.deepEqual(payload, expected.payload, 'correct payload');
    assert.deepEqual(options, expected.options, 'correct options');

    // basic env
    var name = env.name;
    var onTeardown = env.onTeardown;

    assert.equal(name, expected.name, 'correct name');
    assert.ok(!!onTeardown, 'has onTeardown');
  }

  test('rendering a mobiledoc with atom calls atom#render', function (assert) {
    var atomPayload = { foo: 'bar' };
    var atomValue = "@bob";
    var cardOptions = { boo: 'baz' };
    var atomName = 'test-atom';

    var renderArg = undefined;

    var atom = {
      name: atomName,
      type: 'dom',
      render: function render(_renderArg) {
        renderArg = _renderArg;
      }
    };

    var mobiledoc = build(function (_ref) {
      var markupSection = _ref.markupSection;
      var post = _ref.post;
      var atom = _ref.atom;
      return post([markupSection('p', [atom(atomName, atomValue, atomPayload)])]);
    });

    editor = new _mobiledocKit.Editor({ mobiledoc: mobiledoc, atoms: [atom], cardOptions: cardOptions });
    editor.render(editorElement);

    var expected = {
      name: atomName,
      payload: atomPayload,
      options: cardOptions
    };
    assertRenderArguments(assert, renderArg, expected);
  });

  test('rendering a mobiledoc with atom appends result of atom#render', function (assert) {
    var atomName = 'test-atom';

    var atom = {
      name: atomName,
      type: 'dom',
      render: function render() {
        return makeEl('the-atom');
      }
    };

    var mobiledoc = build(function (_ref2) {
      var markupSection = _ref2.markupSection;
      var post = _ref2.post;
      var atom = _ref2.atom;
      return post([markupSection('p', [atom(atomName, '@bob', {})])]);
    });
    editor = new _mobiledocKit.Editor({ mobiledoc: mobiledoc, atoms: [atom] });
    assert.hasNoElement('#editor #the-atom', 'precond - atom not rendered');
    editor.render(editorElement);
    assert.hasElement('#editor #the-atom');
  });

  test('returning wrong type from render throws', function (assert) {
    var atomName = 'test-atom';

    var atom = {
      name: atomName,
      type: 'dom',
      render: function render() {
        return 'string';
      }
    };

    var mobiledoc = build(function (_ref3) {
      var markupSection = _ref3.markupSection;
      var post = _ref3.post;
      var atom = _ref3.atom;
      return post([markupSection('p', [atom(atomName, '@bob', {})])]);
    });
    editor = new _mobiledocKit.Editor({ mobiledoc: mobiledoc, atoms: [atom] });

    assert.throws(function () {
      editor.render(editorElement);
    }, new RegExp('Atom "' + atomName + '" must return a DOM node'));
  });

  test('returning undefined from render is ok', function (assert) {
    var atomName = 'test-atom';

    var atom = {
      name: atomName,
      type: 'dom',
      render: function render() {}
    };

    var mobiledoc = build(function (_ref4) {
      var markupSection = _ref4.markupSection;
      var post = _ref4.post;
      var atom = _ref4.atom;
      return post([markupSection('p', [atom(atomName, '@bob', {})])]);
    });
    editor = new _mobiledocKit.Editor({ mobiledoc: mobiledoc, atoms: [atom] });
    editor.render(editorElement);
    assert.ok(true, 'no errors are thrown');
  });

  test('rendering atom with wrong type throws', function (assert) {
    var atomName = 'test-atom';
    var atom = {
      name: atomName,
      type: 'other',
      render: function render() {}
    };
    var mobiledoc = build(function (_ref5) {
      var markupSection = _ref5.markupSection;
      var post = _ref5.post;
      var atom = _ref5.atom;
      return post([markupSection('p', [atom(atomName, '@bob', {})])]);
    });

    assert.throws(function () {
      editor = new _mobiledocKit.Editor({ mobiledoc: mobiledoc, atoms: [atom] });
      editor.render(editorElement);
    }, new RegExp('Atom "' + atomName + '.* must define type'));
  });

  test('rendering atom without render method throws', function (assert) {
    var atomName = 'test-atom';
    var atom = {
      name: atomName,
      type: 'dom'
    };
    var mobiledoc = build(function (_ref6) {
      var markupSection = _ref6.markupSection;
      var post = _ref6.post;
      var atom = _ref6.atom;
      return post([markupSection('p', [atom(atomName, '@bob', {})])]);
    });

    assert.throws(function () {
      editor = new _mobiledocKit.Editor({ mobiledoc: mobiledoc, atoms: [atom] });
      editor.render(editorElement);
    }, new RegExp('Atom "' + atomName + '.* must define.*render'));
  });

  test('rendering unknown atom calls #unknownAtomHandler', function (assert) {
    var payload = { foo: 'bar' };
    var cardOptions = { boo: 'baz' };
    var atomName = 'test-atom';
    var atomValue = '@bob';

    var unknownArg = undefined;
    var unknownAtomHandler = function unknownAtomHandler(_unknownArg) {
      unknownArg = _unknownArg;
    };

    var mobiledoc = build(function (_ref7) {
      var markupSection = _ref7.markupSection;
      var post = _ref7.post;
      var atom = _ref7.atom;
      return post([markupSection('p', [atom(atomName, atomValue, payload)])]);
    });

    editor = new _mobiledocKit.Editor({ mobiledoc: mobiledoc, unknownAtomHandler: unknownAtomHandler, cardOptions: cardOptions });
    editor.render(editorElement);

    var expected = {
      name: atomName,
      value: atomValue,
      options: cardOptions,
      payload: payload
    };
    assertRenderArguments(assert, unknownArg, expected);
  });

  test('rendering unknown atom without unknownAtomHandler throws', function (assert) {
    var atomName = 'test-atom';

    var mobiledoc = build(function (_ref8) {
      var markupSection = _ref8.markupSection;
      var post = _ref8.post;
      var atom = _ref8.atom;
      return post([markupSection('p', [atom(atomName, '@bob', {})])]);
    });

    editor = new _mobiledocKit.Editor({ mobiledoc: mobiledoc, unknownAtomHandler: undefined });

    assert.throws(function () {
      editor.render(editorElement);
    }, new RegExp('Unknown atom "' + atomName + '".*no unknownAtomHandler'));
  });

  test('onTeardown hook is called when editor is destroyed', function (assert) {
    var atomName = 'test-atom';

    var teardown = undefined;

    var atom = {
      name: atomName,
      type: 'dom',
      render: function render(_ref9) {
        var env = _ref9.env;

        env.onTeardown(function () {
          return teardown = true;
        });
      }
    };

    var mobiledoc = build(function (_ref10) {
      var markupSection = _ref10.markupSection;
      var post = _ref10.post;
      var atom = _ref10.atom;
      return post([markupSection('p', [atom(atomName, '@bob', {})])]);
    });
    editor = new _mobiledocKit.Editor({ mobiledoc: mobiledoc, atoms: [atom] });
    editor.render(editorElement);

    assert.ok(!teardown, 'nothing torn down yet');

    editor.destroy();

    assert.ok(teardown, 'onTeardown hook called');
  });

  test('mutating the content of an atom does not trigger an update', function (assert) {
    var done = assert.async();

    var atomName = 'test-atom';

    var atom = {
      name: atomName,
      type: 'dom',
      render: function render() {
        return makeEl('the-atom');
      }
    };

    var mobiledoc = build(function (_ref11) {
      var markupSection = _ref11.markupSection;
      var post = _ref11.post;
      var atom = _ref11.atom;
      return post([markupSection('p', [atom(atomName, '@bob', {})])]);
    });
    editor = new _mobiledocKit.Editor({ mobiledoc: mobiledoc, atoms: [atom] });

    var updateTriggered = false;
    editor.on("update", function () {
      updateTriggered = true;
    });

    assert.hasNoElement('#editor #the-atom', 'precond - atom not rendered');
    editor.render(editorElement);

    $("#the-atom").html("updated");

    // ensure the mutations have had time to trigger
    // TODO - nicer way of waiting?
    setTimeout(function () {
      assert.ok(!updateTriggered);
      done();
    }, 100);
  });
});
define('tests/unit/editor/card-lifecycle-test', ['exports', '../../test-helpers', 'mobiledoc-kit'], function (exports, _testHelpers, _mobiledocKit) {
  'use strict';

  var editorElement = undefined,
      editor = undefined;

  var _module = _testHelpers['default'].module;
  var test = _testHelpers['default'].test;

  _module('Unit: Editor: Card Lifecycle', {
    beforeEach: function beforeEach() {
      editorElement = $('#editor')[0];
    },
    afterEach: function afterEach() {
      if (editor) {
        editor.destroy();
        editor = null;
      }
    }
  });

  function makeEl(id) {
    var el = document.createElement('div');
    el.id = id;
    return el;
  }

  function assertRenderArguments(assert, args, expected) {
    var env = args.env;
    var options = args.options;
    var payload = args.payload;

    assert.deepEqual(payload, expected.payload, 'correct payload');
    assert.deepEqual(options, expected.options, 'correct options');

    // basic env
    var name = env.name;
    var isInEditor = env.isInEditor;
    var onTeardown = env.onTeardown;

    assert.equal(name, expected.name, 'correct name');
    assert.equal(isInEditor, expected.isInEditor, 'correct isInEditor');
    assert.ok(!!onTeardown, 'has onTeardown');

    // editor env hooks
    var save = env.save;
    var cancel = env.cancel;
    var edit = env.edit;
    var remove = env.remove;

    assert.ok(!!save && !!cancel && !!edit && !!remove, 'has save, cancel, edit, remove hooks');

    // postModel
    var postModel = env.postModel;

    assert.ok(postModel && postModel === expected.postModel, 'correct postModel');
  }

  test('rendering a mobiledoc with card calls card#render', function (assert) {
    var payload = { foo: 'bar' };
    var cardOptions = { boo: 'baz' };
    var cardName = 'test-card';

    var renderArg = undefined;

    var card = {
      name: cardName,
      type: 'dom',
      render: function render(_renderArg) {
        renderArg = _renderArg;
      }
    };

    var mobiledoc = _testHelpers['default'].mobiledoc.build(function (_ref) {
      var post = _ref.post;
      var cardSection = _ref.cardSection;
      return post([cardSection('test-card', payload)]);
    });
    editor = new _mobiledocKit.Editor({ mobiledoc: mobiledoc, cards: [card], cardOptions: cardOptions });
    editor.render(editorElement);

    var expected = {
      name: cardName,
      payload: payload,
      options: cardOptions,
      isInEditor: true,
      postModel: editor.post.sections.head
    };
    assertRenderArguments(assert, renderArg, expected);
  });

  test('rendering a mobiledoc with card appends result of card#render', function (assert) {
    var cardName = 'test-card';

    var card = {
      name: cardName,
      type: 'dom',
      render: function render() {
        return makeEl('the-card');
      }
    };

    var mobiledoc = _testHelpers['default'].mobiledoc.build(function (_ref2) {
      var post = _ref2.post;
      var cardSection = _ref2.cardSection;
      return post([cardSection(cardName)]);
    });
    editor = new _mobiledocKit.Editor({ mobiledoc: mobiledoc, cards: [card] });
    assert.hasNoElement('#editor #the-card', 'precond - card not rendered');
    editor.render(editorElement);
    assert.hasElement('#editor #the-card');
  });

  test('returning wrong type from render throws', function (assert) {
    var cardName = 'test-card';

    var card = {
      name: cardName,
      type: 'dom',
      render: function render() {
        return 'string';
      }
    };

    var mobiledoc = _testHelpers['default'].mobiledoc.build(function (_ref3) {
      var post = _ref3.post;
      var cardSection = _ref3.cardSection;
      return post([cardSection(cardName)]);
    });
    editor = new _mobiledocKit.Editor({ mobiledoc: mobiledoc, cards: [card] });

    assert.throws(function () {
      editor.render(editorElement);
    }, new RegExp('Card "' + cardName + '" must render dom'));
  });

  test('returning undefined from render is ok', function (assert) {
    var cardName = 'test-card';

    var card = {
      name: cardName,
      type: 'dom',
      render: function render() {}
    };

    var mobiledoc = _testHelpers['default'].mobiledoc.build(function (_ref4) {
      var post = _ref4.post;
      var cardSection = _ref4.cardSection;
      return post([cardSection('test-card')]);
    });
    editor = new _mobiledocKit.Editor({ mobiledoc: mobiledoc, cards: [card] });
    editor.render(editorElement);
    assert.ok(true, 'no errors are thrown');
  });

  test('returning undefined from render is ok', function (assert) {
    var cardName = 'test-card';
    var currentMode = undefined;
    var editHook = undefined;

    var card = {
      name: cardName,
      type: 'dom',
      render: function render(_ref5) {
        var env = _ref5.env;

        currentMode = 'display';
        editHook = env.edit;
      },
      edit: function edit() {
        currentMode = 'edit';
      }
    };

    var mobiledoc = _testHelpers['default'].mobiledoc.build(function (_ref6) {
      var post = _ref6.post;
      var cardSection = _ref6.cardSection;
      return post([cardSection(cardName)]);
    });
    editor = new _mobiledocKit.Editor({ mobiledoc: mobiledoc, cards: [card] });
    editor.render(editorElement);

    assert.equal(currentMode, 'display', 'precond - display');
    editHook();
    assert.equal(currentMode, 'edit', 'edit mode, no errors when returning undefined');
  });

  test('rendering card with wrong type throws', function (assert) {
    var cardName = 'test-card';
    var card = {
      name: cardName,
      type: 'other',
      render: function render() {}
    };
    var mobiledoc = _testHelpers['default'].mobiledoc.build(function (_ref7) {
      var post = _ref7.post;
      var cardSection = _ref7.cardSection;
      return post([cardSection(cardName)]);
    });

    assert.throws(function () {
      editor = new _mobiledocKit.Editor({ mobiledoc: mobiledoc, cards: [card] });
      editor.render(editorElement);
    }, new RegExp('Card "' + cardName + '.* must define type'));
  });

  test('rendering card without render method throws', function (assert) {
    var cardName = 'test-card';
    var card = {
      name: cardName,
      type: 'dom'
    };
    var mobiledoc = _testHelpers['default'].mobiledoc.build(function (_ref8) {
      var post = _ref8.post;
      var cardSection = _ref8.cardSection;
      return post([cardSection(cardName)]);
    });

    assert.throws(function () {
      editor = new _mobiledocKit.Editor({ mobiledoc: mobiledoc, cards: [card] });
      editor.render(editorElement);
    }, new RegExp('Card "' + cardName + '.* must define.*render'));
  });

  test('card can call `env.edit` to render in edit mode', function (assert) {
    var payload = { foo: 'bar' };
    var cardOptions = { boo: 'baz' };
    var cardName = 'test-card';

    var editArg = undefined;
    var editHook = undefined;
    var currentMode = undefined;
    var displayId = 'the-display-card';
    var editId = 'the-edit-card';

    var card = {
      name: cardName,
      type: 'dom',
      render: function render(_renderArg) {
        currentMode = 'display';
        editHook = _renderArg.env.edit;
        return makeEl(displayId);
      },
      edit: function edit(_editArg) {
        currentMode = 'edit';
        editArg = _editArg;
        return makeEl(editId);
      }
    };

    var mobiledoc = _testHelpers['default'].mobiledoc.build(function (_ref9) {
      var post = _ref9.post;
      var cardSection = _ref9.cardSection;
      return post([cardSection(cardName, payload)]);
    });
    editor = new _mobiledocKit.Editor({ mobiledoc: mobiledoc, cards: [card], cardOptions: cardOptions });
    editor.render(editorElement);

    assert.hasElement('#editor #' + displayId, 'precond - display card');
    assert.hasNoElement('#editor #' + editId, 'precond - no edit card');
    assert.equal(currentMode, 'display');

    editHook();

    assert.equal(currentMode, 'edit');
    assert.hasNoElement('#editor #' + displayId, 'no display card');
    assert.hasElement('#editor #' + editId, 'renders edit card');

    var expected = {
      name: cardName,
      payload: payload,
      options: cardOptions,
      isInEditor: true,
      postModel: editor.post.sections.head
    };
    assertRenderArguments(assert, editArg, expected);
  });

  test('save hook updates payload when in display mode', function (assert) {
    var cardName = 'test-card';
    var saveHook = undefined;
    var postModel = undefined;

    var card = {
      name: cardName,
      type: 'dom',
      render: function render(_ref10) {
        var env = _ref10.env;

        saveHook = env.save;
        postModel = env.postModel;
      }
    };

    var mobiledoc = _testHelpers['default'].mobiledoc.build(function (_ref11) {
      var post = _ref11.post;
      var cardSection = _ref11.cardSection;
      return post([cardSection(cardName)]);
    });
    editor = new _mobiledocKit.Editor({ mobiledoc: mobiledoc, cards: [card] });
    editor.render(editorElement);

    var newPayload = { newPayload: true };
    saveHook(newPayload);
    assert.deepEqual(postModel.payload, newPayload, 'save updates payload when called without transition param');

    var otherNewPayload = { otherNewPayload: true };
    saveHook(otherNewPayload, false);
    assert.deepEqual(postModel.payload, otherNewPayload, 'save updates payload when called with transition=false');
  });

  test('save hook updates payload when in edit mode', function (assert) {
    var cardName = 'test-card';
    var saveHook = undefined;
    var editHook = undefined;
    var postModel = undefined;
    var currentMode = undefined;

    var card = {
      name: cardName,
      type: 'dom',
      render: function render(_ref12) {
        var env = _ref12.env;

        currentMode = 'display';
        editHook = env.edit;
        postModel = env.postModel;
      },
      edit: function edit(_ref13) {
        var env = _ref13.env;

        currentMode = 'edit';
        saveHook = env.save;
        postModel = env.postModel;
      }
    };

    var mobiledoc = _testHelpers['default'].mobiledoc.build(function (_ref14) {
      var post = _ref14.post;
      var cardSection = _ref14.cardSection;
      return post([cardSection(cardName)]);
    });
    editor = new _mobiledocKit.Editor({ mobiledoc: mobiledoc, cards: [card] });
    editor.render(editorElement);

    assert.equal(currentMode, 'display', 'precond - display mode');

    editHook();

    assert.equal(currentMode, 'edit', 'precond - edit mode');
    var newPayload = { newPayload: true };
    saveHook(newPayload, false);

    assert.equal(currentMode, 'edit', 'save with false does not transition');
    assert.deepEqual(postModel.payload, newPayload, 'updates payload');

    var otherNewPayload = { otherNewPayload: true };
    saveHook(otherNewPayload);
    assert.equal(currentMode, 'display', 'save hook transitions');
    assert.deepEqual(postModel.payload, otherNewPayload, 'updates payload');
  });

  test('#cancel hook changes from edit->display, does not change payload', function (assert) {
    var cardName = 'test-card';
    var cancelHook = undefined;
    var editHook = undefined;
    var postModel = undefined;
    var currentMode = undefined;
    var currentPayload = undefined;
    var originalPayload = { foo: 'bar' };

    var card = {
      name: cardName,
      type: 'dom',
      render: function render(_ref15) {
        var env = _ref15.env;
        var payload = _ref15.payload;

        currentMode = 'display';
        editHook = env.edit;
        postModel = env.postModel;
        currentPayload = payload;
      },
      edit: function edit(_ref16) {
        var env = _ref16.env;

        currentMode = 'edit';
        cancelHook = env.cancel;
        postModel = env.postModel;
      }
    };

    var mobiledoc = _testHelpers['default'].mobiledoc.build(function (_ref17) {
      var post = _ref17.post;
      var cardSection = _ref17.cardSection;
      return post([cardSection(cardName, originalPayload)]);
    });
    editor = new _mobiledocKit.Editor({ mobiledoc: mobiledoc, cards: [card] });
    editor.render(editorElement);

    assert.equal(currentMode, 'display', 'precond - display mode');

    editHook();

    assert.equal(currentMode, 'edit', 'precond - edit mode');

    cancelHook();

    assert.equal(currentMode, 'display', 'cancel hook transitions');
    assert.deepEqual(currentPayload, originalPayload, 'payload is the same');
  });

  test('#remove hook destroys card when in display mode, removes it from DOM and AT', function (assert) {
    var cardName = 'test-card';
    var removeHook = undefined;
    var elId = 'the-card';

    var card = {
      name: cardName,
      type: 'dom',
      render: function render(_ref18) {
        var env = _ref18.env;

        removeHook = env.remove;
        return makeEl(elId);
      }
    };

    var mobiledoc = _testHelpers['default'].mobiledoc.build(function (_ref19) {
      var post = _ref19.post;
      var cardSection = _ref19.cardSection;
      return post([cardSection(cardName)]);
    });
    editor = new _mobiledocKit.Editor({ mobiledoc: mobiledoc, cards: [card] });
    editor.render(editorElement);

    assert.hasElement('#editor #' + elId, 'precond - renders card');
    assert.ok(!!editor.post.sections.head, 'post has head section');

    removeHook();

    assert.hasNoElement('#editor #' + elId, 'removes rendered card');
    assert.ok(!editor.post.sections.head, 'post has no head section');
  });

  test('#remove hook destroys card when in edit mode, removes it from DOM and AT', function (assert) {
    var cardName = 'test-card';
    var removeHook = undefined;
    var editHook = undefined;
    var currentMode = undefined;
    var displayId = 'the-display-card';
    var editId = 'the-edit-card';

    var card = {
      name: cardName,
      type: 'dom',
      render: function render(_ref20) {
        var env = _ref20.env;

        currentMode = 'display';
        editHook = env.edit;
        return makeEl(displayId);
      },
      edit: function edit(_ref21) {
        var env = _ref21.env;

        currentMode = 'edit';
        removeHook = env.remove;
        return makeEl(editId);
      }
    };

    var mobiledoc = _testHelpers['default'].mobiledoc.build(function (_ref22) {
      var post = _ref22.post;
      var cardSection = _ref22.cardSection;
      return post([cardSection(cardName)]);
    });
    editor = new _mobiledocKit.Editor({ mobiledoc: mobiledoc, cards: [card] });
    editor.render(editorElement);

    assert.equal(currentMode, 'display', 'precond - display mode');
    assert.hasElement('#editor #' + displayId, 'precond - renders card in display');

    editHook();

    assert.equal(currentMode, 'edit', 'precond - edit mode');

    assert.hasElement('#editor #' + editId, 'precond - renders card in edit');
    assert.hasNoElement('#editor #' + displayId, 'display card is removed');
    assert.ok(!!editor.post.sections.head, 'post has head section');

    removeHook();

    assert.hasNoElement('#editor #' + editId, 'removes rendered card');
    assert.hasNoElement('#editor #' + displayId, 'display card is not present');
    assert.ok(!editor.post.sections.head, 'post has no head section');
  });

  test('rendering unknown card calls #unknownCardHandler', function (assert) {
    var payload = { foo: 'bar' };
    var cardOptions = { boo: 'baz' };
    var cardName = 'test-card';

    var unknownArg = undefined;
    var unknownCardHandler = function unknownCardHandler(_unknownArg) {
      unknownArg = _unknownArg;
    };

    var mobiledoc = _testHelpers['default'].mobiledoc.build(function (_ref23) {
      var post = _ref23.post;
      var cardSection = _ref23.cardSection;
      return post([cardSection(cardName, payload)]);
    });

    editor = new _mobiledocKit.Editor({ mobiledoc: mobiledoc, unknownCardHandler: unknownCardHandler, cardOptions: cardOptions });
    editor.render(editorElement);

    var expected = {
      name: cardName,
      payload: payload,
      options: cardOptions,
      isInEditor: true,
      postModel: editor.post.sections.head
    };
    assertRenderArguments(assert, unknownArg, expected);
  });

  test('rendering unknown card without unknownCardHandler throws', function (assert) {
    var cardName = 'test-card';

    var mobiledoc = _testHelpers['default'].mobiledoc.build(function (_ref24) {
      var post = _ref24.post;
      var cardSection = _ref24.cardSection;
      return post([cardSection(cardName)]);
    });

    editor = new _mobiledocKit.Editor({ mobiledoc: mobiledoc, unknownCardHandler: undefined });

    assert.throws(function () {
      editor.render(editorElement);
    }, new RegExp('Unknown card "' + cardName + '".*no unknownCardHandler'));
  });

  test('onTeardown hook is called when moving from display->edit and back', function (assert) {
    var cardName = 'test-card';

    var editHook = undefined;
    var saveHook = undefined;
    var currentMode = undefined;
    var teardown = undefined;

    var card = {
      name: cardName,
      type: 'dom',
      render: function render(_ref25) {
        var env = _ref25.env;

        currentMode = 'display';
        editHook = env.edit;
        env.onTeardown(function () {
          return teardown = 'display';
        });
      },
      edit: function edit(_ref26) {
        var env = _ref26.env;

        currentMode = 'edit';
        saveHook = env.save;
        env.onTeardown(function () {
          return teardown = 'edit';
        });
      }
    };

    var mobiledoc = _testHelpers['default'].mobiledoc.build(function (_ref27) {
      var post = _ref27.post;
      var cardSection = _ref27.cardSection;
      return post([cardSection(cardName)]);
    });
    editor = new _mobiledocKit.Editor({ mobiledoc: mobiledoc, cards: [card] });
    editor.render(editorElement);

    assert.equal(currentMode, 'display', 'precond - display mode');
    assert.ok(!teardown, 'no teardown called yet');

    editHook();

    assert.equal(currentMode, 'edit', 'edit mode');
    assert.equal(teardown, 'display', 'display onTeardown hook called');

    saveHook();

    assert.equal(currentMode, 'display', 'display mode');
    assert.equal(teardown, 'edit', 'edit onTeardown hook called');
  });

  test('onTeardown hook is called when card removes itself', function (assert) {
    var cardName = 'test-card';

    var removeHook = undefined;
    var teardown = undefined;

    var card = {
      name: cardName,
      type: 'dom',
      render: function render(_ref28) {
        var env = _ref28.env;

        removeHook = env.remove;
        env.onTeardown(function () {
          return teardown = true;
        });
      }
    };

    var mobiledoc = _testHelpers['default'].mobiledoc.build(function (_ref29) {
      var post = _ref29.post;
      var cardSection = _ref29.cardSection;
      return post([cardSection(cardName)]);
    });
    editor = new _mobiledocKit.Editor({ mobiledoc: mobiledoc, cards: [card] });
    editor.render(editorElement);

    assert.ok(!teardown, 'nothing torn down yet');

    removeHook();

    assert.ok(teardown, 'onTeardown hook called');
  });

  test('onTeardown hook is called when editor is destroyed', function (assert) {
    var cardName = 'test-card';

    var teardown = undefined;

    var card = {
      name: cardName,
      type: 'dom',
      render: function render(_ref30) {
        var env = _ref30.env;

        env.onTeardown(function () {
          return teardown = true;
        });
      }
    };

    var mobiledoc = _testHelpers['default'].mobiledoc.build(function (_ref31) {
      var post = _ref31.post;
      var cardSection = _ref31.cardSection;
      return post([cardSection(cardName)]);
    });
    editor = new _mobiledocKit.Editor({ mobiledoc: mobiledoc, cards: [card] });
    editor.render(editorElement);

    assert.ok(!teardown, 'nothing torn down yet');

    editor.destroy();

    assert.ok(teardown, 'onTeardown hook called');
  });
});
define('tests/unit/editor/editor-events-test', ['exports', '../../test-helpers', 'mobiledoc-kit'], function (exports, _testHelpers, _mobiledocKit) {
  'use strict';

  var _module = _testHelpers['default'].module;
  var test = _testHelpers['default'].test;

  var editor = undefined,
      editorElement = undefined;

  var mobiledoc = _testHelpers['default'].mobiledoc.build(function (_ref) {
    var post = _ref.post;
    var markupSection = _ref.markupSection;
    var marker = _ref.marker;

    return post([markupSection('p', [marker('this is the editor')])]);
  });

  _module('Unit: Editor: events and lifecycle callbacks', {
    beforeEach: function beforeEach() {
      editorElement = $('#editor')[0];
      editor = new _mobiledocKit.Editor({ mobiledoc: mobiledoc });
      editor.render(editorElement);
    },

    afterEach: function afterEach() {
      if (editor) {
        editor.destroy();
        editor = null;
      }
    }
  });

  test('"cursorChanged" callbacks fired on mouseup', function (assert) {
    var done = assert.async();

    var cursorChanged = 0;
    editor.cursorDidChange(function () {
      return cursorChanged++;
    });
    var textNode = $('#editor p')[0].childNodes[0];
    _testHelpers['default'].dom.moveCursorTo(textNode, 0);

    assert.equal(cursorChanged, 0, 'precond');

    _testHelpers['default'].dom.triggerEvent(document, 'mouseup');

    setTimeout(function () {
      assert.equal(cursorChanged, 1, 'cursor changed');
      cursorChanged = 0;

      _testHelpers['default'].dom.moveCursorTo(textNode, textNode.textContent.length);
      _testHelpers['default'].dom.triggerEvent(document, 'mouseup');

      setTimeout(function () {
        assert.equal(cursorChanged, 1, 'cursor changed again');
        done();
      });
    });
  });

  test('"cursorChanged" callback called after hitting arrow key', function (assert) {
    var cursorChanged = 0;
    editor.cursorDidChange(function () {
      return cursorChanged++;
    });
    var textNode = $('#editor p')[0].childNodes[0];
    _testHelpers['default'].dom.moveCursorTo(textNode, 0);

    assert.equal(cursorChanged, 0, 'precond');
    _testHelpers['default'].dom.triggerRightArrowKey(editor);
    assert.equal(cursorChanged, 1, 'cursor changed');
  });
});
define('tests/unit/editor/editor-test', ['exports', 'mobiledoc-kit/editor/editor', 'mobiledoc-kit/utils/dom-utils', 'mobiledoc-kit/renderers/mobiledoc/0-2', 'mobiledoc-kit/utils/cursor/range', '../../test-helpers'], function (exports, _mobiledocKitEditorEditor, _mobiledocKitUtilsDomUtils, _mobiledocKitRenderersMobiledoc02, _mobiledocKitUtilsCursorRange, _testHelpers) {
  'use strict';

  var _module = _testHelpers['default'].module;
  var test = _testHelpers['default'].test;

  var editorElement = undefined,
      editor = undefined;

  _module('Unit: Editor', {
    beforeEach: function beforeEach() {
      editorElement = $('#editor')[0];
    },

    afterEach: function afterEach() {
      if (editor) {
        editor.destroy();
      }
    }
  });

  test('can render an editor via dom node reference', function (assert) {
    editor = new _mobiledocKitEditorEditor['default']();
    editor.render(editorElement);
    assert.equal(editor.element, editorElement);
    assert.ok(editor.post);
  });

  test('creating an editor with DOM node throws', function (assert) {
    assert.throws(function () {
      editor = new _mobiledocKitEditorEditor['default'](document.createElement('div'));
    }, /accepts an options object/);
  });

  test('rendering an editor without a class name adds appropriate class', function (assert) {
    editorElement.className = '';

    editor = new _mobiledocKitEditorEditor['default']();
    editor.render(editorElement);
    assert.equal(editor.element.className, _mobiledocKitEditorEditor.EDITOR_ELEMENT_CLASS_NAME);
  });

  test('rendering an editor adds EDITOR_ELEMENT_CLASS_NAME if not there', function (assert) {
    editorElement.className = 'abc def';

    editor = new _mobiledocKitEditorEditor['default']();
    editor.render(editorElement);
    var hasClass = function hasClass(className) {
      return editor.element.classList.contains(className);
    };
    assert.ok(hasClass(_mobiledocKitEditorEditor.EDITOR_ELEMENT_CLASS_NAME), 'has editor el class name');
    assert.ok(hasClass('abc') && hasClass('def'), 'preserves existing class names');
  });

  test('editor fires lifecycle hooks', function (assert) {
    assert.expect(4);
    var didCallUpdatePost = undefined,
        didCallWillRender = undefined,
        didCallDidRender = undefined;
    editor = new _mobiledocKitEditorEditor['default']();
    editor.didUpdatePost(function (postEditor) {
      assert.ok(postEditor, 'Post editor provided');
      assert.ok(!didCallWillRender && !didCallDidRender, 'didUpdatePost called before render hooks');
      didCallUpdatePost = true;
    });
    editor.willRender(function () {
      assert.ok(didCallUpdatePost && !didCallDidRender, 'willRender called between didUpdatePost, didRender');
      didCallWillRender = true;
    });
    editor.didRender(function () {
      assert.ok(didCallUpdatePost && didCallWillRender, 'didRender called last');
      didCallDidRender = true;
    });
    editor.render(editorElement);
  });

  test('editor fires lifecycle hooks for edit', function (assert) {
    assert.expect(4);
    var mobiledoc = _testHelpers['default'].mobiledoc.build(function (_ref) {
      var post = _ref.post;
      var markupSection = _ref.markupSection;

      return post([markupSection()]);
    });
    editor = new _mobiledocKitEditorEditor['default']({ mobiledoc: mobiledoc });
    editor.render(editorElement);

    var didCallUpdatePost = undefined,
        didCallWillRender = undefined,
        didCallDidRender = undefined;
    editor.didUpdatePost(function (postEditor) {
      assert.ok(postEditor, 'Post editor provided');
      assert.ok(!didCallWillRender && !didCallDidRender, 'didUpdatePost called before render hooks');
      didCallUpdatePost = true;
    });
    editor.willRender(function () {
      assert.ok(didCallUpdatePost && !didCallDidRender, 'willRender called between didUpdatePost, didRender');
      didCallWillRender = true;
    });
    editor.didRender(function () {
      assert.ok(didCallUpdatePost && didCallWillRender, 'didRender called last');
      didCallDidRender = true;
    });

    editor.run(function (postEditor) {
      postEditor.removeSection(editor.post.sections.head);
    });
  });

  test('editor fires lifecycle hooks for noop edit', function (assert) {
    assert.expect(1);
    editor = new _mobiledocKitEditorEditor['default']();
    editor.render(editorElement);

    editor.didUpdatePost(function (postEditor) {
      assert.ok(postEditor, 'Post editor provided');
    });
    editor.willRender(function () {
      assert.ok(false, 'willRender should not be called');
    });
    editor.didRender(function () {
      assert.ok(false, 'didRender should not be called');
    });

    editor.run(function () {});
  });

  test('editor fires update event', function (assert) {
    assert.expect(2);
    var done = assert.async();

    editor = new _mobiledocKitEditorEditor['default']();
    editor.render(editorElement);
    editor.on('update', function (data) {
      assert.equal(this, editor);
      assert.equal(data.index, 99);
      done();
    });
    editor.trigger('update', { index: 99 });
  });

  test('editor parses and renders mobiledoc format', function (assert) {
    var mobiledoc = _testHelpers['default'].mobiledoc.build(function (_ref2) {
      var post = _ref2.post;
      var markupSection = _ref2.markupSection;
      var marker = _ref2.marker;

      return post([markupSection('p', [marker('hello world')])]);
    });
    editorElement.innerHTML = '<p>something here</p>';
    editor = new _mobiledocKitEditorEditor['default']({ mobiledoc: mobiledoc });
    editor.render(editorElement);

    assert.ok(editor.mobiledoc, 'editor has mobiledoc');
    assert.equal(editorElement.innerHTML, '<p>hello world</p>');

    assert.deepEqual(editor.serialize(), mobiledoc, 'serialized editor === mobiledoc');
  });

  test('#serialize serializes to MOBILEDOC_VERSION by default', function (assert) {
    var mobiledoc2 = _testHelpers['default'].mobiledoc.build(function (_ref3) {
      var post = _ref3.post;
      var markupSection = _ref3.markupSection;
      var marker = _ref3.marker;

      return post([markupSection('p', [marker('abc')])]);
    }, '0.2.0');
    var mobiledoc3 = _testHelpers['default'].mobiledoc.build(function (_ref4) {
      var post = _ref4.post;
      var markupSection = _ref4.markupSection;
      var marker = _ref4.marker;

      return post([markupSection('p', [marker('abc')])]);
    }, '0.3.0');
    editor = _testHelpers['default'].mobiledoc.renderInto(editorElement, function (_ref5) {
      var post = _ref5.post;
      var markupSection = _ref5.markupSection;
      var marker = _ref5.marker;

      return post([markupSection('p', [marker('abc')])]);
    });

    assert.deepEqual(editor.serialize('0.2.0'), mobiledoc2, 'serializes 0.2.0');
    assert.deepEqual(editor.serialize('0.3.0'), mobiledoc3, 'serializes 0.3.0');

    assert.throws(function () {
      return editor.serialize('unknown');
    }, /Unknown version/);
  });

  test('editor parses and renders html', function (assert) {
    editorElement.innerHTML = '<p>something here</p>';
    editor = new _mobiledocKitEditorEditor['default']({ html: '<p>hello world</p>' });
    editor.render(editorElement);

    assert.equal(editorElement.innerHTML, '<p>hello world</p>');
  });

  test('editor parses and renders DOM', function (assert) {
    editorElement.innerHTML = '<p>something here</p>';
    editor = new _mobiledocKitEditorEditor['default']({ html: $('<p>hello world</p>')[0] });
    editor.render(editorElement);

    assert.equal(editorElement.innerHTML, '<p>hello world</p>');
  });

  test('#detectMarkupInRange not found', function (assert) {
    var mobiledoc = {
      version: _mobiledocKitRenderersMobiledoc02.MOBILEDOC_VERSION,
      sections: [[], [[1, (0, _mobiledocKitUtilsDomUtils.normalizeTagName)('p'), [[[], 0, 'hello world']]]]]
    };
    editor = new _mobiledocKitEditorEditor['default']({ mobiledoc: mobiledoc });
    editor.render(editorElement);

    var section = editor.post.sections.head;
    var range = _mobiledocKitUtilsCursorRange['default'].create(section, 0, section, section.text.length);
    var markup = editor.detectMarkupInRange(range, 'strong');
    assert.ok(!markup, 'selection is not strong');
  });

  test('#detectMarkupInRange matching bounds of marker', function (assert) {
    var mobiledoc = {
      version: _mobiledocKitRenderersMobiledoc02.MOBILEDOC_VERSION,
      sections: [[['strong']], [[1, (0, _mobiledocKitUtilsDomUtils.normalizeTagName)('p'), [[[0], 1, 'hello world']]]]]
    };
    editor = new _mobiledocKitEditorEditor['default']({ mobiledoc: mobiledoc });
    editor.render(editorElement);

    var section = editor.post.sections.head;
    var range = _mobiledocKitUtilsCursorRange['default'].create(section, 0, section, section.text.length);
    var markup = editor.detectMarkupInRange(range, 'strong');
    assert.ok(markup, 'selection has markup');
    assert.equal(markup.tagName, 'strong', 'detected markup is strong');
  });

  test('useful error message when given invalid mobiledoc', function (assert) {
    var badMobiledoc = {
      version: _mobiledocKitRenderersMobiledoc02.MOBILEDOC_VERSION,
      sections: [[], ["incorrect"]]
    };
    assert.throws(function () {
      new _mobiledocKitEditorEditor['default']({ mobiledoc: badMobiledoc }); // jshint ignore:line
    }, /unable to parse.*mobiledoc/i);
  });

  test('useful error message when given bad version of mobiledoc', function (assert) {
    var verybadMobiledoc = "not mobiledoc";
    assert.throws(function () {
      new _mobiledocKitEditorEditor['default']({ mobiledoc: verybadMobiledoc }); // jshint ignore:line
    }, /Unknown version of mobiledoc parser requested/i);
  });

  test('activeSections of a rendered blank mobiledoc is an empty array', function (assert) {
    var mobiledoc = {
      version: _mobiledocKitRenderersMobiledoc02.MOBILEDOC_VERSION,
      sections: [[], []]
    };
    editor = new _mobiledocKitEditorEditor['default']({ mobiledoc: mobiledoc });
    editor.render(editorElement);

    assert.equal(0, editor.activeSections.length, 'empty activeSections');
  });

  test('editor.cursor.hasCursor() is false before rendering', function (assert) {
    var mobiledoc = _testHelpers['default'].mobiledoc.build(function (_ref6) {
      var post = _ref6.post;
      return post();
    });
    editor = new _mobiledocKitEditorEditor['default']({ mobiledoc: mobiledoc });

    assert.ok(!editor.cursor.hasCursor(), 'no cursor before rendering');

    _testHelpers['default'].dom.moveCursorTo(editorElement, 0);

    assert.ok(!editor.cursor.hasCursor(), 'no cursor before rendering, even when selection exists');
  });

  test('#destroy clears selection if it has one', function (assert) {
    var mobiledoc = _testHelpers['default'].mobiledoc.build(function (_ref7) {
      var post = _ref7.post;
      return post();
    });
    editor = new _mobiledocKitEditorEditor['default']({ mobiledoc: mobiledoc });
    editor.render(editorElement);

    _testHelpers['default'].dom.moveCursorTo(editorElement, 0);
    assert.ok(editor.cursor.hasCursor(), 'precond - has cursor');

    editor.destroy();

    assert.equal(window.getSelection().rangeCount, 0, 'selection is cleared');
  });

  test('#destroy does not clear selection if it is outside the editor element', function (assert) {
    var mobiledoc = _testHelpers['default'].mobiledoc.build(function (_ref8) {
      var post = _ref8.post;
      return post();
    });
    editor = new _mobiledocKitEditorEditor['default']({ mobiledoc: mobiledoc });
    editor.render(editorElement);

    _testHelpers['default'].dom.moveCursorTo($('#qunit-fixture')[0], 0);
    assert.ok(!editor.cursor.hasCursor(), 'precond - has no cursor');
    assert.equal(window.getSelection().rangeCount, 1, 'precond - has selection');

    editor.destroy();

    assert.equal(window.getSelection().rangeCount, 1, 'selection is not cleared');
  });

  test('editor parses HTML post using parser plugins', function (assert) {
    var seenTagNames = [];
    var parserPlugin = function parserPlugin(element) {
      seenTagNames.push(element.tagName);
    };
    var html = '<p><textarea></textarea><img></p>';
    var editor = new _mobiledocKitEditorEditor['default']({ html: html, parserPlugins: [parserPlugin] });
    assert.ok(!!editor.post, 'editor loads post');

    assert.deepEqual(seenTagNames, ['TEXTAREA', 'IMG']);
  });
});
define('tests/unit/editor/key-commands-test', ['exports', 'mobiledoc-kit/editor/key-commands', 'mobiledoc-kit/utils/key', 'mobiledoc-kit/utils/keycodes', '../../test-helpers'], function (exports, _mobiledocKitEditorKeyCommands, _mobiledocKitUtilsKey, _mobiledocKitUtilsKeycodes, _testHelpers) {
  'use strict';

  var _module = _testHelpers['default'].module;
  var test = _testHelpers['default'].test;

  _module('Unit: Editor key commands');

  test('leaves modifier, code and run in place if they exist', function (assert) {
    var fn = function fn() {};

    var _buildKeyCommand = (0, _mobiledocKitEditorKeyCommands.buildKeyCommand)({
      code: _mobiledocKitUtilsKeycodes['default'].ENTER,
      modifier: _mobiledocKitUtilsKey.MODIFIERS.META,
      run: fn
    });

    var modifier = _buildKeyCommand.modifier;
    var code = _buildKeyCommand.code;
    var run = _buildKeyCommand.run;

    assert.equal(modifier, _mobiledocKitUtilsKey.MODIFIERS.META, 'keeps modifier');
    assert.equal(code, _mobiledocKitUtilsKeycodes['default'].ENTER, 'keeps code');
    assert.equal(run, fn, 'keeps run');
  });

  test('translates MODIFIER+CHARACTER string to modifierMask and code', function (assert) {
    var _buildKeyCommand2 = (0, _mobiledocKitEditorKeyCommands.buildKeyCommand)({ str: 'meta+k' });

    var modifierMask = _buildKeyCommand2.modifierMask;
    var code = _buildKeyCommand2.code;

    assert.equal(modifierMask, (0, _mobiledocKitUtilsKey.modifierMask)({ metaKey: true }), 'calculates correct modifierMask');
    assert.equal(code, 75, 'translates string to code');
  });

  test('translates modifier+character string to modifierMask and code', function (assert) {
    var _buildKeyCommand3 = (0, _mobiledocKitEditorKeyCommands.buildKeyCommand)({ str: 'META+K' });

    var modifierMask = _buildKeyCommand3.modifierMask;
    var code = _buildKeyCommand3.code;

    assert.equal(modifierMask, (0, _mobiledocKitUtilsKey.modifierMask)({ metaKey: true }), 'calculates correct modifierMask');
    assert.equal(code, 75, 'translates string to code');
  });

  test('translates multiple modifiers to modifierMask', function (assert) {
    var _buildKeyCommand4 = (0, _mobiledocKitEditorKeyCommands.buildKeyCommand)({ str: 'META+SHIFT+K' });

    var modifierMask = _buildKeyCommand4.modifierMask;
    var code = _buildKeyCommand4.code;

    assert.equal(modifierMask, (0, _mobiledocKitUtilsKey.modifierMask)({ metaKey: true, shiftKey: true }), 'calculates correct modifierMask');
    assert.equal(code, 75, 'translates string to code');
  });

  test('translates uppercase character string to code', function (assert) {
    var _buildKeyCommand5 = (0, _mobiledocKitEditorKeyCommands.buildKeyCommand)({ str: 'K' });

    var modifierMask = _buildKeyCommand5.modifierMask;
    var code = _buildKeyCommand5.code;

    assert.equal(modifierMask, 0, 'no modifier given');
    assert.equal(code, 75, 'translates string to code');
  });

  test('translates lowercase character string to code', function (assert) {
    var _buildKeyCommand6 = (0, _mobiledocKitEditorKeyCommands.buildKeyCommand)({ str: 'k' });

    var modifier = _buildKeyCommand6.modifier;
    var code = _buildKeyCommand6.code;

    assert.equal(modifier, undefined, 'no modifier given');
    assert.equal(code, 75, 'translates string to code');
  });

  test('throws when given invalid modifier', function (assert) {
    assert.throws(function () {
      (0, _mobiledocKitEditorKeyCommands.buildKeyCommand)({ str: 'MEAT+K' });
    }, /No modifier named.*MEAT.*/);
  });

  test('throws when given `modifier` property (deprecation)', function (assert) {
    assert.throws(function () {
      (0, _mobiledocKitEditorKeyCommands.buildKeyCommand)({ str: 'K', modifier: _mobiledocKitUtilsKey.MODIFIERS.META });
    }, /Key commands no longer use.*modifier.* property/);
  });

  test('throws when given str with too many characters', function (assert) {
    assert.throws(function () {
      (0, _mobiledocKitEditorKeyCommands.buildKeyCommand)({ str: 'abc' });
    }, /Only 1 character/);
  });

  test('translates uppercase special key names to codes', function (assert) {
    Object.keys(_mobiledocKitUtilsKey.SPECIAL_KEYS).forEach(function (name) {
      var _buildKeyCommand7 = (0, _mobiledocKitEditorKeyCommands.buildKeyCommand)({ str: name.toUpperCase() });

      var code = _buildKeyCommand7.code;

      assert.equal(code, _mobiledocKitUtilsKey.SPECIAL_KEYS[name], 'translates ' + name + ' string to code');
    });
  });

  test('translates lowercase special key names to codes', function (assert) {
    Object.keys(_mobiledocKitUtilsKey.SPECIAL_KEYS).forEach(function (name) {
      var _buildKeyCommand8 = (0, _mobiledocKitEditorKeyCommands.buildKeyCommand)({ str: name.toLowerCase() });

      var code = _buildKeyCommand8.code;

      assert.equal(code, _mobiledocKitUtilsKey.SPECIAL_KEYS[name], 'translates ' + name + ' string to code');
    });
  });

  test('`findKeyCommands` matches modifiers exactly', function (assert) {
    var cmdK = (0, _mobiledocKitEditorKeyCommands.buildKeyCommand)({
      str: 'META+K'
    });
    var cmdShiftK = (0, _mobiledocKitEditorKeyCommands.buildKeyCommand)({
      str: 'META+SHIFT+K'
    });
    var commands = [cmdK, cmdShiftK];

    var element = null;
    var cmdKEvent = _testHelpers['default'].dom.createMockEvent('keydown', element, {
      keyCode: 75,
      metaKey: true
    });
    var cmdShiftKEvent = _testHelpers['default'].dom.createMockEvent('keydown', element, {
      keyCode: 75,
      metaKey: true,
      shiftKey: true
    });

    var found = (0, _mobiledocKitEditorKeyCommands.findKeyCommands)(commands, cmdKEvent);
    assert.ok(found.length && found[0] === cmdK, 'finds cmd-K command from cmd-k event');

    found = (0, _mobiledocKitEditorKeyCommands.findKeyCommands)(commands, cmdShiftKEvent);
    assert.ok(found.length && found[0] === cmdShiftK, 'finds cmd-shift-K command from cmd-shift-k event');
  });
});
define('tests/unit/editor/post-test', ['exports', 'mobiledoc-kit/renderers/editor-dom', 'mobiledoc-kit/models/render-tree', 'mobiledoc-kit/editor/post', 'mobiledoc-kit', '../../test-helpers', 'mobiledoc-kit/utils/key', 'mobiledoc-kit/models/post-node-builder', 'mobiledoc-kit/utils/cursor/range', 'mobiledoc-kit/utils/cursor/position', 'mobiledoc-kit/utils/selection-utils', '../../helpers/browsers'], function (exports, _mobiledocKitRenderersEditorDom, _mobiledocKitModelsRenderTree, _mobiledocKitEditorPost, _mobiledocKit, _testHelpers, _mobiledocKitUtilsKey, _mobiledocKitModelsPostNodeBuilder, _mobiledocKitUtilsCursorRange, _mobiledocKitUtilsCursorPosition, _mobiledocKitUtilsSelectionUtils, _helpersBrowsers) {
  'use strict';

  var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

  var FORWARD = _mobiledocKitUtilsKey.DIRECTION.FORWARD;
  var _module = _testHelpers['default'].module;
  var test = _testHelpers['default'].test;

  var editor = undefined,
      editorElement = undefined;

  var builder = undefined,
      postEditor = undefined,
      mockEditor = undefined;

  function getSection(sectionIndex) {
    return editor.post.sections.objectAt(sectionIndex);
  }

  function getMarker(sectionIndex, markerIndex) {
    return getSection(sectionIndex).markers.objectAt(markerIndex);
  }

  function postEditorWithMobiledoc(treeFn) {
    var mobiledoc = _testHelpers['default'].mobiledoc.build(treeFn);
    editor = new _mobiledocKit.Editor({ mobiledoc: mobiledoc });
    editor.render(editorElement);
    return new _mobiledocKitEditorPost['default'](editor);
  }

  function renderBuiltAbstract(post) {
    mockEditor.post = post;
    var unknownCardHandler = function unknownCardHandler() {};
    var unknownAtomHandler = function unknownAtomHandler() {};
    var renderer = new _mobiledocKitRenderersEditorDom['default'](mockEditor, [], [], unknownCardHandler, unknownAtomHandler);
    var renderTree = new _mobiledocKitModelsRenderTree['default'](post);
    renderer.render(renderTree);
    return mockEditor;
  }

  var renderedRange = undefined;
  function buildEditorWithMobiledoc(builderFn) {
    var mobiledoc = _testHelpers['default'].mobiledoc.build(builderFn);
    var unknownCardHandler = function unknownCardHandler() {};
    var unknownAtomHandler = function unknownAtomHandler() {};
    editor = new _mobiledocKit.Editor({ mobiledoc: mobiledoc, unknownCardHandler: unknownCardHandler, unknownAtomHandler: unknownAtomHandler });
    editor.render(editorElement);
    editor.renderRange = function () {
      renderedRange = this.range;
    };
    return editor;
  }

  _module('Unit: PostEditor with mobiledoc', {
    beforeEach: function beforeEach() {
      renderedRange = null;
      editorElement = $('#editor')[0];
    },

    afterEach: function afterEach() {
      renderedRange = null;
      if (editor) {
        editor.destroy();
        editor = null;
      }
    }
  });

  test('#deleteFrom in middle of marker deletes char before offset', function (assert) {
    var postEditor = postEditorWithMobiledoc(function (_ref) {
      var post = _ref.post;
      var markupSection = _ref.markupSection;
      var marker = _ref.marker;
      return post([markupSection('P', [marker('abc def')])]);
    });

    var position = new _mobiledocKitUtilsCursorPosition['default'](getSection(0), 4);
    var nextPosition = postEditor.deleteFrom(position);
    postEditor.complete();

    assert.equal(getMarker(0, 0).value, 'abcdef');
    assert.ok(nextPosition.section === getSection(0), 'correct position section');
    assert.equal(nextPosition.offset, 3, 'correct position offset');
  });

  test('#deleteFrom (forward) in middle of marker deletes char after offset', function (assert) {
    var postEditor = postEditorWithMobiledoc(function (_ref2) {
      var post = _ref2.post;
      var markupSection = _ref2.markupSection;
      var marker = _ref2.marker;
      return post([markupSection('p', [marker('abc def')])]);
    });

    var position = new _mobiledocKitUtilsCursorPosition['default'](getSection(0), 3);
    var nextPosition = postEditor.deleteFrom(position, FORWARD);
    postEditor.complete();

    assert.equal(getMarker(0, 0).value, 'abcdef');
    assert.ok(nextPosition.section === getSection(0), 'correct position section');
    assert.equal(nextPosition.offset, 3, 'correct position offset');
  });

  test('#deleteFrom offset 0 joins section with previous if first marker', function (assert) {
    var postEditor = postEditorWithMobiledoc(function (_ref3) {
      var post = _ref3.post;
      var markupSection = _ref3.markupSection;
      var marker = _ref3.marker;
      return post([markupSection('P', [marker('abc')]), markupSection('P', [marker('def')])]);
    });

    var position = new _mobiledocKitUtilsCursorPosition['default'](getSection(1), 0);
    var nextPosition = postEditor.deleteFrom(position);
    postEditor.complete();

    assert.equal(editor.post.sections.length, 1, 'sections joined');
    assert.equal(getSection(0).markers.length, 1, 'joined section has 1 marker');
    assert.equal(getSection(0).text, 'abcdef', 'text is joined');
    assert.ok(nextPosition.section === getSection(0), 'correct position section');
    assert.equal(nextPosition.offset, 'abc'.length, 'correct position offset');
  });

  test('#deleteFrom (FORWARD) end of marker joins section with next if last marker', function (assert) {
    var postEditor = postEditorWithMobiledoc(function (_ref4) {
      var post = _ref4.post;
      var markupSection = _ref4.markupSection;
      var marker = _ref4.marker;
      return post([markupSection('P', [marker('abc')]), markupSection('P', [marker('def')])]);
    });

    var section = getSection(0);
    var position = new _mobiledocKitUtilsCursorPosition['default'](section, 3);
    var nextPosition = postEditor.deleteFrom(position, FORWARD);
    postEditor.complete();

    assert.equal(editor.post.sections.length, 1, 'sections joined');
    assert.equal(getSection(0).markers.length, 1, 'joined section has 1 marker');
    assert.equal(getSection(0).text, 'abcdef', 'text is joined');
    assert.ok(nextPosition.section === getSection(0), 'correct position section');
    assert.equal(nextPosition.offset, 'abc'.length, 'correct position offset');
  });

  test('#deleteFrom offset 0 deletes last character of previous marker when there is one', function (assert) {
    var postEditor = postEditorWithMobiledoc(function (_ref5) {
      var post = _ref5.post;
      var markupSection = _ref5.markupSection;
      var marker = _ref5.marker;
      return post([markupSection('P', [marker('abc'), marker('def')])]);
    });

    var position = new _mobiledocKitUtilsCursorPosition['default'](getSection(0), 3);
    var nextPosition = postEditor.deleteFrom(position);
    postEditor.complete();

    assert.equal(getSection(0).text, 'abdef', 'text is deleted');
    assert.ok(nextPosition.section === getSection(0), 'correct position section');
    assert.equal(nextPosition.offset, 'ab'.length, 'correct position offset');
  });

  test('#deleteFrom (FORWARD) end of marker deletes first character of next marker when there is one', function (assert) {
    var postEditor = postEditorWithMobiledoc(function (_ref6) {
      var post = _ref6.post;
      var markupSection = _ref6.markupSection;
      var marker = _ref6.marker;
      return post([markupSection('P', [marker('abc'), marker('def')])]);
    });

    var section = getSection(0);
    var position = new _mobiledocKitUtilsCursorPosition['default'](section, 3);
    var nextPosition = postEditor.deleteFrom(position, FORWARD);
    postEditor.complete();

    assert.equal(getSection(0).text, 'abcef', 'text is correct');
    assert.ok(nextPosition.section === getSection(0), 'correct position section');
    assert.equal(nextPosition.offset, 'abc'.length, 'correct position offset');
  });

  _module('Unit: PostEditor', {
    beforeEach: function beforeEach() {
      renderedRange = null;
      editorElement = $('#editor')[0];
      builder = new _mobiledocKitModelsPostNodeBuilder['default']();
      mockEditor = {
        rerender: function rerender() {},
        didUpdate: function didUpdate() {},
        renderRange: function renderRange() {
          renderedRange = this.range;
        },
        builder: builder
      };
      postEditor = new _mobiledocKitEditorPost['default'](mockEditor);
    },

    afterEach: function afterEach() {
      renderedRange = null;
      if (editor) {
        editor.destroy();
        editor = null;
      }
    }
  });

  test('#deleteRange when within the same marker', function (assert) {
    var post = undefined,
        section = undefined;
    _testHelpers['default'].postAbstract.build(function (_ref7) {
      var marker = _ref7.marker;
      var buildMarkupSection = _ref7.markupSection;
      var buildPost = _ref7.post;

      section = buildMarkupSection('p', [marker('abc def')]);
      post = buildPost([section]);
    });

    renderBuiltAbstract(post);

    var range = _mobiledocKitUtilsCursorRange['default'].create(section, 3, section, 4);
    postEditor.deleteRange(range);
    postEditor.complete();

    assert.equal(post.sections.head.text, 'abcdef');
  });

  test('#deleteRange when same section, different markers, same markups', function (assert) {
    var post = undefined,
        section = undefined;
    _testHelpers['default'].postAbstract.build(function (_ref8) {
      var marker = _ref8.marker;
      var buildMarkupSection = _ref8.markupSection;
      var buildPost = _ref8.post;

      section = buildMarkupSection('p', [marker('abc'), marker(' def')]);
      post = buildPost([section]);
    });

    renderBuiltAbstract(post);

    var range = _mobiledocKitUtilsCursorRange['default'].create(section, 3, section, 4);
    postEditor.deleteRange(range);
    postEditor.complete();

    assert.equal(post.sections.head.text, 'abcdef');
  });

  test('#deleteRange when same section, different markers, different markups', function (assert) {
    var post = undefined,
        section = undefined,
        markup = undefined;
    _testHelpers['default'].postAbstract.build(function (_ref9) {
      var marker = _ref9.marker;
      var buildMarkup = _ref9.markup;
      var buildMarkupSection = _ref9.markupSection;
      var buildPost = _ref9.post;

      markup = buildMarkup('b');
      section = buildMarkupSection('p', [marker('abc'), marker(' def', [markup])]);
      post = buildPost([section]);
    });

    renderBuiltAbstract(post);

    var range = _mobiledocKitUtilsCursorRange['default'].create(section, 3, section, 4);
    postEditor.deleteRange(range);
    postEditor.complete();

    assert.equal(post.sections.head.text, 'abcdef');

    var _post$sections$head$markers$toArray = post.sections.head.markers.toArray();

    var _post$sections$head$markers$toArray2 = _slicedToArray(_post$sections$head$markers$toArray, 2);

    var m1 = _post$sections$head$markers$toArray2[0];
    var m2 = _post$sections$head$markers$toArray2[1];

    assert.ok(!m1.hasMarkup(markup), 'head marker has no markup');
    assert.ok(m2.hasMarkup(markup), 'tail marker has markup');
  });

  test('#deleteRange across contiguous sections', function (assert) {
    var post = undefined,
        s1 = undefined,
        s2 = undefined;
    _testHelpers['default'].postAbstract.build(function (_ref10) {
      var marker = _ref10.marker;
      var markupSection = _ref10.markupSection;
      var buildPost = _ref10.post;

      s1 = markupSection('p', [marker('abc')]);
      s2 = markupSection('p', [marker(' def')]);
      post = buildPost([s1, s2]);
    });

    renderBuiltAbstract(post);

    var range = _mobiledocKitUtilsCursorRange['default'].create(s1, 3, s2, 1);
    postEditor.deleteRange(range);
    postEditor.complete();

    assert.equal(post.sections.head.text, 'abcdef');
    assert.equal(post.sections.length, 1, 'only 1 section remains');
  });

  test('#deleteRange across entire sections', function (assert) {
    var post = undefined,
        s1 = undefined,
        s2 = undefined,
        s3 = undefined;
    _testHelpers['default'].postAbstract.build(function (_ref11) {
      var marker = _ref11.marker;
      var markupSection = _ref11.markupSection;
      var buildPost = _ref11.post;

      s1 = markupSection('p', [marker('abc')]);
      s2 = markupSection('p', [marker('this space left blank')]);
      s3 = markupSection('p', [marker('def')]);
      post = buildPost([s1, s2, s3]);
    });

    renderBuiltAbstract(post);

    var range = _mobiledocKitUtilsCursorRange['default'].create(s1, 3, s3, 0);
    postEditor.deleteRange(range);
    postEditor.complete();

    assert.equal(post.sections.head.text, 'abcdef');
    assert.equal(post.sections.length, 1, 'only 1 section remains');
  });

  test('#deleteRange across all content', function (assert) {
    var post = undefined,
        s1 = undefined,
        s2 = undefined;
    _testHelpers['default'].postAbstract.build(function (_ref12) {
      var marker = _ref12.marker;
      var markupSection = _ref12.markupSection;
      var buildPost = _ref12.post;

      s1 = markupSection('p', [marker('abc')]);
      s2 = markupSection('p', [marker('def')]);
      post = buildPost([s1, s2]);
    });

    renderBuiltAbstract(post);

    var range = _mobiledocKitUtilsCursorRange['default'].create(s1, 0, s2, 3);
    postEditor.deleteRange(range);

    postEditor.complete();

    assert.equal(post.sections.head.text, '');
    assert.equal(post.sections.length, 1, 'only 1 section remains');
    assert.equal(post.sections.head.markers.length, 0, 'no markers remain');
  });

  test('#deleteRange when range head and tail is same card section', function (assert) {
    var post = _testHelpers['default'].postAbstract.build(function (_ref13) {
      var cardSection = _ref13.cardSection;
      var post = _ref13.post;

      return post([cardSection('my-card')]);
    });

    renderBuiltAbstract(post);

    var range = _mobiledocKitUtilsCursorRange['default'].create(post.sections.head, 0, post.sections.tail, 1);
    var position = postEditor.deleteRange(range);

    postEditor.complete();

    assert.equal(post.sections.length, 1, 'only 1 section');
    assert.ok(!post.sections.head.isCardSection, 'not card section');
    assert.ok(position.section === post.sections.head, 'correct position section');
    assert.equal(position.offset, 0, 'correct position offset');
  });

  test('#deleteRange when range head and tail are diff card sections', function (assert) {
    var post = _testHelpers['default'].postAbstract.build(function (_ref14) {
      var cardSection = _ref14.cardSection;
      var post = _ref14.post;

      return post([cardSection('my-card'), cardSection('my-card')]);
    });

    renderBuiltAbstract(post);

    var range = _mobiledocKitUtilsCursorRange['default'].create(post.sections.head, 0, post.sections.tail, 1);
    var position = postEditor.deleteRange(range);

    postEditor.complete();

    assert.equal(post.sections.length, 1, 'only 1 section');
    assert.ok(!post.sections.head.isCardSection, 'not card section');
    assert.ok(position.section === post.sections.head, 'correct position section');
    assert.equal(position.offset, 0, 'correct position offset');
  });

  test('#deleteRange when range head is card section', function (assert) {
    var post = _testHelpers['default'].postAbstract.build(function (_ref15) {
      var cardSection = _ref15.cardSection;
      var marker = _ref15.marker;
      var markupSection = _ref15.markupSection;
      var post = _ref15.post;

      return post([cardSection('my-card'), markupSection('p', [marker('abc')])]);
    });

    renderBuiltAbstract(post);

    var range = _mobiledocKitUtilsCursorRange['default'].create(post.sections.head, 0, post.sections.tail, 1);
    var position = postEditor.deleteRange(range);

    postEditor.complete();

    assert.equal(post.sections.length, 1, 'only 1 section');
    assert.ok(!post.sections.head.isCardSection, 'not card section');
    assert.ok(position.section === post.sections.head, 'correct position section');
    assert.equal(position.offset, 0, 'correct position offset');
    assert.equal(position.section.text, 'bc', 'correct text in section');
  });

  test('#deleteRange when range tail is start of card section', function (assert) {
    var post = _testHelpers['default'].postAbstract.build(function (_ref16) {
      var marker = _ref16.marker;
      var markupSection = _ref16.markupSection;
      var cardSection = _ref16.cardSection;
      var post = _ref16.post;

      return post([markupSection('p', [marker('abc')]), cardSection('my-card')]);
    });

    renderBuiltAbstract(post);

    var range = _mobiledocKitUtilsCursorRange['default'].create(post.sections.head, 1, post.sections.tail, 0);
    var position = postEditor.deleteRange(range);

    postEditor.complete();

    assert.equal(post.sections.length, 2, '2 sections remain');
    assert.ok(!post.sections.head.isCardSection, 'not card section');
    assert.equal(post.sections.head.text, 'a', 'correct text in markup section');
    assert.ok(post.sections.tail.isCardSection, 'tail is card section');

    assert.ok(position.section === post.sections.head, 'correct position section');
    assert.equal(position.offset, 1, 'correct position offset');
  });

  test('#deleteRange when range tail is end of card section', function (assert) {
    var post = _testHelpers['default'].postAbstract.build(function (_ref17) {
      var marker = _ref17.marker;
      var markupSection = _ref17.markupSection;
      var cardSection = _ref17.cardSection;
      var post = _ref17.post;

      return post([markupSection('p', [marker('abc')]), cardSection('my-card')]);
    });

    renderBuiltAbstract(post);

    var range = _mobiledocKitUtilsCursorRange['default'].create(post.sections.head, 1, post.sections.tail, 1);
    var position = postEditor.deleteRange(range);

    postEditor.complete();

    assert.equal(post.sections.length, 1, '1 section remains');
    assert.ok(!post.sections.head.isCardSection, 'not card section');
    assert.equal(post.sections.head.text, 'a', 'correct text in markup section');

    assert.ok(position.section === post.sections.head, 'correct position section');
    assert.equal(position.offset, 1, 'correct position offset');
  });

  test('#deleteRange when range head is end of card section', function (assert) {
    var post = _testHelpers['default'].postAbstract.build(function (_ref18) {
      var marker = _ref18.marker;
      var markupSection = _ref18.markupSection;
      var cardSection = _ref18.cardSection;
      var post = _ref18.post;

      return post([cardSection('my-card'), markupSection('p', [marker('abc')])]);
    });

    renderBuiltAbstract(post);

    var range = _mobiledocKitUtilsCursorRange['default'].create(post.sections.head, 1, post.sections.tail, 1);
    var position = postEditor.deleteRange(range);

    postEditor.complete();

    assert.equal(post.sections.length, 2, '2 sections remain');
    assert.ok(post.sections.head.isCardSection, 'head is card section');
    assert.ok(!post.sections.tail.isCardSection, 'tail is not card section');
    assert.equal(post.sections.tail.text, 'bc', 'correct text in markup section');

    assert.ok(position.section === post.sections.head, 'correct position section');
    assert.equal(position.offset, 1, 'correct position offset');
  });

  test('#cutSection with one marker', function (assert) {
    var post = undefined,
        section = undefined;
    _testHelpers['default'].postAbstract.build(function (_ref19) {
      var marker = _ref19.marker;
      var markupSection = _ref19.markupSection;
      var buildPost = _ref19.post;

      section = markupSection('p', [marker('abc')]);
      post = buildPost([section]);
    });

    renderBuiltAbstract(post);
    postEditor.cutSection(section, 1, 2);
    postEditor.complete();

    assert.equal(post.sections.head.text, 'ac');
    assert.equal(post.sections.length, 1, 'only 1 section remains');
    assert.equal(post.sections.head.markers.length, 1, 'markers are joined');
  });

  test('#cutSection at boundaries across markers', function (assert) {
    var post = undefined,
        section = undefined;
    _testHelpers['default'].postAbstract.build(function (_ref20) {
      var marker = _ref20.marker;
      var markupSection = _ref20.markupSection;
      var buildPost = _ref20.post;

      var markers = "abcd".split('').map(function (l) {
        return marker(l);
      });
      section = markupSection('p', markers);
      post = buildPost([section]);
    });

    renderBuiltAbstract(post);
    assert.equal(post.sections.head.text, 'abcd'); //precond
    assert.equal(post.sections.head.markers.length, 4); //precond
    postEditor.cutSection(section, 1, 3);
    postEditor.complete();

    assert.equal(post.sections.head.text, 'ad');
    assert.equal(post.sections.length, 1, 'only 1 section remains');
    assert.equal(post.sections.head.markers.length, 1, 'markers are joined');
  });

  test('#cutSection in head marker', function (assert) {
    var post = undefined,
        section = undefined;
    _testHelpers['default'].postAbstract.build(function (_ref21) {
      var marker = _ref21.marker;
      var markupSection = _ref21.markupSection;
      var buildPost = _ref21.post;

      section = markupSection('p', [marker('a'), marker('bc')]);
      post = buildPost([section]);
    });

    renderBuiltAbstract(post);
    assert.equal(section.text, 'abc'); //precond
    assert.equal(section.markers.length, 2); //precond
    postEditor.cutSection(section, 2, 3);
    postEditor.complete();

    assert.equal(post.sections.head.text, 'ab');
    assert.equal(post.sections.length, 1, 'only 1 section remains');
    assert.equal(post.sections.head.markers.length, 1, 'markers are joined');
  });

  test('#cutSection in tail marker', function (assert) {
    var post = undefined,
        section = undefined;
    _testHelpers['default'].postAbstract.build(function (_ref22) {
      var marker = _ref22.marker;
      var markupSection = _ref22.markupSection;
      var buildPost = _ref22.post;

      section = markupSection('p', [marker('a'), marker('bc')]);
      post = buildPost([section]);
    });

    renderBuiltAbstract(post);

    postEditor.cutSection(section, 0, 2);

    postEditor.complete();

    assert.equal(post.sections.head.text, 'c');
    assert.equal(post.sections.length, 1, 'only 1 section remains');
    assert.equal(post.sections.head.markers.length, 1, 'two markers remain');
  });

  test('#splitMarkers when headMarker = tailMarker', function (assert) {
    var post = undefined,
        section = undefined;
    _testHelpers['default'].postAbstract.build(function (_ref23) {
      var marker = _ref23.marker;
      var markupSection = _ref23.markupSection;
      var buildPost = _ref23.post;

      section = markupSection('p', [marker('abcd')]);
      post = buildPost([section]);
    });

    var mockEditor = renderBuiltAbstract(post);

    var postEditor = new _mobiledocKitEditorPost['default'](mockEditor);
    var range = _mobiledocKitUtilsCursorRange['default'].create(section, 1, section, 3);
    var markers = postEditor.splitMarkers(range);
    postEditor.complete();

    assert.equal(markers.length, 1, 'markers');
    assert.equal(markers[0].value, 'bc', 'marker 0');
  });

  test('#splitMarkers when head section = tail section, but different markers', function (assert) {
    var post = _testHelpers['default'].postAbstract.build(function (_ref24) {
      var marker = _ref24.marker;
      var markupSection = _ref24.markupSection;
      var post = _ref24.post;
      return post([markupSection('p', [marker('abc'), marker('def')])]);
    });

    var mockEditor = renderBuiltAbstract(post);

    var section = post.sections.head;
    var range = _mobiledocKitUtilsCursorRange['default'].create(section, 2, section, 5);
    var postEditor = new _mobiledocKitEditorPost['default'](mockEditor);
    var markers = postEditor.splitMarkers(range);
    postEditor.complete();

    assert.equal(markers.length, 2, 'markers');
    assert.equal(markers[0].value, 'c', 'marker 0');
    assert.equal(markers[1].value, 'de', 'marker 1');
  });

  // see https://github.com/bustlelabs/mobiledoc-kit/issues/121
  test('#splitMarkers when single-character marker at start', function (assert) {
    var post = undefined,
        section = undefined;
    _testHelpers['default'].postAbstract.build(function (_ref25) {
      var marker = _ref25.marker;
      var markupSection = _ref25.markupSection;
      var buildPost = _ref25.post;

      section = markupSection('p', [marker('a'), marker('b'), marker('c')]);
      post = buildPost([section]);
    });

    renderBuiltAbstract(post);

    var range = _mobiledocKitUtilsCursorRange['default'].create(section, 1, section, 3);
    var markers = postEditor.splitMarkers(range);
    postEditor.complete();

    assert.equal(markers.length, 2, 'markers');
    assert.equal(markers[0].value, 'b', 'marker 0');
    assert.equal(markers[1].value, 'c', 'marker 1');
  });

  test('#replaceSection one markup section with another', function (assert) {
    var _section1 = undefined,
        _section2 = undefined;
    var post = _testHelpers['default'].postAbstract.build(function (_ref26) {
      var post = _ref26.post;
      var markupSection = _ref26.markupSection;
      var marker = _ref26.marker;

      _section1 = markupSection('p', [marker('abc')]);
      _section2 = markupSection('p', [marker('123')]);
      return post([_section1]);
    });
    renderBuiltAbstract(post);

    assert.equal(post.sections.head.text, 'abc', 'precond - section text');
    assert.equal(post.sections.length, 1, 'precond - only 1 section');
    postEditor.replaceSection(_section1, _section2);
    postEditor.complete();

    assert.equal(post.sections.head.text, '123', 'section replaced');
    assert.equal(post.sections.length, 1, 'only 1 section');
  });

  test('#replaceSection markup section with list section', function (assert) {
    var _section1 = undefined,
        _section2 = undefined;
    var post = _testHelpers['default'].postAbstract.build(function (_ref27) {
      var post = _ref27.post;
      var markupSection = _ref27.markupSection;
      var listSection = _ref27.listSection;
      var listItem = _ref27.listItem;
      var marker = _ref27.marker;

      _section1 = markupSection('p', [marker('abc')]);
      _section2 = listSection('ul', [listItem([marker('123')])]);
      return post([_section1]);
    });
    renderBuiltAbstract(post);

    assert.equal(post.sections.head.text, 'abc', 'precond - section text');
    assert.equal(post.sections.length, 1, 'precond - only 1 section');
    postEditor.replaceSection(_section1, _section2);
    postEditor.complete();

    assert.equal(post.sections.head.items.head.text, '123', 'section replaced');
    assert.equal(post.sections.length, 1, 'only 1 section');
  });

  test('#replaceSection solo list item with markup section removes list section', function (assert) {
    var _section1 = undefined,
        _section2 = undefined;
    var post = _testHelpers['default'].postAbstract.build(function (_ref28) {
      var post = _ref28.post;
      var markupSection = _ref28.markupSection;
      var listSection = _ref28.listSection;
      var listItem = _ref28.listItem;
      var marker = _ref28.marker;

      _section1 = listItem([marker('abc')]);
      _section2 = markupSection('p', [marker('123')]);
      return post([listSection('ul', [_section1])]);
    });
    renderBuiltAbstract(post);

    assert.equal(post.sections.head.items.head.text, 'abc', 'precond - list item text');
    assert.equal(post.sections.length, 1, 'precond - only 1 section');
    postEditor.replaceSection(_section1, _section2);
    postEditor.complete();

    assert.equal(post.sections.head.text, '123', 'section replaced');
    assert.equal(post.sections.length, 1, 'only 1 section');
  });

  /*
   * FIXME, this test should be made to pass, but it is not a situation that we
   * run into in the actual life of the editor right now.
  
  test('#replaceSection middle list item with markup section cuts list into two', (assert) => {
    let _section1, _section2;
    const post = Helpers.postAbstract.build(
      ({post, markupSection, listSection, listItem, marker}) => {
      _section1 = listItem([marker('li 2')]);
      _section2 = markupSection('p', [marker('123')]);
      return post([listSection('ul', [
        listItem([marker('li 1')]),
        _section1,
        listItem([marker('li 3')])
      ])]);
    });
    renderBuiltAbstract(post);
  
    assert.equal(post.sections.head.items.length, 3, 'precond - 3 lis');
    assert.equal(post.sections.head.items.objectAt(1).text, 'li 2', 'precond - list item text');
    assert.equal(post.sections.length, 1, 'precond - only 1 section');
    postEditor.replaceSection(_section1, _section2);
    postEditor.complete();
  
    assert.equal(post.sections.length, 3, '3 sections');
    assert.equal(post.sections.head.items.length, 1, '1 li in 1st ul');
    assert.equal(post.sections.objectAt(1).text, '123', 'new section text is there');
    assert.equal(post.sections.tail.items.length, 1, '1 li in last ul');
  });
  
  */

  test('#replaceSection last list item with markup section when multiple list items appends after list section', function (assert) {
    var _section1 = undefined,
        _section2 = undefined;
    var post = _testHelpers['default'].postAbstract.build(function (_ref29) {
      var post = _ref29.post;
      var markupSection = _ref29.markupSection;
      var listSection = _ref29.listSection;
      var listItem = _ref29.listItem;
      var marker = _ref29.marker;

      _section1 = listItem([marker('abc')]);
      _section2 = markupSection('p', [marker('123')]);
      return post([listSection('ul', [listItem([marker('before li')]), _section1])]);
    });
    renderBuiltAbstract(post);

    assert.equal(post.sections.head.items.length, 2, 'precond - 2 lis');
    assert.equal(post.sections.head.items.tail.text, 'abc', 'precond - list item text');
    assert.equal(post.sections.length, 1, 'precond - only 1 section');
    postEditor.replaceSection(_section1, _section2);
    postEditor.complete();

    assert.equal(post.sections.head.items.length, 1, 'only 1 li');
    assert.equal(post.sections.head.items.head.text, 'before li', 'first li remains');
    assert.equal(post.sections.length, 2, '2 sections');
    assert.equal(post.sections.tail.text, '123', 'new section text is there');
  });

  test('#replaceSection when section is null appends new section', function (assert) {
    var newEmptySection = undefined;
    var post = _testHelpers['default'].postAbstract.build(function (_ref30) {
      var post = _ref30.post;
      var markupSection = _ref30.markupSection;

      newEmptySection = markupSection('p');
      return post();
    });
    renderBuiltAbstract(post);

    assert.equal(post.sections.length, 0, 'precond - no sections');
    postEditor.replaceSection(null, newEmptySection);
    postEditor.complete();

    assert.equal(post.sections.length, 1, 'has 1 section');
    assert.equal(post.sections.head.text, '', 'no text in new section');
  });

  test('#insertSectionAtEnd inserts the section at the end of the mobiledoc', function (assert) {
    var newSection = undefined;
    var post = _testHelpers['default'].postAbstract.build(function (_ref31) {
      var post = _ref31.post;
      var markupSection = _ref31.markupSection;
      var marker = _ref31.marker;

      newSection = markupSection('p', [marker('123')]);
      return post([markupSection('p', [marker('abc')])]);
    });
    renderBuiltAbstract(post);

    postEditor.insertSectionAtEnd(newSection);
    postEditor.complete();

    assert.equal(post.sections.length, 2, 'new section added');
    assert.equal(post.sections.tail.text, '123', 'new section added at end');
  });

  test('markers with identical non-attribute markups get coalesced after applying or removing markup', function (assert) {
    var strong = undefined,
        section = undefined;
    var post = _testHelpers['default'].postAbstract.build(function (_ref32) {
      var post = _ref32.post;
      var markupSection = _ref32.markupSection;
      var marker = _ref32.marker;
      var markup = _ref32.markup;

      strong = markup('strong');
      section = markupSection('p', [marker('a'), marker('b', [strong]), marker('c')]);
      return post([section]);
    });
    renderBuiltAbstract(post);

    // removing the strong from the "b"
    var range = _mobiledocKitUtilsCursorRange['default'].create(section, 1, section, 2);
    postEditor = new _mobiledocKitEditorPost['default'](mockEditor);
    postEditor.removeMarkupFromRange(range, strong);
    postEditor.complete();

    assert.equal(section.markers.length, 1, 'similar markers are coalesced');
    assert.equal(section.markers.head.value, 'abc', 'marker value is correct');
    assert.ok(!section.markers.head.hasMarkup(strong), 'marker has no bold');

    // adding strong to each of the characters individually
    postEditor = new _mobiledocKitEditorPost['default'](mockEditor);
    for (var i = 0; i < section.length; i++) {
      range = _mobiledocKitUtilsCursorRange['default'].create(section, i, section, i + 1);
      postEditor.addMarkupToRange(range, strong);
    }
    postEditor.complete();

    assert.equal(section.markers.length, 1, 'bold markers coalesced');
    assert.equal(section.markers.head.value, 'abc', 'bold marker value is correct');
    assert.ok(section.markers.head.hasMarkup(strong), 'bold marker has bold');
  });

  test('markers do not get coalesced with atoms', function (assert) {
    var strong = undefined,
        section = undefined;
    var post = _testHelpers['default'].postAbstract.build(function (_ref33) {
      var post = _ref33.post;
      var markupSection = _ref33.markupSection;
      var marker = _ref33.marker;
      var atom = _ref33.atom;
      var markup = _ref33.markup;

      strong = markup('strong');
      section = markupSection('p', [atom('the-atom', 'A'), marker('b', [strong])]);
      return post([section]);
    });
    renderBuiltAbstract(post);

    // removing the strong from the "b"
    var range = _mobiledocKitUtilsCursorRange['default'].create(section, 0, section, 2);
    postEditor = new _mobiledocKitEditorPost['default'](mockEditor);
    postEditor.removeMarkupFromRange(range, strong);
    postEditor.complete();

    assert.equal(section.markers.length, 2, 'still 2 markers');
    assert.equal(section.markers.head.value, 'A', 'head marker value is correct');
    assert.ok(section.markers.head.isAtom, 'head marker is atom');
    assert.equal(section.markers.tail.value, 'b', 'tail marker value is correct');
    assert.ok(section.markers.tail.isMarker, 'tail marker is marker');

    assert.ok(!section.markers.head.hasMarkup(strong), 'head marker has no bold');
    assert.ok(!section.markers.tail.hasMarkup(strong), 'tail marker has no bold');
  });

  test('neighboring atoms do not get coalesced', function (assert) {
    var strong = undefined,
        section = undefined;
    var post = _testHelpers['default'].postAbstract.build(function (_ref34) {
      var post = _ref34.post;
      var markupSection = _ref34.markupSection;
      var marker = _ref34.marker;
      var atom = _ref34.atom;
      var markup = _ref34.markup;

      strong = markup('strong');
      section = markupSection('p', [atom('the-atom', 'A', {}, [strong]), atom('the-atom', 'A', {}, [strong])]);
      return post([section]);
    });
    renderBuiltAbstract(post);

    var range = _mobiledocKitUtilsCursorRange['default'].create(section, 0, section, 2);
    postEditor = new _mobiledocKitEditorPost['default'](mockEditor);
    postEditor.removeMarkupFromRange(range, strong);
    postEditor.complete();

    assert.equal(section.markers.length, 2, 'atoms not coalesced');
    assert.ok(!section.markers.head.hasMarkup(strong));
    assert.ok(!section.markers.tail.hasMarkup(strong));
  });

  test('#removeMarkupFromRange silently does nothing when invoked with an empty range', function (assert) {
    var section = undefined,
        markup = undefined;
    var post = _testHelpers['default'].postAbstract.build(function (_ref35) {
      var post = _ref35.post;
      var markupSection = _ref35.markupSection;
      var marker = _ref35.marker;
      var buildMarkup = _ref35.markup;

      markup = buildMarkup('strong');
      section = markupSection('p', [marker('abc')]);
      return post([section]);
    });
    renderBuiltAbstract(post);

    var range = _mobiledocKitUtilsCursorRange['default'].create(section, 1, section, 1);
    postEditor.removeMarkupFromRange(range, markup);
    postEditor.complete();

    assert.equal(section.markers.length, 1, 'similar markers are coalesced');
    assert.equal(section.markers.head.value, 'abc', 'marker value is correct');
    assert.ok(!section.markers.head.hasMarkup(markup), 'marker has no markup');
  });

  test('#removeMarkupFromRange splits markers when necessary', function (assert) {
    var bold = undefined,
        section = undefined;
    var post = _testHelpers['default'].postAbstract.build(function (_ref36) {
      var post = _ref36.post;
      var marker = _ref36.marker;
      var markup = _ref36.markup;
      var markupSection = _ref36.markupSection;

      bold = markup('b');
      section = markupSection('p', [marker('abc', [bold]), marker('def')]);
      return post([section]);
    });

    renderBuiltAbstract(post);

    var range = _mobiledocKitUtilsCursorRange['default'].create(section, 'a'.length, section, 'abcd'.length);

    postEditor.removeMarkupFromRange(range, bold);
    postEditor.complete();

    assert.equal(section.text, 'abcdef', 'text still correct');
    assert.equal(section.markers.length, 2, '2 markers');

    var _section$markers$toArray = section.markers.toArray();

    var _section$markers$toArray2 = _slicedToArray(_section$markers$toArray, 2);

    var head = _section$markers$toArray2[0];
    var tail = _section$markers$toArray2[1];

    assert.equal(head.value, 'a', 'head marker value');
    assert.ok(head.hasMarkup(bold), 'head has bold');
    assert.equal(tail.value, 'bcdef', 'tail marker value');
    assert.ok(!tail.hasMarkup(bold), 'tail has no bold');
  });

  test('#removeMarkupFromRange handles atoms correctly', function (assert) {
    var bold = undefined,
        section = undefined;
    var post = _testHelpers['default'].postAbstract.build(function (_ref37) {
      var post = _ref37.post;
      var marker = _ref37.marker;
      var markup = _ref37.markup;
      var atom = _ref37.atom;
      var markupSection = _ref37.markupSection;

      bold = markup('b');
      section = markupSection('p', [atom('the-atom', 'n/a', {}, [bold]), marker('X')]);
      return post([section]);
    });

    renderBuiltAbstract(post);

    var range = _mobiledocKitUtilsCursorRange['default'].create(section, 0, section, 2);

    postEditor.removeMarkupFromRange(range, bold);
    postEditor.complete();

    assert.equal(section.markers.length, 2, '2 markers');

    var _section$markers$toArray3 = section.markers.toArray();

    var _section$markers$toArray32 = _slicedToArray(_section$markers$toArray3, 2);

    var head = _section$markers$toArray32[0];
    var tail = _section$markers$toArray32[1];

    assert.ok(head.isAtom, 'head is atom');
    assert.ok(!head.hasMarkup(bold), 'head has no bold');

    assert.equal(tail.value, 'X', 'tail marker value');
    assert.ok(!tail.hasMarkup(bold), 'tail has no bold');
  });

  test('#addMarkupToRange silently does nothing when invoked with an empty range', function (assert) {
    var section = undefined,
        markup = undefined;
    var post = _testHelpers['default'].postAbstract.build(function (_ref38) {
      var post = _ref38.post;
      var markupSection = _ref38.markupSection;
      var marker = _ref38.marker;
      var buildMarkup = _ref38.markup;

      markup = buildMarkup('strong');
      section = markupSection('p', [marker('abc')]);
      return post([section]);
    });
    renderBuiltAbstract(post);

    var range = _mobiledocKitUtilsCursorRange['default'].create(section, 1, section, 1);
    postEditor.addMarkupToRange(range, markup);
    postEditor.complete();

    assert.equal(section.markers.length, 1, 'similar markers are coalesced');
    assert.equal(section.markers.head.value, 'abc', 'marker value is correct');
    assert.ok(!section.markers.head.hasMarkup(markup), 'marker has no markup');
  });

  test('markers with identical markups get coalesced after deletion', function (assert) {
    var strong = undefined,
        section = undefined;
    var post = _testHelpers['default'].postAbstract.build(function (_ref39) {
      var post = _ref39.post;
      var markupSection = _ref39.markupSection;
      var marker = _ref39.marker;
      var markup = _ref39.markup;

      strong = markup('strong');
      section = markupSection('p', [marker('a'), marker('b', [strong]), marker('c')]);
      return post([section]);
    });
    var mockEditor = renderBuiltAbstract(post);

    var range = _mobiledocKitUtilsCursorRange['default'].create(section, 1, section, 2);
    postEditor = new _mobiledocKitEditorPost['default'](mockEditor);
    postEditor.deleteRange(range);
    postEditor.complete();

    assert.equal(section.markers.length, 1, 'similar markers are coalesced');
    assert.equal(section.markers.head.value, 'ac', 'marker value is correct');
  });

  test('#moveSectionBefore moves the section as expected', function (assert) {
    var post = _testHelpers['default'].postAbstract.build(function (_ref40) {
      var post = _ref40.post;
      var markupSection = _ref40.markupSection;
      var marker = _ref40.marker;

      return post([markupSection('p', [marker('abc')]), markupSection('p', [marker('123')])]);
    });
    var mockEditor = renderBuiltAbstract(post);

    var _post$sections$toArray = post.sections.toArray();

    var _post$sections$toArray2 = _slicedToArray(_post$sections$toArray, 2);

    var headSection = _post$sections$toArray2[0];
    var tailSection = _post$sections$toArray2[1];

    var collection = post.sections;
    postEditor = new _mobiledocKitEditorPost['default'](mockEditor);
    var movedSection = postEditor.moveSectionBefore(collection, tailSection, headSection);
    postEditor.complete();

    assert.equal(post.sections.head, movedSection, 'movedSection is returned');
    assert.equal(post.sections.head.text, '123', 'tail section is now head');
    assert.equal(post.sections.tail.text, 'abc', 'head section is now tail');
  });

  test('#moveSectionBefore moves card sections', function (assert) {
    var listiclePayload = { some: 'thing' };
    var otherPayload = { some: 'other thing' };
    var post = _testHelpers['default'].postAbstract.build(function (_ref41) {
      var post = _ref41.post;
      var cardSection = _ref41.cardSection;

      return post([cardSection('listicle-card', listiclePayload), cardSection('other-card', otherPayload)]);
    });
    var mockEditor = renderBuiltAbstract(post);

    var collection = post.sections;

    var _post$sections$toArray3 = post.sections.toArray();

    var _post$sections$toArray32 = _slicedToArray(_post$sections$toArray3, 2);

    var headSection = _post$sections$toArray32[0];
    var tailSection = _post$sections$toArray32[1];

    postEditor = new _mobiledocKitEditorPost['default'](mockEditor);
    postEditor.moveSectionBefore(collection, tailSection, headSection);
    postEditor.complete();

    var _post$sections$toArray4 = post.sections.toArray();

    var _post$sections$toArray42 = _slicedToArray(_post$sections$toArray4, 2);

    headSection = _post$sections$toArray42[0];
    tailSection = _post$sections$toArray42[1];

    assert.equal(headSection.name, 'other-card', 'other-card moved to first spot');
    assert.equal(tailSection.name, 'listicle-card', 'listicle-card moved to last spot');
    assert.deepEqual(headSection.payload, otherPayload, 'payload is correct for other-card');
    assert.deepEqual(tailSection.payload, listiclePayload, 'payload is correct for listicle-card');
  });

  test('#moveSectionUp moves it up', function (assert) {
    var post = _testHelpers['default'].postAbstract.build(function (_ref42) {
      var post = _ref42.post;
      var cardSection = _ref42.cardSection;

      return post([cardSection('listicle-card'), cardSection('other-card')]);
    });
    var mockEditor = renderBuiltAbstract(post);

    var _post$sections$toArray5 = post.sections.toArray();

    var _post$sections$toArray52 = _slicedToArray(_post$sections$toArray5, 2);

    var headSection = _post$sections$toArray52[0];
    var tailSection = _post$sections$toArray52[1];

    postEditor = new _mobiledocKitEditorPost['default'](mockEditor);
    postEditor.moveSectionUp(tailSection);
    postEditor.complete();

    var _post$sections$toArray6 = post.sections.toArray();

    var _post$sections$toArray62 = _slicedToArray(_post$sections$toArray6, 2);

    headSection = _post$sections$toArray62[0];
    tailSection = _post$sections$toArray62[1];

    assert.equal(headSection.name, 'other-card', 'other-card moved to first spot');
    assert.equal(tailSection.name, 'listicle-card', 'listicle-card moved to last spot');

    postEditor = new _mobiledocKitEditorPost['default'](mockEditor);
    var movedSection = postEditor.moveSectionUp(headSection);
    postEditor.complete();

    var _post$sections$toArray7 = post.sections.toArray();

    var _post$sections$toArray72 = _slicedToArray(_post$sections$toArray7, 2);

    headSection = _post$sections$toArray72[0];
    tailSection = _post$sections$toArray72[1];

    assert.equal(post.sections.head, movedSection, 'movedSection is returned');
    assert.equal(headSection.name, 'other-card', 'moveSectionUp is no-op when card is at top');
  });

  test('moveSectionDown moves it down', function (assert) {
    var post = _testHelpers['default'].postAbstract.build(function (_ref43) {
      var post = _ref43.post;
      var cardSection = _ref43.cardSection;

      return post([cardSection('listicle-card'), cardSection('other-card')]);
    });
    var mockEditor = renderBuiltAbstract(post);

    var _post$sections$toArray8 = post.sections.toArray();

    var _post$sections$toArray82 = _slicedToArray(_post$sections$toArray8, 2);

    var headSection = _post$sections$toArray82[0];
    var tailSection = _post$sections$toArray82[1];

    postEditor = new _mobiledocKitEditorPost['default'](mockEditor);
    postEditor.moveSectionDown(headSection);
    postEditor.complete();

    var _post$sections$toArray9 = post.sections.toArray();

    var _post$sections$toArray92 = _slicedToArray(_post$sections$toArray9, 2);

    headSection = _post$sections$toArray92[0];
    tailSection = _post$sections$toArray92[1];

    assert.equal(headSection.name, 'other-card', 'other-card moved to first spot');
    assert.equal(tailSection.name, 'listicle-card', 'listicle-card moved to last spot');

    postEditor = new _mobiledocKitEditorPost['default'](mockEditor);
    var movedSection = postEditor.moveSectionDown(tailSection);
    postEditor.complete();

    var _post$sections$toArray10 = post.sections.toArray();

    var _post$sections$toArray102 = _slicedToArray(_post$sections$toArray10, 2);

    headSection = _post$sections$toArray102[0];
    tailSection = _post$sections$toArray102[1];

    assert.equal(post.sections.tail, movedSection, 'movedSection is returned');
    assert.equal(tailSection.name, 'listicle-card', 'moveSectionDown is no-op when card is at bottom');
  });

  test('#toggleSection changes single section to and from tag name', function (assert) {
    var post = _testHelpers['default'].postAbstract.build(function (_ref44) {
      var post = _ref44.post;
      var markupSection = _ref44.markupSection;

      return post([markupSection('p')]);
    });

    var mockEditor = renderBuiltAbstract(post);
    var range = _mobiledocKitUtilsCursorRange['default'].create(post.sections.head, 0);

    postEditor = new _mobiledocKitEditorPost['default'](mockEditor);
    postEditor.toggleSection('blockquote', range);
    postEditor.complete();

    assert.equal(post.sections.head.tagName, 'blockquote');

    postEditor = new _mobiledocKitEditorPost['default'](mockEditor);
    postEditor.toggleSection('blockquote', range);
    postEditor.complete();

    assert.equal(post.sections.head.tagName, 'p');
    assert.positionIsEqual(renderedRange.head, post.sections.head.headPosition());
  });

  test('#toggleSection changes multiples sections to and from tag name', function (assert) {
    var post = _testHelpers['default'].postAbstract.build(function (_ref45) {
      var post = _ref45.post;
      var markupSection = _ref45.markupSection;
      var marker = _ref45.marker;

      return post([markupSection('p', [marker('abc')]), markupSection('p', [marker('123')])]);
    });

    var mockEditor = renderBuiltAbstract(post);
    var range = _mobiledocKitUtilsCursorRange['default'].create(post.sections.head, 2, post.sections.tail, 2);

    postEditor = new _mobiledocKitEditorPost['default'](mockEditor);
    postEditor.toggleSection('blockquote', range);
    postEditor.complete();

    assert.equal(post.sections.head.tagName, 'blockquote');
    assert.equal(post.sections.tail.tagName, 'blockquote');

    postEditor = new _mobiledocKitEditorPost['default'](mockEditor);
    postEditor.toggleSection('blockquote', range);
    postEditor.complete();

    assert.equal(post.sections.head.tagName, 'p');
    assert.equal(post.sections.tail.tagName, 'p');

    assert.positionIsEqual(renderedRange.head, post.sections.head.headPosition());
  });

  test('#toggleSection skips over non-markerable sections', function (assert) {
    var post = _testHelpers['default'].postAbstract.build(function (_ref46) {
      var post = _ref46.post;
      var markupSection = _ref46.markupSection;
      var marker = _ref46.marker;
      var cardSection = _ref46.cardSection;

      return post([markupSection('p', [marker('abc')]), cardSection('my-card'), markupSection('p', [marker('123')])]);
    });

    var mockEditor = renderBuiltAbstract(post);
    var range = _mobiledocKitUtilsCursorRange['default'].create(post.sections.head, 0, post.sections.tail, 2);

    postEditor = new _mobiledocKitEditorPost['default'](mockEditor);
    postEditor.toggleSection('blockquote', range);
    postEditor.complete();

    assert.equal(post.sections.head.tagName, 'blockquote');
    assert.ok(post.sections.objectAt(1).isCardSection);
    assert.equal(post.sections.tail.tagName, 'blockquote');

    assert.positionIsEqual(renderedRange.head, post.sections.head.headPosition());
  });

  test('#toggleSection when cursor is in non-markerable section changes nothing', function (assert) {
    var post = _testHelpers['default'].postAbstract.build(function (_ref47) {
      var post = _ref47.post;
      var markupSection = _ref47.markupSection;
      var marker = _ref47.marker;
      var cardSection = _ref47.cardSection;

      return post([cardSection('my-card')]);
    });

    var mockEditor = renderBuiltAbstract(post);
    var range = new _mobiledocKitUtilsCursorRange['default'](post.sections.head.headPosition());

    postEditor = new _mobiledocKitEditorPost['default'](mockEditor);
    postEditor.toggleSection('blockquote', range);
    postEditor.complete();

    assert.ok(post.sections.head.isCardSection, 'card section not changed');
    assert.positionIsEqual(renderedRange.head, post.sections.head.headPosition());
  });

  if (!(0, _helpersBrowsers.detectIE11)()) {
    // TODO: Make this test pass on IE11
    test('#toggleSection when editor has no cursor does nothing', function (assert) {
      editor = buildEditorWithMobiledoc(function (_ref48) {
        var post = _ref48.post;
        var markupSection = _ref48.markupSection;
        var marker = _ref48.marker;
        var cardSection = _ref48.cardSection;

        return post([cardSection('my-card')]);
      });
      var expected = _testHelpers['default'].postAbstract.build(function (_ref49) {
        var post = _ref49.post;
        var markupSection = _ref49.markupSection;
        var marker = _ref49.marker;
        var cardSection = _ref49.cardSection;

        return post([cardSection('my-card')]);
      });

      editorElement.blur();
      (0, _mobiledocKitUtilsSelectionUtils.clearSelection)();

      postEditor = new _mobiledocKitEditorPost['default'](editor);
      postEditor.toggleSection('blockquote');
      postEditor.complete();

      assert.postIsSimilar(editor.post, expected);
      assert.ok(document.activeElement !== editorElement, 'editor element is not active');
      assert.ok(renderedRange.isBlank, 'rendered range is blank');
      assert.equal(window.getSelection().rangeCount, 0, 'nothing selected');
    });
  }

  test('#toggleSection toggle single p -> list item', function (assert) {
    var post = _testHelpers['default'].postAbstract.build(function (_ref50) {
      var post = _ref50.post;
      var markupSection = _ref50.markupSection;
      var marker = _ref50.marker;
      var markup = _ref50.markup;

      return post([markupSection('p', [marker('a'), marker('b', [markup('b')]), marker('c')])]);
    });

    var mockEditor = renderBuiltAbstract(post);
    var range = _mobiledocKitUtilsCursorRange['default'].create(post.sections.head, 0);

    postEditor = new _mobiledocKitEditorPost['default'](mockEditor);
    postEditor.toggleSection('ul', range);
    postEditor.complete();

    assert.equal(post.sections.length, 1);
    var listSection = post.sections.head;
    assert.ok(listSection.isListSection);
    assert.equal(listSection.tagName, 'ul');
    assert.equal(listSection.items.length, 1);
    assert.equal(listSection.items.head.text, 'abc');
    var item = listSection.items.head;
    assert.equal(item.markers.length, 3);
    assert.equal(item.markers.objectAt(0).value, 'a');
    assert.equal(item.markers.objectAt(1).value, 'b');
    assert.ok(item.markers.objectAt(1).hasMarkup('b'), 'b has b markup');
    assert.equal(item.markers.objectAt(2).value, 'c');
  });

  test('#toggleSection toggle single list item -> p', function (assert) {
    var post = _testHelpers['default'].postAbstract.build(function (_ref51) {
      var post = _ref51.post;
      var listSection = _ref51.listSection;
      var listItem = _ref51.listItem;
      var marker = _ref51.marker;
      var markup = _ref51.markup;

      return post([listSection('ul', [listItem([marker('a'), marker('b', [markup('b')]), marker('c')])])]);
    });

    var mockEditor = renderBuiltAbstract(post);
    var range = _mobiledocKitUtilsCursorRange['default'].create(post.sections.head.items.head, 0);

    postEditor = new _mobiledocKitEditorPost['default'](mockEditor);
    postEditor.toggleSection('ul', range);
    postEditor.complete();

    assert.equal(post.sections.length, 1);
    assert.equal(post.sections.head.tagName, 'p');
    assert.equal(post.sections.head.text, 'abc');
    assert.equal(post.sections.head.markers.length, 3);
    assert.equal(post.sections.head.markers.objectAt(0).value, 'a');
    assert.equal(post.sections.head.markers.objectAt(1).value, 'b');
    assert.ok(post.sections.head.markers.objectAt(1).hasMarkup('b'), 'b has b markup');
    assert.equal(post.sections.head.markers.objectAt(2).value, 'c');

    assert.positionIsEqual(renderedRange.head, post.sections.head.headPosition());
  });

  test('#toggleSection toggle multiple ps -> list and list -> multiple ps', function (assert) {
    var mobiledoc = _testHelpers['default'].mobiledoc.build(function (_ref52) {
      var post = _ref52.post;
      var markupSection = _ref52.markupSection;
      var marker = _ref52.marker;

      return post([markupSection('p', [marker('abc')]), markupSection('p', [marker('123')])]);
    });

    editor = new _mobiledocKit.Editor({ mobiledoc: mobiledoc });
    var _editor = editor;
    var post = _editor.post;

    editor.render(editorElement);
    var range = _mobiledocKitUtilsCursorRange['default'].create(post.sections.head, 0, post.sections.tail, 2);

    postEditor = new _mobiledocKitEditorPost['default'](editor);
    postEditor.toggleSection('ul', range);
    postEditor.complete();

    var listSection = post.sections.head;
    assert.equal(post.sections.length, 1, 'post has 1 list section after toggle');
    assert.ok(listSection.isListSection);
    assert.equal(listSection.tagName, 'ul');
    assert.equal(listSection.items.length, 2, '2 list items');
    assert.equal(listSection.items.head.text, 'abc');
    assert.equal(listSection.items.tail.text, '123');

    range = _mobiledocKitUtilsCursorRange['default'].create(listSection.items.head, 0, listSection.items.tail, 0);
    postEditor = new _mobiledocKitEditorPost['default'](editor);
    postEditor.toggleSection('ul', range);
    postEditor.complete();

    assert.equal(post.sections.length, 2, 'post has 2 sections after toggle');
    assert.equal(post.sections.head.tagName, 'p');
    assert.equal(post.sections.tail.tagName, 'p');
    assert.equal(post.sections.head.text, 'abc');
    assert.equal(post.sections.tail.text, '123');

    assert.ok(editor.range.head.section === post.sections.head, 'selected head correct');
    assert.equal(editor.range.head.offset, 0);
  });

  test('#toggleSection untoggle first list item changes it to markup section, retains markup', function (assert) {
    var post = _testHelpers['default'].postAbstract.build(function (_ref53) {
      var post = _ref53.post;
      var listSection = _ref53.listSection;
      var listItem = _ref53.listItem;
      var marker = _ref53.marker;
      var markup = _ref53.markup;

      return post([listSection('ul', [listItem([marker('a'), marker('b', [markup('b')]), marker('c')]), listItem([marker('def')]), listItem([marker('ghi')])])]);
    });
    var mockEditor = renderBuiltAbstract(post);
    var range = _mobiledocKitUtilsCursorRange['default'].create(post.sections.head.items.head, 0);

    postEditor = new _mobiledocKitEditorPost['default'](mockEditor);
    postEditor.toggleSection('ul', range);
    postEditor.complete();

    assert.equal(post.sections.length, 2, '2 sections');
    assert.equal(post.sections.head.tagName, 'p', 'head section is p');
    assert.equal(post.sections.head.text, 'abc');
    var section = post.sections.head;
    assert.equal(section.markers.length, 3);
    assert.equal(section.markers.objectAt(0).value, 'a');
    assert.ok(section.markers.objectAt(1).hasMarkup('b'), 'b has b markup');
    assert.equal(section.markers.objectAt(2).value, 'c');
    assert.ok(post.sections.tail.isListSection, 'tail is list section');
    assert.equal(post.sections.tail.items.length, 2, '2 items in list');
    assert.equal(post.sections.tail.items.head.text, 'def');
    assert.equal(post.sections.tail.items.tail.text, 'ghi');

    assert.positionIsEqual(renderedRange.head, post.sections.head.headPosition());
  });

  test('#toggleSection untoggle middle list item changes it to markup section, retaining markup', function (assert) {
    var post = _testHelpers['default'].postAbstract.build(function (_ref54) {
      var post = _ref54.post;
      var listSection = _ref54.listSection;
      var listItem = _ref54.listItem;
      var marker = _ref54.marker;
      var markup = _ref54.markup;

      return post([listSection('ul', [listItem([marker('abc')]), listItem([marker('d'), marker('e', [markup('b')]), marker('f')]), listItem([marker('ghi')])])]);
    });
    var mockEditor = renderBuiltAbstract(post);
    var range = _mobiledocKitUtilsCursorRange['default'].create(post.sections.head.items.objectAt(1), 0);

    postEditor = new _mobiledocKitEditorPost['default'](mockEditor);
    postEditor.toggleSection('ul', range);
    postEditor.complete();

    assert.equal(post.sections.length, 3, '3 sections');
    var section = post.sections.objectAt(1);
    assert.equal(section.tagName, 'p', 'middle section is p');
    assert.equal(section.text, 'def');
    assert.equal(section.markers.length, 3);
    assert.equal(section.markers.objectAt(0).value, 'd');
    assert.equal(section.markers.objectAt(1).value, 'e');
    assert.ok(section.markers.objectAt(1).hasMarkup('b'), 'e has b markup');
    assert.equal(section.markers.objectAt(2).value, 'f');
    assert.positionIsEqual(renderedRange.head, section.headPosition());

    assert.ok(post.sections.head.isListSection, 'head section is list');
    assert.ok(post.sections.tail.isListSection, 'tail section is list');
    assert.equal(post.sections.head.items.length, 1, '1 item in first list');
    assert.equal(post.sections.tail.items.length, 1, '1 item in last list');
    assert.equal(post.sections.head.items.head.text, 'abc');
    assert.equal(post.sections.tail.items.head.text, 'ghi');
  });

  test('#toggleSection toggle markup section -> ul between lists joins the lists', function (assert) {
    var mobiledoc = _testHelpers['default'].mobiledoc.build(function (_ref55) {
      var post = _ref55.post;
      var listSection = _ref55.listSection;
      var listItem = _ref55.listItem;
      var marker = _ref55.marker;
      var markupSection = _ref55.markupSection;

      return post([listSection('ul', [listItem([marker('abc')])]), markupSection('p', [marker('123')]), listSection('ul', [listItem([marker('def')])])]);
    });
    editor = new _mobiledocKit.Editor({ mobiledoc: mobiledoc });
    var _editor2 = editor;
    var post = _editor2.post;

    editor.render(editorElement);
    var range = _mobiledocKitUtilsCursorRange['default'].create(post.sections.objectAt(1), 0);

    postEditor = new _mobiledocKitEditorPost['default'](editor);
    postEditor.toggleSection('ul', range);
    postEditor.complete();

    assert.equal(post.sections.length, 1, '1 sections');
    var section = post.sections.head;
    assert.ok(section.isListSection, 'list section');
    assert.equal(section.items.length, 3, '3 items');
    assert.deepEqual(section.items.map(function (i) {
      return i.text;
    }), ['abc', '123', 'def']);

    var listItem = section.items.objectAt(1);
    assert.ok(editor.range.head.section === listItem, 'correct head selection');
    assert.equal(editor.range.head.offset, 0);
  });

  test('#toggleSection untoggle multiple items at end of list changes them to markup sections', function (assert) {
    var post = _testHelpers['default'].postAbstract.build(function (_ref56) {
      var post = _ref56.post;
      var listSection = _ref56.listSection;
      var listItem = _ref56.listItem;
      var marker = _ref56.marker;

      return post([listSection('ul', [listItem([marker('abc')]), listItem([marker('def')]), listItem([marker('ghi')])])]);
    });
    var mockEditor = renderBuiltAbstract(post);
    var range = _mobiledocKitUtilsCursorRange['default'].create(post.sections.head.items.objectAt(1), 0, post.sections.head.items.tail, 0);

    postEditor = new _mobiledocKitEditorPost['default'](mockEditor);
    postEditor.toggleSection('ul', range);
    postEditor.complete();

    assert.equal(post.sections.length, 3, '3 sections');
    assert.ok(post.sections.head.isListSection, 'head section is list');
    assert.equal(post.sections.head.items.length, 1, 'head section has 1 item');
    assert.equal(post.sections.head.items.head.text, 'abc');

    assert.equal(post.sections.objectAt(1).tagName, 'p', 'middle is p');
    assert.equal(post.sections.objectAt(1).text, 'def');
    assert.equal(post.sections.tail.tagName, 'p', 'tail is p');
    assert.equal(post.sections.tail.text, 'ghi');

    assert.positionIsEqual(renderedRange.head, post.sections.objectAt(1).headPosition());
  });

  test('#toggleSection untoggle multiple items at start of list changes them to markup sections', function (assert) {
    var post = _testHelpers['default'].postAbstract.build(function (_ref57) {
      var post = _ref57.post;
      var listSection = _ref57.listSection;
      var listItem = _ref57.listItem;
      var marker = _ref57.marker;

      return post([listSection('ul', [listItem([marker('abc')]), listItem([marker('def')]), listItem([marker('ghi')])])]);
    });
    var mockEditor = renderBuiltAbstract(post);
    var range = _mobiledocKitUtilsCursorRange['default'].create(post.sections.head.items.head, 0, post.sections.head.items.objectAt(1), 0);

    postEditor = new _mobiledocKitEditorPost['default'](mockEditor);
    postEditor.toggleSection('ul', range);
    postEditor.complete();

    assert.equal(post.sections.length, 3, '3 sections');
    assert.equal(post.sections.head.tagName, 'p', 'head section is p');
    assert.equal(post.sections.head.text, 'abc');

    assert.equal(post.sections.objectAt(1).tagName, 'p', '2nd section is p');
    assert.equal(post.sections.objectAt(1).text, 'def');

    assert.ok(post.sections.objectAt(2).isListSection, '3rd section is list');
    assert.equal(post.sections.objectAt(2).items.length, 1, 'list has 1 item');
    assert.equal(post.sections.objectAt(2).items.head.text, 'ghi');

    assert.positionIsEqual(renderedRange.head, post.sections.head.headPosition());
  });

  test('#toggleSection untoggle items and overflowing markup sections changes the overflow to items', function (assert) {
    var mobiledoc = _testHelpers['default'].mobiledoc.build(function (_ref58) {
      var post = _ref58.post;
      var listSection = _ref58.listSection;
      var listItem = _ref58.listItem;
      var markupSection = _ref58.markupSection;
      var marker = _ref58.marker;

      return post([listSection('ul', [listItem([marker('abc')]), listItem([marker('def')]), listItem([marker('ghi')])]), markupSection('p', [marker('123')])]);
    });
    editor = new _mobiledocKit.Editor({ mobiledoc: mobiledoc });
    editor.render(editorElement);
    var _editor3 = editor;
    var post = _editor3.post;

    var range = _mobiledocKitUtilsCursorRange['default'].create(post.sections.head.items.objectAt(1), 0, post.sections.tail, 0);

    postEditor = new _mobiledocKitEditorPost['default'](editor);
    postEditor.toggleSection('ul', range);
    postEditor.complete();

    assert.equal(post.sections.length, 1, '1 section');
    assert.ok(post.sections.head.isListSection, 'head section is list');
    assert.equal(post.sections.head.items.length, 4, 'list has 4 items');

    var text = post.sections.head.items.toArray().map(function (i) {
      return i.text;
    });
    assert.deepEqual(text, ['abc', 'def', 'ghi', '123']);

    assert.ok(editor.range.head.section === post.sections.head.items.objectAt(1), 'selected head correct');
    assert.equal(editor.range.head.offset, 0);
  });

  test('#toggleSection untoggle last list item changes it to markup section', function (assert) {
    var post = _testHelpers['default'].postAbstract.build(function (_ref59) {
      var post = _ref59.post;
      var listSection = _ref59.listSection;
      var listItem = _ref59.listItem;
      var marker = _ref59.marker;

      return post([listSection('ul', [listItem([marker('abc')]), listItem([marker('def')]), listItem([marker('ghi')])])]);
    });
    var mockEditor = renderBuiltAbstract(post);
    var range = _mobiledocKitUtilsCursorRange['default'].create(post.sections.head.items.tail, 0);

    postEditor = new _mobiledocKitEditorPost['default'](mockEditor);
    postEditor.toggleSection('ul', range);
    postEditor.complete();

    assert.equal(post.sections.length, 2, '2 sections');
    assert.ok(post.sections.head.isListSection, 'head section is list');
    assert.equal(post.sections.tail.tagName, 'p', 'tail is p');
    assert.equal(post.sections.tail.text, 'ghi');

    assert.equal(post.sections.head.items.length, 2, '2 items in list');
    assert.equal(post.sections.head.items.head.text, 'abc');
    assert.equal(post.sections.head.items.tail.text, 'def');

    assert.positionIsEqual(renderedRange.head, post.sections.tail.headPosition());
  });

  test('#toggleSection toggle list item to different type of list item', function (assert) {
    var post = _testHelpers['default'].postAbstract.build(function (_ref60) {
      var post = _ref60.post;
      var listSection = _ref60.listSection;
      var listItem = _ref60.listItem;
      var marker = _ref60.marker;

      return post([listSection('ul', [listItem([marker('abc')])])]);
    });

    var range = _mobiledocKitUtilsCursorRange['default'].create(post.sections.head.items.head, 0);

    var mockEditor = renderBuiltAbstract(post);
    postEditor = new _mobiledocKitEditorPost['default'](mockEditor);
    postEditor.toggleSection('ol', range);
    postEditor.complete();

    assert.equal(post.sections.length, 1, '1 section');
    assert.ok(post.sections.head.isListSection, 'section is list');
    assert.equal(post.sections.head.tagName, 'ol', 'section is ol list');
    assert.equal(post.sections.head.items.length, 1, '1 item');
    assert.equal(post.sections.head.items.head.text, 'abc');

    assert.positionIsEqual(renderedRange.head, post.sections.head.items.head.headPosition());
  });

  test('#toggleSection toggle list item to different type of list item when other sections precede it', function (assert) {
    var post = _testHelpers['default'].postAbstract.build(function (_ref61) {
      var post = _ref61.post;
      var listSection = _ref61.listSection;
      var listItem = _ref61.listItem;
      var marker = _ref61.marker;
      var markupSection = _ref61.markupSection;

      return post([markupSection('p', [marker('123')]), listSection('ul', [listItem([marker('abc')])])]);
    });

    var range = _mobiledocKitUtilsCursorRange['default'].create(post.sections.tail.items.head, 0);

    var mockEditor = renderBuiltAbstract(post);
    postEditor = new _mobiledocKitEditorPost['default'](mockEditor);
    postEditor.toggleSection('ol', range);
    postEditor.complete();

    assert.equal(post.sections.length, 2, '2 section');
    assert.equal(post.sections.head.tagName, 'p', '1st section is p');
    assert.equal(post.sections.head.text, '123');
    assert.ok(post.sections.tail.isListSection, 'section is list');
    assert.equal(post.sections.tail.tagName, 'ol', 'section is ol list');
    assert.equal(post.sections.tail.items.length, 1, '1 item');
    assert.equal(post.sections.tail.items.head.text, 'abc');

    assert.positionIsEqual(renderedRange.head, post.sections.tail.items.head.headPosition());
  });

  test('#toggleSection toggle when cursor on card section is no-op', function (assert) {
    var post = _testHelpers['default'].postAbstract.build(function (_ref62) {
      var post = _ref62.post;
      var cardSection = _ref62.cardSection;

      return post([cardSection('my-card')]);
    });

    var range = _mobiledocKitUtilsCursorRange['default'].create(post.sections.head, 0);

    var mockEditor = renderBuiltAbstract(post);
    postEditor = new _mobiledocKitEditorPost['default'](mockEditor);
    postEditor.toggleSection('ol', range);
    postEditor.complete();

    assert.equal(post.sections.length, 1, '1 section');
    assert.ok(post.sections.head.isCardSection, 'still card section');

    assert.positionIsEqual(renderedRange.head, range.head, 'range head is set to same');
    assert.positionIsEqual(renderedRange.tail, range.tail, 'range tail is set to same');
  });

  test('#toggleSection joins contiguous list items', function (assert) {
    var mobiledoc = _testHelpers['default'].mobiledoc.build(function (_ref63) {
      var post = _ref63.post;
      var listSection = _ref63.listSection;
      var listItem = _ref63.listItem;
      var marker = _ref63.marker;

      return post([listSection('ul', [listItem([marker('abc')])]), listSection('ol', [listItem([marker('123')])]), listSection('ul', [listItem([marker('def')])])]);
    });

    editor = new _mobiledocKit.Editor({ mobiledoc: mobiledoc });
    editor.render(editorElement);
    var _editor4 = editor;
    var post = _editor4.post;

    var range = _mobiledocKitUtilsCursorRange['default'].create(post.sections.objectAt(1).items.head, 0);
    postEditor = new _mobiledocKitEditorPost['default'](editor);
    postEditor.toggleSection('ul', range);
    postEditor.complete();

    assert.equal(post.sections.length, 1, '1 section');
    assert.ok(post.sections.head.isListSection, 'is list');
    assert.equal(post.sections.head.items.length, 3, '3 items');
    assert.deepEqual(post.sections.head.items.map(function (i) {
      return i.text;
    }), ['abc', '123', 'def']);
  });

  test('#toggleMarkup when cursor is in non-markerable does nothing', function (assert) {
    editor = buildEditorWithMobiledoc(function (_ref64) {
      var post = _ref64.post;
      var markupSection = _ref64.markupSection;
      var marker = _ref64.marker;
      var cardSection = _ref64.cardSection;

      return post([cardSection('my-card')]);
    });

    var range = new _mobiledocKitUtilsCursorRange['default'](editor.post.sections.head.headPosition());
    postEditor = new _mobiledocKitEditorPost['default'](editor);
    postEditor.toggleMarkup('b', range);
    postEditor.complete();

    assert.ok(editor.post.sections.head.isCardSection);
    assert.positionIsEqual(renderedRange.head, editor.post.sections.head.headPosition());
  });

  test('#toggleMarkup when cursor surrounds non-markerable does nothing', function (assert) {
    editor = buildEditorWithMobiledoc(function (_ref65) {
      var post = _ref65.post;
      var markupSection = _ref65.markupSection;
      var marker = _ref65.marker;
      var cardSection = _ref65.cardSection;

      return post([cardSection('my-card')]);
    });

    var range = _mobiledocKitUtilsCursorRange['default'].fromSection(editor.post.sections.head);
    postEditor = new _mobiledocKitEditorPost['default'](editor);
    postEditor.toggleMarkup('b', range);
    postEditor.complete();

    assert.ok(editor.post.sections.head.isCardSection);
    assert.positionIsEqual(renderedRange.head, editor.post.sections.head.headPosition());
  });

  test('#toggleMarkup when range has the markup removes it', function (assert) {
    editor = buildEditorWithMobiledoc(function (_ref66) {
      var post = _ref66.post;
      var markupSection = _ref66.markupSection;
      var marker = _ref66.marker;
      var markup = _ref66.markup;

      return post([markupSection('p', [marker('abc', [markup('b')])])]);
    });
    var expected = _testHelpers['default'].postAbstract.build(function (_ref67) {
      var post = _ref67.post;
      var markupSection = _ref67.markupSection;
      var marker = _ref67.marker;

      return post([markupSection('p', [marker('abc')])]);
    });

    var range = _mobiledocKitUtilsCursorRange['default'].fromSection(editor.post.sections.head);
    postEditor = new _mobiledocKitEditorPost['default'](editor);
    postEditor.toggleMarkup('b', range);
    postEditor.complete();

    assert.positionIsEqual(renderedRange.head, editor.post.sections.head.headPosition());
    assert.positionIsEqual(renderedRange.tail, editor.post.sections.head.tailPosition());
    assert.postIsSimilar(editor.post, expected);
  });

  test('#toggleMarkup when only some of the range has it removes it', function (assert) {
    editor = buildEditorWithMobiledoc(function (_ref68) {
      var post = _ref68.post;
      var markupSection = _ref68.markupSection;
      var marker = _ref68.marker;
      var markup = _ref68.markup;

      return post([markupSection('p', [marker('a'), marker('b', [markup('b')]), marker('c')])]);
    });
    var expected = _testHelpers['default'].postAbstract.build(function (_ref69) {
      var post = _ref69.post;
      var markupSection = _ref69.markupSection;
      var marker = _ref69.marker;

      return post([markupSection('p', [marker('abc')])]);
    });

    var range = _mobiledocKitUtilsCursorRange['default'].fromSection(editor.post.sections.head);
    postEditor = new _mobiledocKitEditorPost['default'](editor);
    postEditor.toggleMarkup('b', range);
    postEditor.complete();

    assert.positionIsEqual(renderedRange.head, editor.post.sections.head.headPosition());
    assert.positionIsEqual(renderedRange.tail, editor.post.sections.head.tailPosition());
    assert.postIsSimilar(editor.post, expected);
  });

  test('#toggleMarkup when range does not have the markup adds it', function (assert) {
    editor = buildEditorWithMobiledoc(function (_ref70) {
      var post = _ref70.post;
      var markupSection = _ref70.markupSection;
      var marker = _ref70.marker;

      return post([markupSection('p', [marker('abc')])]);
    });
    var expected = _testHelpers['default'].postAbstract.build(function (_ref71) {
      var post = _ref71.post;
      var markupSection = _ref71.markupSection;
      var marker = _ref71.marker;
      var markup = _ref71.markup;

      return post([markupSection('p', [marker('abc', [markup('b')])])]);
    });

    var range = _mobiledocKitUtilsCursorRange['default'].fromSection(editor.post.sections.head);
    postEditor = new _mobiledocKitEditorPost['default'](editor);
    postEditor.toggleMarkup('b', range);
    postEditor.complete();

    assert.positionIsEqual(renderedRange.head, editor.post.sections.head.headPosition());
    assert.positionIsEqual(renderedRange.tail, editor.post.sections.head.tailPosition());
    assert.postIsSimilar(editor.post, expected);
  });

  if (!(0, _helpersBrowsers.detectIE11)()) {
    // TODO: Make this test pass on IE11
    test('#toggleMarkup when the editor has no cursor', function (assert) {
      editor = buildEditorWithMobiledoc(function (_ref72) {
        var post = _ref72.post;
        var markupSection = _ref72.markupSection;
        var marker = _ref72.marker;

        return post([markupSection('p', [marker('abc')])]);
      });
      var expected = _testHelpers['default'].postAbstract.build(function (_ref73) {
        var post = _ref73.post;
        var markupSection = _ref73.markupSection;
        var marker = _ref73.marker;

        return post([markupSection('p', [marker('abc')])]);
      });

      editorElement.blur();
      (0, _mobiledocKitUtilsSelectionUtils.clearSelection)();
      postEditor = new _mobiledocKitEditorPost['default'](editor);
      postEditor.toggleMarkup('b');
      postEditor.complete();

      assert.postIsSimilar(editor.post, expected);
      assert.equal(window.getSelection().rangeCount, 0, 'nothing is selected');
      assert.ok(document.activeElement !== editorElement, 'active element is not editor element');
      assert.ok(renderedRange.isBlank, 'rendered range is blank');
    });
  }

  test('#insertMarkers inserts an atom', function (assert) {
    var toInsert = undefined,
        expected = undefined;
    _testHelpers['default'].postAbstract.build(function (_ref74) {
      var post = _ref74.post;
      var markupSection = _ref74.markupSection;
      var marker = _ref74.marker;
      var markup = _ref74.markup;
      var atom = _ref74.atom;

      toInsert = [atom('simple-atom', '123', [markup('b')])];
      expected = post([markupSection('p', [marker('abc'), atom('simple-atom', '123', [markup('b')]), marker('def')])]);
    });

    editor = buildEditorWithMobiledoc(function (_ref75) {
      var post = _ref75.post;
      var markupSection = _ref75.markupSection;
      var marker = _ref75.marker;

      return post([markupSection('p', [marker('abcdef')])]);
    });
    var position = new _mobiledocKitUtilsCursorPosition['default'](editor.post.sections.head, 'abc'.length);
    postEditor = new _mobiledocKitEditorPost['default'](editor);
    postEditor.insertMarkers(position, toInsert);
    postEditor.complete();

    assert.postIsSimilar(editor.post, expected);
    assert.renderTreeIsEqual(editor._renderTree, expected);
    assert.positionIsEqual(renderedRange.head, new _mobiledocKitUtilsCursorPosition['default'](editor.post.sections.head, 4));
  });

  test('#insertMarkers inserts the markers in middle, merging markups', function (assert) {
    var toInsert = undefined,
        expected = undefined;
    _testHelpers['default'].postAbstract.build(function (_ref76) {
      var post = _ref76.post;
      var markupSection = _ref76.markupSection;
      var marker = _ref76.marker;
      var markup = _ref76.markup;

      toInsert = [marker('123', [markup('b')]), marker('456')];
      expected = post([markupSection('p', [marker('abc'), marker('123', [markup('b')]), marker('456def')])]);
    });

    editor = buildEditorWithMobiledoc(function (_ref77) {
      var post = _ref77.post;
      var markupSection = _ref77.markupSection;
      var marker = _ref77.marker;

      return post([markupSection('p', [marker('abcdef')])]);
    });
    var position = new _mobiledocKitUtilsCursorPosition['default'](editor.post.sections.head, 'abc'.length);
    postEditor = new _mobiledocKitEditorPost['default'](editor);
    postEditor.insertMarkers(position, toInsert);
    postEditor.complete();

    assert.postIsSimilar(editor.post, expected);
    assert.renderTreeIsEqual(editor._renderTree, expected);
    assert.positionIsEqual(renderedRange.head, new _mobiledocKitUtilsCursorPosition['default'](editor.post.sections.head, 'abc123456'.length));
  });

  test('#insertMarkers inserts the markers when the markerable has no markers', function (assert) {
    var toInsert = undefined,
        expected = undefined;
    _testHelpers['default'].postAbstract.build(function (_ref78) {
      var post = _ref78.post;
      var markupSection = _ref78.markupSection;
      var marker = _ref78.marker;
      var markup = _ref78.markup;

      toInsert = [marker('123', [markup('b')]), marker('456')];
      expected = post([markupSection('p', [marker('123', [markup('b')]), marker('456')])]);
    });

    editor = buildEditorWithMobiledoc(function (_ref79) {
      var post = _ref79.post;
      var markupSection = _ref79.markupSection;

      return post([markupSection()]);
    });
    var position = editor.post.sections.head.headPosition();
    postEditor = new _mobiledocKitEditorPost['default'](editor);
    postEditor.insertMarkers(position, toInsert);
    postEditor.complete();

    assert.postIsSimilar(editor.post, expected);
    assert.renderTreeIsEqual(editor._renderTree, expected);
    assert.positionIsEqual(renderedRange.head, new _mobiledocKitUtilsCursorPosition['default'](editor.post.sections.head, '123456'.length));
  });

  test('#insertMarkers inserts the markers at start', function (assert) {
    var toInsert = undefined,
        expected = undefined;
    _testHelpers['default'].postAbstract.build(function (_ref80) {
      var post = _ref80.post;
      var markupSection = _ref80.markupSection;
      var marker = _ref80.marker;
      var markup = _ref80.markup;

      toInsert = [marker('123', [markup('b')]), marker('456')];
      expected = post([markupSection('p', [marker('123', [markup('b')]), marker('456abc')])]);
    });

    editor = buildEditorWithMobiledoc(function (_ref81) {
      var post = _ref81.post;
      var markupSection = _ref81.markupSection;
      var marker = _ref81.marker;

      return post([markupSection('p', [marker('abc')])]);
    });
    var position = editor.post.sections.head.headPosition();
    postEditor = new _mobiledocKitEditorPost['default'](editor);
    postEditor.insertMarkers(position, toInsert);
    postEditor.complete();

    assert.postIsSimilar(editor.post, expected);
    assert.renderTreeIsEqual(editor._renderTree, expected);
    assert.positionIsEqual(renderedRange.head, new _mobiledocKitUtilsCursorPosition['default'](editor.post.sections.head, '123456'.length));
  });

  test('#insertMarkers inserts the markers at end', function (assert) {
    var toInsert = undefined,
        expected = undefined;
    _testHelpers['default'].postAbstract.build(function (_ref82) {
      var post = _ref82.post;
      var markupSection = _ref82.markupSection;
      var marker = _ref82.marker;
      var markup = _ref82.markup;

      toInsert = [marker('123', [markup('b')]), marker('456')];
      expected = post([markupSection('p', [marker('abc'), marker('123', [markup('b')]), marker('456')])]);
    });

    editor = buildEditorWithMobiledoc(function (_ref83) {
      var post = _ref83.post;
      var markupSection = _ref83.markupSection;
      var marker = _ref83.marker;

      return post([markupSection('p', [marker('abc')])]);
    });
    var position = editor.post.sections.head.tailPosition();
    postEditor = new _mobiledocKitEditorPost['default'](editor);
    postEditor.insertMarkers(position, toInsert);
    postEditor.complete();

    assert.postIsSimilar(editor.post, expected);
    assert.renderTreeIsEqual(editor._renderTree, expected);
    assert.positionIsEqual(renderedRange.head, editor.post.sections.head.tailPosition());
  });

  test('#insertMarkers throws if the position is not markerable', function (assert) {
    var toInsert = undefined;
    _testHelpers['default'].postAbstract.build(function (_ref84) {
      var post = _ref84.post;
      var markupSection = _ref84.markupSection;
      var marker = _ref84.marker;
      var markup = _ref84.markup;

      toInsert = [marker('123', [markup('b')]), marker('456')];
    });

    editor = buildEditorWithMobiledoc(function (_ref85) {
      var post = _ref85.post;
      var cardSection = _ref85.cardSection;

      return post([cardSection('some-card')]);
    });
    var position = editor.post.sections.head.tailPosition();
    postEditor = new _mobiledocKitEditorPost['default'](editor);

    assert.throws(function () {
      postEditor.insertMarkers(position, toInsert);
    }, /cannot insert.*non-markerable/i);
  });

  test('#insertText is no-op if the position section is not markerable', function (assert) {
    var toInsert = '123';
    var expected = _testHelpers['default'].postAbstract.build(function (_ref86) {
      var post = _ref86.post;
      var cardSection = _ref86.cardSection;

      return post([cardSection('test-card')]);
    });
    editor = buildEditorWithMobiledoc(function (_ref87) {
      var post = _ref87.post;
      var cardSection = _ref87.cardSection;

      return post([cardSection('test-card')]);
    });
    var position = editor.post.sections.head.headPosition();
    postEditor = new _mobiledocKitEditorPost['default'](editor);
    postEditor.insertText(position, toInsert);
    postEditor.complete();

    assert.postIsSimilar(editor.post, expected);
    assert.renderTreeIsEqual(editor._renderTree, expected);
    assert.ok(!renderedRange, 'no range is rendered since nothing happened');
  });

  test('#insertText inserts the text at start', function (assert) {
    var toInsert = undefined,
        expected = undefined;
    _testHelpers['default'].postAbstract.build(function (_ref88) {
      var post = _ref88.post;
      var markupSection = _ref88.markupSection;
      var marker = _ref88.marker;
      var markup = _ref88.markup;

      toInsert = '123';
      expected = post([markupSection('p', [marker('123abc', [markup('b')])])]);
    });

    editor = buildEditorWithMobiledoc(function (_ref89) {
      var post = _ref89.post;
      var markupSection = _ref89.markupSection;
      var marker = _ref89.marker;
      var markup = _ref89.markup;

      return post([markupSection('p', [marker('abc', [markup('b')])])]);
    });
    var position = editor.post.sections.head.headPosition();
    postEditor = new _mobiledocKitEditorPost['default'](editor);
    postEditor.insertText(position, toInsert);
    postEditor.complete();

    assert.postIsSimilar(editor.post, expected);
    assert.renderTreeIsEqual(editor._renderTree, expected);
    assert.positionIsEqual(renderedRange.head, new _mobiledocKitUtilsCursorPosition['default'](editor.post.sections.head, '123'.length));
  });

  test('#insertText inserts text in the middle', function (assert) {
    var toInsert = undefined,
        expected = undefined;
    _testHelpers['default'].postAbstract.build(function (_ref90) {
      var post = _ref90.post;
      var markupSection = _ref90.markupSection;
      var marker = _ref90.marker;
      var markup = _ref90.markup;

      toInsert = '123';
      expected = post([markupSection('p', [marker('ab123c', [markup('b')])])]);
    });

    editor = buildEditorWithMobiledoc(function (_ref91) {
      var post = _ref91.post;
      var markupSection = _ref91.markupSection;
      var marker = _ref91.marker;
      var markup = _ref91.markup;

      return post([markupSection('p', [marker('abc', [markup('b')])])]);
    });
    var position = new _mobiledocKitUtilsCursorPosition['default'](editor.post.sections.head, 'ab'.length);
    postEditor = new _mobiledocKitEditorPost['default'](editor);
    postEditor.insertText(position, toInsert);
    postEditor.complete();

    assert.postIsSimilar(editor.post, expected);
    assert.renderTreeIsEqual(editor._renderTree, expected);
    assert.positionIsEqual(renderedRange.head, new _mobiledocKitUtilsCursorPosition['default'](editor.post.sections.head, 'ab123'.length));
  });

  test('#insertText inserts text at the end', function (assert) {
    var toInsert = undefined,
        expected = undefined;
    _testHelpers['default'].postAbstract.build(function (_ref92) {
      var post = _ref92.post;
      var markupSection = _ref92.markupSection;
      var marker = _ref92.marker;
      var markup = _ref92.markup;

      toInsert = '123';
      expected = post([markupSection('p', [marker('abc123', [markup('b')])])]);
    });

    editor = buildEditorWithMobiledoc(function (_ref93) {
      var post = _ref93.post;
      var markupSection = _ref93.markupSection;
      var marker = _ref93.marker;
      var markup = _ref93.markup;

      return post([markupSection('p', [marker('abc', [markup('b')])])]);
    });
    var position = editor.post.sections.head.tailPosition();
    postEditor = new _mobiledocKitEditorPost['default'](editor);
    postEditor.insertText(position, toInsert);
    postEditor.complete();

    assert.postIsSimilar(editor.post, expected);
    assert.renderTreeIsEqual(editor._renderTree, expected);
    assert.positionIsEqual(renderedRange.head, editor.post.sections.head.tailPosition());
  });

  test('#_splitListItem creates two list items', function (assert) {
    var expected = _testHelpers['default'].postAbstract.build(function (_ref94) {
      var post = _ref94.post;
      var listSection = _ref94.listSection;
      var listItem = _ref94.listItem;
      var marker = _ref94.marker;
      var markup = _ref94.markup;

      return post([listSection('ul', [listItem([marker('abc'), marker('bo', [markup('b')])]), listItem([marker('ld', [markup('b')])])])]);
    });
    editor = buildEditorWithMobiledoc(function (_ref95) {
      var post = _ref95.post;
      var listSection = _ref95.listSection;
      var listItem = _ref95.listItem;
      var marker = _ref95.marker;
      var markup = _ref95.markup;

      return post([listSection('ul', [listItem([marker('abc'), marker('bold', [markup('b')])])])]);
    });

    var item = editor.post.sections.head.items.head;
    var position = new _mobiledocKitUtilsCursorPosition['default'](item, 'abcbo'.length);
    postEditor = new _mobiledocKitEditorPost['default'](editor);
    postEditor._splitListItem(item, position);
    postEditor.complete();

    assert.postIsSimilar(editor.post, expected);
    assert.renderTreeIsEqual(editor._renderTree, expected);
  });

  test('#_splitListItem when position is start creates blank list item', function (assert) {
    var expected = _testHelpers['default'].postAbstract.build(function (_ref96) {
      var post = _ref96.post;
      var listSection = _ref96.listSection;
      var listItem = _ref96.listItem;
      var marker = _ref96.marker;

      return post([listSection('ul', [listItem([marker('')]), listItem([marker('abc')])])]);
    });
    editor = buildEditorWithMobiledoc(function (_ref97) {
      var post = _ref97.post;
      var listSection = _ref97.listSection;
      var listItem = _ref97.listItem;
      var marker = _ref97.marker;

      return post([listSection('ul', [listItem([marker('abc')])])]);
    });

    var item = editor.post.sections.head.items.head;
    var position = item.headPosition();
    postEditor = new _mobiledocKitEditorPost['default'](editor);
    postEditor._splitListItem(item, position);
    postEditor.complete();

    assert.postIsSimilar(editor.post, expected);
  });
});
define('tests/unit/editor/post/insert-post-test', ['exports', 'mobiledoc-kit/editor/post', 'mobiledoc-kit', '../../../test-helpers', 'mobiledoc-kit/utils/cursor/position'], function (exports, _mobiledocKitEditorPost, _mobiledocKit, _testHelpers, _mobiledocKitUtilsCursorPosition) {
  'use strict';

  var _module = _testHelpers['default'].module;
  var test = _testHelpers['default'].test;

  var editor = undefined,
      editorElement = undefined,
      postEditor = undefined,
      renderedRange = undefined;
  // see https://github.com/bustlelabs/mobiledoc-kit/issues/259
  _module('Unit: PostEditor: #insertPost', {
    beforeEach: function beforeEach() {
      editorElement = $('#editor')[0];
    },

    afterEach: function afterEach() {
      if (editor) {
        editor.destroy();
        editor = null;
      }
    }
  });

  function buildEditorWithMobiledoc(builderFn) {
    var mobiledoc = _testHelpers['default'].mobiledoc.build(builderFn);
    var unknownCardHandler = function unknownCardHandler() {};
    editor = new _mobiledocKit.Editor({ mobiledoc: mobiledoc, unknownCardHandler: unknownCardHandler });
    editor.render(editorElement);
    editor.renderRange = function () {
      renderedRange = this.range;
    };
    return editor;
  }

  test('in blank section replaces it', function (assert) {
    var toInsert = undefined,
        expected = undefined;
    _testHelpers['default'].postAbstract.build(function (_ref) {
      var post = _ref.post;
      var listSection = _ref.listSection;
      var listItem = _ref.listItem;
      var marker = _ref.marker;

      toInsert = post([listSection('ul', [listItem([marker('abc')])])]);
      expected = post([listSection('ul', [listItem([marker('abc')])])]);
    });

    editor = buildEditorWithMobiledoc(function (_ref2) {
      var post = _ref2.post;
      var markupSection = _ref2.markupSection;

      return post([markupSection()]);
    });

    var position = editor.post.sections.head.headPosition();
    postEditor = new _mobiledocKitEditorPost['default'](editor);
    postEditor.insertPost(position, toInsert);
    postEditor.complete();

    assert.renderTreeIsEqual(editor._renderTree, expected);
    assert.postIsSimilar(editor.post, expected);
    assert.positionIsEqual(renderedRange.head, editor.post.sections.head.items.tail.tailPosition(), 'cursor at end of pasted content');
  });

  test('in non-markerable at start inserts before', function (assert) {
    var toInsert = undefined,
        expected = undefined;
    _testHelpers['default'].postAbstract.build(function (_ref3) {
      var post = _ref3.post;
      var cardSection = _ref3.cardSection;
      var markupSection = _ref3.markupSection;
      var marker = _ref3.marker;

      toInsert = post([markupSection('p', [marker('abc')])]);
      expected = post([markupSection('p', [marker('abc')]), cardSection('my-card', { foo: 'bar' })]);
    });

    editor = buildEditorWithMobiledoc(function (_ref4) {
      var post = _ref4.post;
      var cardSection = _ref4.cardSection;

      return post([cardSection('my-card', { foo: 'bar' })]);
    });

    var position = editor.post.sections.head.headPosition();
    postEditor = new _mobiledocKitEditorPost['default'](editor);
    postEditor.insertPost(position, toInsert);
    postEditor.complete();

    assert.renderTreeIsEqual(editor._renderTree, expected);
    assert.postIsSimilar(editor.post, expected);
    var expectedSection = editor.post.sections.head;
    assert.positionIsEqual(renderedRange.head, expectedSection.tailPosition(), 'cursor at end of pasted');
  });

  test('in non-markerable at end inserts after', function (assert) {
    var toInsert = undefined,
        expected = undefined;
    _testHelpers['default'].postAbstract.build(function (_ref5) {
      var post = _ref5.post;
      var cardSection = _ref5.cardSection;
      var markupSection = _ref5.markupSection;
      var marker = _ref5.marker;

      toInsert = post([markupSection('p', [marker('abc')])]);
      expected = post([cardSection('my-card', { foo: 'bar' }), markupSection('p', [marker('abc')])]);
    });

    editor = buildEditorWithMobiledoc(function (_ref6) {
      var post = _ref6.post;
      var cardSection = _ref6.cardSection;

      return post([cardSection('my-card', { foo: 'bar' })]);
    });

    var position = editor.post.sections.head.tailPosition();
    postEditor = new _mobiledocKitEditorPost['default'](editor);
    postEditor.insertPost(position, toInsert);
    postEditor.complete();

    assert.renderTreeIsEqual(editor._renderTree, expected);
    assert.postIsSimilar(editor.post, expected);
    var expectedSection = editor.post.sections.tail;
    assert.positionIsEqual(renderedRange.head, expectedSection.tailPosition(), 'cursor at end of pasted');
  });

  test('in non-nested markerable at start and paste is single non-markerable', function (assert) {
    var toInsert = undefined,
        expected = undefined;
    _testHelpers['default'].postAbstract.build(function (_ref7) {
      var post = _ref7.post;
      var cardSection = _ref7.cardSection;
      var markupSection = _ref7.markupSection;
      var marker = _ref7.marker;

      toInsert = post([cardSection('my-card', { foo: 'bar' })]);
      expected = post([cardSection('my-card', { foo: 'bar' }), markupSection('p', [marker('abc')])]);
    });

    editor = buildEditorWithMobiledoc(function (_ref8) {
      var post = _ref8.post;
      var markupSection = _ref8.markupSection;
      var marker = _ref8.marker;

      return post([markupSection('p', [marker('abc')])]);
    });

    var position = editor.post.sections.head.headPosition();
    postEditor = new _mobiledocKitEditorPost['default'](editor);
    postEditor.insertPost(position, toInsert);
    postEditor.complete();

    assert.renderTreeIsEqual(editor._renderTree, expected);
    assert.postIsSimilar(editor.post, expected);
    var expectedSection = editor.post.sections.head;
    assert.positionIsEqual(renderedRange.head, expectedSection.tailPosition(), 'cursor at end of pasted');
  });

  test('in non-nested markerable at end and paste is single non-markerable', function (assert) {
    var toInsert = undefined,
        expected = undefined;
    _testHelpers['default'].postAbstract.build(function (_ref9) {
      var post = _ref9.post;
      var cardSection = _ref9.cardSection;
      var markupSection = _ref9.markupSection;
      var marker = _ref9.marker;

      toInsert = post([cardSection('my-card', { foo: 'bar' })]);
      expected = post([markupSection('p', [marker('abc')]), cardSection('my-card', { foo: 'bar' })]);
    });

    editor = buildEditorWithMobiledoc(function (_ref10) {
      var post = _ref10.post;
      var markupSection = _ref10.markupSection;
      var marker = _ref10.marker;

      return post([markupSection('p', [marker('abc')])]);
    });

    var position = editor.post.sections.head.tailPosition();
    postEditor = new _mobiledocKitEditorPost['default'](editor);
    postEditor.insertPost(position, toInsert);
    postEditor.complete();

    assert.renderTreeIsEqual(editor._renderTree, expected);
    assert.postIsSimilar(editor.post, expected);
    var expectedSection = editor.post.sections.tail; // card
    assert.positionIsEqual(renderedRange.head, expectedSection.tailPosition(), 'cursor at end of pasted');
  });

  test('in non-nested markerable at middle and paste is single non-markerable', function (assert) {
    var toInsert = undefined,
        expected = undefined;
    _testHelpers['default'].postAbstract.build(function (_ref11) {
      var post = _ref11.post;
      var cardSection = _ref11.cardSection;
      var markupSection = _ref11.markupSection;
      var marker = _ref11.marker;

      toInsert = post([cardSection('my-card', { foo: 'bar' })]);
      expected = post([markupSection('p', [marker('ab')]), cardSection('my-card', { foo: 'bar' }), markupSection('p', [marker('c')])]);
    });

    editor = buildEditorWithMobiledoc(function (_ref12) {
      var post = _ref12.post;
      var markupSection = _ref12.markupSection;
      var marker = _ref12.marker;

      return post([markupSection('p', [marker('abc')])]);
    });

    var position = new _mobiledocKitUtilsCursorPosition['default'](editor.post.sections.head, 'ab'.length);
    postEditor = new _mobiledocKitEditorPost['default'](editor);
    postEditor.insertPost(position, toInsert);
    postEditor.complete();

    assert.renderTreeIsEqual(editor._renderTree, expected);
    assert.postIsSimilar(editor.post, expected);
    var expectedSection = editor.post.sections.objectAt(1);
    assert.positionIsEqual(renderedRange.head, expectedSection.tailPosition(), 'cursor at end of pasted');
  });

  test('in non-nested markerable at start and paste starts with non-markerable and ends with markerable', function (assert) {
    var toInsert = undefined,
        expected = undefined;
    _testHelpers['default'].postAbstract.build(function (_ref13) {
      var post = _ref13.post;
      var cardSection = _ref13.cardSection;
      var markupSection = _ref13.markupSection;
      var marker = _ref13.marker;

      toInsert = post([cardSection('my-card', { foo: 'bar' }), markupSection('p', [marker('def')])]);
      expected = post([cardSection('my-card', { foo: 'bar' }), markupSection('p', [marker('def')]), markupSection('p', [marker('abc')])]);
    });

    editor = buildEditorWithMobiledoc(function (_ref14) {
      var post = _ref14.post;
      var markupSection = _ref14.markupSection;
      var marker = _ref14.marker;

      return post([markupSection('p', [marker('abc')])]);
    });

    var position = editor.post.sections.head.headPosition();
    postEditor = new _mobiledocKitEditorPost['default'](editor);
    postEditor.insertPost(position, toInsert);
    postEditor.complete();

    assert.renderTreeIsEqual(editor._renderTree, expected);
    assert.postIsSimilar(editor.post, expected);
    var expectedSection = editor.post.sections.objectAt(1);
    assert.positionIsEqual(renderedRange.head, expectedSection.tailPosition(), 'cursor at end of pasted');
  });

  test('in non-nested markerable at middle and paste starts with non-markerable and ends with markerable', function (assert) {
    var toInsert = undefined,
        expected = undefined;
    _testHelpers['default'].postAbstract.build(function (_ref15) {
      var post = _ref15.post;
      var cardSection = _ref15.cardSection;
      var markupSection = _ref15.markupSection;
      var marker = _ref15.marker;

      toInsert = post([cardSection('my-card', { foo: 'bar' }), markupSection('p', [marker('def')])]);
      expected = post([markupSection('p', [marker('ab')]), cardSection('my-card', { foo: 'bar' }), markupSection('p', [marker('def')]), markupSection('p', [marker('c')])]);
    });

    editor = buildEditorWithMobiledoc(function (_ref16) {
      var post = _ref16.post;
      var markupSection = _ref16.markupSection;
      var marker = _ref16.marker;

      return post([markupSection('p', [marker('abc')])]);
    });

    var position = new _mobiledocKitUtilsCursorPosition['default'](editor.post.sections.head, 'ab'.length);
    postEditor = new _mobiledocKitEditorPost['default'](editor);
    postEditor.insertPost(position, toInsert);
    postEditor.complete();

    assert.renderTreeIsEqual(editor._renderTree, expected);
    assert.postIsSimilar(editor.post, expected);
    var expectedSection = editor.post.sections.objectAt(2);
    assert.positionIsEqual(renderedRange.head, new _mobiledocKitUtilsCursorPosition['default'](expectedSection, 'def'.length), 'cursor at end of pasted');
  });

  test('in non-nested markerable at end and paste starts with non-markerable and ends with markerable', function (assert) {
    var toInsert = undefined,
        expected = undefined;
    _testHelpers['default'].postAbstract.build(function (_ref17) {
      var post = _ref17.post;
      var cardSection = _ref17.cardSection;
      var markupSection = _ref17.markupSection;
      var marker = _ref17.marker;

      toInsert = post([cardSection('my-card', { foo: 'bar' }), markupSection('p', [marker('def')])]);
      expected = post([markupSection('p', [marker('abc')]), cardSection('my-card', { foo: 'bar' }), markupSection('p', [marker('def')])]);
    });

    editor = buildEditorWithMobiledoc(function (_ref18) {
      var post = _ref18.post;
      var markupSection = _ref18.markupSection;
      var marker = _ref18.marker;

      return post([markupSection('p', [marker('abc')])]);
    });

    var position = editor.post.sections.head.tailPosition();
    postEditor = new _mobiledocKitEditorPost['default'](editor);
    postEditor.insertPost(position, toInsert);
    postEditor.complete();

    assert.renderTreeIsEqual(editor._renderTree, expected);
    assert.postIsSimilar(editor.post, expected);
    var expectedSection = editor.post.sections.tail;
    assert.positionIsEqual(renderedRange.head, new _mobiledocKitUtilsCursorPosition['default'](expectedSection, 'def'.length), 'cursor at end of pasted');
  });

  test('in non-nested markerable at start and paste is single non-nested markerable', function (assert) {
    var toInsert = undefined,
        expected = undefined;
    _testHelpers['default'].postAbstract.build(function (_ref19) {
      var post = _ref19.post;
      var cardSection = _ref19.cardSection;
      var markupSection = _ref19.markupSection;
      var marker = _ref19.marker;

      toInsert = post([markupSection('p', [marker('123')])]);
      expected = post([markupSection('p', [marker('123abc')])]);
    });

    editor = buildEditorWithMobiledoc(function (_ref20) {
      var post = _ref20.post;
      var markupSection = _ref20.markupSection;
      var marker = _ref20.marker;

      return post([markupSection('p', [marker('abc')])]);
    });

    var position = editor.post.sections.head.headPosition();
    postEditor = new _mobiledocKitEditorPost['default'](editor);
    postEditor.insertPost(position, toInsert);
    postEditor.complete();

    assert.renderTreeIsEqual(editor._renderTree, expected);
    assert.postIsSimilar(editor.post, expected);
    var expectedSection = editor.post.sections.head;
    assert.positionIsEqual(renderedRange.head, new _mobiledocKitUtilsCursorPosition['default'](expectedSection, '123'.length), 'cursor at end of pasted');
  });

  test('in non-nested markerable at middle and paste is single non-nested markerable', function (assert) {
    var toInsert = undefined,
        expected = undefined;
    _testHelpers['default'].postAbstract.build(function (_ref21) {
      var post = _ref21.post;
      var cardSection = _ref21.cardSection;
      var markupSection = _ref21.markupSection;
      var marker = _ref21.marker;

      toInsert = post([markupSection('p', [marker('123')])]);
      expected = post([markupSection('p', [marker('ab123c')])]);
    });

    editor = buildEditorWithMobiledoc(function (_ref22) {
      var post = _ref22.post;
      var markupSection = _ref22.markupSection;
      var marker = _ref22.marker;

      return post([markupSection('p', [marker('abc')])]);
    });

    var position = new _mobiledocKitUtilsCursorPosition['default'](editor.post.sections.head, 'ab'.length);
    postEditor = new _mobiledocKitEditorPost['default'](editor);
    postEditor.insertPost(position, toInsert);
    postEditor.complete();

    assert.renderTreeIsEqual(editor._renderTree, expected);
    assert.postIsSimilar(editor.post, expected);
    var expectedSection = editor.post.sections.head;
    assert.positionIsEqual(renderedRange.head, new _mobiledocKitUtilsCursorPosition['default'](expectedSection, 'ab123'.length), 'cursor at end of pasted');
  });

  test('in non-nested markerable at end and paste is single non-nested markerable', function (assert) {
    var toInsert = undefined,
        expected = undefined;
    _testHelpers['default'].postAbstract.build(function (_ref23) {
      var post = _ref23.post;
      var cardSection = _ref23.cardSection;
      var markupSection = _ref23.markupSection;
      var marker = _ref23.marker;

      toInsert = post([markupSection('p', [marker('123')])]);
      expected = post([markupSection('p', [marker('abc123')])]);
    });

    editor = buildEditorWithMobiledoc(function (_ref24) {
      var post = _ref24.post;
      var markupSection = _ref24.markupSection;
      var marker = _ref24.marker;

      return post([markupSection('p', [marker('abc')])]);
    });

    var position = editor.post.sections.head.tailPosition();
    postEditor = new _mobiledocKitEditorPost['default'](editor);
    postEditor.insertPost(position, toInsert);
    postEditor.complete();

    assert.renderTreeIsEqual(editor._renderTree, expected);
    assert.postIsSimilar(editor.post, expected);
    var expectedSection = editor.post.sections.head;
    assert.positionIsEqual(renderedRange.head, expectedSection.tailPosition(), 'cursor at end of pasted');
  });

  test('in non-nested markerable at start and paste is list with 1 item and no more sections', function (assert) {
    var toInsert = undefined,
        expected = undefined;
    _testHelpers['default'].postAbstract.build(function (_ref25) {
      var post = _ref25.post;
      var cardSection = _ref25.cardSection;
      var markupSection = _ref25.markupSection;
      var listSection = _ref25.listSection;
      var listItem = _ref25.listItem;
      var marker = _ref25.marker;

      toInsert = post([listSection('ul', [listItem([marker('123')])])]);
      expected = post([markupSection('p', [marker('123abc')])]);
    });

    editor = buildEditorWithMobiledoc(function (_ref26) {
      var post = _ref26.post;
      var markupSection = _ref26.markupSection;
      var marker = _ref26.marker;

      return post([markupSection('p', [marker('abc')])]);
    });

    var position = editor.post.sections.head.headPosition();
    postEditor = new _mobiledocKitEditorPost['default'](editor);
    postEditor.insertPost(position, toInsert);
    postEditor.complete();

    assert.renderTreeIsEqual(editor._renderTree, expected);
    assert.postIsSimilar(editor.post, expected);
    var expectedSection = editor.post.sections.head;
    assert.positionIsEqual(renderedRange.head, new _mobiledocKitUtilsCursorPosition['default'](expectedSection, '123'.length), 'cursor at end of pasted');
  });

  test('in non-nested markerable at middle and paste is list with 1 item and no more sections', function (assert) {
    var toInsert = undefined,
        expected = undefined;
    _testHelpers['default'].postAbstract.build(function (_ref27) {
      var post = _ref27.post;
      var cardSection = _ref27.cardSection;
      var markupSection = _ref27.markupSection;
      var listSection = _ref27.listSection;
      var listItem = _ref27.listItem;
      var marker = _ref27.marker;

      toInsert = post([listSection('ul', [listItem([marker('123')])])]);
      expected = post([markupSection('p', [marker('ab123c')])]);
    });

    editor = buildEditorWithMobiledoc(function (_ref28) {
      var post = _ref28.post;
      var markupSection = _ref28.markupSection;
      var marker = _ref28.marker;

      return post([markupSection('p', [marker('abc')])]);
    });

    var position = new _mobiledocKitUtilsCursorPosition['default'](editor.post.sections.head, 'ab'.length);
    postEditor = new _mobiledocKitEditorPost['default'](editor);
    postEditor.insertPost(position, toInsert);
    postEditor.complete();

    assert.renderTreeIsEqual(editor._renderTree, expected);
    assert.postIsSimilar(editor.post, expected);
    var expectedSection = editor.post.sections.head;
    assert.positionIsEqual(renderedRange.head, new _mobiledocKitUtilsCursorPosition['default'](expectedSection, 'ab123'.length), 'cursor at end of pasted');
  });

  test('in non-nested markerable at end and paste is list with 1 item and no more sections', function (assert) {
    var toInsert = undefined,
        expected = undefined;
    _testHelpers['default'].postAbstract.build(function (_ref29) {
      var post = _ref29.post;
      var cardSection = _ref29.cardSection;
      var markupSection = _ref29.markupSection;
      var listSection = _ref29.listSection;
      var listItem = _ref29.listItem;
      var marker = _ref29.marker;

      toInsert = post([listSection('ul', [listItem([marker('123')])])]);
      expected = post([markupSection('p', [marker('abc123')])]);
    });

    editor = buildEditorWithMobiledoc(function (_ref30) {
      var post = _ref30.post;
      var markupSection = _ref30.markupSection;
      var marker = _ref30.marker;

      return post([markupSection('p', [marker('abc')])]);
    });

    var position = editor.post.sections.head.tailPosition();
    postEditor = new _mobiledocKitEditorPost['default'](editor);
    postEditor.insertPost(position, toInsert);
    postEditor.complete();

    assert.renderTreeIsEqual(editor._renderTree, expected);
    assert.postIsSimilar(editor.post, expected);
    var expectedSection = editor.post.sections.head;
    assert.positionIsEqual(renderedRange.head, expectedSection.tailPosition(), 'cursor at end of pasted');
  });

  test('in non-nested markerable at start and paste is list with 1 item and has more sections', function (assert) {
    var toInsert = undefined,
        expected = undefined;
    _testHelpers['default'].postAbstract.build(function (_ref31) {
      var post = _ref31.post;
      var cardSection = _ref31.cardSection;
      var markupSection = _ref31.markupSection;
      var listSection = _ref31.listSection;
      var listItem = _ref31.listItem;
      var marker = _ref31.marker;

      toInsert = post([listSection('ul', [listItem([marker('123')])]), markupSection('p', [marker('def')]), markupSection('p', [marker('ghi')])]);
      expected = post([markupSection('p', [marker('123')]), markupSection('p', [marker('def')]), markupSection('p', [marker('ghi')]), markupSection('p', [marker('abc')])]);
    });

    editor = buildEditorWithMobiledoc(function (_ref32) {
      var post = _ref32.post;
      var markupSection = _ref32.markupSection;
      var marker = _ref32.marker;

      return post([markupSection('p', [marker('abc')])]);
    });

    var position = editor.post.sections.head.headPosition();
    postEditor = new _mobiledocKitEditorPost['default'](editor);
    postEditor.insertPost(position, toInsert);
    postEditor.complete();

    assert.renderTreeIsEqual(editor._renderTree, expected);
    assert.postIsSimilar(editor.post, expected);
    var expectedSection = editor.post.sections.objectAt(2);
    assert.positionIsEqual(renderedRange.head, expectedSection.tailPosition(), 'cursor at end of pasted');
  });

  test('in non-nested markerable at middle and paste is list with 1 item and has more sections', function (assert) {
    var toInsert = undefined,
        expected = undefined;
    _testHelpers['default'].postAbstract.build(function (_ref33) {
      var post = _ref33.post;
      var cardSection = _ref33.cardSection;
      var markupSection = _ref33.markupSection;
      var listSection = _ref33.listSection;
      var listItem = _ref33.listItem;
      var marker = _ref33.marker;

      toInsert = post([listSection('ul', [listItem([marker('123')])]), markupSection('p', [marker('def')]), markupSection('p', [marker('ghi')])]);
      expected = post([markupSection('p', [marker('ab123')]), markupSection('p', [marker('def')]), markupSection('p', [marker('ghi')]), markupSection('p', [marker('c')])]);
    });

    editor = buildEditorWithMobiledoc(function (_ref34) {
      var post = _ref34.post;
      var markupSection = _ref34.markupSection;
      var marker = _ref34.marker;

      return post([markupSection('p', [marker('abc')])]);
    });

    var position = new _mobiledocKitUtilsCursorPosition['default'](editor.post.sections.head, 'ab'.length);
    postEditor = new _mobiledocKitEditorPost['default'](editor);
    postEditor.insertPost(position, toInsert);
    postEditor.complete();

    assert.renderTreeIsEqual(editor._renderTree, expected);
    assert.postIsSimilar(editor.post, expected);
    var expectedSection = editor.post.sections.objectAt(2);
    assert.positionIsEqual(renderedRange.head, expectedSection.tailPosition(), 'cursor at end of pasted');
  });

  test('in non-nested markerable at end and paste is list with 1 item and has more sections', function (assert) {
    var toInsert = undefined,
        expected = undefined;
    _testHelpers['default'].postAbstract.build(function (_ref35) {
      var post = _ref35.post;
      var cardSection = _ref35.cardSection;
      var markupSection = _ref35.markupSection;
      var listSection = _ref35.listSection;
      var listItem = _ref35.listItem;
      var marker = _ref35.marker;

      toInsert = post([listSection('ul', [listItem([marker('123')])]), markupSection('p', [marker('def')]), markupSection('p', [marker('ghi')])]);
      expected = post([markupSection('p', [marker('abc123')]), markupSection('p', [marker('def')]), markupSection('p', [marker('ghi')])]);
    });

    editor = buildEditorWithMobiledoc(function (_ref36) {
      var post = _ref36.post;
      var markupSection = _ref36.markupSection;
      var marker = _ref36.marker;

      return post([markupSection('p', [marker('abc')])]);
    });

    var position = editor.post.sections.head.tailPosition();
    postEditor = new _mobiledocKitEditorPost['default'](editor);
    postEditor.insertPost(position, toInsert);
    postEditor.complete();

    assert.renderTreeIsEqual(editor._renderTree, expected);
    assert.postIsSimilar(editor.post, expected);
    var expectedSection = editor.post.sections.tail;
    assert.positionIsEqual(renderedRange.head, expectedSection.tailPosition(), 'cursor at end of pasted');
  });

  test('in non-nested markerable at start and paste is only list with > 1 item', function (assert) {
    var toInsert = undefined,
        expected = undefined;
    _testHelpers['default'].postAbstract.build(function (_ref37) {
      var post = _ref37.post;
      var cardSection = _ref37.cardSection;
      var markupSection = _ref37.markupSection;
      var listSection = _ref37.listSection;
      var listItem = _ref37.listItem;
      var marker = _ref37.marker;

      toInsert = post([listSection('ul', [listItem([marker('123')]), listItem([marker('456')])])]);
      expected = post([markupSection('p', [marker('123')]), listSection('ul', [listItem([marker('456')])]), markupSection('p', [marker('abc')])]);
    });

    editor = buildEditorWithMobiledoc(function (_ref38) {
      var post = _ref38.post;
      var markupSection = _ref38.markupSection;
      var marker = _ref38.marker;

      return post([markupSection('p', [marker('abc')])]);
    });

    var position = editor.post.sections.head.headPosition();
    postEditor = new _mobiledocKitEditorPost['default'](editor);
    postEditor.insertPost(position, toInsert);
    postEditor.complete();

    assert.renderTreeIsEqual(editor._renderTree, expected);
    assert.postIsSimilar(editor.post, expected);
    var expectedSection = editor.post.sections.objectAt(1);
    assert.positionIsEqual(renderedRange.head, expectedSection.tailPosition(), 'cursor at end of pasted');
  });

  test('in non-nested markerable at end and paste is only list with > 1 item', function (assert) {
    var toInsert = undefined,
        expected = undefined;
    _testHelpers['default'].postAbstract.build(function (_ref39) {
      var post = _ref39.post;
      var cardSection = _ref39.cardSection;
      var markupSection = _ref39.markupSection;
      var listSection = _ref39.listSection;
      var listItem = _ref39.listItem;
      var marker = _ref39.marker;

      toInsert = post([listSection('ul', [listItem([marker('123')]), listItem([marker('456')])])]);
      expected = post([markupSection('p', [marker('abc123')]), listSection('ul', [listItem([marker('456')])])]);
    });

    editor = buildEditorWithMobiledoc(function (_ref40) {
      var post = _ref40.post;
      var markupSection = _ref40.markupSection;
      var marker = _ref40.marker;

      return post([markupSection('p', [marker('abc')])]);
    });

    var position = editor.post.sections.head.tailPosition();
    postEditor = new _mobiledocKitEditorPost['default'](editor);
    postEditor.insertPost(position, toInsert);
    postEditor.complete();

    assert.renderTreeIsEqual(editor._renderTree, expected);
    assert.postIsSimilar(editor.post, expected);
    var expectedSection = editor.post.sections.tail;
    assert.positionIsEqual(renderedRange.head, expectedSection.tailPosition(), 'cursor at end of pasted');
  });

  test('in non-nested markerable at middle and paste is only list with > 1 item', function (assert) {
    var toInsert = undefined,
        expected = undefined;
    _testHelpers['default'].postAbstract.build(function (_ref41) {
      var post = _ref41.post;
      var cardSection = _ref41.cardSection;
      var markupSection = _ref41.markupSection;
      var listSection = _ref41.listSection;
      var listItem = _ref41.listItem;
      var marker = _ref41.marker;

      toInsert = post([listSection('ul', [listItem([marker('123')]), listItem([marker('456')])])]);
      expected = post([markupSection('p', [marker('ab123')]), listSection('ul', [listItem([marker('456')])]), markupSection('p', [marker('c')])]);
    });

    editor = buildEditorWithMobiledoc(function (_ref42) {
      var post = _ref42.post;
      var markupSection = _ref42.markupSection;
      var marker = _ref42.marker;

      return post([markupSection('p', [marker('abc')])]);
    });

    var position = new _mobiledocKitUtilsCursorPosition['default'](editor.post.sections.head, 'ab'.length);
    postEditor = new _mobiledocKitEditorPost['default'](editor);
    postEditor.insertPost(position, toInsert);
    postEditor.complete();

    assert.renderTreeIsEqual(editor._renderTree, expected);
    assert.postIsSimilar(editor.post, expected);
    var expectedSection = editor.post.sections.objectAt(1);
    assert.positionIsEqual(renderedRange.head, expectedSection.tailPosition(), 'cursor at end of pasted');
  });

  test('in nested markerable at start and paste is single non-nested markerable', function (assert) {
    var toInsert = undefined,
        expected = undefined;
    _testHelpers['default'].postAbstract.build(function (_ref43) {
      var post = _ref43.post;
      var cardSection = _ref43.cardSection;
      var markupSection = _ref43.markupSection;
      var listSection = _ref43.listSection;
      var listItem = _ref43.listItem;
      var marker = _ref43.marker;

      toInsert = post([markupSection('p', [marker('123')])]);
      expected = post([listSection('ul', [listItem([marker('123abc')])])]);
    });

    editor = buildEditorWithMobiledoc(function (_ref44) {
      var post = _ref44.post;
      var listSection = _ref44.listSection;
      var listItem = _ref44.listItem;
      var marker = _ref44.marker;

      return post([listSection('ul', [listItem([marker('abc')])])]);
    });

    var position = editor.post.sections.head.headPosition();
    postEditor = new _mobiledocKitEditorPost['default'](editor);
    postEditor.insertPost(position, toInsert);
    postEditor.complete();

    assert.renderTreeIsEqual(editor._renderTree, expected);
    assert.postIsSimilar(editor.post, expected);
    var expectedSection = editor.post.sections.head.items.head;
    assert.positionIsEqual(renderedRange.head, new _mobiledocKitUtilsCursorPosition['default'](expectedSection, '123'.length), 'cursor at end of pasted content');
  });

  test('in nested markerable at end and paste is single non-nested markerable', function (assert) {
    var toInsert = undefined,
        expected = undefined;
    _testHelpers['default'].postAbstract.build(function (_ref45) {
      var post = _ref45.post;
      var cardSection = _ref45.cardSection;
      var markupSection = _ref45.markupSection;
      var listSection = _ref45.listSection;
      var listItem = _ref45.listItem;
      var marker = _ref45.marker;

      toInsert = post([markupSection('p', [marker('123')])]);
      expected = post([listSection('ul', [listItem([marker('abc123')])])]);
    });

    editor = buildEditorWithMobiledoc(function (_ref46) {
      var post = _ref46.post;
      var listSection = _ref46.listSection;
      var listItem = _ref46.listItem;
      var marker = _ref46.marker;

      return post([listSection('ul', [listItem([marker('abc')])])]);
    });

    var position = editor.post.sections.head.tailPosition();
    postEditor = new _mobiledocKitEditorPost['default'](editor);
    postEditor.insertPost(position, toInsert);
    postEditor.complete();

    assert.renderTreeIsEqual(editor._renderTree, expected);
    assert.postIsSimilar(editor.post, expected);
    var expectedSection = editor.post.sections.head.items.head;
    assert.positionIsEqual(renderedRange.head, expectedSection.tailPosition(), 'cursor at end of pasted content');
  });

  test('in nested markerable at middle and paste is single non-nested markerable', function (assert) {
    var toInsert = undefined,
        expected = undefined;
    _testHelpers['default'].postAbstract.build(function (_ref47) {
      var post = _ref47.post;
      var cardSection = _ref47.cardSection;
      var markupSection = _ref47.markupSection;
      var listSection = _ref47.listSection;
      var listItem = _ref47.listItem;
      var marker = _ref47.marker;

      toInsert = post([markupSection('p', [marker('123')])]);
      expected = post([listSection('ul', [listItem([marker('ab123c')])])]);
    });

    editor = buildEditorWithMobiledoc(function (_ref48) {
      var post = _ref48.post;
      var listSection = _ref48.listSection;
      var listItem = _ref48.listItem;
      var marker = _ref48.marker;

      return post([listSection('ul', [listItem([marker('abc')])])]);
    });

    var position = new _mobiledocKitUtilsCursorPosition['default'](editor.post.sections.head.items.head, 'ab'.length);
    postEditor = new _mobiledocKitEditorPost['default'](editor);
    postEditor.insertPost(position, toInsert);
    postEditor.complete();

    assert.renderTreeIsEqual(editor._renderTree, expected);
    assert.postIsSimilar(editor.post, expected);
    var expectedSection = editor.post.sections.head.items.head;
    assert.positionIsEqual(renderedRange.head, new _mobiledocKitUtilsCursorPosition['default'](expectedSection, 'ab123'.length), 'cursor at end of pasted content');
  });

  test('in nested markerable at start and paste is list with 1 item', function (assert) {
    var toInsert = undefined,
        expected = undefined;
    _testHelpers['default'].postAbstract.build(function (_ref49) {
      var post = _ref49.post;
      var cardSection = _ref49.cardSection;
      var markupSection = _ref49.markupSection;
      var listSection = _ref49.listSection;
      var listItem = _ref49.listItem;
      var marker = _ref49.marker;

      toInsert = post([listSection('ul', [listItem([marker('123')])])]);
      expected = post([listSection('ul', [listItem([marker('123abc')])])]);
    });

    editor = buildEditorWithMobiledoc(function (_ref50) {
      var post = _ref50.post;
      var listSection = _ref50.listSection;
      var listItem = _ref50.listItem;
      var marker = _ref50.marker;

      return post([listSection('ul', [listItem([marker('abc')])])]);
    });

    var position = editor.post.sections.head.headPosition();
    postEditor = new _mobiledocKitEditorPost['default'](editor);
    postEditor.insertPost(position, toInsert);
    postEditor.complete();

    assert.renderTreeIsEqual(editor._renderTree, expected);
    assert.postIsSimilar(editor.post, expected);
    var expectedSection = editor.post.sections.head.items.head;
    assert.positionIsEqual(renderedRange.head, new _mobiledocKitUtilsCursorPosition['default'](expectedSection, '123'.length), 'cursor at end of pasted content');
  });

  test('in nested markerable at end and paste is list with 1 item', function (assert) {
    var toInsert = undefined,
        expected = undefined;
    _testHelpers['default'].postAbstract.build(function (_ref51) {
      var post = _ref51.post;
      var cardSection = _ref51.cardSection;
      var markupSection = _ref51.markupSection;
      var listSection = _ref51.listSection;
      var listItem = _ref51.listItem;
      var marker = _ref51.marker;

      toInsert = post([listSection('ul', [listItem([marker('123')])])]);
      expected = post([listSection('ul', [listItem([marker('abc123')])])]);
    });

    editor = buildEditorWithMobiledoc(function (_ref52) {
      var post = _ref52.post;
      var listSection = _ref52.listSection;
      var listItem = _ref52.listItem;
      var marker = _ref52.marker;

      return post([listSection('ul', [listItem([marker('abc')])])]);
    });

    var position = editor.post.sections.head.tailPosition();
    postEditor = new _mobiledocKitEditorPost['default'](editor);
    postEditor.insertPost(position, toInsert);
    postEditor.complete();

    assert.renderTreeIsEqual(editor._renderTree, expected);
    assert.postIsSimilar(editor.post, expected);
    var expectedSection = editor.post.sections.head.items.head;
    assert.positionIsEqual(renderedRange.head, expectedSection.tailPosition(), 'cursor at end of pasted content');
  });

  test('in nested markerable at middle and paste is list with 1 item', function (assert) {
    var toInsert = undefined,
        expected = undefined;
    _testHelpers['default'].postAbstract.build(function (_ref53) {
      var post = _ref53.post;
      var cardSection = _ref53.cardSection;
      var markupSection = _ref53.markupSection;
      var listSection = _ref53.listSection;
      var listItem = _ref53.listItem;
      var marker = _ref53.marker;

      toInsert = post([listSection('ul', [listItem([marker('123')])])]);
      expected = post([listSection('ul', [listItem([marker('ab123c')])])]);
    });

    editor = buildEditorWithMobiledoc(function (_ref54) {
      var post = _ref54.post;
      var listSection = _ref54.listSection;
      var listItem = _ref54.listItem;
      var marker = _ref54.marker;

      return post([listSection('ul', [listItem([marker('abc')])])]);
    });

    var position = new _mobiledocKitUtilsCursorPosition['default'](editor.post.sections.head.items.head, 'ab'.length);
    postEditor = new _mobiledocKitEditorPost['default'](editor);
    postEditor.insertPost(position, toInsert);
    postEditor.complete();

    assert.renderTreeIsEqual(editor._renderTree, expected);
    assert.postIsSimilar(editor.post, expected);
    var expectedSection = editor.post.sections.head.items.head;
    assert.positionIsEqual(renderedRange.head, new _mobiledocKitUtilsCursorPosition['default'](expectedSection, 'ab123'.length), 'cursor at end of pasted content');
  });

  test('in nested markerable at start and paste is list with > 1 item', function (assert) {
    var toInsert = undefined,
        expected = undefined;
    _testHelpers['default'].postAbstract.build(function (_ref55) {
      var post = _ref55.post;
      var cardSection = _ref55.cardSection;
      var markupSection = _ref55.markupSection;
      var listSection = _ref55.listSection;
      var listItem = _ref55.listItem;
      var marker = _ref55.marker;

      toInsert = post([listSection('ul', [listItem([marker('123')]), listItem([marker('456')])])]);
      expected = post([listSection('ul', [listItem([marker('123')]), listItem([marker('456')]), listItem([marker('abc')])])]);
    });

    editor = buildEditorWithMobiledoc(function (_ref56) {
      var post = _ref56.post;
      var listSection = _ref56.listSection;
      var listItem = _ref56.listItem;
      var marker = _ref56.marker;

      return post([listSection('ul', [listItem([marker('abc')])])]);
    });

    var position = editor.post.sections.head.headPosition();
    postEditor = new _mobiledocKitEditorPost['default'](editor);
    postEditor.insertPost(position, toInsert);
    postEditor.complete();

    assert.renderTreeIsEqual(editor._renderTree, expected);
    assert.postIsSimilar(editor.post, expected);
    var expectedSection = editor.post.sections.head.items.objectAt(1);
    assert.positionIsEqual(renderedRange.head, expectedSection.tailPosition(), 'cursor at end of pasted');
  });

  test('in nested markerable at end and paste is list with > 1 item', function (assert) {
    var toInsert = undefined,
        expected = undefined;
    _testHelpers['default'].postAbstract.build(function (_ref57) {
      var post = _ref57.post;
      var cardSection = _ref57.cardSection;
      var markupSection = _ref57.markupSection;
      var listSection = _ref57.listSection;
      var listItem = _ref57.listItem;
      var marker = _ref57.marker;

      toInsert = post([listSection('ul', [listItem([marker('123')]), listItem([marker('456')])])]);
      expected = post([listSection('ul', [listItem([marker('abc123')]), listItem([marker('456')])])]);
    });

    editor = buildEditorWithMobiledoc(function (_ref58) {
      var post = _ref58.post;
      var listSection = _ref58.listSection;
      var listItem = _ref58.listItem;
      var marker = _ref58.marker;

      return post([listSection('ul', [listItem([marker('abc')])])]);
    });

    var position = editor.post.sections.head.tailPosition();
    postEditor = new _mobiledocKitEditorPost['default'](editor);
    postEditor.insertPost(position, toInsert);
    postEditor.complete();

    // FIXME is this the correct expected position?
    assert.renderTreeIsEqual(editor._renderTree, expected);
    assert.postIsSimilar(editor.post, expected);
    var expectedSection = editor.post.sections.head.items.tail;
    assert.positionIsEqual(renderedRange.head, expectedSection.tailPosition(), 'cursor at end of pasted');
  });

  test('in nested markerable at middle and paste is list with > 1 item', function (assert) {
    var toInsert = undefined,
        expected = undefined;
    _testHelpers['default'].postAbstract.build(function (_ref59) {
      var post = _ref59.post;
      var cardSection = _ref59.cardSection;
      var markupSection = _ref59.markupSection;
      var listSection = _ref59.listSection;
      var listItem = _ref59.listItem;
      var marker = _ref59.marker;

      toInsert = post([listSection('ul', [listItem([marker('123')]), listItem([marker('456')])])]);
      expected = post([listSection('ul', [listItem([marker('ab123')]), listItem([marker('456')]), listItem([marker('c')])])]);
    });

    editor = buildEditorWithMobiledoc(function (_ref60) {
      var post = _ref60.post;
      var listSection = _ref60.listSection;
      var listItem = _ref60.listItem;
      var marker = _ref60.marker;

      return post([listSection('ul', [listItem([marker('abc')])])]);
    });

    var position = new _mobiledocKitUtilsCursorPosition['default'](editor.post.sections.head.items.head, 'ab'.length);
    postEditor = new _mobiledocKitEditorPost['default'](editor);
    postEditor.insertPost(position, toInsert);
    postEditor.complete();

    assert.renderTreeIsEqual(editor._renderTree, expected);
    assert.postIsSimilar(editor.post, expected);
    var expectedSection = editor.post.sections.head.items.objectAt(1);
    assert.positionIsEqual(renderedRange.head, expectedSection.tailPosition(), 'cursor at end of pasted');
  });

  test('in nested markerable at start and paste is list with 1 item and more sections', function (assert) {
    var toInsert = undefined,
        expected = undefined;
    _testHelpers['default'].postAbstract.build(function (_ref61) {
      var post = _ref61.post;
      var cardSection = _ref61.cardSection;
      var markupSection = _ref61.markupSection;
      var listSection = _ref61.listSection;
      var listItem = _ref61.listItem;
      var marker = _ref61.marker;

      toInsert = post([listSection('ul', [listItem([marker('123')])]), markupSection('p', [marker('456')])]);
      expected = post([listSection('ul', [listItem([marker('123')])]), markupSection('p', [marker('456')]), listSection('ul', [listItem([marker('abc')])])]);
    });

    editor = buildEditorWithMobiledoc(function (_ref62) {
      var post = _ref62.post;
      var listSection = _ref62.listSection;
      var listItem = _ref62.listItem;
      var marker = _ref62.marker;

      return post([listSection('ul', [listItem([marker('abc')])])]);
    });

    var position = editor.post.sections.head.headPosition();
    postEditor = new _mobiledocKitEditorPost['default'](editor);
    postEditor.insertPost(position, toInsert);
    postEditor.complete();

    assert.renderTreeIsEqual(editor._renderTree, expected);
    assert.postIsSimilar(editor.post, expected);
    var expectedSection = editor.post.sections.objectAt(1);
    assert.positionIsEqual(renderedRange.head, expectedSection.tailPosition(), 'cursor at end of pasted');
  });

  test('in blank nested markerable (1 item in list) and paste is non-markerable', function (assert) {
    var toInsert = undefined,
        expected = undefined;
    _testHelpers['default'].postAbstract.build(function (_ref63) {
      var post = _ref63.post;
      var cardSection = _ref63.cardSection;
      var listSection = _ref63.listSection;
      var listItem = _ref63.listItem;

      toInsert = post([cardSection('the-card', { foo: 'bar' })]);
      expected = post([listSection('ul', [listItem()]), cardSection('the-card', { foo: 'bar' })]);
    });

    editor = buildEditorWithMobiledoc(function (_ref64) {
      var post = _ref64.post;
      var listSection = _ref64.listSection;
      var listItem = _ref64.listItem;

      return post([listSection('ul', [listItem()])]);
    });

    var position = editor.post.sections.head.headPosition();
    postEditor = new _mobiledocKitEditorPost['default'](editor);
    postEditor.insertPost(position, toInsert);
    postEditor.complete();

    assert.renderTreeIsEqual(editor._renderTree, expected);
    assert.postIsSimilar(editor.post, expected);
    var expectedSection = editor.post.sections.tail;
    assert.positionIsEqual(renderedRange.head, expectedSection.tailPosition(), 'cursor at end of pasted');
  });

  test('in nested markerable at end with multiple items and paste is non-markerable', function (assert) {
    var toInsert = undefined,
        expected = undefined;
    _testHelpers['default'].postAbstract.build(function (_ref65) {
      var post = _ref65.post;
      var cardSection = _ref65.cardSection;
      var listSection = _ref65.listSection;
      var listItem = _ref65.listItem;
      var marker = _ref65.marker;

      toInsert = post([cardSection('the-card', { foo: 'bar' })]);
      expected = post([listSection('ul', [listItem([marker('123')])]), cardSection('the-card', { foo: 'bar' }), listSection('ul', [listItem([marker('abc')])])]);
    });

    editor = buildEditorWithMobiledoc(function (_ref66) {
      var post = _ref66.post;
      var listSection = _ref66.listSection;
      var listItem = _ref66.listItem;
      var marker = _ref66.marker;

      return post([listSection('ul', [listItem([marker('123')]), listItem([marker('abc')])])]);
    });

    var position = editor.post.sections.head.items.head.tailPosition();
    postEditor = new _mobiledocKitEditorPost['default'](editor);
    postEditor.insertPost(position, toInsert);
    postEditor.complete();

    assert.postIsSimilar(editor.post, expected);
    assert.renderTreeIsEqual(editor._renderTree, expected);
    var expectedSection = editor.post.sections.objectAt(1);
    assert.positionIsEqual(renderedRange.head, expectedSection.tailPosition(), 'cursor at end of pasted');
  });

  test('in nested markerable at middle with multiple items and paste is non-markerable', function (assert) {
    var toInsert = undefined,
        expected = undefined;
    _testHelpers['default'].postAbstract.build(function (_ref67) {
      var post = _ref67.post;
      var cardSection = _ref67.cardSection;
      var listSection = _ref67.listSection;
      var listItem = _ref67.listItem;
      var marker = _ref67.marker;

      toInsert = post([cardSection('the-card', { foo: 'bar' })]);
      expected = post([listSection('ul', [listItem([marker('ab')])]), cardSection('the-card', { foo: 'bar' }), listSection('ul', [listItem([marker('c')]), listItem([marker('def')])])]);
    });

    editor = buildEditorWithMobiledoc(function (_ref68) {
      var post = _ref68.post;
      var listSection = _ref68.listSection;
      var listItem = _ref68.listItem;
      var marker = _ref68.marker;

      return post([listSection('ul', [listItem([marker('abc')]), listItem([marker('def')])])]);
    });

    var position = new _mobiledocKitUtilsCursorPosition['default'](editor.post.sections.head.items.head, 'ab'.length);
    postEditor = new _mobiledocKitEditorPost['default'](editor);
    postEditor.insertPost(position, toInsert);
    postEditor.complete();

    assert.postIsSimilar(editor.post, expected);
    assert.renderTreeIsEqual(editor._renderTree, expected);
    var expectedSection = editor.post.sections.objectAt(1);
    assert.positionIsEqual(renderedRange.head, expectedSection.tailPosition(), 'cursor at end of pasted');
  });
});
define('tests/unit/models/atom-test', ['exports', 'mobiledoc-kit/models/post-node-builder'], function (exports, _mobiledocKitModelsPostNodeBuilder) {
  'use strict';

  var _QUnit = QUnit;
  var _module = _QUnit.module;
  var test = _QUnit.test;

  var builder = undefined;
  _module('Unit: Atom', {
    beforeEach: function beforeEach() {
      builder = new _mobiledocKitModelsPostNodeBuilder['default']();
    },
    afterEach: function afterEach() {
      builder = null;
    }
  });

  test('can create an atom with value and payload', function (assert) {
    var payload = {};
    var value = 'atom-value';
    var name = 'atom-name';
    var atom = builder.createAtom(name, value, payload);
    assert.ok(!!atom, 'creates atom');
    assert.ok(atom.name === name, 'has name');
    assert.ok(atom.value === value, 'has value');
    assert.ok(atom.payload === payload, 'has payload');
    assert.ok(atom.length === 1, 'has length of 1');
  });
});
define('tests/unit/models/card-test', ['exports', 'mobiledoc-kit/models/post-node-builder'], function (exports, _mobiledocKitModelsPostNodeBuilder) {
  'use strict';

  var _QUnit = QUnit;
  var _module = _QUnit.module;
  var test = _QUnit.test;

  var builder = undefined;
  _module('Unit: Card', {
    beforeEach: function beforeEach() {
      builder = new _mobiledocKitModelsPostNodeBuilder['default']();
    },
    afterEach: function afterEach() {
      builder = null;
    }
  });

  test('can create a card with payload', function (assert) {
    var payload = {};
    var card = builder.createCardSection('card-name', payload);
    assert.ok(!!card, 'creates card');
    assert.ok(card.payload === payload, 'has payload');
  });

  test('cloning a card copies payload', function (assert) {
    var payload = { foo: 'bar' };

    var card = builder.createCardSection('card-name', payload);
    var card2 = card.clone();

    assert.ok(card !== card2, 'card !== cloned');
    assert.ok(card.payload !== card2.payload, 'payload is copied');

    card.payload.foo = 'other foo';
    assert.equal(card2.payload.foo, 'bar', 'card2 payload not updated');
  });
});
define('tests/unit/models/list-section-test', ['exports', 'mobiledoc-kit/models/post-node-builder', '../../test-helpers'], function (exports, _mobiledocKitModelsPostNodeBuilder, _testHelpers) {
  'use strict';

  var _module = _testHelpers['default'].module;
  var test = _testHelpers['default'].test;

  var builder = undefined;
  _module('Unit: List Section', {
    beforeEach: function beforeEach() {
      builder = new _mobiledocKitModelsPostNodeBuilder['default']();
    },
    afterEach: function afterEach() {
      builder = null;
    }
  });

  test('cloning a list section creates the same type of list section', function (assert) {
    var item = builder.createListItem([builder.createMarker('abc')]);
    var list = builder.createListSection('ol', [item]);
    var cloned = list.clone();

    assert.equal(list.tagName, cloned.tagName);
    assert.equal(list.items.length, cloned.items.length);
    assert.equal(list.items.head.text, cloned.items.head.text);
  });
});
define('tests/unit/models/marker-test', ['exports', 'mobiledoc-kit/models/post-node-builder'], function (exports, _mobiledocKitModelsPostNodeBuilder) {
  'use strict';

  function _toArray(arr) { return Array.isArray(arr) ? arr : Array.from(arr); }

  var _QUnit = QUnit;
  var _module = _QUnit.module;
  var test = _QUnit.test;

  var builder = undefined;
  _module('Unit: Marker', {
    beforeEach: function beforeEach() {
      builder = new _mobiledocKitModelsPostNodeBuilder['default']();
    },
    afterEach: function afterEach() {
      builder = null;
    }
  });

  test('a marker can have a markup applied to it', function (assert) {
    var m1 = builder.createMarker('hi there!');
    m1.addMarkup(builder.createMarkup('b'));

    assert.ok(m1.hasMarkup('b'));
  });

  test('a marker can have the same markup tagName applied twice', function (assert) {
    var m1 = builder.createMarker('hi there!');
    m1.addMarkup(builder.createMarkup('b'));
    m1.addMarkup(builder.createMarkup('b'));

    assert.equal(m1.markups.length, 2, 'markup only applied once');
  });

  test('a marker can have a complex markup applied to it', function (assert) {
    var m1 = builder.createMarker('hi there!');
    var markup = builder.createMarkup('a', { href: 'blah' });
    m1.addMarkup(markup);

    assert.ok(m1.hasMarkup('a'));
    assert.equal(m1.getMarkup('a').attributes.href, 'blah');
  });

  test('a marker can have the same complex markup tagName applied twice, even with different attributes', function (assert) {
    var m1 = builder.createMarker('hi there!');
    var markup1 = builder.createMarkup('a', { href: 'blah' });
    var markup2 = builder.createMarkup('a', { href: 'blah2' });
    m1.addMarkup(markup1);
    m1.addMarkup(markup2);

    assert.equal(m1.markups.length, 2, 'only one markup');
    assert.equal(m1.getMarkup('a').attributes.href, 'blah', 'first markup is applied');
  });

  test('#split splits a marker in 3 with blank markers when no endOffset is passed', function (assert) {
    var m1 = builder.createMarker('hi there!');
    m1.addMarkup(builder.createMarkup('b'));

    var _m1$split = m1.split(5);

    var _m1$split2 = _toArray(_m1$split);

    var beforeMarker = _m1$split2[0];

    var afterMarkers = _m1$split2.slice(1);

    assert.ok(beforeMarker.hasMarkup('b'));
    afterMarkers.forEach(function (m) {
      return assert.ok(m.hasMarkup('b'));
    });

    assert.equal(beforeMarker.value, 'hi th');
    assert.equal(afterMarkers[0].value, 'ere!');
    assert.ok(afterMarkers[1].isBlank, 'final split marker is empty');
  });

  test('#split splits a marker in 3 when endOffset is passed', function (assert) {
    var m = builder.createMarker('hi there!');
    m.addMarkup(builder.createMarkup('b'));

    var _m$split = m.split(2, 4);

    var _m$split2 = _toArray(_m$split);

    var beforeMarker = _m$split2[0];

    var afterMarkers = _m$split2.slice(1);

    assert.equal(1 + afterMarkers.length, 3, 'creates 3 new markers');
    assert.ok(beforeMarker.hasMarkup('b'), 'beforeMarker has markup');
    afterMarkers.forEach(function (m) {
      return assert.ok(m.hasMarkup('b'), 'afterMarker has markup');
    });

    assert.equal(beforeMarker.value, 'hi');
    assert.equal(afterMarkers[0].value, ' t');
    assert.equal(afterMarkers[1].value, 'here!');
  });

  test('#split creates an initial empty marker if the offset is 0', function (assert) {
    var m = builder.createMarker('hi there!');

    var _m$split3 = m.split(0);

    var _m$split32 = _toArray(_m$split3);

    var beforeMarker = _m$split32[0];

    var afterMarkers = _m$split32.slice(1);

    assert.equal(afterMarkers.length, 2, '2 after markers');
    assert.ok(beforeMarker.isBlank, 'beforeMarker is empty');
    assert.equal(afterMarkers[0].value, 'hi there!');
    assert.ok(afterMarkers[1].isBlank, 'final afterMarker is empty');
  });

  test('#clone a marker', function (assert) {
    var marker = builder.createMarker('hi there!');
    var cloned = marker.clone();
    assert.equal(marker.builder, cloned.builder, 'builder is present');
    assert.equal(marker.value, cloned.value, 'value is present');
    assert.equal(marker.markups.length, cloned.markups.length, 'markup length is the same');
  });

  // https://github.com/bustlelabs/mobiledoc-kit/issues/274
  test('#deleteValueAtOffset handles emoji', function (assert) {
    var str = 'monkey 🙈';
    assert.equal(str.length, 'monkey '.length + 2, 'string length reports monkey emoji as length 2');
    var marker = builder.createMarker(str);
    marker.deleteValueAtOffset(str.length - 1);
    assert.equal(marker.value, 'monkey ', 'deletes correctly from low surrogate');

    marker = builder.createMarker(str);
    marker.deleteValueAtOffset(str.length - 2);
    assert.equal(marker.value, 'monkey ', 'deletes correctly from high surrogate');
  });
});
define('tests/unit/models/markup-section-test', ['exports', 'mobiledoc-kit/models/post-node-builder', '../../test-helpers'], function (exports, _mobiledocKitModelsPostNodeBuilder, _testHelpers) {
  'use strict';

  var _module = _testHelpers['default'].module;
  var test = _testHelpers['default'].test;

  var builder = undefined;
  _module('Unit: Markup Section', {
    beforeEach: function beforeEach() {
      builder = new _mobiledocKitModelsPostNodeBuilder['default']();
    },
    afterEach: function afterEach() {
      builder = null;
    }
  });

  test('a section can append a marker', function (assert) {
    var s1 = builder.createMarkupSection('P');
    var m1 = builder.createMarker('hello');

    s1.markers.append(m1);
    assert.equal(s1.markers.length, 1);
  });

  test('#splitMarker splits the marker at the offset', function (assert) {
    var m1 = builder.createMarker('hi ');
    var m2 = builder.createMarker('there!');
    var s = builder.createMarkupSection('h2', [m1, m2]);

    s.splitMarker(m2, 3);
    assert.equal(s.markers.length, 3, 'adds a 3rd marker');
    assert.equal(s.markers.objectAt(0).value, 'hi ', 'original marker unchanged');
    assert.equal(s.markers.objectAt(1).value, 'the', 'first half of split');
    assert.equal(s.markers.objectAt(2).value, 're!', 'second half of split');
  });

  test('#splitMarker splits the marker at the end offset if provided', function (assert) {
    var m1 = builder.createMarker('hi ');
    var m2 = builder.createMarker('there!');
    var s = builder.createMarkupSection('h2', [m1, m2]);

    s.splitMarker(m2, 1, 3);
    assert.equal(s.markers.length, 4, 'adds a marker for the split and has one on each side');
    assert.equal(s.markers.head.value, 'hi ', 'original marker unchanged');
    assert.equal(s.markers.objectAt(1).value, 't');
    assert.equal(s.markers.objectAt(2).value, 'he');
    assert.equal(s.markers.tail.value, 're!');
  });

  test('#splitMarker does not create an empty marker if offset=0', function (assert) {
    var m1 = builder.createMarker('hi ');
    var m2 = builder.createMarker('there!');
    var s = builder.createMarkupSection('h2', [m1, m2]);

    s.splitMarker(m2, 0);
    assert.equal(s.markers.length, 2, 'still 2 markers');
    assert.equal(s.markers.head.value, 'hi ', 'original 1st marker unchanged');
    assert.equal(s.markers.tail.value, 'there!', 'original 2nd marker unchanged');
  });

  test('#splitMarker does not remove an existing marker when the offset and endOffset are 0', function (assert) {
    var m1 = builder.createMarker('X');
    var s = builder.createMarkupSection('p', [m1]);
    s.splitMarker(m1, 0, 0);

    assert.equal(s.markers.length, 1, 'still 1 marker');
    assert.equal(s.markers.head.value, 'X', 'still correct marker value');
  });

  test('#isBlank returns true if the text length is zero for two markers', function (assert) {
    var m1 = builder.createMarker('');
    var m2 = builder.createMarker('');
    var s = builder.createMarkupSection('p', [m1, m2]);
    assert.ok(s.isBlank, 'section with two blank markers is blank');
  });

  test('#isBlank returns true if there are no markers', function (assert) {
    var s = builder.createMarkupSection('p');
    assert.ok(s.isBlank, 'section with no markers is blank');
  });

  test('#isBlank returns false if there is a marker with length', function (assert) {
    var m = builder.createMarker('a');
    var s = builder.createMarkupSection('p', [m]);
    assert.ok(!s.isBlank, 'section with marker is not blank');
  });

  test('#markersFor clones markers', function (assert) {
    var m = builder.createMarker('a');
    var s = builder.createMarkupSection('p', [m]);
    var clones = s.markersFor(0, 1);
    assert.equal(clones.length, 1, 'correct number of clones are created');
    assert.ok(clones[0] !== m, 'marker is cloned');
    assert.equal(clones[0].value, m.value, 'marker content is the same');
  });

  test('#markersFor clones markers, trimming at tailOffset', function (assert) {
    var m1 = builder.createMarker('ab');
    var m2 = builder.createMarker('cd');
    var s = builder.createMarkupSection('p', [m1, m2]);
    var clones = s.markersFor(0, 3);
    assert.equal(clones.length, 2, 'correct number of clones are created');
    assert.equal(clones[0].value, 'ab', 'marker content correct');
    assert.equal(clones[1].value, 'c', 'marker content is correct');
  });

  test('#markersFor clones markers, trimming at headOffset', function (assert) {
    var m1 = builder.createMarker('ab');
    var m2 = builder.createMarker('cd');
    var s = builder.createMarkupSection('p', [m1, m2]);
    var clones = s.markersFor(1, 4);
    assert.equal(clones.length, 2, 'correct number of clones are created');
    assert.equal(clones[0].value, 'b', 'marker content correct');
    assert.equal(clones[1].value, 'cd', 'marker content is correct');
  });

  test('#markersFor clones markers, trimming at offsets that do not trim', function (assert) {
    var m1 = builder.createMarker('ab');
    var m2 = builder.createMarker('cd');
    var m3 = builder.createMarker('ef');
    var s = builder.createMarkupSection('p', [m1, m2, m3]);
    var clones = s.markersFor(2, 4);
    assert.equal(clones.length, 1, 'correct number of clones are created');
    assert.equal(clones[0].value, 'cd', 'marker content correct');
  });

  test('#markersFor clones markers when offset completely surrounds a marker', function (assert) {
    var m1 = builder.createMarker('ab'); // 0-2
    var m2 = builder.createMarker('cd1'); // 2-5
    var m3 = builder.createMarker('cd2'); // 5-8
    var m4 = builder.createMarker('ef'); // 8-10
    var s = builder.createMarkupSection('p', [m1, m2, m3, m4]);
    var clones = s.markersFor(3, 9);
    assert.equal(clones.length, 3, 'correct number of clones are created');
    assert.equal(clones[0].value, 'd1', 'marker content correct');
    assert.equal(clones[1].value, 'cd2', 'marker content correct');
    assert.equal(clones[2].value, 'e', 'marker content correct');
  });

  test('#markersFor clones a single marker with a tail offset', function (assert) {
    var m1 = builder.createMarker(' def');
    var s = builder.createMarkupSection('p', [m1]);
    var clones = s.markersFor(0, 1);
    assert.equal(clones.length, 1);
    assert.equal(clones[0].value, ' ');
  });

  test('instantiating with invalid tagName throws', function (assert) {
    assert.throws(function () {
      builder.createMarkupSection('blah');
    }, /Cannot set.*tagName.*blah/);
  });

  test('markerBeforeOffset returns marker the ends at offset', function (assert) {
    var marker = builder.createMarker;
    var section = builder.createMarkupSection('p', [marker('a'), marker('bc'), marker('def')]);

    assert.ok(section.markerBeforeOffset(1) === section.markers.head);
    assert.ok(section.markerBeforeOffset(3) === section.markers.objectAt(1));
    assert.ok(section.markerBeforeOffset(6) === section.markers.tail);
  });

  test('markerBeforeOffset throws if offset is not between markers', function (assert) {
    var marker = builder.createMarker;
    var section = builder.createMarkupSection('p', [marker('a'), marker('bc'), marker('def')]);

    assert.throws(function () {
      return section.markerBeforeOffset(0);
    }, /not between/);
    assert.throws(function () {
      return section.markerBeforeOffset(2);
    }, /not between/);
    assert.throws(function () {
      return section.markerBeforeOffset(4);
    }, /not between/);
    assert.throws(function () {
      return section.markerBeforeOffset(5);
    }, /not between/);
  });

  test('markerBeforeOffset returns first marker if it is empty and offset is 0', function (assert) {
    var marker = function marker(text) {
      return builder.createMarker(text);
    };
    var section = builder.createMarkupSection('p', [marker(''), marker('bc'), marker('def')]);

    assert.ok(section.markerBeforeOffset(0) === section.markers.head);
  });

  test('splitMarkerAtOffset inserts empty marker when offset is 0', function (assert) {
    var section = builder.createMarkupSection('p', [builder.createMarker('abc')]);

    section.splitMarkerAtOffset(0);

    assert.equal(section.markers.length, 2);
    assert.deepEqual(section.markers.map(function (m) {
      return m.value;
    }), ['', 'abc']);
  });

  test('splitMarkerAtOffset inserts empty marker if section is blank', function (assert) {
    var section = builder.createMarkupSection('p');

    section.splitMarkerAtOffset(0);

    assert.equal(section.markers.length, 1);
    assert.deepEqual(section.markers.map(function (m) {
      return m.value;
    }), ['']);
  });

  test('splitMarkerAtOffset splits marker if offset is contained by marker', function (assert) {
    var section = builder.createMarkupSection('p', [builder.createMarker('abc')]);

    section.splitMarkerAtOffset(1);

    assert.equal(section.markers.length, 2);
    assert.deepEqual(section.markers.map(function (m) {
      return m.value;
    }), ['a', 'bc']);
  });

  test('splitMarkerAtOffset is no-op when offset is at end of marker', function (assert) {
    var section = builder.createMarkupSection('p', [builder.createMarker('abc')]);

    section.splitMarkerAtOffset(3);

    assert.equal(section.markers.length, 1);
    assert.deepEqual(section.markers.map(function (m) {
      return m.value;
    }), ['abc']);
  });

  test('splitMarkerAtOffset does nothing if the is offset is at end', function (assert) {
    var marker = function marker(text) {
      return builder.createMarker(text);
    };
    var section = builder.createMarkupSection('p', [marker('a'), marker('bc')]);

    section.splitMarkerAtOffset(3);

    assert.equal(section.markers.length, 2);
    assert.deepEqual(section.markers.map(function (m) {
      return m.value;
    }), ['a', 'bc']);
  });

  test('splitMarkerAtOffset splits a marker deep in the middle', function (assert) {
    var marker = function marker(text) {
      return builder.createMarker(text);
    };
    var section = builder.createMarkupSection('p', [marker('a'), marker('bc'), marker('def'), marker('ghi')]);

    section.splitMarkerAtOffset(5);

    assert.equal(section.markers.length, 5);
    assert.deepEqual(section.markers.map(function (m) {
      return m.value;
    }), ['a', 'bc', 'de', 'f', 'ghi']);
  });

  test('a section has property `isSection`', function (assert) {
    var section = builder.createMarkupSection();
    assert.ok(section.isSection, 'section.isSection');
  });

  test('#length is correct', function (assert) {
    var expectations = undefined;
    _testHelpers['default'].postAbstract.build(function (_ref) {
      var markupSection = _ref.markupSection;
      var marker = _ref.marker;
      var atom = _ref.atom;

      expectations = [{
        name: 'blank section',
        length: 0,
        section: markupSection()
      }, {
        name: 'section with empty marker',
        length: 0,
        section: markupSection('p', [marker('')])
      }, {
        name: 'section with single marker',
        length: 'abc'.length,
        section: markupSection('p', [marker('abc')])
      }, {
        name: 'section with multiple markers',
        length: 'abc'.length + 'defg'.length,
        section: markupSection('p', [marker('abc'), marker('defg')])
      }, {
        name: 'section with atom',
        length: 1,
        section: markupSection('p', [atom('mention', 'bob')])
      }, {
        name: 'section with multiple atoms',
        length: 2,
        section: markupSection('p', [atom('mention', 'bob'), atom('mention', 'other')])
      }, {
        name: 'section with atom and markers',
        length: 'abc'.length + 1,
        section: markupSection('p', [marker('abc'), atom('mention', 'bob')])
      }];
    });

    assert.expect(expectations.length);
    expectations.forEach(function (_ref2) {
      var name = _ref2.name;
      var length = _ref2.length;
      var section = _ref2.section;

      assert.equal(section.length, length, name + ' has correct length');
    });
  });
});
define('tests/unit/models/post-node-builder-test', ['exports', '../../test-helpers', 'mobiledoc-kit/models/post-node-builder'], function (exports, _testHelpers, _mobiledocKitModelsPostNodeBuilder) {
  'use strict';

  var _module = _testHelpers['default'].module;
  var test = _testHelpers['default'].test;

  _module('Unit: PostNodeBuilder');

  test('#createMarkup returns singleton markup', function (assert) {
    var builder = new _mobiledocKitModelsPostNodeBuilder['default']();
    var m1 = builder.createMarkup('strong');
    var m2 = builder.createMarkup('strong');

    assert.ok(m1 === m2, 'markups are singletons');
  });

  test('#createMarkup returns singleton markup when has equal attributes', function (assert) {
    var builder = new _mobiledocKitModelsPostNodeBuilder['default']();
    var m1 = builder.createMarkup('a', { href: 'bustle.com' });
    var m2 = builder.createMarkup('a', { href: 'bustle.com' });

    assert.ok(m1 === m2, 'markups with attributes are singletons');
  });

  test('#createMarkup returns differents markups when has different attributes', function (assert) {
    var builder = new _mobiledocKitModelsPostNodeBuilder['default']();
    var m1 = builder.createMarkup('a', { href: 'bustle.com' });
    var m2 = builder.createMarkup('a', { href: 'other.com' });

    assert.ok(m1 !== m2, 'markups with different attributes are different');
  });

  test('#createMarkup normalizes tagName', function (assert) {
    var builder = new _mobiledocKitModelsPostNodeBuilder['default']();
    var m1 = builder.createMarkup('b');
    var m2 = builder.createMarkup('B');
    var m3 = builder.createMarkup('b', {});
    var m4 = builder.createMarkup('B', {});

    assert.ok(m1 === m2 && m2 === m3 && m3 === m4, 'all markups are the same');
  });

  test('#createCardSection creates card with builder', function (assert) {
    var builder = new _mobiledocKitModelsPostNodeBuilder['default']();
    var cardSection = builder.createCardSection('test-card');
    assert.ok(cardSection.builder === builder, 'card section has builder');
  });
});
define('tests/unit/models/post-test', ['exports', '../../test-helpers', 'mobiledoc-kit/utils/cursor/range', 'mobiledoc-kit/utils/cursor/position'], function (exports, _testHelpers, _mobiledocKitUtilsCursorRange, _mobiledocKitUtilsCursorPosition) {
  'use strict';

  var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

  var _module = _testHelpers['default'].module;
  var test = _testHelpers['default'].test;

  _module('Unit: Post');

  test('#markersFrom finds markers across markup sections', function (assert) {
    var post = _testHelpers['default'].postAbstract.build(function (_ref) {
      var post = _ref.post;
      var markupSection = _ref.markupSection;
      var marker = _ref.marker;
      return post([markupSection('p', ['s1m1', 's1m2', 's1m3'].map(function (t) {
        return marker(t);
      })), markupSection('p', ['s2m1', 's2m2', 's2m3'].map(function (t) {
        return marker(t);
      })), markupSection('p', ['s3m1', 's3m2', 's3m3'].map(function (t) {
        return marker(t);
      }))]);
    });

    var foundMarkers = [];

    var s1m2 = post.sections.objectAt(0).markers.objectAt(1);
    var s3m2 = post.sections.objectAt(2).markers.objectAt(1);

    assert.equal(s1m2.value, 's1m2', 'precond - find s1m2');
    assert.equal(s3m2.value, 's3m2', 'precond - find s3m2');

    post.markersFrom(s1m2, s3m2, function (m) {
      return foundMarkers.push(m.value);
    });

    assert.deepEqual(foundMarkers, ['s1m2', 's1m3', 's2m1', 's2m2', 's2m3', 's3m1', 's3m2'], 'iterates correct markers');
  });

  test('#markersFrom finds markers across non-homogeneous sections', function (assert) {
    var post = _testHelpers['default'].postAbstract.build(function (builder) {
      var post = builder.post;
      var markupSection = builder.markupSection;
      var marker = builder.marker;
      var listSection = builder.listSection;
      var listItem = builder.listItem;

      return post([markupSection('p', ['s1m1', 's1m2', 's1m3'].map(function (t) {
        return marker(t);
      })), listSection('ul', [listItem(['l1m1', 'l1m2', 'l1m3'].map(function (t) {
        return marker(t);
      })), listItem(['l2m1', 'l2m2', 'l2m3'].map(function (t) {
        return marker(t);
      }))]),
      // FIXME test with card section
      markupSection('p', ['s2m1', 's2m2', 's2m3'].map(function (t) {
        return marker(t);
      })), markupSection('p', ['s3m1', 's3m2', 's3m3'].map(function (t) {
        return marker(t);
      }))]);
    });

    var foundMarkers = [];

    var s1m2 = post.sections.objectAt(0).markers.objectAt(1);
    var s3m2 = post.sections.objectAt(3).markers.objectAt(1);

    assert.equal(s1m2.value, 's1m2', 'precond - find s1m2');
    assert.equal(s3m2.value, 's3m2', 'precond - find s3m2');

    post.markersFrom(s1m2, s3m2, function (m) {
      return foundMarkers.push(m.value);
    });

    assert.deepEqual(foundMarkers, ['s1m2', 's1m3', 'l1m1', 'l1m2', 'l1m3', 'l2m1', 'l2m2', 'l2m3', 's2m1', 's2m2', 's2m3', 's3m1', 's3m2'], 'iterates correct markers');
  });

  test('#walkMarkerableSections finds no section when range contains only a card', function (assert) {
    var post = _testHelpers['default'].postAbstract.build(function (builder) {
      var post = builder.post;
      var cardSection = builder.cardSection;

      return post([cardSection('simple-card')]);
    });

    var foundSections = [];

    var card = post.sections.objectAt(0);
    var range = _mobiledocKitUtilsCursorRange['default'].create(card, 0, card, 0);

    post.walkMarkerableSections(range, function (s) {
      return foundSections.push(s);
    });
    assert.equal(foundSections.length, 0, 'found no markerable sections');
  });

  test('#walkMarkerableSections skips non-markerable sections', function (assert) {
    var post = _testHelpers['default'].postAbstract.build(function (builder) {
      var post = builder.post;
      var markupSection = builder.markupSection;
      var marker = builder.marker;
      var cardSection = builder.cardSection;

      return post([markupSection('p', ['s1m1'].map(function (t) {
        return marker(t);
      })), markupSection('p', ['s2m1'].map(function (t) {
        return marker(t);
      })), cardSection('simple-card'), markupSection('p', ['s3m1'].map(function (t) {
        return marker(t);
      })), markupSection('p', ['s4m1'].map(function (t) {
        return marker(t);
      }))]);
    });

    var foundSections = [];

    var s1 = post.sections.objectAt(0);
    var s4 = post.sections.objectAt(4);

    assert.equal(s1.text, 's1m1', 'precond - find s1');
    assert.equal(s4.text, 's4m1', 'precond - find s4');

    var range = _mobiledocKitUtilsCursorRange['default'].create(s1, 0, s4, 0);

    post.walkMarkerableSections(range, function (s) {
      return foundSections.push(s);
    });

    assert.deepEqual(foundSections.map(function (s) {
      return s.text;
    }), ['s1m1', 's2m1', 's3m1', 's4m1'], 'iterates correct sections');
  });

  test('#walkAllLeafSections returns markup section that follows a list section', function (assert) {
    var post = _testHelpers['default'].postAbstract.build(function (_ref2) {
      var post = _ref2.post;
      var markupSection = _ref2.markupSection;
      var marker = _ref2.marker;
      var listSection = _ref2.listSection;
      var listItem = _ref2.listItem;

      return post([markupSection('p', [marker('abc')]), markupSection('p', [marker('def')]), listSection('ul', [listItem([marker('123')])]), markupSection('p')]);
    });

    var sections = [];
    post.walkAllLeafSections(function (s) {
      return sections.push(s);
    });

    assert.equal(sections.length, 4);
    assert.ok(sections[0] === post.sections.head, 'section 0');
    assert.ok(sections[1] === post.sections.objectAt(1), 'section 1');
    assert.ok(sections[2] === post.sections.objectAt(2).items.head, 'section 2');
    assert.ok(sections[3] === post.sections.tail, 'section 3');
  });

  test('#markupsInRange returns all markups', function (assert) {
    var b = undefined,
        i = undefined,
        a1 = undefined,
        a2 = undefined,
        found = undefined;
    var post = _testHelpers['default'].postAbstract.build(function (builder) {
      var post = builder.post;
      var markupSection = builder.markupSection;
      var cardSection = builder.cardSection;
      var marker = builder.marker;
      var markup = builder.markup;

      b = markup('strong');
      i = markup('em');
      a1 = markup('a', { href: 'example.com' });
      a2 = markup('a', { href: 'other-example.com' });

      return post([markupSection('p', [marker('plain text'), marker('bold text', [b]), marker('i text', [i]), marker('bold+i text', [b, i])]), markupSection('p', [marker('link 1', [a1])]), cardSection('simple-card'), markupSection('p', [marker('link 2', [a2])])]);
    });

    var _post$sections$toArray = post.sections.toArray();

    var _post$sections$toArray2 = _slicedToArray(_post$sections$toArray, 4);

    var s1 = _post$sections$toArray2[0];
    var s2 = _post$sections$toArray2[1];
    var s3 = _post$sections$toArray2[3];

    assert.equal(s1.text, 'plain textbold texti textbold+i text', 'precond s1');
    assert.equal(s2.text, 'link 1', 'precond s2');
    assert.equal(s3.text, 'link 2', 'precond s3');

    var collapsedRange = _mobiledocKitUtilsCursorRange['default'].create(s1, 0, s1, 0);
    assert.equal(post.markupsInRange(collapsedRange).length, 0, 'no markups in collapsed range');

    var simpleRange = _mobiledocKitUtilsCursorRange['default'].create(s1, 0, s1, 'plain text'.length);
    assert.equal(post.markupsInRange(simpleRange).length, 0, 'no markups in simple range');

    var singleMarkerRange = _mobiledocKitUtilsCursorRange['default'].create(s1, 'plain textb'.length, s1, 'plain textbold'.length);
    found = post.markupsInRange(singleMarkerRange);
    assert.equal(found.length, 1, 'finds markup in marker');
    assert.inArray(b, found, 'finds b');

    var singleSectionRange = _mobiledocKitUtilsCursorRange['default'].create(s1, 0, s1, s1.text.length);
    found = post.markupsInRange(singleSectionRange);
    assert.equal(found.length, 2, 'finds both markups in section');
    assert.inArray(b, found, 'finds b');
    assert.inArray(i, found, 'finds i');

    var multiSectionRange = _mobiledocKitUtilsCursorRange['default'].create(s1, 'plain textbold te'.length, s2, 'link'.length);
    found = post.markupsInRange(multiSectionRange);
    assert.equal(found.length, 3, 'finds all markups in multi-section range');
    assert.inArray(b, found, 'finds b');
    assert.inArray(i, found, 'finds i');
    assert.inArray(a1, found, 'finds a1');

    var rangeSpanningCard = _mobiledocKitUtilsCursorRange['default'].create(s1, 0, s3, 'link'.length);
    found = post.markupsInRange(rangeSpanningCard);
    assert.equal(found.length, 4, 'finds all markups in spanning section range');
    assert.inArray(b, found, 'finds b');
    assert.inArray(i, found, 'finds i');
    assert.inArray(a1, found, 'finds a1');
    assert.inArray(a2, found, 'finds a2');
  });

  test('#markersContainedByRange when range is single marker', function (assert) {
    var found = undefined;
    var post = _testHelpers['default'].postAbstract.build(function (_ref3) {
      var post = _ref3.post;
      var marker = _ref3.marker;
      var markupSection = _ref3.markupSection;

      return post([markupSection('p', [marker('abc')])]);
    });

    var innerRange = _mobiledocKitUtilsCursorRange['default'].create(post.sections.head, 1, post.sections.head, 2);
    found = post.markersContainedByRange(innerRange);
    assert.equal(found.length, 0, '0 markers in innerRange');

    var outerRange = _mobiledocKitUtilsCursorRange['default'].create(post.sections.head, 0, post.sections.head, 3);
    found = post.markersContainedByRange(outerRange);
    assert.equal(found.length, 1, '1 marker in outerRange');
    assert.ok(found[0] === post.sections.head.markers.head, 'finds right marker');
  });

  test('#markersContainedByRange when range is single section', function (assert) {
    var found = undefined;
    var post = _testHelpers['default'].postAbstract.build(function (_ref4) {
      var post = _ref4.post;
      var marker = _ref4.marker;
      var markupSection = _ref4.markupSection;

      return post([markupSection('p', [marker('abc'), marker('def'), marker('ghi')])]);
    });

    var section = post.sections.head;

    var innerRange = _mobiledocKitUtilsCursorRange['default'].create(section, 2, section, 4);
    found = post.markersContainedByRange(innerRange);
    assert.equal(found.length, 0, '0 markers in innerRange');

    var middleRange = _mobiledocKitUtilsCursorRange['default'].create(section, 2, section, 7);
    found = post.markersContainedByRange(middleRange);
    assert.equal(found.length, 1, '1 markers in middleRange');
    assert.ok(found[0] === section.markers.objectAt(1), 'finds right marker');

    var middleRangeLeftFencepost = _mobiledocKitUtilsCursorRange['default'].create(section, 3, section, 7);
    found = post.markersContainedByRange(middleRangeLeftFencepost);
    assert.equal(found.length, 1, '1 markers in middleRangeLeftFencepost');
    assert.ok(found[0] === section.markers.objectAt(1), 'finds right marker');

    var middleRangeRightFencepost = _mobiledocKitUtilsCursorRange['default'].create(section, 2, section, 6);
    found = post.markersContainedByRange(middleRangeRightFencepost);
    assert.equal(found.length, 1, '1 markers in middleRangeRightFencepost');
    assert.ok(found[0] === section.markers.objectAt(1), 'finds right marker');

    var middleRangeBothFencepost = _mobiledocKitUtilsCursorRange['default'].create(section, 3, section, 6);
    found = post.markersContainedByRange(middleRangeBothFencepost);
    assert.equal(found.length, 1, '1 markers in middleRangeBothFencepost');
    assert.ok(found[0] === section.markers.objectAt(1), 'finds right marker');

    var outerRange = _mobiledocKitUtilsCursorRange['default'].create(section, 0, section, section.length);
    found = post.markersContainedByRange(outerRange);
    assert.equal(found.length, section.markers.length, 'all markers in outerRange');
  });

  test('#markersContainedByRange when range is contiguous sections', function (assert) {
    var found = undefined;
    var post = _testHelpers['default'].postAbstract.build(function (_ref5) {
      var post = _ref5.post;
      var marker = _ref5.marker;
      var markupSection = _ref5.markupSection;

      return post([markupSection('p', [marker('abc'), marker('def'), marker('ghi')]), markupSection('p', [marker('123'), marker('456'), marker('789')])]);
    });

    var headSection = post.sections.head,
        tailSection = post.sections.tail;

    var innerRange = _mobiledocKitUtilsCursorRange['default'].create(headSection, 7, tailSection, 2);
    found = post.markersContainedByRange(innerRange);
    assert.equal(found.length, 0, '0 markers in innerRange');

    var middleRange = _mobiledocKitUtilsCursorRange['default'].create(headSection, 5, tailSection, 4);
    found = post.markersContainedByRange(middleRange);
    assert.equal(found.length, 2, '2 markers in middleRange');
    assert.ok(found[0] === headSection.markers.objectAt(2), 'finds right head marker');
    assert.ok(found[1] === tailSection.markers.objectAt(0), 'finds right tail marker');

    var middleRangeLeftFencepost = _mobiledocKitUtilsCursorRange['default'].create(headSection, 6, tailSection, 2);
    found = post.markersContainedByRange(middleRangeLeftFencepost);
    assert.equal(found.length, 1, '1 markers in middleRangeLeftFencepost');
    assert.ok(found[0] === headSection.markers.objectAt(2), 'finds right head marker');

    var middleRangeRightFencepost = _mobiledocKitUtilsCursorRange['default'].create(headSection, 7, tailSection, 3);
    found = post.markersContainedByRange(middleRangeRightFencepost);
    assert.equal(found.length, 1, '1 markers in middleRangeRightFencepost');
    assert.ok(found[0] === tailSection.markers.objectAt(0), 'finds right marker');

    var middleRangeBothFencepost = _mobiledocKitUtilsCursorRange['default'].create(headSection, 6, tailSection, 3);
    found = post.markersContainedByRange(middleRangeBothFencepost);
    assert.equal(found.length, 2, '2 markers in middleRangeBothFencepost');
    assert.ok(found[0] === headSection.markers.objectAt(2), 'finds right head marker');
    assert.ok(found[1] === tailSection.markers.objectAt(0), 'finds right tail marker');

    var outerRange = _mobiledocKitUtilsCursorRange['default'].create(headSection, 0, tailSection, tailSection.length);
    found = post.markersContainedByRange(outerRange);
    assert.equal(found.length, headSection.markers.length + tailSection.markers.length, 'all markers in outerRange');
  });

  test('#isBlank is true when there are no sections', function (assert) {
    var _post = undefined,
        _section = undefined;
    _testHelpers['default'].postAbstract.build(function (_ref6) {
      var post = _ref6.post;
      var markupSection = _ref6.markupSection;

      _post = post();
      _section = markupSection();
    });
    assert.ok(_post.isBlank);
    _post.sections.append(_section);
    assert.ok(!_post.isBlank);
  });

  // see https://github.com/bustlelabs/mobiledoc-kit/issues/134
  test('#sectionsContainedBy when range covers two list items', function (assert) {
    var post = _testHelpers['default'].postAbstract.build(function (_ref7) {
      var post = _ref7.post;
      var markupSection = _ref7.markupSection;
      var marker = _ref7.marker;
      var listSection = _ref7.listSection;
      var listItem = _ref7.listItem;

      return post([listSection('ul', [listItem([marker('abc')]), listItem()]), markupSection('p', [marker('123')])]);
    });
    var li1 = post.sections.head.items.head,
        li2 = post.sections.head.items.tail;
    var section = post.sections.tail;
    assert.equal(li1.text, 'abc', 'precond - li1 text');
    assert.equal(li2.text, '', 'precond - li2 text');
    assert.equal(section.text, '123', 'precond - section text');

    var range = _mobiledocKitUtilsCursorRange['default'].create(li1, 0, li2, li2.length);
    var containedSections = post.sectionsContainedBy(range);
    assert.equal(containedSections.length, 0, 'no sections are contained');
  });

  test('#sectionsContainedBy when range contains no sections', function (assert) {
    var post = _testHelpers['default'].postAbstract.build(function (_ref8) {
      var post = _ref8.post;
      var markupSection = _ref8.markupSection;
      var marker = _ref8.marker;

      return post([markupSection('p', [marker('abc')]), markupSection('p', [marker('123')])]);
    });
    var s1 = post.sections.head,
        s2 = post.sections.tail;
    assert.equal(s1.text, 'abc', 'precond - s1 text');
    assert.equal(s2.text, '123', 'precond - s2 text');

    var range = _mobiledocKitUtilsCursorRange['default'].create(s1, 0, s2, s2.length);
    var containedSections = post.sectionsContainedBy(range);
    assert.equal(containedSections.length, 0, 'no sections are contained');
  });

  test('#sectionsContainedBy when range contains sections', function (assert) {
    var post = _testHelpers['default'].postAbstract.build(function (_ref9) {
      var post = _ref9.post;
      var markupSection = _ref9.markupSection;
      var marker = _ref9.marker;

      return post([markupSection('p', [marker('abc')]), markupSection('p', [marker('inner')]), markupSection('p', [marker('123')])]);
    });
    var s1 = post.sections.head,
        sInner = post.sections.objectAt(1),
        s2 = post.sections.tail;
    assert.equal(s1.text, 'abc', 'precond - s1 text');
    assert.equal(sInner.text, 'inner', 'precond - sInner text');
    assert.equal(s2.text, '123', 'precond - s2 text');

    var range = _mobiledocKitUtilsCursorRange['default'].create(s1, 0, s2, s2.length);
    var containedSections = post.sectionsContainedBy(range);
    assert.equal(containedSections.length, 1, '1 sections are contained');
    assert.ok(containedSections[0] === sInner, 'inner section is contained');
  });

  test('#sectionsContainedBy when range contains non-markerable sections', function (assert) {
    var post = _testHelpers['default'].postAbstract.build(function (_ref10) {
      var post = _ref10.post;
      var markupSection = _ref10.markupSection;
      var marker = _ref10.marker;
      var cardSection = _ref10.cardSection;
      var listSection = _ref10.listSection;
      var listItem = _ref10.listItem;

      return post([markupSection('p', [marker('abc')]), cardSection('test-card'), listSection('ul', [listItem([marker('li')])]), markupSection('p', [marker('123')])]);
    });
    var s1 = post.sections.head,
        card = post.sections.objectAt(1),
        list = post.sections.objectAt(2),
        s2 = post.sections.tail;

    assert.equal(s1.text, 'abc', 'precond - s1 text');
    assert.equal(s2.text, '123', 'precond - s2 text');
    var range = _mobiledocKitUtilsCursorRange['default'].create(s1, 0, s2, s2.length);
    var containedSections = post.sectionsContainedBy(range);
    assert.equal(containedSections.length, 2, '2 sections are contained');
    assert.ok(containedSections.indexOf(card) !== -1, 'contains card');
    assert.ok(containedSections.indexOf(list) !== -1, 'contains list');
  });

  test('#sectionsContainedBy when range starts/ends in list item', function (assert) {
    var post = _testHelpers['default'].postAbstract.build(function (_ref11) {
      var post = _ref11.post;
      var markupSection = _ref11.markupSection;
      var marker = _ref11.marker;
      var cardSection = _ref11.cardSection;
      var listSection = _ref11.listSection;
      var listItem = _ref11.listItem;

      return post([listSection('ul', [listItem([marker('ul1 li1')]), listItem([marker('ul1 li2')])]), markupSection('p', [marker('abc')]), cardSection('test-card'), listSection('ul', [listItem([marker('ul2 li1')]), listItem([marker('ul2 li2')])])]);
    });
    var li1 = post.sections.head.items.head,
        li2 = post.sections.tail.items.tail,
        s1 = post.sections.objectAt(1),
        card = post.sections.objectAt(2);

    assert.equal(li1.text, 'ul1 li1', 'precond - li1 text');
    assert.equal(li2.text, 'ul2 li2', 'precond - li2 text');
    assert.equal(s1.text, 'abc', 'precond - s1 text');

    var range = _mobiledocKitUtilsCursorRange['default'].create(li1, li1.length, li2, li2.length);
    var containedSections = post.sectionsContainedBy(range);
    assert.equal(containedSections.length, 2, '2 sections are contained');
    assert.ok(containedSections.indexOf(card) !== -1, 'contains card');
    assert.ok(containedSections.indexOf(s1) !== -1, 'contains section');
  });

  test('#cloneRange creates a mobiledoc from the given range', function (assert) {
    var post = _testHelpers['default'].postAbstract.build(function (_ref12) {
      var post = _ref12.post;
      var markupSection = _ref12.markupSection;
      var marker = _ref12.marker;

      return post([markupSection('p', [marker('abc')])]);
    });
    var section = post.sections.head;
    var range = _mobiledocKitUtilsCursorRange['default'].create(section, 1, section, 2); // "b"

    var mobiledoc = post.cloneRange(range);
    var expectedMobiledoc = _testHelpers['default'].mobiledoc.build(function (_ref13) {
      var post = _ref13.post;
      var marker = _ref13.marker;
      var markupSection = _ref13.markupSection;

      return post([markupSection('p', [marker('b')])]);
    });

    assert.deepEqual(mobiledoc, expectedMobiledoc);
  });

  test('#cloneRange copies card sections', function (assert) {
    var cardPayload = { foo: 'bar' };

    var buildPost = _testHelpers['default'].postAbstract.build,
        buildMobiledoc = _testHelpers['default'].mobiledoc.build;

    var post = buildPost(function (_ref14) {
      var post = _ref14.post;
      var markupSection = _ref14.markupSection;
      var marker = _ref14.marker;
      var cardSection = _ref14.cardSection;

      return post([markupSection('p', [marker('abc')]), cardSection('test-card', cardPayload), markupSection('p', [marker('123')])]);
    });

    var range = _mobiledocKitUtilsCursorRange['default'].create(post.sections.head, 1, // 'b'
    post.sections.tail, 1); // '2'

    var mobiledoc = post.cloneRange(range);
    var expectedMobiledoc = buildMobiledoc(function (_ref15) {
      var post = _ref15.post;
      var marker = _ref15.marker;
      var markupSection = _ref15.markupSection;
      var cardSection = _ref15.cardSection;

      return post([markupSection('p', [marker('bc')]), cardSection('test-card', { foo: 'bar' }), markupSection('p', [marker('1')])]);
    });

    assert.deepEqual(mobiledoc, expectedMobiledoc);
  });

  test('#cloneRange when range starts and ends in a list item', function (assert) {
    var buildPost = _testHelpers['default'].postAbstract.build,
        buildMobiledoc = _testHelpers['default'].mobiledoc.build;

    var post = buildPost(function (_ref16) {
      var post = _ref16.post;
      var listSection = _ref16.listSection;
      var listItem = _ref16.listItem;
      var marker = _ref16.marker;

      return post([listSection('ul', [listItem([marker('abc')])])]);
    });

    var range = _mobiledocKitUtilsCursorRange['default'].create(post.sections.head.items.head, 0, post.sections.head.items.head, 'ab'.length);

    var mobiledoc = post.cloneRange(range);
    var expected = buildMobiledoc(function (_ref17) {
      var post = _ref17.post;
      var listSection = _ref17.listSection;
      var listItem = _ref17.listItem;
      var marker = _ref17.marker;

      return post([listSection('ul', [listItem([marker('ab')])])]);
    });

    assert.deepEqual(mobiledoc, expected);
  });

  test('#cloneRange when range contains multiple list items', function (assert) {
    var buildPost = _testHelpers['default'].postAbstract.build,
        buildMobiledoc = _testHelpers['default'].mobiledoc.build;

    var post = buildPost(function (_ref18) {
      var post = _ref18.post;
      var listSection = _ref18.listSection;
      var listItem = _ref18.listItem;
      var marker = _ref18.marker;

      return post([listSection('ul', [listItem([marker('abc')]), listItem([marker('def')]), listItem([marker('ghi')])])]);
    });

    var range = _mobiledocKitUtilsCursorRange['default'].create(post.sections.head.items.head, 'ab'.length, post.sections.head.items.tail, 'gh'.length);

    var mobiledoc = post.cloneRange(range);
    var expected = buildMobiledoc(function (_ref19) {
      var post = _ref19.post;
      var listSection = _ref19.listSection;
      var listItem = _ref19.listItem;
      var marker = _ref19.marker;

      return post([listSection('ul', [listItem([marker('c')]), listItem([marker('def')]), listItem([marker('gh')])])]);
    });

    assert.deepEqual(mobiledoc, expected);
  });

  test('#cloneRange when range contains multiple list items and more sections', function (assert) {
    var buildPost = _testHelpers['default'].postAbstract.build,
        buildMobiledoc = _testHelpers['default'].mobiledoc.build;

    var post = buildPost(function (_ref20) {
      var post = _ref20.post;
      var listSection = _ref20.listSection;
      var listItem = _ref20.listItem;
      var markupSection = _ref20.markupSection;
      var marker = _ref20.marker;

      return post([listSection('ul', [listItem([marker('abc')]), listItem([marker('def')]), listItem([marker('ghi')])]), markupSection('p', [marker('123')])]);
    });

    var range = _mobiledocKitUtilsCursorRange['default'].create(post.sections.head.items.head, 'ab'.length, post.sections.tail, '12'.length);

    var mobiledoc = post.cloneRange(range);
    var expected = buildMobiledoc(function (_ref21) {
      var post = _ref21.post;
      var listSection = _ref21.listSection;
      var listItem = _ref21.listItem;
      var markupSection = _ref21.markupSection;
      var marker = _ref21.marker;

      return post([listSection('ul', [listItem([marker('c')]), listItem([marker('def')]), listItem([marker('ghi')])]), markupSection('p', [marker('12')])]);
    });

    assert.deepEqual(mobiledoc, expected);
  });

  test('#headPosition and #tailPosition returns head and tail', function (assert) {
    var post = _testHelpers['default'].postAbstract.build(function (_ref22) {
      var post = _ref22.post;
      var markupSection = _ref22.markupSection;
      var marker = _ref22.marker;

      return post([markupSection('p', [marker('abc')]), markupSection('p', [marker('123')])]);
    });

    var head = post.headPosition();
    var tail = post.tailPosition();

    assert.positionIsEqual(head, post.sections.head.headPosition(), 'head pos');
    assert.positionIsEqual(tail, post.sections.tail.tailPosition(), 'tail pos');
  });

  test('#headPosition and #tailPosition when post is blank return blank', function (assert) {
    var post = _testHelpers['default'].postAbstract.build(function (_ref23) {
      var post = _ref23.post;

      return post();
    });

    var head = post.headPosition();
    var tail = post.tailPosition();

    assert.positionIsEqual(head, _mobiledocKitUtilsCursorPosition['default'].blankPosition(), 'head pos');
    assert.positionIsEqual(tail, _mobiledocKitUtilsCursorPosition['default'].blankPosition(), 'tail pos');
  });
});
define('tests/unit/parsers/dom-test', ['exports', 'mobiledoc-kit/parsers/dom', 'mobiledoc-kit/models/post-node-builder', '../../test-helpers', 'mobiledoc-kit/utils/characters', 'mobiledoc-kit/editor/editor'], function (exports, _mobiledocKitParsersDom, _mobiledocKitModelsPostNodeBuilder, _testHelpers, _mobiledocKitUtilsCharacters, _mobiledocKitEditorEditor) {
  'use strict';

  var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

  var _module = _testHelpers['default'].module;
  var test = _testHelpers['default'].test;

  var ZWNJ = '‌';

  var editorElement = undefined,
      builder = undefined,
      parser = undefined,
      editor = undefined;
  var buildDOM = _testHelpers['default'].dom.fromHTML;

  function renderMobiledoc(builderFn) {
    var mobiledoc = _testHelpers['default'].mobiledoc.build(builderFn);
    var mentionAtom = {
      name: 'mention',
      type: 'dom',
      render: function render(_ref) {
        var value = _ref.value;

        var element = document.createElement('span');
        element.setAttribute('id', 'mention-atom');
        element.appendChild(document.createTextNode(value));
        return element;
      }
    };
    editor = new _mobiledocKitEditorEditor['default']({ mobiledoc: mobiledoc, atoms: [mentionAtom] });
    editor.render(editorElement);
    return editor;
  }

  _module('Unit: Parser: DOMParser', {
    beforeEach: function beforeEach() {
      editorElement = $('#editor')[0];
      builder = new _mobiledocKitModelsPostNodeBuilder['default']();
      parser = new _mobiledocKitParsersDom['default'](builder);
    },
    afterEach: function afterEach() {
      builder = null;
      parser = null;
      if (editor) {
        editor.destroy();
        editor = null;
      }
    }
  });

  test('#parse can parse a section element', function (assert) {
    var element = buildDOM("<p>some text</p>");

    var post = parser.parse(element);
    assert.ok(post, 'gets post');
    assert.equal(post.sections.length, 1, 'has 1 section');

    var s1 = post.sections.head;
    assert.equal(s1.markers.length, 1, 's1 has 1 marker');
    assert.equal(s1.markers.head.value, 'some text', 'has text');
  });

  test('#parse can parse multiple elements', function (assert) {
    var element = buildDOM('<p>some text</p><p>some other text</p>');

    var post = parser.parse(element);
    assert.ok(post, 'gets post');
    assert.equal(post.sections.length, 2, 'has 2 sections');

    var _post$sections$toArray = post.sections.toArray();

    var _post$sections$toArray2 = _slicedToArray(_post$sections$toArray, 2);

    var s1 = _post$sections$toArray2[0];
    var s2 = _post$sections$toArray2[1];

    assert.equal(s1.markers.length, 1, 's1 has 1 marker');
    assert.equal(s1.markers.head.value, 'some text');

    assert.equal(s2.markers.length, 1, 's2 has 1 marker');
    assert.equal(s2.markers.head.value, 'some other text');
  });

  test('#parse can parse spaces and breaking spaces', function (assert) {
    var element = buildDOM("<p>some &nbsp;text &nbsp;&nbsp;for &nbsp; &nbsp;you</p>");

    var post = parser.parse(element);
    var s1 = post.sections.head;
    assert.equal(s1.markers.length, 1, 's1 has 1 marker');
    assert.equal(s1.markers.head.value, 'some  text   for    you', 'has text');
  });

  test('#parse can parse tabs', function (assert) {
    var element = buildDOM('<p>a b</p>');
    var post = parser.parse(element);
    var s1 = post.sections.head;
    assert.equal(s1.markers.length, 1, 's1 has 1 marker');
    assert.equal(s1.markers.head.value, 'a' + _mobiledocKitUtilsCharacters.TAB + 'b');
  });

  test('editor#parse fixes text in atom headTextNode when atom is at start of section', function (assert) {
    var done = assert.async();
    var expected = _testHelpers['default'].postAbstract.build(function (_ref2) {
      var post = _ref2.post;
      var atom = _ref2.atom;
      var marker = _ref2.marker;
      var markupSection = _ref2.markupSection;

      return post([markupSection('p', [marker('X'), atom('mention', 'bob')])]);
    });

    editor = renderMobiledoc(function (_ref3) {
      var post = _ref3.post;
      var atom = _ref3.atom;
      var markupSection = _ref3.markupSection;

      return post([markupSection('p', [atom('mention', 'bob')])]);
    });

    var headTextNode = editor.post.sections.head.markers.head.renderNode.headTextNode;
    assert.ok(!!headTextNode, 'precond - headTextNode');
    headTextNode.textContent = ZWNJ + 'X';

    setTimeout(function () {
      assert.postIsSimilar(editor.post, expected);
      assert.renderTreeIsEqual(editor._renderTree, expected);

      done();
    });
  });

  test('editor#parse fixes text in atom headTextNode when atom has atom before it', function (assert) {
    var expected = _testHelpers['default'].postAbstract.build(function (_ref4) {
      var post = _ref4.post;
      var atom = _ref4.atom;
      var marker = _ref4.marker;
      var markupSection = _ref4.markupSection;

      return post([markupSection('p', [atom('mention', 'first'), marker('X'), atom('mention', 'last')])]);
    });

    editor = renderMobiledoc(function (_ref5) {
      var post = _ref5.post;
      var atom = _ref5.atom;
      var markupSection = _ref5.markupSection;

      return post([markupSection('p', [atom('mention', 'first'), atom('mention', 'last')])]);
    });

    var headTextNode = editor.post.sections.head.markers.tail.renderNode.headTextNode;
    assert.ok(!!headTextNode, 'precond - headTextNode');
    headTextNode.textContent = ZWNJ + 'X';

    editor._reparseSections([editor.post.sections.head]);

    assert.postIsSimilar(editor.post, expected);
    assert.renderTreeIsEqual(editor._renderTree, expected);
  });

  test('editor#parse fixes text in atom headTextNode when atom has marker before it', function (assert) {
    var done = assert.async();
    var expected = _testHelpers['default'].postAbstract.build(function (_ref6) {
      var post = _ref6.post;
      var atom = _ref6.atom;
      var marker = _ref6.marker;
      var markupSection = _ref6.markupSection;

      return post([markupSection('p', [marker('textX'), atom('mention', 'bob')])]);
    });

    editor = renderMobiledoc(function (_ref7) {
      var post = _ref7.post;
      var atom = _ref7.atom;
      var markupSection = _ref7.markupSection;
      var marker = _ref7.marker;

      return post([markupSection('p', [marker('text'), atom('mention', 'bob')])]);
    });

    var headTextNode = editor.post.sections.head.markers.objectAt(1).renderNode.headTextNode;
    assert.ok(!!headTextNode, 'precond - headTextNode');
    headTextNode.textContent = ZWNJ + 'X';

    setTimeout(function () {
      assert.postIsSimilar(editor.post, expected);
      assert.renderTreeIsEqual(editor._renderTree, expected);
      done();
    });
  });

  test('editor#parse fixes text in atom tailTextNode when atom is at end of section', function (assert) {
    var done = assert.async();
    var expected = _testHelpers['default'].postAbstract.build(function (_ref8) {
      var post = _ref8.post;
      var atom = _ref8.atom;
      var marker = _ref8.marker;
      var markupSection = _ref8.markupSection;

      return post([markupSection('p', [atom('mention', 'bob'), marker('X')])]);
    });

    editor = renderMobiledoc(function (_ref9) {
      var post = _ref9.post;
      var atom = _ref9.atom;
      var markupSection = _ref9.markupSection;

      return post([markupSection('p', [atom('mention', 'bob')])]);
    });

    var tailTextNode = editor.post.sections.head.markers.head.renderNode.tailTextNode;
    assert.ok(!!tailTextNode, 'precond - tailTextNode');
    tailTextNode.textContent = ZWNJ + 'X';

    setTimeout(function () {
      assert.postIsSimilar(editor.post, expected);
      assert.renderTreeIsEqual(editor._renderTree, expected);
      done();
    });
  });

  test('editor#parse fixes text in atom tailTextNode when atom has atom after it', function (assert) {
    var done = assert.async();
    var expected = _testHelpers['default'].postAbstract.build(function (_ref10) {
      var post = _ref10.post;
      var atom = _ref10.atom;
      var marker = _ref10.marker;
      var markupSection = _ref10.markupSection;

      return post([markupSection('p', [atom('mention', 'first'), marker('X'), atom('mention', 'last')])]);
    });

    editor = renderMobiledoc(function (_ref11) {
      var post = _ref11.post;
      var atom = _ref11.atom;
      var markupSection = _ref11.markupSection;

      return post([markupSection('p', [atom('mention', 'first'), atom('mention', 'last')])]);
    });

    var tailTextNode = editor.post.sections.head.markers.head.renderNode.tailTextNode;
    assert.ok(!!tailTextNode, 'precond - tailTextNode');
    tailTextNode.textContent = ZWNJ + 'X';

    setTimeout(function () {
      assert.postIsSimilar(editor.post, expected);
      assert.renderTreeIsEqual(editor._renderTree, expected);
      done();
    });
  });

  test('editor#parse fixes text in atom tailTextNode when atom has marker after it', function (assert) {
    var done = assert.async();

    var expected = _testHelpers['default'].postAbstract.build(function (_ref12) {
      var post = _ref12.post;
      var atom = _ref12.atom;
      var marker = _ref12.marker;
      var markupSection = _ref12.markupSection;

      return post([markupSection('p', [atom('mention', 'bob'), marker('Xabc')])]);
    });

    editor = renderMobiledoc(function (_ref13) {
      var post = _ref13.post;
      var atom = _ref13.atom;
      var markupSection = _ref13.markupSection;
      var marker = _ref13.marker;

      return post([markupSection('p', [atom('mention', 'bob'), marker('abc')])]);
    });

    var tailTextNode = editor.post.sections.head.markers.head.renderNode.tailTextNode;
    assert.ok(!!tailTextNode, 'precond - tailTextNode');
    tailTextNode.textContent = ZWNJ + 'X';

    setTimeout(function () {
      assert.postIsSimilar(editor.post, expected);
      assert.renderTreeIsEqual(editor._renderTree, expected);
      done();
    });
  });

  test('parse empty content', function (assert) {
    var element = buildDOM('');
    var post = parser.parse(element);

    assert.ok(post.isBlank, 'post is blank');
  });

  test('blank textnodes are ignored', function (assert) {
    var post = parser.parse(buildDOM('<p>first line</p>\n<p>second line</p>'));

    assert.equal(post.sections.length, 2, 'parse 2 sections');
    assert.equal(post.sections.objectAt(0).text, 'first line');
    assert.equal(post.sections.objectAt(1).text, 'second line');
  });

  test('adjacent textnodes are turned into sections', function (assert) {
    var post = parser.parse(buildDOM('<p>first line</p>middle line<p>third line</p>'));

    assert.equal(post.sections.length, 3, 'parse 3 sections');
    assert.equal(post.sections.objectAt(0).text, 'first line');
    assert.equal(post.sections.objectAt(1).text, 'middle line');
    assert.equal(post.sections.objectAt(2).text, 'third line');
  });

  test('textnode adjacent to p tag becomes section', function (assert) {
    var post = parser.parse(buildDOM('<p>first line</p>second line'));

    assert.equal(post.sections.length, 2, 'parse 2 sections');
    assert.equal(post.sections.objectAt(0).text, 'first line');
    assert.equal(post.sections.objectAt(1).text, 'second line');
  });

  test('plain text creates a section', function (assert) {
    var container = buildDOM('plain text');
    var element = container.firstChild;
    var post = parser.parse(element);

    assert.equal(post.sections.length, 1, 'parse 1 section');
    assert.equal(post.sections.objectAt(0).text, 'plain text');
  });

  test('strong tag + text node creates section', function (assert) {
    var element = buildDOM('<b>bold text</b>');
    var post = parser.parse(element);

    assert.equal(post.sections.length, 1, 'parse 1 section');
    assert.equal(post.sections.objectAt(0).text, 'bold text');
    var marker = post.sections.head.markers.head;
    assert.equal(marker.value, 'bold text');
    assert.ok(marker.hasMarkup('b'), 'marker has b');
  });

  test('strong tag + em + text node creates section', function (assert) {
    var element = buildDOM('<b><em>stray</em> markup tags</b>');
    var post = parser.parse(element);

    assert.equal(post.sections.length, 1, 'parse 1 section');
    assert.equal(post.sections.objectAt(0).text, 'stray markup tags');

    var markers = post.sections.objectAt(0).markers.toArray();
    assert.equal(markers.length, 2, '2 markers');

    var _markers = _slicedToArray(markers, 2);

    var m1 = _markers[0];
    var m2 = _markers[1];

    assert.equal(m1.value, 'stray');
    assert.equal(m2.value, ' markup tags');

    assert.ok(m1.hasMarkup('b'), 'm1 is b');
    assert.ok(m1.hasMarkup('em'), 'm1 is em');

    assert.ok(m2.hasMarkup('b'), 'm2 is b');
    assert.ok(!m2.hasMarkup('em'), 'm1 is not em');
  });

  test('link (A tag) is parsed', function (assert) {
    var url = 'http://bustle.com',
        ref = 'nofollow';
    var element = buildDOM('<a href="' + url + '" ref="' + ref + '">link</a>');
    var post = parser.parse(element);

    assert.equal(post.sections.length, 1, '1 section');
    assert.equal(post.sections.objectAt(0).text, 'link');

    var markers = post.sections.objectAt(0).markers.toArray();
    assert.equal(markers.length, 1, '1 marker');

    var _markers2 = _slicedToArray(markers, 1);

    var marker = _markers2[0];

    assert.equal(marker.value, 'link');
    assert.ok(marker.hasMarkup('a'), 'has A markup');

    var markup = marker.markups[0];
    assert.equal(markup.getAttribute('href'), url, 'has href attr');
    assert.equal(markup.getAttribute('ref'), ref, 'has ref attr');
  });

  test('unrecognized tags are ignored', function (assert) {
    var element = buildDOM('<p>before<span>span</span>after</p>');
    var post = parser.parse(element);

    assert.equal(post.sections.length, 1, '1 section');
    assert.equal(post.sections.objectAt(0).text, 'beforespanafter');
    assert.equal(post.sections.objectAt(0).markers.length, 1, '1 marker');
  });

  test('doubly-nested span with text is parsed into a section', function (assert) {
    var element = buildDOM('<p><span><span>inner</span></span></p>');
    var post = parser.parse(element);

    assert.equal(post.sections.length, 1, '1 section');
    assert.equal(post.sections.objectAt(0).text, 'inner');
    assert.equal(post.sections.objectAt(0).markers.length, 1, '1 marker');
  });

  test('span with font-style italic maps to em', function (assert) {
    var element = buildDOM('<p><span style="font-style:ItaLic;">emph</span></p>');
    var post = parser.parse(element);

    assert.equal(post.sections.length, 1, '1 section');

    var section = post.sections.objectAt(0);
    assert.equal(section.markers.length, 1, '1 marker');
    var marker = section.markers.objectAt(0);

    assert.equal(marker.value, 'emph');
    assert.ok(marker.hasMarkup('em'), 'marker is em');
  });

  test('span with font-weight 700 maps to strong', function (assert) {
    var element = buildDOM('<p><span style="font-weight:700;">bold 700</span></p>');
    var post = parser.parse(element);

    assert.equal(post.sections.length, 1, '1 section');

    var section = post.sections.objectAt(0);
    assert.equal(section.markers.length, 1, '1 marker');
    var marker = section.markers.objectAt(0);

    assert.equal(marker.value, 'bold 700');
    assert.ok(marker.hasMarkup('strong'), 'marker is strong');
  });

  test('span with font-weight "bold" maps to strong', function (assert) {
    var element = buildDOM('<p><span style="font-weight:bold;">bold bold</span></p>');
    var post = parser.parse(element);

    assert.equal(post.sections.length, 1, '1 section');

    var section = post.sections.objectAt(0);
    assert.equal(section.markers.length, 1, '1 marker');
    var marker = section.markers.objectAt(0);

    assert.equal(marker.value, 'bold bold');
    assert.ok(marker.hasMarkup('strong'), 'marker is strong');
  });

  test('unrecognized inline styles are ignored', function (assert) {
    var element = buildDOM('<p><span style="font-color:red;">was red</span></p>');
    var post = parser.parse(element);

    assert.equal(post.sections.length, 1, '1 section');

    var section = post.sections.objectAt(0);
    assert.equal(section.markers.length, 1, '1 marker');
    var marker = section.markers.objectAt(0);

    assert.equal(marker.value, 'was red');
    assert.equal(marker.markups.length, 0, 'no markups');
  });

  test('recognized markup section tags are parsed (H1)', function (assert) {
    var element = buildDOM('<h1>h1 text</h1>');
    var post = parser.parse(element);

    assert.equal(post.sections.length, 1, '1 section');
    assert.equal(post.sections.objectAt(0).text, 'h1 text');
    assert.equal(post.sections.objectAt(0).tagName, 'h1');
  });

  test('recognized markup section tags are parsed (H2)', function (assert) {
    var element = buildDOM('<h2>h2 text</h2>');
    var post = parser.parse(element);

    assert.equal(post.sections.length, 1, '1 section');
    assert.equal(post.sections.objectAt(0).text, 'h2 text');
    assert.equal(post.sections.objectAt(0).tagName, 'h2');
  });

  test('recognized markup section tags are parsed (H3)', function (assert) {
    var element = buildDOM('<h3>h3 text</h3>');
    var post = parser.parse(element);

    assert.equal(post.sections.length, 1, '1 section');
    assert.equal(post.sections.objectAt(0).text, 'h3 text');
    assert.equal(post.sections.objectAt(0).tagName, 'h3');
  });

  test('recognized markup section tags are parsed (blockquote)', function (assert) {
    var element = buildDOM('<blockquote>blockquote text</blockquote>');
    var post = parser.parse(element);

    assert.equal(post.sections.length, 1, '1 section');
    assert.equal(post.sections.objectAt(0).text, 'blockquote text');
    assert.equal(post.sections.objectAt(0).tagName, 'blockquote');
  });

  test('unrecognized attributes are ignored', function (assert) {
    var element = buildDOM('\n    <a href="http://bustle.com"\n       style="text-decoration: none">not-underlined link</a>');
    var post = parser.parse(element);

    assert.equal(post.sections.length, 1, '1 section');
    assert.equal(post.sections.objectAt(0).text, 'not-underlined link');
    var marker = post.sections.objectAt(0).markers.objectAt(0);
    assert.equal(marker.value, 'not-underlined link');
    assert.ok(marker.hasMarkup('a'), 'has <a> markup');
    var markup = marker.getMarkup('a');
    assert.equal(markup.getAttribute('href'), 'http://bustle.com');
    assert.ok(!markup.getAttribute('style'), 'style attribute not included');
  });

  test('singly-nested ul lis are parsed correctly', function (assert) {
    var element = buildDOM('\n    <ul><li>first element</li><li>second element</li></ul>\n  ');
    var post = parser.parse(element);

    assert.equal(post.sections.length, 1, '1 section');
    var section = post.sections.objectAt(0);
    assert.equal(section.tagName, 'ul');
    assert.equal(section.items.length, 2, '2 items');
    assert.equal(section.items.objectAt(0).text, 'first element');
    assert.equal(section.items.objectAt(1).text, 'second element');
  });

  test('singly-nested ol lis are parsed correctly', function (assert) {
    var element = buildDOM('\n    <ol><li>first element</li><li>second element</li></ol>\n  ');
    var post = parser.parse(element);

    assert.equal(post.sections.length, 1, '1 section');
    var section = post.sections.objectAt(0);
    assert.equal(section.tagName, 'ol');
    assert.equal(section.items.length, 2, '2 items');
    assert.equal(section.items.objectAt(0).text, 'first element');
    assert.equal(section.items.objectAt(1).text, 'second element');
  });

  test('lis in nested uls are flattened (when ul is child of li)', function (assert) {
    var element = buildDOM('\n    <ul>\n      <li>first element</li>\n      <li><ul><li>nested element</li></ul></li>\n    </ul>\n  ');
    var post = parser.parse(element);

    assert.equal(post.sections.length, 1, '1 section');
    var section = post.sections.objectAt(0);
    assert.equal(section.tagName, 'ul');
    assert.equal(section.items.length, 2, '2 items');
    assert.equal(section.items.objectAt(0).text, 'first element');
    assert.equal(section.items.objectAt(1).text, 'nested element');
  });

  /*
   * FIXME: Google docs nests uls like this
  test('lis in nested uls are flattened (when ul is child of ul)', (assert) => {
    let element= buildDOM(`
      <ul>
        <li>outer</li>
        <ul><li>inner</li></ul>
      </ul>
    `);
    const post = parser.parse(element);
  
    assert.equal(post.sections.length, 1, '1 section');
    let section = post.sections.objectAt(0);
    assert.equal(section.tagName, 'ul');
    assert.equal(section.items.length, 2, '2 items');
    assert.equal(section.items.objectAt(0).text, 'outer');
    assert.equal(section.items.objectAt(1).text, 'inner');
  });
   */
});
define('tests/unit/parsers/html-google-docs-test', ['exports', 'mobiledoc-kit/parsers/html', 'mobiledoc-kit/models/post-node-builder', '../../test-helpers', '../../fixtures/google-docs', 'mobiledoc-kit/utils/array-utils', 'mobiledoc-kit/models/types'], function (exports, _mobiledocKitParsersHtml, _mobiledocKitModelsPostNodeBuilder, _testHelpers, _fixturesGoogleDocs, _mobiledocKitUtilsArrayUtils, _mobiledocKitModelsTypes) {
  'use strict';

  var _module = _testHelpers['default'].module;
  var test = _testHelpers['default'].test;

  function parseHTML(html) {
    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    var builder = new _mobiledocKitModelsPostNodeBuilder['default']();
    return new _mobiledocKitParsersHtml['default'](builder, options).parse(html);
  }

  _module('Unit: Parser: HTMLParser Google Docs');

  function equalToExpected(assert, rawHTML, expectedHTML) {
    var raw = parseHTML(rawHTML),
        expected = parseHTML(expectedHTML);

    assert.equal(raw.sections.length, expected.sections.length, 'matches section length');
    raw.sections.forEach(function (section, sectionIndex) {
      var expectedSection = expected.sections.objectAt(sectionIndex);

      if (section.type === _mobiledocKitModelsTypes.CARD_TYPE) {
        assert.equal(section.name, expectedSection.name, 'card section at index ' + sectionIndex + ' has equal name');

        assert.deepEqual(section.payload, expectedSection.payload, 'card section at index ' + sectionIndex + ' has equal payload');

        return;
      }

      assert.equal(section.markers.length, expectedSection.markers.length, 'section at index ' + sectionIndex + ' has equal marker length');
      assert.equal(section.text, expectedSection.text, 'section at index ' + sectionIndex + ' has equal text');
      assert.equal(section.tagName, expectedSection.tagName, 'section at index ' + sectionIndex + ' has equal tagName');

      section.markers.forEach(function (marker, markerIndex) {
        var expectedMarker = expectedSection.markers.objectAt(markerIndex);

        assert.equal(marker.value, expectedMarker.value, 'marker #' + markerIndex + ' at section #' + sectionIndex + ' matches value');

        assert.equal(marker.markups.length, expectedMarker.markups.length, 'marker #' + markerIndex + ' at section #' + sectionIndex + ' matches markups length');

        (0, _mobiledocKitUtilsArrayUtils.forEach)(expectedMarker.markups, function (expectedMarkup) {
          var markup = marker.getMarkup(expectedMarkup.tagName);
          assert.ok(markup, 'has markup with tagName ' + expectedMarkup.tagName);
          var attributes = expectedMarkup.attributes;
          (0, _mobiledocKitUtilsArrayUtils.forEach)(Object.keys(attributes), function (key) {
            assert.equal(expectedMarkup.getAttribute(key), markup.getAttribute(key), 'equal attribute value for ' + key);
          });
        });
      });
    });
  }

  Object.keys(_fixturesGoogleDocs['default']).forEach(function (key) {
    test(key, function (assert) {
      var example = _fixturesGoogleDocs['default'][key];
      equalToExpected(assert, example.raw, example.expected);
    });
  });

  test('img in span can use a cardParser to turn img into image-card', function (assert) {
    var example = _fixturesGoogleDocs['default']['img in span'];
    var options = {
      plugins: [function (element, builder, _ref) {
        var addSection = _ref.addSection;

        if (element.tagName === 'IMG') {
          var _payload = { url: element.src };
          var cardSection = builder.createCardSection('image-card', _payload);
          addSection(cardSection);
        }
      }]
    };
    var parsed = parseHTML(example.raw, options);

    var sections = parsed.sections.toArray();
    var found = false,
        payload = undefined;
    for (var i = 0; i < sections.length; i++) {
      if (sections[i].name === 'image-card') {
        found = true;
        payload = sections[i].payload;
      }
    }
    assert.ok(found, 'found image-card');
    assert.ok(payload.url, 'has url in payload');
  });
});
define('tests/unit/parsers/html-google-sheets-test', ['exports', 'mobiledoc-kit/parsers/html', 'mobiledoc-kit/models/post-node-builder', '../../test-helpers'], function (exports, _mobiledocKitParsersHtml, _mobiledocKitModelsPostNodeBuilder, _testHelpers) {
  'use strict';

  var _module = _testHelpers['default'].module;
  var test = _testHelpers['default'].test;

  var parser = undefined;

  _module('Unit: Parser: HTMLParser Google Sheets', {
    beforeEach: function beforeEach() {
      var options = {};
      var builder = new _mobiledocKitModelsPostNodeBuilder['default']();
      parser = new _mobiledocKitParsersHtml['default'](builder, options);
    },
    afterEach: function afterEach() {
      parser = null;
    }
  });

  // No formatting
  test('#parse returns a markup section when given a cell without formatting', function (assert) {
    var text = '<meta http-equiv="content-type" content="text/html; charset=utf-8"><style type="text/css"><!--td {border: 1px solid #ccc;}br {mso-data-placement:same-cell;}--></style><span style="font-size:13px;font-family:Arial;" data-sheets-value="[null,2,&quot;Ways of climbing over the wall&quot;]" data-sheets-userformat="[null,null,513,[null,0],null,null,null,null,null,null,null,null,0]">Ways of climbing over the wall</span>';
    var post = parser.parse(text);
    var expected = _testHelpers['default'].postAbstract.build(function (_ref) {
      var post = _ref.post;
      var markupSection = _ref.markupSection;
      var marker = _ref.marker;

      return post([markupSection('p', [marker('Ways of climbing over the wall')])]);
    });

    assert.postIsSimilar(post, expected);
  });

  // No formatting (Chrome - Windows)
  test('#parse returns a markup section when given a cell without formatting (Chrome - Windows)', function (assert) {
    var text = '<html><body><!--StartFragment--><style type="text/css"><!--td {border: 1px solid #ccc;}br {mso-data-placement:same-cell;}--></style><span style="font-size:13px;font-family:Arial;" data-sheets-value="[null,2,&quot;Ways of climbing over the wall&quot;]" data-sheets-userformat="[null,null,513,[null,0],null,null,null,null,null,null,null,null,0]">Ways of climbing over the wall</span><!--EndFragment--></body></html>';
    var post = parser.parse(text);
    var expected = _testHelpers['default'].postAbstract.build(function (_ref2) {
      var post = _ref2.post;
      var markupSection = _ref2.markupSection;
      var marker = _ref2.marker;

      return post([markupSection('p', [marker('Ways of climbing over the wall')])]);
    });

    assert.postIsSimilar(post, expected);
  });

  // Cell in bold
  test('#parse returns a markup section with bold when given a cell in bold', function (assert) {
    var text = '<meta http-equiv="content-type" content="text/html; charset=utf-8"><style type="text/css"><!--td {border: 1px solid #ccc;}br {mso-data-placement:same-cell;}--></style><span style="font-size:13px;font-family:Arial;font-weight:bold;" data-sheets-value="[null,2,&quot;Ways of climbing over the wall&quot;]" data-sheets-userformat="[null,null,16897,[null,0],null,null,null,null,null,null,null,null,0,null,null,null,null,1]">Ways of climbing over the wall</span>';
    var post = parser.parse(text);
    var expected = _testHelpers['default'].postAbstract.build(function (_ref3) {
      var post = _ref3.post;
      var markupSection = _ref3.markupSection;
      var marker = _ref3.marker;
      var markup = _ref3.markup;

      var b = markup('strong');
      return post([markupSection('p', [marker('Ways of climbing over the wall', [b])])]);
    });

    assert.postIsSimilar(post, expected);
  });

  // Cell in bold (Chrome - Windows)
  test('#parse returns a markup section with bold when given a cell in bold (Chrome - Windows)', function (assert) {
    var text = '<html><body><!--StartFragment--><style type="text/css"><!--td {border: 1px solid #ccc;}br {mso-data-placement:same-cell;}--></style><span style="font-size:13px;font-family:Arial;font-weight:bold;" data-sheets-value="[null,2,&quot;Ways of climbing over the wall&quot;]" data-sheets-userformat="[null,null,16897,[null,0],null,null,null,null,null,null,null,null,0,null,null,null,null,1]">Ways of climbing over the wall</span><!--EndFragment--></body></html>';
    var post = parser.parse(text);
    var expected = _testHelpers['default'].postAbstract.build(function (_ref4) {
      var post = _ref4.post;
      var markupSection = _ref4.markupSection;
      var marker = _ref4.marker;
      var markup = _ref4.markup;

      var b = markup('strong');
      return post([markupSection('p', [marker('Ways of climbing over the wall', [b])])]);
    });

    assert.postIsSimilar(post, expected);
  });

  // Two adjacent cells without formatting
  test('#parse returns a single markup section when given two cells on top of each other without formatting', function (assert) {
    var text = '<meta http-equiv="content-type" content="text/html; charset=utf-8"><meta name="generator" content="Sheets"><style type="text/css"><!--td {border: 1px solid #ccc;}br {mso-data-placement:same-cell;}--></style><table cellspacing="0" cellpadding="0" dir="ltr" border="1" style="table-layout:fixed;font-size:13px;font-family:arial,sans,sans-serif;border-collapse:collapse;border:1px solid #ccc"><colgroup><col width="361"></colgroup><tbody><tr style="height:21px;"><td style="padding:2px 3px 2px 3px;vertical-align:bottom;font-family:Arial;" data-sheets-value="[null,2,&quot;Ostalgia&quot;]">Ostalgia</td></tr><tr style="height:21px;"><td style="padding:2px 3px 2px 3px;vertical-align:bottom;font-family:Arial;" data-sheets-value="[null,2,&quot;Photo&quot;]">Photo</td></tr></tbody></table>';
    var post = parser.parse(text);
    var expected = _testHelpers['default'].postAbstract.build(function (_ref5) {
      var post = _ref5.post;
      var markupSection = _ref5.markupSection;
      var marker = _ref5.marker;

      return post([markupSection('p', [marker('OstalgiaPhoto')])]);
    });

    assert.postIsSimilar(post, expected);
  });

  // Two adjacent cells without formatting (Chrome - Windows)
  test('#parse returns a single markup section when given two cells on top of each other without formatting (Chrome - Windows)', function (assert) {
    var text = '<html><body><!--StartFragment--><meta name="generator" content="Sheets"><style type="text/css"><!--td {border: 1px solid #ccc;}br {mso-data-placement:same-cell;}--></style><table cellspacing="0" cellpadding="0" dir="ltr" border="1" style="table-layout:fixed;font-size:13px;font-family:arial,sans,sans-serif;border-collapse:collapse;border:1px solid #ccc"><colgroup><col width="361"></colgroup><tbody><tr style="height:21px;"><td style="padding:2px 3px 2px 3px;vertical-align:bottom;font-family:Arial;" data-sheets-value="[null,2,&quot;Ostalgia&quot;]">Ostalgia</td></tr><tr style="height:21px;"><td style="padding:2px 3px 2px 3px;vertical-align:bottom;font-family:Arial;" data-sheets-value="[null,2,&quot;Photo&quot;]">Photo</td></tr></tbody></table><!--EndFragment--></body></html>';
    var post = parser.parse(text);
    var expected = _testHelpers['default'].postAbstract.build(function (_ref6) {
      var post = _ref6.post;
      var markupSection = _ref6.markupSection;
      var marker = _ref6.marker;

      return post([markupSection('p', [marker('OstalgiaPhoto')])]);
    });

    assert.postIsSimilar(post, expected);
  });
});
define('tests/unit/parsers/html-test', ['exports', 'mobiledoc-kit/parsers/html', 'mobiledoc-kit/models/post-node-builder', '../../test-helpers'], function (exports, _mobiledocKitParsersHtml, _mobiledocKitModelsPostNodeBuilder, _testHelpers) {
  'use strict';

  var _module = _testHelpers['default'].module;
  var test = _testHelpers['default'].test;

  function parseHTML(html) {
    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    var builder = new _mobiledocKitModelsPostNodeBuilder['default']();
    return new _mobiledocKitParsersHtml['default'](builder, options).parse(html);
  }

  _module('Unit: Parser: HTMLParser');

  test('style tags are ignored', function (assert) {
    // This is the html you get when copying a message from Slack's desktop app
    var html = '<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd"> <html> <head> <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"> <meta http-equiv="Content-Style-Type" content="text/css"> <title></title> <meta name="Generator" content="Cocoa HTML Writer"> <meta name="CocoaVersion" content="1348.17"> <style type="text/css"> p.p1 {margin: 0.0px 0.0px 0.0px 0.0px; font: 15.0px Times; color: #2c2d30; -webkit-text-stroke: #2c2d30; background-color: #f9f9f9} span.s1 {font-kerning: none} </style> </head> <body> <p class="p1"><span class="s1">cool</span></p> </body> </html>';
    var post = parseHTML(html);

    var expected = _testHelpers['default'].postAbstract.build(function (_ref) {
      var post = _ref.post;
      var markupSection = _ref.markupSection;
      var marker = _ref.marker;

      return post([markupSection('p', [marker('cool')])]);
    });

    assert.postIsSimilar(post, expected);
  });
});
define('tests/unit/parsers/mobiledoc-test', ['exports', 'mobiledoc-kit/parsers/mobiledoc', 'mobiledoc-kit/renderers/mobiledoc/0-2', 'mobiledoc-kit/models/post-node-builder', '../../test-helpers'], function (exports, _mobiledocKitParsersMobiledoc, _mobiledocKitRenderersMobiledoc02, _mobiledocKitModelsPostNodeBuilder, _testHelpers) {
  'use strict';

  var _window$QUnit = window.QUnit;
  var _module = _window$QUnit.module;
  var test = _window$QUnit.test;

  var builder = undefined,
      post = undefined;

  function parse(mobiledoc) {
    return _mobiledocKitParsersMobiledoc['default'].parse(builder, mobiledoc);
  }

  _module('Unit: Parsers: Mobiledoc', {
    beforeEach: function beforeEach() {
      builder = new _mobiledocKitModelsPostNodeBuilder['default']();
      post = builder.createPost();
    },
    afterEach: function afterEach() {
      builder = null;
      post = null;
    }
  });

  test('#parse empty doc returns an empty post', function (assert) {
    var mobiledoc = {
      version: _mobiledocKitRenderersMobiledoc02.MOBILEDOC_VERSION,
      sections: [[], []]
    };

    var parsed = parse(mobiledoc);
    assert.equal(parsed.sections.length, 0, '0 sections');
  });

  test('#parse basic mobiledoc from renderer works', function (assert) {
    var mobiledoc = _testHelpers['default'].mobiledoc.build(function (_ref) {
      var post = _ref.post;
      var markupSection = _ref.markupSection;
      var marker = _ref.marker;

      return post([markupSection('p', [marker('Howdy')])]);
    });

    var parsed = parse(mobiledoc);
    assert.equal(parsed.sections.length, 1, '1 section');
  });
});
define('tests/unit/parsers/mobiledoc/0-2-test', ['exports', 'mobiledoc-kit/parsers/mobiledoc/0-2', 'mobiledoc-kit/renderers/mobiledoc/0-2', 'mobiledoc-kit/models/post-node-builder'], function (exports, _mobiledocKitParsersMobiledoc02, _mobiledocKitRenderersMobiledoc02, _mobiledocKitModelsPostNodeBuilder) {
  'use strict';

  var DATA_URL = "data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACwAAAAAAQABAAACAkQBADs=";
  var _window$QUnit = window.QUnit;
  var _module = _window$QUnit.module;
  var test = _window$QUnit.test;

  var parser = undefined,
      builder = undefined,
      post = undefined;

  _module('Unit: Parsers: Mobiledoc 0.2', {
    beforeEach: function beforeEach() {
      builder = new _mobiledocKitModelsPostNodeBuilder['default']();
      parser = new _mobiledocKitParsersMobiledoc02['default'](builder);
      post = builder.createPost();
    },
    afterEach: function afterEach() {
      parser = null;
      builder = null;
      post = null;
    }
  });

  test('#parse empty doc returns an empty post', function (assert) {
    var mobiledoc = {
      version: _mobiledocKitRenderersMobiledoc02.MOBILEDOC_VERSION,
      sections: [[], []]
    };

    var parsed = parser.parse(mobiledoc);
    assert.equal(parsed.sections.length, 0, '0 sections');
  });

  test('#parse empty markup section returns an empty post', function (assert) {
    var mobiledoc = {
      version: _mobiledocKitRenderersMobiledoc02.MOBILEDOC_VERSION,
      sections: [[], [[1, 'p', []]]]
    };

    var section = builder.createMarkupSection('p');
    post.sections.append(section);
    assert.deepEqual(parser.parse(mobiledoc), post);
  });

  test('#parse doc without marker types', function (assert) {
    var mobiledoc = {
      version: _mobiledocKitRenderersMobiledoc02.MOBILEDOC_VERSION,
      sections: [[], [[1, 'P', [[[], 0, 'hello world']]]]]
    };
    var parsed = parser.parse(mobiledoc);

    var section = builder.createMarkupSection('P', [], false);
    var marker = builder.createMarker('hello world');
    section.markers.append(marker);
    post.sections.append(section);

    assert.deepEqual(parsed, post);
  });

  test('#parse doc with blank marker', function (assert) {
    var mobiledoc = {
      version: _mobiledocKitRenderersMobiledoc02.MOBILEDOC_VERSION,
      sections: [[], [[1, 'P', [[[], 0, '']]]]]
    };
    var parsed = parser.parse(mobiledoc);

    var section = builder.createMarkupSection('P', [], false);
    post.sections.append(section);

    assert.deepEqual(parsed, post);
  });

  test('#parse doc with marker type', function (assert) {
    var mobiledoc = {
      version: _mobiledocKitRenderersMobiledoc02.MOBILEDOC_VERSION,
      sections: [[['B'], ['A', ['href', 'google.com']]], [[1, 'P', [[[1], 0, 'hello'], // a tag open
      [[0], 1, 'brave new'], // b tag open/close
      [[], 1, 'world'] // a tag close
      ]]]]
    };
    var parsed = parser.parse(mobiledoc);

    var section = builder.createMarkupSection('P', [], false);
    var aMarkerType = builder.createMarkup('A', { href: 'google.com' });
    var bMarkerType = builder.createMarkup('B');

    var markers = [builder.createMarker('hello', [aMarkerType]), builder.createMarker('brave new', [aMarkerType, bMarkerType]), builder.createMarker('world', [aMarkerType])];
    markers.forEach(function (marker) {
      return section.markers.append(marker);
    });
    post.sections.append(section);

    assert.deepEqual(parsed, post);
  });

  test('#parse doc with image section', function (assert) {
    var mobiledoc = {
      version: _mobiledocKitRenderersMobiledoc02.MOBILEDOC_VERSION,
      sections: [[], [[2, DATA_URL]]]
    };

    var parsed = parser.parse(mobiledoc);

    var section = builder.createImageSection(DATA_URL);
    post.sections.append(section);
    assert.deepEqual(parsed, post);
  });

  test('#parse doc with custom card type', function (assert) {
    var mobiledoc = {
      version: _mobiledocKitRenderersMobiledoc02.MOBILEDOC_VERSION,
      sections: [[], [[10, 'custom-card', {}]]]
    };

    var parsed = parser.parse(mobiledoc);

    var section = builder.createCardSection('custom-card');
    post.sections.append(section);
    assert.deepEqual(parsed, post);
  });

  test('#parse a mobile doc with list-section and list-item', function (assert) {
    var mobiledoc = {
      version: _mobiledocKitRenderersMobiledoc02.MOBILEDOC_VERSION,
      sections: [[], [[3, 'ul', [[[[], 0, "first item"]], [[[], 0, "second item"]]]]]]
    };

    var parsed = parser.parse(mobiledoc);

    var items = [builder.createListItem([builder.createMarker('first item')]), builder.createListItem([builder.createMarker('second item')])];
    var section = builder.createListSection('ul', items);
    post.sections.append(section);
    assert.deepEqual(parsed, post);
  });
});
define('tests/unit/parsers/mobiledoc/0-3-test', ['exports', 'mobiledoc-kit/parsers/mobiledoc/0-3', 'mobiledoc-kit/renderers/mobiledoc/0-3', 'mobiledoc-kit/models/post-node-builder'], function (exports, _mobiledocKitParsersMobiledoc03, _mobiledocKitRenderersMobiledoc03, _mobiledocKitModelsPostNodeBuilder) {
  'use strict';

  var DATA_URL = "data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACwAAAAAAQABAAACAkQBADs=";
  var _window$QUnit = window.QUnit;
  var _module = _window$QUnit.module;
  var test = _window$QUnit.test;

  var parser = undefined,
      builder = undefined,
      post = undefined;

  _module('Unit: Parsers: Mobiledoc 0.3', {
    beforeEach: function beforeEach() {
      builder = new _mobiledocKitModelsPostNodeBuilder['default']();
      parser = new _mobiledocKitParsersMobiledoc03['default'](builder);
      post = builder.createPost();
    },
    afterEach: function afterEach() {
      parser = null;
      builder = null;
      post = null;
    }
  });

  test('#parse empty doc returns an empty post', function (assert) {
    var mobiledoc = {
      version: _mobiledocKitRenderersMobiledoc03.MOBILEDOC_VERSION,
      atoms: [],
      cards: [],
      markups: [],
      sections: []
    };

    var parsed = parser.parse(mobiledoc);
    assert.equal(parsed.sections.length, 0, '0 sections');
  });

  test('#parse empty markup section returns an empty post', function (assert) {
    var mobiledoc = {
      version: _mobiledocKitRenderersMobiledoc03.MOBILEDOC_VERSION,
      atoms: [],
      cards: [],
      markups: [],
      sections: [[1, 'p', []]]
    };

    var section = builder.createMarkupSection('p');
    post.sections.append(section);
    assert.deepEqual(parser.parse(mobiledoc), post);
  });

  test('#parse doc without marker types', function (assert) {
    var mobiledoc = {
      version: _mobiledocKitRenderersMobiledoc03.MOBILEDOC_VERSION,
      atoms: [],
      cards: [],
      markups: [],
      sections: [[1, 'P', [[0, [], 0, 'hello world']]]]
    };
    var parsed = parser.parse(mobiledoc);

    var section = builder.createMarkupSection('P', [], false);
    var marker = builder.createMarker('hello world');
    section.markers.append(marker);
    post.sections.append(section);

    assert.deepEqual(parsed, post);
  });

  test('#parse doc with blank marker', function (assert) {
    var mobiledoc = {
      version: _mobiledocKitRenderersMobiledoc03.MOBILEDOC_VERSION,
      atoms: [],
      cards: [],
      markups: [],
      sections: [[1, 'P', [[0, [], 0, '']]]]
    };
    var parsed = parser.parse(mobiledoc);

    var section = builder.createMarkupSection('P', [], false);
    post.sections.append(section);

    assert.deepEqual(parsed, post);
  });

  test('#parse doc with marker type', function (assert) {
    var mobiledoc = {
      version: _mobiledocKitRenderersMobiledoc03.MOBILEDOC_VERSION,
      atoms: [],
      cards: [],
      markups: [['B'], ['A', ['href', 'google.com']]],
      sections: [[1, 'P', [[0, [1], 0, 'hello'], // a tag open
      [0, [0], 1, 'brave new'], // b tag open/close
      [0, [], 1, 'world'] // a tag close
      ]]]
    };
    var parsed = parser.parse(mobiledoc);

    var section = builder.createMarkupSection('P', [], false);
    var aMarkerType = builder.createMarkup('A', { href: 'google.com' });
    var bMarkerType = builder.createMarkup('B');

    var markers = [builder.createMarker('hello', [aMarkerType]), builder.createMarker('brave new', [aMarkerType, bMarkerType]), builder.createMarker('world', [aMarkerType])];
    markers.forEach(function (marker) {
      return section.markers.append(marker);
    });
    post.sections.append(section);

    assert.deepEqual(parsed, post);
  });

  test('#parse doc with image section', function (assert) {
    var mobiledoc = {
      version: _mobiledocKitRenderersMobiledoc03.MOBILEDOC_VERSION,
      atoms: [],
      cards: [],
      markups: [],
      sections: [[2, DATA_URL]]
    };

    var parsed = parser.parse(mobiledoc);

    var section = builder.createImageSection(DATA_URL);
    post.sections.append(section);
    assert.deepEqual(parsed, post);
  });

  test('#parse doc with custom card type', function (assert) {
    var mobiledoc = {
      version: _mobiledocKitRenderersMobiledoc03.MOBILEDOC_VERSION,
      atoms: [],
      cards: [['custom-card', {}]],
      markups: [],
      sections: [[10, 0]]
    };

    var parsed = parser.parse(mobiledoc);

    var section = builder.createCardSection('custom-card');
    post.sections.append(section);
    assert.deepEqual(parsed, post);
  });

  test('#parse doc with custom atom type', function (assert) {
    var mobiledoc = {
      version: _mobiledocKitRenderersMobiledoc03.MOBILEDOC_VERSION,
      atoms: [['mention', '@bob', { id: 42 }]],
      cards: [],
      markups: [],
      sections: [[1, 'P', [[1, [], 0, 0]]]]
    };

    var parsed = parser.parse(mobiledoc);

    var section = builder.createMarkupSection('P', [], false);
    var atom = builder.createAtom('mention', '@bob', { id: 42 });
    section.markers.append(atom);
    post.sections.append(section);

    assert.deepEqual(parsed, post);
  });

  test('#parse a mobile doc with list-section and list-item', function (assert) {
    var mobiledoc = {
      version: _mobiledocKitRenderersMobiledoc03.MOBILEDOC_VERSION,
      atoms: [],
      cards: [],
      markups: [],
      sections: [[3, 'ul', [[[0, [], 0, "first item"]], [[0, [], 0, "second item"]]]]]
    };

    var parsed = parser.parse(mobiledoc);

    var items = [builder.createListItem([builder.createMarker('first item')]), builder.createListItem([builder.createMarker('second item')])];
    var section = builder.createListSection('ul', items);
    post.sections.append(section);
    assert.deepEqual(parsed, post);
  });
});
define('tests/unit/parsers/section-test', ['exports', 'mobiledoc-kit/models/post-node-builder', 'mobiledoc-kit/parsers/section', '../../test-helpers'], function (exports, _mobiledocKitModelsPostNodeBuilder, _mobiledocKitParsersSection, _testHelpers) {
  'use strict';

  var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

  var _module = _testHelpers['default'].module;
  var test = _testHelpers['default'].test;

  var builder = undefined,
      parser = undefined;
  var buildDOM = _testHelpers['default'].dom.fromHTML;

  _module('Unit: Parser: SectionParser', {
    beforeEach: function beforeEach() {
      builder = new _mobiledocKitModelsPostNodeBuilder['default']();
      parser = new _mobiledocKitParsersSection['default'](builder);
    },
    afterEach: function afterEach() {
      builder = null;
      parser = null;
    }
  });

  test('#parse parses simple dom', function (assert) {
    var container = buildDOM('<p>hello there<b>i am bold</b><p>');
    var element = container.firstChild;

    var _parser$parse = parser.parse(element);

    var _parser$parse2 = _slicedToArray(_parser$parse, 1);

    var section = _parser$parse2[0];

    assert.equal(section.tagName, 'p');
    assert.equal(section.markers.length, 2, 'has 2 markers');

    var _section$markers$toArray = section.markers.toArray();

    var _section$markers$toArray2 = _slicedToArray(_section$markers$toArray, 2);

    var m1 = _section$markers$toArray2[0];
    var m2 = _section$markers$toArray2[1];

    assert.equal(m1.value, 'hello there');
    assert.equal(m2.value, 'i am bold');
    assert.ok(m2.hasMarkup('b'), 'm2 is bold');
  });

  test('#parse parses nested markups', function (assert) {
    var container = buildDOM('\n    <p><b>i am bold<i>i am bold and italic</i>i am bold again</b></p>\n  ');
    var element = container.firstChild;

    var _parser$parse3 = parser.parse(element);

    var _parser$parse32 = _slicedToArray(_parser$parse3, 1);

    var section = _parser$parse32[0];

    assert.equal(section.markers.length, 3, 'has 3 markers');

    var _section$markers$toArray3 = section.markers.toArray();

    var _section$markers$toArray32 = _slicedToArray(_section$markers$toArray3, 3);

    var m1 = _section$markers$toArray32[0];
    var m2 = _section$markers$toArray32[1];
    var m3 = _section$markers$toArray32[2];

    assert.equal(m1.value, 'i am bold');
    assert.equal(m2.value, 'i am bold and italic');
    assert.equal(m3.value, 'i am bold again');
    assert.ok(m1.hasMarkup('b'), 'm1 is bold');
    assert.ok(m2.hasMarkup('b') && m2.hasMarkup('i'), 'm2 is bold and i');
    assert.ok(m3.hasMarkup('b'), 'm3 is bold');
    assert.ok(!m1.hasMarkup('i') && !m3.hasMarkup('i'), 'm1 and m3 are not i');
  });

  test('#parse ignores non-markup elements like spans', function (assert) {
    var container = buildDOM('\n    <p><span>i was in span</span></p>\n  ');
    var element = container.firstChild;

    var _parser$parse4 = parser.parse(element);

    var _parser$parse42 = _slicedToArray(_parser$parse4, 1);

    var section = _parser$parse42[0];

    assert.equal(section.tagName, 'p');
    assert.equal(section.markers.length, 1, 'has 1 markers');

    var _section$markers$toArray4 = section.markers.toArray();

    var _section$markers$toArray42 = _slicedToArray(_section$markers$toArray4, 1);

    var m1 = _section$markers$toArray42[0];

    assert.equal(m1.value, 'i was in span');
  });

  test('#parse reads attributes', function (assert) {
    var container = buildDOM('\n    <p><a href="google.com">i am a link</a></p>\n  ');
    var element = container.firstChild;

    var _parser$parse5 = parser.parse(element);

    var _parser$parse52 = _slicedToArray(_parser$parse5, 1);

    var section = _parser$parse52[0];

    assert.equal(section.markers.length, 1, 'has 1 markers');

    var _section$markers$toArray5 = section.markers.toArray();

    var _section$markers$toArray52 = _slicedToArray(_section$markers$toArray5, 1);

    var m1 = _section$markers$toArray52[0];

    assert.equal(m1.value, 'i am a link');
    assert.ok(m1.hasMarkup('a'), 'has "a" markup');
    assert.equal(m1.getMarkup('a').attributes.href, 'google.com');
  });

  test('#parse joins contiguous text nodes separated by non-markup elements', function (assert) {
    var container = buildDOM('\n    <p><span>span 1</span><span>span 2</span></p>\n  ');
    var element = container.firstChild;

    var _parser$parse6 = parser.parse(element);

    var _parser$parse62 = _slicedToArray(_parser$parse6, 1);

    var section = _parser$parse62[0];

    assert.equal(section.tagName, 'p');
    assert.equal(section.markers.length, 1, 'has 1 marker');

    var _section$markers$toArray6 = section.markers.toArray();

    var _section$markers$toArray62 = _slicedToArray(_section$markers$toArray6, 1);

    var m1 = _section$markers$toArray62[0];

    assert.equal(m1.value, 'span 1span 2');
  });

  test('#parse turns a textNode into a section', function (assert) {
    var container = buildDOM('I am a text node');
    var element = container.firstChild;

    var _parser$parse7 = parser.parse(element);

    var _parser$parse72 = _slicedToArray(_parser$parse7, 1);

    var section = _parser$parse72[0];

    assert.equal(section.tagName, 'p');
    assert.equal(section.markers.length, 1, 'has 1 marker');

    var _section$markers$toArray7 = section.markers.toArray();

    var _section$markers$toArray72 = _slicedToArray(_section$markers$toArray7, 1);

    var m1 = _section$markers$toArray72[0];

    assert.equal(m1.value, 'I am a text node');
  });

  test('#parse allows passing in parserPlugins that can override element parsing', function (assert) {
    var container = buildDOM('\n    <p>text 1<img src="https://placehold.it/100x100">text 2</p>\n  ');

    var element = container.firstChild;
    var plugins = [function (element, builder, _ref) {
      var addSection = _ref.addSection;

      if (element.tagName !== 'IMG') {
        return;
      }
      var payload = { url: element.src };
      var cardSection = builder.createCardSection('test-image', payload);
      addSection(cardSection);
    }];
    parser = new _mobiledocKitParsersSection['default'](builder, { plugins: plugins });
    var sections = parser.parse(element);

    assert.equal(sections.length, 3, '3 sections');

    assert.equal(sections[0].text, 'text 1');
    assert.equal(sections[2].text, 'text 2');

    var cardSection = sections[1];
    assert.equal(cardSection.name, 'test-image');
    assert.deepEqual(cardSection.payload, { url: 'https://placehold.it/100x100' });
  });

  test('#parse allows passing in parserPlugins that can override text parsing', function (assert) {
    var container = buildDOM('\n    <p>text 1<img src="https://placehold.it/100x100">text 2</p>\n  ');

    var element = container.firstChild;
    var plugins = [function (element, builder, _ref2) {
      var addMarkerable = _ref2.addMarkerable;
      var nodeFinished = _ref2.nodeFinished;

      if (element.nodeType === 3) {
        if (element.textContent === 'text 1') {
          addMarkerable(builder.createMarker('oh my'));
        }
        nodeFinished();
      }
    }];
    parser = new _mobiledocKitParsersSection['default'](builder, { plugins: plugins });
    var sections = parser.parse(element);

    assert.equal(sections.length, 1, '1 section');
    assert.equal(sections[0].text, 'oh my');
  });

  test('#parse skips STYLE nodes', function (assert) {
    var element = buildDOM('\n    <style>.rule { font-color: red; }</style>\n  ').firstChild;
    parser = new _mobiledocKitParsersSection['default'](builder);
    var sections = parser.parse(element);

    assert.equal(sections.length, 0, 'does not parse style');
  });

  test('#parse skips top-level Comment nodes', function (assert) {
    var element = buildDOM('\n    <!--Some comment-->\n  ').firstChild;
    parser = new _mobiledocKitParsersSection['default'](builder);
    var sections = parser.parse(element);

    assert.equal(sections.length, 0, 'does not parse comments');
  });

  test('#parse skips nested Comment nodes', function (assert) {
    var element = buildDOM('\n   <p><!--Some comment-->some text<!-- another comment --></p>\n  ').firstChild;
    parser = new _mobiledocKitParsersSection['default'](builder);
    var sections = parser.parse(element);

    assert.equal(sections.length, 1);
    var section = sections[0];
    assert.equal(section.text, 'some text', 'parses text surrounded by comments');
    assert.equal(section.markers.length, 1, 'only 1 marker');
  });
});
define('tests/unit/parsers/text-test', ['exports', 'mobiledoc-kit/parsers/text', 'mobiledoc-kit/models/post-node-builder', '../../test-helpers'], function (exports, _mobiledocKitParsersText, _mobiledocKitModelsPostNodeBuilder, _testHelpers) {
  'use strict';

  var _module = _testHelpers['default'].module;
  var test = _testHelpers['default'].test;

  var parser = undefined;

  _module('Unit: Parser: TextParser', {
    beforeEach: function beforeEach() {
      var builder = new _mobiledocKitModelsPostNodeBuilder['default']();
      parser = new _mobiledocKitParsersText['default'](builder);
    },
    afterEach: function afterEach() {
      parser = null;
    }
  });

  test('#parse returns a markup section when given single line of text', function (assert) {
    var text = 'some text';
    var post = parser.parse(text);
    var expected = _testHelpers['default'].postAbstract.build(function (_ref) {
      var post = _ref.post;
      var markupSection = _ref.markupSection;
      var marker = _ref.marker;

      return post([markupSection('p', [marker('some text')])]);
    });

    assert.postIsSimilar(post, expected);
  });

  test('#parse returns multiple markup sections when given multiple lines', function (assert) {
    var text = ['first', 'second', 'third'].join(_mobiledocKitParsersText.SECTION_BREAK);
    var post = parser.parse(text);
    var expected = _testHelpers['default'].postAbstract.build(function (_ref2) {
      var post = _ref2.post;
      var markupSection = _ref2.markupSection;
      var marker = _ref2.marker;

      return post([markupSection('p', [marker('first')]), markupSection('p', [marker('second')]), markupSection('p', [marker('third')])]);
    });

    assert.postIsSimilar(post, expected);
  });

  test('#parse returns multiple sections when lines are separated by CR+LF', function (assert) {
    var text = ['first', 'second', 'third'].join('\r\n');
    var post = parser.parse(text);
    var expected = _testHelpers['default'].postAbstract.build(function (_ref3) {
      var post = _ref3.post;
      var markupSection = _ref3.markupSection;
      var marker = _ref3.marker;

      return post([markupSection('p', [marker('first')]), markupSection('p', [marker('second')]), markupSection('p', [marker('third')])]);
    });

    assert.postIsSimilar(post, expected);
  });

  test('#parse returns multiple sections when lines are separated by CR', function (assert) {
    var text = ['first', 'second', 'third'].join('\r');
    var post = parser.parse(text);
    var expected = _testHelpers['default'].postAbstract.build(function (_ref4) {
      var post = _ref4.post;
      var markupSection = _ref4.markupSection;
      var marker = _ref4.marker;

      return post([markupSection('p', [marker('first')]), markupSection('p', [marker('second')]), markupSection('p', [marker('third')])]);
    });

    assert.postIsSimilar(post, expected);
  });

  test('#parse returns list section when text starts with "*"', function (assert) {
    var text = '* a list item';

    var post = parser.parse(text);
    var expected = _testHelpers['default'].postAbstract.build(function (_ref5) {
      var post = _ref5.post;
      var listSection = _ref5.listSection;
      var listItem = _ref5.listItem;
      var marker = _ref5.marker;

      return post([listSection('ul', [listItem([marker('a list item')])])]);
    });

    assert.postIsSimilar(post, expected);
  });

  test('#parse returns list section with multiple items when text starts with "*"', function (assert) {
    var text = ['* first', '* second'].join(_mobiledocKitParsersText.SECTION_BREAK);

    var post = parser.parse(text);
    var expected = _testHelpers['default'].postAbstract.build(function (_ref6) {
      var post = _ref6.post;
      var listSection = _ref6.listSection;
      var listItem = _ref6.listItem;
      var marker = _ref6.marker;

      return post([listSection('ul', [listItem([marker('first')]), listItem([marker('second')])])]);
    });

    assert.postIsSimilar(post, expected);
  });

  test('#parse returns list sections separated by markup sections', function (assert) {
    var text = ['* first list', 'middle section', '* second list'].join(_mobiledocKitParsersText.SECTION_BREAK);

    var post = parser.parse(text);
    var expected = _testHelpers['default'].postAbstract.build(function (_ref7) {
      var post = _ref7.post;
      var listSection = _ref7.listSection;
      var listItem = _ref7.listItem;
      var markupSection = _ref7.markupSection;
      var marker = _ref7.marker;

      return post([listSection('ul', [listItem([marker('first list')])]), markupSection('p', [marker('middle section')]), listSection('ul', [listItem([marker('second list')])])]);
    });

    assert.postIsSimilar(post, expected);
  });

  test('#parse returns ordered list items', function (assert) {
    var text = '1. first list';

    var post = parser.parse(text);
    var expected = _testHelpers['default'].postAbstract.build(function (_ref8) {
      var post = _ref8.post;
      var listSection = _ref8.listSection;
      var listItem = _ref8.listItem;
      var markupSection = _ref8.markupSection;
      var marker = _ref8.marker;

      return post([listSection('ol', [listItem([marker('first list')])])]);
    });

    assert.postIsSimilar(post, expected);
  });

  test('#parse can have ordered and unordered lists together', function (assert) {
    var text = ['1. ordered list', '* unordered list'].join(_mobiledocKitParsersText.SECTION_BREAK);

    var post = parser.parse(text);
    var expected = _testHelpers['default'].postAbstract.build(function (_ref9) {
      var post = _ref9.post;
      var listSection = _ref9.listSection;
      var listItem = _ref9.listItem;
      var markupSection = _ref9.markupSection;
      var marker = _ref9.marker;

      return post([listSection('ol', [listItem([marker('ordered list')])]), listSection('ul', [listItem([marker('unordered list')])])]);
    });

    assert.postIsSimilar(post, expected);
  });
});
define('tests/unit/renderers/editor-dom-test', ['exports', 'mobiledoc-kit/models/post-node-builder', 'mobiledoc-kit/renderers/editor-dom', 'mobiledoc-kit/models/render-tree', '../../test-helpers', 'mobiledoc-kit/utils/characters', 'mobiledoc-kit/utils/placeholder-image-src'], function (exports, _mobiledocKitModelsPostNodeBuilder, _mobiledocKitRenderersEditorDom, _mobiledocKitModelsRenderTree, _testHelpers, _mobiledocKitUtilsCharacters, _mobiledocKitUtilsPlaceholderImageSrc) {
  'use strict';

  var _module = _testHelpers['default'].module;
  var test = _testHelpers['default'].test;

  var builder = undefined;

  var renderer = undefined;
  function render(renderTree) {
    var cards = arguments.length <= 1 || arguments[1] === undefined ? [] : arguments[1];
    var atoms = arguments.length <= 2 || arguments[2] === undefined ? [] : arguments[2];

    var editor = {};
    renderer = new _mobiledocKitRenderersEditorDom['default'](editor, cards, atoms);
    return renderer.render(renderTree);
  }

  var editor = undefined,
      editorElement = undefined;
  _module('Unit: Renderer: Editor-Dom', {
    beforeEach: function beforeEach() {
      builder = new _mobiledocKitModelsPostNodeBuilder['default']();
      editorElement = $('#editor')[0];
    },
    afterEach: function afterEach() {
      if (renderer) {
        renderer.destroy();
        renderer = null;
      }
      if (editor) {
        editor.destroy();
      }
    }
  });

  test("renders a dirty post", function (assert) {
    /*
     * renderTree is:
     *
     * renderNode
     *
     */
    var renderTree = new _mobiledocKitModelsRenderTree['default'](builder.createPost());
    render(renderTree);

    assert.ok(renderTree.rootElement, 'renderTree renders element for post');
    assert.ok(!renderTree.rootNode.isDirty, 'dirty node becomes clean');
    assert.equal(renderTree.rootElement.tagName, 'DIV', 'renderTree renders element for post');
  });

  test("renders a dirty post with un-rendered sections", function (assert) {
    var post = builder.createPost();
    var sectionA = builder.createMarkupSection('P');
    post.sections.append(sectionA);
    var sectionB = builder.createMarkupSection('P');
    post.sections.append(sectionB);

    var renderTree = new _mobiledocKitModelsRenderTree['default'](post);
    render(renderTree);

    assert.equal(renderTree.rootElement.outerHTML, '<div><p><br></p><p><br></p></div>', 'correct HTML is rendered');

    assert.ok(renderTree.rootNode.childNodes.head, 'sectionA creates a first child');
    assert.equal(renderTree.rootNode.childNodes.head.postNode, sectionA, 'sectionA is first renderNode child');
    assert.ok(!renderTree.rootNode.childNodes.head.isDirty, 'sectionA node is clean');
    assert.equal(renderTree.rootNode.childNodes.tail.postNode, sectionB, 'sectionB is second renderNode child');
    assert.ok(!renderTree.rootNode.childNodes.tail.isDirty, 'sectionB node is clean');
  });

  [{
    name: 'markup',
    section: function section(builder) {
      return builder.createMarkupSection('P');
    }
  }, {
    name: 'image',
    section: function section(builder) {
      return builder.createImageSection(_mobiledocKitUtilsPlaceholderImageSrc['default']);
    }
  }, {
    name: 'card',
    section: function section(builder) {
      return builder.createCardSection('new-card');
    }
  }, {
    name: 'list-section',
    section: function section(builder) {
      return builder.createListSection('ul', [builder.createListItem([builder.createMarker('item')])]);
    }
  }].forEach(function (testInfo) {
    test('removes nodes with ' + testInfo.name + ' section', function (assert) {
      var post = builder.createPost();
      var section = testInfo.section(builder);
      post.sections.append(section);

      var postElement = document.createElement('div');
      var sectionElement = document.createElement('p');
      postElement.appendChild(sectionElement);

      var renderTree = new _mobiledocKitModelsRenderTree['default'](post);
      var postRenderNode = renderTree.rootNode;
      postRenderNode.element = postElement;

      var sectionRenderNode = renderTree.buildRenderNode(section);
      sectionRenderNode.element = sectionElement;
      sectionRenderNode.scheduleForRemoval();
      postRenderNode.childNodes.append(sectionRenderNode);

      render(renderTree);

      assert.equal(renderTree.rootElement, postElement, 'post element remains');

      assert.equal(renderTree.rootElement.firstChild, null, 'section element removed');

      assert.equal(renderTree.rootNode.childNodes.length, 0, 'section renderNode is removed');
    });
  });

  test('renders a post with marker', function (assert) {
    var post = builder.createPost();
    var section = builder.createMarkupSection('P');
    post.sections.append(section);
    section.markers.append(builder.createMarker('Hi', [builder.createMarkup('STRONG')]));

    var renderTree = new _mobiledocKitModelsRenderTree['default'](post);
    render(renderTree);
    assert.equal(renderTree.rootElement.innerHTML, '<p><strong>Hi</strong></p>');
  });

  test('renders a post with marker with a tab', function (assert) {
    var post = _testHelpers['default'].postAbstract.build(function (_ref) {
      var post = _ref.post;
      var markupSection = _ref.markupSection;
      var marker = _ref.marker;

      return post([markupSection('p', [marker('a' + _mobiledocKitUtilsCharacters.TAB + 'b')])]);
    });

    var renderTree = new _mobiledocKitModelsRenderTree['default'](post);
    render(renderTree);
    assert.equal(renderTree.rootElement.innerHTML, '<p>a b</p>', 'HTML for a tab character is correct');
  });

  test('renders a post with markup empty section', function (assert) {
    var post = builder.createPost();
    var section = builder.createMarkupSection('P');
    post.sections.append(section);

    var renderTree = new _mobiledocKitModelsRenderTree['default'](post);
    render(renderTree);
    assert.equal(renderTree.rootElement.innerHTML, '<p><br></p>');
  });

  test('renders a post with multiple markers', function (assert) {
    var post = builder.createPost();
    var section = builder.createMarkupSection('P');
    post.sections.append(section);

    var b = builder.createMarkup('B');
    var i = builder.createMarkup('I');

    section.markers.append(builder.createMarker('hello '));
    section.markers.append(builder.createMarker('bold, ', [b]));
    section.markers.append(builder.createMarker('italic,', [b, i]));
    section.markers.append(builder.createMarker(' world.'));

    var renderTree = new _mobiledocKitModelsRenderTree['default'](post);
    render(renderTree);
    assert.equal(renderTree.rootElement.innerHTML, '<p>hello <b>bold, <i>italic,</i></b> world.</p>');
  });

  test('renders a post with image', function (assert) {
    var url = _mobiledocKitUtilsPlaceholderImageSrc['default'];
    var post = builder.createPost();
    var section = builder.createImageSection(url);
    post.sections.append(section);

    var renderTree = new _mobiledocKitModelsRenderTree['default'](post);
    render(renderTree);
    assert.equal(renderTree.rootElement.innerHTML, '<img src="' + url + '">');
  });

  test('renders a post with atom', function (assert) {
    var post = _testHelpers['default'].postAbstract.build(function (_ref2) {
      var markupSection = _ref2.markupSection;
      var post = _ref2.post;
      var atom = _ref2.atom;

      return post([markupSection('p', [atom('mention', '@bob', {})])]);
    });

    var renderTree = new _mobiledocKitModelsRenderTree['default'](post);
    render(renderTree, [], [{
      name: 'mention',
      type: 'dom',
      render: function render(_ref3) /*, options, env, payload*/{
        var value = _ref3.value;

        return document.createTextNode(value);
      }
    }]);
    assert.equal(renderTree.rootElement.innerHTML, '<p><span class="-mobiledoc-kit__atom">' + _mobiledocKitRenderersEditorDom.ZWNJ + '<span contenteditable="false">@bob</span>' + _mobiledocKitRenderersEditorDom.ZWNJ + '</span></p>');
  });

  test('rerenders an atom with markup correctly when adjacent nodes change', function (assert) {
    var bold = undefined,
        italic = undefined,
        marker1 = undefined,
        marker2 = undefined,
        atom1 = undefined,
        markupSection1 = undefined;
    var post = _testHelpers['default'].postAbstract.build(function (_ref4) {
      var markupSection = _ref4.markupSection;
      var post = _ref4.post;
      var atom = _ref4.atom;
      var marker = _ref4.marker;
      var markup = _ref4.markup;

      bold = markup('b');
      italic = markup('em');
      marker1 = marker('abc');
      atom1 = atom('mention', 'bob', {}, [bold]);
      marker2 = marker('def');
      markupSection1 = markupSection('p', [marker1, atom1, marker2]);
      return post([markupSection1]);
    });

    var renderTree = new _mobiledocKitModelsRenderTree['default'](post);
    var cards = [],
        atoms = [{
      name: 'mention',
      type: 'dom',
      render: function render(_ref5) /*, options, env, payload*/{
        var value = _ref5.value;

        return document.createTextNode(value);
      }
    }];
    render(renderTree, cards, atoms);
    assert.equal(renderTree.rootElement.innerHTML, '<p>abc<b><span class="-mobiledoc-kit__atom">' + _mobiledocKitRenderersEditorDom.ZWNJ + '<span contenteditable="false">bob</span>' + _mobiledocKitRenderersEditorDom.ZWNJ + '</span></b>def</p>', 'initial render correct');

    marker1.value = 'ABC';
    marker1.renderNode.markDirty();

    // rerender
    render(renderTree, cards, atoms);

    assert.equal(renderTree.rootElement.innerHTML, '<p>ABC<b><span class="-mobiledoc-kit__atom">' + _mobiledocKitRenderersEditorDom.ZWNJ + '<span contenteditable="false">bob</span>' + _mobiledocKitRenderersEditorDom.ZWNJ + '</span></b>def</p>', 'rerender is correct');

    atom1.removeMarkup(bold);
    atom1.renderNode.markDirty();

    // rerender
    render(renderTree, cards, atoms);
    assert.equal(renderTree.rootElement.innerHTML, '<p>ABC<span class="-mobiledoc-kit__atom">' + _mobiledocKitRenderersEditorDom.ZWNJ + '<span contenteditable="false">bob</span>' + _mobiledocKitRenderersEditorDom.ZWNJ + '</span>def</p>', 'rerender is correct');

    marker2.renderNode.scheduleForRemoval();

    // rerender
    render(renderTree, cards, atoms);
    assert.equal(renderTree.rootElement.innerHTML, '<p>ABC<span class="-mobiledoc-kit__atom">' + _mobiledocKitRenderersEditorDom.ZWNJ + '<span contenteditable="false">bob</span>' + _mobiledocKitRenderersEditorDom.ZWNJ + '</span></p>', 'rerender is correct');

    marker1.addMarkup(bold);
    marker1.renderNode.markDirty();

    // rerender
    render(renderTree, cards, atoms);
    assert.equal(renderTree.rootElement.innerHTML, '<p><b>ABC</b><span class="-mobiledoc-kit__atom">' + _mobiledocKitRenderersEditorDom.ZWNJ + '<span contenteditable="false">bob</span>' + _mobiledocKitRenderersEditorDom.ZWNJ + '</span></p>', 'rerender is correct');

    marker1.renderNode.scheduleForRemoval();

    // rerender
    render(renderTree, cards, atoms);
    assert.equal(renderTree.rootElement.innerHTML, '<p><span class="-mobiledoc-kit__atom">' + _mobiledocKitRenderersEditorDom.ZWNJ + '<span contenteditable="false">bob</span>' + _mobiledocKitRenderersEditorDom.ZWNJ + '</span></p>', 'rerender is correct');

    atom1.renderNode.scheduleForRemoval();

    // rerender
    render(renderTree, cards, atoms);
    assert.equal(renderTree.rootElement.innerHTML, '<p><br></p>', 'rerender is correct');

    var newAtom = builder.createAtom('mention', 'bob2', {}, [bold, italic]);
    markupSection1.markers.append(newAtom);
    markupSection1.renderNode.markDirty();

    // rerender
    render(renderTree, cards, atoms);
    assert.equal(renderTree.rootElement.innerHTML, '<p><b><em><span class="-mobiledoc-kit__atom">' + _mobiledocKitRenderersEditorDom.ZWNJ + '<span contenteditable="false">bob2</span>' + _mobiledocKitRenderersEditorDom.ZWNJ + '</span></em></b></p>', 'rerender is correct');

    var newMarker = builder.createMarker('pre', [bold, italic]);
    markupSection1.markers.insertBefore(newMarker, newAtom);
    markupSection1.renderNode.markDirty();

    // rerender
    render(renderTree, cards, atoms);
    assert.equal(renderTree.rootElement.innerHTML, '<p><b><em>pre<span class="-mobiledoc-kit__atom">' + _mobiledocKitRenderersEditorDom.ZWNJ + '<span contenteditable="false">bob2</span>' + _mobiledocKitRenderersEditorDom.ZWNJ + '</span></em></b></p>', 'rerender is correct');

    newMarker = builder.createMarker('post', [bold, italic]);
    markupSection1.markers.append(newMarker);
    markupSection1.renderNode.markDirty();

    // rerender
    render(renderTree, cards, atoms);
    assert.equal(renderTree.rootElement.innerHTML, '<p><b><em>pre<span class="-mobiledoc-kit__atom">' + _mobiledocKitRenderersEditorDom.ZWNJ + '<span contenteditable="false">bob2</span>' + _mobiledocKitRenderersEditorDom.ZWNJ + '</span>post</em></b></p>', 'rerender is correct');

    newAtom.removeMarkup(bold);
    newAtom.renderNode.markDirty();

    // rerender
    render(renderTree, cards, atoms);
    assert.equal(renderTree.rootElement.innerHTML, '<p><b><em>pre</em></b><em><span class="-mobiledoc-kit__atom">' + _mobiledocKitRenderersEditorDom.ZWNJ + '<span contenteditable="false">bob2</span>' + _mobiledocKitRenderersEditorDom.ZWNJ + '</span></em><b><em>post</em></b></p>', 'rerender is correct');

    newAtom.renderNode.scheduleForRemoval();

    // rerender
    render(renderTree, cards, atoms);
    assert.equal(renderTree.rootElement.innerHTML, '<p><b><em>prepost</em></b></p>', 'rerender is correct');
  });

  test('renders a post with atom with markup', function (assert) {
    var post = _testHelpers['default'].postAbstract.build(function (_ref6) {
      var markupSection = _ref6.markupSection;
      var post = _ref6.post;
      var atom = _ref6.atom;
      var marker = _ref6.marker;
      var markup = _ref6.markup;

      var b = markup('B');
      var i = markup('I');

      return post([markupSection('p', [atom('mention', '@bob', {}, [b, i])])]);
    });

    var renderTree = new _mobiledocKitModelsRenderTree['default'](post);
    render(renderTree, [], [{
      name: 'mention',
      type: 'dom',
      render: function render(_ref7) /*, options, env, payload*/{
        var fragment = _ref7.fragment;
        var value = _ref7.value;

        return document.createTextNode(value);
      }
    }]);

    assert.equal(renderTree.rootElement.innerHTML, '<p><b><i><span class="-mobiledoc-kit__atom">' + _mobiledocKitRenderersEditorDom.ZWNJ + '<span contenteditable="false">@bob</span>' + _mobiledocKitRenderersEditorDom.ZWNJ + '</span></i></b></p>');
  });

  test('renders a post with mixed markups and atoms', function (assert) {
    var post = _testHelpers['default'].postAbstract.build(function (_ref8) {
      var markupSection = _ref8.markupSection;
      var post = _ref8.post;
      var atom = _ref8.atom;
      var marker = _ref8.marker;
      var markup = _ref8.markup;

      var b = markup('B');
      var i = markup('I');

      return post([markupSection('p', [marker('bold', [b]), marker('italic ', [b, i]), atom('mention', '@bob', {}, [b, i]), marker(' bold', [b]), builder.createMarker('text.')])]);
    });

    var renderTree = new _mobiledocKitModelsRenderTree['default'](post);
    render(renderTree, [], [{
      name: 'mention',
      type: 'dom',
      render: function render(_ref9) /*, options, env, payload*/{
        var fragment = _ref9.fragment;
        var value = _ref9.value;

        return document.createTextNode(value);
      }
    }]);

    assert.equal(renderTree.rootElement.innerHTML, '<p><b>bold<i>italic <span class="-mobiledoc-kit__atom">' + _mobiledocKitRenderersEditorDom.ZWNJ + '<span contenteditable="false">@bob</span>' + _mobiledocKitRenderersEditorDom.ZWNJ + '</span></i> bold</b>text.</p>');
  });

  test('renders a card section', function (assert) {
    var post = builder.createPost();
    var cardSection = builder.createCardSection('my-card');
    var card = {
      name: 'my-card',
      type: 'dom',
      render: function render() {
        return document.createTextNode('I am a card');
      }
    };
    post.sections.append(cardSection);

    var renderTree = new _mobiledocKitModelsRenderTree['default'](post);
    render(renderTree, [card]);

    // Use a wrapper an innerHTML to satisfy different browser attribute
    // ordering quirks
    var expectedWrapper = $('<div>' + _mobiledocKitRenderersEditorDom.ZWNJ + '<div contenteditable="false" class="__mobiledoc-card">I am a card</div>' + _mobiledocKitRenderersEditorDom.ZWNJ + '</div>');
    assert.equal(renderTree.rootElement.firstChild.innerHTML, expectedWrapper.html(), 'card is rendered');
  });

  test('rerender a marker after adding a markup to it', function (assert) {
    var bold = undefined,
        marker2 = undefined;
    var post = _testHelpers['default'].postAbstract.build(function (_ref10) {
      var post = _ref10.post;
      var markupSection = _ref10.markupSection;
      var marker = _ref10.marker;
      var markup = _ref10.markup;

      bold = markup('B');
      marker2 = marker('text2');
      return post([markupSection('p', [marker('text1', [bold]), marker2])]);
    });

    var renderTree = new _mobiledocKitModelsRenderTree['default'](post);
    render(renderTree);

    assert.equal(renderTree.rootElement.innerHTML, '<p><b>text1</b>text2</p>');

    marker2.addMarkup(bold);
    marker2.renderNode.markDirty();

    // rerender
    render(renderTree);

    assert.equal(renderTree.rootElement.innerHTML, '<p><b>text1text2</b></p>');
  });

  test('rerender a marker after removing a markup from it', function (assert) {
    var post = builder.createPost();
    var section = builder.createMarkupSection('p');
    var bMarkup = builder.createMarkup('B');
    var marker1 = builder.createMarker('text1');
    var marker2 = builder.createMarker('text2', [bMarkup]);

    section.markers.append(marker1);
    section.markers.append(marker2);
    post.sections.append(section);

    var renderTree = new _mobiledocKitModelsRenderTree['default'](post);
    render(renderTree);

    assert.equal(renderTree.rootElement.innerHTML, '<p>text1<b>text2</b></p>');

    marker2.removeMarkup(bMarkup);
    marker2.renderNode.markDirty();

    // rerender
    render(renderTree);

    assert.equal(renderTree.rootElement.innerHTML, '<p>text1text2</p>');
  });

  test('rerender a marker after removing a markup from it (when changed marker is first marker)', function (assert) {
    var post = builder.createPost();
    var section = builder.createMarkupSection('p');
    var bMarkup = builder.createMarkup('B');
    var marker1 = builder.createMarker('text1', [bMarkup]);
    var marker2 = builder.createMarker('text2');

    section.markers.append(marker1);
    section.markers.append(marker2);
    post.sections.append(section);

    var renderTree = new _mobiledocKitModelsRenderTree['default'](post);
    render(renderTree);

    assert.equal(renderTree.rootElement.innerHTML, '<p><b>text1</b>text2</p>');

    marker1.removeMarkup(bMarkup);
    marker1.renderNode.markDirty();

    // rerender
    render(renderTree);

    assert.equal(renderTree.rootElement.innerHTML, '<p>text1text2</p>');
  });

  test('rerender a marker after removing a markup from it (when both markers have same markup)', function (assert) {
    var post = builder.createPost();
    var section = builder.createMarkupSection('p');
    var bMarkup = builder.createMarkup('B');
    var marker1 = builder.createMarker('text1', [bMarkup]);
    var marker2 = builder.createMarker('text2', [bMarkup]);

    section.markers.append(marker1);
    section.markers.append(marker2);
    post.sections.append(section);

    var renderTree = new _mobiledocKitModelsRenderTree['default'](post);
    render(renderTree);

    assert.equal(renderTree.rootElement.innerHTML, '<p><b>text1text2</b></p>');

    marker1.removeMarkup(bMarkup);
    marker1.renderNode.markDirty();

    // rerender
    render(renderTree);

    assert.equal(renderTree.rootElement.innerHTML, '<p>text1<b>text2</b></p>');
  });

  test('rerender a marker after removing a markup from it (when both markers have same markup)', function (assert) {
    var post = builder.createPost();
    var section = builder.createMarkupSection('p');
    var bMarkup = builder.createMarkup('B');
    var marker1 = builder.createMarker('text1', [bMarkup]);
    var marker2 = builder.createMarker('text2', [bMarkup]);

    section.markers.append(marker1);
    section.markers.append(marker2);
    post.sections.append(section);

    var renderTree = new _mobiledocKitModelsRenderTree['default'](post);
    render(renderTree);

    assert.equal(renderTree.rootElement.innerHTML, '<p><b>text1text2</b></p>');

    marker1.removeMarkup(bMarkup);
    marker1.renderNode.markDirty();

    // rerender
    render(renderTree);

    assert.equal(renderTree.rootElement.innerHTML, '<p>text1<b>text2</b></p>');
  });

  test('render when contiguous markers have out-of-order markups', function (assert) {
    var post = builder.createPost();
    var section = builder.createMarkupSection('p');

    var b = builder.createMarkup('B'),
        i = builder.createMarkup('I');

    var markers = [builder.createMarker('BI', [b, i]), builder.createMarker('IB', [i, b]), builder.createMarker('plain', [])];
    var m1 = markers[0];

    markers.forEach(function (m) {
      return section.markers.append(m);
    });
    post.sections.append(section);

    var renderTree = new _mobiledocKitModelsRenderTree['default'](post);
    render(renderTree);

    assert.equal(renderTree.rootElement.innerHTML, '<p><b><i>BI</i></b><i><b>IB</b></i>plain</p>');

    // remove 'b' from 1st marker, rerender
    m1.removeMarkup(b);
    m1.renderNode.markDirty();
    render(renderTree);

    assert.equal(renderTree.rootElement.innerHTML, '<p><i>BI<b>IB</b></i>plain</p>');
  });

  test('contiguous markers have overlapping markups', function (assert) {
    var b = builder.createMarkup('b'),
        i = builder.createMarkup('i');
    var post = builder.createPost();
    var markers = [builder.createMarker('W', [i]), builder.createMarker('XY', [i, b]), builder.createMarker('Z', [b])];
    var section = builder.createMarkupSection('P', markers);
    post.sections.append(section);

    var renderTree = new _mobiledocKitModelsRenderTree['default'](post);
    render(renderTree);

    assert.equal(renderTree.rootElement.innerHTML, '<p><i>W<b>XY</b></i><b>Z</b></p>');
  });

  test('renders and rerenders list items', function (assert) {
    var post = _testHelpers['default'].postAbstract.build(function (_ref11) {
      var post = _ref11.post;
      var listSection = _ref11.listSection;
      var listItem = _ref11.listItem;
      var marker = _ref11.marker;
      return post([listSection('ul', [listItem([marker('first item')]), listItem([marker('second item')])])]);
    });

    var renderTree = new _mobiledocKitModelsRenderTree['default'](post);
    render(renderTree);

    var expectedDOM = _testHelpers['default'].dom.build(function (t) {
      return t('ul', {}, [t('li', {}, [t.text('first item')]), t('li', {}, [t.text('second item')])]);
    });
    var expectedHTML = expectedDOM.outerHTML;

    assert.equal(renderTree.rootElement.innerHTML, expectedHTML, 'correct html on initial render');

    // test rerender after dirtying list section
    var listSection = post.sections.head;
    listSection.renderNode.markDirty();
    render(renderTree);
    assert.equal(renderTree.rootElement.innerHTML, expectedHTML, 'correct html on rerender after dirtying list-section');

    // test rerender after dirtying list item
    var listItem = post.sections.head.items.head;
    listItem.renderNode.markDirty();
    render(renderTree);

    assert.equal(renderTree.rootElement.innerHTML, expectedHTML, 'correct html on rerender after diryting list-item');
  });

  test('removes list items', function (assert) {
    var post = _testHelpers['default'].postAbstract.build(function (_ref12) {
      var post = _ref12.post;
      var listSection = _ref12.listSection;
      var listItem = _ref12.listItem;
      var marker = _ref12.marker;
      return post([listSection('ul', [listItem([marker('first item')]), listItem([marker('second item')]), listItem([marker('third item')])])]);
    });

    var renderTree = new _mobiledocKitModelsRenderTree['default'](post);
    render(renderTree);

    // return HTML for a list with the given items
    var htmlWithItems = function htmlWithItems(itemTexts) {
      var expectedDOM = _testHelpers['default'].dom.build(function (t) {
        return t('ul', {}, itemTexts.map(function (text) {
          return t('li', {}, [t.text(text)]);
        }));
      });
      return expectedDOM.outerHTML;
    };

    var listItem2 = post.sections.head. // listSection
    items.objectAt(1); // li
    listItem2.renderNode.scheduleForRemoval();
    render(renderTree);

    assert.equal(renderTree.rootElement.innerHTML, htmlWithItems(['first item', 'third item']), 'removes middle list item');

    var listItemLast = post.sections.head. // listSection
    items.tail;
    listItemLast.renderNode.scheduleForRemoval();
    render(renderTree);

    assert.equal(renderTree.rootElement.innerHTML, htmlWithItems(['first item']), 'removes last list item');
  });

  test('removes list sections', function (assert) {
    var post = _testHelpers['default'].postAbstract.build(function (_ref13) {
      var post = _ref13.post;
      var listSection = _ref13.listSection;
      var markupSection = _ref13.markupSection;
      var listItem = _ref13.listItem;
      var marker = _ref13.marker;
      return post([markupSection('p', [marker('something')]), listSection('ul', [listItem([marker('first item')])])]);
    });

    var renderTree = new _mobiledocKitModelsRenderTree['default'](post);
    render(renderTree);

    var expectedDOM = _testHelpers['default'].dom.build(function (t) {
      return t('p', {}, [t.text('something')]);
    });
    var expectedHTML = expectedDOM.outerHTML;

    var listSection = post.sections.objectAt(1);
    listSection.renderNode.scheduleForRemoval();
    render(renderTree);

    assert.equal(renderTree.rootElement.innerHTML, expectedHTML, 'removes list section');
  });

  test('includes card sections in renderTree element map', function (assert) {
    var post = _testHelpers['default'].postAbstract.build(function (_ref14) {
      var post = _ref14.post;
      var cardSection = _ref14.cardSection;
      return post([cardSection('simple-card')]);
    });
    var cards = [{
      name: 'simple-card',
      type: 'dom',
      render: function render() {
        return $('<div id="simple-card"></div>')[0];
      }
    }];

    var renderTree = new _mobiledocKitModelsRenderTree['default'](post);
    render(renderTree, cards);

    $('#qunit-fixture').append(renderTree.rootElement);

    var element = $('#simple-card')[0].parentNode.parentNode;
    assert.ok(!!element, 'precond - simple card is rendered');
    assert.ok(!!renderTree.getElementRenderNode(element), 'has render node for card element');
  });

  test('removes nested children of removed render nodes', function (assert) {
    var section = undefined;
    var post = _testHelpers['default'].postAbstract.build(function (_ref15) {
      var post = _ref15.post;
      var markupSection = _ref15.markupSection;
      var marker = _ref15.marker;

      section = markupSection('p', [marker('abc')]);
      return post([section]);
    });

    var renderTree = new _mobiledocKitModelsRenderTree['default'](post);
    render(renderTree);

    var marker = section.markers.head;
    assert.ok(!!section.renderNode, 'precond - section has render node');
    assert.ok(!!marker.renderNode, 'precond - marker has render node');

    section.renderNode.scheduleForRemoval();
    render(renderTree);

    assert.ok(!marker.renderNode.parent, 'marker render node is orphaned');
    assert.ok(!marker.renderNode.element, 'marker render node has no element');
    assert.equal(section.renderNode.childNodes.length, 0, 'section render node has all children removed');
  });

  test('renders markup section "pull-quote" as <div class="pull-quote"></div>', function (assert) {
    var post = _testHelpers['default'].postAbstract.build(function (_ref16) {
      var post = _ref16.post;
      var markupSection = _ref16.markupSection;
      var marker = _ref16.marker;

      return post([markupSection('pull-quote', [marker('abc')])]);
    });
    var renderTree = new _mobiledocKitModelsRenderTree['default'](post);
    render(renderTree);

    var expectedDOM = _testHelpers['default'].dom.build(function (t) {
      return t('div', { "class": "pull-quote" }, [t.text('abc')]);
    });

    assert.equal(renderTree.rootElement.innerHTML, expectedDOM.outerHTML);
  });

  test('renders characters and spaces with nbsps', function (assert) {
    var post = _testHelpers['default'].postAbstract.build(function (_ref17) {
      var post = _ref17.post;
      var markupSection = _ref17.markupSection;
      var marker = _ref17.marker;

      return post([markupSection('p', [marker('a b  c    d ')])]);
    });
    var renderTree = new _mobiledocKitModelsRenderTree['default'](post);
    render(renderTree);

    var expectedDOM = _testHelpers['default'].dom.build(function (t) {
      return t('p', {}, [t.text('a b ' + _mobiledocKitRenderersEditorDom.NO_BREAK_SPACE + 'c ' + _mobiledocKitRenderersEditorDom.NO_BREAK_SPACE + ' ' + _mobiledocKitRenderersEditorDom.NO_BREAK_SPACE + 'd' + _mobiledocKitRenderersEditorDom.NO_BREAK_SPACE)]);
    });

    assert.equal(renderTree.rootElement.innerHTML, expectedDOM.outerHTML);
  });

  test('renders all spaces with nbsps', function (assert) {
    var post = _testHelpers['default'].postAbstract.build(function (_ref18) {
      var post = _ref18.post;
      var markupSection = _ref18.markupSection;
      var marker = _ref18.marker;

      return post([markupSection('p', [marker('   ')])]);
    });
    var renderTree = new _mobiledocKitModelsRenderTree['default'](post);
    render(renderTree);

    var expectedDOM = _testHelpers['default'].dom.build(function (t) {
      return t('p', {}, [t.text('' + _mobiledocKitRenderersEditorDom.NO_BREAK_SPACE + _mobiledocKitRenderersEditorDom.NO_BREAK_SPACE + _mobiledocKitRenderersEditorDom.NO_BREAK_SPACE)]);
    });

    assert.equal(renderTree.rootElement.innerHTML, expectedDOM.outerHTML);
  });

  test('renders leading space with nbsp', function (assert) {
    var post = _testHelpers['default'].postAbstract.build(function (_ref19) {
      var post = _ref19.post;
      var markupSection = _ref19.markupSection;
      var marker = _ref19.marker;

      return post([markupSection('p', [marker(' a')])]);
    });
    var renderTree = new _mobiledocKitModelsRenderTree['default'](post);
    render(renderTree);

    var expectedDOM = _testHelpers['default'].dom.build(function (t) {
      return t('p', {}, [t.text(_mobiledocKitRenderersEditorDom.NO_BREAK_SPACE + 'a')]);
    });

    assert.equal(renderTree.rootElement.innerHTML, expectedDOM.outerHTML);
  });

  test('renders trailing space with nbsp', function (assert) {
    var post = _testHelpers['default'].postAbstract.build(function (_ref20) {
      var post = _ref20.post;
      var markupSection = _ref20.markupSection;
      var marker = _ref20.marker;

      return post([markupSection('p', [marker('a ')])]);
    });
    var renderTree = new _mobiledocKitModelsRenderTree['default'](post);
    render(renderTree);

    var expectedDOM = _testHelpers['default'].dom.build(function (t) {
      return t('p', {}, [t.text('a' + _mobiledocKitRenderersEditorDom.NO_BREAK_SPACE)]);
    });

    assert.equal(renderTree.rootElement.innerHTML, expectedDOM.outerHTML);
  });

  test('renders leading and trailing space with nbsp', function (assert) {
    var post = _testHelpers['default'].postAbstract.build(function (_ref21) {
      var post = _ref21.post;
      var markupSection = _ref21.markupSection;
      var marker = _ref21.marker;

      return post([markupSection('p', [marker(' a ')])]);
    });
    var renderTree = new _mobiledocKitModelsRenderTree['default'](post);
    render(renderTree);

    var expectedDOM = _testHelpers['default'].dom.build(function (t) {
      return t('p', {}, [t.text(_mobiledocKitRenderersEditorDom.NO_BREAK_SPACE + 'a' + _mobiledocKitRenderersEditorDom.NO_BREAK_SPACE)]);
    });

    assert.equal(renderTree.rootElement.innerHTML, expectedDOM.outerHTML);
  });

  test('#destroy is safe to call if renderer has not rendered', function (assert) {
    var mockEditor = {},
        cards = [];
    var renderer = new _mobiledocKitRenderersEditorDom['default'](mockEditor, cards);

    assert.ok(!renderer.hasRendered, 'precond - has not rendered');

    renderer.destroy();

    assert.ok(true, 'ok to destroy');
  });

  // see https://github.com/bustlelabs/mobiledoc-kit/issues/306
  test('rerender after adding markup to a marker when the marker siblings have that markup', function (assert) {
    var strong = undefined,
        expected = undefined;
    var post = _testHelpers['default'].postAbstract.build(function (_ref22) {
      var post = _ref22.post;
      var markupSection = _ref22.markupSection;
      var marker = _ref22.marker;
      var markup = _ref22.markup;

      strong = markup('strong');
      expected = post([markupSection('p', [marker('aXc', [strong])])]);
      return post([markupSection('p', [marker('a', [strong]), marker('X'), marker('c', [strong])])]);
    });

    var renderTree = new _mobiledocKitModelsRenderTree['default'](post);
    render(renderTree);

    var markers = post.sections.head.markers.toArray();
    assert.equal(markers.length, 3);

    // step 1: add markup to the marker
    markers[1].addMarkup(strong);

    // step 2, join the markers
    markers[1].value = 'aX';
    markers[1].renderNode.markDirty();
    markers[0].renderNode.scheduleForRemoval();
    markers[0].section.markers.remove(markers[0]);

    markers[2].value = 'aXc';
    markers[2].renderNode.markDirty();
    markers[1].renderNode.scheduleForRemoval();
    markers[1].section.markers.remove(markers[1]);

    render(renderTree);

    assert.renderTreeIsEqual(renderTree, expected);

    markers = post.sections.head.markers.toArray();
    assert.equal(markers.length, 1);
    assert.ok(markers[0].hasMarkup(strong), 'marker has strong');
    assert.equal(markers[0].value, 'aXc');
  });

  /*
  test("It renders a renderTree with rendered dirty section", (assert) => {
    /*
     * renderTree is:
     *
     *      post<dirty>
     *       /        \
     *      /          \
     * section      section<dirty>
     *
    let post = builder.createPost
    let postRenderNode = {
      element: null,
      parent: null,
      isDirty: true,
      postNode: builder.createPost()
    }
    let renderTree = {
      node: renderNode
    }
  
    render(renderTree);
  
    assert.ok(renderTree.rootElement, 'renderTree renders element for post');
    assert.ok(!renderTree.rootNode.isDirty, 'dirty node becomes clean');
    assert.equal(renderTree.rootElement.tagName, 'DIV', 'renderTree renders element for post');
  });
  */
});
define('tests/unit/renderers/mobiledoc-test', ['exports', 'mobiledoc-kit/renderers/mobiledoc', '../../test-helpers'], function (exports, _mobiledocKitRenderersMobiledoc, _testHelpers) {
  'use strict';

  var _module = _testHelpers['default'].module;
  var test = _testHelpers['default'].test;

  function render(post) {
    return _mobiledocKitRenderersMobiledoc['default'].render(post);
  }

  _module('Unit: Mobiledoc Renderer');

  test('renders a blank post', function (assert) {
    var post = _testHelpers['default'].postAbstract.build(function (_ref) {
      var post = _ref.post;
      return post();
    });
    var mobiledoc = render(post);
    assert.deepEqual(mobiledoc, {
      version: _mobiledocKitRenderersMobiledoc.MOBILEDOC_VERSION,
      atoms: [],
      cards: [],
      markups: [],
      sections: []
    });
  });
});
define('tests/unit/renderers/mobiledoc/0-2-test', ['exports', 'mobiledoc-kit/renderers/mobiledoc/0-2', 'mobiledoc-kit/models/post-node-builder', 'mobiledoc-kit/utils/dom-utils', '../../../test-helpers'], function (exports, _mobiledocKitRenderersMobiledoc02, _mobiledocKitModelsPostNodeBuilder, _mobiledocKitUtilsDomUtils, _testHelpers) {
  'use strict';

  var _module = _testHelpers['default'].module;
  var test = _testHelpers['default'].test;

  function render(post) {
    return _mobiledocKitRenderersMobiledoc02['default'].render(post);
  }
  var builder = undefined;

  _module('Unit: Mobiledoc Renderer 0.2', {
    beforeEach: function beforeEach() {
      builder = new _mobiledocKitModelsPostNodeBuilder['default']();
    }
  });

  test('renders a blank post', function (assert) {
    var post = builder.createPost();
    var mobiledoc = render(post);
    assert.deepEqual(mobiledoc, {
      version: _mobiledocKitRenderersMobiledoc02.MOBILEDOC_VERSION,
      sections: [[], []]
    });
  });

  test('renders a post with marker', function (assert) {
    var post = _testHelpers['default'].postAbstract.build(function (_ref) {
      var post = _ref.post;
      var markupSection = _ref.markupSection;
      var marker = _ref.marker;
      var markup = _ref.markup;

      return post([markupSection('p', [marker('Hi', [markup('strong')])])]);
    });
    var mobiledoc = render(post);
    assert.deepEqual(mobiledoc, {
      version: _mobiledocKitRenderersMobiledoc02.MOBILEDOC_VERSION,
      sections: [[['strong']], [[1, (0, _mobiledocKitUtilsDomUtils.normalizeTagName)('P'), [[[0], 1, 'Hi']]]]]
    });
  });

  test('renders a post section with markers sharing a markup', function (assert) {
    var post = _testHelpers['default'].postAbstract.build(function (_ref2) {
      var post = _ref2.post;
      var markupSection = _ref2.markupSection;
      var marker = _ref2.marker;
      var markup = _ref2.markup;

      var strong = markup('strong');
      return post([markupSection('p', [marker('Hi', [strong]), marker(' Guy', [strong])])]);
    });
    var mobiledoc = render(post);
    assert.deepEqual(mobiledoc, {
      version: _mobiledocKitRenderersMobiledoc02.MOBILEDOC_VERSION,
      sections: [[['strong']], [[1, (0, _mobiledocKitUtilsDomUtils.normalizeTagName)('P'), [[[0], 0, 'Hi'], [[], 1, ' Guy']]]]]
    });
  });

  test('renders a post with markers with markers with complex attributes', function (assert) {
    var link1 = undefined,
        link2 = undefined;
    var post = _testHelpers['default'].postAbstract.build(function (_ref3) {
      var post = _ref3.post;
      var markupSection = _ref3.markupSection;
      var marker = _ref3.marker;
      var markup = _ref3.markup;

      link1 = markup('a', { href: 'bustle.com' });
      link2 = markup('a', { href: 'other.com' });
      return post([markupSection('p', [marker('Hi', [link1]), marker(' Guy', [link2]), marker(' other guy', [link1])])]);
    });
    var mobiledoc = render(post);
    assert.deepEqual(mobiledoc, {
      version: _mobiledocKitRenderersMobiledoc02.MOBILEDOC_VERSION,
      sections: [[['a', ['href', 'bustle.com']], ['a', ['href', 'other.com']]], [[1, (0, _mobiledocKitUtilsDomUtils.normalizeTagName)('P'), [[[0], 1, 'Hi'], [[1], 1, ' Guy'], [[0], 1, ' other guy']]]]]
    });
  });

  test('renders a post with image', function (assert) {
    var url = "data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACwAAAAAAQABAAACAkQBADs=";
    var post = builder.createPost();
    var section = builder.createImageSection(url);
    post.sections.append(section);

    var mobiledoc = render(post);
    assert.deepEqual(mobiledoc, {
      version: _mobiledocKitRenderersMobiledoc02.MOBILEDOC_VERSION,
      sections: [[], [[2, url]]]
    });
  });

  test('renders a post with image and null src', function (assert) {
    var post = builder.createPost();
    var section = builder.createImageSection();
    post.sections.append(section);

    var mobiledoc = render(post);
    assert.deepEqual(mobiledoc, {
      version: _mobiledocKitRenderersMobiledoc02.MOBILEDOC_VERSION,
      sections: [[], [[2, null]]]
    });
  });

  test('renders a post with card', function (assert) {
    var cardName = 'super-card';
    var payload = { bar: 'baz' };
    var post = builder.createPost();
    var section = builder.createCardSection(cardName, payload);
    post.sections.append(section);

    var mobiledoc = render(post);
    assert.deepEqual(mobiledoc, {
      version: _mobiledocKitRenderersMobiledoc02.MOBILEDOC_VERSION,
      sections: [[], [[10, cardName, payload]]]
    });
  });

  test('renders a post with a list', function (assert) {
    var items = [builder.createListItem([builder.createMarker('first item')]), builder.createListItem([builder.createMarker('second item')])];
    var section = builder.createListSection('ul', items);
    var post = builder.createPost([section]);

    var mobiledoc = render(post);
    assert.deepEqual(mobiledoc, {
      version: _mobiledocKitRenderersMobiledoc02.MOBILEDOC_VERSION,
      sections: [[], [[3, 'ul', [[[[], 0, 'first item']], [[[], 0, 'second item']]]]]]
    });
  });

  test('renders a pull-quote as markup section', function (assert) {
    var post = _testHelpers['default'].postAbstract.build(function (_ref4) {
      var post = _ref4.post;
      var markupSection = _ref4.markupSection;
      var marker = _ref4.marker;

      return post([markupSection('pull-quote', [marker('abc')])]);
    });
    var mobiledoc = render(post);
    assert.deepEqual(mobiledoc, {
      version: _mobiledocKitRenderersMobiledoc02.MOBILEDOC_VERSION,
      sections: [[], [[1, 'pull-quote', [[[], 0, 'abc']]]]]
    });
  });
});
define('tests/unit/renderers/mobiledoc/0-3-test', ['exports', 'mobiledoc-kit/renderers/mobiledoc/0-3', 'mobiledoc-kit/models/post-node-builder', 'mobiledoc-kit/utils/dom-utils', '../../../test-helpers'], function (exports, _mobiledocKitRenderersMobiledoc03, _mobiledocKitModelsPostNodeBuilder, _mobiledocKitUtilsDomUtils, _testHelpers) {
  'use strict';

  var _module = _testHelpers['default'].module;
  var test = _testHelpers['default'].test;

  function render(post) {
    return _mobiledocKitRenderersMobiledoc03['default'].render(post);
  }
  var builder = undefined;

  _module('Unit: Mobiledoc Renderer 0.3', {
    beforeEach: function beforeEach() {
      builder = new _mobiledocKitModelsPostNodeBuilder['default']();
    }
  });

  test('renders a blank post', function (assert) {
    var post = builder.createPost();
    var mobiledoc = render(post);
    assert.deepEqual(mobiledoc, {
      version: _mobiledocKitRenderersMobiledoc03.MOBILEDOC_VERSION,
      atoms: [],
      cards: [],
      markups: [],
      sections: []
    });
  });

  test('renders a post with marker', function (assert) {
    var post = _testHelpers['default'].postAbstract.build(function (_ref) {
      var post = _ref.post;
      var markupSection = _ref.markupSection;
      var marker = _ref.marker;
      var markup = _ref.markup;

      return post([markupSection('p', [marker('Hi', [markup('strong')])])]);
    });
    var mobiledoc = render(post);
    assert.deepEqual(mobiledoc, {
      version: _mobiledocKitRenderersMobiledoc03.MOBILEDOC_VERSION,
      atoms: [],
      cards: [],
      markups: [['strong']],
      sections: [[1, (0, _mobiledocKitUtilsDomUtils.normalizeTagName)('P'), [[0, [0], 1, 'Hi']]]]
    });
  });

  test('renders a post section with markers sharing a markup', function (assert) {
    var post = _testHelpers['default'].postAbstract.build(function (_ref2) {
      var post = _ref2.post;
      var markupSection = _ref2.markupSection;
      var marker = _ref2.marker;
      var markup = _ref2.markup;

      var strong = markup('strong');
      return post([markupSection('p', [marker('Hi', [strong]), marker(' Guy', [strong])])]);
    });
    var mobiledoc = render(post);
    assert.deepEqual(mobiledoc, {
      version: _mobiledocKitRenderersMobiledoc03.MOBILEDOC_VERSION,
      atoms: [],
      cards: [],
      markups: [['strong']],
      sections: [[1, (0, _mobiledocKitUtilsDomUtils.normalizeTagName)('P'), [[0, [0], 0, 'Hi'], [0, [], 1, ' Guy']]]]
    });
  });

  test('renders a post with markers with markers with complex attributes', function (assert) {
    var link1 = undefined,
        link2 = undefined;
    var post = _testHelpers['default'].postAbstract.build(function (_ref3) {
      var post = _ref3.post;
      var markupSection = _ref3.markupSection;
      var marker = _ref3.marker;
      var markup = _ref3.markup;

      link1 = markup('a', { href: 'bustle.com' });
      link2 = markup('a', { href: 'other.com' });
      return post([markupSection('p', [marker('Hi', [link1]), marker(' Guy', [link2]), marker(' other guy', [link1])])]);
    });
    var mobiledoc = render(post);
    assert.deepEqual(mobiledoc, {
      version: _mobiledocKitRenderersMobiledoc03.MOBILEDOC_VERSION,
      atoms: [],
      cards: [],
      markups: [['a', ['href', 'bustle.com']], ['a', ['href', 'other.com']]],
      sections: [[1, (0, _mobiledocKitUtilsDomUtils.normalizeTagName)('P'), [[0, [0], 1, 'Hi'], [0, [1], 1, ' Guy'], [0, [0], 1, ' other guy']]]]
    });
  });

  test('renders a post with image', function (assert) {
    var url = "data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACwAAAAAAQABAAACAkQBADs=";
    var post = builder.createPost();
    var section = builder.createImageSection(url);
    post.sections.append(section);

    var mobiledoc = render(post);
    assert.deepEqual(mobiledoc, {
      version: _mobiledocKitRenderersMobiledoc03.MOBILEDOC_VERSION,
      atoms: [],
      cards: [],
      markups: [],
      sections: [[2, url]]
    });
  });

  test('renders a post with image and null src', function (assert) {
    var post = builder.createPost();
    var section = builder.createImageSection();
    post.sections.append(section);

    var mobiledoc = render(post);
    assert.deepEqual(mobiledoc, {
      version: _mobiledocKitRenderersMobiledoc03.MOBILEDOC_VERSION,
      atoms: [],
      cards: [],
      markups: [],
      sections: [[2, null]]
    });
  });

  test('renders a post with atom', function (assert) {
    var post = _testHelpers['default'].postAbstract.build(function (_ref4) {
      var post = _ref4.post;
      var markupSection = _ref4.markupSection;
      var marker = _ref4.marker;
      var atom = _ref4.atom;

      return post([markupSection('p', [marker('Hi'), atom('mention', '@bob', { id: 42 })])]);
    });

    var mobiledoc = render(post);
    assert.deepEqual(mobiledoc, {
      version: _mobiledocKitRenderersMobiledoc03.MOBILEDOC_VERSION,
      atoms: [['mention', '@bob', { id: 42 }]],
      cards: [],
      markups: [],
      sections: [[1, (0, _mobiledocKitUtilsDomUtils.normalizeTagName)('P'), [[0, [], 0, 'Hi'], [1, [], 0, 0]]]]
    });
  });

  test('renders a post with atom and markup', function (assert) {
    var post = _testHelpers['default'].postAbstract.build(function (_ref5) {
      var post = _ref5.post;
      var markupSection = _ref5.markupSection;
      var marker = _ref5.marker;
      var markup = _ref5.markup;
      var atom = _ref5.atom;

      var strong = markup('strong');
      return post([markupSection('p', [atom('mention', '@bob', { id: 42 }, [strong])])]);
    });

    var mobiledoc = render(post);
    assert.deepEqual(mobiledoc, {
      version: _mobiledocKitRenderersMobiledoc03.MOBILEDOC_VERSION,
      atoms: [['mention', '@bob', { id: 42 }]],
      cards: [],
      markups: [['strong']],
      sections: [[1, (0, _mobiledocKitUtilsDomUtils.normalizeTagName)('P'), [[1, [0], 1, 0]]]]
    });
  });

  test('renders a post with atom inside markup', function (assert) {
    var post = _testHelpers['default'].postAbstract.build(function (_ref6) {
      var post = _ref6.post;
      var markupSection = _ref6.markupSection;
      var marker = _ref6.marker;
      var markup = _ref6.markup;
      var atom = _ref6.atom;

      var strong = markup('strong');
      return post([markupSection('p', [marker('Hi ', [strong]), atom('mention', '@bob', { id: 42 }, [strong]), marker(' Bye', [strong])])]);
    });

    var mobiledoc = render(post);
    assert.deepEqual(mobiledoc, {
      version: _mobiledocKitRenderersMobiledoc03.MOBILEDOC_VERSION,
      atoms: [['mention', '@bob', { id: 42 }]],
      cards: [],
      markups: [['strong']],
      sections: [[1, (0, _mobiledocKitUtilsDomUtils.normalizeTagName)('P'), [[0, [0], 0, 'Hi '], [1, [], 0, 0], [0, [], 1, ' Bye']]]]
    });
  });

  test('renders a post with card', function (assert) {
    var cardName = 'super-card';
    var payload = { bar: 'baz' };
    var post = builder.createPost();
    var section = builder.createCardSection(cardName, payload);
    post.sections.append(section);

    var mobiledoc = render(post);
    assert.deepEqual(mobiledoc, {
      version: _mobiledocKitRenderersMobiledoc03.MOBILEDOC_VERSION,
      atoms: [],
      cards: [[cardName, payload]],
      markups: [],
      sections: [[10, 0]]
    });
  });

  test('renders a post with multiple cards with identical payloads', function (assert) {
    var cardName = 'super-card';
    var payload1 = { bar: 'baz' };
    var payload2 = { bar: 'baz' };
    var post = builder.createPost();

    var section1 = builder.createCardSection(cardName, payload1);
    post.sections.append(section1);

    var section2 = builder.createCardSection(cardName, payload2);
    post.sections.append(section2);

    var mobiledoc = render(post);
    assert.deepEqual(mobiledoc, {
      version: _mobiledocKitRenderersMobiledoc03.MOBILEDOC_VERSION,
      atoms: [],
      cards: [[cardName, payload1], [cardName, payload2]],
      markups: [],
      sections: [[10, 0], [10, 1]]
    });
  });

  test('renders a post with cards with differing payloads', function (assert) {
    var cardName = 'super-card';
    var payload1 = { bar: 'baz1' };
    var payload2 = { bar: 'baz2' };
    var post = builder.createPost();

    var section1 = builder.createCardSection(cardName, payload1);
    post.sections.append(section1);

    var section2 = builder.createCardSection(cardName, payload2);
    post.sections.append(section2);

    var mobiledoc = render(post);
    assert.deepEqual(mobiledoc, {
      version: _mobiledocKitRenderersMobiledoc03.MOBILEDOC_VERSION,
      atoms: [],
      cards: [[cardName, payload1], [cardName, payload2]],
      markups: [],
      sections: [[10, 0], [10, 1]]
    });
  });

  test('renders a post with a list', function (assert) {
    var items = [builder.createListItem([builder.createMarker('first item')]), builder.createListItem([builder.createMarker('second item')])];
    var section = builder.createListSection('ul', items);
    var post = builder.createPost([section]);

    var mobiledoc = render(post);
    assert.deepEqual(mobiledoc, {
      version: _mobiledocKitRenderersMobiledoc03.MOBILEDOC_VERSION,
      atoms: [],
      cards: [],
      markups: [],
      sections: [[3, 'ul', [[[0, [], 0, 'first item']], [[0, [], 0, 'second item']]]]]
    });
  });

  test('renders a pull-quote as markup section', function (assert) {
    var post = _testHelpers['default'].postAbstract.build(function (_ref7) {
      var post = _ref7.post;
      var markupSection = _ref7.markupSection;
      var marker = _ref7.marker;

      return post([markupSection('pull-quote', [marker('abc')])]);
    });
    var mobiledoc = render(post);
    assert.deepEqual(mobiledoc, {
      version: _mobiledocKitRenderersMobiledoc03.MOBILEDOC_VERSION,
      atoms: [],
      cards: [],
      markups: [],
      sections: [[1, 'pull-quote', [[0, [], 0, 'abc']]]]
    });
  });
});
define('tests/unit/utils/array-utils-test', ['exports', '../../test-helpers', 'mobiledoc-kit/utils/array-utils'], function (exports, _testHelpers, _mobiledocKitUtilsArrayUtils) {
  'use strict';

  var _module = _testHelpers['default'].module;
  var test = _testHelpers['default'].test;

  _module('Unit: Utils: Array Utils');

  test('#objectToSortedKVArray works', function (assert) {
    assert.deepEqual((0, _mobiledocKitUtilsArrayUtils.objectToSortedKVArray)({ a: 1, b: 2 }), ['a', 1, 'b', 2]);
    assert.deepEqual((0, _mobiledocKitUtilsArrayUtils.objectToSortedKVArray)({ b: 1, a: 2 }), ['a', 2, 'b', 1]);
    assert.deepEqual((0, _mobiledocKitUtilsArrayUtils.objectToSortedKVArray)({}), []);
  });

  test('#kvArrayToObject works', function (assert) {
    assert.deepEqual((0, _mobiledocKitUtilsArrayUtils.kvArrayToObject)(['a', 1, 'b', 2]), { a: 1, b: 2 });
    assert.deepEqual((0, _mobiledocKitUtilsArrayUtils.kvArrayToObject)([]), {});
  });
});
define('tests/unit/utils/assert-test', ['exports', '../../test-helpers', 'mobiledoc-kit/utils/assert', 'mobiledoc-kit/utils/mobiledoc-error'], function (exports, _testHelpers, _mobiledocKitUtilsAssert, _mobiledocKitUtilsMobiledocError) {
  'use strict';

  var _module = _testHelpers['default'].module;
  var test = _testHelpers['default'].test;

  _module('Unit: Utils: assert');

  test('#throws a MobiledocError when conditional is false', function (assert) {
    try {
      (0, _mobiledocKitUtilsAssert['default'])('The message', false);
    } catch (e) {
      assert.ok(true, 'caught error');
      assert.equal(e.message, 'The message');
      assert.ok(e instanceof _mobiledocKitUtilsMobiledocError['default'], 'e instanceof MobiledocError');
    }
  });
});
define('tests/unit/utils/copy-test', ['exports', '../../test-helpers', 'mobiledoc-kit/utils/copy'], function (exports, _testHelpers, _mobiledocKitUtilsCopy) {
  'use strict';

  var _module = _testHelpers['default'].module;
  var test = _testHelpers['default'].test;

  _module('Unit: Utils: copy');

  test('#shallowCopyObject breaks references', function (assert) {
    var obj = { a: 1, b: 'b' };
    var obj2 = (0, _mobiledocKitUtilsCopy.shallowCopyObject)(obj);
    obj.a = 2;
    obj.b = 'new b';

    assert.ok(obj !== obj2, 'obj !== obj2');
    assert.equal(obj2.a, 1, 'obj2 "a" preserved');
    assert.equal(obj2.b, 'b', 'obj2 "b" preserved');
  });
});
define('tests/unit/utils/cursor-position-test', ['exports', '../../test-helpers', 'mobiledoc-kit/utils/cursor/position', 'mobiledoc-kit/renderers/editor-dom'], function (exports, _testHelpers, _mobiledocKitUtilsCursorPosition, _mobiledocKitRenderersEditorDom) {
  'use strict';

  var _module = _testHelpers['default'].module;
  var test = _testHelpers['default'].test;

  var editor = undefined,
      editorElement = undefined;

  _module('Unit: Utils: Position', {
    beforeEach: function beforeEach() {
      editorElement = $('#editor')[0];
    },
    afterEach: function afterEach() {
      if (editor) {
        editor.destroy();
      }
    }
  });

  test('#move moves forward and backward in markup section', function (assert) {
    var post = _testHelpers['default'].postAbstract.build(function (_ref) {
      var post = _ref.post;
      var markupSection = _ref.markupSection;
      var marker = _ref.marker;

      return post([markupSection('p', [marker('abcd')])]);
    });
    var position = new _mobiledocKitUtilsCursorPosition['default'](post.sections.head, 'ab'.length);
    var rightPosition = new _mobiledocKitUtilsCursorPosition['default'](post.sections.head, 'abc'.length);
    var leftPosition = new _mobiledocKitUtilsCursorPosition['default'](post.sections.head, 'a'.length);

    assert.positionIsEqual(position.moveRight(), rightPosition, 'right position');
    assert.positionIsEqual(position.moveLeft(), leftPosition, 'left position');
  });

  test('#move is emoji-aware', function (assert) {
    var emoji = '🙈';
    var post = _testHelpers['default'].postAbstract.build(function (_ref2) {
      var post = _ref2.post;
      var markupSection = _ref2.markupSection;
      var marker = _ref2.marker;

      return post([markupSection('p', [marker('a' + emoji + 'z')])]);
    });
    var marker = post.sections.head.markers.head;
    assert.equal(marker.length, 'a'.length + 2 + 'z'.length); // precond
    var position = post.sections.head.headPosition();

    position = position.moveRight();
    assert.equal(position.offset, 1);
    position = position.moveRight();
    assert.equal(position.offset, 3); // l-to-r across emoji
    position = position.moveRight();
    assert.equal(position.offset, 4);

    position = position.moveLeft();
    assert.equal(position.offset, 3);

    position = position.moveLeft(); // r-to-l across emoji
    assert.equal(position.offset, 1);

    position = position.moveLeft();
    assert.equal(position.offset, 0);
  });

  test('#move moves forward and backward between markup sections', function (assert) {
    var post = _testHelpers['default'].postAbstract.build(function (_ref3) {
      var post = _ref3.post;
      var markupSection = _ref3.markupSection;
      var marker = _ref3.marker;

      return post([markupSection('p', [marker('a')]), markupSection('p', [marker('b')]), markupSection('p', [marker('c')])]);
    });
    var midHead = post.sections.objectAt(1).headPosition();
    var midTail = post.sections.objectAt(1).tailPosition();

    var aTail = post.sections.head.tailPosition();
    var cHead = post.sections.tail.headPosition();

    assert.positionIsEqual(midHead.moveLeft(), aTail, 'left to prev section');
    assert.positionIsEqual(midTail.moveRight(), cHead, 'right to next section');
  });

  test('#move from one nested section to another', function (assert) {
    var post = _testHelpers['default'].postAbstract.build(function (_ref4) {
      var post = _ref4.post;
      var listSection = _ref4.listSection;
      var listItem = _ref4.listItem;
      var marker = _ref4.marker;

      return post([listSection('ul', [listItem([marker('a')]), listItem([marker('b')]), listItem([marker('c')])])]);
    });
    var midHead = post.sections.head.items.objectAt(1).headPosition();
    var midTail = post.sections.head.items.objectAt(1).tailPosition();

    var aTail = post.sections.head.items.head.tailPosition();
    var cHead = post.sections.tail.items.tail.headPosition();

    assert.positionIsEqual(midHead.moveLeft(), aTail, 'left to prev section');
    assert.positionIsEqual(midTail.moveRight(), cHead, 'right to next section');
  });

  test('#move from last nested section to next un-nested section', function (assert) {
    var post = _testHelpers['default'].postAbstract.build(function (_ref5) {
      var post = _ref5.post;
      var listSection = _ref5.listSection;
      var listItem = _ref5.listItem;
      var markupSection = _ref5.markupSection;
      var marker = _ref5.marker;

      return post([markupSection('p', [marker('a')]), listSection('ul', [listItem([marker('b')])]), markupSection('p', [marker('c')])]);
    });
    var midHead = post.sections.objectAt(1).items.head.headPosition();
    var midTail = post.sections.objectAt(1).items.head.tailPosition();

    var aTail = post.sections.head.tailPosition();
    var cHead = post.sections.tail.headPosition();

    assert.positionIsEqual(midHead.moveLeft(), aTail, 'left to prev section');
    assert.positionIsEqual(midTail.moveRight(), cHead, 'right to next section');
  });

  test('#move across and beyond card section', function (assert) {
    var post = _testHelpers['default'].postAbstract.build(function (_ref6) {
      var post = _ref6.post;
      var cardSection = _ref6.cardSection;
      var markupSection = _ref6.markupSection;
      var marker = _ref6.marker;

      return post([markupSection('p', [marker('a')]), cardSection('my-card'), markupSection('p', [marker('c')])]);
    });
    var midHead = post.sections.objectAt(1).headPosition();
    var midTail = post.sections.objectAt(1).tailPosition();

    var aTail = post.sections.head.tailPosition();
    var cHead = post.sections.tail.headPosition();

    assert.positionIsEqual(midHead.moveLeft(), aTail, 'left to prev section');
    assert.positionIsEqual(midTail.moveRight(), cHead, 'right to next section');
    assert.positionIsEqual(midHead.moveRight(), midTail, 'move l-to-r across card');
    assert.positionIsEqual(midTail.moveLeft(), midHead, 'move r-to-l across card');
  });

  test('#move across and beyond card section into list section', function (assert) {
    var post = _testHelpers['default'].postAbstract.build(function (_ref7) {
      var post = _ref7.post;
      var cardSection = _ref7.cardSection;
      var listSection = _ref7.listSection;
      var listItem = _ref7.listItem;
      var marker = _ref7.marker;

      return post([listSection('ul', [listItem([marker('a1')]), listItem([marker('a2')])]), cardSection('my-card'), listSection('ul', [listItem([marker('c1')]), listItem([marker('c2')])])]);
    });
    var midHead = post.sections.objectAt(1).headPosition();
    var midTail = post.sections.objectAt(1).tailPosition();

    var aTail = post.sections.head.items.tail.tailPosition();
    var cHead = post.sections.tail.items.head.headPosition();

    assert.positionIsEqual(midHead.moveLeft(), aTail, 'left to prev section');
    assert.positionIsEqual(midTail.moveRight(), cHead, 'right to next section');
  });

  test('#fromNode when node is marker text node', function (assert) {
    editor = _testHelpers['default'].mobiledoc.renderInto(editorElement, function (_ref8) {
      var post = _ref8.post;
      var markupSection = _ref8.markupSection;
      var marker = _ref8.marker;

      return post([markupSection('p', [marker('abc'), marker('123')])]);
    });

    var textNode = editorElement.firstChild // p
    .lastChild; // textNode

    assert.equal(textNode.textContent, '123', 'precond - correct text node');

    var renderTree = editor._renderTree;
    var position = _mobiledocKitUtilsCursorPosition['default'].fromNode(renderTree, textNode, 2);

    var section = editor.post.sections.head;
    assert.positionIsEqual(position, new _mobiledocKitUtilsCursorPosition['default'](section, 'abc'.length + 2));
  });

  test('#fromNode when node is section node with offset', function (assert) {
    editor = _testHelpers['default'].mobiledoc.renderInto(editorElement, function (_ref9) {
      var post = _ref9.post;
      var markupSection = _ref9.markupSection;
      var marker = _ref9.marker;

      return post([markupSection('p', [marker('abc'), marker('123')])]);
    });

    var pNode = editorElement.firstChild;
    assert.equal(pNode.tagName.toLowerCase(), 'p', 'precond - correct node');

    var renderTree = editor._renderTree;
    var position = _mobiledocKitUtilsCursorPosition['default'].fromNode(renderTree, pNode, 0);

    assert.positionIsEqual(position, editor.post.sections.head.headPosition());
  });

  test('#fromNode when node is root element and offset is 0', function (assert) {
    editor = _testHelpers['default'].mobiledoc.renderInto(editorElement, function (_ref10) {
      var post = _ref10.post;
      var markupSection = _ref10.markupSection;
      var marker = _ref10.marker;

      return post([markupSection('p', [marker('abc'), marker('123')])]);
    });

    var renderTree = editor._renderTree;
    var position = _mobiledocKitUtilsCursorPosition['default'].fromNode(renderTree, editorElement, 0);

    assert.positionIsEqual(position, editor.post.headPosition());
  });

  test('#fromNode when node is root element and offset is > 0', function (assert) {
    editor = _testHelpers['default'].mobiledoc.renderInto(editorElement, function (_ref11) {
      var post = _ref11.post;
      var markupSection = _ref11.markupSection;
      var marker = _ref11.marker;

      return post([markupSection('p', [marker('abc'), marker('123')])]);
    });

    var renderTree = editor._renderTree;
    var position = _mobiledocKitUtilsCursorPosition['default'].fromNode(renderTree, editorElement, 1);

    assert.positionIsEqual(position, editor.post.tailPosition());
  });

  test('#fromNode when node is card section element or next to it', function (assert) {
    var editorOptions = { cards: [{
        name: 'some-card',
        type: 'dom',
        render: function render() {
          return $('<div id="the-card">this is the card</div>')[0];
        }
      }] };
    editor = _testHelpers['default'].mobiledoc.renderInto(editorElement, function (_ref12) {
      var post = _ref12.post;
      var cardSection = _ref12.cardSection;

      return post([cardSection('some-card')]);
    }, editorOptions);

    var nodes = {
      wrapper: editorElement.firstChild,
      leftCursor: editorElement.firstChild.firstChild,
      rightCursor: editorElement.firstChild.lastChild,
      cardDiv: editorElement.firstChild.childNodes[1]
    };

    assert.ok(nodes.wrapper && nodes.leftCursor && nodes.rightCursor && nodes.cardDiv, 'precond - nodes');

    assert.equal(nodes.wrapper.tagName.toLowerCase(), 'div', 'precond - wrapper');
    assert.equal(nodes.leftCursor.textContent, _mobiledocKitRenderersEditorDom.ZWNJ, 'precond - left cursor');
    assert.equal(nodes.rightCursor.textContent, _mobiledocKitRenderersEditorDom.ZWNJ, 'precond - right cursor');
    assert.ok(nodes.cardDiv.className.indexOf(_mobiledocKitRenderersEditorDom.CARD_ELEMENT_CLASS_NAME) !== -1, 'precond -card div');

    var renderTree = editor._renderTree;
    var cardSection = editor.post.sections.head;

    var leftPos = cardSection.headPosition();
    var rightPos = cardSection.tailPosition();

    assert.positionIsEqual(_mobiledocKitUtilsCursorPosition['default'].fromNode(renderTree, nodes.wrapper, 0), leftPos, 'wrapper offset 0');
    assert.positionIsEqual(_mobiledocKitUtilsCursorPosition['default'].fromNode(renderTree, nodes.wrapper, 1), leftPos, 'wrapper offset 1');
    assert.positionIsEqual(_mobiledocKitUtilsCursorPosition['default'].fromNode(renderTree, nodes.wrapper, 2), rightPos, 'wrapper offset 2');
    assert.positionIsEqual(_mobiledocKitUtilsCursorPosition['default'].fromNode(renderTree, nodes.leftCursor, 0), leftPos, 'left cursor offset 0');
    assert.positionIsEqual(_mobiledocKitUtilsCursorPosition['default'].fromNode(renderTree, nodes.leftCursor, 1), leftPos, 'left cursor offset 1');
    assert.positionIsEqual(_mobiledocKitUtilsCursorPosition['default'].fromNode(renderTree, nodes.rightCursor, 0), rightPos, 'right cursor offset 0');
    assert.positionIsEqual(_mobiledocKitUtilsCursorPosition['default'].fromNode(renderTree, nodes.rightCursor, 1), rightPos, 'right cursor offset 1');
    assert.positionIsEqual(_mobiledocKitUtilsCursorPosition['default'].fromNode(renderTree, nodes.cardDiv, 0), leftPos, 'card div offset 0');
    assert.positionIsEqual(_mobiledocKitUtilsCursorPosition['default'].fromNode(renderTree, nodes.cardDiv, 1), leftPos, 'card div offset 1');
  });

  test('Position cannot be on list section', function (assert) {
    var post = _testHelpers['default'].postAbstract.build(function (_ref13) {
      var post = _ref13.post;
      var listSection = _ref13.listSection;
      var listItem = _ref13.listItem;

      return post([listSection('ul', [listItem()])]);
    });

    var listSection = post.sections.head;
    var listItem = listSection.items.head;

    var position = undefined;
    assert.throws(function () {
      position = new _mobiledocKitUtilsCursorPosition['default'](listSection, 0);
    }, /addressable by the cursor/);

    position = new _mobiledocKitUtilsCursorPosition['default'](listItem, 0);
    assert.ok(position, 'position with list item is ok');
  });
});
define('tests/unit/utils/cursor-range-test', ['exports', '../../test-helpers', 'mobiledoc-kit/utils/cursor/range'], function (exports, _testHelpers, _mobiledocKitUtilsCursorRange) {
  'use strict';

  var _module = _testHelpers['default'].module;
  var test = _testHelpers['default'].test;

  _module('Unit: Utils: Range');

  test('#trimTo(section) when range covers only one section', function (assert) {
    var section = _testHelpers['default'].postAbstract.build(function (_ref) {
      var markupSection = _ref.markupSection;
      return markupSection();
    });
    var range = _mobiledocKitUtilsCursorRange['default'].create(section, 0, section, 5);

    var newRange = range.trimTo(section);
    assert.ok(newRange.head.section === section, 'head section is correct');
    assert.ok(newRange.tail.section === section, 'tail section is correct');
    assert.equal(newRange.head.offset, 0, 'head offset');
    assert.equal(newRange.tail.offset, 0, 'tail offset');
  });

  test('#trimTo head section', function (assert) {
    var text = 'abcdef';
    var section1 = _testHelpers['default'].postAbstract.build(function (_ref2) {
      var markupSection = _ref2.markupSection;
      var marker = _ref2.marker;
      return markupSection('p', [marker(text)]);
    });
    var section2 = _testHelpers['default'].postAbstract.build(function (_ref3) {
      var markupSection = _ref3.markupSection;
      var marker = _ref3.marker;
      return markupSection('p', [marker(text)]);
    });

    var range = _mobiledocKitUtilsCursorRange['default'].create(section1, 0, section2, 5);
    var newRange = range.trimTo(section1);

    assert.ok(newRange.head.section === section1, 'head section');
    assert.ok(newRange.tail.section === section1, 'tail section');
    assert.equal(newRange.head.offset, 0, 'head offset');
    assert.equal(newRange.tail.offset, text.length, 'tail offset');
  });

  test('#trimTo tail section', function (assert) {
    var text = 'abcdef';
    var section1 = _testHelpers['default'].postAbstract.build(function (_ref4) {
      var markupSection = _ref4.markupSection;
      var marker = _ref4.marker;
      return markupSection('p', [marker(text)]);
    });
    var section2 = _testHelpers['default'].postAbstract.build(function (_ref5) {
      var markupSection = _ref5.markupSection;
      var marker = _ref5.marker;
      return markupSection('p', [marker(text)]);
    });

    var range = _mobiledocKitUtilsCursorRange['default'].create(section1, 0, section2, 5);
    var newRange = range.trimTo(section2);

    assert.ok(newRange.head.section === section2, 'head section');
    assert.ok(newRange.tail.section === section2, 'tail section');
    assert.equal(newRange.head.offset, 0, 'head offset');
    assert.equal(newRange.tail.offset, 5, 'tail offset');
  });

  test('#trimTo middle section', function (assert) {
    var text = 'abcdef';
    var section1 = _testHelpers['default'].postAbstract.build(function (_ref6) {
      var markupSection = _ref6.markupSection;
      var marker = _ref6.marker;
      return markupSection('p', [marker(text)]);
    });
    var section2 = _testHelpers['default'].postAbstract.build(function (_ref7) {
      var markupSection = _ref7.markupSection;
      var marker = _ref7.marker;
      return markupSection('p', [marker(text)]);
    });
    var section3 = _testHelpers['default'].postAbstract.build(function (_ref8) {
      var markupSection = _ref8.markupSection;
      var marker = _ref8.marker;
      return markupSection('p', [marker(text)]);
    });

    var range = _mobiledocKitUtilsCursorRange['default'].create(section1, 0, section3, 5);
    var newRange = range.trimTo(section2);

    assert.ok(newRange.head.section === section2, 'head section');
    assert.ok(newRange.tail.section === section2, 'tail section');
    assert.equal(newRange.head.offset, 0, 'head offset');
    assert.equal(newRange.tail.offset, section2.text.length, 'tail offset');
  });
});
define('tests/unit/utils/fixed-queue-test', ['exports', '../../test-helpers', 'mobiledoc-kit/utils/fixed-queue'], function (exports, _testHelpers, _mobiledocKitUtilsFixedQueue) {
  'use strict';

  var _module = _testHelpers['default'].module;
  var test = _testHelpers['default'].test;

  _module('Unit: Utils: FixedQueue');

  test('basic implementation', function (assert) {
    var queue = new _mobiledocKitUtilsFixedQueue['default'](3);
    for (var i = 0; i < 3; i++) {
      queue.push(i);
    }

    assert.equal(queue.length, 3);

    var popped = [];
    while (queue.length) {
      popped.push(queue.pop());
    }

    assert.deepEqual(popped, [2, 1, 0]);
  });

  test('empty queue', function (assert) {
    var queue = new _mobiledocKitUtilsFixedQueue['default'](0);
    assert.equal(queue.length, 0);
    assert.equal(queue.pop(), undefined);
    queue.push(1);

    assert.equal(queue.length, 0);
    assert.deepEqual(queue.toArray(), []);
  });

  test('push onto full queue ejects first item', function (assert) {
    var queue = new _mobiledocKitUtilsFixedQueue['default'](1);
    queue.push(0);
    queue.push(1);

    assert.deepEqual(queue.toArray(), [1]);
  });
});
define('tests/unit/utils/key-test', ['exports', '../../test-helpers', 'mobiledoc-kit/utils/key'], function (exports, _testHelpers, _mobiledocKitUtilsKey) {
  'use strict';

  var _module = _testHelpers['default'].module;
  var test = _testHelpers['default'].test;

  _module('Unit: Utils: Key');

  test('#hasModifier with no modifier', function (assert) {
    var key = _mobiledocKitUtilsKey['default'].fromEvent({ keyCode: 42 });

    assert.ok(!key.hasModifier(_mobiledocKitUtilsKey.MODIFIERS.META), "META not pressed");
    assert.ok(!key.hasModifier(_mobiledocKitUtilsKey.MODIFIERS.CTRL), "CTRL not pressed");
    assert.ok(!key.hasModifier(_mobiledocKitUtilsKey.MODIFIERS.SHIFT), "SHIFT not pressed");
  });

  test('#hasModifier with META', function (assert) {
    var key = _mobiledocKitUtilsKey['default'].fromEvent({ metaKey: true });

    assert.ok(key.hasModifier(_mobiledocKitUtilsKey.MODIFIERS.META), "META pressed");
    assert.ok(!key.hasModifier(_mobiledocKitUtilsKey.MODIFIERS.CTRL), "CTRL not pressed");
    assert.ok(!key.hasModifier(_mobiledocKitUtilsKey.MODIFIERS.SHIFT), "SHIFT not pressed");
  });

  test('#hasModifier with CTRL', function (assert) {
    var key = _mobiledocKitUtilsKey['default'].fromEvent({ ctrlKey: true });

    assert.ok(!key.hasModifier(_mobiledocKitUtilsKey.MODIFIERS.META), "META not pressed");
    assert.ok(key.hasModifier(_mobiledocKitUtilsKey.MODIFIERS.CTRL), "CTRL pressed");
    assert.ok(!key.hasModifier(_mobiledocKitUtilsKey.MODIFIERS.SHIFT), "SHIFT not pressed");
  });

  test('#hasModifier with SHIFT', function (assert) {
    var key = _mobiledocKitUtilsKey['default'].fromEvent({ shiftKey: true });

    assert.ok(!key.hasModifier(_mobiledocKitUtilsKey.MODIFIERS.META), "META not pressed");
    assert.ok(!key.hasModifier(_mobiledocKitUtilsKey.MODIFIERS.CTRL), "CTRL not pressed");
    assert.ok(key.hasModifier(_mobiledocKitUtilsKey.MODIFIERS.SHIFT), "SHIFT pressed");
  });
});
define('tests/unit/utils/lifecycle-callbacks-test', ['exports', '../../test-helpers', 'mobiledoc-kit/utils/lifecycle-callbacks', 'mobiledoc-kit/utils/mixin'], function (exports, _testHelpers, _mobiledocKitUtilsLifecycleCallbacks, _mobiledocKitUtilsMixin) {
  'use strict';

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  var TestCallbacks = function TestCallbacks() {
    _classCallCheck(this, TestCallbacks);
  };

  (0, _mobiledocKitUtilsMixin['default'])(TestCallbacks, _mobiledocKitUtilsLifecycleCallbacks['default']);

  var _module = _testHelpers['default'].module;
  var test = _testHelpers['default'].test;

  _module('Unit: Utils: LifecycleCallbacksMixin');

  test('#addCallback permanently adds the callback', function (assert) {
    var item = new TestCallbacks();
    var queueName = 'test';
    var called = 0;
    var callback = function callback() {
      return called++;
    };
    item.addCallback(queueName, callback);

    item.runCallbacks(queueName);
    assert.equal(called, 1);

    item.runCallbacks(queueName);
    assert.equal(called, 2, 'callback is run a second time');
  });

  test('#addCallback callback only runs in its queue', function (assert) {
    var item = new TestCallbacks();
    var queueName = 'test';
    var called = 0;
    var callback = function callback() {
      return called++;
    };
    item.addCallback(queueName, callback);

    var otherQueueName = 'other';
    item.runCallbacks(otherQueueName);

    assert.equal(called, 0);
  });

  test('callbacks run with arguments', function (assert) {
    var item = new TestCallbacks();
    var queueName = 'test';
    var arg1 = undefined,
        arg2 = undefined;
    var foo = {},
        bar = {};
    var callback = function callback(_arg1, _arg2) {
      arg1 = _arg1;
      arg2 = _arg2;
    };
    item.addCallback(queueName, callback);
    item.runCallbacks(queueName, [foo, bar]);

    assert.deepEqual(arg1, foo);
    assert.deepEqual(arg2, bar);
  });

  test('#addCallbackOnce only runs the callback one time', function (assert) {
    var item = new TestCallbacks();
    var queueName = 'test';
    var called = 0;
    var callback = function callback() {
      return called++;
    };
    item.addCallbackOnce(queueName, callback);

    item.runCallbacks(queueName);
    assert.equal(called, 1, 'runs once');

    item.runCallbacks(queueName);
    assert.equal(called, 1, 'does not run twice');
  });

  test('#addCallback and #addCallbackOnce work correctly together', function (assert) {
    var item = new TestCallbacks();
    var queueName = 'test';
    var calledOnce = 0;
    var callbackOnce = function callbackOnce() {
      return calledOnce++;
    };
    var called = 0;
    var callback = function callback() {
      return called++;
    };

    item.addCallbackOnce(queueName, callbackOnce);
    item.addCallback(queueName, callback);

    item.runCallbacks(queueName);
    assert.equal(called, 1, 'runs callback');
    assert.equal(calledOnce, 1, 'runs one-time callback once');

    item.runCallbacks(queueName);
    assert.equal(called, 2, 'runs callback again');
    assert.equal(calledOnce, 1, 'runs one-time callback only once');
  });
});
define('tests/unit/utils/linked-list-test', ['exports', 'mobiledoc-kit/utils/linked-list', 'mobiledoc-kit/utils/linked-item'], function (exports, _mobiledocKitUtilsLinkedList, _mobiledocKitUtilsLinkedItem) {
  'use strict';

  var _QUnit = QUnit;
  var _module = _QUnit.module;
  var test = _QUnit.test;

  var INSERTION_METHODS = ['append', 'prepend', 'insertBefore', 'insertAfter'];

  _module('Unit: Utils: LinkedList');

  test('initial state', function (assert) {
    var list = new _mobiledocKitUtilsLinkedList['default']();
    assert.equal(list.head, null, 'head is null');
    assert.equal(list.tail, null, 'tail is null');
    assert.equal(list.length, 0, 'length is one');
    assert.equal(list.isEmpty, true, 'isEmpty is true');
  });

  INSERTION_METHODS.forEach(function (method) {
    test('#' + method + ' initial item', function (assert) {
      var list = new _mobiledocKitUtilsLinkedList['default']();
      var item = new _mobiledocKitUtilsLinkedItem['default']();
      list[method](item);
      assert.equal(list.length, 1, 'length is one');
      assert.equal(list.isEmpty, false, 'isEmpty is false');
      assert.equal(list.head, item, 'head is item');
      assert.equal(list.tail, item, 'tail is item');
      assert.equal(item.next, null, 'item next is null');
      assert.equal(item.prev, null, 'item prev is null');
    });

    test('#' + method + ' calls adoptItem', function (assert) {
      var adoptedItem = undefined;
      var list = new _mobiledocKitUtilsLinkedList['default']({
        adoptItem: function adoptItem(item) {
          adoptedItem = item;
        }
      });
      var item = new _mobiledocKitUtilsLinkedItem['default']();
      list[method](item);
      assert.equal(adoptedItem, item, 'item is adopted');
    });

    test('#' + method + ' throws when inserting item that is already in this list', function (assert) {
      var list = new _mobiledocKitUtilsLinkedList['default']();
      var item = new _mobiledocKitUtilsLinkedItem['default']();
      list[method](item);

      assert.throws(function () {
        return list[method](item);
      }, /Cannot insert.*already in a list/);
    });

    test('#' + method + ' throws if item is in another list', function (assert) {
      var list = new _mobiledocKitUtilsLinkedList['default']();
      var otherList = new _mobiledocKitUtilsLinkedList['default']();
      var item = new _mobiledocKitUtilsLinkedItem['default']();
      var otherItem = new _mobiledocKitUtilsLinkedItem['default']();

      list[method](item);
      otherList[method](otherItem);

      assert.throws(function () {
        return list[method](otherItem);
      }, /Cannot insert.*already in a list/);
    });
  });

  test('#append second item', function (assert) {
    var list = new _mobiledocKitUtilsLinkedList['default']();
    var itemOne = new _mobiledocKitUtilsLinkedItem['default']();
    var itemTwo = new _mobiledocKitUtilsLinkedItem['default']();
    list.append(itemOne);
    list.append(itemTwo);
    assert.equal(list.length, 2, 'length is two');
    assert.equal(list.head, itemOne, 'head is itemOne');
    assert.equal(list.tail, itemTwo, 'tail is itemTwo');
    assert.equal(itemOne.prev, null, 'itemOne prev is null');
    assert.equal(itemOne.next, itemTwo, 'itemOne next is itemTwo');
    assert.equal(itemTwo.prev, itemOne, 'itemTwo prev is itemOne');
    assert.equal(itemTwo.next, null, 'itemTwo next is null');
  });

  test('#prepend additional item', function (assert) {
    var list = new _mobiledocKitUtilsLinkedList['default']();
    var itemOne = new _mobiledocKitUtilsLinkedItem['default']();
    var itemTwo = new _mobiledocKitUtilsLinkedItem['default']();
    list.prepend(itemTwo);
    list.prepend(itemOne);
    assert.equal(list.length, 2, 'length is two');
    assert.equal(list.head, itemOne, 'head is itemOne');
    assert.equal(list.tail, itemTwo, 'tail is itemTwo');
    assert.equal(itemOne.prev, null, 'itemOne prev is null');
    assert.equal(itemOne.next, itemTwo, 'itemOne next is itemTwo');
    assert.equal(itemTwo.prev, itemOne, 'itemTwo prev is itemOne');
    assert.equal(itemTwo.next, null, 'itemTwo next is null');
  });

  test('#insertBefore a middle item', function (assert) {
    var list = new _mobiledocKitUtilsLinkedList['default']();
    var itemOne = new _mobiledocKitUtilsLinkedItem['default']();
    var itemTwo = new _mobiledocKitUtilsLinkedItem['default']();
    var itemThree = new _mobiledocKitUtilsLinkedItem['default']();
    list.prepend(itemOne);
    list.append(itemThree);
    list.insertBefore(itemTwo, itemThree);
    assert.equal(list.length, 3, 'length is three');
    assert.equal(list.head, itemOne, 'head is itemOne');
    assert.equal(list.tail, itemThree, 'tail is itemThree');
    assert.equal(itemOne.prev, null, 'itemOne prev is null');
    assert.equal(itemOne.next, itemTwo, 'itemOne next is itemTwo');
    assert.equal(itemTwo.prev, itemOne, 'itemTwo prev is itemOne');
    assert.equal(itemTwo.next, itemThree, 'itemTwo next is itemThree');
    assert.equal(itemThree.prev, itemTwo, 'itemThree prev is itemTwo');
    assert.equal(itemThree.next, null, 'itemThree next is null');
  });

  test('#insertBefore null reference item appends the item', function (assert) {
    var list = new _mobiledocKitUtilsLinkedList['default']();
    var item1 = new _mobiledocKitUtilsLinkedItem['default']();
    var item2 = new _mobiledocKitUtilsLinkedItem['default']();
    list.append(item1);
    list.insertBefore(item2, null);

    assert.equal(list.length, 2);
    assert.equal(list.tail, item2, 'item2 is appended');
    assert.equal(list.head, item1, 'item1 is at head');
    assert.equal(item2.prev, item1, 'item2.prev');
    assert.equal(item1.next, item2, 'item1.next');
    assert.equal(item2.next, null);
    assert.equal(item1.prev, null);
  });

  test('#insertAfter a middle item', function (assert) {
    var list = new _mobiledocKitUtilsLinkedList['default']();
    var itemOne = new _mobiledocKitUtilsLinkedItem['default']();
    var itemTwo = new _mobiledocKitUtilsLinkedItem['default']();
    var itemThree = new _mobiledocKitUtilsLinkedItem['default']();
    list.prepend(itemOne);
    list.append(itemThree);
    list.insertAfter(itemTwo, itemOne);

    assert.equal(list.length, 3);
    assert.equal(list.head, itemOne, 'head is itemOne');
    assert.equal(list.tail, itemThree, 'tail is itemThree');
    assert.equal(itemOne.prev, null, 'itemOne prev is null');
    assert.equal(itemOne.next, itemTwo, 'itemOne next is itemTwo');
    assert.equal(itemTwo.prev, itemOne, 'itemTwo prev is itemOne');
    assert.equal(itemTwo.next, itemThree, 'itemTwo next is itemThree');
    assert.equal(itemThree.prev, itemTwo, 'itemThree prev is itemTwo');
    assert.equal(itemThree.next, null, 'itemThree next is null');
  });

  test('#insertAfter null reference item prepends the item', function (assert) {
    var list = new _mobiledocKitUtilsLinkedList['default']();
    var item1 = new _mobiledocKitUtilsLinkedItem['default']();
    var item2 = new _mobiledocKitUtilsLinkedItem['default']();
    list.append(item2);
    list.insertAfter(item1, null);

    assert.equal(list.length, 2);
    assert.equal(list.head, item1, 'item2 is appended');
    assert.equal(list.tail, item2, 'item1 is at tail');
    assert.equal(item1.next, item2, 'item1.next = item2');
    assert.equal(item1.prev, null, 'item1.prev = null');
    assert.equal(item2.prev, item1, 'item2.prev = item1');
    assert.equal(item2.next, null, 'item2.next = null');
  });

  test('#remove an only item', function (assert) {
    var list = new _mobiledocKitUtilsLinkedList['default']();
    var item = new _mobiledocKitUtilsLinkedItem['default']();
    list.append(item);
    list.remove(item);
    assert.equal(list.length, 0, 'length is zero');
    assert.equal(list.isEmpty, true, 'isEmpty is true');
    assert.equal(list.head, null, 'head is null');
    assert.equal(list.tail, null, 'tail is null');
    assert.equal(item.prev, null, 'item prev is null');
    assert.equal(item.next, null, 'item next is null');
  });

  test('#remove calls freeItem', function (assert) {
    var freed = [];
    var list = new _mobiledocKitUtilsLinkedList['default']({
      freeItem: function freeItem(item) {
        freed.push(item);
      }
    });
    var item = new _mobiledocKitUtilsLinkedItem['default']();
    list.append(item);
    list.remove(item);
    assert.deepEqual(freed, [item]);
  });

  test('#remove a first item', function (assert) {
    var list = new _mobiledocKitUtilsLinkedList['default']();
    var itemOne = new _mobiledocKitUtilsLinkedItem['default']();
    var itemTwo = new _mobiledocKitUtilsLinkedItem['default']();
    list.append(itemOne);
    list.append(itemTwo);
    list.remove(itemOne);

    assert.equal(list.length, 1);
    assert.equal(list.head, itemTwo, 'head is itemTwo');
    assert.equal(list.tail, itemTwo, 'tail is itemTwo');
    assert.equal(itemOne.prev, null, 'itemOne prev is null');
    assert.equal(itemOne.next, null, 'itemOne next is null');
    assert.equal(itemTwo.prev, null, 'itemTwo prev is null');
    assert.equal(itemTwo.next, null, 'itemTwo next is null');
  });

  test('#remove a last item', function (assert) {
    var list = new _mobiledocKitUtilsLinkedList['default']();
    var itemOne = new _mobiledocKitUtilsLinkedItem['default']();
    var itemTwo = new _mobiledocKitUtilsLinkedItem['default']();
    list.append(itemOne);
    list.append(itemTwo);
    list.remove(itemTwo);
    assert.equal(list.length, 1);
    assert.equal(list.head, itemOne, 'head is itemOne');
    assert.equal(list.tail, itemOne, 'tail is itemOne');
    assert.equal(itemOne.prev, null, 'itemOne prev is null');
    assert.equal(itemOne.next, null, 'itemOne next is null');
    assert.equal(itemTwo.prev, null, 'itemTwo prev is null');
    assert.equal(itemTwo.next, null, 'itemTwo next is null');
  });

  test('#remove a middle item', function (assert) {
    var list = new _mobiledocKitUtilsLinkedList['default']();
    var itemOne = new _mobiledocKitUtilsLinkedItem['default']();
    var itemTwo = new _mobiledocKitUtilsLinkedItem['default']();
    var itemThree = new _mobiledocKitUtilsLinkedItem['default']();
    list.append(itemOne);
    list.append(itemTwo);
    list.append(itemThree);
    list.remove(itemTwo);

    assert.equal(list.length, 2);
    assert.equal(list.head, itemOne, 'head is itemOne');
    assert.equal(list.tail, itemThree, 'tail is itemThree');
    assert.equal(itemOne.prev, null, 'itemOne prev is null');
    assert.equal(itemOne.next, itemThree, 'itemOne next is itemThree');
    assert.equal(itemTwo.prev, null, 'itemTwo prev is null');
    assert.equal(itemTwo.next, null, 'itemTwo next is null');
    assert.equal(itemThree.prev, itemOne, 'itemThree prev is itemOne');
    assert.equal(itemThree.next, null, 'itemThree next is null');
  });

  test('#remove item that is not in the list is no-op', function (assert) {
    var list = new _mobiledocKitUtilsLinkedList['default']();
    var otherItem = new _mobiledocKitUtilsLinkedItem['default']();

    list.remove(otherItem);
    assert.equal(list.length, 0);
  });

  test('#remove throws if item is in another list', function (assert) {
    var list = new _mobiledocKitUtilsLinkedList['default']();
    var otherList = new _mobiledocKitUtilsLinkedList['default']();
    var otherItem = new _mobiledocKitUtilsLinkedItem['default']();

    otherList.append(otherItem);

    assert.throws(function () {
      return list.remove(otherItem);
    }, /Cannot remove.*other list/);
  });

  test('#forEach iterates many', function (assert) {
    var list = new _mobiledocKitUtilsLinkedList['default']();
    var itemOne = new _mobiledocKitUtilsLinkedItem['default']();
    var itemTwo = new _mobiledocKitUtilsLinkedItem['default']();
    var itemThree = new _mobiledocKitUtilsLinkedItem['default']();
    list.append(itemOne);
    list.append(itemTwo);
    list.append(itemThree);
    var items = [];
    var indexes = [];
    list.forEach(function (item, index) {
      items.push(item);
      indexes.push(index);
    });
    assert.deepEqual(items, [itemOne, itemTwo, itemThree], 'items correct');
    assert.deepEqual(indexes, [0, 1, 2], 'indexes correct');
  });

  test('#forEach iterates one', function (assert) {
    var list = new _mobiledocKitUtilsLinkedList['default']();
    var itemOne = new _mobiledocKitUtilsLinkedItem['default']();
    list.append(itemOne);
    var items = [];
    var indexes = [];
    list.forEach(function (item, index) {
      items.push(item);
      indexes.push(index);
    });
    assert.deepEqual(items, [itemOne], 'items correct');
    assert.deepEqual(indexes, [0], 'indexes correct');
  });

  test('#forEach exits early if item is removed by callback', function (assert) {
    var list = new _mobiledocKitUtilsLinkedList['default']();
    [0, 1, 2].forEach(function (val) {
      var i = new _mobiledocKitUtilsLinkedItem['default']();
      i.value = val;
      list.append(i);
    });

    var iterated = [];
    list.forEach(function (item, index) {
      iterated.push(item.value);
      if (index === 1) {
        list.remove(item); // iteration stops, skipping value 2
      }
    });

    assert.deepEqual(iterated, [0, 1], 'iteration stops when item.next is null');
  });

  test('#readRange walks from start to end', function (assert) {
    var list = new _mobiledocKitUtilsLinkedList['default']();
    var itemOne = new _mobiledocKitUtilsLinkedItem['default']();
    var itemTwo = new _mobiledocKitUtilsLinkedItem['default']();
    var itemThree = new _mobiledocKitUtilsLinkedItem['default']();
    list.append(itemOne);
    list.append(itemTwo);
    list.append(itemThree);
    var items = [];
    var indexes = [];
    list.forEach(function (item, index) {
      items.push(item);
      indexes.push(index);
    });
    assert.deepEqual(list.readRange(itemOne, itemOne), [itemOne], 'items correct');
    assert.deepEqual(list.readRange(itemTwo, itemThree), [itemTwo, itemThree], 'items correct');
    assert.deepEqual(list.readRange(itemOne, itemTwo), [itemOne, itemTwo], 'items correct');
    assert.deepEqual(list.readRange(itemOne, null), [itemOne, itemTwo, itemThree], 'items correct');
  });

  test('#toArray builds array', function (assert) {
    var list = new _mobiledocKitUtilsLinkedList['default']();
    var itemOne = new _mobiledocKitUtilsLinkedItem['default']();
    list.append(itemOne);
    assert.deepEqual(list.toArray(), [itemOne], 'items correct');
  });

  test('#toArray builds many array', function (assert) {
    var list = new _mobiledocKitUtilsLinkedList['default']();
    var itemOne = new _mobiledocKitUtilsLinkedItem['default']();
    var itemTwo = new _mobiledocKitUtilsLinkedItem['default']();
    var itemThree = new _mobiledocKitUtilsLinkedItem['default']();
    list.append(itemOne);
    list.append(itemTwo);
    list.append(itemThree);
    assert.deepEqual(list.toArray(), [itemOne, itemTwo, itemThree], 'items correct');
  });

  test('#detect finds', function (assert) {
    var list = new _mobiledocKitUtilsLinkedList['default']();
    var itemOne = new _mobiledocKitUtilsLinkedItem['default']();
    var itemTwo = new _mobiledocKitUtilsLinkedItem['default']();
    var itemThree = new _mobiledocKitUtilsLinkedItem['default']();
    list.append(itemOne);
    list.append(itemTwo);
    list.append(itemThree);
    assert.equal(list.detect(function (item) {
      return item === itemOne;
    }), itemOne, 'itemOne detected');
    assert.equal(list.detect(function (item) {
      return item === itemTwo;
    }), itemTwo, 'itemTwo detected');
    assert.equal(list.detect(function (item) {
      return item === itemThree;
    }), itemThree, 'itemThree detected');
    assert.equal(list.detect(function () {
      return false;
    }), undefined, 'no item detected');
  });

  test('#objectAt looks up by index', function (assert) {
    var list = new _mobiledocKitUtilsLinkedList['default']();
    var itemOne = new _mobiledocKitUtilsLinkedItem['default']();
    list.append(itemOne);
    assert.equal(list.objectAt(0), itemOne, 'itemOne looked up');

    var itemTwo = new _mobiledocKitUtilsLinkedItem['default']();
    var itemThree = new _mobiledocKitUtilsLinkedItem['default']();
    list.append(itemTwo);
    list.append(itemThree);
    assert.equal(list.objectAt(0), itemOne, 'itemOne looked up');
    assert.equal(list.objectAt(1), itemTwo, 'itemTwo looked up');
    assert.equal(list.objectAt(2), itemThree, 'itemThree looked up');
  });

  test('#splice removes a target and inserts an array of items', function (assert) {
    var list = new _mobiledocKitUtilsLinkedList['default']();
    var itemOne = new _mobiledocKitUtilsLinkedItem['default']();
    var itemTwo = new _mobiledocKitUtilsLinkedItem['default']();
    var itemThree = new _mobiledocKitUtilsLinkedItem['default']();
    list.append(itemOne);
    list.append(itemThree);

    list.splice(itemOne, 1, [itemTwo]);

    assert.equal(list.head, itemTwo, 'itemOne is head');
    assert.equal(list.objectAt(1), itemThree, 'itemThree is present');
  });

  test('#splice remove nothing and inserts an array of nothing', function (assert) {
    var list = new _mobiledocKitUtilsLinkedList['default']();
    var itemOne = new _mobiledocKitUtilsLinkedItem['default']();
    var itemTwo = new _mobiledocKitUtilsLinkedItem['default']();
    list.append(itemOne);
    list.append(itemTwo);

    list.splice(itemTwo, 0, []);

    assert.equal(list.head, itemOne, 'itemOne is head');
    assert.equal(list.objectAt(1), itemTwo, 'itemTwo is present');
  });

  test('#splice can reorganize items', function (assert) {
    var list = new _mobiledocKitUtilsLinkedList['default']();
    var itemOne = new _mobiledocKitUtilsLinkedItem['default']();
    var itemTwo = new _mobiledocKitUtilsLinkedItem['default']();
    var itemThree = new _mobiledocKitUtilsLinkedItem['default']();
    list.append(itemOne);
    list.append(itemTwo);
    list.append(itemThree);

    list.splice(itemOne, 3, [itemThree, itemOne, itemTwo]);

    assert.equal(list.head, itemThree, 'itemThree is head');
    assert.equal(list.objectAt(1), itemOne, 'itemOne is present');
    assert.equal(list.objectAt(2), itemTwo, 'itemTwo is present');
  });

  test('#removeBy mutates list when item is in middle', function (assert) {
    var list = new _mobiledocKitUtilsLinkedList['default']();
    var items = [new _mobiledocKitUtilsLinkedItem['default'](), new _mobiledocKitUtilsLinkedItem['default'](), new _mobiledocKitUtilsLinkedItem['default'](), new _mobiledocKitUtilsLinkedItem['default']()];
    items[1].shouldRemove = true;
    items.forEach(function (i) {
      return list.append(i);
    });

    assert.equal(list.length, 4);
    list.removeBy(function (i) {
      return i.shouldRemove;
    });
    assert.equal(list.length, 3);
    assert.equal(list.head, items[0]);
    assert.equal(list.objectAt(1), items[2]);
    assert.equal(list.objectAt(2), items[3]);
    assert.equal(list.tail, items[3]);
  });

  test('#removeBy mutates list when item is first', function (assert) {
    var list = new _mobiledocKitUtilsLinkedList['default']();
    var items = [new _mobiledocKitUtilsLinkedItem['default'](), new _mobiledocKitUtilsLinkedItem['default'](), new _mobiledocKitUtilsLinkedItem['default'](), new _mobiledocKitUtilsLinkedItem['default']()];
    items[0].shouldRemove = true;
    items.forEach(function (i) {
      return list.append(i);
    });

    assert.equal(list.length, 4);
    list.removeBy(function (i) {
      return i.shouldRemove;
    });
    assert.equal(list.length, 3);
    assert.equal(list.head, items[1]);
    assert.equal(list.objectAt(1), items[2]);
    assert.equal(list.tail, items[3]);
  });

  test('#removeBy mutates list when item is last', function (assert) {
    var list = new _mobiledocKitUtilsLinkedList['default']();
    var items = [new _mobiledocKitUtilsLinkedItem['default'](), new _mobiledocKitUtilsLinkedItem['default'](), new _mobiledocKitUtilsLinkedItem['default'](), new _mobiledocKitUtilsLinkedItem['default']()];
    items[3].shouldRemove = true;
    items.forEach(function (i) {
      return list.append(i);
    });

    assert.equal(list.length, 4);
    list.removeBy(function (i) {
      return i.shouldRemove;
    });
    assert.equal(list.length, 3);
    assert.equal(list.head, items[0]);
    assert.equal(list.objectAt(1), items[1]);
    assert.equal(list.tail, items[2]);
  });

  test('#removeBy calls `freeItem` for each item removed', function (assert) {
    var freed = [];

    var list = new _mobiledocKitUtilsLinkedList['default']({
      freeItem: function freeItem(item) {
        freed.push(item);
      }
    });

    var items = [new _mobiledocKitUtilsLinkedItem['default'](), new _mobiledocKitUtilsLinkedItem['default'](), new _mobiledocKitUtilsLinkedItem['default']()];
    items[0].name = '0';
    items[1].name = '1';
    items[2].name = '2';

    items[0].shouldRemove = true;
    items[1].shouldRemove = true;

    items.forEach(function (i) {
      return list.append(i);
    });

    list.removeBy(function (i) {
      return i.shouldRemove;
    });

    assert.deepEqual(freed, [items[0], items[1]]);
  });

  test('#every', function (assert) {
    var list = new _mobiledocKitUtilsLinkedList['default']();
    [2, 3, 4].forEach(function (n) {
      return list.append({ val: n });
    });

    assert.ok(list.every(function (i) {
      return i.val > 0;
    }), '> 0');
    assert.ok(!list.every(function (i) {
      return i.val % 2 === 0;
    }), 'even');
  });
});
define('tests/unit/utils/selection-utils-test', ['exports', 'mobiledoc-kit/utils/selection-utils', 'mobiledoc-kit/utils/key'], function (exports, _mobiledocKitUtilsSelectionUtils, _mobiledocKitUtilsKey) {
  'use strict';

  var _QUnit = QUnit;
  var _module = _QUnit.module;
  var test = _QUnit.test;

  _module('Unit: Utils: Selection Utils');

  test('#comparePosition returns the forward direction of selection', function (assert) {
    var div = document.createElement('div');
    div.innerHTML = 'Howdy';
    var selection = {
      anchorNode: div,
      anchorOffset: 0,
      focusNode: div,
      focusOffset: 1
    };
    var result = (0, _mobiledocKitUtilsSelectionUtils.comparePosition)(selection);
    assert.equal(_mobiledocKitUtilsKey.DIRECTION.FORWARD, result.direction);
  });

  test('#comparePosition returns the backward direction of selection', function (assert) {
    var div = document.createElement('div');
    div.innerHTML = 'Howdy';
    var selection = {
      anchorNode: div,
      anchorOffset: 1,
      focusNode: div,
      focusOffset: 0
    };
    var result = (0, _mobiledocKitUtilsSelectionUtils.comparePosition)(selection);
    assert.equal(_mobiledocKitUtilsKey.DIRECTION.BACKWARD, result.direction);
  });

  test('#comparePosition returns the direction of selection across nodes', function (assert) {
    var div = document.createElement('div');
    div.innerHTML = '<span>Howdy</span> <span>Friend</span>';
    var selection = {
      anchorNode: div.childNodes[0],
      anchorOffset: 1,
      focusNode: div.childNodes[2],
      focusOffset: 0
    };
    var result = (0, _mobiledocKitUtilsSelectionUtils.comparePosition)(selection);
    assert.equal(_mobiledocKitUtilsKey.DIRECTION.FORWARD, result.direction);
  });

  test('#comparePosition returns the backward direction of selection across nodes', function (assert) {
    var div = document.createElement('div');
    div.innerHTML = '<span>Howdy</span> <span>Friend</span>';
    var selection = {
      anchorNode: div.childNodes[2],
      anchorOffset: 1,
      focusNode: div.childNodes[1],
      focusOffset: 0
    };
    var result = (0, _mobiledocKitUtilsSelectionUtils.comparePosition)(selection);
    assert.equal(_mobiledocKitUtilsKey.DIRECTION.BACKWARD, result.direction);
  });

  test('#comparePosition returns the direction of selection with nested nodes', function (assert) {
    var div = document.createElement('div');
    div.innerHTML = '<span>Howdy</span> <span>Friend</span>';
    var selection = {
      anchorNode: div,
      anchorOffset: 1,
      focusNode: div.childNodes[1],
      focusOffset: 1
    };
    var result = (0, _mobiledocKitUtilsSelectionUtils.comparePosition)(selection);
    assert.equal(_mobiledocKitUtilsKey.DIRECTION.FORWARD, result.direction);
  });

  test('#comparePosition returns the backward direction of selection with nested nodes', function (assert) {
    var div = document.createElement('div');
    div.innerHTML = '<span>Howdy</span> <span>Friend</span>';
    var selection = {
      anchorNode: div.childNodes[2],
      anchorOffset: 1,
      focusNode: div,
      focusOffset: 2
    };
    var result = (0, _mobiledocKitUtilsSelectionUtils.comparePosition)(selection);
    assert.equal(_mobiledocKitUtilsKey.DIRECTION.BACKWARD, result.direction);
  });
});