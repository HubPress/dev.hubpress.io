import React from 'react';
import Container from './Container';
import FlatButton from 'material-ui/lib/flat-button';
import IconButton from 'material-ui/lib/icon-button';
import Dialog from 'material-ui/lib/dialog';
import TopBar from './TopBar';
import Loader from './Loader';

import asciidocMode from '../utils/codemirror/mode/asciidoc';
import overlay from '../utils/codemirror/mode/overlay';
// FIXME Spellcheck not works well
//import spellcheck from '../utils/codemirror/mode/spell-checker';
import Codemirror from 'react-codemirror';
import Preview from './Preview';

import { getLocalPost, switchViewing, switchLight, renderAndLocalSave, remoteSave, publish, unpublish } from '../actions/post';
import { connect } from 'react-redux'


class Post extends React.Component {

  constructor(props, context) {
    super(props, context);
    this.content = null;
    this.handleChange = this.handleChange.bind(this);
    this.handlePublish = this.handlePublish.bind(this);
    this.handleUnpublish = this.handleUnpublish.bind(this);
    this.handleRemoteSave = this.handleRemoteSave.bind(this);
    this.handleSwitchLight = this.handleSwitchLight.bind(this);
    this.doAnimation = this.doAnimation.bind(this);
    this.getCMTheme = this.getCMTheme.bind(this);
  }

  getParams() {
    return this.props.params;
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(getLocalPost(this.getParams().postId));
  }

  componentWillUpdate(nextProps, nextState) {
    if (!this.content) {
      console.log('Post - Initial content loaded');
      this.content = nextProps.post.content;
    }
  }

  componentWillUnmount() {
    this.content = null;
  }

  handleRemoteSave() {
    const { dispatch } = this.props;
    dispatch(remoteSave(this.getParams().postId));
  }

  handlePublish() {
    const { dispatch } = this.props;
    dispatch(publish(this.getParams().postId));
  }

  handleUnpublish() {
    const { dispatch } = this.props;
    dispatch(unpublish(this.getParams().postId));
  }

  handleChange(codeValue) {
    const { dispatch } = this.props;

    if (this.timeout) {
      window.clearTimeout(this.timeout);
    }

    const config = this.props.config;
    this.timeout = window.setTimeout(() => {
      dispatch(renderAndLocalSave(this.getParams().postId, codeValue));
    }, config.meta.delay ? config.meta.delay : 200);

    this.content = codeValue;
  }

  handleSwitchLight() {
    const { dispatch } = this.props;
    dispatch(switchLight());
  }

  doAnimation() {
    const { dispatch } = this.props;
    dispatch(switchViewing());
  }

  getCMTheme() {
    return this.props.isDark?' dark':' light';
  }


  render() {

    let buttons = {
      delete: {},
      save: {},
      publish: {},
      preview: {},
      light: {}
    };

    const isTopActionsVisible = !!this.props.post.title;

    if (this.props.isViewing) {
      buttons.preview.label = 'visibility_off';
      buttons.preview.click = this.doAnimation;
    }
    else {
      buttons.preview.label = 'visibility';
      buttons.preview.click = this.doAnimation;
    }

    if (this.props.isDark) {
      buttons.light.label = 'brightness_high';
      buttons.light.click = this.handleSwitchLight;
    }
    else {
      buttons.light.label = 'brightness_low';
      buttons.light.click = this.handleSwitchLight;
    }

    if (this.props.post.published) {
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

    let viewer = "";
    if (this.props.isViewing) {
      viewer = (
        <Preview content={this.props.post.html} title={this.props.post.title} tags={this.props.post.tags} className="asciidoc-render"/>
      )

    }

    let actionDelete = ""
    let actionSave = ""
    let actionPublish = ""
    if (isTopActionsVisible) {
      actionSave = (
        <IconButton onClick={buttons.save.click} iconStyle={{color: '#fff'}} iconClassName="material-icons">{buttons.save.label}</IconButton>
      );
      actionPublish = (
        <IconButton onClick={buttons.publish.click} iconStyle={{color: '#fff'}} iconClassName="material-icons">{buttons.publish.label}</IconButton>
      )
    }

    // Options for CodeMirror
    const cmOptions = {
      autofocus: true,
      lineWrapping: true,
      lineNumbers: false,
      //mode: 'spell-checker',
      mode: 'asciidoc',
      theme: 'solarized' + (this.props.isDark?' dark':' lightt')
    }

    return (
      <div>
        <Loader loading={this.props.isFetching}></Loader>
        <TopBar ref="topbar" history={this.props.history} location={this.props.location}>
          <div style={{float: 'right'}}>
            <IconButton onClick={buttons.light.click} iconStyle={{color: '#fff'}} iconClassName="material-icons">{buttons.light.label}</IconButton>
            <IconButton onClick={buttons.preview.click} iconStyle={{color: '#fff'}} iconClassName="material-icons">{buttons.preview.label}</IconButton>
            {actionDelete}
            {actionSave}
            {actionPublish}
          </div>
        </TopBar>
        <Container>

          <div>

            <div className={this.props.isViewing ? 'container view-active' : 'container view-inactive'}>

              <Codemirror
                ref="editor"
                value={this.content}
                onChange={this.handleChange}
                options={cmOptions}
                className={'editor' + this.getCMTheme() }
                style= {{border: '1px solid black'}}/>
              {/*<CodeMirror
              mode={'spell-checker'}
              //backdrop={'asciidoc'}
              theme={'solarized dark'}
              className={'editor'}
              textAreaClassName={['form-control']}
              value={this.content}
              textAreaStyle= {{minHeight: '10em'}}
              style= {{border: '1px solid black'}}
              lineNumbers={false}
              lineWrapping={true}
              autofocus={true}
              onChange={this.handleChange}
              />*/}

            <div className="viewer" >
              {viewer}
            </div>
            </div>
          </div>

        </Container>
      </div>
    );
  }
}



const mapStateToProps = (state/*, props*/) => {
  return {
    config: state.application.config,
    isFetching: state.post.isFetching,
    post: state.post.post || {},
    isViewing: state.post.isViewing,
    isDark: state.post.isDark
  };
}

const ConnectedPost = connect(mapStateToProps)(Post)

export default ConnectedPost;
