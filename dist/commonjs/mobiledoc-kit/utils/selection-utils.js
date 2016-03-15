'use strict';

var _utilsKey = require('../utils/key');

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
        direction = _utilsKey.DIRECTION.FORWARD;
      } else if (position & Node.DOCUMENT_POSITION_PRECEDING) {
        headNode = focusNode;tailNode = anchorNode;
        headOffset = focusOffset;tailOffset = anchorOffset;
        direction = _utilsKey.DIRECTION.BACKWARD;
      } else {
        // same node
        headNode = tailNode = anchorNode;
        headOffset = anchorOffset;
        tailOffset = focusOffset;
        if (tailOffset < headOffset) {
          // Swap the offset order
          headOffset = focusOffset;
          tailOffset = anchorOffset;
          direction = _utilsKey.DIRECTION.BACKWARD;
        } else if (headOffset < tailOffset) {
          direction = _utilsKey.DIRECTION.FORWARD;
        } else {
          direction = null;
        }
      }

    return { headNode: headNode, headOffset: headOffset, tailNode: tailNode, tailOffset: tailOffset, direction: direction };
  }
}

exports.clearSelection = clearSelection;
exports.comparePosition = comparePosition;