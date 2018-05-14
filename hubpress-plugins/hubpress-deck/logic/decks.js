import fires from './fires'

function getLocalDeck(opts) {
  return fires
    .fireRequestLocalDeck(opts)
    .then(opts => fires.fireReceiveLocalDeck(opts))
}

function getLocalDecks(opts) {
  return fires
    .fireRequestLocalDecks(opts)
    .then(updatedOpts => fires.fireReceiveLocalDecks(updatedOpts))
}

function renderAndSaveDeck(opts) {
  return fires
    .fireRequestLocalDeck(opts)
    .then(updatedOpts => fires.fireReceiveLocalDeck(updatedOpts))
    .then(updatedOpts => {
      return updatedOpts
    })
    .then(updatedOpts => fires.fireRequestRenderingDeck(updatedOpts))
    .then(updatedOpts => fires.fireReceiveRenderingDeck(updatedOpts))
    .then(updatedOpts => {
      updatedOpts.nextState.deck.publishedContent = updatedOpts.nextState.deck.html
      if (updatedOpts.nextState.deck && updatedOpts.nextState.deck.title) {
        updatedOpts.payload.deck = updatedOpts.nextState.deck
        return fires
          .fireRequestSaveLocalDeck(updatedOpts)
          .then(updatedOpts => fires.fireReceiveSaveLocalDeck(updatedOpts))
      }

      return updatedOpts
    })
}


function deleteDeck(opts) {
  return (
    fires
      .fireRequestLocalDeck(opts)
      .then(updatedOpts => fires.fireReceiveLocalDeck(updatedOpts))
      .then(updatedOpts => {
        // Save the tags before the original is erase after remote save
        const oTags =
          (updatedOpts.nextState.deck.original &&
            updatedOpts.nextState.deck.original.tags) ||
          []
        updatedOpts.nextState.tags = oTags
        return updatedOpts
      })
      .then(updatedOpts => {
        if (updatedOpts.nextState.deck.original) {
          updatedOpts.payload.deck = {...updatedOpts.nextState.deck}
          return fires
            .fireRequestDeleteRemoteDeck(updatedOpts)
            .then(updatedOpts => fires.fireReceiveDeleteRemoteDeck(updatedOpts))
        } else {
          return updatedOpts
        }
      })
      // Delete from local
      .then(updatedOpts => fires.fireRequestDeleteLocalDeck(updatedOpts))
      .then(updatedOpts => fires.fireReceiveDeleteLocalDeck(updatedOpts))
      .then(updatedOpts => {
        if (!updatedOpts.nextState.deck.published) {
          return updatedOpts
        } else {
          updatedOpts.payload.deck = {...updatedOpts.nextState.deck}
          return (
            fires
              .fireRequestDeleteRemotePublishedDeck(updatedOpts)
              .then(updatedOpts =>
                fires.fireReceiveDeleteRemotePublishedDeck(updatedOpts),
              )
              // // Get publishedDecks to rebuild all content
              // .then(updatedOpts =>
              //   fires.fireRequestLocalPublishedDecks(updatedOpts),
              // )
              // .then(updatedOpts =>
              //   fires.fireReceiveLocalPublishedDecks(updatedOpts),
              // )
          )
        }
      })
      .then(getLocalDecks)
  )
}

function remoteSaveDeck(opts) {
  // Clean elementsToPublish
  opts.currentState.elementsToPublish = []
  return renderAndSaveDeck(opts).then(updatedOpts => {
      updatedOpts.payload.deck = {
        ...updatedOpts.nextState.deck
      }
      return updatedOpts
    })
    .then(updatedOpts => fires.fireRequestSaveRemoteDeck(updatedOpts))
    .then(updatedOpts => fires.fireReceiveSaveRemoteDeck(updatedOpts))
    .then(updatedOpts => fires.fireRequestSaveLocalDeck(updatedOpts))
    .then(updatedOpts => fires.fireReceiveSaveLocalDeck(updatedOpts))
}

function publishDeck(opts) {
  // Clean elementsToPublish
  opts.currentState.elementsToPublish = []
  return (
    renderAndSaveDeck(opts).then(updatedOpts => {
        // Save the tags before the original is erase after remote save
        const oTags =
          (updatedOpts.nextState.deck.original &&
            updatedOpts.nextState.deck.original.tags) ||
          []
        updatedOpts.nextState.tags = _.union(
          updatedOpts.nextState.deck.tags,
          oTags,
        )
        return updatedOpts
      })
      .then(updatedOpts => {
        updatedOpts.payload.deck = {
          ...updatedOpts.nextState.deck
        }
        return updatedOpts
      })
      .then(updatedOpts => fires.fireRequestSaveRemoteDeck(updatedOpts))
      .then(updatedOpts => fires.fireReceiveSaveRemoteDeck(updatedOpts))
      // Maybe we should make something fireRequestMarkAsPublished
      .then(updatedOpts => {
        updatedOpts.nextState.deck.original.author =
          updatedOpts.nextState.deck.original.author ||
          updatedOpts.nextState.deck.author
        updatedOpts.nextState.deck.published = 1

        updatedOpts.payload.deck = {
          ...updatedOpts.nextState.deck
        }
        return updatedOpts
      })
      .then(updatedOpts => fires.fireRequestSaveLocalDeck(updatedOpts))
      .then(updatedOpts => fires.fireReceiveSaveLocalDeck(updatedOpts))
      // // Get publishedDecks to rebuild all content
      // .then(updatedOpts => fires.fireRequestLocalPublishedDecks(updatedOpts))
      // .then(updatedOpts => fires.fireReceiveLocalPublishedDecks(updatedOpts))
      // // Generate Index / Deck / Tags
      // .then(updatedOpts => fires.fireRequestGenerateDeck(updatedOpts))
      // .then(updatedOpts => fires.fireReceiveGenerateDeck(updatedOpts))
      // .then(updatedOpts => {

      //   // do not regenerate index tag and authors if not deck
      //   if (updatedOpts.nextState.deck.type !== 'deck') {
      //     return updatedOpts
      //   }

      //   return fires.fireRequestGenerateIndex(updatedOpts)
      //     .then(updatedOpts => fires.fireReceiveGenerateIndex(updatedOpts))
      //     .then(updatedOpts => fires.fireRequestGenerateTags(updatedOpts))
      //     .then(updatedOpts => fires.fireReceiveGenerateTags(updatedOpts))
      //     .then(updatedOpts => fires.fireRequestGenerateAuthors(updatedOpts))
      //     .then(updatedOpts => fires.fireReceiveGenerateAuthors(updatedOpts))
      // })
      .then(updatedOpts => {
        const deck = updatedOpts.nextState.deck
        const configuration = updatedOpts.rootState.application.config
        updatedOpts.nextState.elementsToPublish = [{
          content: deck.html,
          path: configuration.urls.getGhHtmlPathFromAdoc(
            deck.name,
            deck.type
          )
        }]
        return updatedOpts
      })
      .then(updatedOpts =>
        fires.fireRequestSaveRemotePublishedElements(updatedOpts),
      )
      .then(updatedOpts =>
        fires.fireReceiveSaveRemotePublishedElements(updatedOpts),
      )
  )
}

function unpublishDeck(opts) {
  // Clean elementsToPublish
  opts.currentState.elementsToPublish = []
  return (
    renderAndSaveDeck(opts).then(updatedOpts => {
        // Save the tags before the original is erase after remote save
        const oTags =
          (updatedOpts.nextState.deck.original &&
            updatedOpts.nextState.deck.original.tags) ||
          []
        updatedOpts.nextState.tags = oTags
        updatedOpts.payload.deck = {...updatedOpts.nextState.deck}
        return updatedOpts
      })
      .then(updatedOpts => fires.fireRequestDeleteRemotePublishedDeck(updatedOpts))
      .then(updatedOpts => fires.fireReceiveDeleteRemotePublishedDeck(updatedOpts))
      // Maybe we should make something fireRequestMarkAsPublished
      .then(updatedOpts => {
        updatedOpts.nextState.deck.published = 0
        updatedOpts.payload.deck = {
          ...updatedOpts.nextState.deck
        }
        return updatedOpts
      })
      .then(updatedOpts => fires.fireRequestSaveLocalDeck(updatedOpts))
      .then(updatedOpts => fires.fireReceiveSaveLocalDeck(updatedOpts))
      // Get publishedDecks to rebuild all content
      // .then(updatedOpts => fires.fireRequestLocalPublishedDecks(updatedOpts))
      // .then(updatedOpts => fires.fireReceiveLocalPublishedDecks(updatedOpts))
      // .then(updatedOpts => {

      //   // do not regenerate index tag and authors if not deck
      //   if (updatedOpts.nextState.deck.type !== 'deck') {
      //     return updatedOpts
      //   }

      //   // Generate Index / Tags
      //   return fires.fireRequestGenerateIndex(updatedOpts)
      //   .then(updatedOpts => fires.fireReceiveGenerateIndex(updatedOpts))
      //   .then(updatedOpts => fires.fireRequestGenerateTags(updatedOpts))
      //   .then(updatedOpts => fires.fireReceiveGenerateTags(updatedOpts))
      //   .then(updatedOpts => fires.fireRequestGenerateAuthors(updatedOpts))
      //   .then(updatedOpts => fires.fireReceiveGenerateAuthors(updatedOpts))
      // })
      // .then(updatedOpts =>
      //   fires.fireRequestSaveRemotePublishedElements(updatedOpts),
      // )
      // .then(updatedOpts =>
      //   fires.fireReceiveSaveRemotePublishedElements(updatedOpts),
      // )
  )
}

export default {
  deleteDeck,
  getLocalDeck,
  getLocalDecks,
  remoteSaveDeck,
  renderAndSaveDeck,
  publishDeck,
  unpublishDeck,
}
