const { gql } = require('apollo-server-lambda');

module.exports = gql`
  scalar Upload

  type Query {
    sketchList: [Sketch],
    sketchById(sketchId: String!): Sketch
  }

  type Mutation {
    uploadSketch (file: Upload!, sketchName: String, sketchType: String): Sketch
    uploadFile (file: String!, sketchName: String, sketchType: String): Sketch
  }

  type Sketch {
    sketchName: String,
    sketchId: String,
    sketchType: String,
    sketchUrl: String
  }

  schema {
    query: Query
    mutation: Mutation
  }
`;