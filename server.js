
const app = require('koa')();
const router = require('koa-router')();
const mongoose = require('mongoose');
const config = require('./config.json');
const graphql = require('./graphql');

mongoose.connect(config.mongo_url);

app.use(function*(next) {
  yield next;
  this.set('Access-Control-Allow-Origin', '*');
})

router.get('/', function *() {
  this.body = {status: "OK"};
});

router.post('/graphql', graphql);

app.use(router.routes());

app.on('error', require('./lib/onerror'));

const port = process.env.PORT || 3001;
app.listen(port);
console.log("listening to " + port);