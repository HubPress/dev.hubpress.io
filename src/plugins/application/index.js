import services from './services'
import {
  APPLICATION_INITIALIZE_APP,
  APPLICATION_INITIALIZE_CONFIG,
  APPLICATION_PREPARE_CONFIG,
  APPLICATION_SAVE_CONFIG,
  APPLICATION_INITIALIZE_ROUTES,
  APPLICATION_INITIALIZE_PLUGINS
} from '../../stores/constants'
import RootSettings from './components/RootSettings'

export const constants = {
  APPLICATION_PREPARE_CONFIG
}

export function applicationPlugin(context) {
  context.on('application:routes', (opts) => {
    console.info('applicationPlugin - application:routes')
    console.log('applicationPlugin - application:routes', opts)

    opts.nextState.routes.push({
      path: 'settings',
      name: 'settings',
      component: RootSettings
    })
    console.log('applicationPlugin - application:routes - return', opts)
    return opts
  })

  context.on('application:stores', opts => {
    console.info('applicationPlugin - application:stores')
    console.log('applicationPlugin - application:stores', opts)
    const application = {
      state: {
        isInitialized: false,
        isFetching: false,
        routes: [],
        settingsTabs: []
      },
      mutations: {
        [APPLICATION_INITIALIZE_APP](state, nextRootState) {
          _.merge(state, nextRootState.application)
        },
        [APPLICATION_INITIALIZE_PLUGINS](state, nextRootState) {
          _.merge(state, nextRootState.application)
        },
        [APPLICATION_INITIALIZE_ROUTES](state, nextState) {
          _.merge(state, nextState)
        },
        [APPLICATION_INITIALIZE_CONFIG](state, nextState) {
          _.merge(state, nextState)
        },
        [APPLICATION_PREPARE_CONFIG](state, nextState) {
          _.merge(state, nextState)
        },
        [APPLICATION_SAVE_CONFIG](state, nextRootState) {
          _.merge(state, nextRootState.application)
        }
      },
      actions: {
        [APPLICATION_INITIALIZE_ROUTES]({
          commit,
          rootState,
          state
        }) {
          const opts = {
            rootState: _.cloneDeep(rootState),
            currentState: _.cloneDeep(state)
          }
          return services.initializeRoutes(opts)
            .then((opts) => {
              commit(APPLICATION_INITIALIZE_ROUTES, opts.nextState)
            })
        },
        [APPLICATION_INITIALIZE_CONFIG]({
          commit,
          rootState,
          state
        }) {
          const opts = {
            rootState: _.cloneDeep(rootState),
            currentState: _.cloneDeep(state)
          }
          return services.initializeConfig(opts)
            .then(opts => {
              commit(APPLICATION_INITIALIZE_CONFIG, opts.nextState)
            })
        },
        [APPLICATION_INITIALIZE_APP]({
          commit,
          rootState,
          state
        }) {
          const opts = {
            rootState: _.cloneDeep(rootState),
            currentState: _.cloneDeep(rootState)
          }
          return services.initializeApp(opts)
            .then((opts) => {
              commit(APPLICATION_INITIALIZE_APP, opts.nextState)
            })
        },
        [APPLICATION_INITIALIZE_PLUGINS]({
          commit,
          rootState,
          state
        }) {
          const opts = {
            rootState: _.cloneDeep(rootState),
            currentState: _.cloneDeep(rootState)
          }
          return services.initializePlugins(opts)
            .then((opts) => {
              opts.nextState.application.isInitialized = true
              commit(APPLICATION_INITIALIZE_PLUGINS, opts.nextState)
            })
        },
        [APPLICATION_PREPARE_CONFIG]({
          dispatch,
          commit,
          rootState,
          state
        }, formData) {
          const opts = {
            rootState: _.cloneDeep(rootState),
            currentState: _.cloneDeep(state),
            payload: {formData}
          }
          return services.prepareConfig(opts)
            .then((opts) => {
              // Now the nextState.config contains data to save in the config file
              commit(APPLICATION_PREPARE_CONFIG, opts.nextState)
              // Go to save the config
              return dispatch(APPLICATION_SAVE_CONFIG)
            })
        },
        [APPLICATION_SAVE_CONFIG]({
          dispatch,
          commit,
          rootState,
          state
        }) {
          console.log(state)
            const opts = {
              rootState: _.cloneDeep(rootState),
              currentState: _.cloneDeep(rootState)
            }
          return services.saveConfig(opts)
            .then((opts) => {
              commit(APPLICATION_SAVE_CONFIG, opts.nextState)
            })
        }
      },
      getters: {
        navigations: state => {
          return state.routes.filter(route => route.label)
        }
      }
    }

    opts.nextState.stores.application = application
    console.log('applicationPlugin - application:stores - return', opts)
    return opts
  })

  context.on('application:prepare-config', opts => {
    console.info('applicationPlugin - application:prepare-config')
    console.log('applicationPlugin - application:prepare-config', opts)

    opts.nextState.config.meta.cname = opts.payload.formData.get('application-cname')

    console.log('applicationPlugin - application:prepare-config - return', opts)
    return opts
  })

  context.on('application:save-config', opts => {
    console.info('applicationPlugin - application:save-config')
    console.log('applicationPlugin - application:save-config', opts)

    // we should call the save config here

    console.log('applicationPlugin - application:save-config - return', opts)
    return opts
  })
}
