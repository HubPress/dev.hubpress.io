import plugins from './plugins'

function fire (eventName, opts = {rootState: {}, currentState: {}, payload: {}, nextState: {}}) {
  // console.log('========== Fire event :'+eventName, state, json);
  // Faut cloner le rootState et passer le clone au fire
  // ou le faire dans le fire a voir
  return plugins.fire(eventName, opts)
  .then(opts => {
    // console.info(eventName, 'fire.plugins', opts)
    return opts // || opts // FIXME
    // reconstruit l'opts pour garantir le non changement du rootState et fu
    // payload
  })
}

export default {
  register: plugins.register,
  on: plugins.on,
  fire
}
