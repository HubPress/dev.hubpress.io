import AppRoutes from './app-routes';
import HpWebApiUtils from './utils/HpWebApiUtils';

import React from 'react';
import { render } from 'react-dom';
import {Router} from 'react-router';
const injectTapEventPlugin = require('react-tap-event-plugin');
const createHistory = require('history/lib/createHashHistory');


//Helpers for debugging
window.React = React;
//window.Perf = require('react-addons-perf');


let mountNode = document.getElementById("hubpress");

//Needed for onTouchTap
//Can go away when react 1.0 release
//Check this repo:
//https://github.com/zilverline/react-tap-event-plugin
injectTapEventPlugin();

HpWebApiUtils.getConfig();
/** Render the main app component. You can read more about the react-router here:
  *  https://github.com/rackt/react-router/blob/master/docs/guides/overview.md
  */

render(
  <Router
    history={createHistory({queryKey: false})}
    onUpdate={() => window.scrollTo(0, 0)}
  >
    {AppRoutes}
  </Router>
, mountNode);
