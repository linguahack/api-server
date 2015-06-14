
var Promise = require('promise');
var Serial = require('../models/serial');
var Fsto = require('../parsers/fsto');

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

  editOrCreateSerial: function(serial) {
    return Promise.resolve(serial.url || 'breaking_bad');
  },

  fsUpdateLinks: function() {
    return Serial
    .find({})
    .exec()
    .then(function(docs) {
      return Promise.all(docs.map(function(serial) {
        Fsto.updateLinks(serial)
        .then(function(){
          return serial.save();
        })
      }));
    });
  },

  checkFstoVideo: function(serialUrl) {
    console.log(new Date() + ' -- check fsto video request -- ' + serialUrl);
    var serial;
    return Serial
    .findOne({url: serialUrl})
    .exec()
    .then(function(_serial) {
      serial = _serial;
      return Fsto.updateLinks(serial)
    })
    .then(function() {
      return serial.save();
    })
    .then(function() {
      return serial;
    })
  }
};
