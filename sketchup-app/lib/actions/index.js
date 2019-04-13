/** This provides the various redux actions to trigger app state changes by the redux reducer
 * @module Redux actions
 */

import axios from 'axios';
import gql from 'graphql-tag';
import graphQlClient from './appolloClient';
export const LOCATION_CHANGE = '@@router/LOCATION_CHANGE';
export const FETCHING_PAGEDATA = 'FETCHING_PAGEDATA';
export const SET_PAGEDATA = 'SET_PAGEDATA';
export const SAVE_IMAGE = 'SAVE_IMAGE';
export const SAVING_IMAGE = 'SAVING_IMAGE';

const apiUrl = 'http://localhost:3000/query';

export function fetchingPageData () {
  return {
    type: FETCHING_PAGEDATA
  };
}

export function setPageData (data) {
  return {
    type: SET_PAGEDATA,
    payload: data
  };
}

export function savingImage () {
  return {
    type: SAVING_IMAGE
  };
}

export function saveImageData (data) {
  return {
    type: SAVE_IMAGE,
    payload: data
  };
}

export function fetchPageData () {
  return function (dispatch) {
    dispatch(fetchingPageData());
    graphQlClient.query({
      query: gql`
      query sketchList {
        sketchList {
          sketchId,
          sketchName
        }
      }`
    })
    .then(function (response) {
      console.log(response.data.data.sketchFile.sketchUrl);
      var image = response.data.data.sketchFile.sketchUrl;
      dispatch(setPageData({image}));
  });
  };
}

export function getSketchById (sketchId) {
  return function (dispatch) {
    dispatch(fetchingPageData());
    graphQlClient.query({
      query: gql`
      query sketchById($sketchId: String!) {
        sketchById(sketchId: $sketchId) {
          sketchId,
          sketchName,
          sketchUrl
        }
      }`,
      variables: { sketchId }
    })
    .then(function (response) {
      console.log(response.data.data.sketchFile.sketchUrl);
      var image = response.data.data.sketchFile.sketchUrl;
      dispatch(setPageData({image}));
  });
  };
}

export function saveSketch (vars) {
  return function (dispatch) {
    dispatch(savingImage());
    graphQlClient.mutate({
      mutation: gql`
        mutation uploadSketch($file: Upload!, $name: String, $type: String) {
          uploadSketch(file: $file, sketchName: $name, sketchType: $type) {
            sketchId
          }
        }
      `,
      variables: { ...vars }
    })
    .then(result => console.log(result))
  };
}

export function saveImage (vars) {
  return function (dispatch) {
    dispatch(savingImage());
    graphQlClient.mutate({
      mutation: gql`
        mutation uploadFile($file: String!, $name: String, $type: String) {
          uploadFile(file: $file, sketchName: $name, sketchType: $type) {
            sketchId
          }
        }
      `,
      variables: { ...vars }
    })
    .then(result => console.log(result))
  };
}
