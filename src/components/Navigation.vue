<template>
  <div class="ui vertical inverted sidebar menu left">
    <div class="item">
      <a class="ui logo icon image" href="/">
        <img class="logo" src="http://hubpress.io/img/freeze/logo.png">
      </a>
      <a href="/"><b>HubPress</b></a>
    </div>

    <router-link v-on:click.native="toggleMenu" active-class="active" v-for="navigation in navigations" class="item" :to="'/'+navigation.path" replace>
      {{navigation.label}}
    </router-link>

    <div class="item">
      <div class="header">Help us</div>
      <div class="menu">
        <a class="item" href="https://hubpress.gitbooks.io/contributing-to-hubpress/content/" target="_blank">Contribute<i class="smile icon"></i></a>
        <a class="item" href="https://gratipay.com/hubpress/" target="_blank">Donation Gratipay<i class="payment icon"></i></a>
        <a class="item" href="https://www.paypal.me/anthonny/5" target="_blank">Donation PayPal<i class="paypal icon"></i></a>
      </div>
    </div>
    <div class="item">
      <div class="header">About HubPress</div>
      <div class="menu">
        <a class="item" href="#" target="_blank">Team<i class="users icon"></i></a>
        <a class="item" href="#" target="_blank">Contributors<i class="heart icon"></i></a>
      </div>
    </div>
  </div>
</template>

<script>
import $ from 'jquery'

export default {
  name: 'navigation',
  mounted: function () {
    $('#app .ui.sidebar')
      .sidebar({
        context: $('#app')
      })
      .sidebar('setting', 'transition', 'overlay')
  },
  methods: {
    toggleMenu: function () {
      $('.ui.sidebar').sidebar('toggle')
    }
  },
  computed: {
    navigations: function () {
      // reduce by item
      // this.$store.getters.navigations.reduce((memo, navigation) => {
      //   memo[navigation.label]
      // }, [])
      return this.$store.getters.navigations
    }
  }
}

</script>

<style scoped>
  .ui.uncover.sidebar {
    z-index: 1000
  }

  img.logo {
    width: 30px;
  }
</style>
