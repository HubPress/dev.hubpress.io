import _ from 'lodash'
import Builder from './builder'
import slugify from 'hubpress-core-slugify'

class PaginationGenerator {
  generate(params) {
    console.info('PaginationGenerator - generate')
    console.log('PaginationGenerator - generate', params)
    const posts = params.posts
    const config = params.opts.rootState.application.config
    const siteConfig = config.site || {}
    siteConfig.url = config.urls.site
    let pageCount = 1
    let pagePath = (params.path || '') + 'index.html'
    let postsPageToGenerate = []
    let postsPageToPublish = []
    let nbPostPerPage = parseInt(siteConfig.postsPerPage || 10, 10)
    const theme = {
      name: params.opts.nextState.theme.name,
      version: params.opts.nextState.version,
      url: config.urls.theme,
    }
    let urls = config.urls
    let socialnetwork = config.socialnetwork

    if (!posts || !posts.length) {
      let htmlContent = Builder.template(
        params.template,
        {
          pagination: {
            prev: 0,
            next: 0,
            page: 0,
            pages: 0,
            total: 0,
            limit: nbPostPerPage,
          },
          posts: [],
          tag: params.tag,
          author: params.author,
          // site: siteConfig,
          // theme: theme,
          // urls: urls,
          socialnetwork: socialnetwork,
          title: siteConfig.title,
        },
        {
          config: config,
          theme: params.opts.nextState.theme,
        },
      ) // _.pick(params.opts.data, ['config', 'theme']));

      postsPageToPublish.push({
        name: `page-${pageCount}`,
        path: pagePath,
        content: htmlContent,
        message: `Publish page-${pageCount} ${params.template}`,
      })

      params.opts.nextState.elementsToPublish = (params.opts.nextState
        .elementsToPublish || [])
        .concat(postsPageToPublish)
      return params.opts
    }

    let totalPage = Math.ceil(posts.length / nbPostPerPage)

    _.each(posts, (post, index) => {
      let next = 0
      let previous = 0

      if (pageCount > 1) {
        pagePath = (params.path || '') + `page/${pageCount}/index.html`
      }

      if (pageCount > 1) {
        previous = pageCount - 1
      }
      if (pageCount < totalPage) {
        next = pageCount + 1
      }

      let postTags
      if (post.tags) {
        //(post.attributes.map['hp-tags']) {
        postTags = _.map(post.tags, tag => {
          return {
            name: tag,
            slug: slugify(tag),
            description: null,
          }
        })
      }

      const author = {
        id: post.author.id,
        name: post.author.name || post.author.login,
        location: post.author.location,
        website: post.author.blog,
        image: post.author.avatar_url,
        slug: post.author.login,
      }
      postsPageToGenerate.push({
        image: post.image,
        title: post.title,
        url: siteConfig.url + post.url,
        excerpt: post.excerpt,
        html: post.excerpt,
        tags: postTags,
        published_at: post.published_at,
        // site: siteConfig,
        // theme: theme,
        // urls: urls,
        relativeUrl: siteConfig.url + post.url, // not a relative, absolute one,
        author: author,
      })

      if (
        Math.floor((index + 1) / nbPostPerPage) > pageCount - 1 ||
        index + 1 === posts.length
      ) {
        //Generate
        //
        //
        let htmlContent = Builder.template(
          params.template,
          {
            pagination: {
              prev: previous,
              next: next,
              page: pageCount,
              pages: totalPage,
              total: posts.length,
              limit: nbPostPerPage,
            },
            context:
              params.template === 'index' && previous === 0
                ? 'home'
                : params.template,
            posts: postsPageToGenerate,
            tag: params.tag,
            author: params.author,
            title: siteConfig.title,
            description: siteConfig.description,
            // site: siteConfig,
            // theme: theme,
            // urls: urls,
            socialnetwork: socialnetwork,
            relativeUrl: '',
          },
          {
            config: config,
            theme: params.opts.nextState.theme,
          },
        )

        postsPageToPublish.push({
          name: `page-${pageCount}`,
          path: pagePath,
          content: htmlContent,
          message: `Publish page-${pageCount} ${params.template}`,
        })

        postsPageToGenerate = []
        pageCount++
      }
    })

    params.opts.nextState.elementsToPublish = (params.opts.nextState
      .elementsToPublish || [])
      .concat(postsPageToPublish)
    return params.opts
  }
}

export default new PaginationGenerator()
