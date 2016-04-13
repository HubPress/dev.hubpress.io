import plugins from 'hubpress-core-plugins';

export const REQUEST_AUTHENTICATION = 'REQUEST_AUTHENTICATION';
export const RECEIVE_AUTHENTICATION = 'RECEIVE_AUTHENTICATION';
export const RECEIVE_AUTHENTICATION_FAIL = 'RECEIVE_AUTHENTICATION_FAIL';
export const RECEIVE_AUTHENTICATION_OTP = 'RECEIVE_AUTHENTICATION_OTP';
export const REQUEST_LOGOUT = 'REQUEST_LOGOUT';
export const RECEIVE_LOGOUT = 'RECEIVE_LOGOUT';
export const RECEIVE_LOGOUT_FAIL = 'RECEIVE_LOGOUT_FAIL';


function requestAuthentication (credentials) {
  return {
    type: REQUEST_AUTHENTICATION,
    credentials
  };
}

function receiveAuthentication (payload) {

  let type;
  if (payload.authentication.twoFactorRequired) {
    type = RECEIVE_AUTHENTICATION_OTP;
    payload.message = {
      content: 'A two-factor payload code is needed.',
      type: 'warning'
    };
  }
  else {
    type = RECEIVE_AUTHENTICATION;
    const userInformations = payload.authentication.userInformations;

    payload.message = {
      content: `Welcome back ${userInformations.name || userInformations.login}.`,
      type: 'success'
    };
  }

  return {
    type,
    payload
  };
}

function receiveAuthenticationFail (failure) {
  return {
    type: RECEIVE_AUTHENTICATION_FAIL,
    error: failure.error
  };
}

export function authenticate (credentials) {
  return (dispatch, getState) => {
    return dispatch(() => {
      dispatch(requestAuthentication(credentials));
      return plugins.fireRequestAuthentication(getState(), {
        authentication: {credentials},
        config: getState().application.config,
        synchronization: {},
        documents: {}
      })
        .then(json => plugins.fireReceiveAuthentication(getState(), json))
        .then(json => dispatch(receiveAuthentication(json)))
        .catch(failure => dispatch(receiveAuthenticationFail(failure)));

    });
  };
}

function requestLogout () {
  return {
    type: REQUEST_LOGOUT,
  };
}

function receiveLogout () {
  return {
    type: RECEIVE_LOGOUT,
  }
}

function receiveLogoutFail (failure) {
  return {
    type: RECEIVE_LOGOUT_FAIL,
    error: failure.error
  };
}

export function logout () {
  return (dispatch, getState) => {
    return dispatch(() => {
      dispatch(requestLogout());
      return plugins.fireRequestLogout(getState(), {})
        .then(json => plugins.fireReceiveLogout(getState(), json))
        .then(json => dispatch(receiveLogout(json)))
        .catch(failure => dispatch(receiveLogoutFail(failure)));

    });
  };
}
