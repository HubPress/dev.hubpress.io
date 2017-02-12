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
    <main-container v-if="isInitialized"></main-container>

  </div>
</template>

<script>
import Navigation from './components/Navigation'
import MenuButton from './components/MenuButton'
import MainContainer from './containers/MainContainer'

export default {
  name: 'app',
  components: {
    Navigation,
    MenuButton,
    MainContainer
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

          $('.message .close')
            .on('click', () => this.closeNotification())
        } else {
          $('.message .close')
            .off('click')
        }

      }
    )
    console.warn($('.message .close'))
  },
  methods: {
    closeNotification() {
      this.$store.dispatch('application:close-notification')
    }
  },
  computed: {
    isAuthenticatedAndReady () {
      return this.$store.state.application.isInitialized
        && this.$store.state.authentication.isAuthenticated
        && this.$route.path !== "/login"
    },
    isInitializing () {
      return !this.$store.state.application.isInitialized
    },
    isInitialized () {
      return this.$store.state.application.isInitialized
    },
    isLoading () {
      return this.$store.state.application.isLoading
    },
    notification() {
      return this.$store.state.application.notification
    }
  }
}
</script>

<style>
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

  #global-notification {
    transition-property:
  }
  .pushable {
    /*background-color: #DADADA;*/
    background-color: #FFF;
  }
</style>
