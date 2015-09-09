

var parse = require('co-body');


module.exports = function *(next) {
  this.request.params = yield parse(this);
  yield next;
}