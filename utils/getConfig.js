
var fs = require('fs');

var configCustom = null;

try {
  configCustom = require('../config.json');
} catch (error) {
  console.log("there are no config file");
  throw error;
}

module.exports = function(name) {
  return configCustom[name];
};
