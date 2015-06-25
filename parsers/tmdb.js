'use strict'

var request = require('request-promise');
var utils = require('../utils/utils');

class Parser {

  constructor() {
    this.api_key = "38822628893b580eec3f6df039b687ed";
    this.base_url = 'http://api.themoviedb.org/3';
  }

  serialUrl(serial) {
    return this.base_url + "/tv/" + serial.tmdb.id;
  }

  posterUrl(serial) {
    return "http://image.tmdb.org/t/p/w342/" + serial.tmdb.poster_path;
  }

  backdropUrl(serial) {
    return "http://image.tmdb.org/t/p/original/" + serial.tmdb.backdrop_path;
  }

  getMainInfo(serial) {
    return request({
      url: this.serialUrl(serial),
      json: true,
      qs: {
        api_key: this.api_key,
        append_to_response: 'external_ids'
      }
    })
    .then(function(body) {
      return {
        backdrop_path: body.backdrop_path,
        poster_path: body.poster_path,
        overview: body.overview,
        imdb: body.external_ids.imdb_id
      };
    });
  }

  search(query) {
    return request({
      url: this.base_url + '/search/tv',
      json: true,
      qs: {
        api_key: this.api_key,
        query: query
      }
    })
    .then(function(body) {
      return {
        id: body.results[0].id
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
      serial.tmdb.backdrop_path = result.backdrop_path;
      serial.tmdb.poster_path = result.poster_path;
      serial.tmdb.overview = result.overview;
      serial.tmdb.imdb = result.imdb;
      return serial;
    })
  }

}

module.exports = {Parser, Controller};
