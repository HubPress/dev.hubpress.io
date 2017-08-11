var config = require('../../config'),
  getUrl = require('./url')

function getCanonicalUrl(data) {
  var _data

  if (data.context === 'author') {
    _data = data.author
  } else if (data.context === 'tag') {
    _data = data.tag
  } else {
    _data = data
  }

  return config.urlJoin(config.getBaseUrl(false), getUrl(_data, false))
}

module.exports = getCanonicalUrl
