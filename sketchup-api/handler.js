const { ApolloServer } = require('apollo-server-lambda');
const schema = require('./apollo/schema');
const resolvers = require('./apollo/resolvers');
const { uploadSketch } = require('./controllers');

const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
  context: ({ event, context }) => {
    return {
      headers: event.headers,
      functionName: context.functionName,
      event,
      context,
    };
  }
});

const graphqlHandler = server.createHandler({
  cors: {
    origin: '*',
    methods: 'POST',
    allowHeaders: [ 'Content-Type', 'Origin', 'Accept' ]
  }
});

const uploadHandler = async (event, context, callback) => {
  const response = await uploadSketch(event);
  callback(null, { statusCode: 200, body: JSON.stringify(response) });
}

const routeMapping = {
  upload: uploadHandler,
  query: graphqlHandler
};

module.exports.query = (event, context, callback) => {
  const route = event.path.slice(1);

  return routeMapping[route](event, context, callback);
}
