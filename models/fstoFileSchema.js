var mongoose = require('mongoose');

var fstoFileSchema = new mongoose.Schema({
  file_id: Number,
  quality: String,
  link: String,
  last_updated: Date
});

module.exports = fstoFileSchema;