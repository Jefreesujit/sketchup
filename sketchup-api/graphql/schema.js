const { GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLNonNull, GraphQLList, GraphQLBoolean } = require('graphql');
const { GraphQLUpload } = require('graphql-upload');
const { Sketch } = require('./typeDefs');
const { getSketch, getSketchList, getSketchUrl, uploadImage } = require('./resolvers');

module.exports = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'SketchQuery',
    fields: {
      sketchList: {
        type: new GraphQLList(Sketch),
        resolve: (parent, args) => getSketchList()
      },
      sketchFile: {
        args: { sketchId: { name: 'sketchId', type: new GraphQLNonNull(GraphQLString) } },
        type: Sketch,
        resolve: (parent, args) => getSketch(args.sketchId)
      },
      sketch: {
        args: { sketchId: { name: 'sketchId', type: new GraphQLNonNull(GraphQLString) } },
        type: Sketch,
        resolve: (parent, args) => getSketchUrl(args.sketchId)
      }
    }
  }),
  mutation: new GraphQLObjectType({
    name: 'SketchMutation',
    fields: {
      uploadSketch: {
        type: GraphQLBoolean,
        args: {
          image: {
            type: GraphQLUpload
          },
          sketchName: { name: 'sketchName', type: GraphQLString },
        },
        async resolve(parent, { image, sketchName }) {
          const { filename, mimetype, createReadStream } = await image;
          console.log(filename, mimetype, sketchName);
          const stream = createReadStream();
          // Promisify the stream and store the file, then…
          return true
        }
      }
    }
  })
});
