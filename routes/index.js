
var express = require('express');
var bodyParser = require('body-parser');
var controllers = require('../controllers');
var getSubtitles = require('../utils/getSubtitles');

var app = express();

var postMiddleware = bodyParser.urlencoded({extended: true});

app.use(function(req, res, next) {
  res.handle = function(promise) {
    promise.then(res.json.bind(res), function(err) {
      console.log(err.stack);
      res.json({error: err.stack.toString()});
    });
  };
  next();
});

app.get('/serials', function(req, res) {
  var result = controllers.getSerials();
  res.handle(result);
})

app.get('/serial/(:serial)', function(req, res) {
  var result = controllers.getSerial(req.params.serial)
  res.handle(result);
});

app.post('/serial', postMiddleware, function(req, res) {
  return res.end();
  var result = Promise.resolve()
  .then(function() {
    console.log(req.body.serial);
    return JSON.parse(req.body.serial);
  })
  .then(function(serial) {
    return controllers.editOrCreateSerial(serial);
  })
  .then(function(serialId) {
    return controllers.getSerial(serialId);
  })
  res.handle(result);
});


app.get('/subtitles/convert', function(req, res) {
  var url = req.query.url;
  getSubtitles(url)
  .then(function(subs) {
    res.type('text/vtt');
    subs.pipe(res);
  });
})

module.exports = app;
