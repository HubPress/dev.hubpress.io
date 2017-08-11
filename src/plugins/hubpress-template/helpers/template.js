var templates = {},
  handlebars = require('handlebars'),
  hbs = {
    handlebars: handlebars,
  }
// errors        = require('../errors'),
// i18n          = require('../i18n');

// ## Template utils
function logAndThrowError(err) {
  console.log(err)
  throw new Error(err)
}
// Execute a template helper
// All template helpers are register as partial view.
templates.execute = function(name, context, options) {
  var partial = hbs.handlebars.partials[name]

  if (partial === undefined) {
    logAndThrowError('warnings.helpers.template.templateNotFound' + name)
    return
  }

  // If the partial view is not compiled, it compiles and saves in handlebars
  if (typeof partial === 'string') {
    partial = handlebars.compile(partial)
  }

  return new hbs.handlebars.SafeString(partial(context, options))
}

module.exports = templates
