import platform from 'platform'
import fetch from 'isomorphic-fetch'
import slugify from 'hubpress-core-slugify'
import Github from 'github-api'
import Q from 'q'
import _ from 'lodash'
import buildUrlsFromConfig from './urls'

function getRepositoryInfos (repository) {
  let deferred = Q.defer()

  repository.show(function (err, informations) {
    if (err) {
      deferred.reject(err)
    }
    else {
      deferred.resolve(informations)
    }
  })

  return deferred.promise
}

function getAuthorizations (authorization) {
  let deferred = Q.defer()

  authorization.list(function(err, list) {
    if (err) {
      deferred.reject(err)
    }
    else {
      deferred.resolve(list)
    }
  })

  return deferred.promise


}

function getUserInformations(user) {

  return function(username) {
    let deferred = Q.defer()

    user.show(username, function(err, informations) {
      if (err) {
        deferred.reject(err)
      }
      else {
        deferred.resolve(_.pick(informations, [
          'login',
          'id',
          'name',
          'location',
          'blog',
          'avatar_url',
          'bio'
        ]))
      }
    })

    return deferred.promise

  }
}

function getTokenNote(repositoryName) {
  //return S(`hubpress-${platform.name}-${platform.os}`).slugify().s
  return slugify(`${repositoryName}-${platform.name}-${platform.os}`)
}

function _searchAndDeleteAuthorization(repositoryName, authorizations, authorization ) {
  let deferred = Q.defer()
  let id = -1
  const TOKEN_NOTE = getTokenNote(repositoryName)
  authorizations.forEach(function(token) {
    let note = token.note
    console.log('TOOOOOOKEN', note, TOKEN_NOTE, note === TOKEN_NOTE)
    if (note === TOKEN_NOTE) {
      id = token.id
    }
  })

  if (id !== -1) {
    authorization.delete(id, function(err, values) {
      if (err) {
        deferred.reject(err)
      }
      else {
        deferred.resolve()
      }
    })
  }
  else {
    deferred.resolve()
  }


  return deferred.promise
}

function _createAuthorization(repositoryName, authorization) {
  let deferred = Q.defer()
  let definition = {
    scopes: [
    'public_repo'
    ],
    note: getTokenNote(repositoryName)
  }


  authorization.create(definition, function(err, createdToken) {
    if (err) {
      deferred.reject(err)
    }
    else {
      deferred.resolve(createdToken)
    }
  })

  return deferred.promise
}

let githubInstance

function login (opts) {
  console.log('Github Plugin - login', opts)
  const deferred = Q.defer()
  const credentials = opts.nextState.credentials
  const meta = opts.rootState.application.config.meta

  githubInstance = new Github({
    auth: "basic",
    username: credentials.email,
    password: credentials.password,
    twoFactorCode: credentials.twoFactorCode
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
      return _searchAndDeleteAuthorization(meta.repositoryName, authorizations, authorization)
    })
    .then(function() {
      return _createAuthorization(meta.repositoryName, authorization)
    })
    .then(function(result) {
      githubInstance = new Github({
        auth: "oauth",
        token: result.token
      })

      deferred.resolve({
        isAuthenticated: true,
        credentials: {
          token: result.token
        },
        permissions: _informations.permissions,
        userInformations: _userInformations
      })
    })
    .catch(function(error) {
      console.error('Github Plugin - login error', error)
      var message = {
        type: 'error',
        title: 'Authentication'
      }
      var otpRequired

      if (error.request) {
        var otp = error.request.getResponseHeader('X-GitHub-OTP') || ''
        otpRequired = otp.split(';')[0] === 'required'
      }

      if (otpRequired) {
        // force sms with a post on auth
        _createAuthorization(meta.repositoryName, authorization)

        console.log('Github Plugin - OTP required : ', otpRequired)
        message.type = 'warning'
        message.content = 'A two-factor authentication code is needed.'
        message.otp = true

        deferred.resolve({
          isAuthenticated: false,
          isTwoFactorCodeRequired: true
        })
      }
      else {
        console.error('Github Plugin - login error', error)

        deferred.reject({
          error: {
            code: error.error,
            message: 'Unable to authenticate, check your credentials.'
          }
        })
      }
    })

    return deferred.promise
}

function getGithubPostsSha(repository, config) {

  let deferred = Q.defer()

  repository.read(config.meta.branch, '', (err, elements) => {
    if (err) {
      deferred.reject(err)
    }
    else {
      let postsSha
      elements = JSON.parse(elements)

      elements.forEach((element) => {
        if (element.name === '_posts'){
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
  }
  else {
    let deferred = Q.defer()
    repository.read(config.meta.branch, '_posts', (err, posts) => {
      if (err) {
        deferred.reject(err)
      }
      else {
        deferred.resolve(JSON.parse(posts))
      }
    })

    promise = deferred.promise
  }

  return promise
}

function markIfPostPublished (config, post) {
  const defer = Q.defer()
  const meta = config.meta
  const repository = githubInstance.getRepo(meta.username, meta.repositoryName)

  repository.getSha(config.meta.branch, config.urls.getPostGhPath(post.name), (err, sha) => {
    if (err && err.error !==404) {
      defer.reject(err)
    }
    else {
      const isPublished = !!sha ? 1 : 0
      const _post = Object.assign({}, post, {published: isPublished})
      console.log("markIfPostPublished post", _post)
      defer.resolve(_post)
    }
  })

  return defer.promise
}

function markIfPostsPublished (repository, config, posts) {
  const _posts = _.compact(posts)

  const promises = _posts.map((post) => {
    return markIfPostPublished(config, post)
  })

  return Q.all(promises)
}

function getPostAuthor (config, post, userInformations) {
  const defer = Q.defer()
  const meta = config.meta
  const repository = githubInstance.getRepo(meta.username, meta.repositoryName)

  console.log('getPostAuthor', post)
  repository.getCommits({
    sha: config.meta.branch,
    path: post.original && post.original.path || post.path
  }, (err, commits) => {
    if (err && err.error !==404) {
      defer.reject(err)
    }
    else {
      let author = commits[commits.length - 1].author
      // Sometime author is not defined, in this case we use the authenticated user
      if (!author || author.login === userInformations.login) {
        author = Object.assign({}, userInformations)
        const _post = Object.assign({}, post, {author})
        defer.resolve(_post)
      }
      else {
        const user = githubInstance.getUser()
        getUserInformations(user)(author.login)
        .then( userInfos => {
          author = Object.assign({}, userInfos)
          const _post = Object.assign({}, post, {author})
          defer.resolve(_post)
        })
        .catch(e => defer.reject(e))
      }
    }
  })

  return defer.promise
}

function getPostsAuthor (repository, config, posts, userInformations) {
  const promises = posts.map((post) => {
    return getPostAuthor(config, post, userInformations)
  })

  return Q.all(promises)
}


function readContent(repository, config, posts) {
  let promises = []

  posts.forEach((post) => {
    let deferred = Q.defer()
    promises.push(deferred.promise)

    repository.read(config.meta.branch, post.path, (err, content) => {
      if (err) {
        deferred.reject(err)
      }
      else {
        let _post
          _post = Object.assign({}, post, {
            content: content
          })

        deferred.resolve(_post)
      }
    })
  })

  return Q.all(promises)

}

function getPosts (state) {
  const config = state.application.config
  console.log('Get posts', config)
  const meta = config.meta
  const repository = githubInstance.getRepo(meta.username, meta.repositoryName)

  return getGithubPostsSha(repository, config)
  .then((sha) => {
    return getPostsGithub(repository, config,sha)
  })
  .then(posts => {
    return posts.map(post => _.pick(post, ['name', 'path', 'sha', 'size']))
  })
  .then((posts)=>{
    return markIfPostsPublished(repository, config, posts)
  })
  .then((posts)=>{
    return getPostsAuthor(repository, config, posts, state.authentication.userInformations)
  })
  .then((posts)=>{
    return readContent(repository, config, posts)
  })
}

function deleteElement (repository, branch, elementPath) {
  const defer = Q.defer()
  repository.delete(branch, elementPath, (err, sha) => {
    if (err) {
      defer.reject(err)
    }
    else {
      defer.resolve(sha)
    }
  })
  return defer.promise
}

// Alias deleteElement
function deletePost(repository, branch, elementPath) {
  return deleteElement(repository, branch, elementPath)
}


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
      }
      else {
        // if published, then removed
        if (!post.published) {
          defer.resolve({post: post, sha: sha})
        }
        else {
          // Remove the post published with the old name
          let oldPublishedPostPath = config.urls.getPostGhPath(post.original.name)

          deletePost(repository, branch, oldPublishedPostPath)
          .then(sha => {
            defer.resolve({post: post, sha: sha})
          })
          .catch(err => {
            defer.reject(err)
          })
          .done()
        }
      }
    })
  }
  else {
    returnedPromise = Q({post: post})
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
	repository.write(branch, postPath, post.content, commitMessage, (err, sha) => {
		if (err) {
			defer.reject(err)
		}
		else {
			post.original = _.omit(post, ['original'])//Object.assign({}, post)
			post.original.url = config.urls.getPostUrl(post.original.name)
			post.original.path = '_posts/' + post.original.name
			post.original.sha = sha
			defer.resolve(post)
		}

	})

	return defer.promise
}

function writeConfig (config) {
  console.log('Write config', config)
  const defer = Q.defer()
  const meta = config.meta
  const repository = githubInstance.getRepo(meta.username, meta.repositoryName)
  const branch = meta.branch

  repository.write(branch, 'hubpress/config.json', JSON.stringify(config, null, 2), 'Update configuration file', (err, sha) => {
    if (err) {
      defer.reject(err)
    }
    else {
      defer.resolve(sha)
    }
  })
  return defer.promise
}

function manageCname (config) {
  console.log('Github manageCname - ', config)
  const meta = config.meta
  const repository = githubInstance.getRepo(meta.username, meta.repositoryName)
  const defer = Q.defer()
  const cb = (err, sha) => {
    // not found if we try to delete CNAME that not exist
    // TODO Compare with the previous settings state
    if (err && err !== 'not found') {
      defer.reject(err)
    }
    else {
      defer.resolve(sha)
    }
  }

  if (!meta.cname || meta.cname === '') {
    console.info('SettingsService - saveAndPublish delete CNAME')
    repository.delete(meta.branch, 'CNAME', cb)
  } else {
    console.info('SettingsService - saveAndPublish save CNAME')
    repository.write(meta.branch, 'CNAME', meta.cname, `Update CNAME with ${meta.cname}`, cb)
  }

  return defer.promise
}


export function githubPlugin (hubpress) {

  hubpress.on('application:request-config', (opts) => {
    console.info('Github Plugin - application:request-config')
    console.log('application:request-config', opts)
    return fetch('config.json?dt='+Date.now())
      .then(req => req.json())
      .then(config => {
        opts.nextState.config = Object.assign({}, opts.nextState.config, config)
        // TODO remove after 0.6.0
        opts.nextState.config.theme.name = opts.nextState.config.theme.name.toLowerCase()
        return opts
      })
  })

  hubpress.on('application:receive-config', function (opts) {
    console.info('Github Plugin - application:receive-config')
    console.log('application:receive-config', opts)
    const urls = buildUrlsFromConfig(opts.nextState.config)
    opts.nextState.config = Object.assign({}, opts.nextState.config, {urls})
    return opts
  });

  hubpress.on('requestAuthentication', (opts) => {
    console.info('Github Plugin - requestAuthentication')
    console.log('requestAuthentication', opts)
    return login(opts)
    .then((result) => {
      const credentials = Object.assign({}, opts.nextState.credentials, result.credentials)
      opts.nextState = Object.assign({}, opts.nextState, result, {credentials})
      console.error(opts, result)
      return opts
    })
  })

  hubpress.on('receiveSavedAuth', (opts) => {
    console.info('Github Plugin - receiveSavedAuth')
    console.log('receiveSavedAuth', opts)
    if (opts.nextState.authentication.isAuthenticated) {
      githubInstance = new Github({
        auth: "oauth",
        token: opts.nextState.authentication.credentials.token
      })
    }
    return opts
  })

  hubpress.on('hubpress:request-remote-synchronization', (opts) => {
    console.info('Github Plugin - hubpress:request-remote-synchronization')
    console.log('hubpress:request-remote-synchronization', opts)
    if (!opts.rootState.authentication.isAuthenticated) {
      return opts
    }
    return getPosts(opts.rootState)
      .then(posts => {
        opts.nextState= Object.assign({}, opts.nextState, {posts})
        return opts
      })

  })

  hubpress.on('requestSaveRemotePost', (opts) => {
    console.info('Github Plugin - requestSaveRemotePost')
    console.log('requestSaveRemotePost', opts)
    const config = opts.state.application.config
    const post = opts.data.post
    // Move if necessary
    return movePostIfNecessary(config, post)
    .then(result => {
      return writePost(config, result.post)
    })
    .then(_post =>{
      return getPostAuthor(config, _post, opts.state.authentication.userInformations)
    })
    .then(updatedPost => {
      const data = Object.assign({}, opts.data, {post: updatedPost})
      return Object.assign({}, opts, {data})
    })
  })

  hubpress.on('requestSaveRemotePublishedElements', (opts) => {
    console.info('Github Plugin - requestSaveRemotePublishedElements')
    console.log('requestSaveRemotePublishedElements', opts)

    const defer = Q.defer()
    const meta = opts.state.application.config.meta
    const repository = githubInstance.getRepo(meta.username, meta.repositoryName)

    repository.writeAll(meta.branch, opts.data.elementsToPublish, (err, commit) => {
      if (err) {
        defer.reject(err)
      }
      else {
        repository.write(meta.branch, '.last-sha', commit, 'Update last sha', (err, sha) => {
          if (err) {
            console.log('.last-sha', err)
            defer.reject(err)
          }
          else {
            console.log('.last-sha done')
            defer.resolve(opts)
          }
        })
      }
    })

    return defer.promise
  })

  hubpress.on('requestDeleteRemotePost', (opts) => {
    console.info('Github Plugin - requestDeleteRemotePost')
    console.log('requestDeleteRemotePost', opts)
    const defer = Q.defer()
    const config = opts.state.application.config
    const meta = config.meta
    const repository = githubInstance.getRepo(meta.username, meta.repositoryName)
    const elementPath = opts.data.post.original.path


    repository.delete(meta.branch, elementPath, (err, sha)=>{
      if (err) {
        defer.reject(err)
      }
      else {
        defer.resolve(opts)
      }
    })

    return defer.promise
  })

  hubpress.on('requestDeleteRemotePublishedPost', (opts) => {
    console.info('Github Plugin - requestDeleteRemotePublishedPost')
    console.log('requestDeleteRemotePublishedPost', opts)
    const defer = Q.defer()
    const config = opts.state.application.config
    const meta = config.meta
    const repository = githubInstance.getRepo(meta.username, meta.repositoryName)
    const elementPath = config.urls.getPostGhPath(opts.data.post.original.name)


    repository.delete(meta.branch, elementPath, (err, sha)=>{
      if (err) {
        defer.reject(err)
      }
      else {
        defer.resolve(opts)
      }
    })

    return defer.promise
  })

  hubpress.on('requestSaveConfig', (opts) => {
    console.info('Github Plugin - requestSaveConfig')
    console.log('requestSaveConfig', opts)

    return writeConfig(opts.data.config)
      .then(sha => manageCname(opts.data.config))
      .then(sha => {
        return opts
      })

  })
}
