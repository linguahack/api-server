
const router = require('koa-router')();
const parse = require('co-body');
const g = require('graphql');

const schema = require('./schema');

router.post('/', function *() {

  const params = yield parse.json(this);
  const root = null;

  this.body = yield g.graphql(schema, params.query, root, params.variables);

});


module.exports = router;
