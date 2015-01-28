
/**
 * Module dependencies
 */

var DomIterator = require('dom-iterator');
var getDocument = require('get-document');
var escapeRegexp = require('escape-string-regexp');

/**
 * Module exports.
 */

module.exports = match;

/**
 * Initialize `match`
 *
 * @param {Element} parent
 * @param {String|Regex} regexp
 * @param {String|Element|Function} fn
 */

function match (parent, regexp, fn) {
  var m;
  var range;
  var doc = getDocument(parent);
  var text = parent.textContent;

  // "string" support
  regexp = regexp.source ? regexp : new RegExp(escapeRegexp(regexp));

  while (m = regexp.exec(parent.textContent)) {
    var it = new DomIterator(parent.firstChild, parent)
      .select(3 /* text node */)
      .revisit(false);

    var index = m.index;
    var offset = m.index + m[0].length;
    var node = it.node;
    var start = {};
    var end = {};
    var val, len;

    // ensure node is a textnode
    //
    // TODO: figure out a better way to do this
    // within dom-iterator
    node = 3 == node.nodeType ? node : it.next();

    while (node) {
      val = node.nodeValue;
      len = val.length;

      if (!start.node && len > index) {
        start.node = node;
        start.offset = index;
      }

      if (!end.node && len >= offset) {
        end.node = node;
        end.offset = offset;
      }

      index -= len;
      offset -= len;
      node = it.next();
    }

    // create the range from the start and end offsets
    range = doc.createRange();
    range.setStart(start.node, start.offset);
    range.setEnd(end.node, end.offset);

    // invoke fn
    var before = range.toString();
    fn.call(parent, m, range);

    // if the RegExp doesn't have the "global" flag then bail,
    // to avoid an infinite loop
    if (!regexp.global) break;

    // modify `lastIndex` in case the contents of
    // the Range changed during the `fn` call
    var diff = range.toString().length - before.length;
    if (diff !== 0) {
      regexp.lastIndex += diff;
      text = parent.textContent;
    }
  }

  return parent;
}
