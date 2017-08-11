import _ from 'lodash'
import {
  CORE_LOGIN,
  POST_DELETE,
  POST_GET,
  POST_REMOTE_SAVE,
  POST_PUBLISH,
  POST_UNPUBLISH,
  POST_CHANGE_CONTENT,
  POSTS_GET,
  POSTS_SYNCHRONIZE
} from './constants'
import logic from './logic'
import About from './components/About'
import Post from './components/Post'
import Posts from './components/Posts'
import Settings from './components/Settings'
import SettingsSocial from './components/SettingsSocial'
import Vue from 'vue'
import VueCodeMirror from 'vue-codemirror'

// use
Vue.use(VueCodeMirror)

const APPLICATION_INITIALIZE_PLUGINS = 'application:initialize-plugins'
const HUBPRESS_INITIALIZE = 'hubpress:initialize'
const AUTHORISATION_AUTHENTICATION_DONE = 'authorisation:authentication-done'

export function hubpressPlugin(context) {
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
        [APPLICATION_INITIALIZE_PLUGINS](state, nextRootState) {
          console.log('hubpress-' + APPLICATION_INITIALIZE_PLUGINS, nextRootState)
          _.merge(state, nextRootState.hubpress)
        },
        [HUBPRESS_INITIALIZE](state, nextState) {
          console.log('hubpress-' + HUBPRESS_INITIALIZE, nextState)
          _.merge(state, nextState)
        },
        [POSTS_GET](state, nextState) {
          console.log(POSTS_GET, nextState)
          state.posts = nextState.posts
        },
        [POST_GET](state, nextState) {
          if (!nextState.post.content) {
            nextState.post.content = `// = Your Blog title
// See https://hubpress.gitbooks.io/hubpress-knowledgebase/content/ for information about the parameters.
// :hp-image: /covers/cover.png
// :published_at: 2019-01-31
// :hp-tags: HubPress, Blog, Open_Source,
// :hp-alt-title: My English Title
`
          }
          state.post = nextState.post
        },
        [POST_REMOTE_SAVE](state, nextState) {
          console.log(POST_REMOTE_SAVE, nextState)
          _.merge(state, nextState)
        },
        [POST_PUBLISH](state, nextState) {
          console.log(POST_PUBLISH, nextState)
          _.merge(state, nextState)
        },
        [POST_UNPUBLISH](state, nextState) {
          console.log(POST_UNPUBLISH, nextState)
          _.merge(state, nextState)
        },
        [POSTS_SYNCHRONIZE](state, nextState) {
          console.log(POSTS_SYNCHRONIZE, nextState)
          _.merge(state, nextState)
          state.posts = nextState.posts
        },
        [POST_CHANGE_CONTENT](state, nextState) {
          console.log('Content Changed', nextState)
          state.post = nextState.post
        },
        [POST_DELETE](state, nextState) {
          console.log('Post deleted', nextState)
          _.merge(state, nextState)
          state.posts = nextState.posts
        }
      },
      actions: {
        [AUTHORISATION_AUTHENTICATION_DONE]({
          dispatch,
          commit,
          rootState,
          state
        }) {
          const opts = {
            rootState: _.cloneDeep(rootState),
            currentState: _.cloneDeep(state)
          }
          return logic.initialize(opts)
            .then(opts => commit(HUBPRESS_INITIALIZE, opts.nextState))
            .then(_ => console.info('HubPress initialized and synchronized'))
        },
        [POSTS_SYNCHRONIZE]({
          dispatch,
          commit,
          rootState,
          state
        }) {
          const opts = {
            rootState: _.cloneDeep(rootState),
            currentState: _.cloneDeep(state)
          }
          return dispatch('application:loading')
            .then(_ => logic.synchronize(opts))
            .then(updatedOpts => commit(POSTS_SYNCHRONIZE, updatedOpts.nextState))
            .then(_ => dispatch('application:loaded'))
            .then(_ => dispatch('application:notify', {
              icon: 'refresh',
              header: 'Synchronization',
              message: 'Your content has been synchronized with success.',
              level: 'success'
            }))
        },
        [POST_GET]({
          dispatch,
          commit,
          rootState,
          state
        }, postId) {
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
        [POST_DELETE]({
          dispatch,
          commit,
          rootState,
          state
        }, postId) {
          console.log(POST_DELETE, postId)
          const opts = {
            rootState: _.cloneDeep(rootState),
            currentState: _.cloneDeep(state),
            nextState: _.cloneDeep(state)
          }
          opts.nextState.post = {
            _id: postId
          }

          return dispatch('application:loading')
            .then(_ => logic.deletePost(opts))
            .then(opts => commit(POST_DELETE, opts.nextState))
            .then(_ => dispatch('application:loaded'))
            .then(_ => dispatch('application:notify', {
              icon: 'trash',
              header: 'Post deleted',
              message: 'Your post has been deleted with success.',
              level: 'success'
            }))
        },
        [POST_REMOTE_SAVE]({
          dispatch,
          commit,
          rootState,
          state
        }, postId) {
          console.log(POST_REMOTE_SAVE, postId)
          const opts = {
            rootState: _.cloneDeep(rootState),
            currentState: _.cloneDeep(state)
          }

          return dispatch('application:loading')
            .then(_ => logic.remoteSavePost(opts))
            .then(opts => commit(POST_REMOTE_SAVE, opts.nextState))
            .then(_ => dispatch('application:loaded'))
            .then(_ => dispatch('application:notify', {
              icon: 'save',
              header: 'Post saved',
              message: 'Your post has been saved remotely with success.',
              level: 'success'
            }))
        },
        [POST_PUBLISH]({
          dispatch,
          commit,
          rootState,
          state
        }, postId) {
          console.log(POST_PUBLISH, postId)
          const opts = {
            rootState: _.cloneDeep(rootState),
            currentState: _.cloneDeep(state)
          }

          return dispatch('application:loading')
            .then(_ => logic.publishPost(opts))
            .then(updatedOpts => commit(POST_PUBLISH, updatedOpts.nextState))
            .then(_ => dispatch('application:loaded'))
            .then(_ => dispatch('application:notify', {
              icon: 'rocket',
              header: 'Post published',
              message: 'Your post has been published with success.',
              level: 'success'
            }))
        },
        [POST_UNPUBLISH]({
          dispatch,
          commit,
          rootState,
          state
        }, postId) {
          const opts = {
            rootState: _.cloneDeep(rootState),
            currentState: _.cloneDeep(state)
          }
          return dispatch('application:loading')
            .then(_ => logic.unpublishPost(opts))
            .then(updatedOpts => commit(POST_UNPUBLISH, updatedOpts.nextState))
            .then(_ => dispatch('application:loaded'))
            .then(_ => dispatch('application:notify', {
              icon: 'check circle',
              header: 'Post unpublished',
              message: 'Your post has been unpublished with success.',
              level: 'success'
            }))
        },
        [POSTS_GET]({
          dispatch,
          commit,
          rootState,
          state
        }) {
          console.log(POSTS_GET)
          const opts = {
            rootState: _.cloneDeep(rootState),
            currentState: _.cloneDeep(state)
          }

          return dispatch('application:loading')
            .then(_ => logic.getLocalPosts(opts))
            .then(opts => commit(POSTS_GET, opts.nextState))
            .then(_ => dispatch('application:loaded'))
        },
        [POST_CHANGE_CONTENT]({
          dispatch,
          commit,
          rootState,
          state
        }, postInfos) {

          // postinfo = {
          //  _id,
          //  content
          //}
          const opts = {
            rootState: _.cloneDeep(rootState),
            currentState: _.cloneDeep(state),
            payload: {post: postInfos}
          }
          return logic.renderAndSavePost(opts)
            .then(updatedOpts => {
              commit(POST_CHANGE_CONTENT, updatedOpts.nextState)
            })
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
        name: 'about',
        path: 'about',
        component: About
      },{
        label: 'Posts',
        name: 'posts',
        path: 'posts',
        item: 'Content',
        component: Posts
      }, {
        name: 'post',
        path: 'posts/:id',
        component: Post
      })
    console.log('hubpressPlugin - application:routes - return', opts)
    return opts
  })

  context.on('application:initialize-plugins', opts => {
    console.info('hubpressPlugin - application:initialize-plugins')
    console.log('hubpressPlugin - application:initialize-plugins', opts)
    // A tabs for settings
    opts.nextState.application.settingsTabs.push({
      id: 'hubpress',
      label: 'HubPress',
      component: Settings
    }, {
      id: 'hubpress-social',
      label: 'Social networks',
      component: SettingsSocial
    })

    if (!opts.rootState.authentication.isAuthenticated)
      return opts
    // The event comes from application, so the nextState is a copy of the rootState,
    // To keep consistency, we create a localState in which the nextState is
    // the hubpress state

    const localOpts = Object.assign({}, opts, {
      nextState: opts.nextState.hubpress
    })
    return logic.initialize(localOpts)
      .then(updatedOpts => {
        // Then we set our localOpts.nextState to the hubpress state
        opts.nextState.hubpress = updatedOpts.nextState
        return opts
      })
  })

  context.on('application:prepare-config', opts => {
    console.info('hubpressPlugin - application:prepare-config')
    console.log('hubpressPlugin - application:prepare-config', opts)

    // Config site

    opts.nextState.config.site = opts.nextState.config.site || {}
    opts.nextState.config.site.title = opts.payload.formData.get('hubpress-title')
    opts.nextState.config.site.description = opts.payload.formData.get('hubpress-description')
    opts.nextState.config.site.logo = opts.payload.formData.get('hubpress-logo')
    opts.nextState.config.site.cover = opts.payload.formData.get('hubpress-cover-image')
    opts.nextState.config.site.delay = opts.payload.formData.get('hubpress-render-delay')
    opts.nextState.config.site.postsPerPage = opts.payload.formData.get('hubpress-posts-per-page')
    opts.nextState.config.site.googleAnalytics = opts.payload.formData.get('hubpress-ga')
    opts.nextState.config.site.disqus = opts.payload.formData.get('hubpress-disqus')

    opts.nextState.config.theme = opts.nextState.config.theme || {}
    opts.nextState.config.theme.name = opts.payload.formData.get('hubpress-theme')

    // Config Social network
    opts.nextState.config.socialnetwork = opts.nextState.config.socialnetwork || {}
    opts.nextState.config.socialnetwork.email = opts.payload.formData.get('social-email')
    opts.nextState.config.socialnetwork.github = opts.payload.formData.get('social-github')
    opts.nextState.config.socialnetwork.twitter = opts.payload.formData.get('social-twitter')
    opts.nextState.config.socialnetwork.facebook = opts.payload.formData.get('social-facebook')
    opts.nextState.config.socialnetwork.googleplus = opts.payload.formData.get('social-googleplus')
    opts.nextState.config.socialnetwork.instagram = opts.payload.formData.get('social-instagram')
    opts.nextState.config.socialnetwork.pinterest = opts.payload.formData.get('social-pinterest')
    opts.nextState.config.socialnetwork.flickr = opts.payload.formData.get('social-flickr')
    opts.nextState.config.socialnetwork.linkedin = opts.payload.formData.get('social-linkedin')
    opts.nextState.config.socialnetwork.stackoverflow = opts.payload.formData.get('social-stackoverflow')

    console.log('hubpressPlugin - application:prepare-config - return', opts)
    return opts
  })

  context.on('application:save-config-done', opts => {
    console.info('hubpressPlugin - application:save-config-done')
    console.log('hubpressPlugin - application:save-config-done', opts)

    const localOpts = Object.assign({}, opts, {
      nextState: opts.nextState.hubpress
    })
    return logic.refreshAfterSavedConfig(localOpts)
      .then(updatedOpts => {
        // Then we set our localOpts.nextState to the hubpress state
        opts.nextState.hubpress = updatedOpts.nextState
        return opts
      })
    console.log('hubpressPlugin - application:save-config-done - return', opts)
    return opts
  })
}
