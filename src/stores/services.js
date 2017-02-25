import plugins from 'hubpress-core-plugins'

export function initializeStores (rooState, state) {
  return plugins.fire('application:stores', rooState, state)
}
