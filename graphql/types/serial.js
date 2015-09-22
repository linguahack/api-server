

const g = require('graphql');
const SeasonType = require('./season');
const Serial = require('../../models/serial');

module.exports = new g.GraphQLObjectType({
  name: 'Serial',
  fields: {
    id: {
      type: g.GraphQLString,
      resolve: (serial) => serial._id
    },
    url: { type: g.GraphQLString },
    name: { type: g.GraphQLString },
    seasons: {
      type: new g.GraphQLList(SeasonType),
      resolve: function(parent) {
        return Serial.findById(parent._id, 'seasons')
        .then((serial) => serial.seasons);
      }
    },
    tmdb: {
      type: new g.GraphQLObjectType({
        name: 'tmdbSerialData',
        fields: {
          id: { type: g.GraphQLString },
          backdrop_path: { type: g.GraphQLString },
          poster_path: { type: g.GraphQLString }
        }
      })
    },
    imdb: {
      type: new g.GraphQLObjectType({
        name: 'imdbSerialData',
        fields: {
          id: { type: g.GraphQLString },
          description: { type: g.GraphQLString },
          image_url: { type: g.GraphQLString },
          rating: { type: g.GraphQLString }
        }
      })
    },
    fsto: {
      type: new g.GraphQLObjectType({
        name: 'fstoSerialData',
        fields: {
          id: { type: g.GraphQLString },
          url: { type: g.GraphQLString },
          image_url: { type: g.GraphQLString }
        }
      })
    }
  }
})