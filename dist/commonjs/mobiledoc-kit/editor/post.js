'use strict';

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _utilsCursorPosition = require('../utils/cursor/position');

var _utilsArrayUtils = require('../utils/array-utils');

var _utilsKey = require('../utils/key');

var _utilsLifecycleCallbacks = require('../utils/lifecycle-callbacks');

var _utilsMixin = require('../utils/mixin');

var _utilsAssert = require('../utils/assert');

var _utilsDomUtils = require('../utils/dom-utils');

var _utilsCursorRange = require('../utils/cursor/range');

var _postPostInserter = require('./post/post-inserter');

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
        return new _utilsCursorPosition['default'](section, headSectionOffset);
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

      return new _utilsCursorPosition['default'](section, headSectionOffset);
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

      (0, _utilsArrayUtils.forEach)((0, _utilsArrayUtils.filter)(section.markers, function (m) {
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
      (0, _utilsArrayUtils.forEach)(post.sections, function (section) {
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

      (0, _utilsArrayUtils.forEach)(groups, function (group) {
        var list = group[0];
        (0, _utilsArrayUtils.forEach)(group, function (listSection) {
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
        this.setRange(new _utilsCursorRange['default'](updatedHead, updatedHead, range.direction));
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
      var direction = arguments.length <= 1 || arguments[1] === undefined ? _utilsKey.DIRECTION.BACKWARD : arguments[1];

      if (direction === _utilsKey.DIRECTION.BACKWARD) {
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

      (0, _utilsAssert['default'])('Cannot join non-markerable section to previous section', section.isMarkerable);

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

      (0, _utilsAssert['default'])('Cannot join non-markerable section to next section', section.isMarkerable);

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

      var nextPosition = new _utilsCursorPosition['default'](section, section.offsetOfMarker(marker, offset));

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

      (0, _utilsAssert['default'])('Cards section must be split at offset 0 or 1', offset === 0 || offset === 1);

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

      (0, _utilsAssert['default'])('Cannot insert markers at non-markerable position', section.isMarkerable);

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

      var nextPosition = new _utilsCursorPosition['default'](position.section, offset);
      this.setRange(new _utilsCursorRange['default'](nextPosition));
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

      sectionTagName = (0, _utilsDomUtils.normalizeTagName)(sectionTagName);
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
        nextRange = new _utilsCursorRange['default'](firstChanged.headPosition());
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
      (0, _utilsAssert['default'])('Cannot pass non-markerable section to `changeSectionTagName`', section.isMarkerable);

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

      (0, _utilsAssert['default'])('Cannot split list item at position that does not include item', item === section);

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

      (0, _utilsAssert['default'])('Cannot split list at position not in list', position.section.parent === list);

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
      (0, _utilsAssert['default'])('Cannot split list at item that is not present in the list', found);

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
      (0, _utilsAssert['default'])('Must pass list item to `_changeSectionFromListItem`', section.isListItem);

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
      var inserter = new _postPostInserter['default'](this, post);
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
      (0, _utilsAssert['default'])('Work can only be scheduled before a post edit has completed', !this._didComplete);
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
      (0, _utilsAssert['default'])('Post editing can only be completed once', !this._didComplete);

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

(0, _utilsMixin['default'])(PostEditor, _utilsLifecycleCallbacks['default']);

exports['default'] = PostEditor;