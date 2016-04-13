import React from 'react';
import { Route, IndexRoute, Redirect, Router } from 'react-router';
import { createHistory, useBasename } from 'history';

// Components
import Hubpress from './components/Hubpress';
import { requireAuth } from './routerAuth'
// Store
let Login = require('./components/Login');
let Posts = require('./components/Posts');
let Logout = require('./components/Logout');
let Post = require('./components/Post');
let Settings = require('./components/Settings');


const history = useBasename(createHistory)({
  basename: '/'
});

const AppRoutes = (
  <Router history={history}>
    <Route path="/" component={Hubpress} >
      <IndexRoute component={Posts} onEnter={requireAuth} />
      <Route path="login" component={Login}/>
      <Route path="logout" component={Logout} onEnter={requireAuth} />
      <Route path="posts" component={Posts} onEnter={requireAuth} />
      <Route path="posts/:postId" component={Post} onEnter={requireAuth} />
      <Route path="settings" component={Settings} onEnter={requireAuth} />
    </Route>
  </Router>
);

export default AppRoutes;
