import React from 'react';
// Actions
import AuthActionCreators from '../actions/AuthActionCreators';

class Logout extends React.Component {
  constructor(props, context) {
    super(props, context);
  }

  componentDidMount() {
    AuthActionCreators.logOut();
  }

  render() {
    return (
      <div>Bye!</div>
    );
  }
}

export default Logout;
