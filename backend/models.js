
var mongoose = require('mongoose');
var config = require('./get_config');
var fsto = require('./data_sources/fsto');
var imdb = require('./data_sources/imdb');
var tmdb = require('./data_sources/tmdb');

module.exports = this;

this.connect = function(purpose) {
  var hash;
  if (purpose == null) {
    purpose = "development";
  }
  hash = {
    development: "mongo_url",
    testing: "testing_mongo_url"
  };
  mongoose.disconnect(function() {
    mongoose.connect(config(hash[purpose]));
  });
};

this.connect('testing');

this.fsto_file_schema = new mongoose.Schema({
  file_id: Number,
  quality: String,
  link: String,
  last_updated: Date
});

this.episode_schema = new mongoose.Schema({
  number: {
    type: Number
  },
  fsto: {
    files: [this.fsto_file_schema]
  }
});

this.episode_schema.virtual("best_link").get(function() {
  var _ref;
  return 'http://fs.to' + ((_ref = this.fsto.files[0]) != null ? _ref.link : void 0);
});

this.episode_schema.virtual("name").get(function() {
  return "Episode " + this.number;
});

this.season_schema = new mongoose.Schema({
  number: {
    type: Number
  },
  fsto: {
    folder_id: Number,
    en_folder_id: Number
  },
  episodes: [this.episode_schema]
});

this.season_schema.methods.find_or_create_episode = function(number) {
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

this.serial_schema = new mongoose.Schema({
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
  seasons: [this.season_schema]
});

this.serial_schema.methods.generate_url = function() {
  return this.url = this.name.toLowerCase().replace(/\s/g, '_').replace(/[^\da-zA-Z_]/g, '');
};

this.serial_schema.methods.find_or_create_season = function(number) {
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

this.serial_schema.virtual("image_url").get(function() {
  if (this.tmdb.poster_path != null) {
    return this.tmdb.poster;
  } else {
    return this.fsto.image_url;
  }
});

this.serial_schema.set('toObject', {
  virtuals: true,
  transform: true
});

fsto.append_to_schemas(this);

imdb.append_to_schemas(this);

tmdb.append_to_schemas(this);

this.Serial = mongoose.model('Serial', this.serial_schema);
