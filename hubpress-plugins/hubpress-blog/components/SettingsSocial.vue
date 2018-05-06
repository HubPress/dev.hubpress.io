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
  <div class="field">
    <label>PayPal.me</label>
    <div class="ui left icon input">
      <input type="text" name="social-paypalme" placeholder="PayPal.me" v-bind:value="social.paypalme">
      <i class="cc paypal icon"></i>
    </div>
  </div>
  <div class="field">
    <label>Open Collective</label>
    <div class="ui left icon input">
      <input type="text" name="social-opencollective" placeholder="Open Collective" v-bind:value="social.opencollective">
      <i class="icon opencollective">
        <svg viewBox="0 0 256 256" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" preserveAspectRatio="xMidYMid">
          <g>
            <path d="M209.765144,128.149979 C209.765144,144.1633 204.864381,159.48989 196.498747,172.725072 L229.945675,206.171999 C246.682105,183.856759 255.729307,156.715152 255.729307,128.821102 C255.729307,99.5569917 245.974603,73.0710207 229.258944,51.4858128 L196.48314,84.214794 C205.122561,97.2224683 209.736907,112.48781 209.749537,128.103156 L209.765144,128.149979 Z" fill="#B8D3F4"></path>
            <path d="M127.513484,210.354816 C82.1460872,210.268958 45.3875094,173.517358 45.2930393,128.149979 C45.3617502,82.7643138 82.1278487,45.984257 127.513484,45.8983186 C144.244752,45.8983186 159.571342,50.7990817 172.119792,59.1647154 L204.864381,26.3889116 C182.54365,9.66665129 155.403429,0.630863298 127.513484,0.636494403 C57.1235437,0.636494403 0,57.7600381 0,128.149979 C0,198.508704 57.1235437,255.663463 127.513484,255.663463 C155.537352,255.740876 182.775989,246.40851 204.864381,229.161884 L171.417454,195.730564 C159.555734,205.485268 144.260359,210.354816 127.513484,210.354816 L127.513484,210.354816 Z" fill="#7FADF2"></path>
          </g>
        </svg>

      </i>
    </div>
  </div>
</div>
</template>

<script>
export default {
  name: 'hubpress-settings-social',
  computed: {
    social: function() {
      return this.$store.state.application.config.socialnetwork || {}
    },
  },
}
</script>

<style>
  .opencollective {
    padding-top: 12px;
  }
  .opencollective svg {
    width: 14px;
    height: 14px;
  }
</style>
