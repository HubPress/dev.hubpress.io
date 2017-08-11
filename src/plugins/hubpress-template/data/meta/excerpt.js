var downsize = require('downsize')

function getExcerpt(html, truncateOptions) {
  truncateOptions = truncateOptions || {}
  // Strip inline and bottom footnotes
  var excerpt = html.replace(/<a href="#fn.*?rel="footnote">.*?<\/a>/gi, '')
  excerpt = excerpt.replace(/<div class="footnotes"><ol>.*?<\/ol><\/div>/, '')
  // Strip other html
  excerpt = excerpt.replace(/<\/?[^>]+>/gi, '')
  excerpt = excerpt.replace(/(\r\n|\n|\r)+/gm, ' ')
  /*jslint regexp:false */

  if (!truncateOptions.words && !truncateOptions.characters) {
    truncateOptions.words = 50
  }

  var result = downsize(excerpt, truncateOptions)

  /* Fix CJK language */
  // TODO It's a fast workaround maybe find a better solution / 7 = average letters by words
  if (
    !truncateOptions.characters &&
    result.length > truncateOptions.words * 7
  ) {
    truncateOptions.characters = truncateOptions.words * 7
    delete truncateOptions.words
    result = downsize(excerpt, truncateOptions)
  }

  return downsize(excerpt, truncateOptions)
}

module.exports = getExcerpt
