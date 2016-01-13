import React from 'react';
import uuid from 'node-uuid';
import { Link } from 'react-router';
import FlatButton from 'material-ui/lib/flat-button';
import IconButton from 'material-ui/lib/icon-button';

import Paper from 'material-ui/lib/paper';
import List from 'material-ui/lib/lists/list';
import ListDivider from 'material-ui/lib/lists/list-divider';
import ToggleStar from 'material-ui/lib/svg-icons/toggle/star';
import AsciidocRender from './AsciidocRender';
import Container from './Container';
import Loader from './Loader';
import PostItem from './PostItem';
import TopBar from './TopBar';
import PostsStore from '../stores/PostsStore';

class Posts extends React.Component {

  constructor(props, context) {
    super(props, context);
    this.state = {posts: [], selectedPost: {}, loading: true};
    this._onPostsStoreChange = this._onPostsStoreChange.bind(this);
  }

  componentDidMount() {
    PostsStore.addChangeListener(this._onPostsStoreChange);
    this.setState({posts: PostsStore.getPosts(true), selectedPost: {}, loading: PostsStore.isLoading()});
  }

  componentWillUnmount() {
    PostsStore.removeChangeListener(this._onPostsStoreChange);
  }

  _onPostsStoreChange(){
    if (!PostsStore.isLoading()) {
      let selectedPost = {};

      if (PostsStore.getPosts().length) {
        selectedPost = PostsStore.getPosts()[0];
      }
      this.setState({posts: PostsStore.getPosts(), loading: PostsStore.isLoading(), selectedPost: selectedPost});
    }
    else {
      this.setState({posts: [], selectedPost: {}, loading: PostsStore.isLoading()});
    }
  }

  handleClick(post) {
    this.setState({selectedPost: post});
  }

  render() {

    let posts = this.state.posts.map(function(post, i) {
      return (
        <PostItem key={post.id} post={post} history={this.props.history} selectedPost={this.state.selectedPost} onClick={this.handleClick.bind(this)}/>
      );
    }, this);

    let newButton = (
        <Link style={{float:'right'}} to={`/posts/${uuid.v4()}`}>
          <IconButton iconStyle={{color: '#fff'}} iconClassName="material-icons">create</IconButton>
        </Link>
      );

    return (
      <div>
        <Loader loading={this.state.loading}></Loader>
        <TopBar ref="topbar" history={this.props.history} location={this.props.location}>
          {newButton}
        </TopBar>
        <Container id="posts">
          <List className="list">
            {posts}
          </List>
          <AsciidocRender content={this.state.selectedPost.content} className="asciidoc-render"/>
        </Container>
      </div>
    );
  }
}

export default Posts;
