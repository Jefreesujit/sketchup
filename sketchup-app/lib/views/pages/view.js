'use strict';

import React from 'react';
import Page from '../components/page';

class ViewSketch extends React.Component {
  constructor () {
    super();
  }

  componentWillMount () {
    //this.props.dispatch(actions.fetchPageData());
  }

  render () {
    return (
      <Page className="home-page" header="Home">
        <h2>This is the view sketch page</h2>
      </Page>
    );
  }
}

ViewSketch.displayName = 'ViewSketch';

export default ViewSketch;
