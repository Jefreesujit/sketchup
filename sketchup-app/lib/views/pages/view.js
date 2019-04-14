'use strict';

import React from 'react';
import * as actions from '../../actions';
import { connect } from 'react-redux';
import Page from '../components/page';

class ViewSketch extends React.Component {
  constructor () {
    super();
  }

  componentDidMount () {
    const { match: { params } } = this.props;
    this.props.dispatch(actions.getSketchById(params.sketchId));
  }

  render () {
    const { sketchName, sketchUrl } = this.props.sketchDetails;
    return (
      <Page className="home-page" header="Home">
        <h2>{sketchName}</h2>
        <img src={sketchUrl}></img>
      </Page>
    );
  }
}

ViewSketch.displayName = 'ViewSketch';

function select (state) {
  return {
    sketchDetails: state.viewPage.sketchDetails
  };
}

export default connect(select)(ViewSketch);
