import RSS from 'rss'

export function rssPlugin(hubpress) {
  hubpress.on('requestGenerateIndex', opts => {
    console.info('rssPlugin - requestGenerateIndex')
    console.log('rssPlugin - requestGenerateIndex', opts)

    const site = opts.rootState.application.config.site || {}
    const siteUrl = opts.rootState.application.config.urls.site || ''
    const posts = opts.nextState.publishedPosts.filter(post => post.type === 'post') || []

    /* lets create an rss feed */
    const feed = new RSS({
      title: site.title || '',
      description: site.description || '',
      feed_url: `${siteUrl}/rss/`,
      site_url: siteUrl,
      image_url: site.cover,
      ttl: '60',
    })

    posts.forEach(post => {
      /* loop over data and add to feed */
      feed.item({
        title: post.title,
        description: post.html,
        url: `${siteUrl}${post.url}`, // link to the item
        categories: post.tags, // optional - array of item categories
        author: post.author.name, // optional - defaults to feed author property
        date: post.published_at, // any format that js Date can parse.
      })
    })

    const xml = feed.xml()
    const feedsToPublish = []
    feedsToPublish.push({
      name: `RSS`,
      path: 'rss/index.xml',
      content: xml,
      message: `Publish rss feed`,
    })

    opts.nextState.elementsToPublish = (opts.nextState.elementsToPublish || [])
      .concat(feedsToPublish)
    return opts
  })
}
