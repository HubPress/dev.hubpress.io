import initialize from './initialize'
import authentication from './authentication'
import posts from './posts'

export default {
  ...initialize,
  ...authentication,
  ...posts
}
