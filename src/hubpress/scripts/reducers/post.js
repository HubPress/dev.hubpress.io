import {
  REQUEST_LOCAL_POST, RECEIVE_LOCAL_POST, RECEIVE_LOCAL_POST_FAIL, SWITCH_VIEWING, SWITCH_LIGHT,
  REQUEST_RENDER_AND_LOCAL_SAVE, RECEIVE_RENDER_AND_LOCAL_SAVE, RECEIVE_RENDER_AND_LOCAL_SAVE_FAIL,

  REQUEST_REMOTE_SAVE,
  RECEIVE_REMOTE_SAVE,
  RECEIVE_REMOTE_SAVE_FAIL,

  REQUEST_PUBLISH_POST,
  RECEIVE_PUBLISH_POST,
  RECEIVE_PUBLISH_POST_FAIL,

  REQUEST_UNPUBLISH_POST,
  RECEIVE_UNPUBLISH_POST,
  RECEIVE_UNPUBLISH_POST_FAIL
} from '../actions/post';

import {
  RECEIVE_LOGOUT
} from '../actions/authentication';

export function post (state = {
  isFetching: false,
  isViewing: false,
  isDark: false,
  isRendering: false,
  post: {}
}, action) {

  switch (action.type) {
    case REQUEST_LOCAL_POST:
      return Object.assign({}, state, {
        isFetching: true,
        post: {}
      });
    case RECEIVE_LOCAL_POST:
      return Object.assign({}, state, {
        isFetching: false,
        post: action.payload.post
      });
    case RECEIVE_LOCAL_POST_FAIL:
      return Object.assign({}, state, {
        isFetching: false,
        post: {}
      });
    case REQUEST_RENDER_AND_LOCAL_SAVE:
      return Object.assign({}, state, {
        isRendering: true,
      });
    case RECEIVE_RENDER_AND_LOCAL_SAVE:
      return Object.assign({}, state, {
        isRendering: false,
        post: action.payload.post
      });
    case RECEIVE_RENDER_AND_LOCAL_SAVE_FAIL:
      return Object.assign({}, state, {
        isRendering: false,
      });
    case SWITCH_VIEWING:
      return Object.assign({}, state, {
        isViewing: !state.isViewing
      });
    case SWITCH_LIGHT:
      return Object.assign({}, state, {
        isDark: !state.isDark
      });
    case REQUEST_REMOTE_SAVE:
      return Object.assign({}, state, {
        isFetching: true,
      });
    case RECEIVE_REMOTE_SAVE:
      return Object.assign({}, state, {
        isFetching: false,
        post: action.payload.post
      });
    case RECEIVE_REMOTE_SAVE_FAIL:
      return Object.assign({}, state, {
        isFetching: false,
      });
    case REQUEST_PUBLISH_POST:
      return Object.assign({}, state, {
        isFetching: true
      });
    case RECEIVE_PUBLISH_POST:
      return Object.assign({}, state, {
        isFetching: false,
        post: action.payload.post
      });
    case RECEIVE_PUBLISH_POST_FAIL:
      return Object.assign({}, state, {
        isFetching: false,
      });
    case REQUEST_UNPUBLISH_POST:
      return Object.assign({}, state, {
        isFetching: true
      });
    case RECEIVE_UNPUBLISH_POST:
      return Object.assign({}, state, {
        isFetching: false,
        post: action.payload.post
      });
    case RECEIVE_UNPUBLISH_POST_FAIL:
      return Object.assign({}, state, {
        isFetching: false,
      });
    case RECEIVE_LOGOUT:
      return Object.assign({}, state, {
        isFetching: false,
        isViewing: false,
        isRendering: false,
        post: {}
      });
    default:
      return state;
  }
};
