'use strict';

var chai = require('chai');
var mongoose = require('mongoose');
var fsto = require('../parsers/fsto');
var config = require('../utils/getConfig');
var Serial = require('../models/serial');

var assert = chai.assert, expect = chai.expect;

mongoose.connect(config('mongo_url'));

describe('fsto.Controller', function () {

  this.timeout(10000);

  var controller = new fsto.Controller();

  it('should update serial', function() {
    return Serial.findOne({url: 'fargo'})
    .then(function(serial) {
    	return controller.updateSerial(serial);
    })
    .then(function(serial) {
    	return serial.save();
    });
  })
})
