
const router = require('koa-router')();
const parse = require('co-body');
const graphql = require('graphql');

const schema = require('./schema');

router.post('/', function *() {

  const params = yield parse(this);

  const result = yield graphql.graphql(schema, params.query);

  this.body = result;

});


module.exports = router;
