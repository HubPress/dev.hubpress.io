import plugins from 'hubpress-core-plugins'

export const REQUEST_START = 'REQUEST_START'
export const RECEIVE_START = 'RECEIVE_START'
export const RECEIVE_START_FAIL = 'RECEIVE_START_FAIL'

export const REQUEST_SYNCHRONIZE = 'REQUEST_SYNCHRONIZE'
export const RECEIVE_SYNCHRONIZE = 'RECEIVE_SYNCHRONIZE'
export const RECEIVE_SYNCHRONIZE_FAIL = 'RECEIVE_SYNCHRONIZE_FAIL'


function requestSynchronize (payload) {
  return {
    type: REQUEST_SYNCHRONIZE,
    payload
  }
}

function receiveSynchronize (payload) {
  return {
    type: RECEIVE_SYNCHRONIZE,
    payload
  }
}

function receiveSynchronizeFailure (payload) {
  return {
    type: RECEIVE_SYNCHRONIZE_FAIL,
    payload
  }
}

function requestStart () {
  return {
    type: REQUEST_START,
  }
}

function receiveStart (payload) {
  if (payload.authentication.isAuthenticated) {
    const userInformations = payload.authentication.credentials.userInformations;

    payload.message = {
      content: `Welcome back ${userInformations.name}.`,
      type: 'success'
    }
  }
  return {
    type: RECEIVE_START,
    payload
  }
}

function receiveStartFailure (payload) {
  return {
    type: RECEIVE_START_FAIL,
    payload
  }
}

export function start() {
  return (dispatch, getState) => {
    return dispatch(() => {

      dispatch(requestStart());

      return plugins.fireRequestConfig(getState(), {
        config: {},
        theme: {},
        authentication: {},
        synchronization: {},
        documents: {}
      })
        .then(payload => plugins.fireReceiveConfig(getState(), payload))
        .then(payload => plugins.fireRequestTheme(getState(), payload))
        .then(payload => plugins.fireReceiveTheme(getState(), payload))
        .then(payload => plugins.fireRequestSavedAuth(getState(), payload))
        .then(payload => plugins.fireReceiveSavedAuth(getState(), payload))
        .then(payload => plugins.fireRequestRemoteSynchronization(getState(), payload))
        .then(payload => plugins.fireReceiveRemoteSynchronization(getState(), payload))
        .then(payload => plugins.fireRequestRenderingDocuments(getState(), payload))
        .then(payload => plugins.fireReceiveRenderingDocuments(getState(), payload))
        .then(payload => plugins.fireRequestLocalSynchronization(getState(), payload))
        .then(payload => plugins.fireReceiveLocalSynchronization(getState(), payload))
        .then(payload => dispatch(receiveStart(payload)))
        .catch(failure => dispatch(receiveStartFailure(failure)));

    });
  }
}
