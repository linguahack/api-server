
const g = require('graphql');

const Serial = require('../models/serial');
const SerialType = require('./types/serial');

const query = new g.GraphQLObjectType({
  name: 'Query',
  fields: {
    serials: {
      type: new g.GraphQLList(SerialType),
      resolve: function (root, args) {
        return Serial.find({}, "-seasons");
      }
    },
    serial: {
      type: SerialType,
      args: {
        url: { type: g.GraphQLString }
      },
      resolve: function(root, args) {
        return Serial.findOne(args, '-seasons');
      }
    }
  }
})

module.exports = new g.GraphQLSchema({query})