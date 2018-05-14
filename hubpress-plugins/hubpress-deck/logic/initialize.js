import fires from './fires'
import moment from 'moment'

function initialize(opts) {
  // return fires
    // .fireRequestTheme(opts)
    // .then(updatedOpts => fires.fireReceiveTheme(updatedOpts))
    // .then(updatedOpts => {
      if (localStorage.getItem('deck:sync')) {
        return fires
          .fireRequestLocalDecks(opts)
          .then(_updatedOpts => fires.fireReceiveLocalDecks(_updatedOpts))
      }

      return synchronize(opts)
    // })
}

function synchronize(opts) {
  return fires
    .fireRequestRemoteSynchronization(opts)
    .then(updatedOpts => fires.fireReceiveRemoteSynchronization(updatedOpts))
    .then(updatedOpts => {
      updatedOpts.payload.documents = updatedOpts.nextState.decks
      return updatedOpts
    })
    .then(updatedOpts => fires.fireRequestRenderingDocuments(updatedOpts))
    .then(updatedOpts => fires.fireReceiveRenderingDocuments(updatedOpts))
    .then(updatedOpts => {
      updatedOpts.payload.documents = updatedOpts.nextState.decks
      updatedOpts.payload.defaultType = 'deck'
      return updatedOpts
    })
    .then(updatedOpts => fires.fireRequestLocalSynchronization(updatedOpts))
    .then(updatedOpts => fires.fireReceiveLocalSynchronization(updatedOpts))
    .then(updatedOpts => fires.fireRequestLocalDecks(updatedOpts))
    .then(updatedOpts => fires.fireReceiveLocalDecks(updatedOpts))
    .then(updatedOpts => {
      // localStorage.setItem('deck:sync', moment().format())
      return updatedOpts
    })
}

export default {
  initialize,
  synchronize,
}
