import Vue from 'vue'
import Vuex from 'vuex'
import _ from 'lodash'
// import applicationStore from './application'
import { initializeStores } from './services'

Vue.use(Vuex)

const state = {
  stores: {}
}
const actions = {}
const mutations = {}

export default {
  initStores: function () {
    const opts = {
      rootState: _.cloneDeep(state),
      currentState: _.cloneDeep(state)
    }
    return initializeStores(opts)
      .then(opts => {
        // opts.nextState.stores.application = applicationStore
        _.merge(state, opts.nextState)
        const rootStore = {
          state,
          actions,
          mutations,
          modules: opts.nextState.stores
        }

        const store = new Vuex.Store(rootStore)
        return store
      })
  }
}
