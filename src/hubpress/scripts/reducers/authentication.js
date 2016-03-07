
import { setAuthenticated } from '../routerAuth'
import {
  REQUEST_AUTHENTICATION, RECEIVE_AUTHENTICATION, RECEIVE_AUTHENTICATION_OTP, RECEIVE_AUTHENTICATION_FAIL,
  REQUEST_LOGOUT, RECEIVE_LOGOUT, RECEIVE_LOGOUT_FAIL
} from '../actions/authentication'
import {
  RECEIVE_START
} from '../actions/application'

export function authentication (state = {
  isAuthenticated: false,
  isFetching: false,
  twoFactorRequired: false,
  credentials: {}
}, action) {

  switch (action.type) {
    case REQUEST_AUTHENTICATION:
      return Object.assign({}, state, {
        isFetching: true,
        credentials: action.credentials
      });
    case RECEIVE_AUTHENTICATION:
      delete action.payload.authentication.credentials.password;
      const credentials = Object.assign({}, action.payload.authentication.credentials, {
        userInformations: action.payload.authentication.userInformations,
        permissions: action.payload.authentication.permissions,
        token: action.payload.authentication.token
      });
      setAuthenticated(action.payload.authentication.isAuthenticated);
      return Object.assign({}, state, {
        isFetching: false,
        isAuthenticated: action.payload.authentication.isAuthenticated,
        credentials: credentials,
        twoFactorRequired: !!action.payload.authentication.twoFactorRequired,
        error: undefined
      });
    case RECEIVE_AUTHENTICATION_OTP:
      delete action.payload.authentication.credentials.password;
      setAuthenticated(action.payload.authentication.isAuthenticated);
      return Object.assign({}, state, {
        isFetching: false,
        isAuthenticated: action.payload.authentication.isAuthenticated,
        twoFactorRequired: true,
      });
    case RECEIVE_AUTHENTICATION_FAIL:
    setAuthenticated(false);
      return Object.assign({}, state, {
        isFetching: false,
        credentials: {},
        error: action.error
      });
    case REQUEST_LOGOUT:
      return Object.assign({}, state, {
        isFetching: true,
      });
    case RECEIVE_LOGOUT:
      setAuthenticated(false);
      return Object.assign({}, state, {
        isFetching: false,
        isAuthenticated: false,
        credentials: {}
      });
    case RECEIVE_LOGOUT_FAIL:
      return Object.assign({}, state, {
        isFetching: false,
      });
    case RECEIVE_START:

      const authentication = action.payload.authentication
      setAuthenticated(authentication.isAuthenticated);
      return Object.assign({}, state, {
        isFetching: false,
        isAuthenticated: authentication.isAuthenticated,
        credentials: authentication.credentials,
        twoFactorRequired: !!authentication.twoFactorRequired,
        error: undefined
      });
    default:
      return state;
  }
};
