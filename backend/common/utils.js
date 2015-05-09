
var utils = {};

module.exports = utils;

utils.jsonify_regex = /([\{,]\s*)(.+?)(\s*:)/gm;

utils.jsonify = function(str) {
  return str.replace(this.jsonify_regex, '$1"$2"$3').replace(/(:\s*)'([^']*)'(\s*[,\}])/g, '$1"$2"$3');
};
