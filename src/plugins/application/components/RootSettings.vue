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
    <form id="mainForm" class="ui form">
      <div class="ui secondary pointing menu">
        <div class="item active" data-tab="application" id="application-tab">Application</div>
        <div class="item" v-for="tab in tabs" v-bind:data-tab="tab.id">{{ tab.label }}</div>
        <div class="item" v-for="tab in tabs" v-bind:data-tab="tab.id">{{ tab.label }}</div>
        <div class="item" v-for="tab in tabs" v-bind:data-tab="tab.id">{{ tab.label }}</div>
        <div class="item" v-for="tab in tabs" v-bind:data-tab="tab.id">{{ tab.label }}</div>
        <div class="item" v-for="tab in tabs" v-bind:data-tab="tab.id">{{ tab.label }}</div>
        <div class="item" v-for="tab in tabs" v-bind:data-tab="tab.id">{{ tab.label }}</div>
      </div>
      <div class="ui bottom attached tab segment active" data-tab="application">
        <h4 class="ui dividing header">Domain</h4>
        <div class="field">
          <label>CNAME</label>
          <input type="text" name="cname" placeholder="CNAME">
        </div>
        <h4 class="ui dividing header">Metadatas (read-only)</h4>
        <div class="disabled field">
          <label>GitHub username</label>
          <input type="text" disabled="" name="github-username" placeholder="Github username">
        </div>
        <div class="disabled field">
          <label>GitHub repository name</label>
          <input type="text" disabled="" name="github-repository-name" placeholder="GitHub repository name">
        </div>
        <div class="disabled field">
          <label>GitHub branch</label>
          <input type="text" disabled="" name="github-branch" placeholder="GitHub branch">
        </div>
        <div class="disabled field">
          <label>Blog URL</label>
          <input type="text" disabled="" name="blog-url" placeholder="Blog URL">
        </div>
      </div>

      <div class="ui bottom attached tab segment " v-for="tab in tabs" v-bind:data-tab="tab.id">
        <component v-bind:is="tab.id"></component>
      </div>
      <div class="ui bottom attached tab segment " v-for="tab in tabs" v-bind:data-tab="tab.id">
        <component v-bind:is="tab.id"></component>
      </div>
      <div class="ui bottom attached tab segment " v-for="tab in tabs" v-bind:data-tab="tab.id">
        <component v-bind:is="tab.id"></component>
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

export default {
  name: 'application-settings',
  beforeCreate () {
    this.$store.state.application.settingsTabs.forEach(tab => {
      this.$options.components[tab.id] = tab.component
    })
  },
  mounted: function() {
    console.log('mounted')
    $('.settings-content .menu .item').tab()
  },
  methods: {
    submit: function () {
      console.log('submit')
      const formData = new FormData(document.getElementById('mainForm'))
      console.log(formData)
      formData.forEach((key, value) => console.log(value, key))
      //document.getElementById('mainForm').submit()
    }
  },
  computed: {
    tabs: function() {
      return this.$store.state.application.settingsTabs.sort(tab => tab.label)
    }
  }
}
</script>

<style>
ui.top.attached.tabular.menu tab {
  height: 100%;
}

.settings-content {
  height: 100%;
  margin-top: 60px;
}
.settings-content .menu .item:hover {
  cursor: pointer;
}
</style>
