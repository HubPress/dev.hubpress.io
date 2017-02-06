import _ from 'lodash'
import services from './services'
import {APPLICATION_INITIALIZE_APP, APPLICATION_INITIALIZE_CONFIG, APPLICATION_INITIALIZE_ROUTES, APPLICATION_INITIALIZE_PLUGINS} from '../constants'

export {default as services} from './services'

export default {
  state: {
    isInitialized: false,
    isFetching: false,
    routes: []
  },
  mutations: {
    [APPLICATION_INITIALIZE_ROUTES] (state, next) {
      _.merge(state, next)
    },
    [APPLICATION_INITIALIZE_CONFIG] (state, next) {
      _.merge(state, next)
    },
    [APPLICATION_INITIALIZE_APP] (state, nextRootState) {
      _.merge(state, nextRootState.application)
    },
    [APPLICATION_INITIALIZE_PLUGINS] (state, nextRootState) {
      _.merge(state, nextRootState.application)
    }
  },
  actions: {
    [APPLICATION_INITIALIZE_ROUTES] ({commit, rootState, state}) {
      const opts = {
        rootState: _.cloneDeep(rootState),
        currentState: _.cloneDeep(state)
      }
      return services.initializeRoutes(opts)
        .then((opts) => {
          commit(APPLICATION_INITIALIZE_ROUTES, opts.nextState)
        })
    },
    [APPLICATION_INITIALIZE_CONFIG] ({commit, rootState, state}) {
      const opts = {
        rootState: _.cloneDeep(rootState),
        currentState: _.cloneDeep(state)
      }
      return services.initializeConfig(opts)
      .then(opts => {
        commit(APPLICATION_INITIALIZE_CONFIG, opts.nextState)
      })
    },
    // This action is here to initialize all store
    // Maybe irt should be in the root store
    [APPLICATION_INITIALIZE_APP] ({commit, rootState, state}) {
      const opts = {
        rootState: _.cloneDeep(rootState),
        currentState: _.cloneDeep(rootState)
      }
      return services.initializeApp(opts)
        .then((opts) => {
          commit(APPLICATION_INITIALIZE_APP, opts.nextState)
        }
      )
    },
    [APPLICATION_INITIALIZE_PLUGINS] ({commit, rootState, state}) {
      const opts = {
        rootState: _.cloneDeep(rootState),
        currentState: _.cloneDeep(rootState)
      }
      return services.initializePlugins(opts)
        .then((opts) => {
          opts.nextState.application.isInitialized = true
          commit(APPLICATION_INITIALIZE_PLUGINS, opts.nextState)
        }
      )
    }
  },
  getters: {
    navigations: state => {
      return state.routes.filter(route => route.label)
    }
  }
}
