import fires from './fires'
import moment from 'moment'

function initialize(opts) {
  return fires
    .fireRequestTheme(opts)
    .then(updatedOpts => fires.fireReceiveTheme(updatedOpts))
    .then(updatedOpts => {
      if (localStorage.getItem('hubpress:sync')) {
        return fires
          .fireRequestLocalPosts(updatedOpts)
          .then(_updatedOpts => fires.fireReceiveLocalPosts(_updatedOpts))
      }

      return synchronize(updatedOpts)
    })
}

function synchronize(opts) {
  return fires
    .fireRequestRemoteSynchronization(opts)
    .then(updatedOpts => fires.fireReceiveRemoteSynchronization(updatedOpts))
    .then(updatedOpts => {
      updatedOpts.payload.documents = updatedOpts.nextState.posts
      return fires.fireRequestRenderingDocuments(updatedOpts)
    })
    .then(updatedOpts => fires.fireReceiveRenderingDocuments(updatedOpts))
    .then(updatedOpts => fires.fireRequestLocalSynchronization(updatedOpts))
    .then(updatedOpts => fires.fireReceiveLocalSynchronization(updatedOpts))
    .then(updatedOpts => fires.fireRequestLocalPosts(updatedOpts))
    .then(updatedOpts => fires.fireReceiveLocalPosts(updatedOpts))
    .then(updatedOpts => {
      localStorage.setItem('hubpress:sync', moment().format())
      return updatedOpts
    })
}

export default {
  initialize,
  synchronize,
}
