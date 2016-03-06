import plugins from 'hubpress-core-plugins';

export const REQUEST_SAVE_CONFIG = 'REQUEST_SAVE_CONFIG'
export const RECEIVE_SAVE_CONFIG = 'RECEIVE_SAVE_CONFIG'
export const RECEIVE_SAVE_CONFIG_FAIL = 'RECEIVE_SAVE_CONFIG_FAIL'

function requestSaveConfig (payload) {
  return {
    type: REQUEST_SAVE_CONFIG,
    payload
  }
}

function receiveSaveConfig (payload) {
  payload.message = {
    content: "Settings saved and content refreshed",
    type: "success"
  };
  return {
    type: RECEIVE_SAVE_CONFIG,
    payload
  }
}

function receiveSaveConfigFail (payload) {
  payload.message = {
    content: "Settings not saved. See your browser\'s console.",
    type: "error"
  };
  return {
    type: RECEIVE_SAVE_CONFIG_FAIL,
    payload
  }
}
export function saveConfig (config) {
  return (dispatch, getState) => {
    return dispatch(() => {
      const payload = {
        config
      }
      dispatch(requestSaveConfig(payload))
      return plugins.fireRequestSaveConfig(getState(), payload)
        .then(payload => plugins.fireReceiveConfig(getState(), payload))
        .then(payload => plugins.fireRequestTheme(getState(), payload))
        .then(payload => plugins.fireReceiveTheme(getState(), payload))

        // Get publishedPosts to rebuild all content
        .then(payload => plugins.fireRequestLocalPublishedPosts(getState(), payload))
        .then(payload => plugins.fireReceiveLocalPublishedPosts(getState(), payload))
        // Generate Index / Tags
        .then(payload => plugins.fireRequestGenerateIndex(getState(), payload))
        .then(payload => plugins.fireReceiveGenerateIndex(getState(), payload))
        .then(payload => plugins.fireRequestGeneratePosts(getState(), payload))
        .then(payload => plugins.fireReceiveGeneratePosts(getState(), payload))
        .then(payload => plugins.fireRequestGenerateTags(getState(), payload))
        .then(payload => plugins.fireReceiveGenerateTags(getState(), payload))
        .then(payload => plugins.fireRequestGenerateAuthors(getState(), payload))
        .then(payload => plugins.fireReceiveGenerateAuthors(getState(), payload))
        .then(payload => plugins.fireRequestSaveRemotePublishedElements(getState(), payload))
        .then(payload => plugins.fireReceiveSaveRemotePublishedElements(getState(), payload))

        .then(payload => dispatch(receiveSaveConfig(payload)))
        .catch(failure => dispatch(receiveSaveConfigFailure(failure)));

    })
  }
}
