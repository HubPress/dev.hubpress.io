<template>
<div class="settings-container">
  <div class="ui fixed inverted menu">
    <div class="right menu">
      <a  v-on:click.stop.prevent="submit" class="item">
        <div class="ui icon" data-tooltip="Save your settings" data-position="bottom right">
          <i class="save large icon"></i>
        </div>
      </a>
    </div>
  </div>

  <div class="ui container settings-content">

    <h2 class="ui center aligned icon header">
      <i class="circular settings icon"></i>
      Settings
    </h2>

    <div class="ui divider"></div>
    <form id="mainForm" class="ui form">
      <div class="ui secondary pointing menu">
        <div class="item active" data-tab="application" id="application-tab">Application</div>
        <div class="item" v-for="tab in tabs" v-bind:data-tab="tab.id">{{ tab.label }}</div>
      </div>
      <div class="ui bottom attached tab segment active" data-tab="application">
        <h4 class="ui dividing header">Domain</h4>
        <div class="field">
          <label>CNAME</label>
          <input type="text" name="application-cname" placeholder="CNAME" v-bind:value="config.meta.cname">
        </div>
        <h4 class="ui dividing header">Metadata (set in config.json)</h4>
        <div class="disabled field">
          <label>GitHub username</label>
          <input type="text" disabled="" name="application-github-username" placeholder="Github username" v-bind:value="config.meta.username">
        </div>
        <div class="disabled field">
          <label>GitHub repository name</label>
          <input type="text" disabled="" name="application-github-repository-name" placeholder="GitHub repository name" v-bind:value="config.meta.repositoryName">
        </div>
        <div class="disabled field">
          <label>GitHub branch</label>
          <input type="text" disabled="" name="application-github-branch" placeholder="GitHub branch" v-bind:value="config.meta.branch">
        </div>
        <div class="disabled field">
          <label>Blog URL</label>
          <input type="text" disabled="" name="application-blog-url" placeholder="Blog URL">
        </div>
      </div>

      <div class="ui bottom attached tab segment " v-for="tab in tabs" v-bind:data-tab="tab.id">
        <component v-bind:is="tab.id"></component>
      </div>

    </form>
  </div>

</div>
</template>

<script>
import $ from 'jquery'
import { constants } from '../index'

export default {
  name: 'application-settings',
  beforeCreate() {
    this.$store.state.application.settingsTabs.forEach(tab => {
      this.$options.components[tab.id] = tab.component
    })
  },
  mounted: function() {
    $('.settings-content .menu .item').tab()
  },
  methods: {
    submit: function() {
      const formData = new FormData(document.getElementById('mainForm'))
      this.$store.dispatch(constants.APPLICATION_PREPARE_CONFIG, formData)
    },
  },
  computed: {
    tabs: function() {
      return this.$store.state.application.settingsTabs.sort(tab => tab.label)
    },
    config: function() {
      return this.$store.state.application.config || { meta: {} }
    },
  },
}
</script>

<style>
ui.top.attached.tabular.menu tab {
  height: 100%;
}

.settings-container {
  height: 100%;
  overflow: auto;
}

.settings-content {
  margin-top: 60px;
}
.settings-content .menu .item:hover {
  cursor: pointer;
}
</style>
