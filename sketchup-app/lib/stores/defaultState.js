'use strict';

let state = {
  app: {
    current: {
      path: '',
      pageTitle: ''
    }
  },
  homePage: {
    sketchList: []
  },
  viewPage: {
    sketchDetails: {}
  },
  dataRequests: {
    loading: true
  }
};

export default state;
