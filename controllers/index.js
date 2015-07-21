
var Serial = require('../models/serial');
var fsto = require('../parsers/fsto');
var tmdb = require('../parsers/tmdb');
var imdb = require('../parsers/imdb');
var opensubtitles = require('../parsers/opensubtitles');

module.exports =  {
  getSerials: function() {
    return Serial
    .find({}, 'url name image_url fsto.image_url imdb.image_url tmdb')
    .exec()
    .then(function(docs) {
      var result = docs.map(function(i) {
        return i.toObject({
          virtuals: true
        });
      });
      return result;
    });
  },

  getSerial: function(url) {
    return Serial
    .findOne({
      url: url
    })
    .exec()
    .then(function(serial) {
      return serial.toObject({
        virtuals: true,
        transform: true
      });
    });
  },

  createSerial: function(params) {
    var serial = new Serial();
    serial.name = params.name;
    serial.generateUrl();
    serial.tmdb.id = params.tmdbId;
    serial.fsto = (new fsto.Parser()).parseUrl(params.fstoUrl);
    return Promise.resolve()
    .then(function() {
      console.log('fsto');
      return (new fsto.Controller()).updateSerial(serial);
    })
    .then(function() {
      console.log('tmdb');
      return (new tmdb.Controller()).updateSerial(serial);
    })
    .then(function() {
      console.log('imdb');
      serial.imdb.id = serial.tmdb.imdb;
      return (new imdb.Controller()).updateSerial(serial);
    })
    .then(function() {
      console.log('opensubtitles');
      var controller = new opensubtitles.Controller();
      return controller.login()
      .then(controller.updateSerial.bind(controller, serial));
    })
    .then(function() {
      serial.save();
    })
  }
};
