import plugins from '../plugins'

export function initializeStores (rooState, state) {
  return plugins.fire('application:stores', rooState, state)
}
