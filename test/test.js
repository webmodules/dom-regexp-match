
var match = require('../');
var assert = require('assert');

describe('dom-regexp-match', function () {

  it('should match /foo/ in a DIV', function () {
    var el = document.createElement('div');
    var count = 0;
    el.innerHTML = 'foo bar foo';

    assert.equal(0, count);
    match(el, /foo/, function (m, range) {
      assert.equal('foo', range.toString());
      count++;
    });
    assert.equal(1, count);
  });

  it('should match /foo/g in a DIV', function () {
    var el = document.createElement('div');
    var count = 0;
    el.innerHTML = 'foo bar foo';

    assert.equal(0, count);
    match(el, /foo/g, function (m, range) {
      assert.equal('foo', range.toString());
      count++;
    });
    assert.equal(2, count);
  });

  it('should match /[ab]/g in a DIV', function () {
    var el = document.createElement('div');
    var count = 0;
    el.innerHTML = 'abracadabra';

    assert.equal(0, count);
    match(el, /[ab]/g, function (m, range) {
      switch (count) {
        case 0:
        case 2:
        case 3:
        case 4:
        case 6:
          assert.equal('a', range.toString());
          break;
        default:
          assert.equal('b', range.toString());
          break;
      }
      count++;
    });
    assert.equal(7, count);
  });

  it('should match /foo/ in a DIV with B and I child nodes', function () {
    var el = document.createElement('div');
    var count = 0;
    el.innerHTML = '<b>f</b>o<i>o</i>';

    assert.equal(0, count);
    match(el, /foo/, function (m, range) {
      assert.equal('B', range.startContainer.parentNode.nodeName);
      assert.equal('I', range.endContainer.parentNode.nodeName);
      count++;
    });
    assert.equal(1, count);
  });

  it('should match /foo/ in a DIV with B and I child nodes', function () {
    var el = document.createElement('div');
    var count = 0;
    el.innerHTML = 'foo foo foo';

    assert.equal(0, count);
    match(el, /foo/g, function (m, range) {
      console.log(m);
      count++;
      assert.equal('foo', range.toString());
      range.deleteContents();
      range.insertNode(document.createTextNode(String(count)));
    });
    assert.equal('1 2 3', el.innerHTML);
    assert.equal(3, count);
  });

  // "string" support
  it('should match "foo" in a DIV', function () {
    var el = document.createElement('div');
    var count = 0;
    el.innerHTML = 'f\\o bar f\\o';

    assert.equal(0, count);
    match(el, 'f\\o', function (m, range) {
      assert.equal('f\\o', range.toString());
      count++;
    });
    assert.equal(1, count);
  });

  it('should match "foo" in a DIV with immediate replacement', function () {
    var el = document.createElement('div');
    var count = 0;
    el.innerHTML = 'foo foo foo';

    assert.equal(0, count);
    match(el, 'foo', function (m, range) {
      count++;
      assert.equal('foo', range.toString());
      range.deleteContents();
      range.insertNode(document.createTextNode(String(count)));
    });
    assert.equal('1 foo foo', el.innerHTML);
    assert.equal(1, count);
  });

});
