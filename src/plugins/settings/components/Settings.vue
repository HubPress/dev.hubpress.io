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
    <form v-on:submit="save" id="mainForm" class="ui form">
      <div class="ui secondary pointing menu">
        <div class="item" data-tab="application">Application</div>
        <div class="active item" data-tab="hubpress">HubPress</div>
        <div class="item" data-tab="social-network">Social network</div>
      </div>
      <div class="ui bottom attached tab segment" data-tab="application">
        <h4 class="ui dividing header">Metadatas</h4>
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

        <h4 class="ui dividing header">Domain</h4>
        <div class="field">
          <label>CNAME</label>
          <input type="text" name="cname" placeholder="CNAME">
        </div>
        <div class="disabled field">
          <label>Blog URL</label>
          <input type="text" disabled="" name="blog-url" placeholder="Blog URL">
        </div>
      </div>

      <div class="ui bottom attached tab segment active" data-tab="hubpress">
        <h4 class="ui dividing header">Informations</h4>
        <div class="field">
          <label>Title</label>
          <input type="text" name="hubpress-title" placeholder="Title">
        </div>
        <div class="field">
          <label>Description</label>
          <input type="text" name="hubpress-description" placeholder="Description">
        </div>
        <div class="field">
          <label>Logo</label>
          <input type="text" name="hubpress-logo" placeholder="Logo">
        </div>
        <div class="field">
          <label>Cover image</label>
          <input type="text" name="hubpress-cover-image" placeholder="Cover image">
        </div>

        <h4 class="ui dividing header">Rendering</h4>
        <div class="field">
          <label>Live preview render delay (ms)</label>
          <input type="text" name="hubpres-render-delay" placeholder="300">
        </div>

        <h4 class="ui dividing header">Generation</h4>
        <div class="field">
          <label>Theme</label>
          <input type="text" name="hubpres-theme" placeholder="Theme">
        </div>
        <div class="field">
          <label>Posts per page</label>
          <input type="text" name="hubpres-posts-per-page" placeholder="Posts per page">
        </div>

        <h4 class="ui dividing header">Services</h4>
        <div class="field">
          <label>Google analytics</label>
          <input type="text" name="hubpres-ga" placeholder="Google analytics">
        </div>
        <div class="field">
          <label>Disqus shortname</label>
          <input type="text" name="hubpres-disqus" placeholder="Disqus shortname">
        </div>
      </div>

      <div class="ui bottom attached tab segment " data-tab="social-network">
        <h4 class="ui dividing header">Metadatas</h4>
        <component is="test"></component>
      </div>

    </form>
  </div>

</div>
</template>

<script>
import $ from 'jquery'
import Test from './Test'

export default {
  name: 'posts',
  beforeCreate () {
    this.$options.components.test = Test
  },
  mounted: function() {
    console.log(Test)
    $('.menu .item').tab();
  },
  methods: {
    submit: function () {
      console.log('submit', document.getElementById('mainForm'))
      let formData = new FormData(document.getElementById('mainForm'))
      console.log(formData)
      formData.forEach((key, value) => console.log(value, key))
      //document.getElementById('mainForm').submit()
    },
    save: function (event) {
      console.log('save')
      debugger
      event.preventDefault()
      let formData = new FormData(event.target)
      formData.forEach((key, value) => console.log(value, key))
    }
  },
  computed: {
    test: function () {
      return Test.render()
    }
  }
}
</script>

<style>
ui.top.attached.tabular.menu tab {
  height: 100%;
}

.settings-content {
  padding-top: 60px;
}
</style>
