/** This provides the various redux actions to trigger app state changes by the redux reducer
 * @module Redux actions
 */

import { sketchList, sketchById, uploadFile, uploadSketch } from './query';
import axios from 'axios';
import history from '../stores/history';
import graphQlClient from './appolloClient';
import * as conf from '../../config.json';

/* events */
export const LOCATION_CHANGE = '@@router/LOCATION_CHANGE';
export const FETCHING_PAGEDATA = 'FETCHING_PAGEDATA';
export const SET_PAGEDATA = 'SET_PAGEDATA';
export const SET_SKETCHDATA = 'SET_SKETCHDATA';
export const SAVE_IMAGE = 'SAVE_IMAGE';
export const SAVING_IMAGE = 'SAVING_IMAGE';

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

export function setSketchData (data) {
  return {
    type: SET_SKETCHDATA,
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
      query: sketchList
    })
    .then(function (response) {
      var sketchList = response.data.sketchList;
      dispatch(setPageData({sketchList}));
    });
  };
}

export function getSketchById (sketchId) {
  return function (dispatch) {
    dispatch(fetchingPageData());
    graphQlClient.query({
      query: sketchById,
      variables: { sketchId }
    })
    .then(function (response) {
      var sketchDetails = response.data.sketchById;
      dispatch(setSketchData({sketchDetails}));
    });
  };
}

export function saveSketch (vars) {
  return function (dispatch) {
    dispatch(savingImage());
    graphQlClient.mutate({
      mutation: uploadSketch,
      variables: { ...vars }
    })
    .then(result => console.log(result))
  };
}

export function saveImage (vars) {
  return function (dispatch) {
    dispatch(savingImage());
    graphQlClient.mutate({
      mutation: uploadFile,
      variables: { ...vars }
    })
    .then(result => console.log(result))
  };
}

export function uploadImage (data) {
  const config = {
    headers: { 'Content-Type': 'multipart/form-data' }
  };

  return function (dispatch) {
    dispatch(savingImage());
    axios.post(`${conf.apiUrl}/upload`, data, config)
    .then(result => {
      console.log(result);
      history.push('/');
    })
  };
}
