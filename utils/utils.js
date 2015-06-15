

var _ = {};
module.exports = _;

_.find = function(array, predicate) {
	for(var i = 0; i < array.length; ++i) {
    if (predicate(array[i])) {
      return array[i];
    }
  }
  return null;
}