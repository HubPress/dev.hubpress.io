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

    <!-- <a class="item" href="/introduction/new.html">
      <b>HubPress</b>
    </a>
    <div class="item">
      <div class="header">Introduction</div>
      <div class="menu">

        <a class="item" href="/introduction/integrations.html">
        Integrations
      </a>

        <a class="item" href="/introduction/build-tools.html">
        Build Tools
      </a>

        <a class="item" href="/introduction/advanced-usage.html">
        Recipes
      </a>



      </div>
    </div> -->
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
      return this.$store.getters.navigations
    }
  }
}

</script>

<style scoped>
  img.logo {
    width: 30px;
  }
</style>
