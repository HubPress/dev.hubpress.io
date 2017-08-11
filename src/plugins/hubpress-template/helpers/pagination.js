// ### Pagination Helper
// `{{pagination}}`
// Outputs previous and next buttons, along with info about the current page

var _ = require('lodash'),
  // errors          = require('../errors'),
  template = require('./template'),
  // i18n            = require('../i18n'),
  pagination

function logAndThrowError(err) {
  console.log(err)
  throw new Error(err)
}

pagination = function(options) {
  /*jshint unused:false*/
  if (!_.isObject(this.pagination) || _.isFunction(this.pagination)) {
    return logAndThrowError('warnings.helpers.pagination.invalidData')
  }

  if (
    _.isUndefined(this.pagination.page) ||
    _.isUndefined(this.pagination.pages) ||
    _.isUndefined(this.pagination.total) ||
    _.isUndefined(this.pagination.limit)
  ) {
    return logAndThrowError('warnings.helpers.pagination.valuesMustBeDefined')
  }

  if (
    (!_.isNull(this.pagination.next) && !_.isNumber(this.pagination.next)) ||
    (!_.isNull(this.pagination.prev) && !_.isNumber(this.pagination.prev))
  ) {
    return logAndThrowError(
      'warnings.helpers.pagination.nextPrevValuesMustBeNumeric',
    )
  }

  if (
    !_.isNumber(this.pagination.page) ||
    !_.isNumber(this.pagination.pages) ||
    !_.isNumber(this.pagination.total) ||
    !_.isNumber(this.pagination.limit)
  ) {
    return logAndThrowError('warnings.helpers.pagination.valuesMustBeNumeric')
  }

  var context = _.merge({}, this.pagination)

  if (this.tag !== undefined) {
    context.tagSlug = this.tag.slug
  }

  if (this.author !== undefined) {
    context.authorSlug = this.author.slug
  }

  return template.execute('pagination', context, options)
}

module.exports = pagination
