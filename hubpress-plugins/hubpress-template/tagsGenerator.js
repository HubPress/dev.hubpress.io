import paginationGenerator from './paginationGenerator';
import _ from 'lodash';
import Builder from 'hubpress-plugin-builder-ghost'
import slugify from 'hubpress-core-slugify';;

export function generateTags (opts) {
  console.info('TagsGenerator - generate');
  console.log('TagsGenerator - generate', opts);
  const template = 'tag';
  let posts;

  // If template Tag is not available, do not process
  if (!Builder.isTemplateAvailable(template)) {
    return opts;
  }


  if (opts.nextState.post && opts.nextState.post.name && !opts.nextState.post.tags && !opts.nextState.tags ) {
    return opts;
  }

  // if (opts.nextState.post) {
  //   const originalTags = opts.nextState.post.original ? opts.nextState.post.original.tags : [];
  //   const postTags = _.union(opts.nextState.post.tags, originalTags);
  //
  //   posts = opts.nextState.publishedPosts.filter(post => {
  //     return _.intersection(postTags, post.tags).length;
  //   });
  // }
  if (opts.nextState.tags) {
    posts = opts.nextState.publishedPosts.filter(post => {
      const trimmedStateTags = opts.nextState.tags.map(v => v.trim())
      const trimmedPostTags = (post.tags || []).map(v => v.trim())
      return _.intersection(trimmedStateTags, trimmedPostTags).length;
    });
  }
  else {
    posts = opts.nextState.publishedPosts;
  }

  let tags = _.reduce(posts, (memo, post) => {
    if (!post.tags) {
      return memo;
    }

    const postsTags = _.reduce(post.tags, (memo, postTag) => {
      const slugTag = slugify(postTag);
      if (!opts.nextState.post || !opts.nextState.post.tags || opts.nextState.post.tags.indexOf(postTag) !== -1) {
        memo.push(slugTag);
      }

      return memo;
    }, []);

    _.uniq(postsTags).forEach(postTag => {
      memo[postTag] = memo[postTag] || [];
      memo[postTag].push(post);
    });

    return memo;

  }, {});

  let returnedOpts = opts;
  _.each(tags, (tag, key) => {

    let tagObject = {
      name: key,
      slug: slugify(key),
      description: null
    }
    returnedOpts = paginationGenerator.generate({opts: returnedOpts, posts: tag, tag: tagObject, template, path: `tag/${key}/`});

  });

  return returnedOpts;
}
