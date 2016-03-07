import plugins from 'hubpress-core-plugins';
import _ from 'lodash';

export const REQUEST_LOCAL_POST = 'REQUEST_LOCAL_POST'
export const RECEIVE_LOCAL_POST = 'RECEIVE_LOCAL_POST'
export const RECEIVE_LOCAL_POST_FAIL = 'RECEIVE_LOCAL_POST_FAIL'
export const SWITCH_VIEWING = 'SWITCH_VIEWING'
export const REQUEST_RENDER_AND_LOCAL_SAVE = 'REQUEST_RENDER_AND_LOCAL_SAVE'
export const RECEIVE_RENDER_AND_LOCAL_SAVE = 'RECEIVE_RENDER_AND_LOCAL_SAVE'
export const RECEIVE_RENDER_AND_LOCAL_SAVE_FAIL = 'RECEIVE_RENDER_AND_LOCAL_SAVE_FAIL'
export const REQUEST_REMOTE_SAVE = 'REQUEST_REMOTE_SAVE'
export const RECEIVE_REMOTE_SAVE = 'RECEIVE_REMOTE_SAVE'
export const RECEIVE_REMOTE_SAVE_FAIL = 'RECEIVE_REMOTE_SAVE_FAIL'
export const REQUEST_PUBLISH_POST = 'REQUEST_PUBLISH_POST'
export const RECEIVE_PUBLISH_POST = 'RECEIVE_PUBLISH_POST'
export const RECEIVE_PUBLISH_POST_FAIL = 'RECEIVE_PUBLISH_POST_FAIL'
export const REQUEST_UNPUBLISH_POST = 'REQUEST_UNPUBLISH_POST'
export const RECEIVE_UNPUBLISH_POST = 'RECEIVE_UNPUBLISH_POST'
export const RECEIVE_UNPUBLISH_POST_FAIL = 'RECEIVE_UNPUBLISH_POST_FAIL'
export const REQUEST_DELETE_POST = 'REQUEST_DELETE_POST'
export const RECEIVE_DELETE_POST = 'RECEIVE_DELETE_POST'
export const RECEIVE_DELETE_POST_FAIL = 'RECEIVE_DELETE_POST_FAIL'

function requestLocalPost (payload) {
  return {
    type: REQUEST_LOCAL_POST,
    payload
  }
}

function receiveLocalPost (payload) {
  return {
    type: RECEIVE_LOCAL_POST,
    payload
  }
}

function receiveLocalPostFailure (payload) {
  return {
    type: RECEIVE_LOCAL_POST_FAIL,
    payload
  }
}

export function getLocalPost (idPost) {
  return (dispatch, getState) => {
    return dispatch(() => {
      const payload = {
        post: {_id: idPost},
        config: getState().application.config
      };
      dispatch(requestLocalPost(payload))
      return plugins.fireRequestLocalPost(getState(), payload)
        .then(payload => plugins.fireReceiveLocalPost(getState(), payload))
        .then(payload => dispatch(receiveLocalPost(payload)))
        .catch(failure => dispatch(receiveLocalPostFailure(failure)));

    })
  }
}

function emitSwitchViewing () {
  return {
    type: SWITCH_VIEWING
  }
}

export function switchViewing () {
  return (dispatch, getState) => {
    return dispatch(() => {
      dispatch(emitSwitchViewing())
    })
  }
}

function requestRenderAndLocalSave (payload) {
  return {
    type: REQUEST_RENDER_AND_LOCAL_SAVE,
    payload
  }
}

function receiveRenderAndLocalSave (payload) {
  return {
    type: RECEIVE_RENDER_AND_LOCAL_SAVE,
    payload
  }
}

function receiveRenderAndLocalSaveFailure (payload) {
  return {
    type: RECEIVE_RENDER_AND_LOCAL_SAVE_FAIL,
    payload
  }
}

export function renderAndLocalSave (idPost, content) {
  return (dispatch, getState) => {
    return dispatch(() => {
      const payload = {
        post: {_id: idPost, content},
        config: getState().application.config
      };
      dispatch(requestRenderAndLocalSave(payload))
      return plugins.fireRequestRenderingPost(getState(), payload)
        .then(payload => plugins.fireReceiveRenderingPost(getState(), payload))
        .then(payload => {

          if (payload.post && payload.post.title) {
            return plugins.fireRequestSaveLocalPost(getState(), payload)
            .then(payload => plugins.fireReceiveSaveLocalPost(getState(), payload));
          }

          return payload;
        })
        .then(payload => dispatch(receiveRenderAndLocalSave(payload)))
        .catch(failure => dispatch(receiveRenderAndLocalSaveFailure(failure)));
    })
  }
}

function requestRemoteSave (payload) {
  return {
    type: REQUEST_REMOTE_SAVE,
    payload
  }
}

function receiveRemoteSave (payload) {
  payload.message = {
    content: "Post saved",
    type: "success"
  };

  return {
    type: RECEIVE_REMOTE_SAVE,
    payload
  }
}

function receiveRemoteSaveFailure (payload) {
  payload.message = {
    content: "Post not saved. See your browser\'s console.",
    type: "error"
  };
  return {
    type: RECEIVE_REMOTE_SAVE_FAIL,
    payload
  }
}

export function remoteSave (idPost) {
  return (dispatch, getState) => {
    return dispatch(() => {
      const payload = {
        post: {_id: idPost},
        config: getState().application.config
      };
      dispatch(requestRemoteSave(payload))
      return plugins.fireRequestLocalPost(getState(), payload)
        .then(payload => plugins.fireReceiveLocalPost(getState(), payload))
        .then(payload => plugins.fireRequestSaveRemotePost(getState(), payload))
        .then(payload => plugins.fireReceiveSaveRemotePost(getState(), payload))
        .then(payload => plugins.fireRequestSaveLocalPost(getState(), payload))
        .then(payload => plugins.fireReceiveSaveLocalPost(getState(), payload))
        .then(payload => dispatch(receiveRemoteSave(payload)))
        .catch(failure => dispatch(receiveRemoteSaveFailure(failure)));
    })
  }
}


function requestPublishPost (payload) {
  return {
    type: REQUEST_PUBLISH_POST,
    payload
  }
}

function receivePublishPost (payload) {
  payload.message = {
    content: "Post published",
    type: "success"
  };
  return {
    type: RECEIVE_PUBLISH_POST,
    payload
  }
}

function receivePublishPostFailure (payload) {
  payload.message = {
    content: "Post not published. See your browser\'s console.",
    type: "error"
  };
  return {
    type: RECEIVE_PUBLISH_POST_FAIL,
    payload
  }
}

export function publish(idPost) {
  return (dispatch, getState) => {
    return dispatch(() => {
      const payload = {
        post: {_id: idPost},
        config: getState().application.config,
        theme: getState().application.theme
      };
      dispatch(requestPublishPost(payload))
      return plugins.fireRequestLocalPost(getState(), payload)
        .then(payload => plugins.fireReceiveLocalPost(getState(), payload))
        .then(payload => {
          // Save the tags before the original is erase after remote save
          const oTags = (payload.post.original && payload.post.original.tags) || [];
          payload.tags = _.union(payload.post.tags, oTags);;
          return payload;
        })
        .then(payload => plugins.fireRequestSaveRemotePost(getState(), payload))
        .then(payload => plugins.fireReceiveSaveRemotePost(getState(), payload))
        // Maybe we should make something fireRequestMarkAsPublished
        .then(payload => {
          payload.post.published = 1;
          return payload;
        })
        .then(payload => plugins.fireRequestSaveLocalPost(getState(), payload))
        .then(payload => plugins.fireReceiveSaveLocalPost(getState(), payload))
        // Get publishedPosts to rebuild all content
        .then(payload => plugins.fireRequestLocalPublishedPosts(getState(), payload))
        .then(payload => plugins.fireReceiveLocalPublishedPosts(getState(), payload))
        // Generate Index / Post / Tags
        .then(payload => plugins.fireRequestGenerateIndex(getState(), payload))
        .then(payload => plugins.fireReceiveGenerateIndex(getState(), payload))
        .then(payload => plugins.fireRequestGeneratePost(getState(), payload))
        .then(payload => plugins.fireReceiveGeneratePost(getState(), payload))
        .then(payload => plugins.fireRequestGenerateTags(getState(), payload))
        .then(payload => plugins.fireReceiveGenerateTags(getState(), payload))
        .then(payload => plugins.fireRequestGenerateAuthors(getState(), payload))
        .then(payload => plugins.fireReceiveGenerateAuthors(getState(), payload))
        .then(payload => plugins.fireRequestSaveRemotePublishedElements(getState(), payload))
        .then(payload => plugins.fireReceiveSaveRemotePublishedElements(getState(), payload))
        .then(payload => dispatch(receivePublishPost(payload)))
        .catch(failure => dispatch(receivePublishPostFailure(failure)));
    })
  }
}

function requestUnpublishPost (payload) {
  return {
    type: REQUEST_UNPUBLISH_POST,
    payload
  }
}

function receiveUnpublishPost (payload) {
  payload.message = {
    content: "Post unpublished.",
    type: "success"
  };
  return {
    type: RECEIVE_UNPUBLISH_POST,
    payload
  }
}

function receiveUnpublishPostFailure (payload) {
  payload.message = {
    content: "Post not unpublished. See your browser\'s console.",
    type: "error"
  };
  return {
    type: RECEIVE_UNPUBLISH_POST_FAIL,
    payload
  }
}

export function unpublish(idPost) {
  return (dispatch, getState) => {
    return dispatch(() => {
      const payload = {
        post: {_id: idPost},
        config: getState().application.config,
        theme: getState().application.theme
      };
      dispatch(requestUnpublishPost(payload))
      return plugins.fireRequestLocalPost(getState(), payload)
        .then(payload => plugins.fireReceiveLocalPost(getState(), payload))
        .then(payload => {
          // Save the tags before the original is erase after remote save
          const oTags = (payload.post.original && payload.post.original.tags) || [];
          payload.tags = oTags;
          return payload;
        })
        .then(payload => plugins.fireRequestDeleteRemotePublishedPost(getState(), payload))
        .then(payload => plugins.fireReceiveDeleteRemotePublishedPost(getState(), payload))
        // Maybe we should make something fireRequestMarkAsPublished
        .then(payload => {
          payload.post.published = 0;
          return payload;
        })
        .then(payload => plugins.fireRequestSaveLocalPost(getState(), payload))
        .then(payload => plugins.fireReceiveSaveLocalPost(getState(), payload))
        // Get publishedPosts to rebuild all content
        .then(payload => plugins.fireRequestLocalPublishedPosts(getState(), payload))
        .then(payload => plugins.fireReceiveLocalPublishedPosts(getState(), payload))
        // Generate Index / Tags
        .then(payload => plugins.fireRequestGenerateIndex(getState(), payload))
        .then(payload => plugins.fireReceiveGenerateIndex(getState(), payload))
        .then(payload => plugins.fireRequestGenerateTags(getState(), payload))
        .then(payload => plugins.fireReceiveGenerateTags(getState(), payload))
        .then(payload => plugins.fireRequestGenerateAuthors(getState(), payload))
        .then(payload => plugins.fireReceiveGenerateAuthors(getState(), payload))
        .then(payload => plugins.fireRequestSaveRemotePublishedElements(getState(), payload))
        .then(payload => plugins.fireReceiveSaveRemotePublishedElements(getState(), payload))
        .then(payload => dispatch(receiveUnpublishPost(payload)))
        .catch(failure => dispatch(receiveUnpublishPostFailure(failure)));
    });
  }
}

function requestDeletePost (payload) {
  return {
    type: REQUEST_DELETE_POST,
    payload
  }
}

function receiveDeletePost (payload) {
  payload.message = {
    content: "Post deleted.",
    type: "success"
  };
  return {
    type: RECEIVE_DELETE_POST,
    payload
  }
}

function receiveDeletePostFailure (payload) {
  payload.message = {
    content: "Post not deleted. See your browser\'s console.",
    type: "error"
  };
  return {
    type: RECEIVE_DELETE_POST_FAIL,
    payload
  }
}

export function deletePost(idPost) {
  return (dispatch, getState) => {
    return dispatch(() => {
      const payload = {
        post: {_id: idPost},
        config: getState().application.config,
        theme: getState().application.theme
      };
      dispatch(requestDeletePost(payload))
      return plugins.fireRequestLocalPost(getState(), payload)
        .then(payload => plugins.fireReceiveLocalPost(getState(), payload))
        .then(payload => {
          // Save the tags before the original is erase after remote save
          const oTags = (payload.post.original && payload.post.original.tags) || [];
          payload.tags = oTags;
          return payload;
        })
        .then(payload => {
          if (payload.post.original) {
            return plugins.fireRequestDeleteRemotePost(getState(), payload)
                  .then(payload => plugins.fireReceiveDeleteRemotePost(getState(), payload))
          }
          else {
            return payload;
          }
        })
        // Delete from local
        .then(payload => plugins.fireRequestDeleteLocalPost(getState(), payload))
        .then(payload => plugins.fireReceiveDeleteLocalPost(getState(), payload))
        .then(payload => {
          if (!payload.post.published) {
            return payload;
          }
          else {
            return plugins.fireRequestDeleteRemotePublishedPost(getState(), payload)
                  .then(payload => plugins.fireReceiveDeleteRemotePublishedPost(getState(), payload))
                  // Get publishedPosts to rebuild all content
                  .then(payload => plugins.fireRequestLocalPublishedPosts(getState(), payload))
                  .then(payload => plugins.fireReceiveLocalPublishedPosts(getState(), payload))
                  // Generate Index / Tags
                  .then(payload => plugins.fireRequestGenerateIndex(getState(), payload))
                  .then(payload => plugins.fireReceiveGenerateIndex(getState(), payload))
                  .then(payload => plugins.fireRequestGenerateTags(getState(), payload))
                  .then(payload => plugins.fireReceiveGenerateTags(getState(), payload))
                  .then(payload => plugins.fireRequestGenerateAuthors(getState(), payload))
                  .then(payload => plugins.fireReceiveGenerateAuthors(getState(), payload))
                  .then(payload => plugins.fireRequestSaveRemotePublishedElements(getState(), payload))
                  .then(payload => plugins.fireReceiveSaveRemotePublishedElements(getState(), payload))
          }
        })
        .then(payload => dispatch(receiveDeletePost(payload)))
        .catch(failure => dispatch(receiveDeletePostFailure(failure)));
    })
  }
}
