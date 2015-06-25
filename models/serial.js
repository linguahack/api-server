
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
    name: String
  },
  imdb: {
    id: String,
    image_url: String,
    rating: String
  },
  tmdb: {
    id: String,
    poster_path: String,
    backdrop_path: String,
    overview: String,
    imdb: String
  },
  seasons: [seasonSchema]
});

serialSchema.methods.generateUrl = function() {
  return this.url = this.name.toLowerCase().replace(/\s/g, '_').replace(/[^\da-zA-Z_]/g, '');
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