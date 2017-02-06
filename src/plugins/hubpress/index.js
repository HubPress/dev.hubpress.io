import _ from 'lodash'
import {
  CORE_LOGIN,
  POST_GET,
  POST_CHANGE_CONTENT
} from './constants'
import logic from './logic'
import Posts from './components/Posts'
import Post from './components/Post'
import Vue from 'vue'
import VueCodeMirror from 'vue-codemirror'

// use
Vue.use(VueCodeMirror)

const APPLICATION_INITIALIZE_PLUGINS = 'application:initialize_plugins'
const HUBPRESS_INITIALIZE = 'hubpress:initialize'
const AUTHORISATION_AUTHENTICATION_DONE = 'authorisation:authentication_done'

export default function hubpressPlugin (context) {
  context.on('application:stores', opts => {
    console.info('hubpressPlugin - application:stores')
    console.log('hubpressPlugin - application:stores', opts)

    const hubpress = {
      state: {
        post: {},
        posts: [],
        theme: {}
      },
      mutations: {
        // Only for this mutation, the nextState is based on the rootState
        [APPLICATION_INITIALIZE_PLUGINS] (state, nextRootState) {
          console.log('hubpress-'+APPLICATION_INITIALIZE_PLUGINS, nextRootState)
          _.merge(state, nextRootState.hubpress)
        },
        [HUBPRESS_INITIALIZE] (state, nextState) {
          console.log('hubpress-'+HUBPRESS_INITIALIZE, nextState)
          _.merge(state, nextState)
        },
        [POST_GET] (state, nextState) {
          state.post = nextState.post
        },
        [POST_CHANGE_CONTENT] (state, content) {
          state.post.content = content
        }
      },
      actions: {
        [AUTHORISATION_AUTHENTICATION_DONE] ({ dispatch, commit, rootState, state }) {
          const opts = {
            rootState,
            nextState: state
          }
          return logic.initialize(opts)
            .then(_ => commit(HUBPRESS_INITIALIZE, opts.nextState))
            .then(_ => console.info('HubPress synchronized'))
        },
        [POST_GET] ({ dispatch, commit, rootState, state }, postId) {
          console.log(POST_GET, postId)
          const opts = {
            rootState: _.cloneDeep(rootState),
            currentState: _.cloneDeep(state),
            nextState: _.cloneDeep(state)
          }
          opts.nextState.post._id = postId

          return logic.getLocalPost(opts)
            .then(opts => commit(POST_GET, opts.nextState))
        },
        [POST_CHANGE_CONTENT] ({ dispatch, commit, rootState, state }, content) {
          commit(POST_CHANGE_CONTENT, content)
        }
      },
      getters: {}
    }
    opts.nextState.stores.hubpress = hubpress
    console.log('hubpressPlugin - application:stores - return', opts)
    return opts
  })

  context.on('application:routes', opts => {
    console.info('hubpressPlugin - application:routes')
    console.log('hubpressPlugin - application:routes', opts)

    opts.nextState.routes.push(
      {
        label: 'Posts',
        name: 'posts',
        path: 'posts',
        component: Posts
      },
      {
        name: 'post',
        path: 'posts/:id',
        component: Post
      }
    )
    console.log('hubpressPlugin - application:routes - return', opts)
    return opts
  })

  context.on('application:initialize_plugins', opts => {
    console.info('hubpressPlugin - application:initialize_plugins')
    console.log('hubpressPlugin - application:initialize_plugins', opts)

    if (!opts.rootState.authentication.isAuthenticated)
      return opts
    // The event comes from application, so the nextState is a copy of the rootState,
    // To keep consistency, we create a localState in which the nextState is
    // the hubpress state
    const localOpts = Object.assign({}, opts, {nextState: opts.nextState.hubpress})
    return logic.initialize(localOpts)
      .then(updatedOpts => {
        // Then we set our localOpts.nextState to the hubpress state
        opts.nextState.hubpress = updatedOpts.nextState
        return opts
      })
  })

  // TODO mettre la recuperation du savelocal auth dans le initiliaze app
}
