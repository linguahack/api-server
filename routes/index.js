
var express = require('express');
var Promise = require('promise');
var bodyParser = require('body-parser');
var controllers = require('../controllers');

var app = express();

app.use(bodyParser.urlencoded({extended: true}));

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
app.post('/serial', function(req, res) {
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

app.get('/fs_update_links', function(req, res) {
  var result = controllers.fsUpdateLinks()
  .then(function() {
    return {error: false};
  })
  res.handle(result);
});

app.get('/check_fsto_video/(:serial)', function(req, res) {
  var result = controllers.checkFstoVideo(req.params.serial);
  res.handle(result);
});

module.exports = app;
