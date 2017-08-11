import asciiDoctorLib from 'asciidoctor.js';
import _ from 'lodash';
import moment from 'moment';
import slugify from 'hubpress-core-slugify';//'./utils/slugify'

const asciidoctor = asciiDoctorLib(false, window.XMLHttpRequest);
const opal = asciidoctor.Opal;
const processor = asciidoctor.Asciidoctor(true);

function splitMore(asciidocContent) {
  let parts = asciidocContent.split('pass::[more]');
  return {
    excerpt: parts[0],
    full: parts.join('')
  };
}

function convert (config, _asciidocContent) {
  const options = opal.hash({
    doctype: 'article',
    backend: 'html5',
    //base_dir: opts.state.application.config.urls.site,
    safe: 'unsafe',
    attributes: ['showtitle!', 'allow-uri-read', `imagesdir=${config.urls.site}/images`, 'icons=font']
  });
  const gistRx = /gist::([0-9]*)\[(lines=[0-9]*\.\.[0-9]*)?,?(type=([\w.]*))?,?(file=([\w.]*))?\]/g
  const asciidocContent = _asciidocContent.replace(gistRx, '[source,$4]\n----\ninclude::https://gist.githubusercontent.com/raw/$1/$6[$2]\n----\n');
  let parts = splitMore(asciidocContent);
  let excerpt = processor.$load(parts.excerpt, options);
  let doc = processor.$load(parts.full, options);
  let value = {
    attributes: _.pick(doc.attributes, ['$$smap']),
    excerpt: excerpt.$convert(),
    html: doc.$convert()
  };
  return value;
}

function extractTags (attributes) {
  const tagAttribute = 'hp-tags';
  return attributes.$$smap[tagAttribute] && attributes.$$smap[tagAttribute].split(',').map(v => v.trim()).filter(v => v !== '');
}

export function asciidocPlugin (context) {

  context.on('hubpress:request-rendering-documents', (opts) => {
    console.info('Asciidoc Plugin - hubpress:request-rendering-documents');
    console.log('hubpress:request-rendering-documents', opts);

    const config = opts.rootState.application.config
    const posts = (opts.nextState.posts || []).map((post) => {
      const _post = Object.assign({}, post, convert(config, post.content), {
        content: post.content
      });

      let original = _.pick(_post, 'attributes', 'author', 'html', 'tags', 'content', 'name', 'path', 'sha');

      _post.title = original.title = original.attributes.$$smap['doctitle'] ;
      _post.image = original.image = original.attributes.$$smap['hp-image'] ;
      _post.tags = original.tags = extractTags(original.attributes);
      _post.url = original.url = config.urls.getPostUrl(original.name);

      let _postToSave = Object.assign({}, _post, {original: original});
      _postToSave.original.published_at = _postToSave.published_at = original.name.split('-').slice(0,3).join('-');

      return _postToSave;
    });

    opts.nextState.posts = posts
    return opts
  });

  context.on('requestRenderingPost', (opts) => {
    console.info('Asciidoc Plugin - requestRenderingPost');
    console.log('requestRenderingPost', opts);
    let refreshedPost = convert(opts.rootState.application.config, opts.nextState.post.content);
    opts.nextState.post = Object.assign({}, opts.nextState.post, refreshedPost);

    opts.nextState.post.title = refreshedPost.attributes.$$smap['doctitle'];
    opts.nextState.post.image = refreshedPost.attributes.$$smap['hp-image'] ;
    opts.nextState.post.tags = extractTags(refreshedPost.attributes);
    opts.nextState.post.published_at = refreshedPost.attributes.$$smap['published_at'] || opts.nextState.post.published_at || moment().format('YYYY-MM-DD');
    let altTitle = refreshedPost.attributes.$$smap['hp-alt-title'];
    opts.nextState.post.name = slugify(opts.nextState.post.published_at + '-' + (altTitle || opts.nextState.post.title)) +'.adoc';
    opts.nextState.post.url = opts.rootState.application.config.urls.getPostUrl(opts.nextState.post.name);

    return opts
  });

}
