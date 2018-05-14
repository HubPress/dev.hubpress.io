import Content from './components/Content'
import Deck from './components/Deck'
import {
  DECK_GET,
  DECKS_GET,
  DECKS_SYNCHRONIZE,
  DECK_CHANGE_CONTENT,
  DECK_DELETE,
  DECK_REMOTE_SAVE,
  DECK_PUBLISH,
  DECK_UNPUBLISH,
} from './constants'
import logic from './logic'

const APPLICATION_INITIALIZE_PLUGINS = 'application:initialize-plugins'
const DECK_INITIALIZE = 'deck:initialize'
const AUTHORISATION_AUTHENTICATION_DONE = 'authorisation:authentication-done'

export function deckPlugin(hubpress) {

  hubpress.on('application:routes', opts => {
    console.info('deckPlugin - application:routes')
    console.log('deckPlugin - application:routes', opts)

    opts.nextState.routes.push({
      id: 'hubpress-deck',
      label: 'Hubpress Deck',
      entries: [
        {
          label: 'Decks',
          name: 'decks',
          path: 'decks',
          component: Content,
        },
        {
          name: 'deck',
          path: 'decks/:id',
          component: Deck,
        }
      ]
    })
    console.log('deckPlugin - application:routes - return', opts)
    return opts
  })

  hubpress.on('application:stores', opts => {
    console.info('deckPlugin - application:stores')
    console.log('deckPlugin - application:stores', opts)

    const deck = {
      state: {
        deck: {},
        decks: [],
        theme: {},
      },
      mutations: {
        // Only for this mutation, the nextState is based on the rootState
        [APPLICATION_INITIALIZE_PLUGINS](state, nextRootState) {
          _.merge(state, nextRootState.deck)
        },
        [DECK_INITIALIZE](state, nextState) {
          _.merge(state, nextState)
        },
        [DECKS_SYNCHRONIZE](state, nextState) {
          console.log(DECKS_SYNCHRONIZE, nextState)
          _.merge(state, nextState)
          state.decks = nextState.decks
        },
        [DECKS_GET](state, nextState) {
          console.log(DECKS_GET, nextState)
          state.decks = nextState.decks
        },
        [DECK_GET](state, nextState) {
          if (!nextState.deck.content) {
            nextState.deck.content = `// = Your Blog title
// See https://hubpress.gitbooks.io/hubpress-knowledgebase/content/ for information about the parameters.
// :hp-type: deck
// :hp-image: /covers/cover.png
// :published_at: 2019-01-31
// :hp-tags: HubPress, Blog, Open_Source,
// :hp-alt-title: My English Title

=
:hp-type: deck
`
          }
          state.deck = nextState.deck
        },
        [DECK_CHANGE_CONTENT](state, nextState) {
          console.log('Content Changed', nextState)
          state.deck = nextState.deck
        },
        [DECK_DELETE](state, nextState) {
          _.merge(state, nextState)
          state.decks = nextState.decks
        },
        [DECK_REMOTE_SAVE](state, nextState) {
          console.log(DECK_REMOTE_SAVE, nextState)
          _.merge(state, nextState)
        },
        [DECK_PUBLISH](state, nextState) {
          console.log(DECK_PUBLISH, nextState)
          _.merge(state, nextState)
        },
        [DECK_UNPUBLISH](state, nextState) {
          console.log(DECK_UNPUBLISH, nextState)
          _.merge(state, nextState)
        },
      },
      actions: {
        [AUTHORISATION_AUTHENTICATION_DONE]({
          dispatch,
          commit,
          rootState,
          state,
        }) {
          const opts = {
            rootState: _.cloneDeep(rootState),
            currentState: _.cloneDeep(state),
            payload: {
              contentTypes: ['deck']
            }
          }
          return logic
            .initialize(opts)
            .then(opts => commit(DECK_INITIALIZE, opts.nextState))
            .then(_ => console.info('HubPress initialized and synchronized'))
        },
        [DECKS_SYNCHRONIZE]({ dispatch, commit, rootState, state }) {
          const opts = {
            rootState: _.cloneDeep(rootState),
            currentState: _.cloneDeep(state),
            payload: {
              contentTypes: ['deck']
            }
          }
          return dispatch('application:loading')
            .then(_ => logic.synchronize(opts))
            .then(updatedOpts =>
              commit(DECKS_SYNCHRONIZE, updatedOpts.nextState),
            )
            .then(_ => dispatch('application:loaded'))
            .then(_ =>
              dispatch('application:notify', {
                icon: 'refresh',
                header: 'Synchronization',
                message: 'Your content has been synchronized with success.',
                level: 'success',
              }),
            )
        },
        [DECKS_GET]({ dispatch, commit, rootState, state }) {
          const opts = {
            rootState: _.cloneDeep(rootState),
            currentState: _.cloneDeep(state),
          }

          return dispatch('application:loading')
            .then(_ => logic.getLocalDecks(opts))
            .then(opts => commit(DECKS_GET, opts.nextState))
            .then(_ => dispatch('application:loaded'))
        },
        [DECK_GET]({ dispatch, commit, rootState, state }, deckId) {
          const opts = {
            rootState: _.cloneDeep(rootState),
            currentState: _.cloneDeep(state),
            nextState: _.cloneDeep(state),
            payload: {
              deck: {
                _id: deckId
              }
            }
          }

          return logic
            .getLocalDeck(opts)
            .then(opts => commit(DECK_GET, opts.nextState))
        },
        [DECK_CHANGE_CONTENT](
          { dispatch, commit, rootState, state },
          deckInfos,
        ) {
          const opts = {
            rootState: _.cloneDeep(rootState),
            currentState: _.cloneDeep(state),
            payload: { deck: deckInfos, loadOnly: !deckInfos.isPreviewVisible},
          }
          return logic.renderAndSaveDeck(opts).then(updatedOpts => {
            commit(DECK_CHANGE_CONTENT, updatedOpts.nextState)
          })
        },
        [DECK_DELETE]({ dispatch, commit, rootState, state }, deckId) {
          console.log(DECK_DELETE, deckId)
          const opts = {
            rootState: _.cloneDeep(rootState),
            currentState: _.cloneDeep(state),
            nextState: _.cloneDeep(state),
            payload: {
              deck: {
                _id: deckId
              }
            }
          }

          return dispatch('application:loading')
            .then(_ => logic.deleteDeck(opts))
            .then(opts => commit(DECK_DELETE, opts.nextState))
            .then(_ => dispatch('application:loaded'))
            .then(_ =>
              dispatch('application:notify', {
                icon: 'trash',
                header: 'Deck deleted',
                message: 'Your deck has been deleted with success.',
                level: 'success',
              }),
            )
        },
        [DECK_REMOTE_SAVE]({ dispatch, commit, rootState, state }, deckInfos) {
          console.log(DECK_REMOTE_SAVE, deckInfos)
          const opts = {
            rootState: _.cloneDeep(rootState),
            currentState: _.cloneDeep(state),
            payload: {
              deck: deckInfos
            }
          }

          return dispatch('application:loading')
            .then(_ => logic.remoteSaveDeck(opts))
            .then(opts => commit(DECK_REMOTE_SAVE, opts.nextState))
            .then(_ => dispatch('application:loaded'))
            .then(_ =>
              dispatch('application:notify', {
                icon: 'save',
                header: 'Deck saved',
                message: 'Your deck has been saved remotely with success.',
                level: 'success',
              }),
            )
        },
        [DECK_PUBLISH]({ dispatch, commit, rootState, state }, deckInfos) {
          const opts = {
            rootState: _.cloneDeep(rootState),
            currentState: _.cloneDeep(state),
            payload: {
              deck: deckInfos
            }
          }

          return dispatch('application:loading')
            .then(_ => logic.publishDeck(opts))
            .then(updatedOpts => commit(DECK_PUBLISH, updatedOpts.nextState))
            .then(_ => dispatch('application:loaded'))
            .then(_ =>
              dispatch('application:notify', {
                icon: 'rocket',
                header: 'Deck published',
                message: 'Your deck has been published with success.',
                level: 'success',
              }),
            )
        },
        [DECK_UNPUBLISH]({ dispatch, commit, rootState, state }, deckInfos) {
          const opts = {
            rootState: _.cloneDeep(rootState),
            currentState: _.cloneDeep(state),
            payload: {
              deck: deckInfos
            }
          }
          return dispatch('application:loading')
            .then(_ => logic.unpublishDeck(opts))
            .then(updatedOpts => commit(DECK_UNPUBLISH, updatedOpts.nextState))
            .then(_ => dispatch('application:loaded'))
            .then(_ =>
              dispatch('application:notify', {
                icon: 'check circle',
                header: 'Deck unpublished',
                message: 'Your deck has been unpublished with success.',
                level: 'success',
              }),
            )
        },
      }
    }

    opts.nextState.stores.deck = deck
    console.log('deckPlugin - application:stores - return', opts)
    return opts
  })

  hubpress.on('application:initialize-plugins', opts => {
    console.info('deckPlugin - application:initialize-plugins')
    console.log('deckPlugin - application:initialize-plugins', opts)

    if (!opts.rootState.authentication.isAuthenticated) return opts
    // The event comes from application, so the nextState is a copy of the rootState,
    // To keep consistency, we create a localState in which the nextState is
    // the hubpress state

    const localOpts = Object.assign({}, opts, {
      currentState: opts.nextState.deck,
      nextState: opts.nextState.deck,
      payload: {
        contentTypes: ['deck']
      }
    })
    return logic.initialize(localOpts).then(updatedOpts => {
      // Then we set our localOpts.nextState to the hubpress state
      opts.nextState.deck = updatedOpts.nextState
      return opts
    })
  })

  return {
    contentTypes: ['deck']
  }
}
