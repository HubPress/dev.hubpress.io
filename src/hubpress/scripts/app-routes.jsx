const React = require('react');
const Router = require('react-router');
const { Route, DefaultRoute } = Router;

// Components
import Hubpress from './components/Hubpress';
import HpWebApiUtils from './utils/HpWebApiUtils.js';
let Login = require('./components/Login');
let Posts = require('./components/Posts');
let Post = require('./components/Post');
let Settings = require('./components/Settings');


const AppRoutes = (
  <Route name="root" path="/" handler={Hubpress}>
    <Route name="login" handler={Login}/>
    <Route name="posts" path="/posts" handler={Posts} />
    <Route name="post" path="/posts/:postId" handler={Post} />
    <Route name="settings" path="/settings" handler={Settings} />

    <DefaultRoute handler={Posts}/>
  </Route>
);

export default AppRoutes;
