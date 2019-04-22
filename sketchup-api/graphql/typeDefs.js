/* @flow strict */

const { GraphQLObjectType, GraphQLString } = require('graphql');

const Sketch = new GraphQLObjectType({
	name: 'Sketch',
	description: 'Sketch file type',
	fields: {
		sketchId: { type: GraphQLString },
		sketchName:  { type: GraphQLString },
    sketchUrl: { type: GraphQLString }
	}
});

module.exports = {
  GraphQLBuffer,
  Sketch
}
