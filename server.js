
require('coffee-script/register');

var express = require('express');
var controllers = require('./backend/controllers');

var server= express();
server.get('/', function(req, res) {
  res.end("it's an api server");
});

server.get('/serials', controllers.serials)
server.get('/serial/(:serial)', controllers.serial);
server.get('/fs_update_links', controllers.fs_update_links);

port = 3001;
server.listen(port);

console.log("listening to " + port);

