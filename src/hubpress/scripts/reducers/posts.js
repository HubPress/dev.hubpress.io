import {
  REQUEST_SYNCHRONIZE, RECEIVE_SYNCHRONIZE, RECEIVE_SYNCHRONIZE_FAIL
} from '../actions/application';

import {
  REQUEST_LOCAL_POSTS, RECEIVE_LOCAL_POSTS,
  REQUEST_SELECTED_POST, RECEIVE_SELECTED_POST
} from '../actions/posts';

import {
  REQUEST_DELETE_POST, RECEIVE_DELETE_POST, RECEIVE_DELETE_POST_FAIL
} from '../actions/post';

import {
  RECEIVE_LOGOUT
} from '../actions/authentication';


export function posts (state = {
  isFetching: false,
  posts: []
}, action) {

  switch (action.type) {
    case REQUEST_SYNCHRONIZE:
      return Object.assign({}, state, {
        isFetching: true
      });
    case RECEIVE_SYNCHRONIZE:
      const _posts = action.payload.posts;
      return Object.assign({}, state, {
        isFetching: false,
        posts: _posts,
        selectedPost: _posts[0]
      });
    case RECEIVE_SYNCHRONIZE_FAIL:
      return Object.assign({}, state, {
        isFetching: false
      });
    case REQUEST_LOCAL_POSTS:
      return Object.assign({}, state, {
        isFetching: true
      });
    case RECEIVE_LOCAL_POSTS:
      return Object.assign({}, state, {
        isFetching: false,
        posts: action.payload.posts,
        selectedPost: action.payload.posts[0]
      });
    case REQUEST_SELECTED_POST:
      return Object.assign({}, state, {
        isFetching: true
      });
    case RECEIVE_SELECTED_POST:
      return Object.assign({}, state, {
        isFetching: false,
        selectedPost: action.payload.selectedPost,
      });
    case REQUEST_DELETE_POST:
      return Object.assign({}, state, {
        isFetching: true
      });
    case RECEIVE_DELETE_POST:
      const posts = state.posts.filter(post => post._id !== action.payload.post._id)

      return Object.assign({}, state, {
        isFetching: false,
        posts: posts,
        selectedPost: posts[0]
      });
    case RECEIVE_DELETE_POST_FAIL:
      return Object.assign({}, state, {
        isFetching: false,
      });
    case RECEIVE_LOGOUT:
      return Object.assign({}, state, {
        isFetching: false,
        posts: []
      });
    default:
      return state;
  }
};
