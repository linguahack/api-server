
var mongoose = require('mongoose');

module.exports = mongoose.model('Session', {
  uid: {
    type: String,
    index: true,
    unique: true
  },
  userId: String,
  lastActivity: {
    type: Date,
    default: Date.now
  }
});