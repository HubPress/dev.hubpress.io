import { combineReducers } from 'redux'
import {application} from './application'
import {authentication} from './authentication'
import {posts} from './posts'
import {post} from './post'
import {toastr} from './toastr'

const rootReducer = combineReducers({
  application,
  authentication,
  posts,
  post,
  toastr
})

export default rootReducer
