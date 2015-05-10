
var Promise = require('promise');
var models = require('./models');

models.connect('development');

module.exports =  {
  serials: function(req, res) {
    models.Serial
    .find({}, 'url name image_url fsto.image_url imdb.image_url tmdb')
    .exec()
    .then(function(docs) {
      var result = docs.map(function(i) {
        return i.toObject({
          virtuals: true
        });
      });
      res.json(result);
    });
  },

  serial: function(req, res) {
    models.Serial
    .findOne({
      url: req.params.serial
    })
    .exec()
    .then(function(serial) {
      res.json(serial.toObject({
        virtuals: true,
        transform: true
      }));
    });
  },

  fs_update_links: function(req, res) {
    models.Serial
    .find({})
    .exec()
    .then(function(docs) {
      return Promise.all(docs.map(function(serial) {
        serial.fs_update_links()
        .then(function(){
          return serial.save();
        })
      }));
    })
    .then(function() {
      res.json({error: false});
    });
  }
};