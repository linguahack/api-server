
var mongoose = require('mongoose');
var fstoFileSchema = require('./fstoFileSchema');

var episodeSchema = new mongoose.Schema({
  number: {
    type: Number
  },
  fsto: {
    files: [fstoFileSchema]
  }
});

episodeSchema.virtual("best_link").get(function() {
  var _ref;
  return 'http://fs.to' + ((_ref = this.fsto.files[0]) != null ? _ref.link : void 0);
});

episodeSchema.virtual("name").get(function() {
  return "Episode " + this.number;
});

module.exports = episodeSchema;