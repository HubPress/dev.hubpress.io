import paginationGenerator from './paginationGenerator'

export function generateIndex(opts) {
  return paginationGenerator.generate({
    opts,
    posts: opts.nextState.publishedPosts,
    template: 'index',
    path: '',
  })
}
