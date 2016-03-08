import React from 'react';
import { connect } from 'react-redux';

// Actions
import {saveConfig} from '../actions/config';

import Container from './Container';
import Loader from './Loader';
import IconButton from 'material-ui/lib/icon-button';
import TopBar from './TopBar';
import TextField from 'material-ui/lib/text-field';
import Tabs from 'material-ui/lib/tabs/tabs';
import Tab from 'material-ui/lib/tabs/tab';
import AutoComplete from 'material-ui/lib/auto-complete';

class Settings extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = this._getState();
  }

  getSiteUrl() {
    return this.props.config.urls.getSiteUrl({
      username: this.state.username,
      repositoryName: this.state.repositoryName,
      cname: this.state.cname,
      branch: this.state.branch
    });
  }

  _getState() {
    const config = this.props.config;

    return {
      // Meta
      username : config.meta.username,
      repositoryName : config.meta.repositoryName,
      branch : config.meta.branch,
      cname : config.meta.cname,
      delay : config.meta.delay,

      // site
      title: config.site && config.site.title,
      description: config.site && config.site.description,
      logo: config.site && config.site.logo,
      cover: config.site && config.site.cover,
      postsPerPage: config.site && config.site.postsPerPage,
      googleAnalytics: config.site && config.site.googleAnalytics,
      disqus: config.site && config.site.disqus,

      //socialnetwork
      email: config.socialnetwork && config.socialnetwork.email,
      twitter: config.socialnetwork && config.socialnetwork.twitter,
      googleplus: config.socialnetwork && config.socialnetwork.googleplus,
      linkedin: config.socialnetwork && config.socialnetwork.linkedin,
      github: config.socialnetwork && config.socialnetwork.github,
      facebook: config.socialnetwork && config.socialnetwork.facebook,
      flickr: config.socialnetwork && config.socialnetwork.flickr,
      pinterest: config.socialnetwork && config.socialnetwork.pinterest,
      instagram: config.socialnetwork && config.socialnetwork.instagram,

      // theme
      theme: config.theme.name
    };
  }

  _handleSubmit(event) {
    event.preventDefault();
    const settings = {
      meta: {
        username: this.state.username,
        repositoryName: this.state.repositoryName,
        branch:this.state.branch,
        cname:this.state.cname,
        delay:this.state.delay
      },
      site: {
        title: this.state.title,
        description: this.state.description,
        logo: this.state.logo,
        cover: this.state.cover,
        postsPerPage: this.state.postsPerPage,
        googleAnalytics: this.state.googleAnalytics,
        disqus: this.state.disqus
      },
      socialnetwork:{
        email: this.state.email,
        twitter: this.state.twitter,
        googleplus: this.state.googleplus,
        linkedin: this.state.linkedin,
        facebook: this.state.facebook,
        flickr: this.state.flickr,
        instagram: this.state.instagram,
        pinterest: this.state.pinterest,
        github: this.state.github
      },
      theme:{
        name: this.state.theme.toLowerCase()
      }
    };

    const { dispatch } = this.props;
    dispatch(saveConfig(settings));
  }

  linkState(context, item) {
    return {
      value: context.state[item],
      requestChange: (value) => {
        let obj = {};
        obj[item] = value;
        context.setState(obj);
      }
    };
  }

  render() {
    return (
      <div>
        <Loader loading={this.props.isFetching}></Loader>
        <TopBar ref="topbar" history={this.props.history} location={this.props.location}>
          <div style={{float: 'right'}}>
            <IconButton onClick={this._handleSubmit.bind(this)} iconStyle={{color: '#fff'}} iconClassName="material-icons">save</IconButton>
          </div>
        </TopBar>
        <Container>
          <form name="settingsForm" className="settings-form" noValidate onSubmit={this._handleSubmit.bind(this)}>

            <Tabs>
              <Tab label="Meta" >

                <div className="form-container">
                  <TextField fullWidth={true} floatingLabelText="Git UserName" disabled={true} defaultValue={this.state.username} /><br/>

                  <TextField fullWidth={true} floatingLabelText="Git Repository name"  hintText="Git Repository name" disabled={true} defaultValue={this.state.repositoryName} /><br/>

                  <TextField fullWidth={true} floatingLabelText="Git Branch"  hintText="Git Branch" disabled={true} defaultValue={this.state.branch} /><br/>

                  <TextField fullWidth={true} floatingLabelText="Blog URL" disabled={true} value={this.getSiteUrl()} /><br/>

                  <TextField fullWidth={true} floatingLabelText="Git CNAME"  hintText="Put your CNAME here" valueLink={this.linkState(this,'cname')} /><br/>

                  <TextField fullWidth={true} floatingLabelText="Live Preview Render Delay (ms)"  hintText="Default value 200" valueLink={this.linkState(this,'delay')} /><br/>
                </div>
              </Tab>
              <Tab label="Site" >
                <div className="form-container">
                  <TextField fullWidth={true} floatingLabelText="Title"  hintText="The title of your blog" valueLink={this.linkState(this,'title')} /><br/>

                  <TextField fullWidth={true} floatingLabelText="Description"  hintText="The description of your blog" valueLink={this.linkState(this,'description')} /><br/>

                  <TextField fullWidth={true} floatingLabelText="Logo"  hintText="The logo of your blog" valueLink={this.linkState(this,'logo')} /><br/>

                  <TextField fullWidth={true} floatingLabelText="Cover image"  hintText="The cover image of your blog" valueLink={this.linkState(this,'cover')} /><br/>

                  <TextField fullWidth={true} floatingLabelText="Theme"  hintText="The theme of your blog" valueLink={this.linkState(this,'theme')} /><br/>

                  <TextField fullWidth={true} floatingLabelText="Posts per page"  hintText="The number of posts per page" valueLink={this.linkState(this,'postsPerPage')} /><br/>

                  <TextField fullWidth={true} floatingLabelText="Google analytics"  hintText="Your code GA UA-XXXXXXXX-X" valueLink={this.linkState(this,'googleAnalytics')} /><br/>

                  <TextField fullWidth={true} floatingLabelText="Disqus shortname"  hintText="Your disqus shortname" valueLink={this.linkState(this,'disqus')} /><br/>
                </div>
              </Tab>

              <Tab label="Social Network" >
                <div className="form-container">
                  <TextField fullWidth={true} floatingLabelText="Email"  hintText="Your email" valueLink={this.linkState(this,'email')} /><br/>
                  <TextField fullWidth={true} floatingLabelText="Github"  hintText="Your github account" valueLink={this.linkState(this,'github')} /><br/>
                  <TextField fullWidth={true} floatingLabelText="Twitter"  hintText="Your twitter account" valueLink={this.linkState(this,'twitter')} /><br/>
                  <TextField fullWidth={true} floatingLabelText="Facebook"  hintText="Your facebook account" valueLink={this.linkState(this,'facebook')} /><br/>
                  <TextField fullWidth={true} floatingLabelText="Google+"  hintText="Your google+ account" valueLink={this.linkState(this,'googleplus')} /><br/>
                  <TextField fullWidth={true} floatingLabelText="Instagram"  hintText="Your instagram account" valueLink={this.linkState(this,'instagram')} /><br/>
                  <TextField fullWidth={true} floatingLabelText="Pinterest"  hintText="Your pinterest account" valueLink={this.linkState(this,'pinterest')} /><br/>
                  <TextField fullWidth={true} floatingLabelText="Flickr"  hintText="Your flickr account" valueLink={this.linkState(this,'flickr')} /><br/>
                  <TextField fullWidth={true} floatingLabelText="LinkedIn"  hintText="Your linkedIn account" valueLink={this.linkState(this,'linkedin')} /><br/>
                </div>
              </Tab>
            </Tabs>
          </form>
        </Container>
      </div>
    );
  }
}

const mapStateToProps = (state/*, props*/) => {
  return {
    config: state.application.config,
    isFetching: state.application.isFetching,
  };
}

const ConnectedSettings = connect(mapStateToProps)(Settings)

export default ConnectedSettings;
