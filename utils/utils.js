

var utils = {};
module.exports = utils;

utils.getItem = function(collection, item, keyField) {
  keyField = keyField || 'number';
  var result = collection.filter(function(collectionItem) { return collectionItem[keyField] === item[keyField]; })[0];
  if (!result) {
    collection.push(collection.create(item));
    result = collection[collection.length - 1];
  }
  return result;
}