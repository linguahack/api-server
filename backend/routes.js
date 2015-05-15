
var express = require('express');
var Promise = require('promise');
var bodyParser = require('body-parser');
var controllers = require('./controllers');

var app = express();

app.use(bodyParser.urlencoded({extended: true}));

var handle = function(promise, response) {
  promise.then(response.json.bind(response), function(err) {
    console.log(err.stack);
    response.json({error: err.stack.toString()});
  });
}

app.get('/serials', function(req, res) {
  var result = controllers.getSerials()
  handle(result, res);
})

app.get('/serial/(:serial)', function(req, res) {
  var result = controllers.getSerial(req.params.serial)
  handle(result, res);
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
  handle(result, res);
});

app.get('/fs_update_links', function(req, res) {
  var result = controllers.fsUpdateLinks()
  .then(function() {
    return {error: false};
  })
  handle(result, res);
});

app.get('/fs_update_links/(:serial)', function(req, res) {
  var result = controllers.fsUpdateLinksSerial(req.params.serial)
  .then(function() {
    return {error: false};
  })
  handle(result, res);
});

module.exports = app;
