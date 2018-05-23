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
        updatedOpts.payload.deck = {...updatedOpts.nextState.deck}
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
        const deckonfs = (deck.attributes['hp-deckonf'] || '').split(',').filter(dekonf => dekonf !== '').map(deckonf => deckonf.trim())

        updatedOpts.nextState.elementsToPublish = deckonfs.map(deckonf => {
          const conferenceAttributes = deckonf.split('/')
          const conference = {
            name: conferenceAttributes[0],
            year: conferenceAttributes[1] || 'latest'
          }
          const cssPath= `https://deckonf.io/templates/conferences/${conference.name}/${conference.year}/revealjs/style.css`

          return {
            content: deck.html.replace('$$revealjs_customtheme$$', cssPath ),
            path: configuration.urls.getGhHtmlPathFromAdoc(
              `${deck.name}`,
              deck.type,
              `/${deckonf}`
            )
          }
        })
        const cssPath = `${deck.attributes['revealjsdir']}/css/theme/${deck.attributes['revealjs_theme'] || 'black'}.css`
        updatedOpts.nextState.elementsToPublish.push({
          content: deck.html.replace('$$revealjs_customtheme$$', cssPath),
          path: configuration.urls.getGhHtmlPathFromAdoc(
            deck.name,
            deck.type,
            '/default'
          )
        })

        updatedOpts.payload.indexPath = 'decks/'
        deck.excerpt = ''
        updatedOpts.nextState.publishedPosts = [deck]
        return updatedOpts
      })
      .then(updatedOpts => fires.fireRequestGenerateIndex(updatedOpts))
      .then(updatedOpts => fires.fireReceiveGenerateIndex(updatedOpts))
      .then(updatedOpts => {

        const attachedConf = updatedOpts.nextState.elementsToPublish


        updatedOpts.nextState.publishedPosts = updatedOpts.nextState.publishedPosts.map(post => {
          const _post = {...post}
          const baseUrlDeck = _post.url.split('index.html')[0]
          const regex = RegExp(`${baseUrlDeck}.*\/.*`);
          console.log('baseurl', baseUrlDeck)
          const links = updatedOpts.nextState.elementsToPublish
            .filter(element => {
              console.log('regex',regex.test(`/${element.path}`), element.path, regex)
              return regex.test(`/${element.path}`)
            })
            .map(element => {
              return `
                <li>
                  <a href="${opts.rootState.application.config.urls.site}/${element.path}">
                    ${opts.rootState.application.config.urls.site}/${element.path}
                  </a>
                </li>
              `
            })
            .join('')
          _post.original.html = `
            <div>
              <iframe src="${opts.rootState.application.config.urls.site}/${opts.rootState.application.config.urls.getGhHtmlPathFromAdoc(
                _post.name,
                _post.type,
                '/default')}" style="width: 100%; height: 480px" ></iframe>


                  <h2>See:</h2>
                  <ul>
                    ${links}
                  </ul>

            </div>

          `
          return _post
        })
        updatedOpts.payload.template = 'page'
        return updatedOpts
      })
      .then(updatedOpts => fires.fireRequestGeneratePosts(updatedOpts))
      .then(updatedOpts => fires.fireReceiveGeneratePosts(updatedOpts))
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
