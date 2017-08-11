<template>
<div class="">
  <h4 class="ui dividing header">Informations</h4>
  <div class="field">
    <label>Title</label>
    <input type="text" name="hubpress-title" placeholder="Title" v-bind:value="site.title">
  </div>
  <div class="field">
    <label>Description</label>
    <input type="text" name="hubpress-description" placeholder="Description" v-bind:value="site.description">
  </div>
  <div class="field">
    <label>Logo</label>
    <input type="text" name="hubpress-logo" placeholder="Logo" v-bind:value="site.logo">
  </div>
  <div class="field">
    <label>Cover image</label>
    <input type="text" name="hubpress-cover-image" placeholder="Cover image" v-bind:value="site.cover">
  </div>

  <h4 class="ui dividing header">Rendering</h4>
  <div class="field">
    <label>Live preview render delay (ms)</label>
    <input type="text" name="hubpress-render-delay" placeholder="300" v-bind:value="meta.delay">
  </div>

  <h4 class="ui dividing header">Generation</h4>
  <div class="field">
    <label>Theme</label>
    <input type="text" name="hubpress-theme" placeholder="Theme" v-bind:value="theme.name">
  </div>
  <div class="field">
    <label>Posts per page</label>
    <input type="text" name="hubpress-posts-per-page" placeholder="Posts per page" v-bind:value="site.postsPerPage">
  </div>

  <h4 class="ui dividing header">Services</h4>
  <div class="field">
    <label>Google analytics</label>
    <input type="text" name="hubpress-ga" placeholder="Google analytics" v-bind:value="site.googleAnalytics">
  </div>
  <div class="field">
    <label>Disqus shortname</label>
    <input type="text" name="hubpress-disqus" placeholder="Disqus shortname" v-bind:value="site.disqus">
  </div>

</div>
</template>

<script>
export default {
  name: 'hubpress-settings',
  computed: {
    meta: function () {
      return this.$store.state.application.config.meta || {}
    },
    site: function () {
      return this.$store.state.application.config.site || {}
    },
    theme: function () {
      return this.$store.state.application.config.theme || {}
    }
  }
}
</script>

<style>

</style>
