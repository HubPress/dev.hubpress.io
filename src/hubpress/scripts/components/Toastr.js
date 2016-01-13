import React from 'react';

import Snackbar from 'material-ui/lib/snackbar';
import AppStore from '../stores/AppStore';
import AuthStore from '../stores/AuthStore';
import SettingsStore from '../stores/SettingsStore';
import PostsStore from '../stores/PostsStore';

class Toastr extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.processNotifications = this.processNotifications.bind(this);
    this._onAppStoreChange = this._onAppStoreChange.bind(this);
    this._onAuthStoreChange = this._onAuthStoreChange.bind(this);
    this._onPostsStoreChange = this._onPostsStoreChange.bind(this);
    this._onSettingsStoreChange = this._onSettingsStoreChange.bind(this);
    this.messages = [];
    this.state = {message: '', type: 'default', duration: 3000, open: false};
  }

  componentDidMount() {
    AppStore.addChangeListener(this._onAppStoreChange);
    AuthStore.addChangeListener(this._onAuthStoreChange);
    PostsStore.addChangeListener(this._onPostsStoreChange);
    SettingsStore.addChangeListener(this._onSettingsStoreChange);
  }

  _onAppStoreChange() {
    if (AppStore.message) {
      this.messages.push(AppStore.message);
      this.processNotifications();
    }
  }
  _onAuthStoreChange() {
    if (AuthStore.message) {
      this.messages.push(AuthStore.message);
      this.processNotifications();
    }
  }
  _onPostsStoreChange() {
    if (!PostsStore.isLoading() && PostsStore.message) {
      this.messages.push(PostsStore.message);
      this.processNotifications();
    }
  }
  _onSettingsStoreChange() {
    if (SettingsStore.message) {
      this.messages.push(SettingsStore.message);
      this.processNotifications();
    }
  }

  processNotifications() {
    if (!this.messages.length)
      return;

    let message = this.messages.shift();
    if (this.state.open && message) {
      setTimeout(() => {
        this.processNotifications();
      }, this.state.duration);
    } else {
      setTimeout(() => {
        this.setState({message: '', open: false});
      }, this.state.duration);
    }
    this.setState({message: message.content, type: message.type, open: true});




    //
    // if (message.type === 'error') {
    //   this.refs.toastr.error(
    //     message.content,
    //     message.title, options);
    //
    // }
    // if (message.type === 'warning') {
    //   this.refs.toastr.warning(
    //     message.content,
    //     message.title, options);
    //
    // }
    // if (message.type === 'success') {
    //   this.refs.toastr.success(
    //     message.content,
    //     message.title, options);
    // }

  }

  render() {
    const className = `toastr toastr-${this.state.type}`;
    return (
        <Snackbar
          ref="snackbar"
          open={this.state.open}
          message={this.state.message}
          className={className}
          autoHideDuration={this.state.duration} />
    );
  }
}

export default Toastr;
