'use strict';

import React from 'react';
import Page from '../components/page';
import * as actions from '../../actions';
import { connect } from 'react-redux';
import SketchItem from '../components/listItem';

class Home extends React.Component {
  constructor () {
    super();
  }

  componentDidMount () {
    this.props.dispatch(actions.fetchPageData());
  }

  onItemClick = (id) => {
    this.props.history.push(`/view-sketch/${id}`);
  }

  createSketchHandler = () => {
    this.props.history.push(`/create-sketch`);
  }

  getSketchContent (list) {
    if (list.length) {
      return list.map((sketch, index) => {
        return <SketchItem {...sketch} key={index} onItemClick={this.onItemClick}/>
      })
    } else {
      return <div className="no-sketch-content">No Sketches available, click hte button above to create Sketches</div>
    }
  }

  render () {
    return (
      <Page className="home-page" header="Home" loading={this.props.loading} >
        <div className="action-bar">
          <a onClick={this.createSketchHandler}><button className="btn btn-primary">Create Sketch</button></a>
        </div>
        <div className="sketch-list-section">
          {this.getSketchContent(this.props.sketchList)}
        </div>
      </Page>
    );
  }
}

Home.displayName = 'Home';

function select (state) {
  return {
    sketchList: state.homePage.sketchList,
    loading: state.dataRequests.loading
  };
}

export default connect(select)(Home);
