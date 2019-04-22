const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();

const promisify = foo => new Promise((resolve, reject) => {
  foo((error, result) => {
    if(error) {
      reject(error)
    } else {
      console.log('result', result)
      resolve(result)
    }
  })
})

exports.addSketch = (data) => promisify(callback => {
	var params =  {
    TableName: process.env.DYNAMODB_TABLE,
    Item: {
      ...data,
      dateModified: new Date().toJSON()
      }
    };
  
  docClient.put(params, callback);
});

exports.getSketchList = (data) => promisify(callback => {
  var params =  {
    TableName: process.env.DYNAMODB_TABLE
  };

  docClient.scan(params, callback);
});

exports.getSketchById = (sketchId) => promisify(callback => {
  var params =  {
    TableName: process.env.DYNAMODB_TABLE,
    ProjectionExpression: "sketchId,sketchKey",
    FilterExpression: "#sketchId = :sketchId",
    ExpressionAttributeNames: {
      "#sketchId": "sketchId",
    },
    ExpressionAttributeValues: {
      ":sketchId": sketchId
    }
  };

  docClient.scan(params, callback);
});