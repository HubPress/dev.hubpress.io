import paginationGenerator from './paginationGenerator';
import Builder from 'hubpress-plugin-builder-ghost'
import { generatePost } from './postGenerator';

export function generatePages (opts) {
  console.info('PagesGenerator - generate');
  console.log('PagesGenerator - generate', opts);
  let returnedOpts = opts;
  opts.nextState.publishedPages.forEach(page => {
    returnedOpts = generatePost(returnedOpts, page);
  })
  return returnedOpts;
}
