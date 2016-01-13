import React from 'react';
// Stores
import AuthStore from '../stores/AuthStore';

// Actions
import AuthActionCreators from '../actions/AuthActionCreators';

// Components
import TextField from 'material-ui/lib/text-field';
import RaisedButton from 'material-ui/lib/raised-button';
import Paper from 'material-ui/lib/paper';

class Login extends React.Component {
  constructor(props, context) {
    super(props, context);
    console.log('Login - Constructor');
    this.state = {email: '',password: '', twoFactorCode: '', twoFactorRequired: false, loading: false};
  }

  getStyles() {
    return {
      textField: {
        display: 'block'
      }
    };
  }

  componentDidMount() {
    AuthStore.addChangeListener(() => this._onAuthStoreChange());
  }

  componentWillUnmount() {
    AuthStore.removeChangeListener(() => this._onAuthStoreChange());
  }

  _onAuthStoreChange() {
    if (AuthStore.getStatus().loggedIn) {
      return this.props.history.pushState(null, '/');
    }
    return this.setState({loading: false, twoFactorRequired: AuthStore.message && AuthStore.message.otp});
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
    AuthActionCreators.logIn({
      email: this.state.email,
      password: this.state.password,
      twoFactorCode: this.state.twoFactorCode
    });
    this.setState({loading: true});
  }

  render() {
    let textFieldStyle = this.getStyles().textField;

    let loginButton = (<RaisedButton type="submit" label="Log in" primary={true} />);
    let twoFactorInput = '';
    if (this.state.loading) {
      loginButton = (<i className="fa fa-spinner fa-spin"></i>);
    }

    if (this.state.twoFactorRequired) {
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

export default Login;
