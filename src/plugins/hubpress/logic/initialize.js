import fires from './fires'
import moment from 'moment'

function initialize(opts) {
  return fires.fireRequestTheme(opts)
    .then(updatedOpts => fires.fireReceiveTheme(updatedOpts))
    .then(updatedOpts => {
      if (localStorage.getItem('hubpress:sync'))
        return fires.fireRequestLocalPosts(updatedOpts)
          .then(payload => fires.fireReceiveLocalPosts(updatedOpts))

      return synchronize(updatedOpts)
    })
}

function synchronize(opts) {
  return fires.fireRequestRemoteSynchronization(opts)
    .then(payload => fires.fireReceiveRemoteSynchronization(opts))
    .then(payload => fires.fireRequestRenderingDocuments(opts))
    .then(payload => fires.fireReceiveRenderingDocuments(opts))
    .then(payload => fires.fireRequestLocalSynchronization(opts))
    .then(payload => fires.fireReceiveLocalSynchronization(opts))
    .then(payload => fires.fireRequestLocalPosts(opts))
    .then(payload => fires.fireReceiveLocalPosts(opts))
    .then(payload => {
      localStorage.setItem('hubpress:sync', moment().format())
      return payload
    })
};

export default {
  initialize,
  synchronize
}
