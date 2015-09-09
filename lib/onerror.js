
var mongoose = require('mongoose');

var schema = new mongoose.Schema({
  time: {
    type: Date,
    default: Date.now,
    index: true,
    expires: 3600 * 24 * 7,
  },
  json: String,
  stack: String,
  request: String
});

var ErrorModel = mongoose.model('Error', schema);

module.exports = function(err, ctx) {
  var error = new ErrorModel();
  error.json = JSON.stringify(err);
  error.stack = err.stack;
  error.request = JSON.stringify(ctx.request);
  console.log(error.stack);
  return error.save();
}