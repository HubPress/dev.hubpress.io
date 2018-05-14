import _ from 'lodash';
import Builder from 'hubpress-plugin-builder-ghost'
import slugify from 'hubpress-core-slugify';;

export function generatePost (opts, post) {
  console.info('PostGenerator - generate');
  console.log('PostGenerator - generate', opts);
  const modifiedPost = post;

  const postData = Object.assign({}, modifiedPost.original);

  postData.tags = _.map(postData.tags, (tag) => {
    return {
      name: tag,
      slug: slugify(tag)
    };
  });

  const userInfos = postData.author;
  postData.author = {
    id: userInfos.id,
    name: userInfos.name || userInfos.login,
    location:userInfos.location,
    website:userInfos.blog,
    image:userInfos.avatar_url,
    profile_image:userInfos.avatar_url,
    bio: userInfos.bio,
    status: '',
    slug: userInfos.login
  };

  const config = opts.rootState.application.config;
  const urls = config.urls;
  const theme = {
    name: opts.nextState.theme.name,
    version: opts.nextState.theme.version,
    url: config.urls.theme
  };
  postData.urls = urls;
  postData.status = 'published';
  postData.feature_image = postData.image

  const template = modifiedPost.name === 'index.adoc' ? 'home' : modifiedPost.type || 'post'

  // If template Tag is not available, do not process
  if (!Builder.isTemplateAvailable(template)) {
    return opts;
  }

  const htmlContent = Builder.template(template,{
      context: modifiedPost.type || 'post',
      // site: config.site,
      // theme: theme,
      // urls: urls,
      socialnetwork: config.socialnetwork,
      relativeUrl: modifiedPost.url,
      post: postData,
      author: postData.author
    }, {
      config: config,
      theme: opts.nextState.theme
    });

  const postsToPublish = []
  postsToPublish.push({
    title: modifiedPost.title,
    image: modifiedPost.image,
    name:modifiedPost.name,
    path: config.urls.getGhHtmlPathFromAdoc(modifiedPost.name, modifiedPost.type),
    url:config.urls.getGhHtmlPathFromAdoc(modifiedPost.name, modifiedPost.type),
    content:htmlContent,
    message: `Publish ${modifiedPost.name}`,
    published_at: modifiedPost.published_at
  });

  opts.nextState.elementsToPublish = (opts.nextState.elementsToPublish || []).concat(postsToPublish);
  return opts
}
