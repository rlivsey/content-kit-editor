'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _utilsDomUtils = require('../../utils/dom-utils');

var _utilsKey = require('../../utils/key');

var _utilsAssert = require('../../utils/assert');

var _modelsMarker = require('../../models/marker');

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
    (0, _utilsAssert['default'])('findOffsetInSection must be called with markerable or card section', section.isCardSection);

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

    (0, _utilsAssert['default'])('Position must have a section that is addressable by the cursor', section && section.isLeafSection);
    (0, _utilsAssert['default'])('Position must have numeric offset', offset !== null && offset !== undefined);

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
        case _utilsKey.DIRECTION.BACKWARD:
          return this.moveLeft();
        case _utilsKey.DIRECTION.FORWARD:
          return this.moveRight();
        default:
          (0, _utilsAssert['default'])('Must pass a valid direction to Position.move', false);
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
          if (code >= _modelsMarker.LOW_SURROGATE_RANGE[0] && code <= _modelsMarker.LOW_SURROGATE_RANGE[1]) {
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
          if (code >= _modelsMarker.HIGH_SURROGATE_RANGE[0] && code <= _modelsMarker.HIGH_SURROGATE_RANGE[1]) {
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
      (0, _utilsAssert['default'])('Cannot get markerPosition without a section', !!this.section);
      (0, _utilsAssert['default'])('cannot get markerPosition of a non-markerable', !!this.section.isMarkerable);
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
      if ((0, _utilsDomUtils.isTextNode)(node)) {
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

        (0, _utilsAssert['default'])('Could not find parent section for mapped text node "' + textNode.textContent + '"', !!section);
        offsetInSection = section.offsetOfMarker(marker, offsetInNode);
      } else {
        // all text nodes should be rendered by markers except:
        //   * text nodes inside cards
        //   * text nodes created by the browser during text input
        // both of these should have rendered parent sections, though
        section = findParentSectionFromNode(renderTree, textNode);
        (0, _utilsAssert['default'])('Could not find parent section for un-mapped text node "' + textNode.textContent + '"', !!section);

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
        (0, _utilsAssert['default'])('Could not find parent section from element node', !!section);

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