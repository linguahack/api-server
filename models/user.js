
var mongoose = require('mongoose');

var schema = new mongoose.Schema({
  login: {
    type: String,
    index: true,
    unique: true,
    required: 'login is required'
  },
  firstname: {
    type: String
  },
  lastname: {
    type: String
  },
  password: String
});

module.exports = mongoose.model('User', schema);