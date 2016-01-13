import React from 'react';
import { Link } from 'react-router';

// Components Material
import AppCanvas from 'material-ui/lib/app-canvas';
import Styles from 'material-ui/lib/styles';
import IconButton from 'material-ui/lib/icon-button';
import AppBafleftnar from 'material-ui/lib/app-bar';
import ThemeManager from 'material-ui/lib/styles/theme-manager';
// Custom Components
import Container from './Container';
import Loader from './Loader';
import Toastr from './Toastr';
// Actions
import AppActionCreators from '../actions/AppActionCreators';
// Stores
import AppStore from '../stores/AppStore';
import AuthStore from '../stores/AuthStore';
// Theme
import HubPressRawTheme from '../themes/hubpress-raw-theme';


class Hubpress extends React.Component {

  static get childContextTypes() {
    return {
      muiTheme: React.PropTypes.object,
    };
  }

  constructor(props, context) {
    super(props, context);
    this.state = this._getState();
  }

  getChildContext() {
    return {
      muiTheme: this.state.muiTheme
    };
  }

  componentDidMount() {
    AppStore.addChangeListener(this._onAppStoreChange.bind(this));
    AuthStore.addChangeListener(this._onAuthStoreChange.bind(this));

    // Redirect to login if not connected
    if (!this.props.history.isActive('/login') && !this.state.loggedIn) {
      console.log('Hubpress.js - Redirect to login');
      this.props.history.replaceState(null, '/login');
    }
  }

  componentWillUnmount() {
    AuthStore.removeChangeListener(this._onAuthStoreChange);
  }

  _onAppStoreChange() {
    this.setState(this._getState());
  }

  _onAuthStoreChange() {
    if (!AuthStore.getStatus().loggedIn) {
      this.props.history.replaceState(null, '/login');
      return this.setState(this._getState());
    }

    if (AuthStore.getStatus().loggedIn) {
      setTimeout(() => {
        AppActionCreators.startSynchronize();
      },0);
    }

    this.setState(this._getState());
  }

  _getState() {
    let muiTheme = ThemeManager.getMuiTheme(HubPressRawTheme);
    return {
      loggedIn: AuthStore.getStatus().loggedIn,
      isInit: AppStore.isInitialize(),
      muiTheme
    };
  }

  render() {
    let content = (
      <div>
        {this.props.children}
      </div>
    );

    if (this.state.isInit) {
      return (
        <div>
          <Toastr />
          {content}

        </div>
      );
    }
    else {
      return (
        <div>
          <Toastr />
          <Loader loading={true}></Loader>

        </div>
      );
    }
  }

}

export default Hubpress;
