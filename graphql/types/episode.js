

const g = require('graphql');

const fstoFileType = new g.GraphQLObjectType({
  name: 'fstoFile',
  fields: {
    id: {
      type: g.GraphQLString,
      resolve: (serial) => serial._id
    },
    last_updated: { type: g.GraphQLString },
    link: { type: g.GraphQLString },
    quality: { type: g.GraphQLString },
    file_id: { type: g.GraphQLInt }
  }
})

const openSubtitlesType = new g.GraphQLObjectType({
  name: 'openSubtitles',
  fields: {
    SubFileName: { type: g.GraphQLString },
    IDSubtitleFile: { type: g.GraphQLString },
    SubDownloadLink: { type: g.GraphQLString }
  }
})

module.exports = new g.GraphQLObjectType({
  name: 'Episode',
  fields: {
    id: {
      type: g.GraphQLString,
      resolve: (serial) => serial._id
    },
    number: { type: g.GraphQLInt },
    name: { type: g.GraphQLString },
    fsto: {
      type: new g.GraphQLObjectType({
        name: 'fstoEpisodeData',
        fields: {
          files: { type: new g.GraphQLList(fstoFileType) }
        }
      })
    },
    opensubtitles: { type: new g.GraphQLList(openSubtitlesType)}
  }
})