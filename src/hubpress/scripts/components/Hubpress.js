import React from 'react';
import { Link } from 'react-router';

// Components Material
import AppCanvas from 'material-ui/lib/app-canvas';
import Styles from 'material-ui/lib/styles';
import IconButton from 'material-ui/lib/icon-button';
import ThemeManager from 'material-ui/lib/styles/theme-manager';
// Custom Components
import Container from './Container';
import Loader from './Loader';
import Toastr from './Toastr';
// Theme
import HubPressRawTheme from '../themes/hubpress-raw-theme';
import { start, synchronize } from '../actions/application';
import { connect } from 'react-redux'


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
    const { dispatch } = this.props;
    console.info('HubPress component mounted');
    // fetch configuration and start
    dispatch(start());
  }

  componentWillUpdate(nextProps, nextState) {
    const {dispatch} = this.props;
    const canSync = nextProps.isAuthenticated && nextProps.isInitialized && !nextProps.synchronizeTime;

    if (canSync) {
      dispatch(synchronize());
    }

  }

  _getState() {
    let muiTheme = ThemeManager.getMuiTheme(HubPressRawTheme);
    return {
      loggedIn: this.props.isAuthenticated,
      isInit: this.props.isInitialized,
      muiTheme
    };
  }

  render() {
    let content = (
      <div>
        {this.props.children}
      </div>
    );

    if (this.props.isReady) {
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

// This is our select function that will extract from the state the data slice we want to expose
// through props to our component.
const mapStateToProps = (state/*, props*/) => {
  return {
    isInitialized: state.application.isInitialized,
    isAuthenticated: state.authentication.isAuthenticated,
    synchronizeTime: state.application.synchronize.time,
    isReady: state.application.isInitialized && !state.authentication.isAuthenticated || state.authentication.isAuthenticated && state.application.synchronize.time
  };
};


const ConnectedHubpress = connect(mapStateToProps)(Hubpress)

export default ConnectedHubpress;
