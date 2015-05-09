
require('coffee-script/register');

var express = require('express');
var cors = require('express-cors');
var controllers = require('./backend/controllers');

var server = express();

server.use(cors({
  allowedOrigins: [
    '127.0.0.1:3000',
    'localhost:3000',
    '52.10.64.218'
  ]
}));

server.get('/', function(req, res) {
  res.end("it's an api server");
});

server.get('/serials', controllers.serials)
server.get('/serial/(:serial)', controllers.serial);
server.get('/fs_update_links', controllers.fs_update_links);

port = 3001;
server.listen(port);

console.log("listening to " + port);

