export function sessionStoragePlugin(hubpress) {
  // store credentials in localstorage
  hubpress.on('receiveAuthentication', opts => {
    console.info('SessionStorage Plugin - receiveAuthentication')
    console.log('receiveAuthentication', opts)
    if (opts.nextState.isAuthenticated) {
      sessionStorage.setItem(
        `${opts.rootState.application.config.meta
          .repositoryName}-authentication`,
        JSON.stringify({
          credentials: {
            token: opts.nextState.credentials.token,
          },
          permissions: opts.nextState.permissions,
          userInformations: opts.nextState.userInformations,
        }),
      )
    }

    return opts
  })

  hubpress.on('requestSavedAuth', opts => {
    console.info('SessionStorage Plugin - requestSavedAuth')
    console.log('requestSavedAuth', opts)
    let authentication
    const storedData = sessionStorage.getItem(
      `${opts.rootState.application.config.meta.repositoryName}-authentication`,
    )

    if (storedData) {
      authentication = JSON.parse(storedData)
      authentication.isAuthenticated = true
    } else {
      authentication = {
        credentials: {},
        userInformations: {},
        isAuthenticated: false,
      }
    }

    opts.nextState.authentication = Object.assign(
      {},
      opts.nextState.authentication,
      authentication,
    )
    return opts
  })

  hubpress.on('requestLogout', opts => {
    console.info('SessionStorage Plugin - requestLogout')
    console.log('requestLogout', opts)
    sessionStorage.removeItem(
      `${opts.rootState.application.config.meta.repositoryName}-authentication`,
    )
    return opts
  })
}
