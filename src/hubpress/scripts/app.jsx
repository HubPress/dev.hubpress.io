import AppRoutes from './app-routes';
import injectTapEventPlugin  from 'react-tap-event-plugin';
import createHistory  from 'history/lib/createHashHistory';

import React from 'react';
import { render } from 'react-dom';
import {Router} from 'react-router';
import { Provider } from 'react-redux';
import configureStore from './configureStore'
import plugins from 'hubpress-core-plugins'

//plugins
import {asciidocPlugin} from 'hubpress-plugin-asciidoc'
import {githubPlugin} from 'hubpress-plugin-github'
import {githubUrlsPlugin} from 'hubpress-plugin-github-urls'
import {pouchDbPlugin} from 'hubpress-plugin-pouchdb'
import {sessionStoragePlugin} from 'hubpress-plugin-session-storage'
import {templatePlugin} from 'hubpress-plugin-template'
import {rssPlugin} from 'hubpress-plugin-rss'


//Helpers for debugging
window.React = React;
//window.Perf = require('react-addons-perf')


plugins.register(
  githubUrlsPlugin,
  templatePlugin,
  sessionStoragePlugin,
  githubPlugin,
  pouchDbPlugin,
  asciidocPlugin,
  rssPlugin
);

let mountNode = document.getElementById("hubpress");

//Needed for onTouchTap
//Can go away when react 1.0 release
//Check this repo:
//https://github.com/zilverline/react-tap-event-plugin
injectTapEventPlugin();

/** Render the main app component. You can read more about the react-router here:
  *  https://github.com/rackt/react-router/blob/master/docs/guides/overview.md
  */

const store = configureStore()

render(
  <Provider store={store}>
    <Router
      history={createHistory({queryKey: false})}
      onUpdate={() => window.scrollTo(0, 0)}
    >
      {AppRoutes}
    </Router>
  </Provider>
, mountNode);
