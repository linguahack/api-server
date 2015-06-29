'use strict';

var request = require('request-promise');
var XmlRpc = require('../utils/xmlrpc');
var hasher = require('./opensubtitles.hasher');


class Parser {

  constructor() {
    this.baseUrl = "http://api.opensubtitles.org/xml-rpc";
    this.token = "7fkpiu6ug13h5k0ghe2frlkdq5";
  }

  getServerInfo() {
    return request({
      url: this.baseUrl,
      method: "POST",
      form: XmlRpc('ServerInfo')
    })
  }

  login() {
    return request({
      url: this.baseUrl,
      method: "POST",
      form: XmlRpc('LogIn', ['', '', 'eng', "OSTestUserAgent"])
    })
  }

  search() {
    var parser = this;
    var link = "http://n25.filecdn.to/ff/MWIyNjhhNjQwMjQ4MTQ1OGVmMjQwMTAzODk0OGU0ZTR8ZnN0b3wzMjU0NzA1MjQ3fDEwMDAwfDJ8MHxhfDI1fDg2MzBjMTQxNzIyODBjMWM5NzU0NzgwZGU1Y2JmZTgyfDB8MTI6NS40MjpsfDB8MzkxMTg1NjQxfDE0MzU1NzcyODYuNjk1Nw,,/play_5q1zymtt547aodsyr5tsamzqu.0.1765758616.974127405.1435577257.mp4";
    return hasher.Hash(link)
    .then(function(hash) {
      console.log(hash);
      return request({
        url: parser.baseUrl,
        method: "POST",
        form: XmlRpc('SearchSubtitles', [
          parser.token,
          {
            sublanguageid: 'eng',
            moviehash: hash.hash,
            moviebytesize: hash.size
          }
        ])
      })
    })

  }

}


module.exports = {Parser};