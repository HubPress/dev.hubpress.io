import React from 'react';
import { connect } from 'react-redux'

// Actions
import {authenticate} from '../actions/authentication';

// Components
import TextField from 'material-ui/lib/text-field';
import RaisedButton from 'material-ui/lib/raised-button';
import Paper from 'material-ui/lib/paper';

class Login extends React.Component {
  constructor(props, context) {
    super(props, context);
  }

  getStyles() {
    return {
      textField: {
        display: 'block'
      }
    };
  }

  redirectToLoginIfNecessary() {
    if (this.props.isAuthenticated) {
      return this.props.history.pushState(null, '/');
    }
  }

  componentDidMount() {
    this.redirectToLoginIfNecessary()
  }

  componentDidUpdate(prevProps, prevState) {
    this.redirectToLoginIfNecessary()
  }

  _handleChangeEmail(event) {
    this.setState({email: event.target.value});
  }

  _handleChangePassword(event) {
    this.setState({password: event.target.value});
  }

  _handleChangeTwoFactorCode(event) {
    this.setState({twoFactorCode: event.target.value});
  }

  _handleSubmit(event) {
    event.preventDefault();
    const { dispatch } = this.props;
    const credentials = {
      email: this.state.email,
      password: this.state.password,
      twoFactorCode: this.state.twoFactorCode
    };

    dispatch(authenticate(credentials));
  }

  render() {
    let textFieldStyle = this.getStyles().textField;

    let loginButton = (<RaisedButton type="submit" label="Log in" primary={true} />);
    let twoFactorInput = '';
    if (this.props.isFetching) {
      loginButton = (<i className="fa fa-spinner fa-spin"></i>);
    }

    if (this.props.isTwoFactorRequired) {
      twoFactorInput = (
        <TextField style={textFieldStyle} ref="twoFactorCode" onChange={this._handleChangeTwoFactorCode.bind(this)} hintText="Two factor code" />
      );
    }

    return (
      <div className={'login-container'}>

        <Paper zDepth={1} className={'login-paper'}>

          <header><img src="http://hubpress.io/img/logo.png" className="avatar"/>
          <p>Welcome !</p>

          </header>

          <form onSubmit={this._handleSubmit.bind(this)} >
            <TextField style={textFieldStyle} ref="email" hintText="Username or Email" onChange={this._handleChangeEmail.bind(this)} />
            <TextField style={textFieldStyle} ref="password" type="password" hintText="Password" onChange={this._handleChangePassword.bind(this)} />
            {twoFactorInput}
            {loginButton}

          </form>
        </Paper>
      </div>


    );
  }
}

const mapStateToProps = (state/*, props*/) => {
  return {
    isFetching: state.authentication.isFetching,
    isAuthenticated: state.authentication.isAuthenticated,
    credentials: state.authentication.credentials,
    isTwoFactorRequired: state.authentication.twoFactorRequired,
    error: state.authentication.error
  };
}

const ConnectedLogin = connect(mapStateToProps)(Login)

export default ConnectedLogin;
