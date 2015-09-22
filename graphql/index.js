
const parse = require('co-body');
const g = require('graphql');

const schema = require('./schema');

module.exports = function *() {

  const params = yield parse.json(this);
  const root = null;
  const variables = params.variables ? JSON.parse(params.variables) : null;

  this.body = yield g.graphql(schema, params.query, root, variables);

};
