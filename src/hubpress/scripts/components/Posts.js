import React from 'react';
import uuid from 'node-uuid';
import { Link } from 'react-router';

import FlatButton from 'material-ui/lib/flat-button';
import IconButton from 'material-ui/lib/icon-button';
import Paper from 'material-ui/lib/paper';
import List from 'material-ui/lib/lists/list';
import ListDivider from 'material-ui/lib/lists/list-divider';
import ToggleStar from 'material-ui/lib/svg-icons/toggle/star';
import Preview from './Preview';
import Container from './Container';
import Loader from './Loader';
import PostItem from './PostItem';
import TopBar from './TopBar';

import { getLocalPosts, getSelectedPost } from '../actions/posts';
import { deletePost } from '../actions/post';
import { connect } from 'react-redux'

class Posts extends React.Component {

  constructor(props, context) {
    super(props, context);
    this.handleDeleteClick = this.handleDeleteClick.bind(this);
  }

  componentDidMount() {
    const { dispatch } = this.props;
    // fetch configuration
    dispatch(getLocalPosts());
  }

  handleClick(post) {
    const { dispatch } = this.props;
    dispatch(getSelectedPost(post._id));
  }

  handleEditClick(idPost) {
    return this.history.pushState(null, `/posts/${idPost}`);
  }

  handleDeleteClick(idPost) {
    const { dispatch } = this.props;
    dispatch(deletePost(idPost))
  }

  render() {

    let posts = this.props.posts.map(function(post, i) {
      return (
        <PostItem key={post._id} post={post} history={this.props.history} selectedPost={this.props.selectedPost} onClick={this.handleClick.bind(this)} handleEditClick={this.handleEditClick} handleDeleteClick={this.handleDeleteClick}/>
      );
    }, this);

    let newButton = (
        <Link style={{float:'right'}} to={`/posts/${uuid.v4()}`}>
          <IconButton iconStyle={{color: '#fff'}} iconClassName="material-icons">create</IconButton>
        </Link>
      );

    let preview = ""
    if (!!this.props.selectedPost.title) {
      preview = (
        <Preview content={this.props.selectedPost.html} title={this.props.selectedPost.title} tags={this.props.selectedPost.tags} className="asciidoc-render"/>
      )
    }

    return (
      <div>
        <Loader loading={this.props.isFetching}></Loader>
        <TopBar ref="topbar" history={this.props.history} location={this.props.location}>
          {newButton}
        </TopBar>
        <Container id="posts">
          <List className="list">
            {posts}
          </List>
          {preview}

        </Container>
      </div>
    );
  }
}

const mapStateToProps = (state/*, props*/) => {
  return {
    isFetching: state.posts.isFetching,
    posts: state.posts.posts,
    selectedPost: state.posts.selectedPost || {}
  };
}

const ConnectedPosts = connect(mapStateToProps)(Posts)

export default ConnectedPosts;
