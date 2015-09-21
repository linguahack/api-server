

const g = require('graphql');
const EpisodeType = require('./episode');

module.exports = new g.GraphQLObjectType({
  name: 'Season',
  fields: {
    id: {
      type: g.GraphQLString,
      resolve: (serial) => serial._id
    },
    number: { type: g.GraphQLInt },
    episodes: { type: new g.GraphQLList(EpisodeType) },
    fsto: {
      type: new g.GraphQLObjectType({
        name: 'fstoSeasonData',
        fields: {
          en_folder_id: { type: g.GraphQLString },
          folder_id: { type: g.GraphQLString }
        }
      })
    }
  }
})