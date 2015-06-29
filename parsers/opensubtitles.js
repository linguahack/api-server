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

  searchByName() {
    return this.xmlRpc.request('SearchSubtitles', [
      this.token,
      {
        sublanguageid: 'eng',
        query: 'friends',
        season: '1',
        episode: '1'
      }
    ]);
  }

}


module.exports = {Parser};