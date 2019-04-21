
const uuidv4 = require('uuid/v4');
const s3 = require('../service/s3');
const dynamoDb = require('../service/dynamodb');
const multipart = require('lambda-multipart-parser');

const catchHandler = (err) => console.log(err);

const getSketchList = () => {
  return dynamoDb.getSketchList()
  .then(result => {
    return result.Items;
  })
  .catch(catchHandler);
};
  
const getSketch = (Key) => {
	return s3.getSketch({ Key }, 'object')
	.then(result => {
	  return {
      sketchId: Key,
      sketchName: Key,
      file: result.Body
    };
  });
}

const uploadSketch = async (event) => {
  const parsedValue = await multipart.parse(event);

  const { contentType: sketchType, content: body } = parsedValue.files[0],
        sketchUrl = parsedValue.thumbnail,
        sketchName = parsedValue.name,
        sketchId = uuidv4();

  const { sketchKey } = await s3.uploadSketch({ sketchType, body, sketchId, sketchName })
  const result = await dynamoDb.addSketch({ sketchName, sketchType, sketchId, sketchKey, sketchUrl })
  return await {
    result: result,
    sketchId: sketchId,
    sketchName: sketchName
  };
};

const uploadImage = ( image ) => {
  const { sketchName, sketchType, file } = image,
        body = new Buffer(file.replace(/^data:image\/\w+;base64,/, ""),'base64'),
        sketchId = uuidv4();

  return s3.uploadSketch({ sketchName, sketchType, body, sketchId, encoding: 'base64'})
  .then(({ sketchKey }) => {
    dynamoDb.addSketch({ sketchName, sketchType, sketchId, sketchKey })
    .then(result => {
      return {
        sketchId: sketchId,
        sketchName: sketchName
      }
    })
    .catch(catchHandler);
  })
  .catch(catchHandler);
};

const getSketchUrl = ({ sketchId }) => {
  return dynamoDb.getSketchById(sketchId)
  .then(result => {
    const Key = result.Items[0].sketchKey;
    const sketchUrl = s3.getSketch(Key, 'url');
    return {
      ...result.Items[0],
      sketchUrl
    };
  })
  .catch(catchHandler);
}

module.exports = {
  getSketch,
  getSketchUrl,
	getSketchList,
  uploadSketch,
  uploadImage
};
