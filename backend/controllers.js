
var Promise = require('promise');
var models = require('./models');

models.connect('development');

module.exports =  {
  getSerials: function() {
    return models.Serial
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
    return models.Serial
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
    return models.Serial
    .find({})
    .exec()
    .then(function(docs) {
      return Promise.all(docs.map(function(serial) {
        serial.fs_update_links()
        .then(function(){
          return serial.save();
        })
      }));
    });
  },

  fsUpdateLinksSerial: function(serialUrl) {
    return models.Serial
    .findOne({url: serialUrl})
    .exec()
    .then(function(serial) {
      return serial.fs_update_links()
      .then(function() {
        return serial.save();
      });
    });
  }
};
