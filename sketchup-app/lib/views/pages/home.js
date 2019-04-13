'use strict';

import React from 'react';
import Page from '../components/page';
import * as actions from '../../actions';
import { connect } from 'react-redux';

class Home extends React.Component {
  constructor () {
    super();
  }

  componentWillMount () {
    this.props.dispatch(actions.fetchPageData());
    this.props.dispatch(actions.getSketchById('battery.png'));
  }

  render () {
    return (
      <Page className="home-page" header="Home">
        <img src={this.props.image} />
        <a href="/create-sketch"><button class="btn">Create Sketch</button></a>
      </Page>
    );
  }
}

Home.displayName = 'Home';

function select (state) {
  return {
    image: state.homePage.image
  };
}

export default connect(select)(Home);
