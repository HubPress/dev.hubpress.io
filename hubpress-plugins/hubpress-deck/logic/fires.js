import plugins from 'hubpress-core-plugins'

// Remote Synchronization
function fireRequestRemoteSynchronization(opts) {
  return plugins.fire('deck:request-remote-synchronization', opts)
}
function fireReceiveRemoteSynchronization(opts) {
  return plugins.fire('deck:receive-remote-synchronization', opts)
}

function fireRequestSaveRemoteDeck(opts) {
  return plugins.fire('deck:request-save-remote-deck', opts)
}

function fireReceiveSaveRemoteDeck(opts) {
  return plugins.fire('deck:receive-save-remote-deck', opts)
}

// Rendering
function fireRequestRenderingDocuments(opts) {
  return plugins.fire('deck:request-rendering-documents', opts)
}

function fireReceiveRenderingDocuments(opts) {
  return plugins.fire('deck:receive-rendering-documents', opts)
}

function fireRequestRenderingDeck(opts) {
  return plugins.fire('deck:request-rendering-deck', opts)
}

function fireReceiveRenderingDeck(opts) {
  return plugins.fire('deck:receive-rendering-deck', opts)
}

// Local
function fireRequestLocalSynchronization(opts) {
  return plugins.fire('deck:request-local-synchronization', opts)
}

function fireReceiveLocalSynchronization(opts) {
  return plugins.fire('deck:receive-local-synchronization', opts)
}

// Local decks
function fireRequestLocalDecks(opts) {
  return plugins.fire('deck:request-local-decks', opts)
}

function fireReceiveLocalDecks(opts) {
  return plugins.fire('deck:receive-local-decks', opts)
}

function fireRequestLocalDeck(opts) {
  return plugins.fire('deck:request-local-deck', opts)
}

function fireReceiveLocalDeck(opts) {
  return plugins.fire('deck:receive-local-deck', opts)
}

function fireRequestDeleteLocalDeck(opts) {
  return plugins.fire('deck:request-delete-local-deck', opts)
}

function fireReceiveDeleteLocalDeck(opts) {
  return plugins.fire('deck:receive-delete-local-deck', opts)
}

function fireRequestSaveLocalDeck(opts) {
  return plugins.fire('deck:request-save-local-deck', opts)
}

function fireReceiveSaveLocalDeck(opts) {
  return plugins.fire('deck:receive-save-local-deck', opts)
}

function fireRequestDeleteRemotePublishedDeck(opts) {
  return plugins.fire('deck:request-delete-remote-published-deck', opts)
}

function fireReceiveDeleteRemotePublishedDeck(opts) {
  return plugins.fire('deck:receive-delete-remote-published-deck', opts)
}

function fireRequestDeleteRemoteDeck(opts) {
  return plugins.fire('deck:request-delete-remote-deck', opts)
}

function fireReceiveDeleteRemoteDeck(opts) {
  return plugins.fire('deck:receive-delete-remote-deck', opts)
}

function fireRequestSaveRemotePublishedElements(opts) {
  return plugins.fire('requestSaveRemotePublishedElements', opts)
}

function fireReceiveSaveRemotePublishedElements(opts) {
  return plugins.fire('receiveSaveRemotePublishedElements', opts)
}


// Generators
function fireRequestGenerateIndex(opts) {
  return plugins.fire('requestGenerateIndex', opts)
}

function fireReceiveGenerateIndex(opts) {
  return plugins.fire('receiveGenerateIndex', opts)
}

function fireRequestGeneratePosts(opts) {
  return plugins.fire('requestGeneratePosts', opts)
}

function fireReceiveGeneratePosts(opts) {
  return plugins.fire('receiveGeneratePosts', opts)
}

export default {
fireRequestRemoteSynchronization,
fireReceiveRemoteSynchronization,
fireRequestSaveRemoteDeck,
fireReceiveSaveRemoteDeck,
fireRequestRenderingDocuments,
fireReceiveRenderingDocuments,
fireRequestLocalSynchronization,
fireReceiveLocalSynchronization,
fireRequestLocalDecks,
fireReceiveLocalDecks,
fireRequestLocalDeck,
fireReceiveLocalDeck,
fireRequestDeleteLocalDeck,
fireReceiveDeleteLocalDeck,
fireRequestSaveLocalDeck,
fireReceiveSaveLocalDeck,
fireRequestRenderingDeck,
fireReceiveRenderingDeck,
fireRequestDeleteRemotePublishedDeck,
fireReceiveDeleteRemotePublishedDeck,
fireRequestDeleteRemoteDeck,
fireReceiveDeleteRemoteDeck,
fireRequestSaveRemotePublishedElements,
fireReceiveSaveRemotePublishedElements,
fireRequestGenerateIndex,
fireReceiveGenerateIndex,
fireRequestGeneratePosts,
fireReceiveGeneratePosts
}
