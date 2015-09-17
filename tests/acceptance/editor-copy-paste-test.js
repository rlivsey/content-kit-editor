import { Editor } from 'content-kit-editor';
import Helpers from '../test-helpers';

const { test, module } = Helpers;

let editor, editorElement;

module('Acceptance: editor: basic', {
  beforeEach() {
    editorElement = $('<div id="editor"></div>').appendTo('#qunit-fixture')[0];
  },
  afterEach() {
    if (editor) { editor.destroy(); }
  }
});

test('simple copy-paste at end of section works', (assert) => {
  const mobiledoc = Helpers.mobiledoc.build(({post, markupSection, marker}) => {
    return post([markupSection('p', [marker('abc')])]);
  });
  editor = new Editor({mobiledoc});
  editor.render(editorElement);

  Helpers.dom.selectText('abc', editorElement);
  Helpers.dom.triggerCopyEvent(editor);

  let textNode = $('#editor p')[0].childNodes[0];
  assert.equal(textNode.textContent, 'abc'); //precond
  Helpers.dom.moveCursorTo(textNode, textNode.length);

  Helpers.dom.triggerPasteEvent(editor);

  assert.hasElement('#editor p:contains(abcabc)', 'pastes the text');
});

test('simple copy-paste with markup at end of section works', (assert) => {
  const mobiledoc = Helpers.mobiledoc.build(({post, markupSection, marker, markup}) => {
    return post([markupSection('p', [
      marker('a', [markup('strong')]),
      marker('bc')
    ])]);
  });
  editor = new Editor({mobiledoc});
  editor.render(editorElement);

  Helpers.dom.selectText('a', editorElement, 'b', editorElement);
  Helpers.dom.triggerCopyEvent(editor);

  let textNode = $('#editor p')[0].childNodes[1];
  assert.equal(textNode.textContent, 'bc'); //precond
  Helpers.dom.moveCursorTo(textNode, textNode.length);

  Helpers.dom.triggerPasteEvent(editor);

  assert.hasElement('#editor p:contains(abcab)', 'pastes the text');
  assert.equal($('#editor p strong:contains(a)').length, 2, 'two bold As');
});

test('simple copy-paste in middle of section works', (assert) => {
   const mobiledoc = Helpers.mobiledoc.build(({post, markupSection, marker}) => {
    return post([markupSection('p', [marker('abcd')])]);
  });
  editor = new Editor({mobiledoc});
  editor.render(editorElement);

  Helpers.dom.selectText('c', editorElement);
  Helpers.dom.triggerCopyEvent(editor);

  let textNode = $('#editor p')[0].childNodes[0];
  assert.equal(textNode.textContent, 'abcd'); //precond
  Helpers.dom.moveCursorTo(textNode, 1);

  Helpers.dom.triggerPasteEvent(editor);

  assert.hasElement('#editor p:contains(acbcd)', 'pastes the text');
  Helpers.dom.insertText(editor, 'X');
  assert.hasElement('#editor p:contains(acXbcd)', 'inserts text in right spot');
});

test('simple copy-paste at start of section works', (assert) => {
  const mobiledoc = Helpers.mobiledoc.build(({post, markupSection, marker}) => {
    return post([markupSection('p', [marker('abcd')])]);
  });
  editor = new Editor({mobiledoc});
  editor.render(editorElement);

  Helpers.dom.selectText('c', editorElement);
  Helpers.dom.triggerCopyEvent(editor);

  let textNode = $('#editor p')[0].childNodes[0];
  assert.equal(textNode.textContent, 'abcd'); //precond
  Helpers.dom.moveCursorTo(textNode, 0);

  Helpers.dom.triggerPasteEvent(editor);

  assert.hasElement('#editor p:contains(cabcd)', 'pastes the text');
  Helpers.dom.insertText(editor, 'X');
  assert.hasElement('#editor p:contains(cXabcd)', 'inserts text in right spot');
 
});
