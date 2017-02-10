<template>
<div class="">
  <div class="field">
    <label>Email</label>
    <input type="email" name="social-email" placeholder="Email" v-bind:value="social.email">
  </div>
  <div class="field">
    <label>GitHub</label>
    <div class="ui left icon input">
      <input type="text" name="social-github" placeholder="GitHub" v-bind:value="social.github">
      <i class="github icon"></i>
    </div>
  </div>
  <div class="field">
    <label>Twitter</label>
    <div class="ui left icon input">
      <input type="text" name="social-twitter" placeholder="Twitter" v-bind:value="social.twitter">
      <i class="twitter icon"></i>
    </div>
  </div>
  <div class="field">
    <label>Facebook</label>
    <div class="ui left icon input">
      <input type="text" name="social-facebook" placeholder="Facebook" v-bind:value="social.facebook">
      <i class="facebook icon"></i>
    </div>
  </div>
  <div class="field">
    <label>Google Plus</label>
    <div class="ui left icon input">
      <input type="text" name="social-googleplus" placeholder="Google Plus" v-bind:value="social.googleplus">
      <i class="google plus icon"></i>
    </div>
  </div>
  <div class="field">
    <label>Instagram</label>
    <div class="ui left icon input">
      <input type="text" name="social-instagram" placeholder="Instagram" v-bind:value="social.instagram">
      <i class="instagram icon"></i>
    </div>
  </div>
  <div class="field">
    <label>Pinterest</label>
    <div class="ui left icon input">
      <input type="text" name="social-pinterest" placeholder="Pinterest" v-bind:value="social.pinterest">
      <i class="pinterest icon"></i>
    </div>
  </div>
  <div class="field">
    <label>Flickr</label>
    <div class="ui left icon input">
      <input type="text" name="social-flickr" placeholder="Flickr" v-bind:value="social.flickr">
      <i class="flickr icon"></i>
    </div>
  </div>
  <div class="field">
    <label>Linkedin</label>
    <div class="ui left icon input">
      <input type="text" name="social-linkedin" placeholder="Linkedin" v-bind:value="social.linkedin">
      <i class="linkedin icon"></i>
    </div>
  </div>
  <div class="field">
    <label>Stack Overflow</label>
    <div class="ui left icon input">
      <input type="text" name="social-stackoverflow" placeholder="Stack Overflow" v-bind:value="social.stackoverflow">
      <i class="stack overflow icon"></i>
    </div>
  </div>
</div>
</template>

<script>
export default {
  name: 'hubpress-settings-social',
  computed: {
    social: function () {
      return this.$store.state.application.config.socialnetwork || {}
    }
  }
}
</script>

<style>

</style>
