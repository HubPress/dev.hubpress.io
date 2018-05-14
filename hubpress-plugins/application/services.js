import plugins from 'hubpress-core-plugins'

function initializeRoutes(opts) {
  return plugins.fire('application:routes', opts)
}

// Config

function fireRequestConfig(opts) {
  return plugins.fire('application:request-config', opts)
}

function fireReceiveConfig(opts) {
  return plugins.fire('application:receive-config', opts)
}

function fireRequestSaveConfig(opts) {
  console.log('application - fireRequestSaveConfig', opts)
  return plugins.fire('application:request-save-config', opts)
}

function initializeConfig(opts) {
  console.log('application - initializeConfig', opts)
  return fireRequestConfig(opts).then(fireReceiveConfig)
}

function startUpConfig(opts) {
  console.log('application - startUpConfig', opts)
  return fireReceiveConfig(opts)
}

function prepareConfig(opts) {
  return plugins.fire('application:prepare-config', opts)
}

function saveConfig(opts) {
  return fireRequestSaveConfig(opts)
    .then(_opts => {
      return Object.assign({}, opts, {
        nextState: _opts.nextState.application,
      })
    })
    .then(fireReceiveConfig)
    .then(_opts => {
      opts.nextState.application = _opts.nextState

      const value = Object.assign({}, opts )
      return value
    })
    .catch(err => {
      console.log(err)
    })
}

function saveConfigDone(opts) {
  return plugins.fire('application:save-config-done', opts)
}

function initializeApp(opts, state) {
  return plugins.fire('application:initialize-app', opts)
}

function initializePlugins(opts, state) {
  return plugins.fire('application:initialize-plugins', opts)
}

export default {
  initializeRoutes,
  initializeApp,
  initializePlugins,
  initializeConfig,
  startUpConfig,
  prepareConfig,
  saveConfig,
  saveConfigDone,
}
