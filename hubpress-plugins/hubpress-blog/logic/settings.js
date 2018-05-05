import fires from './fires'

function refreshAfterSavedConfig(opts) {
  return (
    fires
      .fireRequestTheme(opts)
      .then(_opts => fires.fireReceiveTheme(opts))
      // Get publishedPosts to rebuild all content
      .then(_opts => fires.fireRequestLocalPublishedPosts(_opts))
      .then(_opts => fires.fireReceiveLocalPublishedPosts(_opts))
      // Generate Index / Tags
      .then(_opts => {
        console.time('Build content')
        return _opts
      })
      .then(_opts => fires.fireRequestGenerateIndex(_opts))
      .then(_opts => fires.fireReceiveGenerateIndex(_opts))
      .then(_opts => fires.fireRequestGeneratePosts(_opts))
      .then(_opts => fires.fireReceiveGeneratePosts(_opts))
      .then(_opts => fires.fireRequestGenerateTags(_opts))
      .then(_opts => fires.fireReceiveGenerateTags(_opts))
      .then(_opts => fires.fireRequestGenerateAuthors(_opts))
      .then(_opts => fires.fireReceiveGenerateAuthors(_opts))
      // Generate pages
      // Get publishedPages to rebuild all content
      .then(_opts => fires.fireRequestLocalPublishedPages(_opts))
      .then(_opts => fires.fireReceiveLocalPublishedPages(_opts))
      .then(_opts => fires.fireRequestGeneratePages(_opts))
      .then(_opts => fires.fireReceiveGeneratePages(_opts))
      .then(_opts => {
        console.timeEnd('Build content')
        return _opts
      })
      .then(_opts => fires.fireRequestSaveRemotePublishedElements(_opts))
      .then(_opts => fires.fireReceiveSaveRemotePublishedElements(_opts))
  )
}

export default {
  refreshAfterSavedConfig,
}
