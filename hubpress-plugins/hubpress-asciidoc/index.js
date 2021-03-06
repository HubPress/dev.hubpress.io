import asciiDoctorLib from 'asciidoctor.js'
import _ from 'lodash'
import moment from 'moment'
import slugify from 'hubpress-core-slugify' //'./utils/slugify'

const asciidoctor = asciiDoctorLib(false, window.XMLHttpRequest)
// const asciidoctor = asciidoctor(true)

function splitMore(asciidocContent) {
  let parts = asciidocContent.split('pass::[more]')
  return {
    excerpt: parts[0],
    full: parts.join(''),
  }
}

function convert(config, _asciidocContent) {
  const options = {
    doctype: 'article',
    backend: 'html5',
    //base_dir: opts.state.application.config.urls.site,
    safe: 'unsafe',
    attributes: [
      'showtitle!',
      'allow-uri-read',
      `imagesdir=${config.urls.site}/images`,
      'icons=font',
    ],
  }
  const gistRx = /gist::([0-9]*)\[(lines=[0-9]*\.\.[0-9]*)?,?(type=([\w.]*))?,?(file=([\w.]*))?\]/g
  const asciidocContent = _asciidocContent.replace(
    gistRx,
    '[source,$4]\n----\ninclude::https://gist.githubusercontent.com/raw/$1/$6[$2]\n----\n',
  )
  let parts = splitMore(asciidocContent)
  let excerpt = asciidoctor.load(parts.excerpt, options)
  let doc = asciidoctor.load(parts.full, options)
  let value = {
    attributes: doc.getAttributes(),
    excerpt: excerpt.$convert(),
    html: doc.$convert(),
  }
  return value
}

function extractTags(attributes) {
  const tagAttribute = 'hp-tags'
  return (
    attributes[tagAttribute] &&
    attributes[tagAttribute]
      .split(',')
      .map(v => v.trim())
      .filter(v => v !== '')
  )
}

function getContentUrl(config, contentType, name) {
  return config.urls.getContentUrl(name, contentType)
}

export function asciidocPlugin(context) {
  context.on('hubpress:request-rendering-documents', opts => {
    console.info('asciidocPlugin - hubpress:request-rendering-documents')
    console.log('asciidocPlugin - hubpress:request-rendering-documents', opts)

    const config = opts.rootState.application.config
    const posts = (opts.nextState.posts || []).map(post => {
      const _post = Object.assign({}, post, convert(config, post.content), {
        content: post.content,
      })

      let original = _.pick(
        _post,
        'attributes',
        'author',
        'html',
        'tags',
        'content',
        'name',
        'path',
        'sha',
      )

      _post.title = original.title = original.attributes['doctitle']
      _post.image = original.image = original.attributes['hp-image']
      _post.type = original.type = original.attributes['hp-type']
      _post.tags = original.tags = extractTags(original.attributes)
      _post.url = original.url = getContentUrl(config, _post.type, original.name)

      let _postToSave = Object.assign({}, _post, { original: original })
      if (!_post.type || _post.type === 'post') {
        _postToSave.original.published_at = _postToSave.published_at = original.name
          .split('-')
          .slice(0, 3)
          .join('-')
      }

      return _postToSave
    })

    opts.nextState.posts = posts
    return opts
  })

  context.on('requestRenderingPost', opts => {
    console.info('asciidocPlugin - requestRenderingPost')
    console.log('asciidocPlugin - requestRenderingPost', opts)
    let refreshedPost = convert(
      opts.rootState.application.config,
      opts.nextState.post.content,
    )
    opts.nextState.post = Object.assign({}, opts.nextState.post, refreshedPost)

    opts.nextState.post.title = refreshedPost.attributes['doctitle']
    opts.nextState.post.image = refreshedPost.attributes['hp-image']
    opts.nextState.post.type = refreshedPost.attributes['hp-type']
    opts.nextState.post.tags = extractTags(refreshedPost.attributes)
    opts.nextState.post.published_at =
      refreshedPost.attributes['published_at'] ||
      opts.nextState.post.published_at ||
      moment().format('YYYY-MM-DD')
    let altTitle = refreshedPost.attributes['hp-alt-title']
    if (!opts.nextState.post.type || opts.nextState.post.type === 'post') {
      opts.nextState.post.name =
        slugify(
          `${opts.nextState.post.published_at}-${(altTitle || opts.nextState.post.title)}`,
        ) + '.adoc'
    } else {
      opts.nextState.post.name =
        slugify(
          `${(altTitle || opts.nextState.post.title)}`,
        ) + '.adoc'
    }
    opts.nextState.post.url = getContentUrl(opts.rootState.application.config, opts.nextState.post.type, opts.nextState.post.name)

    return opts
  })
}
