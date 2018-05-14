import platform from 'platform'
import fetch from 'isomorphic-fetch'
import slugify from 'hubpress-core-slugify'
import Github from 'github-api'
import Q from 'q'
import _ from 'lodash'
import moment from 'moment'
import buildUrlsFromConfig from './urls'
import InitConfig from './components/InitConfig'
import logic from './logic'

const TREE_CHUNK_SIZE = 50
let lastCachedCommit = null

function getRepositoryInfos(repository) {
  let deferred = Q.defer()

  repository.getDetails(function(err, informations) {
    if (err) {
      deferred.reject(err)
    } else {
      deferred.resolve(informations)
    }
  })

  return deferred.promise
}

function getAuthorizations(authorization) {
  let deferred = Q.defer()

  console.log('getAuthorizations', authorization)
  const options = {}
  authorization.listAuthorizations(options, function(err, list) {
    if (err) {
      deferred.reject(err)
    } else {
      console.log('getAuthorizations list', list)
      deferred.resolve(list)
    }
  })

  return deferred.promise
}

function getUserInformations(user) {
  return function() {
    let deferred = Q.defer()
    user.getProfile(function(err, informations) {
      if (err) {
        deferred.reject(err)
      } else {
        deferred.resolve(
          _.pick(informations, [
            'login',
            'id',
            'name',
            'location',
            'blog',
            'avatar_url',
            'bio',
          ]),
        )
      }
    })

    return deferred.promise
  }
}

function getTokenNote(repositoryName) {
  //return S(`hubpress-${platform.name}-${platform.os}`).slugify().s
  return slugify(`${repositoryName}-${platform.name}-${platform.os}`)
}

function _searchAndDeleteAuthorization(
  repositoryName,
  authorizations,
  authorization,
) {
  let deferred = Q.defer()
  let id = -1
  const TOKEN_NOTE = getTokenNote(repositoryName)
  authorizations.forEach(function(token) {
    let note = token.note
    if (note === TOKEN_NOTE) {
      id = token.id
    }
  })

  if (id !== -1) {
    authorization.deleteAuthorization(id, function(err, values) {
      if (err) {
        deferred.reject(err)
      } else {
        deferred.resolve()
      }
    })
  } else {
    deferred.resolve()
  }

  return deferred.promise
}

function _createAuthorization(repositoryName, authorization) {
  let deferred = Q.defer()
  let definition = {
    scopes: ['public_repo'],
    note: getTokenNote(repositoryName),
  }

  authorization.createAuthorization(definition, function(err, createdToken) {
    if (err) {
      deferred.reject(err)
    } else {
      deferred.resolve(createdToken)
    }
  })

  return deferred.promise
}

let githubInstance

function login(opts) {
  console.log('githubPlugin - login', opts)
  const deferred = Q.defer()
  const credentials = opts.nextState.credentials
  const meta = opts.rootState.application.config.meta

  githubInstance = new Github({
    auth: 'basic',
    username: credentials.email,
    password: credentials.password,
    twoFactorCode: credentials.twoFactorCode,
  })

  const repository = githubInstance.getRepo(meta.username, meta.repositoryName)
  const authorization = githubInstance.getAuthorization()
  const user = githubInstance.getUser()
  let _informations
  let _userInformations

  getRepositoryInfos(repository)
    .then(function(informations) {
      _informations = informations
    })
    .then(getUserInformations(user))
    .then(function(userInformations) {
      _userInformations = userInformations
      return getAuthorizations(authorization)
    })
    .then(function(authorizations) {
      return _searchAndDeleteAuthorization(
        meta.repositoryName,
        authorizations,
        authorization,
      )
    })
    .then(function() {
      return _createAuthorization(meta.repositoryName, authorization)
    })
    .then(function(result) {
      githubInstance = new Github({
        auth: 'oauth',
        token: result.token,
      })

      deferred.resolve({
        isAuthenticated: true,
        credentials: {
          token: result.token,
        },
        permissions: _informations.permissions,
        userInformations: _userInformations,
      })
    })
    .catch(function(error) {
      console.error('githubPlugin - login error', error, error.response)
      var message = {
        type: 'error',
        title: 'Authentication',
      }
      var otpRequired

      if (error.response) {
        var otp =
          (error.response.headers && error.response.headers['x-github-otp']) ||
          ''
        otpRequired = otp.split(';')[0] === 'required'
      }

      if (otpRequired) {
        // force sms with a post on auth
        _createAuthorization(meta.repositoryName, authorization)

        console.log('githubPlugin - OTP required : ', otpRequired)
        message.type = 'warning'
        message.content = 'A two-factor authentication code is needed.'
        message.otp = true

        deferred.resolve({
          isAuthenticated: false,
          isTwoFactorCodeRequired: true,
        })
      } else {
        console.error('githubPlugin - login error', error)

        deferred.reject({
          error: {
            code: error.error,
            message: 'Unable to authenticate, check your credentials.',
          },
        })
      }
    })

  return deferred.promise
}

function getGithubPostsSha(repository, config) {
  let deferred = Q.defer()

  repository.getContents(config.meta.branch, '', true, (err, elements) => {
    if (err) {
      deferred.reject(err)
    } else {
      let postsSha
      elements.forEach(element => {
        if (element.name === '_posts') {
          postsSha = element.sha
        }
      })
      deferred.resolve(postsSha)
    }
  })

  return deferred.promise
}

function getPostsGithub(repository, config, sha) {
  let promise

  if (sha === localStorage.postsSha) {
    promise = Q.fcall(function() {
      return []
    })
  } else {
    let deferred = Q.defer()
    repository.getContents(config.meta.branch, '_posts', true, (err, posts) => {
      if (err) {
        deferred.reject(err)
      } else {
        deferred.resolve(posts)
      }
    })

    promise = deferred.promise
  }

  return promise
}

function markIfPostPublished(config, post) {
  const defer = Q.defer()
  const meta = config.meta
  const repository = githubInstance.getRepo(meta.username, meta.repositoryName)
  const type = config.urls.getContentType(post.name)
  repository.getSha(
    config.meta.branch,
    // TODO Test si ca marche
    config.urls.getGhHtmlPathFromAdoc(post.name, type),
    (err, sha) => {
      if (err && err.response && err.response.status !== 404) {
        defer.reject(err)
      } else {
        const isPublished = !!sha ? 1 : 0
        const _post = Object.assign({}, post, { published: isPublished })
        defer.resolve(_post)
      }
    },
  )

  return defer.promise
}

function markIfPostsPublished(repository, config, posts) {
  const _posts = _.compact(posts)

  const promises = _posts.map(post => {
    return markIfPostPublished(config, post)
  })

  return Q.all(promises)
}

function getPostAuthor(config, post, userInformations) {
  const defer = Q.defer()
  const meta = config.meta
  const repository = githubInstance.getRepo(meta.username, meta.repositoryName)

  console.log('getPostAuthor', post)
  repository.listCommits(
    {
      sha: config.meta.branch,
      path: (post.original && post.original.path) || post.path,
    },
    (err, commits) => {
      if (err && err.error !== 404) {
        defer.reject(err)
      } else {
        let author = commits[commits.length - 1].author
        // Sometime author is not defined, in this case we use the authenticated user
        if (!author || author.login === userInformations.login) {
          author = Object.assign({}, userInformations)
          const _post = Object.assign({}, post, { author })
          defer.resolve(_post)
        } else {
          const user = githubInstance.getUser(author.login)
          getUserInformations(user)()
            .then(userInfos => {
              author = Object.assign({}, userInfos)
              const _post = Object.assign({}, post, { author })
              defer.resolve(_post)
            })
            .catch(e => defer.reject(e))
        }
      }
    },
  )

  return defer.promise
}

function getPostsAuthor(repository, config, posts, userInformations) {
  const promises = posts.map(post => {
    return getPostAuthor(config, post, userInformations)
  })

  return Q.all(promises)
}

function readContent(repository, config, posts) {
  let promises = []

  posts.forEach(post => {
    let deferred = Q.defer()
    promises.push(deferred.promise)

    repository.getContents(
      config.meta.branch,
      post.path,
      true,
      (err, content) => {
        if (err) {
          deferred.reject(err)
        } else {
          let _post
          _post = Object.assign({}, post, {
            content: content,
          })

          deferred.resolve(_post)
        }
      },
    )
  })

  return Q.all(promises)
}

function getPosts(state) {
  const config = state.application.config
  console.log('Get posts', config)
  const meta = config.meta
  const repository = githubInstance.getRepo(meta.username, meta.repositoryName)

  return getGithubPostsSha(repository, config)
    .then(sha => {
      return getPostsGithub(repository, config, sha)
    })
    .then(posts => {
      return posts.map(post => _.pick(post, ['name', 'path', 'sha', 'size']))
    })
    .then(posts => {
      return markIfPostsPublished(repository, config, posts)
    })
    .then(posts => {
      return getPostsAuthor(
        repository,
        config,
        posts,
        state.authentication.userInformations,
      )
    })
    .then(posts => {
      return readContent(repository, config, posts)
    })
}

function deleteElement(repository, branch, elementPath) {
  const defer = Q.defer()
  repository.deleteFile(branch, elementPath, (err, sha) => {
    if (err) {
      defer.reject(err)
    } else {
      console.error(sha)
      lastCachedCommit = sha.commit
      defer.resolve(sha)
    }
  })
  return defer.promise
}

// Alias deleteElement
function deletePost(repository, branch, elementPath) {
  return deleteElement(repository, branch, elementPath)
}

// Deprecated prefere moveDocumentIfNecessary
function movePostIfNecessary(config, post) {
  const meta = config.meta
  const repository = githubInstance.getRepo(meta.username, meta.repositoryName)

  let returnedPromise

  // Check if the name has  changed
  if (post.original && post.name !== post.original.name) {
    const defer = Q.defer()
    returnedPromise = defer.promise

    const branch = config.meta.branch
    const origin = `_posts/${post.original.name}`
    const dest = `_posts/${post.name}`

    repository.move(branch, origin, dest, (err, sha) => {
      if (err) {
        defer.reject(err)
      } else {
        // if published, then removed
        if (!post.published) {
          defer.resolve({ post: post, sha: sha })
        } else {
          // Remove the post published with the old name
          let oldPublishedPostPath = config.urls.getGhHtmlPathFromAdoc(
            post.original.name,
            post.original.type
          )

          deletePost(repository, branch, oldPublishedPostPath)
            .then(sha => {
              defer.resolve({ post: post, sha: sha })
            })
            .catch(err => {
              defer.reject(err)
            })
            .done()
        }
      }
    })
  } else {
    returnedPromise = Q({ post: post })
  }

  return returnedPromise
}



function writePost(config, post) {
  console.log('Write post', config, post)
  const meta = config.meta
  const repository = githubInstance.getRepo(meta.username, meta.repositoryName)
  const branch = meta.branch
  const postPath = `_posts/${post.name}`
  const commitMessage = `Update ${post.name}`
  const defer = Q.defer()
  repository.writeFile(
    branch,
    postPath,
    post.content,
    commitMessage,
    (err, sha) => {
      if (err) {
        defer.reject(err)
      } else {
        post.original = _.omit(post, ['original']) //Object.assign({}, post)
        post.original.url = config.urls.getContentUrl(post.original.name, post.original.type)
        post.original.path = '_posts/' + post.original.name
        post.original.sha = sha
        lastCachedCommit = sha.commit
        console.info('Update lastCacheCommit', lastCachedCommit)
        defer.resolve(post)
      }
    },
  )

  return defer.promise
}

function writeConfig(config) {
  console.log('Write config', config)
  const defer = Q.defer()
  const meta = config.meta
  const repository = githubInstance.getRepo(meta.username, meta.repositoryName)
  const branch = meta.branch

  repository.writeFile(
    branch,
    'hubpress/config.json',
    JSON.stringify(config, null, 2),
    'Update configuration file',
    (err, sha) => {
      if (err) {
        defer.reject(err)
      } else {
        lastCachedCommit = sha.commit
        console.info('Update lastCacheCommit', lastCachedCommit)
        defer.resolve(sha)
      }
    },
  )
  return defer.promise
}

function manageCname(config) {
  console.log('Github manageCname - ', config)
  const meta = config.meta
  const repository = githubInstance.getRepo(meta.username, meta.repositoryName)
  const defer = Q.defer()
  const cb = (err, sha) => {
    // not found if we try to delete CNAME that not exist
    // TODO Compare with the previous settings state
    if (err && err !== 'not found') {
      defer.reject(err)
    } else {
      defer.resolve(sha)
    }
  }

  if (!meta.cname || meta.cname === '') {
    console.info('SettingsService - saveAndPublish delete CNAME')
    repository
      .deleteFile(meta.branch, 'CNAME', cb)
      .then(sha => {
        console.log('SHA after delete', sha)
        defer.resolve(sha)
      })
      .catch(err => {
        if (err.response.status !== 404) {
          defer.reject(err)
        } else {
          defer.resolve()
        }
      })
  } else {
    console.info('SettingsService - saveAndPublish save CNAME')
    repository.writeFile(
      meta.branch,
      'CNAME',
      meta.cname,
      `Update CNAME with ${meta.cname}`,
      (err, sha) => {
        if (err) {
          defer.reject(err)
        } else {
          lastCachedCommit = sha.commit
          console.info('Update lastCacheCommit', lastCachedCommit)
          defer.resolve(sha)
        }
      },
    )
  }

  return defer.promise
}

function getLatestCommitSha(branchCommit, lastCachedCommit) {
  console.error(branchCommit, lastCachedCommit)
  if (!lastCachedCommit) return branchCommit.sha

  const momentBranchCommit = moment(branchCommit.committer.date)
  const momentLastCachedCommit = moment(lastCachedCommit.committer.date)

  if (momentLastCachedCommit.isAfter(momentBranchCommit))
    return lastCachedCommit.sha

  return branchCommit.sha
}

export function githubPlugin(context) {
  context.on('application:request-config', opts => {
    console.info('githubPlugin - application:request-config')
    console.log('githubPlugin - application:request-config', opts)
    return fetch('config.json?dt=' + Date.now())
      .then(req => req.json())
      .then(config => {
        opts.nextState.config = Object.assign({}, opts.nextState.config, config)
        // TODO remove after 0.6.0
        opts.nextState.config.theme.name = opts.nextState.config.theme.name.toLowerCase()
        return opts
      })
  })

  context.on('application:receive-config', function(opts) {
    console.info('githubPlugin - application:receive-config')
    console.log('githubPlugin - application:receive-config', opts)
    const urls = buildUrlsFromConfig(opts.nextState.config)
    opts.nextState.config = Object.assign({}, opts.nextState.config, { urls })
    return opts
  })

  context.on('requestAuthentication', opts => {
    console.info('githubPlugin - requestAuthentication')
    console.log('githubPlugin - requestAuthentication', opts)
    return login(opts).then(result => {
      const credentials = Object.assign(
        {},
        opts.nextState.credentials,
        result.credentials,
      )
      opts.nextState = Object.assign({}, opts.nextState, result, {
        credentials,
      })
      return opts
    })
  })

  context.on('receiveSavedAuth', opts => {
    console.info('githubPlugin - receiveSavedAuth')
    console.log('githubPlugin - receiveSavedAuth', opts)
    if (opts.nextState.authentication.isAuthenticated) {
      githubInstance = new Github({
        auth: 'oauth',
        token: opts.nextState.authentication.credentials.token,
      })
    }
    return opts
  })

  context.on('hubpress:request-remote-synchronization', opts => {
    console.info('githubPlugin - hubpress:request-remote-synchronization')
    console.log('githubPlugin - hubpress:request-remote-synchronization', opts)
    if (!opts.rootState.authentication.isAuthenticated) {
      return opts
    }

    return getPosts(opts.rootState).then(posts => {
      opts.nextState = Object.assign({}, opts.nextState, { posts })
      return opts
    })
  })

  context.on('requestSaveRemotePost', opts => {
    console.info('githubPlugin - requestSaveRemotePost')
    console.log('githubPlugin - requestSaveRemotePost', opts)
    const config = opts.rootState.application.config
    const post = opts.nextState.post
    // Move if necessary
    return movePostIfNecessary(config, post)
      .then(result => {
        return writePost(config, result.post)
      })
      .then(_post => {
        return getPostAuthor(
          config,
          _post,
          opts.rootState.authentication.userInformations,
        )
      })
      .then(updatedPost => {
        opts.nextState.post = updatedPost
        return opts
      })
  })

  context.on('requestSaveRemotePublishedElements', opts => {
    console.info('githubPlugin - requestSaveRemotePublishedElements')
    console.log('githubPlugin - requestSaveRemotePublishedElements', opts)

    // const defer = Q.defer()
    const meta = opts.rootState.application.config.meta
    const repository = githubInstance.getRepo(
      meta.username,
      meta.repositoryName,
    )

    const promises = []
    const totalElementsToPublish = opts.nextState.elementsToPublish.length
    const chunkOfElements = _.chunk(
      opts.nextState.elementsToPublish,
      TREE_CHUNK_SIZE,
    )

    console.log('Writeall', opts.nextState.elementsToPublish)

    let rootPromise = Q.defer()

    repository.getBranch(meta.branch, (err, branch) => {
      if (err) {
        const deferred = Q.defer()
        rootPromise = deferred.promise
        return deferred.reject(err)
      }
      let publishedCount = 0
      const chainPromise = chunkOfElements.reduce(
        (promise, elements) => {
          const callback = branchLatestCommit => {
            const deferred = Q.defer()
            const tree = elements.map(element => {
              return {
                path: element.path,
                mode: '100644',
                type: 'blob',
                content: element.content,
              }
            })
            repository.createTree(tree, branchLatestCommit, (err, branch) => {
              if (err) {
                return deferred.reject(err)
              }

              repository.commit(
                branchLatestCommit,
                branch.sha,
                `Published ${publishedCount +
                  elements.length}/${totalElementsToPublish} elements`,
                (err, commit) => {
                  if (err) {
                    return deferred.reject(err)
                  }
                  publishedCount = publishedCount + elements.length
                  lastCachedCommit = commit
                  repository.updateHead(
                    `heads/${meta.branch}`,
                    commit.sha,
                    false,
                    (err, res) => {
                      console.log('updateHead', err, res)
                      if (err) {
                        return deferred.reject(err)
                      }
                      deferred.resolve(commit.sha)
                    },
                  )
                },
              )
            })

            return deferred.promise
          }

          return promise.then(callback)
        },
        Q(
          getLatestCommitSha(
            {
              committer: branch.commit.commit.committer,
              sha: branch.commit.sha,
            },
            lastCachedCommit,
          ),
        ),
      )

      chainPromise
        .then(sha => {
          rootPromise.resolve(opts)
        })
        .catch(err => {
          rootPromise.reject(err)
        })
    })
    return rootPromise.promise
  })

  context.on('requestDeleteRemotePost', opts => {
    console.info('githubPlugin - requestDeleteRemotePost')
    console.log('githubPlugin - requestDeleteRemotePost', opts)
    const defer = Q.defer()
    const config = opts.rootState.application.config
    const meta = config.meta
    const repository = githubInstance.getRepo(
      meta.username,
      meta.repositoryName,
    )
    const elementPath = opts.nextState.post.original.path

    repository
      .deleteFile(meta.branch, elementPath, (err, sha) => {
        if (err && err.response && err.response.status !== 404) {
          defer.reject(err)
        } else {
          console.error('requestDeleteRemotePost', sha)
          lastCachedCommit = sha.commit
          defer.resolve(opts)
        }
      })
      .catch(err => {
        if (err && err.response && err.response.status === 404) {
          defer.resolve(opts)
        }
      })

    return defer.promise
  })

  context.on('requestDeleteRemotePublishedPost', opts => {
    console.info('githubPlugin - requestDeleteRemotePublishedPost')
    console.log('githubPlugin - requestDeleteRemotePublishedPost', opts)
    const defer = Q.defer()
    const config = opts.rootState.application.config
    const meta = config.meta
    const repository = githubInstance.getRepo(
      meta.username,
      meta.repositoryName,
    )
    const elementPath = config.urls.getGhHtmlPathFromAdoc(
      opts.nextState.post.original.name,
      opts.nextState.post.original.type
    )

    repository.deleteFile(meta.branch, elementPath, (err, sha) => {
      if (err) {
        defer.reject(err)
      } else {
        console.error('requestDeleteRemotePublishedPost', sha)
        lastCachedCommit = sha.commit
        defer.resolve(opts)
      }
    })

    return defer.promise
  })

  context.on('application:request-save-config', opts => {
    console.info('githubPlugin - application:request-save-config')
    console.log('githubPlugin - application:request-save-config', opts)

    const application = opts.nextState.application
    return writeConfig(application.config)
      .then(sha => manageCname(application.config))
      .then(sha => {
        return opts
      })
  })

  context.on('receiveRenderingPost', opts => {
    console.info('githubPlugin - receiveRenderingPost')
    console.log('githubPlugin - receiveRenderingPost', opts)
    return opts
  })

  context.on('application:initialize-plugins', opts => {
    console.info('githubPlugin - application:initialize-plugins')
    console.log('githubPlugin - application:initialize-plugins', opts)

    // Check if the config.json is ok
    const requireInitilisation =
      opts.rootState.application.config.meta.repositoryName ===
        'put your repository name here' ||
      opts.rootState.application.config.meta.username ===
        'put your username here'

    opts.nextState.application.requireInitilisation = requireInitilisation
    opts.nextState.application.config.initialisationConfigComponent = InitConfig

    return opts
  })

  // decks
  context.on('deck:request-remote-synchronization', opts => {
    console.info('githubPlugin - deck:request-remote-synchronization')
    console.log('githubPlugin - deck:request-remote-synchronization', opts)

    if (!opts.rootState.authentication.isAuthenticated) {
      return opts
    }

    return logic.synchronizeAndGetContentsFromTypes(githubInstance, opts)
      .then(contentsByType => {
        opts.nextState = {
          ...opts.nextState,
          ...contentsByType
        }
        return opts
      })
  })

  context.on('deck:request-save-remote-deck', opts => {
    console.info('githubPlugin - deck:request-save-remote-deck')
    console.log('githubPlugin - deck:request-save-remote-deck', opts)
    const configuration = opts.rootState.application.config
    const document = opts.payload.deck

    return logic.saveDocument(githubInstance, opts)
    .then(updatedDeck => {
      opts.nextState.deck = updatedDeck
      return opts
    })
  })

  context.on('deck:request-delete-remote-deck', opts => {
    console.info('githubPlugin - deck:request-delete-remote-deck')
    console.log('githubPlugin - deck:request-delete-remote-deck', opts)
    const defer = Q.defer()
    const config = opts.rootState.application.config
    const meta = config.meta
    const repository = githubInstance.getRepo(
      meta.username,
      meta.repositoryName,
    )
    const elementPath = opts.payload.deck.original.path

    repository
      .deleteFile(meta.branch, elementPath, (err, sha) => {
        if (err && err.response && err.response.status !== 404) {
          defer.reject(err)
        } else {
          console.error('deck:request-delete-remote-deck', sha)
          lastCachedCommit = sha.commit
          defer.resolve(opts)
        }
      })
      .catch(err => {
        if (err && err.response && err.response.status === 404) {
          defer.resolve(opts)
        }
      })

    return defer.promise
  })

  context.on('deck:request-delete-remote-published-deck', opts => {
    console.info('githubPlugin - deck:request-delete-remote-published-deck')
    console.log('githubPlugin - deck:request-delete-remote-published-deck', opts)
    const defer = Q.defer()
    const config = opts.rootState.application.config
    const meta = config.meta
    const repository = githubInstance.getRepo(
      meta.username,
      meta.repositoryName,
    )
    const document = opts.payload.deck

    const elementPath = config.urls.getGhHtmlPathFromAdoc(
      opts.nextState.deck.original.name,

      // FIXME it is not normal that the original.type is undefined
      opts.nextState.deck.original.type || opts.nextState.deck.type
    )

    repository.deleteFile(meta.branch, elementPath, (err, sha) => {
      if (err) {
        defer.reject(err)
      } else {
        console.error('deck:request-delete-remote-published-deck', sha)
        lastCachedCommit = sha.commit
        defer.resolve(opts)
      }
    })

    return defer.promise
  })
}
