import plugins from 'hubpress-core-plugins'

export const REQUEST_LOCAL_POSTS = 'REQUEST_LOCAL_POSTS'
export const RECEIVE_LOCAL_POSTS = 'RECEIVE_LOCAL_POSTS'
export const RECEIVE_LOCAL_POSTS_FAIL = 'RECEIVE_LOCAL_POSTS_FAIL'
export const REQUEST_SELECTED_POST = 'REQUEST_SELECTED_POST'
export const RECEIVE_SELECTED_POST = 'RECEIVE_SELECTED_POST'
export const RECEIVE_SELECTED_POST_FAIL = 'RECEIVE_SELECTED_POST_FAIL'

function requestLocalPosts () {
  return {
    type: REQUEST_LOCAL_POSTS
  }
}

function receiveLocalPosts (payload) {
  return {
    type: RECEIVE_LOCAL_POSTS,
    payload
  }
}

function receiveLocalPostsFailure (payload) {
  return {
    type: RECEIVE_LOCAL_POSTS_FAIL,
    payload
  }
}
function requestSelectedPost (payload) {
  return {
    type: REQUEST_SELECTED_POST,
    payload
  }
}

function receiveSelectedPost (payload) {
  return {
    type: RECEIVE_SELECTED_POST,
    payload
  }
}

function receiveSelectedPostFailure (payload) {
  return {
    type: RECEIVE_SELECTED_POST_FAIL,
    payload
  }
}

export function getLocalPosts () {
  return (dispatch, getState) => {
    return dispatch(() => {
      dispatch(requestLocalPosts())
      return plugins.fireRequestLocalPosts(getState(), {})
        .then(json => plugins.fireReceiveLocalPosts(getState(), json))
        .then(json => dispatch(receiveLocalPosts(json)))
        .catch(failure => dispatch(receiveLocalPostsFailure(failure)));

    })
  }
}

export function getSelectedPost (_id) {
  return (dispatch, getState) => {
    return dispatch(() => {
      const payload = {
        post: {_id}
      };
      dispatch(requestSelectedPost(payload))
      return plugins.fireRequestSelectedPost(getState(), payload)
        .then(json => plugins.fireReceiveSelectedPost(getState(), json))
        .then(json => dispatch(receiveSelectedPost(json)))
        .catch(failure => dispatch(receiveSelectedPostFailure(failure)));

    })
  }
}
