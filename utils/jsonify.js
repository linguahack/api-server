

var jsonify_regex = /([\{,]\s*)(.+?)(\s*:)/gm;

var jsonify = function(str) {
  return str.replace(this.jsonify_regex, '$1"$2"$3').replace(/(:\s*)'([^']*)'(\s*[,\}])/g, '$1"$2"$3');
};

module.exports = jsonify;
