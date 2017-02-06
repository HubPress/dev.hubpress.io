import _ from 'lodash'
import plugins from '../../plugins'
import logic from './logic'
import Login from './components/Login'
import * as Constants from './constants'

const CORE_LOGIN = 'core:login'
const APPLICATION_INITIALIZE_APP = 'application:initialize_app'

export default function authenticationPlugin (context) {
  context.on('application:stores', opts => {
    console.info('authenticationPlugin - application:stores')
    console.log('authenticationPlugin - application:stores', opts)

    const authentication = {
      state: {
        isAuthenticated: false,
        isTwoFactorCodeRequired: false,
        credentials: {
          email: undefined,
          password: undefined,
          twoFactorCode: undefined
        }
      },
      mutations: {
        [Constants.LOGIN_UPDATE_EMAIL] (state, email) {
          state.credentials.email = email
        },
        [Constants.LOGIN_UPDATE_PASSWORD] (state, password) {
          state.credentials.password = password
        },
        [Constants.LOGIN_UPDATE_TFC] (state, twoFactorCode) {
          state.credentials.twoFactorCode = twoFactorCode
        },
        [Constants.AUTHORISATION_REQUEST_LOGIN] (state) {
          console.log(`${Constants.AUTHORISATION_REQUEST_LOGIN}`, state)
          state.isLoading = true
        },
        [Constants.AUTHORISATION_RECEIVE_LOGIN] (state, nextState) {
          _.merge(state, nextState)
        },
        [Constants.AUTHORISATION_FAILURE_LOGIN] (state, value) {
          state.isAuthenticated = false
        },
        // Only for this mutation, the nextState is based on the rootState
        [APPLICATION_INITIALIZE_APP] (state, nextRootState) {
          console.log('authentication-'+APPLICATION_INITIALIZE_APP, nextRootState)
          _.merge(state, nextRootState.authentication)
        }
      },
      actions: {
        [Constants.LOGIN_SUBMIT] ({ dispatch, commit, rootState, state }, router) {
          commit(Constants.AUTHORISATION_REQUEST_LOGIN)

          const opts = {
            rootState: _.cloneDeep(rootState),
            currentState: _.cloneDeep(state)
          }

          logic.authenticate(opts)
          //dispatch(CORE_LOGIN, state)
            .then(opts => {
              console.info('logggg')
              commit(Constants.AUTHORISATION_RECEIVE_LOGIN, opts.nextState)
            })
            .then(_ => {
              if (state.isAuthenticated) {
                return dispatch(Constants.AUTHORISATION_AUTHENTICATION_DONE)
              } else {
                return _
              }

            })
            .then(_ => router.push(router.currentRoute.query.redirect || '/'))
          // Call the HubPress
        }
      },
      getters: {}
    }
    opts.nextState.stores.authentication = authentication
    console.log('authenticationPlugin - application:stores - return', opts)
    return opts
  })

  context.on('application:routes', opts => {
    return opts
  })

  context.on('application:initialize_app', opts => {
    console.info('authenticationPlugin - application:initialize_app')
    console.log('authenticationPlugin - application:initialize_app', opts)
    return logic.initialize(opts)
      .then(_ => opts)
  })


    context.on('authentication:authenticate', opts => {
      console.log('authenticationPlugin - authentication:authenticate', opts, logic)
      return logic.authenticate(opts)
    })
}

export const LoginComponent = Login
