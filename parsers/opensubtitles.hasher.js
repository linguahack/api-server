'use strict';

var url = require('url');
var http = require('http');

var request = function(params) {
  return new Promise(function(resolve, reject) {
    var req = url.parse(params.url);
    req.headers = params.headers;
    var body = [];
    http.get(req, function(response) {
      response.on('data', function(chunk) {
        body.push(chunk);
      })
      response.on('end', function() {
        response.body = Buffer.concat(body);
        resolve(response);
      });
    });
  })
};

var HASH_CHUNK_SIZE = 65536;//64 * 1024

function downloadData(link) {
  var fileData = {};
  return request({
    url: link,
    headers: {
      'Range': `bytes=0-${HASH_CHUNK_SIZE - 1}`
    }
  })
  .then(function(response) {
    fileData.size = /\/(\d+)/.exec(response.headers['content-range'])[1];
    fileData.begin = response.body;
  })
  .then(function() {
    return request({
      url: link,
      headers: {
        'Range': `bytes=${fileData.size - HASH_CHUNK_SIZE}-`
      }
    });
  })
  .then(function(response){
    fileData.end = response.body;
    return fileData;
  });
}

function getHash(data) {
  var longs = [],
    temp = data.size;

  function process(chunk) {
    for (var i = 0; i < chunk.length; i++) {
      longs[(i + 8) % 8] += chunk[i];
    }
  }

  function binl2hex(a) {
    var b = 255,
      d = '0123456789abcdef',
      e = '',
      c = 7;

    a[1] += a[0] >> 8;
    a[0] = a[0] & b;
    a[2] += a[1] >> 8;
    a[1] = a[1] & b;
    a[3] += a[2] >> 8;
    a[2] = a[2] & b;
    a[4] += a[3] >> 8;
    a[3] = a[3] & b;
    a[5] += a[4] >> 8;
    a[4] = a[4] & b;
    a[6] += a[5] >> 8;
    a[5] = a[5] & b;
    a[7] += a[6] >> 8;
    a[6] = a[6] & b;
    a[7] = a[7] & b;
    for (d, e, c; c > -1; c--) {
      e += d.charAt(a[c] >> 4 & 15) + d.charAt(a[c] & 15);
    }
    return e;
  }


  for (var i = 0; i < 8; i++) {
    longs[i] = temp & 255;
    temp = temp >> 8;
  }

  process(data.begin);
  process(data.end);
  return binl2hex(longs);
}

function Hash(link) {
  return downloadData(link)
  .then(function(data) {
    var result = {};
    result.size = data.size;
    result.hash = getHash(data);
    return result;
  })
}


module.exports = {Hash};