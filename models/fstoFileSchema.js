var mongoose = require('mongoose');

var fstoFileSchema = new mongoose.Schema({
  file_id: Number,
  quality: String,
});

module.exports = fstoFileSchema;