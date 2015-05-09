
var async = require('async');
var models = require('./models');

models.connect('testing');

module.exports =  {
  serials: function(req, res) {
    models.Serial.find({}, 'url name image_url fsto.image_url imdb.image_url tmdb', function(err, docs) {
      var result = docs.map(function(i) {
        return i.toObject({
          virtuals: true
        });
      });
      res.json(result);
    });
  },

  serial: function(req, res, next) {
    models.Serial.findOne({
      url: req.params.serial
    }).exec(function(err, serial) {
      res.json(serial.toObject({
        virtuals: true,
        transform: true
      }));
    });
  },

  fs_update_links: function(req, res, next) {
    models.Serial.find({}, function(err, docs) {
      if (err != null) {
        res.json({
          error: err != null
        });
        return;
      }
      async.each(docs, function(serial, cb) {
        serial.fs_update_links(function() {
          serial.save(cb);
        });
      }, function(err) {
        res.json({
          error: err != null
        });
      });
    });
  }
};