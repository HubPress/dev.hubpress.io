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

function fireRequestSaveConfig (opts) {
  return plugins.fire('application:request-save-config', opts)
}

function initializeConfig (opts) {
  console.log('application - initializeConfig', opts)
  return fireRequestConfig(opts)
    .then(fireReceiveConfig)
}

function prepareConfig (opts) {
  return plugins.fire('application:prepare-config', opts)
}

function saveConfig(opts) {
  return fireRequestSaveConfig(opts)
        .then(_opts => {
          return Object.assign({}, opts, {
            nextState: opts.nextState.application
          })
        })
        .then(fireReceiveConfig)
        .then(_opts => {
          opts.nextState.application = _opts.nextState
          return opts
        })
        .then(opts => plugins.fire('application:save-config-done', opts))
}

function initializeApp (rootState, state) {
  return plugins.fire('application:initialize-app', rootState, state)
}

function initializePlugins (rootState, state) {
  return plugins.fire('application:initialize-plugins', rootState, state)
}

export default {
  initializeRoutes,
  initializeApp,
  initializePlugins,
  initializeConfig,
  prepareConfig,
  saveConfig
}
