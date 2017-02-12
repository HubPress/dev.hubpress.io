import _ from 'lodash'
import plugins from '../../plugins'
import logic from './logic'
import Login from './components/Login'
import * as Constants from './constants'

const CORE_LOGIN = 'core:login'
const APPLICATION_INITIALIZE_APP = 'application:initialize-app'

export function authenticationPlugin (context) {
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

          dispatch('application:loading')
            .then(_ => logic.authenticate(opts))
            .then(opts => {
              console.info('logggg')
              commit(Constants.AUTHORISATION_RECEIVE_LOGIN, opts.nextState)
            })
            .then(_ => {
              if (state.isAuthenticated) {
                return dispatch(Constants.AUTHORISATION_AUTHENTICATION_DONE)
              } else {
                if (state.isTwoFactorCodeRequired) {
                  return dispatch('application:notify', {
                    icon: 'unlock',
                    header: 'Two factor code',
                    message: 'A code is required to complete your authentication.',
                    level: 'warning'
                  })
                }
                return _
              }

            })

            .then(_ => dispatch('application:loaded'))
            .then(_ => router.push(router.currentRoute.query.redirect || '/'))
            .catch(_ => {
              dispatch('application:loaded')
              .then(_ => dispatch('application:notify', {
                icon: 'warning circle',
                header: 'Authentication failed',
                message: 'A error occured during the authentication.',
                level: 'error'
              }))
            })
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

  context.on('application:initialize-app', opts => {
    console.info('authenticationPlugin - application:initialize-app')
    console.log('authenticationPlugin - application:initialize-app', opts)
    return logic.initialize(opts)
      .then(_ => opts)
  })


    context.on('authentication:authenticate', opts => {
      console.info('authenticationPlugin - authentication:authenticate')
      console.log('authenticationPlugin - authentication:authenticate', opts, logic)
      return logic.authenticate(opts)
    })
}

export const LoginComponent = Login
