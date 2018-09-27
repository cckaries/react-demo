import React, { Component } from 'react';
import { connect } from 'react-redux';

import Aux from '../Aux/Aux';
import styles from './Layout.scss';
import Toolbar from '../../componenets/Navigation/Toolbar/Toolbar';
import SideDrawer from '../../componenets/Navigation/SideDrawer/SideDrawer';

class layout extends Component {
  state = {
    showSideDrawer: false,
  }

  sideDrawerClosedHandler = () => {
    this.setState({showSideDrawer: false});
  }

  sideDrawerToggleHandler = () => {
    this.setState((prevState) => {
      return {showSideDrawer: !prevState.showSideDrawer}
    });
  }

  render() {
    return (
      <Aux>
        <Toolbar 
          isAuth = {this.props.isAuthenticated}
          drawerToggleClicked={this.sideDrawerToggleHandler} />
        <SideDrawer 
          isAuth = {this.props.isAuthenticated}
          open={this.state.showSideDrawer}
          closed={this.sideDrawerClosedHandler} />
        <main className={styles.Content}>
          {this.props.children}
        </main>
      </Aux>
    );
  }
} 

const mapStateToProps = (state, ownProps) => {
  return {
    isAuthenticated: state.auth.token !== null
  }
};

export default connect(mapStateToProps)(layout);