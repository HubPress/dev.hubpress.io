import fires from './fires'

function getLocalPost (opts) {
  console.log('getLocalPost', opts)

  return fires.fireRequestLocalPost(opts)
    .then(payload => fires.fireReceiveLocalPost(opts))
}


export default {
  getLocalPost
}
