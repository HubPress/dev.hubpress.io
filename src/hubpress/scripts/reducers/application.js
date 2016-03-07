import {
  REQUEST_CONFIG, RECEIVE_CONFIG,
  REQUEST_SAVE_CONFIG, RECEIVE_SAVE_CONFIG, RECEIVE_SAVE_CONFIG_FAIL
} from '../actions/config'
import {
  REQUEST_START, RECEIVE_START, RECEIVE_START_FAIL
} from '../actions/application'


export function application (state = {
  isInitialized: false,
  isFetching: false,
  config: {}
}, action) {

  let config;
  switch (action.type) {
    case REQUEST_START:
      return Object.assign({}, state, {
        isFetching: true
      });
    case RECEIVE_START:
      config = action.payload.config;
      config.site = config.site || {};
      config.site.url = config.urls.site;

      return Object.assign({}, state, {
        isFetching: false,
        isInitialized: true,
        config: config,
        theme: action.payload.theme,
      });
    case REQUEST_SAVE_CONFIG:
      return Object.assign({}, state, {
        isFetching: true
      });
    case RECEIVE_SAVE_CONFIG:
      config = action.payload.config;
      config.site = config.site || {};
      config.site.url = config.urls.site;
      
      return Object.assign({}, state, {
        isFetching: false,
        config: config,
        theme: action.payload.theme,
      });
    case RECEIVE_SAVE_CONFIG_FAIL:
      return Object.assign({}, state, {
        isFetching: false,
      });
    default:
      return state;
  }
};
