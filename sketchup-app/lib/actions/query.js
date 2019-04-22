import gql from 'graphql-tag';

export const sketchList = gql`
query sketchList {
  sketchList {
  sketchId,
  sketchName,
  sketchUrl
  }
}`;

export const sketchById = gql`
query sketchById($sketchId: String!) {
  sketchById(sketchId: $sketchId) {
    sketchId,
    sketchName,
    sketchUrl
  }
}`

export const uploadSketch = gql`
mutation uploadSketch($file: Upload!, $name: String, $type: String) {
  uploadSketch(file: $file, sketchName: $name, sketchType: $type) {
    sketchId
  }
}`

export const uploadFile = gql`
mutation uploadFile($file: String!, $name: String, $type: String) {
  uploadFile(file: $file, sketchName: $name, sketchType: $type) {
    sketchId
  }
}`
