'use strict';

var chai = require('chai');
var mongoose = require('mongoose');
var imdb = require('../parsers/imdb');
var config = require('../utils/getConfig');
var Serial = require('../models/serial');

var assert = chai.assert, expect = chai.expect;

describe('imdb.parser', function() {
  var serial = {
    imdb: {
      id: "tt2802850"
    },
    tmdb: {
      imdb: "tt2802850"
    }
  };
  var parser = new imdb.Parser();

  it('should getting main info', function() {
    return parser.getMainInfo(serial)
    .then(function(result) {
      assert.typeOf(result.image_url, 'string');
      assert.typeOf(result.rating, 'string');
      assert.typeOf(result.description, 'string');
    });
  });
});

describe('imdb.controller', function() {

  this.timeout(10000);

  var controller = new imdb.Controller();

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