window.$ = window.jQuery = require('jquery')
require('semantic-ui-css/semantic.css')
require('semantic-ui-css/semantic.js')

import Vue from 'vue'
import App from './App'
import stores from './stores'
import {APPLICATION_INITIALIZE_ROUTES, APPLICATION_INITIALIZE_CONFIG, APPLICATION_INITIALIZE_APP, APPLICATION_INITIALIZE_PLUGINS} from './stores/constants'
import plugins from './plugins'
import dashboardPlugin from './plugins/dashboard'
import hubpressPlugin from './plugins/hubpress'
import githubPlugin from './plugins/github'
import authenticationPlugin, {LoginComponent} from './plugins/authentication'
import { templatePlugin } from 'hubpress-plugin-template'
import { sessionStoragePlugin } from 'hubpress-plugin-session-storage'
import { asciidocPlugin } from 'hubpress-plugin-asciidoc'
import { pouchDbPlugin } from 'hubpress-plugin-pouchdb'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

plugins.register(
  authenticationPlugin,
  dashboardPlugin,
  hubpressPlugin,
  githubPlugin,
  templatePlugin,
  sessionStoragePlugin,
  asciidocPlugin,
  pouchDbPlugin
)
let router
stores.initStores().then(_store => {
  console.log('Content of the store after initStores', _store)
  _store.dispatch(APPLICATION_INITIALIZE_ROUTES)
    .then(() => {
      console.log('Routes of the application', _store.state.application.routes)
      // Routing logic
      router = new VueRouter({
        routes: [
          {
            path: '/login',
            component: LoginComponent
          },
          {
            path: '/',
            component: {template: '<router-view></router-view>'},
            redirect: '/dashboard',
            meta: {
              auth: true
            },
            children: _store.state.application.routes
          }
        ],
        mode: 'hash',
        scrollBehavior: function (to, from, savedPosition) {
          return savedPosition || { x: 0, y: 0 }
        }
      })

      router.beforeEach((to, from, next) => {
        if (to.matched.some(record => record.meta.auth)) {
          // this route requires auth, check if logged in
          // if not, redirect to login page.
          if (!_store.state.authentication.isAuthenticated) {
            next({
              path: '/login',
              query: { redirect: to.fullPath }
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
        strict: true
      })
    })
    .then(_ => _store.dispatch(APPLICATION_INITIALIZE_CONFIG))
    .then(_ => _store.dispatch(APPLICATION_INITIALIZE_APP))
    .then(_ => _store.dispatch(APPLICATION_INITIALIZE_PLUGINS))
    .then(_ => router.push(router.currentRoute.query.redirect || '/'))
})
