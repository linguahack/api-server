'use strict';

var chai = require('chai');
var opensubtitles = require('../parsers/opensubtitles');
var hasher = require('../parsers/opensubtitles.hasher');

var assert = chai.assert, expect = chai.expect;

describe.only('opensubtitles', function() {

  var parser = new opensubtitles.Parser();

  it('should get server info', function() {
    return parser.getServerInfo();
  })

  it('should login', function() {
    // return parser.login()
    // .then(function(result) {
    //   console.log(result);
    // })
  })

  it('should search', function() {
    return parser.search()
    .then(function(result) {
      console.log(result);
    })
  })
});

describe('hash', function() {

  it('should hash', function() {
    return hasher.Hash("http://www.opensubtitles.org/addons/avi/breakdance.avi")
    .then(function(result) {
      assert.equal(result.size, '12909756');
      assert.equal(result.hash, '8e245d9679d31e12');
    })
  })
})