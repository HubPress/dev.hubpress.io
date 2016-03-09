import React from 'react';
import { connect } from 'react-redux'
import _ from 'lodash'

import Snackbar from 'material-ui/lib/snackbar';

class Toastr extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.processNotifications = this.processNotifications.bind(this);
    this.messages = [];
    this.state = {message: '', type: 'default', duration: 3000, open: false};
  }

  componentDidMount() {

  }

  componentWillUpdate(nextProps, nextState) {

    if (this.props.message !== nextProps.message && nextProps.message && nextProps.message.content) {
      this.messages.push(nextProps.message);
      this.processNotifications();
    }
  }

  onRequestClose() {

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
  }

  render() {
    const className = `toastr toastr-${this.state.type}`;
    return (
        <Snackbar
          onRequestClose={this.onRequestClose}
          ref="snackbar"
          open={this.state.open}
          message={this.state.message}
          className={className}
          autoHideDuration={this.state.duration} />
    );
  }
}


const mapStateToProps = (state/*, props*/) => {
  return {
    message: state.toastr.message
  };
}

const ConnectedToastr = connect(mapStateToProps)(Toastr)

export default ConnectedToastr;
