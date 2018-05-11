const webpack = require('webpack')
const parseArgs = require("minimist")
const argv = parseArgs(process.argv.slice(2), {
  alias: {
    H: "hostname",
    p: "port"
  },
  string: ["H"],
  unknown: parameter => false
})

const port =
  argv.port ||
  process.env.PORT ||
  process.env.npm_package_config_nuxt_port ||
  "3000"
const host =
  argv.hostname ||
  process.env.HOST ||
  process.env.npm_package_config_nuxt_host ||
  "localhost"
module.exports = {
  mode: 'spa',
  env: {
    hubpressVersion: '0.9.2',
    baseUrl:
      process.env.BASE_URL ||
      `http://${host}:${port}`
  },
  // In production, we use relative path because the tree i like :
  //    .nuxt
  //    hubpress
  //    |-- index.html (--> this file use the .nuxt folder)
  router: {
    base: process.env.NODE_ENV ==='production' ? '..':undefined
  },
  head: {
    title: "Hubpress: A web application to build your Blog",
    meta: [
      { charset: "utf-8" },
      {
        name: "viewport",
        content:
          "width=device-width, initial-scale=1"
      },
      {
        hid: "description",
        name: "description",
        content: "Nuxt.js project"
      }
    ],
    link: [
      {
        rel: "icon",
        type: "image/x-icon",
        href: "/favicon.ico"
      },
      {
        rel: 'stylesheet',
        href: '../static/semantic/semantic.min.css'
      }
    ]

  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: "#3B8070" },
  /*
  ** Build configuration
  */
  css: ["~/assets/css/main.css"],
  plugins: [
    '~plugins/init.js'
  ],
  build: {

    extend (config, { isClient }) {
      // Étend la configuration webpack uniquement pour le paquetage client
      if (isClient) {
        config.node = {
          fs: "empty",
          child_process: "empty"
        }
        config.resolve.alias.handlebars = 'handlebars/dist/handlebars.js'
        config.resolve.alias.vue = 'vue/dist/vue.common'

      }
    },
    plugins: [
      // Automatically load plugin instead of having to import or require them everywhere.
      new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery',
        'window.jQuery': 'jquery',
        CodeMirror: 'codemirror',
        'window.CodeMirror': 'codemirror'
      })
    ],
  },
  modules: [
    "@nuxtjs/axios",
    "@nuxtjs/router",
    "~/modules/typescript.js"
  ],
  axios: {},
  generate: {
    minify: {
      sortClassName: false
    },
    routes: [
      process.env.NODE_ENV === 'production' ? '/hubpress':'/'
    ]
  }
}
