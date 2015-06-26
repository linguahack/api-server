'use strict';

var request = require('request-promise');
var XmlRpc = require('../utils/xmlrpc');


class Parser {

  constructor() {
    this.baseUrl = "http://api.opensubtitles.org/xml-rpc";
    this.token = "gajsng38popdkn799aubcfo1u0";
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

}


module.exports = {Parser};