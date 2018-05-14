import asciiDoctorLib from 'asciidoctor.js'
import _ from 'lodash'
import moment from 'moment'
import slugify from 'hubpress-core-slugify' //'./utils/slugify'

const asciidoctor = asciiDoctorLib(false, window.XMLHttpRequest)
require('asciidoctor-reveal.js')
// const asciidoctor = asciidoctor(true)

function splitMore(asciidocContent) {
  let parts = asciidocContent.split('pass::[more]')
  return {
    excerpt: parts[0],
    full: parts.join(''),
  }
}

function convert(config, _asciidocContent, options =  {
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
}) {

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


function convertDecks(config, _asciidocContent, options) {

  let doc = asciidoctor.load(_asciidocContent, options)
  const attributes = doc.getAttributes()
  console.log('doc:', doc)
  const deckonfString = attributes['hp-deckonf'] || ''
  const deckonf = deckonfString.split(',')
  deckonf.unshift('default')

  const convertedDecks = deckonf
  .map(conf => conf.trim())
  .map(conf => {
    const _attributes = options.attributes.slice(0)
    let altTitle = _attributes['hp-alt-title']
    _attributes.name =  slugify(
        `${(altTitle || _attributes['doctitle'])}`,
      ) + '.adoc'

    if (conf !== 'default') {
      _attributes.push(`revealjs_customtheme=${config.urls.site}/decks/${_attributes.name}`)
    }
    const _options = {...options}
    _options.attributes = _attributes
    const value = convert(config, _asciidocContent, _options)
    value.name = conf
    return value
  })

  return {
    docAttributes: attributes,
    convertedDecks
  }
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
    const documents = (opts.payload.documents || []).map(document => {
      const _document = Object.assign({}, document, convert(config, document.content), {
        content: document.content,
      })

      let original = _.pick(
        _document,
        'attributes',
        'author',
        'html',
        'tags',
        'content',
        'name',
        'path',
        'sha',
        'type',
      )

      _document.title = original.title = original.attributes['doctitle']
      _document.image = original.image = original.attributes['hp-image']
      _document.type = original.type = original.attributes['hp-type'] || document.type
      _document.tags = original.tags = extractTags(original.attributes)
      _document.url = original.url = getContentUrl(config, _document.type, original.name)

      let _documentToSave = Object.assign({}, _document, { original: original })
      if (!_document.type || _document.type === 'post') {
        _documentToSave.original.published_at = _documentToSave.published_at = original.name
          .split('-')
          .slice(0, 3)
          .join('-')
      }

      return _documentToSave
    })

    opts.nextState.posts = documents
    return opts
  })

  context.on('deck:request-rendering-documents', opts => {
    console.info('asciidocPlugin - deck:request-rendering-documents')
    console.log('asciidocPlugin - deck:request-rendering-documents', opts)

    const config = opts.rootState.application.config
    const options = {
      backend: 'revealjs',
      doctype: 'article',
      safe: 'unsafe',
      header_footer: true,
      attributes: [
        'revealjsdir=https://cdnjs.cloudflare.com/ajax/libs/reveal.js/3.6.0',
        'allow-uri-read',
        `imagesdir=${config.urls.site}/images`,
        'icons=font',
      ],
    }

    const documents = (opts.payload.documents || []).map(document => {
      const _document = Object.assign({}, document, convert(config, document.content, options), {
        content: document.content,
      })

      let original = _.pick(
        _document,
        'attributes',
        'author',
        'html',
        'tags',
        'content',
        'name',
        'path',
        'sha',
        'type',
      )

      _document.title = original.title = original.attributes['doctitle']
      _document.image = original.image = original.attributes['hp-image']
      _document.type = original.type = original.attributes['hp-type']
      _document.tags = original.tags = extractTags(original.attributes)
      _document.url = original.url = getContentUrl(config, _document.type, original.name)

      let _documentToSave = Object.assign({}, _document, { original: original })
      if (!_document.type || _document.type === 'post') {
        _documentToSave.original.published_at = _documentToSave.published_at = original.name
          .split('-')
          .slice(0, 3)
          .join('-')
      }

      return _documentToSave
    })

    opts.nextState.decks = documents
    return opts
  })

  context.on('requestRenderingPost', opts => {
    console.info('asciidocPlugin - requestRenderingPost')
    console.log('asciidocPlugin - requestRenderingPost', opts)
    let refreshedDeck = convert(
      opts.rootState.application.config,
      opts.nextState.post.content,
    )
    opts.nextState.post = Object.assign({}, opts.nextState.post, refreshedDeck)

    opts.nextState.post.title = refreshedDeck.attributes['doctitle']
    opts.nextState.post.image = refreshedDeck.attributes['hp-image']
    opts.nextState.post.type = refreshedDeck.attributes['hp-type']
    opts.nextState.post.tags = extractTags(refreshedDeck.attributes)
    opts.nextState.post.published_at =
      refreshedDeck.attributes['published_at'] ||
      opts.nextState.post.published_at ||
      moment().format('YYYY-MM-DD')
    let altTitle = refreshedDeck.attributes['hp-alt-title']
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

  context.on('deck:request-rendering-deck', opts => {
    console.info('asciidocPlugin - deck:request-rendering-deck')
    console.log('asciidocPlugin - deck:request-rendering-deck', opts)
    const config = opts.rootState.application.config
    const options = {
      backend: 'revealjs',
      doctype: 'article',
      safe: 'unsafe',
      header_footer: true,
      attributes: [
        'revealjsdir=https://cdnjs.cloudflare.com/ajax/libs/reveal.js/3.6.0',
        'allow-uri-read',
        `imagesdir=${config.urls.site}/images`,
        'icons=font',
      ],
    }

    // const convertedDecks = convertDecks(
    //   config,
    //   opts.payload.deck.content,
    //   options,
    // )

    // console.log('convertedDecks:', convertedDecks)

    let refreshedDeck
    if (opts.payload.loadOnly) {
      const loaded = asciidoctor.load(opts.payload.deck.content, options)
      refreshedDeck = {
        attributes: loaded.getAttributes(),
        content: opts.payload.deck.content
      }
      console.log('refreshedDeck:', refreshedDeck)
    }
    else {
      refreshedDeck = convert(
        config,
        opts.payload.deck.content,
        options,
      )
    }

    opts.nextState.deck = Object.assign({}, opts.nextState.deck, refreshedDeck)

    opts.nextState.deck.title = refreshedDeck.attributes['doctitle']
    opts.nextState.deck.image = refreshedDeck.attributes['hp-image']
    opts.nextState.deck.type = refreshedDeck.attributes['hp-type']
    opts.nextState.deck.tags = extractTags(refreshedDeck.attributes)
    opts.nextState.deck.published_at =
      refreshedDeck.attributes['published_at'] ||
      opts.nextState.deck.published_at ||
      moment().format('YYYY-MM-DD')
    let altTitle = refreshedDeck.attributes['hp-alt-title']
    opts.nextState.deck.name =
      slugify(
        `${(altTitle || opts.nextState.deck.title)}`,
      ) + '.adoc'

    opts.nextState.deck.url = getContentUrl(opts.rootState.application.config, opts.nextState.deck.type, opts.nextState.deck.name)

    return opts
  })
}
