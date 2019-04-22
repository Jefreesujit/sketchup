
const uuidv4 = require('uuid/v4');
const s3 = require('../service/s3');
const dynamoDb = require('../service/dynamodb');

const catchHandler = (err) => console.log(err);

const getSketchList = () => {
  return dynamoDb.getSketchList()
  .then(result => {
    console.log('getSketchList', result.Items, typeof result.Items);
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

const uploadSketch = (parent, { file, sketchName }) => {
	const { filename, mimetype, createReadStream } = file;
	const stream = createReadStream();
	// Promisify the stream and store the file, then…
	return {
		sketchId: filename,
		sketchName: sketchName
	};
};

const uploadImage = ( image ) => {
  const { sketchName, sketchType } = image,
        sketchId = uuidv4();

  return s3.uploadSketch({ ...image, sketchId})
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
