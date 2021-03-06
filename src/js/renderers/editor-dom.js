import CardNode from 'content-kit-editor/models/card-node';
import { detect } from 'content-kit-editor/utils/array-utils';
import {
  POST_TYPE,
  MARKUP_SECTION_TYPE,
  LIST_SECTION_TYPE,
  LIST_ITEM_TYPE,
  MARKER_TYPE,
  IMAGE_SECTION_TYPE,
  CARD_TYPE
} from '../models/types';
import { startsWith, endsWith } from '../utils/string-utils';
import { addClassName } from '../utils/dom-utils';
import { MARKUP_SECTION_ELEMENT_NAMES } from '../models/markup-section';

export const NO_BREAK_SPACE = '\u00A0';
export const SPACE = ' ';

function createElementFromMarkup(doc, markup) {
  var element = doc.createElement(markup.tagName);
  Object.keys(markup.attributes).forEach(k => {
    element.setAttribute(k, markup.attributes[k]);
  });
  return element;
}

// ascends from element upward, returning the last parent node that is not
// parentElement
function penultimateParentOf(element, parentElement) {
  while (parentElement &&
         element.parentNode !== parentElement &&
         element.parentNode !== document.body // ensure the while loop stops
        ) {
    element = element.parentNode;
  }
  return element;
}

function renderMarkupSection(section) {
  let element;
  if (MARKUP_SECTION_ELEMENT_NAMES.indexOf(section.tagName) !== -1) {
    element = document.createElement(section.tagName);
  } else {
    element = document.createElement('div');
    addClassName(element, section.tagName);
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

function renderCard() {
  const element = document.createElement('div');
  element.contentEditable = false;
  addClassName(element, 'ck-card');
  return element;
}

function getNextMarkerElement(renderNode) {
  let element = renderNode.element.parentNode;
  let marker = renderNode.postNode;
  let closedCount = marker.closedMarkups.length;

  while (closedCount--) {
    element = element.parentNode;
  }
  return element;
}

function renderMarker(marker, element, previousRenderNode) {
  let text = marker.value;

  // If the first marker has a leading space or the last marker has a
  // trailing space, the browser will collapse the space when we position
  // the cursor.
  // See https://github.com/bustlelabs/content-kit-editor/issues/68
  //   and https://github.com/bustlelabs/content-kit-editor/issues/75
  if (!marker.next && endsWith(text, SPACE)) {
    text = text.substr(0, text.length - 1) + NO_BREAK_SPACE;
  } else if (!marker.prev && startsWith(text, SPACE)) {
    text = NO_BREAK_SPACE + text.substr(1);
  }

  let textNode = document.createTextNode(text);
  let currentElement = textNode;
  let markup;

  const openTypes = marker.openedMarkups;
  for (let j=openTypes.length-1;j>=0;j--) {
    markup = openTypes[j];
    let openedElement = createElementFromMarkup(document, markup);
    openedElement.appendChild(currentElement);
    currentElement = openedElement;
  }

  if (previousRenderNode) {
    let previousSibling = previousRenderNode.element;
    let previousSiblingPenultimate = penultimateParentOf(previousSibling, element);
    element.insertBefore(currentElement, previousSiblingPenultimate.nextSibling);
  } else {
    element.insertBefore(currentElement, element.firstChild);
  }

  return textNode;
}

function attachRenderNodeElementToDOM(renderNode, originalElement) {
  const element = renderNode.element;
  const hasRendered = !!originalElement;

  if (hasRendered) {
    let parentElement = renderNode.parent.element;
    parentElement.replaceChild(element, originalElement);
  } else {
    let parentElement, nextSiblingElement;
    if (renderNode.prev) {
      let previousElement = renderNode.prev.element;
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
  const parent = renderNode.parent.postNode;
  parent.sections.remove(section);
}

function removeRenderNodeElementFromParent(renderNode) {
  if (renderNode.element.parentNode) {
    renderNode.element.parentNode.removeChild(renderNode.element);
  }
}

class Visitor {
  constructor(editor, cards, unknownCardHandler, options) {
    this.editor = editor;
    this.cards = cards;
    this.unknownCardHandler = unknownCardHandler;
    this.options = options;
  }

  [POST_TYPE](renderNode, post, visit) {
    if (!renderNode.element) {
      renderNode.element = document.createElement('div');
    }
    visit(renderNode, post.sections);
  }

  [MARKUP_SECTION_TYPE](renderNode, section, visit) {
    const originalElement = renderNode.element;

    // Always rerender the section -- its tag name or attributes may have changed.
    // TODO make this smarter, only rerendering and replacing the element when necessary
    renderNode.element = renderMarkupSection(section);
    attachRenderNodeElementToDOM(renderNode, originalElement);

    if (section.isBlank) {
      renderNode.element.appendChild(renderCursorPlaceholder());
    } else {
      const visitAll = true;
      visit(renderNode, section.markers, visitAll);
    }
  }

  [LIST_SECTION_TYPE](renderNode, section, visit) {
    const originalElement = renderNode.element;

    renderNode.element = renderListSection(section);
    attachRenderNodeElementToDOM(renderNode, originalElement);

    const visitAll = true;
    visit(renderNode, section.items, visitAll);
  }

  [LIST_ITEM_TYPE](renderNode, item, visit) {
    // FIXME do we need to do anything special for rerenders?
    renderNode.element = renderListItem();
    attachRenderNodeElementToDOM(renderNode, null);

    if (item.isBlank) {
      renderNode.element.appendChild(renderCursorPlaceholder());
    } else {
      const visitAll = true;
      visit(renderNode, item.markers, visitAll);
    }
  }

  [MARKER_TYPE](renderNode, marker) {
    let parentElement;

    if (renderNode.prev) {
      parentElement = getNextMarkerElement(renderNode.prev);
    } else {
      parentElement = renderNode.parent.element;
    }

    renderNode.element = renderMarker(marker, parentElement, renderNode.prev);
  }

  [IMAGE_SECTION_TYPE](renderNode, section) {
    if (renderNode.element) {
      if (renderNode.element.src !== section.src) {
        renderNode.element.src = section.src;
      }
    } else {
      let element = document.createElement('img');
      element.src = section.src;
      if (renderNode.prev) {
        let previousElement = renderNode.prev.element;
        let nextElement = previousElement.nextSibling;
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

  [CARD_TYPE](renderNode, section) {
    const originalElement = renderNode.element;
    const {editor, options} = this;
    const card = detect(this.cards, card => card.name === section.name);

    renderNode.element = renderCard();
    attachRenderNodeElementToDOM(renderNode, originalElement);

    if (card) {
      const cardNode = new CardNode(
        editor, card, section, renderNode.element, options);
      renderNode.cardNode = cardNode;
      cardNode.display();
    } else {
      const env = { name: section.name };
      this.unknownCardHandler(
        renderNode.element, options, env, section.payload);
    }
  }
}

let destroyHooks = {
  [POST_TYPE](/*renderNode, post*/) {
    throw new Error('post destruction is not supported by the renderer');
  },

  [MARKUP_SECTION_TYPE](renderNode, section) {
    removeRenderNodeSectionFromParent(renderNode, section);
    removeRenderNodeElementFromParent(renderNode);
  },

  [LIST_SECTION_TYPE](renderNode, section) {
    removeRenderNodeSectionFromParent(renderNode, section);
    removeRenderNodeElementFromParent(renderNode);
  },

  [LIST_ITEM_TYPE](renderNode, li) {
    removeRenderNodeSectionFromParent(renderNode, li);
    removeRenderNodeElementFromParent(renderNode);
  },

  [MARKER_TYPE](renderNode, marker) {
    // FIXME before we render marker, should delete previous renderNode's element
    // and up until the next marker element

    let element = renderNode.element;
    let nextMarkerElement = getNextMarkerElement(renderNode);
    while (element.parentNode && element.parentNode !== nextMarkerElement) {
      element = element.parentNode;
    }

    if (marker.section) {
      marker.section.markers.remove(marker);
    }

    if (element.parentNode) {
      // if no parentNode, the browser already removed this element
      element.parentNode.removeChild(element);
    }
  },

  [IMAGE_SECTION_TYPE](renderNode, section) {
    removeRenderNodeSectionFromParent(renderNode, section);
    removeRenderNodeElementFromParent(renderNode);
  },

  [CARD_TYPE](renderNode, section) {
    if (renderNode.cardNode) {
      renderNode.cardNode.teardown();
    }
    removeRenderNodeSectionFromParent(renderNode, section);
    removeRenderNodeElementFromParent(renderNode);
  }
};

// removes children from parentNode (a RenderNode) that are scheduled for removal
function removeDestroyedChildren(parentNode, forceRemoval=false) {
  let child = parentNode.childNodes.head;
  let nextChild, method;
  while (child) {
    nextChild = child.next;
    if (child.isRemoved || forceRemoval) {
      removeDestroyedChildren(child, true);
      method = child.postNode.type;
      if (!destroyHooks[method]) {
        throw new Error(`editor-dom cannot destroy "${method}"`);
      }
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
    const renderNode = renderTree.buildRenderNode(postNode);
    parentNode.childNodes.insertAfter(renderNode, previousNode);
    return renderNode;
  }
}

export default class Renderer {
  constructor(editor, cards, unknownCardHandler, options) {
    this.editor = editor;
    this.visitor = new Visitor(editor, cards, unknownCardHandler, options);
    this.nodes = [];
  }

  visit(renderTree, parentNode, postNodes, visitAll=false) {
    let previousNode;
    postNodes.forEach(postNode => {
      let node = lookupNode(renderTree, parentNode, postNode, previousNode);
      if (node.isDirty || visitAll) {
        this.nodes.push(node);
      }
      previousNode = node;
    });
  }

  render(renderTree) {
    let renderNode = renderTree.rootNode;
    let method, postNode;

    while (renderNode) {
      removeDestroyedChildren(renderNode);
      postNode = renderNode.postNode;

      method = postNode.type;
      if (!this.visitor[method]) {
        throw new Error(`EditorDom visitor cannot handle type ${method}`);
      }
      this.visitor[method](renderNode, postNode,
                           (...args) => this.visit(renderTree, ...args));
      renderNode.markClean();
      renderNode = this.nodes.shift();
    }
  }
}
