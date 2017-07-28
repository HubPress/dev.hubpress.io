<template>

  <div class="ui middle aligned center aligned grid">
    <div class="column" v-if="requireInitilisation">
      <div class="ui segment">
        <component is="initialisation-component"></component>
      </div>
    </div>

    <div id="loginForm" class="column" v-if="!requireInitilisation">
      <div class="ui segment">
        <img src="http://hubpress.io/img/freeze/logo.png" class="image">
        <h2 class="ui header">
          Welcome!
        </h2>
        <div class="content">
        </div>
        <form class="ui medium form" v-on:submit.prevent="login({email, password})">
            <div class="field">
              <div class="ui left icon input">
                <i class="user icon"></i>
                <input type="text" name="email" placeholder="Username or e-mail address" :value="email" @input="updateEmail">
              </div>
            </div>
            <div class="field">
              <div class="ui left icon input">
                <i class="lock icon"></i>
                <input type="password" name="password" placeholder="Password" :value="password" @input="updatePassword">
              </div>
            </div>
            <div class="field" v-if="isTwoFactorCodeRequired">
              <div class="ui left icon input">
                <i class="key icon"></i>
                <input type="text" name="twoFactorCode" placeholder="Two factor code" :value="twoFactorCode" @input="updateTwoFactorCode">
              </div>
            </div>
            <button class="ui fluid large submit button" type="submit" name="button">Login</button>
        </form>
        <div class="ui message">
          If you have questions about how to use HubPress, <a href="https://hubpress.gitbooks.io/hubpress-knowledgebase/content/">here is the right place.</a>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
import { mapState } from 'vuex'
import {
  LOGIN_SUBMIT,
  LOGIN_UPDATE_EMAIL,
  LOGIN_UPDATE_PASSWORD,
  LOGIN_UPDATE_TFC,
} from '../constants'

export default {
  name: 'login',
  beforeCreate() {
    this.$options.components[
      'initialisation-component'
    ] = this.$store.state.application.config.initialisationConfigComponent
  },
  computed: {
    ...mapState({
      email: state => state.authentication.credentials.email,
      password: state => state.authentication.credentials.password,
      twoFactorCode: state => state.authentication.credentials.twoFactorCode,
      isTwoFactorCodeRequired: state =>
        state.authentication.isTwoFactorCodeRequired,
      requireInitilisation: state => state.application.requireInitilisation,
    }),
  },
  methods: {
    updateEmail(e) {
      this.$store.commit(LOGIN_UPDATE_EMAIL, e.target.value)
    },
    updatePassword(e) {
      this.$store.commit(LOGIN_UPDATE_PASSWORD, e.target.value)
    },
    updateTwoFactorCode(e) {
      this.$store.commit(LOGIN_UPDATE_TFC, e.target.value)
    },
    login() {
      this.$store.dispatch(LOGIN_SUBMIT, this.$router)
    },
  },
}
</script>

<style scoped>
  .grid {
    height: 100%;
    background-color: #DADADA;
  }

  #loginForm.column {
    max-width: 450px;
  }

  .column {
    max-width: 750px;
  }
</style>
