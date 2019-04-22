const { GraphQLUpload } = require('graphql-upload');
const { getSketchList, getSketchUrl, uploadSketch, uploadImage } = require('../controllers');

module.exports = {
    Upload: GraphQLUpload,
    Query: {
      sketchList: (parent, args) => getSketchList(parent, args),
      sketchById: (parent, args) => getSketchUrl(args)
    },
    Mutation: {
      uploadSketch: (parent, args) => uploadSketch(parent, args),
      uploadFile: (parent, args) => uploadImage(args)
    }
  }
  