
var express = require('express');
var cors = require('express-cors');
var routes = require('./backend/routes');

var server = express();

server.use(cors({
  allowedOrigins: [
    '*'
  ]
}));

server.get('/', function(req, res) {
  res.end("it's an api server");
});

server.use('/', routes);

port = 3001;
server.listen(port);

console.log("listening to " + port);

