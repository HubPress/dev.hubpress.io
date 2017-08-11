import config from '../config'

function getActiveThemePaths(activeTheme) {
  return config.activeTheme.url
}

function getSingleTemplateHierarchy(single) {
  var templateList = ['post'],
    type = 'post'

  if (single.page) {
    templateList.unshift('page')
    type = 'page'
  }

  templateList.unshift(type + '-' + single.slug)

  return templateList
}

function pickTemplate(themePaths, templateList) {
  var template = _.find(templateList, function(template) {
    return themePaths.hasOwnProperty(template + '.hbs')
  })

  if (!template) {
    template = templateList[templateList.length - 1]
  }

  return template
}

function getTemplateForSingle(activeTheme, single) {
  return pickTemplate(
    getActiveThemePaths(activeTheme),
    getSingleTemplateHierarchy(single),
  )
}

module.exports = {
  single: getTemplateForSingle,
}
