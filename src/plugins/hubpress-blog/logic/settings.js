import fires from './fires'

function refreshAfterSavedConfig(opts) {
  return (
    fires
      .fireRequestTheme(opts)
      .then(payload => fires.fireReceiveTheme(opts))
      // Get publishedPosts to rebuild all content
      .then(payload => fires.fireRequestLocalPublishedPosts(opts))
      .then(payload => fires.fireReceiveLocalPublishedPosts(opts))
      // Generate Index / Tags
      .then(payload => {
        console.time('Build content')
        return payload
      })
      .then(payload => fires.fireRequestGenerateIndex(opts))
      .then(payload => fires.fireReceiveGenerateIndex(opts))
      .then(payload => fires.fireRequestGeneratePosts(opts))
      .then(payload => fires.fireReceiveGeneratePosts(opts))
      .then(payload => fires.fireRequestGenerateTags(opts))
      .then(payload => fires.fireReceiveGenerateTags(opts))
      .then(payload => fires.fireRequestGenerateAuthors(opts))
      .then(payload => fires.fireReceiveGenerateAuthors(opts))
      .then(payload => {
        console.timeEnd('Build content')
        return payload
      })
      .then(payload => fires.fireRequestSaveRemotePublishedElements(opts))
      .then(payload => fires.fireReceiveSaveRemotePublishedElements(opts))
  )
}

export default {
  refreshAfterSavedConfig,
}
