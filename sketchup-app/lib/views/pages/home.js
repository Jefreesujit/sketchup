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

  getSketchContent (list) {
    if (list.length) {
      return list.map((sketch, index) => {
        return <SketchItem {...sketch} key={index} onItemClick={this.onItemClick}/>
      })
    } else {
      return <div className="no-sketch-content"></div>
    }
  }

  render () {
    return (
      <Page className="home-page" header="Home">
        <div className="action-bar">
          <a href="/create-sketch"><button className="btn btn-primary">Create Sketch</button></a>
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
    sketchList: state.homePage.sketchList
  };
}

export default connect(select)(Home);
