import React from 'react';
import { connect } from 'react-redux'
import { logout } from '../actions/authentication';
import Paper from 'material-ui/lib/paper';

class Logout extends React.Component {
  constructor(props, context) {
    super(props, context);
  }

  componentDidMount() {
    // TODO run logout and change url
    const { dispatch } = this.props;
    dispatch(logout());
    setTimeout(() => {
      return this.props.history.pushState(null, '/');
    }, 1000);
  }

  render() {
    return (
      <div className={'login-container'}>

        <Paper zDepth={1} className={'login-paper'}>

          <header><img src="http://hubpress.io/img/logo.png" className="avatar"/>
          <p>Bye, see you soon ;)</p>

          </header>
        </Paper>
      </div>
    );
  }
}

export default Logout;
const mapStateToProps = (state/*, props*/) => {
  return {

  };
}

const ConnectedLogout = connect(mapStateToProps)(Logout)

export default ConnectedLogout;
