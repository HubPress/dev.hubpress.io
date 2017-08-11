import fires from './fires'

function getLocalPost(opts) {
  console.log('getLocalPost', opts)

  return fires
    .fireRequestLocalPost(opts)
    .then(opts => fires.fireReceiveLocalPost(opts))
}

function getLocalPosts(opts) {
  return fires
    .fireRequestLocalPosts(opts)
    .then(updatedOpts => fires.fireReceiveLocalPosts(updatedOpts))
}

function renderAndSavePost(opts) {
  return fires
    .fireRequestLocalPost(opts)
    .then(updatedOpts => fires.fireReceiveLocalPost(updatedOpts))
    .then(updatedOpts => {
      updatedOpts.nextState.post.content = updatedOpts.payload.post.content
      return updatedOpts
    })
    .then(updatedOpts => fires.fireRequestRenderingPost(updatedOpts))
    .then(updatedOpts => fires.fireReceiveRenderingPost(updatedOpts))
    .then(updatedOpts => {
      if (updatedOpts.nextState.post && updatedOpts.nextState.post.title) {
        return fires
          .fireRequestSaveLocalPost(updatedOpts)
          .then(updatedOpts => fires.fireReceiveSaveLocalPost(updatedOpts))
      }

      return updatedOpts
    })
}

function remoteSavePost(opts) {
  return fires
    .fireRequestLocalPost(opts)
    .then(updatedOpts => fires.fireReceiveLocalPost(updatedOpts))
    .then(updatedOpts => fires.fireRequestSaveRemotePost(updatedOpts))
    .then(updatedOpts => fires.fireReceiveSaveRemotePost(updatedOpts))
    .then(updatedOpts => fires.fireRequestSaveLocalPost(updatedOpts))
    .then(updatedOpts => fires.fireReceiveSaveLocalPost(updatedOpts))
}

function publishPost(opts) {
  return (
    fires
      .fireRequestLocalPost(opts)
      .then(updatedOpts => fires.fireReceiveLocalPost(updatedOpts))
      .then(updatedOpts => {
        // Save the tags before the original is erase after remote save
        const oTags =
          (updatedOpts.nextState.post.original &&
            updatedOpts.nextState.post.original.tags) ||
          []
        updatedOpts.nextState.tags = _.union(
          updatedOpts.nextState.post.tags,
          oTags,
        )
        return updatedOpts
      })
      .then(updatedOpts => fires.fireRequestSaveRemotePost(updatedOpts))
      .then(updatedOpts => fires.fireReceiveSaveRemotePost(updatedOpts))
      // Maybe we should make something fireRequestMarkAsPublished
      .then(updatedOpts => {
        updatedOpts.nextState.post.original.author =
          updatedOpts.nextState.post.original.author ||
          updatedOpts.nextState.post.author
        updatedOpts.nextState.post.published = 1
        return updatedOpts
      })
      .then(updatedOpts => fires.fireRequestSaveLocalPost(updatedOpts))
      .then(updatedOpts => fires.fireReceiveSaveLocalPost(updatedOpts))
      // Get publishedPosts to rebuild all content
      .then(updatedOpts => fires.fireRequestLocalPublishedPosts(updatedOpts))
      .then(updatedOpts => fires.fireReceiveLocalPublishedPosts(updatedOpts))
      // Generate Index / Post / Tags
      .then(updatedOpts => fires.fireRequestGenerateIndex(updatedOpts))
      .then(updatedOpts => fires.fireReceiveGenerateIndex(updatedOpts))
      .then(updatedOpts => fires.fireRequestGeneratePost(updatedOpts))
      .then(updatedOpts => fires.fireReceiveGeneratePost(updatedOpts))
      .then(updatedOpts => fires.fireRequestGenerateTags(updatedOpts))
      .then(updatedOpts => fires.fireReceiveGenerateTags(updatedOpts))
      .then(updatedOpts => fires.fireRequestGenerateAuthors(updatedOpts))
      .then(updatedOpts => fires.fireReceiveGenerateAuthors(updatedOpts))
      .then(updatedOpts =>
        fires.fireRequestSaveRemotePublishedElements(updatedOpts),
      )
      .then(updatedOpts =>
        fires.fireReceiveSaveRemotePublishedElements(updatedOpts),
      )
  )
}

function unpublishPost(opts) {
  return (
    fires
      .fireRequestLocalPost(opts)
      .then(updatedOpts => fires.fireReceiveLocalPost(updatedOpts))
      .then(updatedOpts => {
        // Save the tags before the original is erase after remote save
        const oTags =
          (updatedOpts.nextState.post.original &&
            updatedOpts.nextState.post.original.tags) ||
          []
        updatedOpts.nextState.tags = oTags
        return updatedOpts
      })
      .then(updatedOpts =>
        fires.fireRequestDeleteRemotePublishedPost(updatedOpts),
      )
      .then(updatedOpts =>
        fires.fireReceiveDeleteRemotePublishedPost(updatedOpts),
      )
      // Maybe we should make something fireRequestMarkAsPublished
      .then(updatedOpts => {
        updatedOpts.nextState.post.published = 0
        return updatedOpts
      })
      .then(updatedOpts => fires.fireRequestSaveLocalPost(updatedOpts))
      .then(updatedOpts => fires.fireReceiveSaveLocalPost(updatedOpts))
      // Get publishedPosts to rebuild all content
      .then(updatedOpts => fires.fireRequestLocalPublishedPosts(updatedOpts))
      .then(updatedOpts => fires.fireReceiveLocalPublishedPosts(updatedOpts))
      // Generate Index / Tags
      .then(updatedOpts => fires.fireRequestGenerateIndex(updatedOpts))
      .then(updatedOpts => fires.fireReceiveGenerateIndex(updatedOpts))
      .then(updatedOpts => fires.fireRequestGenerateTags(updatedOpts))
      .then(updatedOpts => fires.fireReceiveGenerateTags(updatedOpts))
      .then(updatedOpts => fires.fireRequestGenerateAuthors(updatedOpts))
      .then(updatedOpts => fires.fireReceiveGenerateAuthors(updatedOpts))
      .then(updatedOpts =>
        fires.fireRequestSaveRemotePublishedElements(updatedOpts),
      )
      .then(updatedOpts =>
        fires.fireReceiveSaveRemotePublishedElements(updatedOpts),
      )
  )
}

function deletePost(opts) {
  return (
    fires
      .fireRequestLocalPost(opts)
      .then(updatedOpts => fires.fireReceiveLocalPost(updatedOpts))
      .then(updatedOpts => {
        // Save the tags before the original is erase after remote save
        const oTags =
          (updatedOpts.nextState.post.original &&
            updatedOpts.nextState.post.original.tags) ||
          []
        updatedOpts.nextState.tags = oTags
        return updatedOpts
      })
      .then(updatedOpts => {
        if (updatedOpts.nextState.post.original) {
          return fires
            .fireRequestDeleteRemotePost(updatedOpts)
            .then(updatedOpts => fires.fireReceiveDeleteRemotePost(updatedOpts))
        } else {
          return updatedOpts
        }
      })
      // Delete from local
      .then(updatedOpts => fires.fireRequestDeleteLocalPost(updatedOpts))
      .then(updatedOpts => fires.fireReceiveDeleteLocalPost(updatedOpts))
      .then(updatedOpts => {
        if (!updatedOpts.nextState.post.published) {
          return updatedOpts
        } else {
          return (
            fires
              .fireRequestDeleteRemotePublishedPost(updatedOpts)
              .then(updatedOpts =>
                fires.fireReceiveDeleteRemotePublishedPost(updatedOpts),
              )
              // Get publishedPosts to rebuild all content
              .then(updatedOpts =>
                fires.fireRequestLocalPublishedPosts(updatedOpts),
              )
              .then(updatedOpts =>
                fires.fireReceiveLocalPublishedPosts(updatedOpts),
              )
              // Generate Index / Tags
              .then(updatedOpts => fires.fireRequestGenerateIndex(updatedOpts))
              .then(updatedOpts => fires.fireReceiveGenerateIndex(updatedOpts))
              .then(updatedOpts => fires.fireRequestGenerateTags(updatedOpts))
              .then(updatedOpts => fires.fireReceiveGenerateTags(updatedOpts))
              .then(updatedOpts =>
                fires.fireRequestGenerateAuthors(updatedOpts),
              )
              .then(updatedOpts =>
                fires.fireReceiveGenerateAuthors(updatedOpts),
              )
              .then(updatedOpts =>
                fires.fireRequestSaveRemotePublishedElements(updatedOpts),
              )
              .then(updatedOpts =>
                fires.fireReceiveSaveRemotePublishedElements(updatedOpts),
              )
          )
        }
      })
      .then(getLocalPosts)
  )
}

export default {
  deletePost,
  getLocalPost,
  getLocalPosts,
  remoteSavePost,
  renderAndSavePost,
  publishPost,
  unpublishPost,
}
