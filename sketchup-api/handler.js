const { ApolloServer } = require('apollo-server-lambda');
const schema = require('./apollo/schema');
const resolvers = require('./apollo/resolvers');
const multipart = require('aws-lambda-multipart-parser');

const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
  context: ({ event, context }) => {
    const headers = {
      'Access-Control-Allow-Origin': '*'
    }

    
    return {
      headers: event.headers,
      functionName: context.functionName,
      event,
      context,
    };
  }
});

module.exports.query = server.createHandler({
  cors: {
    origin: '*',
    methods: 'POST',
    allowHeaders: [
      'Content-Type',
      'Origin',
      'Accept'
    ]
  }
});

// module.exports.query = (event, context, callback) => {
//   const contentType = event.headers['Content-Type'] || '',
//         isMultipart = contentType.indexOf('multipart') !== -1;
  
//   if (event.body && isMultipart) {
//     const parsedValue = multipart.parse(event);
//     const response = await uploadSketch(parsedValue);

//     return response;
//   } else {
//     return graphqlHandler(event, context, callback);
//   }
// }

