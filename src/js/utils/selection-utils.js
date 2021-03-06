import { containsNode } from './dom-utils';

function clearSelection() {
  // FIXME-IE ensure this works on IE 9. It works on IE10.
  window.getSelection().removeAllRanges();
}

function comparePosition(selection) {
  let { anchorNode, focusNode, anchorOffset, focusOffset } = selection;
  let headNode, tailNode, headOffset, tailOffset;

  const position = anchorNode.compareDocumentPosition(focusNode);

  if (position & Node.DOCUMENT_POSITION_FOLLOWING) {
    headNode = anchorNode; tailNode = focusNode;
    headOffset = anchorOffset; tailOffset = focusOffset;
  } else if (position & Node.DOCUMENT_POSITION_PRECEDING) {
    headNode = focusNode; tailNode = anchorNode;
    headOffset = focusOffset; tailOffset = anchorOffset;
  } else { // same node
    headNode = anchorNode;
    tailNode = focusNode;
    headOffset = Math.min(anchorOffset, focusOffset);
    tailOffset = Math.max(anchorOffset, focusOffset);
  }

  return {headNode, headOffset, tailNode, tailOffset};
}

function restoreRange(range) {
  clearSelection();
  var selection = window.getSelection();
  selection.addRange(range);
}

export {
  restoreRange,
  containsNode,
  clearSelection,
  comparePosition
};
