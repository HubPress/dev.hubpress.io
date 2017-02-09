<template>
<div class="">
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
</template>

<script>
export default {
  name: 'hubpress-settings-social'
}
</script>

<style>

</style>
