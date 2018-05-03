import initialize from './initialize'
import authentication from './authentication'
import posts from './posts'
import settings from './settings'

export default {
  ...initialize,
  ...authentication,
  ...posts,
  ...settings,
}
