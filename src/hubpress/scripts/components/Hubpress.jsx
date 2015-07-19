const React = window.React = require('react');

const Router = require('react-router');
const RouteHandler = Router.RouteHandler;

// Components
const Navbar = require('./Navbar');
const Loader = require('./Loader');

// Actions
import AppActionCreators from '../actions/AppActionCreators';

// Store
import AuthStore from '../stores/AuthStore';
import AppStore from '../stores/AppStore';
import PostsStore from '../stores/PostsStore';
import SettingsStore from '../stores/SettingsStore';

function _appState(){
  return {
    loggedIn: AuthStore.getStatus().loggedIn,
    isInit: AppStore.isInitialize()
  };
}

class Hubpress extends React.Component {

  constructor(props, context) {
    super(props, context);
    this.state= _appState();
    this.context = context;
    this.router = context.router;
    this.props = props;
  }

  componentDidMount() {
    AppStore.addChangeListener(this._onAppStoreChange.bind(this));
    AuthStore.addChangeListener(this._onAuthStoreChange.bind(this));
    PostsStore.addChangeListener(this._onPostsStoreChange.bind(this));
    SettingsStore.addChangeListener(this._onSettingsStoreChange.bind(this));
  }

  componentWillUnmount() {
    AuthStore.removeChangeListener(this._onAuthStoreChange);
  }

  _onAppStoreChange() {
    if (AppStore.message) {
      this.showNotification(AppStore.message);
    }
    this.setState(_appState());
  }

  _onSettingsStoreChange() {
    if (SettingsStore.message) {
      this.showNotification(SettingsStore.message);
    }
    //this.setState(_appState());
  }

  _onAuthStoreChange() {
    if (AuthStore.message) {
      this.showNotification(AuthStore.message);
    }
    if (!AuthStore.getStatus().loggedIn) {
      this.router.transitionTo('/');
      this.setState(_appState());
      return;
    }

    if (AuthStore.getStatus().loggedIn) {
      setTimeout(() => {
        AppActionCreators.startSynchronize();
      },0);
    }

    this.setState(_appState());
  }

  _onPostsStoreChange() {
    if (!PostsStore.isLoading() && PostsStore.message) {
      this.showNotification(PostsStore.message);
    }
    this.setState(_appState());
  }

  showNotification(message) {
    let options = {
      closeButton: true,
      timeOut: 6000,
      extendedTimeOut: 1000
    };
    if (message.type === 'error') {
      /*
        this.refs.toastr.error(
        message.content,
        message.title, options);
        */

    }
    if (message.type === 'warning') {
      /*
      this.refs.toastr.warning(
        message.content,
        message.title, options);
      */
    }
    if (message.type === 'success') {
      /*

      this.refs.toastr.success(
        message.content,
        message.title, options);
      */
    }

  }

  render(){

    let navbar;
    if (this.state.loggedIn)
      navbar = (
        <div>
          <Navbar/>
        </div>
      );


    if (this.state.isInit) {
      return (
        <div>
          {navbar}
          <RouteHandler/>
          </div>
        );
    }
    else
      return (
        <Loader loading={true}></Loader>
      );

    }
}

Hubpress.contextTypes = {
    router: React.PropTypes.func.isRequired
};

export default Hubpress;
