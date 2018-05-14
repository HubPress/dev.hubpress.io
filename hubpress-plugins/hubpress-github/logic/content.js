async function getContentsShaByType(repository, branch, contentTypes) {
  let shaByType
  try {
    let contents = await repository.getContents(branch, 'contents', true)
    contents = contents.data.reduce((memo, content) => ({
      ...memo,
      [content.name]: content.sha
    }), {})
    shaByType = contentTypes.map(contentType => ({
        type: contentType,
        sha: contents[contentType],
        path: `contents/${contentType}`
      })
    )
  }
  catch(e) {
    if (e.response && e.response.status === 404) {
      console.info(`The "contents" directory does not exist yet`)
      shaByType = contentTypes.map(contentType => {
        return {
          type: contentType,
          sha: undefined,
          path: `contents/${contentType}`
        }
      })
    }
    else {
      throw new Error(e)
    }
  }

  return shaByType
}

async function getContentsByType(repository, branch, contentsShaByTypes) {
  const contentsByType = (await Promise.all(contentsShaByTypes.map(async contentsShaByType => {
    let contentsForType
    const typePural = `${contentsShaByType.type}s`
    try {
      const response = await repository.getContents(branch, contentsShaByType.path, true)
      contentsForType = {
        [typePural]: response.data.map(element => ({...element, type: contentsShaByType.type}))
      }
    }
    catch(e) {
      if (e.response && e.response.status === 404) {
        console.info(`The "contents" directory does not exist yet`, contentsShaByTypes)
        contentsForType = contentsShaByTypes.reduce((memo, contentsShaByType) => {
          return {
            ...memo,
            [typePural]: []
          }
        }, {})
      }
      else {
        throw new Error(e)
      }
    }
    console.log('contents:::',contentsForType)
    return contentsForType

  }))).reduce((memo, value) => {
    return {
      ...memo,
      ...value
    }
  }, {})

  return contentsByType
}

async function markIfContentPublished(repository, configuration, content) {
  let isPublished = 0
  const contentPath = configuration.urls.getGhHtmlPathFromAdoc(content.name, content.type)
  try {
    const sha = await repository.getSha(configuration.meta.branch, contentPath)
    isPublished = !!sha ? 1 : 0
  }
  catch(e) {
    if (e.response && e.response.status === 404) {
      console.info(`The file ${content.name} is not published`)
    }
    else {
      throw new Error(e)
    }
  }
  return {
    ...content,
    published: isPublished
  }
}

async function markIfContentsPublished(repository, configuration, contentsByType) {
  return await Object.keys(contentsByType).reduce(async (memo, key) => {
    let contents = _.compact(contentsByType[key])
    contents = await Promise.all(contents.map(async content => {
      return await markIfContentPublished(repository, configuration, content)
    }))
    memo[key] = contents
    return memo
  }, {})
}

async function getUserInformations(user) {
  const profile = await user.getProfile()
  return _.pick(profile, [
    'login',
    'id',
    'name',
    'location',
    'blog',
    'avatar_url',
    'bio',
  ])
}

async function getContentAuthor(repository, getUser, configuration, content, userInformations) {
  let author
  let commits
  const path = (content.original && content.original.path) || content.path
  try {
    commits = (await repository.listCommits(
      {
        sha: configuration.meta.branch,
        path,
      }
    )).data
    author = commits[commits.length - 1].author
    // Sometime author is not defined, in this case we use the authenticated user
    if (!author || author.login === userInformations.login) {
      author = Object.assign({}, userInformations)
    }
    else {
      const user = getUser(author.login)
      const userInfos = (await getUserInformations(user)).data
      author = Object.assign({}, userInfos)
    }

  }
  catch(e) {
    console.log(e)
    if (e.response && e.response.status === 404) {
      author = Object.assign({}, userInformations)
      commits = []
    }
    else {
      throw new Error(`We can't find commits for the file ${path}`)
    }
  }
  return Object.assign({}, content, { author, commits })

}

async function getContentsAuthor(repository, getUser, configuration, contentsByType, userInformations) {
  return await Object.keys(contentsByType).reduce(async (memo, key) => {
    let contents = _.compact(contentsByType[key])
    contents = await Promise.all(contents.map(async content => {
      return await getContentAuthor(repository, getUser, configuration, content, userInformations)
    }))
    memo[key] = contents
    return memo
  }, {})
}

async function readContent_(repository, configuration, contentOfType) {
  let _content
  try {
    const fileContent = (await repository.getContents(
      configuration.meta.branch,
      contentOfType.path,
      true
    )).data
    _content = {
      ...contentOfType,
      content: fileContent
    }
  }
  catch(e) {
    if (e.response && e.response.status === 404) {
      console.warn(`We can't find content for the file ${contentOfType.path}`)
      _content = contentOfType
    }
    else {
      throw new Error(`An error occurs while reading ${contentOfType.path}`)
    }
  }
  return _content
}

async function readContents(repository, configuration, contentsByType) {
  return await Object.keys(contentsByType).reduce(async (memo, key) => {
    let contents = _.compact(contentsByType[key])
    contents = await Promise.all(contents.map(async contentsOfType => {
      return await readContent_(repository, configuration, contentsOfType)
    }))
    memo[key] = contents
    return memo
  }, {})
}

async function deleteElement(repository, branch, elementPath) {
  try {
    const sha = await repository.deleteFile(branch, elementPath)
    // lastCachedCommit = sha.commit
    return sha
  }
  catch(e)
  {
    console.error(`An error occured while deleting document ${elementPath}`)
  }
}

async function moveDocumentIfNecessary(repository, configuration, document) {
  try {
    // Check if the name has  changed
    if (document.original && document.name !== document.original.name) {
      const branch = configuration.meta.branch
      const origin = document.original.path
      const dest = configuration.urls.getGhAdocPath(document.name, document.type)
      let sha = await repository.move(branch, origin, dest)
      // Remove old document because move duplicate file
      try {
        sha = await deleteElement(repository, branch, origin)
      }
      catch(e) {
        console.log(`${origin} was deleted by "move"`)
      }
      console.log('move:', sha)
      if (!document.published) {
        return {
          document,
          sha
        }
      }

      // The document is published so we remove the published content
      const oldPublishedDocumentPath = configuration.urls.getGhHtmlPathFromAdoc(
        document.original.name,
        document.original.type || document.type
      )
      console.log('move: 2', oldPublishedDocumentPath)
      sha = await deleteElement(repository, branch, oldPublishedDocumentPath)
      return {
        document,
        sha
      }
    }
    else {
      return {
        document
      }
    }
  }
  catch(e) {
    if (e.response && e.response.status === 404) {
      console.info(`The file ${document.name} was not found`)
      return {
        document
      }
    }
    else {
      throw new Error(e)
    }
  }

}

async function writeDocument(repository, configuration, document) {
  const meta = configuration.meta
  const branch = meta.branch
  const documentPath = configuration.urls.getGhAdocPath(
    document.name,
    document.type
  )
  const commitMessage = `Update ${document.name}`
  try {
    const sha = await repository.writeFile(
      branch,
      documentPath,
      document.content,
      commitMessage,
      {} // options
    )
    document.original = _.omit(document, ['original']) //Object.assign({}, document)
    document.original.url = configuration.urls.getContentUrl(document.original.name, document.original.type)
    document.original.path = configuration.urls.getGhAdocPath(
      document.original.name,
      document.original.type
    )
    document.original.sha = sha
    // lastCachedCommit = sha.commit
    // console.info('Update lastCacheCommit', lastCachedCommit)
    return document
  }
  catch(e) {
    console.info(`An error occured while writeDocument for ${document.name}`)
    throw e
  }
}

async function synchronizeAndGetContentsFromTypes(githubInstance, opts) {
  const configuration = opts.rootState.application.config
  const meta = configuration.meta
  const repository = githubInstance.getRepo(meta.username, meta.repositoryName)
  const contentTypes = opts.payload.contentTypes || []

  if (!contentTypes.length) {
    throw new Error('You must defined a contentTypes array in your payload')
  }

  const contentsShaByTypes = await getContentsShaByType(repository, meta.branch, contentTypes)
  console.log('getContentsShaByType:', contentsShaByTypes)
  let contentsByType = await getContentsByType(repository, meta.branch, contentsShaByTypes)
  console.log('getContentsByType:', contentsByType)
  contentsByType = await markIfContentsPublished(repository, configuration, contentsByType)
  console.log('markIfContentsPublished:', contentsByType)
  const userInformations = opts.rootState.authentication.userInformations
  contentsByType = await getContentsAuthor(repository, githubInstance.getUser.bind(githubInstance), configuration, contentsByType, userInformations)
  console.log('getContentsAuthor:', contentsByType)
  contentsByType = await readContents(repository, configuration, contentsByType)
  console.log('readContents', contentsByType)
  return contentsByType
}

async function saveDocument(githubInstance, opts) {
  const configuration = opts.rootState.application.config
  const meta = configuration.meta
  const repository = githubInstance.getRepo(meta.username, meta.repositoryName)
  const document = opts.payload.deck

  if (!document) {
    throw new Error('You must defined a deck in your payload')
  }

  const result = await moveDocumentIfNecessary(repository, configuration, document)
  console.log(result)
  let updatedDocument = await writeDocument(repository, configuration, result.document)
  const userInformations = opts.rootState.authentication.userInformations
  updatedDocument = await getContentAuthor(repository, githubInstance.getUser.bind(githubInstance), configuration, document, userInformations)
  return updatedDocument
}

export default {
  synchronizeAndGetContentsFromTypes,
  saveDocument,
}
