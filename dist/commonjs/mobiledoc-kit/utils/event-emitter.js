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