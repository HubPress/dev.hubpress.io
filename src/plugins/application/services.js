import plugins from '../../plugins'

function initializeRoutes (opts) {
  return plugins.fire('application:routes', opts)
}

// Config
function fireRequestConfig (opts) {
  return plugins.fire('application:request-config', opts)
}

function fireReceiveConfig (opts) {
  return plugins.fire('application:receive-config', opts)
}

function initializeConfig (opts) {
  console.log('application - initializeConfig', opts)
  return fireRequestConfig(opts)
    .then(updatedOpts => fireReceiveConfig(updatedOpts))
}

function initializeApp (rootState, state) {
  return plugins.fire('application:initialize_app', rootState, state)
}

function initializePlugins (rootState, state) {
  return plugins.fire('application:initialize_plugins', rootState, state)
}

export default {
  initializeRoutes,
  initializeApp,
  initializePlugins,
  initializeConfig
}
