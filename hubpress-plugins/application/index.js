import services from './services'
import {
  APPLICATION_INITIALIZE_APP,
  APPLICATION_INITIALIZE_CONFIG,
  APPLICATION_SAVE_STARTUP_CONFIG,
  APPLICATION_PREPARE_CONFIG,
  APPLICATION_SAVE_CONFIG,
  APPLICATION_SAVE_CONFIG_DONE,
  APPLICATION_INITIALIZE_ROUTES,
  APPLICATION_INITIALIZE_PLUGINS,
  APPLICATION_NOTIFY,
  APPLICATION_CLOSE_NOTIFICATION,
  APPLICATION_LOADING,
  APPLICATION_LOADED,
} from '~/hubpress-plugins/constants'
import RootSettings from './components/RootSettings.vue'

export const constants = {
  APPLICATION_PREPARE_CONFIG,
}

export function applicationPlugin(context) {
  context.on('application:routes', opts => {
    console.info('applicationPlugin - application:routes')
    console.log('applicationPlugin - application:routes', opts)


    opts.nextState.routes.push({
      id: 'application',
      entries: [
        {
          path: 'settings',
          name: 'settings',
          component: RootSettings,
        }
      ]
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
        isLoading: false,
        requireInitilisation: false,
        notification: {
          icon: 'save',
          header: 'My Header',
          message: 'A message',
          level: 'default',
          isVisible: false,
        },
        routes: [],
        plugins: opts.payload.plugins || {},
        settingsTabs: [],
      },
      mutations: {
        [APPLICATION_INITIALIZE_APP](state, nextRootState) {
          _.merge(state, nextRootState.application)
        },
        [APPLICATION_INITIALIZE_PLUGINS](state, nextRootState) {
          _.merge(state, nextRootState.application)
        },
        [APPLICATION_INITIALIZE_ROUTES](state, routes) {
          state.routes = routes
        },
        [APPLICATION_INITIALIZE_CONFIG](state, nextState) {
          _.merge(state, nextState)
        },
        [APPLICATION_PREPARE_CONFIG](state, nextState) {
          _.merge(state, nextState)
        },
        [APPLICATION_SAVE_STARTUP_CONFIG](state, nextState) {
          _.merge(state, nextState)
        },
        [APPLICATION_SAVE_CONFIG](state, nextRootState) {
          _.merge(state, nextRootState.application)
        },
        [APPLICATION_SAVE_CONFIG_DONE](state, nextRootState) {
          _.merge(state, nextRootState.application)
        },
        [APPLICATION_NOTIFY](state, notification) {
          notification.isVisible = true
          _.merge(state.notification, notification)
        },
        [APPLICATION_CLOSE_NOTIFICATION](state, notification) {
          state.notification.isVisible = false
        },
        [APPLICATION_LOADING](state, notification) {
          state.isLoading = true
        },
        [APPLICATION_LOADED](state, notification) {
          state.isLoading = false
        },
      },
      actions: {
        // [APPLICATION_INITIALIZE_ROUTES]({ commit, rootState, state }) {
        //   const opts = {
        //     rootState: _.cloneDeep(rootState),
        //     currentState: _.cloneDeep(state),
        //   }
        //   return services.initializeRoutes(opts).then(opts => {
        //     commit(APPLICATION_INITIALIZE_ROUTES, opts.nextState)
        //   })
        // },
        [APPLICATION_INITIALIZE_CONFIG]({ commit, rootState, state }) {
          const opts = {
            rootState: _.cloneDeep(rootState),
            currentState: _.cloneDeep(state),
          }
          return services.initializeConfig(opts).then(opts => {
            commit(APPLICATION_INITIALIZE_CONFIG, opts.nextState)
          })
        },
        [APPLICATION_INITIALIZE_APP]({ commit, rootState, state }) {
          const opts = {
            rootState: _.cloneDeep(rootState),
            currentState: _.cloneDeep(rootState),
          }
          return services.initializeApp(opts).then(opts => {
            console.log('helllllllo', opts)
            commit(APPLICATION_INITIALIZE_APP, opts.nextState)
          })
        },
        [APPLICATION_INITIALIZE_PLUGINS]({ commit, rootState, state }) {
          const opts = {
            rootState: _.cloneDeep(rootState),
            currentState: _.cloneDeep(rootState),
          }
          return services.initializePlugins(opts).then(opts => {
            opts.nextState.application.isInitialized = true
            commit(APPLICATION_INITIALIZE_PLUGINS, opts.nextState)
          })
        },
        [APPLICATION_PREPARE_CONFIG](
          { dispatch, commit, rootState, state },
          formData,
        ) {
          const opts = {
            rootState: _.cloneDeep(rootState),
            currentState: _.cloneDeep(state),
            nextState: _.cloneDeep(state),
            payload: { formData },
          }
          opts.currentState.isLoading = true
          opts.nextState.isLoading = true
          return dispatch(APPLICATION_LOADING)
            .then(_ => services.prepareConfig(opts))
            .then(opts => {
              // Now the nextState.config contains data to save in the config file
              commit(APPLICATION_PREPARE_CONFIG, opts.nextState)
              // Go to save the config
              return dispatch(APPLICATION_SAVE_CONFIG)
            })
        },
        [APPLICATION_SAVE_STARTUP_CONFIG](
          { dispatch, commit, rootState, state },
          formValues,
        ) {
          const opts = {
            rootState: _.cloneDeep(rootState),
            currentState: _.cloneDeep(state),
            nextState: _.cloneDeep(state),
          }

          opts.nextState.config.meta.username = formValues.username
          opts.nextState.config.meta.repositoryName = formValues.repositoryName
          opts.nextState.config.meta.branch = formValues.branch
          opts.nextState.config.meta.cname = formValues.cname
          opts.nextState.requireInitilisation = false

          return services.startUpConfig(opts).then(opts => {
            commit(APPLICATION_SAVE_STARTUP_CONFIG, opts.nextState)
          })
        },
        [APPLICATION_SAVE_CONFIG](
          { dispatch, commit, rootState, state },
          doNotEmitSaveConfigDone,
        ) {
          const opts = {
            rootState: _.cloneDeep(rootState),
            currentState: _.cloneDeep(rootState),
            nextState: _.cloneDeep(rootState),
          }
          console.log(opts)
          return services.saveConfig(opts).then(opts => {
            console.log('testsettesse', opts)
            commit(APPLICATION_SAVE_CONFIG, opts.nextState)
            if (!doNotEmitSaveConfigDone) {
              return dispatch(APPLICATION_SAVE_CONFIG_DONE)
            }
          })
        },
        [APPLICATION_SAVE_CONFIG_DONE]({ dispatch, commit, rootState, state }) {
          const opts = {
            rootState: _.cloneDeep(rootState),
            currentState: _.cloneDeep(rootState),
            nextState: _.cloneDeep(rootState),
          }
          return services
            .saveConfigDone(opts)
            .then(opts => {
              commit(APPLICATION_SAVE_CONFIG_DONE, opts.nextState)
            })
            .then(_ => dispatch('application:loaded'))
            .then(_ =>
              dispatch('application:notify', {
                icon: 'save',
                header: 'Settings saved',
                message:
                  'Your settings have been saved and your blog was rebuild with success. ',
                level: 'success',
              }),
            )
        },
        [APPLICATION_NOTIFY](
          { dispatch, commit, rootState, state },
          notification,
        ) {
          commit(APPLICATION_NOTIFY, notification)
        },
        [APPLICATION_CLOSE_NOTIFICATION]({
          dispatch,
          commit,
          rootState,
          state,
        }) {
          commit(APPLICATION_CLOSE_NOTIFICATION)
        },
        [APPLICATION_LOADING]({ dispatch, commit, rootState, state }) {
          commit(APPLICATION_LOADING)
        },
        [APPLICATION_LOADED]({ dispatch, commit, rootState, state }) {
          commit(APPLICATION_LOADED)
        },
      },
      getters: {
        navigations: state => {
          return state.routes.filter(route => route.label)
        },
      },
    }

    opts.nextState.stores.application = application
    console.log('applicationPlugin - application:stores - return', opts)
    return opts
  })

  context.on('application:prepare-config', opts => {
    console.info('applicationPlugin - application:prepare-config')
    console.log('applicationPlugin - application:prepare-config', opts)

    opts.nextState.config.meta.cname = opts.payload.formData.get(
      'application-cname',
    )

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

  context.on('application:initialize-plugins', opts => {
    console.info('applicationPlugin - application:initialize-plugins')
    console.log('applicationPlugin - application:initialize-plugins', opts)

    opts.nextState.application.contentTypes = opts.nextState.application.plugins.map(
      plugin => {
        return plugin.contentTypes || []
      }
    ).reduce((memo, value) => {
      return [...memo, ...value]
    }, [])

    console.log('applicationPlugin - application:initialize-plugins - return', opts)
    return opts
  })

}
