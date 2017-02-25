<template>

  <div class="ui middle aligned center aligned grid">
    <div class="column">

      <div class="ui segment">
        <img src="http://hubpress.io/img/freeze/logo.png" class="image">
        <h2 class="ui header">
          Welcome!
        </h2>
        <div class="content">
        </div>
        <form class="ui medium form">
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
            <div class="ui fluid large submit button" @click="login({email, password})">Login</div>
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
