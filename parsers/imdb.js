'use strict'

var cheerio = require('cheerio');
var request = require('request-promise');
var utils = require('../utils/utils');

class Parser {

  fullUrl(serial) {
    return "http://www.imdb.com/title/" + serial.imdb.id;
  }

  getMainInfo(serial) {
    return request({
      url: this.fullUrl(serial)
    })
    .then(function(body) {
      var $ = cheerio.load(body);
      return {
        image_url: ($('#img_primary img')).attr('src'),
        rating: ($('#overview-top [itemprop="ratingValue"]')).text(),
        description: ($('#overview-top p[itemprop="description"]')).text()
      };
    });
  }

}

class Controller {
  constructor() {
    this.parser = new Parser();
  }

  updateSerial(serial) {
    return this.parser.getMainInfo(serial)
    .then(function(result) {
      serial.imdb.image_url = result.image_url;
      serial.imdb.rating = result.rating;
      serial.imdb.description = result.description;
      return serial;
    })
  }
}

module.exports = {Parser, Controller};