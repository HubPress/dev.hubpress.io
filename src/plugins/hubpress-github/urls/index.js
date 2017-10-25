function getHubpressUrl(meta, windowLocation) {
  let url = windowLocation.protocol + '//' + windowLocation.host

  if (windowLocation.hostname === 'localhost') {
    console.log('Local development')
    return url
  }

  if (
    windowLocation.host === `${meta.username}.github.io` ||
    windowLocation.host === `${meta.username}.github.com`
  ) {
    if (meta.branch !== 'master' || windowLocation.host !== meta.repositoryName) {
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
    if (meta.branch !== 'master' || windowLocation.host !== meta.repositoryName) {
      url = url + '/' + meta.repositoryName
    }
  }

  return url
}

export default function buildUrlsFromConfig(config) {
  return {
    site: getSiteUrl(config.meta),
    hubpress: getHubpressUrl(config.meta, window.location),
    theme: getSiteUrl(config.meta, false) + `/themes/${config.theme.name}`,
    images: getSiteUrl(config.meta) + '/images',
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
    getSiteUrl: getSiteUrl,
  }
}
