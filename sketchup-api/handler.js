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
    methods: 'OPTIONS, POST, GET',
    allowedHeaders: 'Origin, Content-Type, Accept, content-type'
  }
});

const uploadHandler = async (event, context, callback) => {
  const response = await uploadSketch(event);
  callback(null, {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "OPTIONS, POST, GET",
      "Access-Control-Allow-Headers": 'Origin, Content-Type, Accept, content-type'
    },
    body: JSON.stringify(response),
  });
}

const routeMapping = {
  upload: uploadHandler,
  query: graphqlHandler
};

module.exports.query = (event, context, callback) => {
  const route = event.path.slice(1);
  console.log('inside lam', event, context);
  return routeMapping[route](event, context, callback);
}
