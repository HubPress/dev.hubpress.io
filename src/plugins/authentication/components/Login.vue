<template>

  <div class="ui middle aligned center aligned grid">
    <div class="column">
      <h2 class="ui teal image header">
        <img src="http://hubpress.io/img/freeze/logo.png" class="image">
        <div class="content">
          Log-in to your account
        </div>
      </h2>
      <form class="ui large form">
        <div class="ui stacked segment">
          <div class="field">
            <div class="ui left icon input">
              <i class="user icon"></i>
              <input type="text" name="email" placeholder="E-mail address" :value="email" @input="updateEmail">
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
          <div class="ui fluid large teal submit button" @click="login({email, password})">Login</div>
        </div>

        <div class="ui error message">Erreur </div>

      </form>

      <div class="ui message">
        New to us? <a href="#">Sign Up</a>
      </div>
    </div>
  </div>

</template>

<script>
  import { mapState } from 'vuex'
  import { LOGIN_SUBMIT, LOGIN_UPDATE_EMAIL, LOGIN_UPDATE_PASSWORD, LOGIN_UPDATE_TFC } from '../constants'

  export default {
    name: 'login',
    computed: {
      ...mapState({
        email: state => state.authentication.credentials.email,
        password: state => state.authentication.credentials.password,
        twoFactorCode: state => state.authentication.credentials.twoFactorCode,
        isTwoFactorCodeRequired: state => state.authentication.isTwoFactorCodeRequired
      })
    },
    methods: {
      updateEmail (e) {
        this.$store.commit(LOGIN_UPDATE_EMAIL, e.target.value)
      },
      updatePassword (e) {
        this.$store.commit(LOGIN_UPDATE_PASSWORD, e.target.value)
      },
      updateTwoFactorCode (e) {
        this.$store.commit(LOGIN_UPDATE_TFC, e.target.value)
      },
      login () {
        this.$store.dispatch(LOGIN_SUBMIT, this.$router)
      }
    }
  }
</script>

<style scoped>
  .grid {
    height: 100%;
    background-color: #DADADA;
  }

  .column {
    max-width: 450px;
  }
</style>
