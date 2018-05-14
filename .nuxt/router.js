console.log('router ==============')
import Vue from 'vue'
import Router from 'vue-router'

// import IndexPage from '~/pages/index.vue'
import initStore from '~/store'

import plugins from 'hubpress-core-plugins'
import { initializeStores } from '~/hubpress-plugins/services'
import { applicationPlugin } from '~/hubpress-plugins/application'
import { authenticationPlugin, LoginComponent } from '~/hubpress-plugins/authentication'
import { dashboardPlugin } from '~/hubpress-plugins/dashboard'
import { blogPlugin } from '~/hubpress-plugins/hubpress-blog'
import { githubPlugin } from '~/hubpress-plugins/hubpress-github'
import { templatePlugin } from '~/hubpress-plugins/hubpress-template'
import { sessionStoragePlugin } from '~/hubpress-plugins/hubpress-session-storage'
import { asciidocPlugin } from '~/hubpress-plugins/hubpress-asciidoc'
import { pouchDbPlugin } from '~/hubpress-plugins/hubpress-pouchdb'
import { lokijsPlugin } from '~/hubpress-plugins/hubpress-lokijs'
import { rssPlugin } from '~/hubpress-plugins/hubpress-rss'
import { deckPlugin } from '~/hubpress-plugins/hubpress-deck'

console.log('Router')
Vue.use(Router)
plugins.register(
    applicationPlugin,
    authenticationPlugin,
    dashboardPlugin,
    blogPlugin,
    githubPlugin,
    templatePlugin,
    sessionStoragePlugin,
    asciidocPlugin,
    // pouchDbPlugin,
    lokijsPlugin,
    rssPlugin,
    deckPlugin,
)
const registeredPlugins = plugins.list()
console.log('Registered plugins', registeredPlugins)

export  function createRouter(info) {
    const opts = {
        currentState: {
            routes: []
        },
    }

    const updatedOpts = plugins.fireSync('application:routes', opts);
    const routerOptions = {
        base: '/hubpress/',
        mode: 'hash',
        routes: [
            // {
            //     path: '/',
            //     component: IndexPage
            // },
            {
                path: '/login',
                component: LoginComponent,
            },
            {
                path: '/',
                component: { template: '<router-view></router-view>' },
                redirect: '/content',
                meta: {
                    auth: true,
                },
                children: updatedOpts.nextState.routes
                    .map(route => {
                        console.log(route)
                        return route.entries
                    })
                    .reduce((memo, entries) => memo.concat(entries), [])
            },
        ]
    }
    const router = new Router(routerOptions)
    router.routes = updatedOpts.nextState.routes

    router.beforeEach((to, from, next) => {
        const store = initStore()
        if (to.matched.some(record => record.meta.auth)) {
            // this route requires auth, check if logged in
            // if not, redirect to login page.
            if (!store.state.authentication.isAuthenticated) {
                next({
                    path: '/login',
                    query: {
                        redirect: to.fullPath
                    },
                })
            } else {
                next()
            }
        } else {
            next() // make sure to always call next()!
        }
    })

    return router


}
