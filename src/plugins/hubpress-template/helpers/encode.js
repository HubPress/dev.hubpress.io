// # Encode Helper
//
// Usage:  `{{encode uri}}`
//
// Returns URI encoded string

var handlebars = require('handlebars'),
  hbs = {
    handlebars: handlebars,
  },
  encode

encode = function(context, str) {
  var uri = context || str
  return new hbs.handlebars.SafeString(encodeURIComponent(uri))
}

module.exports = encode
