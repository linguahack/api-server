
var fs = require('fs');
var url = require('url');
var zlib = require('zlib');
var http = require('http');
var srt2vtt = require('srt-to-vtt');

module.exports = function(subUrl) {
  return new Promise(function(resolve, reject) {
    var parsedUrl = url.parse(subUrl);
    var r = http.get({
      host: parsedUrl.host,
      path: parsedUrl.path,
      headers: { 'accept-encoding': 'gzip,deflate' }
    });

    r.on('response', function(response) {
      if (response.headers['content-length'] < 100) {
        return reject('invalid subtitiles url');
      }
      var result = response
      .pipe(zlib.createUnzip())
      .pipe(srt2vtt());
      resolve(result);
    });
  })
};