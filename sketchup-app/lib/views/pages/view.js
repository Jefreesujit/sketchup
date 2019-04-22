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
      <Page className="view-page" header="View Sketch" loading={this.props.loading}>
        <div className="view-sketch-container">
          <div className="view-sketch-content">
            <h2>{sketchName}</h2>
            <div className="sketch-content">
              <div className="sketch-board">
                <img src={sketchUrl}></img>
              </div>
            </div>
          </div>
        </div>
      </Page>
    );
  }
}

ViewSketch.displayName = 'ViewSketch';

function select (state) {
  return {
    sketchDetails: state.viewPage.sketchDetails,
    loading: state.dataRequests.loading
  };
}

export default connect(select)(ViewSketch);
