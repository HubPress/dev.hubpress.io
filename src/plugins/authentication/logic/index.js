import plugins from 'hubpress-core-plugins'

// SavedAuth
function fireRequestSavedAuth(opts) {
  return plugins.fire('requestSavedAuth', opts)
}

function fireReceiveSavedAuth(opts) {
  return plugins.fire('receiveSavedAuth', opts)
}

// Authentication
function fireRequestAuthentication(opts) {
  return plugins.fire('requestAuthentication', opts)
}

function fireReceiveAuthentication(opts) {
  // Do not fire event if OTP is required
  if (opts.nextState.twoFactorRequired) {
    return payload
  }

  return plugins.fire('receiveAuthentication', opts)
}

function fireRequestLogout(opts) {
  return plugins.fire('requestLogout', opts)
}

function fireReceiveLogout(opts) {
  return plugins.fire('receiveLogout', opts)
}

// Initialize app
function initialize(opts) {
  return fireRequestSavedAuth(opts).then(updatedOpts =>
    fireReceiveSavedAuth(updatedOpts),
  )
}

function authenticate(opts) {
  return fireRequestAuthentication(opts).then(updatedOpts =>
    fireReceiveAuthentication(updatedOpts),
  )
}

export default {
  authenticate,
  initialize,
}
