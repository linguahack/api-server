'use strict';

var chai = require('chai');
var mongoose = require('mongoose');
var tmdb = require('../parsers/tmdb');
var config = require('../utils/getConfig');
var Serial = require('../models/serial');

var assert = chai.assert, expect = chai.expect;

describe('tmdb.parser', function() {
  var serial = {
    tmdb: {
      id: 60622
    }
  };
  var parser = new tmdb.Parser();

  it('should getting main info', function() {
    return parser.getMainInfo(serial)
    .then(function(result) {
      assert.typeOf(result.backdrop_path, 'string');
      assert.typeOf(result.poster_path, 'string');
      assert.typeOf(result.overview, 'string');
      assert.typeOf(result.imdb, 'string');
    });
  });
});

describe('tmdb.controller', function() {

  this.timeout(10000);

  var controller = new tmdb.Controller();

  it('should update serial', function() {
    return Serial.findOne({url: 'fargo'})
    .then(function(serial) {
      return controller.updateSerial(serial);
    })
    .then(function(serial) {
      return serial.save();
    })
  })
})