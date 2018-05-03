<template>
  <div id="app" class="pushable">
    <div class="ui active inverted dimmer" v-if="isInitializing">
      <div class="ui text loader">Initializing...</div>
    </div>
    <div class="ui active inverted dimmer" v-if="isLoading">
      <div class="ui text loader"></div>
    </div>

    <div id="global-notification" class="ui icon message transition" v-bind:class="{hidden: !notification.isVisible, [notification.level]: notification.level}">
      <i class="icon" v-bind:class="notification.icon" v-if="notification.icon"></i>
      <i class="close icon"></i>
      <div class="content">
        <div class="header">
          {{ notification.header }}
        </div>
        <p>{{ notification.message }}</p>
      </div>
    </div>

    <menu-button v-if="isAuthenticatedAndReady"></menu-button>
    <navigation v-if="isAuthenticatedAndReady"></navigation>
    <div class="pusher" v-if="isInitialized">
      <nuxt/>
    </div>

    <!-- Import Gitter Chat Room -->
    <script>
      ((window.gitter = {}).chat = {}).options = {
        room: 'HubPress/hubpress.io'
      };
    </script>
    <script src="https://sidecar.gitter.im/dist/sidecar.v1.js" async defer></script>
  </div>
</template>


<script>
import 'semantic-ui-css/semantic.js'
import Navigation from '~/components/Navigation'
import MenuButton from '~/components/MenuButton'
import {
  APPLICATION_INITIALIZE_ROUTES,
  APPLICATION_INITIALIZE_CONFIG,
  APPLICATION_INITIALIZE_APP,
  APPLICATION_INITIALIZE_PLUGINS,
} from '~/hubpress-plugins/constants'

export default {
  name: 'app',
  components: {
    Navigation,
    MenuButton
  },
  created: function() {
    console.log(this)
    this.$store.dispatch(APPLICATION_INITIALIZE_CONFIG)
      .then(_ => this.$store.dispatch(APPLICATION_INITIALIZE_APP))
      .then(_ => this.$store.dispatch(APPLICATION_INITIALIZE_PLUGINS))
      .then(_ => this.$router.push(this.$router.currentRoute.query.redirect || '/'))
  },
  mounted: function() {
    this.$store.watch(
      state => {
        return state.application.notification.isVisible
      },
      (next, current) => {
        if (next) {
          $('.message .close').removeClass('hidden')
          const timeout = setTimeout(() => {
            if (this.$store.state.application.notification.isVisible) {
              this.closeNotification()
            }
          }, 4000)

          $('.message .close').on('click', () => this.closeNotification())
        } else {
          $('.message .close').off('click')
        }
      },
    )
  },
  methods: {
    closeNotification() {
      this.$store.dispatch('application:close-notification')
    },
  },
  computed: {
    isAuthenticatedAndReady() {
      return (
        this.$store.state.application.isInitialized &&
        this.$store.state.authentication.isAuthenticated &&
        this.$route.path !== '/login'
      )
    },
    isInitializing() {
      return !this.$store.state.application.isInitialized
    },
    isInitialized() {
      return this.$store.state.application.isInitialized
    },
    isLoading() {
      return this.$store.state.application.isLoading
    },
    notification() {
      return this.$store.state.application.notification
    },
  },
}
</script>

<style>
  #__nuxt, #__layout {
    height: 100%;
  }
  #app.pushable:not(body) {
    transform: none;
  }

  #global-notification {
    position: absolute;
    width: 90vw;
    left: 5vw;
    bottom: 50px;
    z-index: 10000;
  }

  @media only screen and (min-width: 768px) {
    #global-notification {
      width: 750px;
      left: calc((100vw - 750px) / 2);
    }
  }

  .pushable {
    /*background-color: #DADADA;*/
    background-color: #FFF;
  }
  .pusher {
    height: 0px;
    min-height: 100%;
  }

  .gitter-chat-embed, .gitter-open-chat-button {
    z-index: 1001;
  }
  .gitter-open-chat-button {
    background-color: #e74c3c;
  }
  .gitter-open-chat-button:hover {
    background-color: #bd3a2c;
  }
</style>
