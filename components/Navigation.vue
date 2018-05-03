<template>
  <div class="ui vertical inverted sidebar menu left">
    <div class="item user">
      <img class="ui tiny centered bordered circular image" v-bind:src="currentUser.avatar_url">
      <div class="header">
        {{ currentUser.name}}
      </div>
      <div class="subheader centered">@{{ currentUser.login}}</div>
    </div>

    <!-- <router-link v-on:click.native="toggleMenu" active-class="active" class="item" :to="'/dashboard'" replace>
      Dashboard
    </router-link> -->
    <div class="item" :key="section.id" v-for="section in sections">
      <div class="header">{{ section.label }}</div>
      <div class="menu">
        <router-link v-on:click.native="toggleMenu" active-class="active" :key="entry.name" v-for="entry in filterEntries(section.entries)" class="item" :to="'/'+entry.path" replace>
          {{entry.label}}
        </router-link>
      </div>
    </div>
    
    <router-link v-on:click.native="toggleMenu" active-class="active" class="item" :to="'/settings'" replace>
      Settings
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
        <router-link v-on:click.native="toggleMenu" active-class="active" class="item" :to="'/about'" replace>
          Team<i class="users icon"></i>
        </router-link>
        <a class="item" href="https://github.com/orgs/HubPress/people" target="_blank">Contributors<i class="heart icon"></i></a>
        <a class="item" v-bind:href="upgrade" target="_blank">Check for upgrade<i class="checkmark icon"></i></a>
        <div class="item">
          <img class="ui centered logo image" src="https://hubpress.github.io/img/freeze/logo.png">
          <div class="version">
            v{{ hubpressVersion }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import $ from 'jquery'

export default {
  name: 'navigation',
  mounted: function() {
    $('#app .ui.sidebar')
      .sidebar({
        context: $('#app'),
      })
      .sidebar('setting', 'transition', 'overlay')
  },
  methods: {
    toggleMenu: function() {
      $('.ui.sidebar').sidebar('toggle')
    },
    filterEntries: function(entries) {
      return entries.filter(entry => entry.label)
    }
  },
  computed: {
    sections: function() {
      return this.$store.getters.navigations
    },
    currentUser: function() {
      return this.$store.state.authentication.userInformations
    },
    hubpressVersion: function() {
      return process.env.hubpressVersion
    },
    upgrade: function() {
      return `https://github.com/${this.$store.state.application.config.meta
        .username}/${this.$store.state.application.config.meta
        .repositoryName}/compare/${this.$store.state.application.config.meta
        .branch}...HubPress:${this.$store.state.application.config.meta.branch}`
    },
  },
}
</script>

<style scoped>

  .ui.vertical.menu .item.user > .header {
    margin-top: 10px;
  }
  .item.user .header, .item.user .subheader {
    text-align: center;
  }
  .ui.uncover.sidebar {
    z-index: 1000
  }

  img.logo {
    width: 30px;
  }
  .version {
    padding-top: 5px;
    text-align: center;
  }
</style>
