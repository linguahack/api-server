'use strict';

var chai = require('chai');
var opensubtitles = require('../parsers/opensubtitles');
var hasher = require('../parsers/hasher');

var assert = chai.assert, expect = chai.expect;

describe('opensubtitles', function() {

  var parser = new opensubtitles.Parser();

  it('should get server info', function() {
    return parser.getServerInfo();
  })

  it('should login', function() {
    return parser.login()
    .then(function(result) {
      console.log(result);
    })
  })
});

describe.only('hash', function() {

  it('should hash', function() {
    return hasher.Hash("http://www.opensubtitles.org/addons/avi/breakdance.avi")
    .then(function(result) {
      console.log(result);
    })
  })
})