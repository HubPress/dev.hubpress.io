window.$ = window.jQuery = require('jquery')
require('semantic-ui-css/semantic.js')

// Set watch to indefined specifically for FireFox
// See https://twitter.com/anthonny_q/status/838703142745300992
if (Object.prototype.watch) {
  Object.prototype.watch = undefined
}

import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App'
import stores from './stores'
import {
  APPLICATION_INITIALIZE_ROUTES,
  APPLICATION_INITIALIZE_CONFIG,
  APPLICATION_INITIALIZE_APP,
  APPLICATION_INITIALIZE_PLUGINS,
} from './stores/constants'

// Plugins declaration
import plugins from 'hubpress-core-plugins'
import { applicationPlugin } from './plugins/application'
import { dashboardPlugin } from './plugins/dashboard'
import { authenticationPlugin, LoginComponent } from './plugins/authentication'
import { hubpressPlugin } from './plugins/hubpress-blog'
import { githubPlugin } from './plugins/hubpress-github'
import { templatePlugin } from './plugins/hubpress-template'
import { sessionStoragePlugin } from './plugins/hubpress-session-storage'
import { asciidocPlugin } from './plugins/hubpress-asciidoc'
import { pouchDbPlugin } from './plugins/hubpress-pouchdb'
import { rssPlugin } from './plugins/hubpress-rss'

Vue.use(VueRouter)

plugins.register(
  applicationPlugin,
  authenticationPlugin,
  dashboardPlugin,
  hubpressPlugin,
  githubPlugin,
  templatePlugin,
  sessionStoragePlugin,
  asciidocPlugin,
  pouchDbPlugin,
  rssPlugin,
)
let router
stores.initStores().then(_store => {
  console.log('Content of the store after initStores', _store)
  window.vue_store = _store
  _store
    .dispatch(APPLICATION_INITIALIZE_ROUTES)
    .then(() => {
      console.log('Routes of the application', _store.state.application.routes)
      // Routing logic
      router = new VueRouter({
        routes: [
          {
            path: '/login',
            component: LoginComponent,
          },
          {
            path: '/',
            component: { template: '<router-view></router-view>' },
            redirect: '/posts',
            meta: {
              auth: true,
            },
            children: _store.state.application.routes,
          },
        ],
        mode: 'hash',
        scrollBehavior: function(to, from, savedPosition) {
          return savedPosition || { x: 0, y: 0 }
        },
      })

      router.beforeEach((to, from, next) => {
        if (to.matched.some(record => record.meta.auth)) {
          // this route requires auth, check if logged in
          // if not, redirect to login page.
          if (!_store.state.authentication.isAuthenticated) {
            next({
              path: '/login',
              query: { redirect: to.fullPath },
            })
          } else {
            next()
          }
        } else {
          next() // make sure to always call next()!
        }
      })

      /* eslint-disable no-new */
      new Vue({
        el: '#app',
        router,
        template: '<App/>',
        store: _store,
        components: { App },
        strict: true,
      })
    })
    .then(_ => _store.dispatch(APPLICATION_INITIALIZE_CONFIG))
    .then(_ => _store.dispatch(APPLICATION_INITIALIZE_APP))
    .then(_ => _store.dispatch(APPLICATION_INITIALIZE_PLUGINS))
    .then(_ => router.push(router.currentRoute.query.redirect || '/'))
})
