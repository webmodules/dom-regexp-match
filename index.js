
/**
 * Module dependencies
 */

var RangeAtIndex = require('range-at-index');
var escapeRegexp = require('escape-string-regexp');

/**
 * Module exports.
 */

module.exports = match;

/**
 * Initialize `match`
 *
 * @param {Element} el
 * @param {String|Regex} regexp
 * @param {Function} fn
 */

function match (el, regexp, fn) {
  var m, range;
  var text = el.textContent;

  // "string" support
  regexp = regexp.source ? regexp : new RegExp(escapeRegexp(regexp));

  while (m = regexp.exec(text)) {
    var index = m.index;
    var offset = m.index + m[0].length;

    range = RangeAtIndex(el, index, offset);

    // invoke fn
    var before = range.toString();
    fn.call(el, m, range);

    // if the RegExp doesn't have the "global" flag then bail,
    // to avoid an infinite loop
    if (!regexp.global) break;

    // modify `lastIndex` in case the contents of
    // the Range changed during the `fn` call
    var diff = range.toString().length - before.length;
    if (diff !== 0) {
      regexp.lastIndex += diff;
      text = el.textContent;
    }
  }

  return el;
}
