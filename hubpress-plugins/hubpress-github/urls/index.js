function getHubpressUrl(meta, windowLocation) {
  let url = windowLocation.protocol + '//' + windowLocation.host

  if (windowLocation.hostname === 'localhost') {
    return url
  }

  if (
    windowLocation.host === `${meta.username}.github.io` ||
    windowLocation.host === `${meta.username}.github.com`
  ) {
    if (meta.branch !== 'master') {
      url = url + '/' + meta.repositoryName
    }
  } else {
    if (meta.branch !== 'master' && (!meta.cname || meta.cname === '')) {
      url = url + '/' + meta.repositoryName
    }
  }

  return url
}

function getSiteUrl(meta, addProtocol) {
  let url
  // TODO change that
  if (meta.cname && meta.cname !== '') {
    url = (addProtocol === false ? '' : 'http:') + '//' + meta.cname
  } else {
    url =
      (addProtocol === false ? '' : 'https:') + `//${meta.username}.github.io`
    if (meta.branch !== 'master') {
      url = url + '/' + meta.repositoryName
    }
  }

  return url
}

function getContentUrl(name, type) {
  let url = name.replace(
    /([\d]{4})-([\d]{2})-([\d]{2})-([\w-]*)\.adoc/,
    '/$1/$2/$3/$4.html',
  )
  if (type === 'page') {
    url = name.replace(
      /([\w-]*)\.adoc/,
      '/$1.html',
    )
  }
  return url
}

function getGhAdocPath(name, type) {
  let url
  if (type === 'page' || type === 'post') {
    url = name.replace(
      /([\w-]*)\.adoc/,
      '_posts/$1.adoc'
    )
  }
  else if (type === 'deck') {
    url = name.replace(
      /([\w-]*)\.adoc/,
      'contents/deck/$1.adoc'
    )
  }
  return url
}

function getGhHtmlPathFromAdoc(name, type) {
  let url = name.replace(
    /([\d]{4})-([\d]{2})-([\d]{2})-([\w-]*)\.adoc/,
    '$1/$2/$3/$4.html'
  )
  if (type === 'page') {
    url = name.replace(
      /([\w-]*)\.adoc/,
      '$1.html'
    )
  }
  else if (type === 'deck') {
    url = name.replace(
      /([\w-]*)\.adoc/,
      'decks/$1/index.html'
    )
  }
  console.log('getGhHtmlPathFromAdoc', name, type, url)
  return url
}

function getContentType(name) {
  if (name.match(/([\d]{4})-([\d]{2})-([\d]{2})-([\w-]*)\.adoc/)) {
    return 'post'
  }

  return 'page'
}

export default function buildUrlsFromConfig(config) {
  return {
    site: getSiteUrl(config.meta),
    hubpress: getHubpressUrl(config.meta, window.location),
    theme: getSiteUrl(config.meta, false) + `/themes/${config.theme.name}`,
    images: getSiteUrl(config.meta) + '/images',
    getContentUrl,
    getGhAdocPath,
    getGhHtmlPathFromAdoc,
    getContentType,
    getPostUrl: postName =>
      postName.replace(
        /([\d]{4})-([\d]{2})-([\d]{2})-([\w-]*)\.adoc/,
        '/$1/$2/$3/$4.html',
      ),
    getPostGhPath: postName =>
      postName.replace(
        /([\d]{4})-([\d]{2})-([\d]{2})-([\w-]*)\.adoc/,
        '$1/$2/$3/$4.html',
      ),
    getPageUrl: postName =>
      postName.replace(
        /([\w-]*)\.adoc/,
        '/$1.html',
      ),
    getPageGhPath: postName =>
      postName.replace(
        /([\w-]*)\.adoc/,
        '$1.html',
      ),
    getSiteUrl: getSiteUrl,
  }
}
