
var express = require('express');
var cors = require('express-cors');
var routes = require('./backend/routes');

var server = express();

// server.use(cors({
//   allowedOrigins: [
//     '127.0.0.1:3000',
//     'localhost:3000',
//     '52.10.64.218'
//   ]
// }));

server.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
});

server.get('/', function(req, res) {
  res.end("it's an api server");
});

server.use('/', routes);

port = 3001;
server.listen(port);

console.log("listening to " + port);

