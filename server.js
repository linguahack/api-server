
var app = require('koa')();
var router = require('koa-router')();
var mongoose = require('mongoose');
var config = require('./config.json');

mongoose.connect(config.mongo_url);

app.use(function*(next) {
  yield next;
  this.set('Access-Control-Allow-Origin', '*');
})

router.get('/', function *() {
  this.body = {status: "OK"};
});

router.use('/serials', require('./routes/serials').routes());
router.use('/auth', require('./routes/auth').routes());

app.use(router.routes());

app.on('error', require('./lib/onerror'));

var port = process.env.PORT || 3001;
app.listen(port);
console.log("listening to " + port);