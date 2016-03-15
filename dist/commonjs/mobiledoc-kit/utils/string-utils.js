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