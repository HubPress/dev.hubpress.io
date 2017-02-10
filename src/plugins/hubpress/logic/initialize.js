import fires from './fires'

function initialize(opts) {
  return fires.fireRequestTheme(opts)
    .then(updatedOpts => fires.fireReceiveTheme(updatedOpts))
    .then(synchronize)
}

function synchronize(opts) {
  // return fires.fireRequestRemoteSynchronization(opts)
  //   .then(payload => fires.fireReceiveRemoteSynchronization(opts))
  //   .then(payload => fires.fireRequestRenderingDocuments(opts))
  //   .then(payload => fires.fireReceiveRenderingDocuments(opts))
  //   .then(payload => fires.fireRequestLocalSynchronization(opts))
  //   .then(payload => fires.fireReceiveLocalSynchronization(opts))
  //   .then(payload => fires.fireRequestLocalPosts(opts))
  //   .then(payload => fires.fireReceiveLocalPosts(opts))

  return fires.fireRequestLocalPosts(opts)
    .then(payload => fires.fireReceiveLocalPosts(opts))
};

export default {
  initialize,
  synchronize
}
