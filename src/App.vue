<template>
  <div id="app" class="pushable">
    <div class="ui active inverted dimmer" v-if="isInitializing">
      <div class="ui text loader">Loading</div>
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
  mounted () {
    // Initialize App context
    console.error('I AM MOUNTED!!!')
  },
  computed: {
    isAuthenticatedAndReady () {
      return this.$store.state.application.isInitialized && this.$store.state.authentication.isAuthenticated
    },
    isInitializing () {
      return !this.$store.state.application.isInitialized
    },
    isInitialized () {
      return this.$store.state.application.isInitialized
    }
  }
}
</script>

<style>
  #app.pushable:not(body) {
    transform: none;
  }

  .pushable {
    /*background-color: #DADADA;*/
    background-color: #FFF;
  }
</style>
