'use strict';

var XmlRpc = require('../utils/xmlrpc');
var hasher = require('./opensubtitles.hasher');


class Parser {

  constructor() {
    this.xmlRpc = new XmlRpc("http://api.opensubtitles.org/xml-rpc");
    this.token = "o7ffub6vac18rr8gtihkft2lu3";
  }

  getServerInfo() {
    return this.xmlRpc.request('ServerInfo');
  }

  login() {
    return this.xmlRpc.request('LogIn', ['', '', 'eng', "OSTestUserAgent"]);
  }

  searchByHash(link) {
    var parser = this;
    return hasher.Hash(link)
    .then(function(hash) {
      return parser.xmlRpc.request('SearchSubtitles', [
        parser.token,
        {
          sublanguageid: 'eng',
          moviehash: hash.hash,
          moviebytesize: hash.size
        }
      ]);
    });
  }

  searchByName(name, season, episode) {
    return this.xmlRpc.request('SearchSubtitles', [
      this.token,
      {
        sublanguageid: 'eng',
        query: name,
        season: season,
        episode: episode
      }
    ]);
  }

}

class Controller {

  constructor() {
    this.parser = new Parser();
  }

  login() {
    var parser = this.parser;
    return this.parser.login()
    .then(function(result) {
      parser.token = result.token;
    });
  }

  updateEpisode(serial, season, episode) {
    return this.parser.searchByName(serial.name, season.number.toString(), episode.number.toString())
    .then(function(result) {
      if (result.data) {
        episode.opensubtitles = result.data;
      }
    })
  }

  updateSerial(serial) {
    var controller = this;
    var promiseChain = Promise.resolve();
    for(var season of serial.seasons) {
      for(var episode of season.episodes) {
        promiseChain = promiseChain.then(controller.updateEpisode.bind(controller, serial, season, episode));
      }
    }
    return promiseChain.then(function() {
      return serial;
    });
  }
}

module.exports = {Parser, Controller};