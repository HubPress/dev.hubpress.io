import paginationGenerator from './paginationGenerator';
import _ from 'lodash';
import Builder from 'hubpress-plugin-builder-ghost'
import slugify from 'hubpress-core-slugify';

export function generateAuthors (opts) {
  console.info('AuthorGenerator - generate');
  console.log('AuthorGenerator - generate', opts);
  const template = 'author';
  let posts;

  if (!Builder.isTemplateAvailable(template)) {
    return opts;
  }

  if (opts.nextState.author) {
    posts = opts.nextState.publishedPosts.filter(post => {
      return post.author.login === opts.nextState.author.login;
    });
  }
  else {
    posts = opts.nextState.publishedPosts;
  }

  let authors = _.reduce(posts, (memo, post) => {
    memo[post.author.login] = memo[post.author.login] || [];
    memo[post.author.login].push(post)
    return memo;
  }, {});


  let returnedOpts = opts;
  _.each(authors, (authorPosts, key) => {

    let authorObject = authorPosts[0].author;
    authorObject.name = authorObject.name || authorObject.login;
    authorObject.slug = key;
    // --- Required for template
    authorObject.website = authorObject.blog;
    authorObject.status = '';
    // ---
    returnedOpts = paginationGenerator.generate({opts: returnedOpts, posts: authorPosts, author: authorObject, template, path: `author/${key}/`});

  });

  return returnedOpts;
}
