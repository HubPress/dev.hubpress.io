import plugins from 'hubpress-core-plugins'

// Config
function fireRequestConfig(opts) {
  return plugins.fire('requestConfig', opts)
}

function fireReceiveConfig(opts) {
  return plugins.fire('receiveConfig', opts)
}

function fireRequestSaveConfig(opts) {
  return plugins.fire('requestSaveConfig', opts)
}

function fireReceiveSaveConfig(opts) {
  return plugins.fire('receiveSaveConfig', opts)
}

// Theme
function fireRequestTheme(opts) {
  return plugins.fire('hubpress:request-theme', opts)
}

function fireReceiveTheme(opts) {
  return plugins.fire('hubpress:receive-theme', opts)
}

// SavedAuth
function fireRequestSavedAuth(opts) {
  return plugins.fire('requestSavedAuth', opts)
}

function fireReceiveSavedAuth(opts) {
  return plugins.fire('receiveSavedAuth', opts)
}

// Remote Synchronization
function fireRequestRemoteSynchronization(opts) {
  return plugins.fire('hubpress:request-remote-synchronization', opts)
}

function fireReceiveRemoteSynchronization(opts) {
  return plugins.fire('hubpress:receive-remote-synchronization', opts)
}

function fireRequestSaveRemotePost(opts) {
  return plugins.fire('requestSaveRemotePost', opts)
}

function fireReceiveSaveRemotePost(opts) {
  return plugins.fire('receiveSaveRemotePost', opts)
}

function fireRequestPublishPost(opts) {
  return plugins.fire('requestPublishPost', opts)
}

function fireReceivePublishPost(opts) {
  return plugins.fire('receivePublishPost', opts)
}

function fireRequestLocalPublishedPosts(opts) {
  return plugins.fire('requestLocalPublishedPosts', opts)
}

function fireReceiveLocalPublishedPosts(opts) {
  return plugins.fire('receiveLocalPublishedPosts', opts)
}

function fireRequestLocalPublishedPages(opts) {
  return plugins.fire('requestLocalPublishedPages', opts)
}

function fireReceiveLocalPublishedPages(opts) {
  return plugins.fire('receiveLocalPublishedPages', opts)
}

// Rendering
function fireRequestRenderingDocuments(opts) {
  return plugins.fire('hubpress:request-rendering-documents', opts)
}

function fireReceiveRenderingDocuments(opts) {
  return plugins.fire('hubpress:receive-rendering-documents', opts)
}

function fireRequestRenderingPost(opts) {
  return plugins.fire('requestRenderingPost', opts)
}

function fireReceiveRenderingPost(opts) {
  return plugins.fire('receiveRenderingPost', opts)
}

// Local
function fireRequestLocalSynchronization(opts) {
  return plugins.fire('hubpress:request-local-synchronization', opts)
}

function fireReceiveLocalSynchronization(opts) {
  return plugins.fire('hubpress:receive-local-synchronization', opts)
}

// Local Posts
function fireRequestLocalPosts(opts) {
  return plugins.fire('hubpress:request-local-posts', opts)
}

function fireReceiveLocalPosts(opts) {
  return plugins.fire('hubpress:receive-local-posts', opts)
}

function fireRequestLocalPost(opts) {
  return plugins.fire('hubpress:request-local-post', opts)
}

function fireReceiveLocalPost(opts) {
  return plugins.fire('hubpress:receive-local-post', opts)
}

function fireRequestDeleteLocalPost(opts) {
  return plugins.fire('requestDeleteLocalPost', opts)
}

function fireReceiveDeleteLocalPost(opts) {
  return plugins.fire('receiveDeleteLocalPost', opts)
}

function fireRequestSaveLocalPost(opts) {
  return plugins.fire('requestSaveLocalPost', opts)
}

function fireReceiveSaveLocalPost(opts) {
  return plugins.fire('receiveSaveLocalPost', opts)
}

// Selected Post
function fireRequestSelectedPost(opts) {
  return plugins.fire('requestSelectedPost', opts)
}

function fireReceiveSelectedPost(opts) {
  return plugins.fire('receiveSelectedPost', opts)
}

// Authentication
function fireRequestAuthentication(opts) {
  return plugins.fire('requestAuthentication', opts)
}

function fireReceiveAuthentication(opts) {
  // Do not fire event if OTP is required
  if (opts.nextState.twoFactorRequired) {
    return payload
  }

  return plugins.fire('receiveAuthentication', opts)
}

function fireRequestLogout(opts) {
  return plugins.fire('requestLogout', opts)
}

function fireReceiveLogout(opts) {
  return plugins.fire('receiveLogout', opts)
}

// Generators
function fireRequestGenerateIndex(opts) {
  return plugins.fire('requestGenerateIndex', opts)
}

function fireReceiveGenerateIndex(opts) {
  return plugins.fire('receiveGenerateIndex', opts)
}

function fireRequestGeneratePost(opts) {
  return plugins.fire('requestGeneratePost', opts)
}

function fireReceiveGeneratePost(opts) {
  return plugins.fire('receiveGeneratePost', opts)
}

function fireRequestGeneratePosts(opts) {
  return plugins.fire('requestGeneratePosts', opts)
}

function fireReceiveGeneratePosts(opts) {
  return plugins.fire('receiveGeneratePosts', opts)
}

function fireRequestGenerateTags(opts) {
  return plugins.fire('requestGenerateTags', opts)
}

function fireReceiveGenerateTags(opts) {
  return plugins.fire('receiveGenerateTags', opts)
}

function fireRequestGenerateAuthors(opts) {
  return plugins.fire('requestGenerateAuthors', opts)
}

function fireReceiveGenerateAuthors(opts) {
  return plugins.fire('receiveGenerateAuthors', opts)
}

function fireRequestGeneratePages(opts) {
  return plugins.fire('requestGeneratePages', opts)
}

function fireReceiveGeneratePages(opts) {
  return plugins.fire('receiveGeneratePages', opts)
}

function fireRequestSaveRemotePublishedElements(opts) {
  return plugins.fire('requestSaveRemotePublishedElements', opts)
}

function fireReceiveSaveRemotePublishedElements(opts) {
  return plugins.fire('receiveSaveRemotePublishedElements', opts)
}

function fireRequestDeleteRemotePublishedPost(opts) {
  return plugins.fire('requestDeleteRemotePublishedPost', opts)
}

function fireReceiveDeleteRemotePublishedPost(opts) {
  return plugins.fire('receiveDeleteRemotePublishedPost', opts)
}

function fireRequestDeleteRemotePost(opts) {
  return plugins.fire('requestDeleteRemotePost', opts)
}

function fireReceiveDeleteRemotePost(opts) {
  return plugins.fire('receiveDeleteRemotePost', opts)
}

export default {
  fireRequestConfig,
  fireReceiveConfig,
  fireRequestSaveConfig,
  fireReceiveSaveConfig,
  fireRequestTheme,
  fireReceiveTheme,
  fireRequestSavedAuth,
  fireReceiveSavedAuth,
  fireRequestRemoteSynchronization,
  fireReceiveRemoteSynchronization,
  fireRequestRenderingDocuments,
  fireReceiveRenderingDocuments,
  fireRequestRenderingPost,
  fireReceiveRenderingPost,
  fireRequestLocalSynchronization,
  fireReceiveLocalSynchronization,
  fireRequestLocalPosts,
  fireReceiveLocalPosts,
  fireRequestLocalPost,
  fireReceiveLocalPost,
  fireRequestDeleteLocalPost,
  fireReceiveDeleteLocalPost,
  fireRequestSaveLocalPost,
  fireReceiveSaveLocalPost,
  fireRequestSaveRemotePost,
  fireReceiveSaveRemotePost,
  fireRequestPublishPost,
  fireReceivePublishPost,
  fireRequestLocalPublishedPosts,
  fireReceiveLocalPublishedPosts,
  fireRequestLocalPublishedPages,
  fireReceiveLocalPublishedPages,
  fireRequestSelectedPost,
  fireReceiveSelectedPost,
  fireRequestAuthentication,
  fireReceiveAuthentication,
  fireRequestLogout,
  fireReceiveLogout,
  fireRequestGenerateIndex,
  fireReceiveGenerateIndex,
  fireRequestGeneratePost,
  fireReceiveGeneratePost,
  fireRequestGeneratePosts,
  fireReceiveGeneratePosts,
  fireRequestGenerateTags,
  fireReceiveGenerateTags,
  fireRequestGenerateAuthors,
  fireReceiveGenerateAuthors,
  fireRequestGeneratePages,
  fireReceiveGeneratePages,
  fireRequestSaveRemotePublishedElements,
  fireReceiveSaveRemotePublishedElements,
  fireRequestDeleteRemotePublishedPost,
  fireReceiveDeleteRemotePublishedPost,
  fireRequestDeleteRemotePost,
  fireReceiveDeleteRemotePost,
}
