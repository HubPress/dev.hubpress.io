import paginationGenerator from './paginationGenerator';
import Builder from 'hubpress-plugin-builder-ghost'
import { generatePost } from './postGenerator';

export function generatePosts (opts) {
  console.info('PostsGenerator - generate');
  console.log('PostsGenerator - generate', opts);
  let postsToPublish = [];

  let postPromises = [];
  let returnedOpts = opts;
  opts.nextState.publishedPosts.forEach(post => {
    returnedOpts = generatePost(returnedOpts, post);
  })
  return returnedOpts;
}
