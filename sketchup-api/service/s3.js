const AWS = require('aws-sdk');
const s3 = new AWS.S3({
  httpOptions: {timeout: 0},
  signatureVersion: 'v4',
  params: {
    Bucket: process.env.S3_BUCKET
  }
});

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

exports.uploadSketch = (sketch) => promisify(callback => {
  const { sketchName, file, sketchType, sketchId } = sketch,
        buffer = new Buffer(file.replace(/^data:image\/\w+;base64,/, ""),'base64'),
        sketchKey = `${sketchId}-${sketchName}.png`
        params = {
          Key: sketchKey, 
          Body: buffer,
          ContentEncoding: 'base64',
          ContentType: sketchType
        };

	s3.putObject(params, (err, data) => callback(err, { sketchKey }));
});

exports.getSketchList = () => promisify(callback => {
	s3.listObjects({}, callback);
});

exports.getSketch = (Key, type) => {
  if (type === 'url') {
    return s3.getSignedUrl('getObject', { Key, Expires: 120 });
  } else {
    return promisify(callback => s3.getObject({ Key }, callback))
  }
}