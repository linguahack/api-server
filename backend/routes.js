
var express = require('express');
var Promise = require('promise');
var bodyParser = require('body-parser');
var controllers = require('./controllers');

var app = express();

app.use(bodyParser.urlencoded({extended: true}));


var errorHandler = function(response) {
  return function(err) {
    console.log(err.stack);
    response.json({error: true});
  };
}

app.get('/serials', function(req, res) {
  controllers.getSerials()
  .then(res.json.bind(res), errorHandler(res));
})

app.get('/serial/(:serial)', function(req, res) {
  controllers.getSerial(req.params.serial)
  .then(res.json.bind(res), errorHandler(res));
});
app.post('/serial', function(req, res) {
  Promise.resolve()
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
  .then(res.json.bind(res), errorHandler(res));
});

app.get('/fs_update_links', function(req, res) {
  controllers.fsUpdateLinks()
  .then(function() {
    res.json({error: false});
  })
});

module.exports = app;