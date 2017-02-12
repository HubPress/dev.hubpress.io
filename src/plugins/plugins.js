import Promise from 'bluebird'
import _ from 'lodash'

const listeners = {
  '*': []
}

function fire (event, opts = {rootState: {}, currentState: {}, payload: {}}) {
  const nextState = opts.nextState || _.cloneDeep(opts.currentState)
  const fullyOpts = Object.assign(opts, {event, nextState})

  listeners[event] = listeners[event] || []
  if (!listeners[event].length) {
    console.info(`No plugin have a callback for the event ${event}`)
    listeners[event].push(_opts => {
      console.log(`Default event function for ${event}`, _opts)
      return _opts
    })
  }

  return (listeners[event].concat(listeners['*']))
  .reduce((memo, promise) => {
    return memo.then(promise)
  }, Promise.resolve(fullyOpts))
}

function on (event, callback) {
  (listeners[event] || (listeners[event] = [])).push(callback)
}

function register (...plugins) {
  const context = {
    on,
    fire
  }

  plugins.forEach(plugin => plugin(context))

  return context
}

export default {
  register,
  fire,
  on
}
