import axios from 'axios'
import Vuex from 'vuex'
import plugins from 'hubpress-core-plugins'

const state = {
}

const mutations = {}

const actions = {}

let store

function initializeStores(opts) {
  return plugins.fireSync('application:stores', opts)
}

const initStore = () =>  {

  // Load all plugins store
  const opts = {
    currentState: {
      stores: []
    },
  }
  if (store) {
    return store
  }
  const updatedOpts = initializeStores(opts)

  console.log('Updateed', updatedOpts)
  store = new Vuex.Store({
    state,
    actions,
    mutations,
    modules: updatedOpts.nextState.stores
  })
  return store
}
console.log('Store')
export default initStore