var mongoose = require('mongoose');
var episodeSchema = require('./episodeSchema');


var seasonSchema = new mongoose.Schema({
  number: {
    type: Number
  },
  fsto: {
    folder_id: Number,
    en_folder_id: Number
  },
  episodes: [episodeSchema]
});

seasonSchema.methods.findOrCreateEpisode = function(number) {
  var episode, _i, _len, _ref;
  number = parseInt(number);
  _ref = this.episodes;
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    episode = _ref[_i];
    if (episode.number === number) {
      return episode;
    }
  }
  episode = this.episodes.create({
    number: number
  });
  this.episodes.push(episode);
  return episode;
};

module.exports = seasonSchema;
