
var mongoose = require('mongoose');
var seasonSchema = require('./seasonSchema');

var serialSchema = new mongoose.Schema({
  name: String,
  url: {
    type: String,
    index: true,
    unique: true
  },
  background_image_url: String,
  fsto: {
    id: String,
    url: String,
    image_url: String,
    name: String
  },
  imdb: {
    id: String,
    image_url: String,
    rating: String,
    description: String
  },
  tmdb: {
    id: String,
    poster_path: String,
    backdrop_path: String
  },
  seasons: [seasonSchema]
});

serialSchema.methods.generateUrl = function() {
  return this.url = this.name.toLowerCase().replace(/\s/g, '_').replace(/[^\da-zA-Z_]/g, '');
};

serialSchema.methods.findOrCreateSeason = function(number) {
  var season, _i, _len, _ref;
  number = parseInt(number);
  _ref = this.seasons;
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    season = _ref[_i];
    if (season.number === number) {
      return season;
    }
  }
  season = this.seasons.create({
    number: number
  });
  this.seasons.push(season);
  return season;
};

serialSchema.virtual("image_url").get(function() {
  if (this.tmdb.poster_path != null) {
    return this.tmdb.poster;
  } else {
    return this.fsto.image_url;
  }
});

serialSchema.set('toObject', {
  virtuals: true,
  transform: true
});

module.exports = mongoose.model('Serial', serialSchema);