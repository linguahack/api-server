'use strict';

var chai = require('chai');
var opensubtitles = require('../parsers/opensubtitles');
var hasher = require('../parsers/opensubtitles.hasher');

var assert = chai.assert, expect = chai.expect;

describe('opensubtitles', function() {

  var parser = new opensubtitles.Parser();

  describe('serverinfo', function() {
    it('should get server info', function() {
      return parser.getServerInfo()
      .then(function(res) {
        assert.equal(res.xmlrpc_version, '0.1');
        console.log(res);
      });
    })
  })

  describe('login', function() {
    it('should login', function() {
      return parser.login()
      .then(function(result) {
        assert.equal(result.status, '200 OK');
        assert.typeOf(result.token, 'string');
        parser.token = result.token;
        console.log(parser.token);
      })
    })
  })

  describe('search by hash', function() {
    it('should search by hash', function() {
      var link = "http://www.opensubtitles.org/addons/avi/breakdance.avi";
      return parser.searchByHash(link)
      .then(function(result) {
        console.log(result);
      })
    });
  })

  describe.only('search by name', function() {
    it('should search by name', function() {
      return parser.searchByName()
      .then(function(result) {
        console.log(result.data[0]);
      })
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