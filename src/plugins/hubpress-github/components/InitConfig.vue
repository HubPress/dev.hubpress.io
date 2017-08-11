<template lang="html">
  <div class="initialise-configuration">
    <h2 class="ui center aligned icon header">
      <i class="circular configure icon"></i>
      Configuration
    </h2>
    <div class="ui divider"></div>
    <div class="content">
      We need to initialize your configuration before a first use.
    </div>
    <div class="ui divider"></div>
    <form id="configurationForm" class="ui form" v-on:submit.prevent="submit()">
      <div class="required field">
        <label>Username</label>
        <input type="text" name="configuration-username" placeholder="Your github username" v-model="username">
      </div>
      <div class="required field">
        <label>Repository name</label>
        <input type="text" name="configuration-cname" placeholder="The name of your repository" v-model="repositoryName">
      </div>
      <div class="required field">
          <label>Branch</label>
          <div class="ui selection dropdown">
              <input type="hidden" name="branch" v-model="branch">
              <i class="dropdown icon"></i>
              <div class="default text">master</div>
              <div class="menu">
                  <div class="item" data-value="master">master</div>
                  <div class="item" data-value="gh-pages">gh-pages</div>
              </div>
          </div>
      </div>
      <div class="field">
        <label>Domain name</label>
        <input type="text" name="configuration-cname" placeholder="Your domain name if you have one" v-model="cname">
      </div>
      <button class="ui fluid large submit button" type="submit" name="button" v-bind:disabled="!isValid" >Ok, let's go!</button>
    </form>
    <div class="ui message">
      If you have questions about how to use HubPress, <a href="https://hubpress.gitbooks.io/hubpress-knowledgebase/content/">here is the right place.</a>
    </div>
  </div>
</template>

<script>
import $ from 'jquery'

const APPLICATION_SAVE_STARTUP_CONFIG = 'application:save-startup-config'

export default {
  name: 'initialise-configuration',
  data: function() {
    return {
      username: '',
      repositoryName: 'hubpress.io',
      branch: 'master',
      cname: undefined
    }
  },
  mounted: function() {
    $('div.dropdown')
      .dropdown()
    ;
  },
  computed: {
    isValid() {
      return this.username.trim() != '' && this.repositoryName.trim() != ''
    }
  },
  methods: {
    submit() {
      const payload = {
        username: this.username,
        repositoryName: this.repositoryName,
        branch: this.branch,
        cname: this.cname
      }
      this.$store.dispatch(APPLICATION_SAVE_STARTUP_CONFIG, payload)
    }
  }
}
</script>

<style>
.initialise-configuration form {
  text-align: left;
}
</style>
