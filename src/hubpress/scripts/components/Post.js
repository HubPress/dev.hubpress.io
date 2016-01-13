import React from 'react';
import Container from './Container';
import FlatButton from 'material-ui/lib/flat-button';
import IconButton from 'material-ui/lib/icon-button';
import Dialog from 'material-ui/lib/dialog';
import TopBar from './TopBar';
import assign from 'object-assign';
import Loader from './Loader';

import asciidocMode from '../utils/codemirror/mode/asciidoc';
import CodeMirror from 'react-code-mirror';
import AsciidocRender from './AsciidocRender';

import SettingsStore from '../stores/SettingsStore';
import PostsStore from '../stores/PostsStore';
import PostsActionCreators from '../actions/PostsActionCreators';


class Post extends React.Component {

  constructor(props, context) {
    super(props, context);
    this.state = {post: {}, asciidocContent: '', loading: true, viewActive: false};
    this._onPostsStoreChange = this._onPostsStoreChange.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handlePublish = this.handlePublish.bind(this);
    this.handleUnpublish = this.handleUnpublish.bind(this);
    this.handleRemoteSave = this.handleRemoteSave.bind(this);
    this.handleAsciidocChange = this.handleAsciidocChange.bind(this);
    this.doAnimation = this.doAnimation.bind(this);
  }

  getParams() {
    return this.props.params;
  }

  componentDidMount() {
    PostsStore.addChangeListener(this._onPostsStoreChange);
    const post = PostsStore.getPost(this.getParams().postId);
    this.setState({post: post, asciidocContent: post.content,loading: PostsStore.isLoading(), viewActive: false});
  }

  componentWillUnmount() {
    PostsStore.removeChangeListener(this._onPostsStoreChange);
  }

  _onPostsStoreChange(){
    console.log('PostsStore.isLoading()', PostsStore.isLoading());
    if (!PostsStore.isLoading()) {
      let post = PostsStore.getPost(this.getParams().postId);
      this.setState({post: post, asciidocContent: post.content, loading: PostsStore.isLoading()});

    }
    else {
      this.setState({post: this.state.post, asciidocContent: this.state.asciidocContent, loading: PostsStore.isLoading()});
    }

  }

  handleRemoteSave() {
    PostsActionCreators.remoteSave(this.getParams().postId);
    this.setState({loading: true});
  }

  handlePublish() {
    PostsActionCreators.publish(this.getParams().postId);
  }

  handleUnpublish() {
    PostsActionCreators.unpublish(this.getParams().postId);
  }

  handleChange(event) {
    const config = SettingsStore.config();
    let post = this.state.post;

    if (this.timeout) {
      window.clearTimeout(this.timeout);
    }

    this.timeout = window.setTimeout(() => {
      let content = this.state.post.content;
      this.setState({asciidocContent: content });
    }, config.meta.delay ? config.meta.delay : 200);

    post.content = event.target.value;
    this.setState({post: post});
  }

  handleAsciidocChange(postConverted, isInitialChange) {
    postConverted.title = postConverted.attributes && postConverted.attributes.map.doctitle;
    if (!PostsStore.isLoading() && postConverted.title && !isInitialChange) {
      let postToSave = assign({}, this.state.post, postConverted);
      this.postAttributes = postToSave.attributes;
      PostsActionCreators.localSave(postToSave);
    }
  }

  doAnimation() {
    this.setState({
      viewActive: !this.state.viewActive
    });
  }


  render() {

    let buttons = {
      save: {},
      publish: {},
      preview: {}
    };

    if (this.state.viewActive) {
      buttons.preview.label = 'visibility_off';
      buttons.preview.click = this.doAnimation;
    }
    else {
      buttons.preview.label = 'visibility';
      buttons.preview.click = this.doAnimation;
    }

    if (this.state.post.published) {
      buttons.publish.label = "cloud_download";
      buttons.publish.click = this.handleUnpublish;

      buttons.save.label = "save";
      buttons.save.click = this.handlePublish;
    }
    else {
      buttons.publish.label = "cloud_upload";
      buttons.publish.click = this.handlePublish;

      buttons.save.label = "save";
      buttons.save.click = this.handleRemoteSave;
    }

    const actions = [
      <FlatButton
        label="Cancel"
        secondary={true} />,
      <FlatButton
        label="Submit"
        primary={true} />,
    ];

    return (
      <div>
        <Loader loading={this.state.loading}></Loader>
        <TopBar ref="topbar" history={this.props.history} location={this.props.location}>
          <div style={{float: 'right'}}>
            <IconButton onClick={buttons.preview.click} iconStyle={{color: '#fff'}} iconClassName="material-icons">{buttons.preview.label}</IconButton>
            <IconButton onClick={buttons.save.click} iconStyle={{color: '#fff'}} iconClassName="material-icons">{buttons.save.label}</IconButton>
            <IconButton onClick={buttons.publish.click} iconStyle={{color: '#fff'}} iconClassName="material-icons">{buttons.publish.label}</IconButton>
          </div>
        </TopBar>
        <Container>

          <div>

            <div className={this.state.viewActive ? 'container view-active' : 'container view-inactive'}>

              <CodeMirror mode={'asciidoc'}
              theme={'solarized dark'}
              className={'editor'}
              textAreaClassName={['form-control']}
              value={this.state.post.content}
              textAreaStyle= {{minHeight: '10em'}}
              style= {{border: '1px solid black'}}
              lineNumbers={false}
              lineWrapping={true}
              autofocus={true}
              onChange={this.handleChange}
              />

              <div className="viewer" >
                <AsciidocRender content={this.state.asciidocContent} onChange={this.handleAsciidocChange}/>
              </div>
            </div>
          </div>

        </Container>
      </div>
    );
  }
}

export default Post;
