import fires from './fires'

function authenticate(opts) {
  return fires
    .fireRequestAuthentication(opts)
    .then(updatedOpts => fires.fireReceiveAuthentication(updatedOpts))
}

export default {
  authenticate,
}
